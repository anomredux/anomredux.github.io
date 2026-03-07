---
title: "Macenko Stain Normalization을 2.82배 빠르게: lstsq 제거와 Sampled Percentile"
date: 2026-03-07
description: "PyTorch Macenko 구현에서 lstsq → pinv 교체와 sampled percentile 근사로 3.24ms → 1.15ms를 달성한 최적화 과정을 공유한다."
category: case
tags:
  - pytorch
  - pathology
  - performance
draft: false
featured: false
---

행렬 분해를 의심하고 시작했는데, 진짜 병목은 매 이미지마다 262K 픽셀을 정렬하는 `kthvalue`였다.

## TL;DR

- `torch.linalg.lstsq` → `pinv` 교체로 품질 손실 없이 5% 향상
- kthvalue를 10% 랜덤 샘플링으로 근사하여 2.59배 추가 향상
- 총 결과: 3.24ms → 1.15ms (2.82×), p99 pixel diff 1.15 (uint8 기준 0.4% 오차)

## Problem & Constraints

512×512 H&E 패치에 Macenko stain normalization을 적용하는 순수 PyTorch 구현의 latency를 측정했다. Baseline은 3.24ms/img이다.

프로파일링으로 병목 두 곳을 확인했다.

| Step | 연산 |
|------|------|
| lstsq | `torch.linalg.lstsq` (3×2 solve, 262K RHS) |
| percentile × 4 | `kthvalue` (262K elements 정렬, 4회) |

## Approach & Trade-offs

### lstsq → pinv

`torch.linalg.lstsq`는 QR 분해 기반이라 3×2 소형 행렬에도 kernel launch overhead가 붙는다. Pseudo-inverse를 미리 계산하면 행렬 곱 한 번으로 대체된다.

```python
# Before
C = torch.linalg.lstsq(HE, OD.T).solution

# After
C = torch.linalg.pinv(HE) @ OD.T
```

결과는 bit-identical(pixel diff = 0.000)이고 512×512에서 5% 향상에 그쳤다. 1024×1024에서는 lstsq가 7596ms로 극단적으로 느리지만, 512×512는 픽셀 수가 1/4이라 overhead 비율이 줄어든다(3.24 → 3.08ms).

### kthvalue → Sampled Percentile

전체 262K 픽셀을 정렬하는 대신, 랜덤 샘플링으로 percentile을 근사한다.

```python
def _percentile_sampled(t, q, ratio=0.1):
    if ratio >= 1.0:
        return _percentile_kth(t, q)  # exact fallback
    n = max(1, int(t.numel() * ratio))
    idx = torch.randint(0, t.numel(), (n,), device=t.device)
    sample = t.view(-1)[idx]
    k = 1 + round(0.01 * q * (n - 1))
    return sample.kthvalue(k).values
```

`ratio >= 1.0`에서 exact path로 fallback하는 이유가 있다. `torch.randint`는 중복 허용 샘플링이라 ratio=1.0이어도 실제 커버리지는 ~63%(1-1/e)에 그친다. 경계값에서 exact path를 써야 diff = 0을 보장한다.

### batchOD — 이미지 크기에 따라 결과가 갈리는 최적화

RGB→OD 변환 시 reshape 순서를 바꿔 메모리 레이아웃을 조정한다.

```python
# Before (baseline)
I = I.permute(1, 2, 0)
OD = -torch.log((I.reshape(-1, 3).float() + 1) / Io)

# After (batchOD)
OD = -torch.log((I.reshape(3, -1).T.float() + 1) / Io)
```

| | 1024×1024 | 512×512 |
|---|:---------:|:-------:|
| pinv + sampling 10% | 2.18ms | 1.19ms |
| + batchOD | 2.46ms (+13%) | **1.15ms (−3%)** |

1024×1024에서는 `I.reshape(3,-1).T`가 PyTorch contiguous memory 최적화와 충돌해 13% 느려진다. 512×512에서는 텐서 크기가 1/4로 작아 동일한 변경이 3% 빠르다. 이득이 크기에 따라 역전되고 절대량도 미미해서 코드 복잡도 대비 채택하지 않았다.

## Results

### Sampling Ratio Sweep

pinv + sampled percentile 조합에서 ratio를 1%–100%로 변화시켰다(1024장, A6000).

