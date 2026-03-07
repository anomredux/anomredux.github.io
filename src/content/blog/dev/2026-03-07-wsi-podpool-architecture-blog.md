---
title: "WSI 병리 추론 서버에서 Podpool 패턴을 선택한 이유"
date: 2026-03-07
description: "WSI batch inference에서 GPU를 1요청:1GPU로 할당하는 podpool 방식과 LB 기반 분산 방식을 비교하고, podpool을 선택한 근거를 정리한다."
category: case
tags:
  - inference
  - gpu-scheduling
  - triton
draft: false
featured: false
---

# WSI 병리 추론 서버에서 Podpool 패턴을 선택한 이유

Slide 하나에서 patch가 수만 개 나온다. 이걸 여러 GPU에 뿌릴 것인가, 한 GPU에 몰아줄 것인가. 우리는 후자를 택했다.

## TL;DR

- WSI 추론은 slide 단위로 결과를 합산해야 하므로, 한 slide의 모든 batch를 단일 GPU에서 처리하는 podpool 방식이 결과 수집과 장애 복구를 단순하게 만든다.
- Triton은 단일 GPU에서 request를 serial하게 처리한다. 분산해도 GPU당 throughput은 동일하다. 시스템 전체 처리량에 차이가 없다.
- 온프레미스에서 개발하되 클라우드 확장을 염두에 두고 있으며, podpool은 scale-to-zero 및 Spot instance와 잘 맞는 구조다.

## 문제와 제약 조건

WSI(Whole Slide Image)는 gigapixel 단위의 병리 이미지다. 하나의 slide를 256x256 patch로 자르면 수천에서 수만 개의 patch가 생긴다. 이 patch들을 batch 단위로 묶어 GPU inference server에 보내고, 모든 patch의 결과를 합산해야 slide-level 진단 결과가 나온다.

현재 시스템은 Go 기반 서버가 WSI 전처리(tissue masking, patching)와 job scheduling을 담당하고, Triton Inference Server가 TensorRT model로 추론을 수행한다. GPU당 Triton pod 하나가 뜨는 구조다.

설계 시 고려한 제약 조건은 다음과 같다.

**Workload 특성:** slide 하나의 처리 시간이 수 분에서 수십 분이다. 요청은 야간에 집중된다. 사용자들이 WSI 여러 개를 걸어놓고 퇴근하면, 밤 사이에 burst로 처리된다. 낮에는 거의 유휴 상태다.

**인프라 제약:** 현재 온프레미스로 개발 중이지만, AWS나 GCP로의 클라우드 확장 가능성이 높다. 처음부터 클라우드 환경에서도 잘 동작하는 패턴으로 설계해야 한다.

**결과 정합성:** 병리 추론 결과는 patch 단위의 정확성이 중요하다. 결과 누락이나 순서 오류는 진단에 직접 영향을 미친다.

## 후보 방식과 Trade-off

두 가지 GPU 할당 전략을 검토했다.

**방식 A — Podpool (1요청:1GPU):** slide 하나에 대한 추론 요청이 들어오면, pool에서 GPU 하나를 할당받는다. 해당 GPU에서 그 slide의 모든 batch를 순차 처리한 뒤 GPU를 반환한다.

**방식 B — 분산 (Round-Robin / Istio LB):** 모든 Triton pod 앞에 load balancer를 두고, batch를 여러 GPU에 나누어 보낸다. 한 slide의 batch가 여러 GPU에 걸친다.

아래 일곱 가지 기준으로 비교했다.

### Throughput: 차이 없다

이론적으로 방식 B는 한 slide의 batch를 여러 GPU에 나누어 단일 WSI의 처리 시간을 줄일 수 있다. 하지만 Triton은 단일 GPU에서 request를 serial하게 처리한다. Dynamic batching이 batch 내부의 병렬화를 담당하지만, 여러 batch를 하나의 GPU에서 동시에 실행하지는 않는다. GPU당 throughput이 동일한 이상, 한 slide의 batch를 한 GPU에 몰아주든 여러 GPU에 나누든 시스템 전체 처리량은 같다.

