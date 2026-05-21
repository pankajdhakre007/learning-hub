# ✦ Learning Hub

A personal senior engineering interview preparation site — curated playbooks, benchmarks, algorithm practice, and load reference data for senior engineering interviews.

## 🌐 Website

**[https://pankajdhakre007.github.io/learning/](https://pankajdhakre007.github.io/learning/)**

---

## 🎯 Purpose

Built to support senior engineering interview preparation and ongoing technical reference. The site consolidates:

- Algorithm problem tracking with difficulty and category breakdowns
- System performance benchmarks for comparing storage, messaging, and networking technologies
- Production failure playbooks covering real-world issues across distributed systems
- Load reference data for peak event infrastructure planning

---

## 📚 Content

### 1. LeetCode Questions
Tracks **180 algorithm problems** across **15 categories**:
- Difficulty split: **42 Easy · 107 Medium · 31 Hard**
- Categories include: Arrays, Dynamic Programming, Graphs, Trees, Sliding Window, Two Pointers, Backtracking, and more
- Filterable by difficulty and category with live problem counts

### 2. Technology Benchmarks
Side-by-side throughput and latency comparisons across:
- **Core Systems** — PostgreSQL, MongoDB, Redis, Kafka, Cassandra, Elasticsearch
- **API Gateways** — Kong, NGINX, AWS API Gateway
- **Load Balancers** — HAProxy, NGINX, AWS ELB
- **Time Series Databases** — InfluxDB, TimescaleDB, Prometheus
- **Vector Databases** — Pinecone, Weaviate, Milvus, FAISS

Metrics include Writes/sec, Reads/sec, Write Latency, and Read Latency with color-coded throughput tags (green ≥ 100K · yellow ≥ 10K · red < 10K).

### 3. Tech Issues & Resolutions
**28 deep-dive failure domain playbooks** covering root cause → symptoms → resolution for:
- **Kafka** — throughput degradation, consumer lag, partition skew, replication failures
- **MongoDB** — replica set failover, index bloat, OOM kills, write conflicts
- **Redis** — eviction storms, cluster split-brain, persistence lag
- **Cassandra** — compaction pressure, tombstone floods, consistency mismatches
- **Kubernetes** — pod OOMKill, node pressure, CrashLoopBackOff, rolling update stalls
- **API Gateway** — auth failures, rate limit tuning, circuit breaker misconfiguration
- **Elasticsearch** — shard imbalance, mapping explosions, GC pauses, index throttling

### 4. Fulfillment Load
Infrastructure load reference comparing **Regular Day** vs. **Black Friday / Cyber Monday** peak traffic:
- Order volume, API RPS, DB write rates, cache hit ratios
- Helps size systems and set realistic SLO targets for high-traffic events

---

🌀 Magic applied with [Wibey JetBrains Plugin](https://wibey.walmart.com/code) 🪄
