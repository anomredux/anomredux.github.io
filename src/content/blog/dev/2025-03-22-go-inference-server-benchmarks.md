---
title: "Building a High-Performance ML Inference Server in Go"
date: 2025-03-22
description: "Lessons learned building a Go-based inference server that serves ML models with sub-10ms p99 latency."
category: dev
tags:
  - go
  - performance
  - mlops
  - grpc
draft: false
featured: false
---

Python is the lingua franca of ML, but when it comes to serving models in production with strict latency requirements, sometimes you need something faster.

## Why Go?

- **No GIL**: True parallelism for handling concurrent requests
- **Low memory footprint**: Predictable resource usage
- **gRPC native**: First-class Protocol Buffer support
- **Fast cold starts**: Important for autoscaling

## Architecture

```go
type InferenceServer struct {
    modelPool  *sync.Pool
    batchQueue chan *BatchRequest
    metrics    *prometheus.Registry
}

func (s *InferenceServer) Predict(ctx context.Context, req *pb.PredictRequest) (*pb.PredictResponse, error) {
    model := s.modelPool.Get().(*Model)
    defer s.modelPool.Put(model)

    result, err := model.Infer(req.Features)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "inference failed: %v", err)
    }

    return &pb.PredictResponse{
        Predictions: result,
    }, nil
}
```

## Batching Strategy

Dynamic batching is critical for GPU utilization. We collect requests for up to 5ms, then batch them:

```go
func (s *InferenceServer) batchWorker() {
    ticker := time.NewTicker(5 * time.Millisecond)
    defer ticker.Stop()

    var batch []*BatchRequest

    for {
        select {
        case req := <-s.batchQueue:
            batch = append(batch, req)
            if len(batch) >= maxBatchSize {
                s.processBatch(batch)
                batch = batch[:0]
            }
        case <-ticker.C:
            if len(batch) > 0 {
                s.processBatch(batch)
                batch = batch[:0]
            }
        }
    }
}
```

## Benchmark Results

| Metric | Python (FastAPI) | Go (gRPC) | Improvement |
|--------|-----------------|-----------|-------------|
| p50 latency | 12ms | 3ms | 4x |
| p99 latency | 45ms | 8ms | 5.6x |
| Throughput | 850 req/s | 4200 req/s | 4.9x |
| Memory | 1.2GB | 180MB | 6.7x |

## Lessons Learned

1. **Connection pooling matters more than language speed**
2. **Dynamic batching is a must for GPU workloads**
3. **Use `sync.Pool` for model instances to avoid allocation overhead**
4. **Profile with `pprof` before optimizing — the bottleneck is rarely where you think**

The raw language performance difference accounts for maybe 2x; the rest comes from architectural decisions like batching and connection management.