방식 B에서 단일 WSI latency를 줄이려면 Go server가 fan-out/fan-in을 해야 한다. 여러 pod에 gRPC connection을 관리하고, 결과를 batch index 기준으로 재정렬해야 한다. 이 오버헤드가 분산으로 얻는 이득을 상쇄한다.

동시 요청이 GPU 수 이상으로 들어오는 야간 burst 시간대에는 양쪽 방식 모두 GPU가 포화 상태이므로 throughput 차이가 없다.

### 결과 수집: podpool이 단순하다

Podpool에서는 한 slide의 모든 결과가 단일 Triton pod에서 돌아온다. Go server가 sequential하게 수집하면 끝난다.

분산 방식에서는 한 slide의 batch 결과가 여러 pod에서 비동기로 반환된다. Go server에서 fan-in 수집과 batch index 기반 ordering을 구현해야 한다. 부분 실패 시 어떤 pod에서 어떤 batch가 실패했는지 추적하고, 해당 batch만 재시도해야 한다.

WSI 결과 합산에서 patch 하나라도 누락되면 진단 결과가 달라질 수 있다. 결과 수집 로직이 단순할수록 오류 가능성이 낮다.

### 격리성: podpool이 예측 가능하다

Podpool에서는 사용자 A의 대형 WSI가 사용자 B의 소형 WSI 처리에 영향을 주지 않는다. 각 GPU에 하나의 요청만 처리되므로 GPU memory contention이 없다.

분산 방식에서는 여러 사용자의 request가 같은 GPU의 Triton 내부 queue에서 경합한다. 대형 WSI의 대량 batch가 queue를 점유하면 다른 사용자의 batch가 밀린다. NVIDIA MPS를 사용해도 multi-process 간 context switching에서 수백 ms 수준의 overhead가 발생한다는 연구 결과가 있다.

### 장애 대응: podpool의 blast radius가 작다

Podpool에서 특정 GPU에 장애가 발생하면, 영향 범위는 "해당 GPU에서 처리 중이던 slide 1개"다. 그 slide만 재시도하면 된다.

분산 방식에서 특정 GPU에 장애가 발생하면, "그 GPU에 분배된 여러 slide의 일부 batch"가 영향을 받는다. 어떤 slide의 어떤 batch가 해당 GPU에 있었는지 추적해야 한다. Distributed tracing 없이는 디버깅이 어렵다.

### 운영 복잡도: 이미 Job server가 하고 있다

Go 기반 Job server가 이미 job scheduling, podpool 관리, 결과 합산을 담당한다. Podpool 방식은 추가 인프라가 필요 없다.

분산 방식으로 전환하면 Istio service mesh, LB 정책 튜닝, distributed result collector를 새로 구성해야 한다. 검증된 Job server의 로직을 버리고, 더 복잡한 새 코드를 작성하는 셈이다.

### GPU 활용률: 실제 차이는 제한적이다

Podpool의 약점은 동시 요청 수가 GPU 수보다 적을 때 일부 GPU가 유휴 상태가 되는 것이다. 분산 방식은 모든 GPU가 항상 request를 받을 수 있으므로 이론적 활용률이 높다.

하지만 Triton이 단일 GPU에서 request를 serial하게 처리하는 이상, 분산 방식에서도 GPU당 처리량은 동일하다. 차이는 "유휴 GPU가 존재하느냐"인데, 이 서비스의 요청 패턴에서는 야간 burst 시 동시 요청이 GPU 수 이상으로 들어오고, 낮에는 어차피 양쪽 모두 유휴 상태다. 유휴 GPU 문제는 클라우드 환경에서 autoscaler로 해결할 수 있다.

### 클라우드 확장성: podpool이 scale-to-zero에 유리하다

클라우드 확장 시 가장 큰 비용 절감 수단은 두 가지다: scale-to-zero와 Spot instance.

**Scale-to-zero:** 야간 burst 후 낮에 GPU node를 전부 내리면, 실제 사용 시간만큼만 과금된다. Podpool 방식에서는 job이 없으면 GPU 할당이 0이 되므로, Karpenter 같은 node autoscaler가 자연스럽게 node를 제거한다. 분산 방식에서는 LB 뒤에 항상 최소 pod 수를 유지해야 하므로 완전한 scale-to-zero가 어렵다.