| Sampling Ratio | ms/img (mean±std) | p50 | p95 | p99 |
|:--------------:|:-----------------:|:---:|:---:|:---:|
| 1% | 1.20 ± 0.14 | 1.090 | 2.689 | 3.773 |
| 5% | 1.14 ± 0.08 | 0.489 | 1.257 | 1.854 |
| **10%** | **1.17 ± 0.11** | **0.352** | **0.840** | **1.131** |
| 20% | 1.30 ± 0.06 | 0.237 | 0.596 | 0.833 |
| 30% | 1.51 ± 0.10 | 0.197 | 0.479 | 0.705 |
| 40% | 1.79 ± 0.16 | 0.165 | 0.423 | 0.595 |
| 50% | 2.03 ± 0.19 | 0.150 | 0.378 | 0.540 |
| 60% | 2.33 ± 0.23 | 0.134 | 0.364 | 0.556 |
| 70% | 2.59 ± 0.29 | 0.126 | 0.327 | 0.475 |
| 80% | 2.87 ± 0.34 | 0.115 | 0.301 | 0.423 |
| 90% | 3.15 ± 0.35 | 0.107 | 0.292 | 0.472 |
| 100%* | 3.07 ± 0.39 | 0.000 | 0.000 | 0.000 |

\* ratio=100%는 `ratio >= 1.0` 조건으로 exact `kthvalue`에 fallback하므로 diff = 0.

![Sampling Ratio Sweep](/images/blog/macenko_ratio_sweep.png)

1–10% 구간에서 latency가 ~1.1ms로 거의 평탄한 이유는 kthvalue 감소분이 sampling 비용을 압도하기 때문이다. 10%를 넘으면 선형으로 증가한다.

100%가 90%보다 빠른 이유도 같은 원리다. 90%는 `torch.randint`로 ~236K 인덱스 생성 + gather + `kthvalue(236K)`를 수행하지만, 100%는 exact path로 원본 텐서에 `kthvalue(262K)`만 호출한다. randint + gather 오버헤드가 kthvalue 원소 수 차이(26K)보다 크다.

**10%가 최적 지점**이다: 1.17ms, p99 1.13 pixel(uint8 기준 0.4% 오차). 1%는 p99 = 3.77로 worst-case 오차가 크다. 5% 이상을 사용해야 한다.

### Cumulative Ablation

| Variant | 설명 | ms/img | Speedup | p99 |
|:-------:|:-----|:------:|:-------:|:---:|
| A | Baseline (lstsq + exact kth) | 3.24 ± 0.37 | 1× | 0.000 |
| B | + pinv | 3.08 ± 0.38 | 1.05× | 0.000 |
| C | + pinv + sampling 10% | 1.19 ± 0.12 | 2.72× | 1.240 |
| **D** | **+ pinv + sampling 10% + batchOD** | **1.15 ± 0.07** | **2.82×** | **1.153** |

pinv 단독(A→B)은 5% 개선에 그친다. sampling 추가(B→C)에서 2.59배 추가 향상이 나오고, batchOD(C→D)가 3% 추가 개선과 함께 분산을 std 0.12 → 0.07로 낮춘다.

| | Baseline | Optimized |
|---|---------|-----------|
| ms/img | 3.24ms | **1.15ms** |
| img/sec | ~309 | **~870** |
| p99 pixel diff | — | 1.15 |

## Lessons Learned

**kthvalue가 진짜 병목이었다.** lstsq(행렬 분해)를 먼저 의심했지만, 512×512에서는 3×2 행렬 solve보다 262K 픽셀 정렬 × 4회가 훨씬 비쌌다. 프로파일링 없이 직관으로 순서를 정했다면 5% 개선에서 멈췄을 것이다.

**batchOD는 이미지 크기에 따라 결과가 갈렸다.** 1024×1024에서는 13% 느려졌지만, 512×512에서는 3% 빨라졌다. 동일한 reshape 변경이 반대 결과를 낸다. 이미지 크기가 바뀌면 재측정이 필요하다.

**1% sampling은 불안정하다.** 262K → 2.6K 샘플로 줄어들면 percentile 추정이 outlier에 취약해진다. worst-case p99가 3.77 pixel까지 올랐다. 5%가 안전한 하한이다.

## Takeaways

- p99 < 2 pixel을 허용한다면 `sample_ratio=0.1`이 최적이다 (1.15ms, p99 1.15)
- exact가 필요하다면 sampling 없이 3.08ms, pixel diff = 0
- `torch.linalg.eigh`는 CUDA에서 float32/float64만 지원한다. FP16은 쓸 수 없고, 1.15ms/img로 충분하므로 mixed precision을 도입할 이유가 없다
- 정렬 기반 통계(`kthvalue`, `quantile`)가 병목이면, 10% 샘플링으로 원소 수를 줄이는 것이 가장 직접적인 해결책이다