**Spot instance:** Spot 중단 시, podpool에서는 해당 GPU에서 처리 중이던 slide 1개만 재시도하면 된다. 분산 방식에서는 여러 slide의 일부 batch가 영향을 받으므로 recovery 로직이 복잡해진다. WSI batch inference는 stateless한 workload이므로 Spot과 궁합이 좋은데, podpool이 이 장점을 온전히 살릴 수 있다.

## 결정

Podpool (1요청:1GPU) 방식을 선택했다.

| 기준 | Podpool | 분산 |
|------|:-------:|:----:|
| Throughput | 동등 | 동등 |
| 결과 수집 | 단순 | 복잡 |
| 격리성 | 완전 격리 | 경합 발생 |
| 장애 대응 | slide 1개 영향 | 여러 slide 영향 |
| 운영 복잡도 | 현재 구조 유지 | 추가 인프라 필요 |
| GPU 활용률 | autoscaler로 보완 | 이론상 유리 |
| 클라우드 확장 | scale-to-zero 자연스러움 | 구조적 제약 |

분산 방식이 이론적으로 우위인 항목은 GPU 활용률 하나뿐이며, 이마저도 실제 요청 패턴과 Triton의 serial 처리 특성을 고려하면 차이가 제한적이다.

## 알려진 한계와 대응

Podpool이 만능은 아니다. 알려진 약점과 대응 방안을 함께 정리한다.

**단일 WSI latency를 GPU 추가로 줄일 수 없다.** 한 slide를 한 GPU에서 처리하므로, GPU를 늘려도 개별 slide의 처리 시간은 그대로다. 이 서비스의 SLA는 "분~시간" 단위이므로 개별 latency보다 전체 throughput이 중요하다. 만약 실시간 응답이 필요한 use case가 생기면, 그때 별도 경로로 분산 방식을 추가 검토한다.

**대형 WSI가 GPU를 장시간 독점할 수 있다.** Go server의 job scheduler에서 max processing time을 설정하고, 초과 시 중간 결과를 저장한 뒤 재스케줄링하는 방식으로 대응할 수 있다. Priority queue를 도입하면 소형 WSI가 대형 WSI에 밀리지 않도록 조정도 가능하다.

**동시 요청이 적을 때 GPU가 논다.** 온프레미스에서는 고정 자원이므로 이 문제가 존재한다. 클라우드로 확장하면 autoscaler로 해결된다. 온프레미스에서도 Go server가 한 사용자의 여러 WSI를 pipeline으로 처리하면 — slide A의 batch를 GPU에 보내는 동안 slide B의 전처리를 병렬 수행 — GPU 대기 시간을 줄일 수 있다.

## Takeaways

GPU 할당 전략은 workload 특성에 맞춰야 한다. WSI batch inference에서 podpool이 적합한 이유를 세 가지로 요약한다.

**Slide-level affinity가 핵심이다.** WSI 추론은 한 slide의 결과를 모아야 의미가 있다. Podpool은 이 affinity를 구조적으로 보장한다. 분산 방식에서 동일한 affinity를 구현하려면 consistent hashing이나 session affinity를 별도로 구성해야 하는데, 이는 결국 podpool과 동일한 구조가 된다.

**"분산하면 빠르다"는 가정을 검증해야 한다.** Triton처럼 GPU에서 request를 serial하게 처리하는 inference server에서는, batch를 여러 GPU에 나누어도 시스템 전체 throughput이 올라가지 않는다. 분산의 이점은 fan-out 오버헤드와 운영 복잡도 증가로 상쇄된다.

**클라우드 확장을 고려한다면, 장애 격리 단위가 작은 패턴이 유리하다.** Spot 중단, node autoscaling, scale-to-zero 모두 "하나의 단위가 사라졌을 때 영향 범위가 얼마나 큰가"가 중요하다. Podpool에서는 slide 1개다.
