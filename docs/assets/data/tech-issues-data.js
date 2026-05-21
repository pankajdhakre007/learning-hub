// Auto-generated: all 28 tech-issue page data objects keyed by page slug.
// Loaded by tech-issues.html so no fetch() calls are needed (works on file:// too).
const TECH_ISSUES_DATA = {
  "api-gateway-auth": {
      header: {
        eyebrow: "API Gateway - identity controls",
        title: "Authentication and authorization failures",
        description: "Guide covering token validation errors, policy mismatches, key rotation incidents, and auth dependency failures."
      },
      synonyms: ["Auth failures","Token validation errors","JWT verification failures","Policy mismatch","401 spikes","403 spikes","Signature errors","IdP dependency failures"],
      questions: ["Why are valid users suddenly receiving 401/403?","How does key rotation break token validation?","How do policy updates trigger authorization regressions?","What happens when identity provider latency increases?"],
      layers: [
        {
          name: "Tokens",
          title: "Token parsing and signature validation",
          description: "Token verification can fail due to key, clock, format, or algorithm mismatches.",
          symptoms: ["401 spikes for previously valid sessions","Signature verification errors","Clock skew related token rejects"],
          causes: ["Stale JWKS cache","Bad key rotation rollout","Invalid issuer/audience config"],
          effects: ["User login disruption","Revenue-impacting request failures","Support load spikes"],
          mitigations: ["Harden key rotation workflow","Use resilient JWKS cache strategy","Monitor token validation failure categories"],
          metrics: ["401 rate","Validation error breakdown","JWKS fetch latency/error","Clock skew incidents"],
          tradeoffs: ["Short key cache TTL improves freshness but raises dependency calls","Long TTL reduces dependency load but risks stale keys"]
        },
        {
          name: "Policy",
          title: "Authorization policy evaluation drift",
          description: "Policy engines can deny valid traffic when rule updates are unsafe or inconsistent.",
          symptoms: ["403 increase after policy release","Role-based access anomalies","Environment-specific auth behavior"],
          causes: ["Rule regression","Inconsistent policy deployment","Missing exception paths"],
          effects: ["Blocked legitimate access","Operational rollbacks","Compliance risk if over-permissive fix applied"],
          mitigations: ["Policy canary + tests","Versioned rollout with rollback hooks","Audit logging for denied decisions"],
          metrics: ["403 rate by route","Policy evaluation latency","Denied decision reason code","Rollback frequency"],
          tradeoffs: ["More policy checks improve governance but add latency","Simpler policies reduce regressions but may reduce granularity"]
        },
        {
          name: "Dependencies",
          title: "Identity provider and upstream auth dependencies",
          description: "Auth decisions often depend on external IdP, introspection, or entitlement services.",
          symptoms: ["Auth latency spikes without traffic increase","Intermittent auth timeouts","Increased gateway retry activity"],
          causes: ["IdP degradation","Introspection endpoint saturation","Network instability to auth backend"],
          effects: ["Widespread request failures","Cascading retries","Poor user experience"],
          mitigations: ["Fail-open/fail-closed policy by endpoint criticality","Caching of validated claims where safe","Circuit breakers for auth dependencies"],
          metrics: ["Auth backend latency","Auth timeout rate","Retry rate","Circuit breaker open events"],
          tradeoffs: ["Caching claims improves resilience but may use stale entitlements","Fail-open improves availability but increases security risk"]
        },
        {
          name: "Propagation",
          title: "Credential propagation and downstream trust",
          description: "Even validated requests fail when identity context is not propagated correctly downstream.",
          symptoms: ["Downstream services reject requests with missing identity","Inconsistent principal mapping","Audit trail gaps"],
          causes: ["Header stripping/transformation errors","Token exchange misconfiguration","Mixed trust models across services"],
          effects: ["Authorization bypass or false denies","Broken traceability","Complex incident diagnosis"],
          mitigations: ["Standardize identity propagation contract","Contract tests across gateway and services","Strong audit and tracing"],
          metrics: ["Propagation error count","Downstream auth reject rate","Missing principal incidents","Audit completeness score"],
          tradeoffs: ["Richer identity context improves downstream controls but increases payload size and complexity","Stricter propagation checks can block borderline requests"]
        }
      ],
      comparisons: [
        { tech: "OAuth Gateway", problem: "Token introspection failures" },
        { tech: "Kubernetes", problem: "RBAC policy regressions" },
        { tech: "Zero Trust Proxy", problem: "Identity assertion failures" },
        { tech: "MongoDB", problem: "Auth backend dependency lag" },
        { tech: "Elasticsearch", problem: "Security realm misconfiguration" }
      ],
      insight: "Gateway auth incidents are usually control-plane correctness problems. Secure systems need both availability discipline and policy-change safety."
    },
  "api-gateway-connections": {
      header: {
        eyebrow: "API Gateway — runtime resource limits",
        title: "Connection and resource exhaustion",
        description: "Guide covering connection pool depletion, socket saturation, FD limits, and thread/resource starvation at the gateway."
      },
      synonyms: ["Connection pool exhaustion","Socket saturation","FD exhaustion","Thread starvation","Ephemeral port exhaustion","Keepalive depletion","Accept queue overflow","Resource ceiling breach"],
      questions: ["Why does gateway error rate jump at high QPS despite healthy backends?","How do connection pools become bottlenecks?","How do keepalive settings impact socket exhaustion?","How do OS limits trigger gateway failures?"],
      layers: [
        {
          name: "Connections",
          title: "Upstream/downstream connection pool pressure",
          description: "Pool limits and reuse behavior determine effective throughput and latency.",
          symptoms: ["Pool utilization near 100%","Queueing for pooled connections","Increased connection timeout errors"],
          causes: ["Pool size too small","Slow upstream responses holding connections","Poor keepalive tuning"],
          effects: ["Latency inflation","Request drops","Throughput ceiling"],
          mitigations: ["Tune pool sizes per route","Reduce connection hold time via timeout alignment","Enable effective keepalive reuse"],
          metrics: ["Pool utilization","Connection wait time","Connection timeout rate","Request throughput"],
          tradeoffs: ["Larger pools improve concurrency but increase memory/socket footprint","Aggressive timeouts reduce hold time but can increase failure rate"]
        },
        {
          name: "Sockets",
          title: "Socket lifecycle and port exhaustion",
          description: "High churn in short-lived connections can exhaust ephemeral ports and kernel socket resources.",
          symptoms: ["Connection reset spikes","Cannot assign requested address errors","Short-lived connection bursts"],
          causes: ["No reuse/keepalive","Retry storms creating connection churn","Kernel networking limits too low"],
          effects: ["Intermittent hard failures","Unpredictable latency","Regional edge instability"],
          mitigations: ["Increase reuse and keepalive efficiency","Tune kernel network limits","Cap retry-driven churn"],
          metrics: ["New connections/sec","TIME_WAIT count","Reset rate","Port exhaustion events"],
          tradeoffs: ["Long keepalive improves reuse but may hold idle resources","Kernel limit increases require careful capacity planning"]
        },
        {
          name: "Process",
          title: "FD, thread, and memory ceilings",
          description: "Runtime process limits can cap gateway capacity before CPU saturates.",
          symptoms: ["Too many open files errors","Thread pool queue saturation","Memory pressure under peak load"],
          causes: ["Low ulimit values","Oversized worker concurrency","Insufficient memory headroom"],
          effects: ["Request rejection","Latency spikes","Crash/restart risk"],
          mitigations: ["Set safe FD/thread limits","Right-size worker model","Load-test for ceiling validation"],
          metrics: ["FD usage vs limit","Thread queue depth","Memory RSS","Error rates under peak"],
          tradeoffs: ["Higher limits increase blast radius if leaks exist","Conservative limits improve safety but cap peak capacity"]
        },
        {
          name: "Resilience",
          title: "Guardrails and overload behavior",
          description: "Overload handling should fail gracefully rather than cascading into full outages.",
          symptoms: ["Sharp failure cliffs at load threshold","Retries worsen incident","Recovery lags after load subsides"],
          causes: ["No load shedding policy","Unbounded queues","No per-client quotas"],
          effects: ["Wider outage blast radius","Longer recovery time","Client retry storms"],
          mitigations: ["Implement bounded queues and load shedding","Per-client quotas","Brownout/degrade modes for non-critical paths"],
          metrics: ["Load shed rate","Queue depth at saturation","Recovery time","Client-level fairness metrics"],
          tradeoffs: ["Shedding protects platform but rejects traffic","Fairness controls add policy complexity"]
        }
      ],
      comparisons: [
        { tech: "Nginx", problem: "Worker and FD saturation" },
        { tech: "Envoy", problem: "Connection pool overflow" },
        { tech: "Kubernetes", problem: "Node resource exhaustion" },
        { tech: "Kafka", problem: "Broker network saturation" },
        { tech: "Redis", problem: "Client connection pressure" }
      ],
      insight: "Edge reliability depends on resource ceilings as much as business logic. Exhaustion incidents are preventable with realistic limits, graceful overload controls, and traffic discipline."
    },
  "api-gateway-traffic": {
      header: {
        eyebrow: "API Gateway — traffic entry point",
        title: "Traffic management & overload",
        description: "Staff+/Principal-level guide covering request throttling, rate limiting, traffic spikes, request saturation, and DDoS-like bursts at the API Gateway layer."
      },
      synonyms: ["Throttling","Rate limiting","Request saturation","429 errors","Gateway overload","Request queue buildup","Traffic spike handling","Burst traffic"],
      questions: ["Why are requests being throttled at the gateway?","How do I implement effective rate limiting?","Why is API latency spiking during traffic bursts?","What causes cascading 429 errors?","How do I distinguish DDoS from legitimate traffic?","Why is gateway CPU saturating?","How do I handle traffic spikes gracefully?","What's the best rate limiting strategy?"],
      layers: [
        {
          name: "Throttling",
          title: "Rate limiting & request throttling",
          description: "API Gateways enforce rate limits to prevent overload. Aggressive rate limiting protects backends but may reject legitimate requests during traffic bursts. Too lenient rate limiting allows backend overload.",
          symptoms: ["429 Too Many Requests responses","Request rejection increasing","Client complaints about throttling","Legitimate requests failing"],
          causes: ["Rate limit too aggressive for traffic pattern","Burst traffic exceeding configured limits","No burst allowance in rate limiting","Token bucket depleted"],
          effects: ["Legitimate requests rejected","Client experience degradation","Revenue impact from failed requests","Cascading retries amplifying traffic"],
          mitigations: ["Tune rate limits to traffic baseline","Implement burst allowances","Use adaptive rate limiting","Communicate limits to clients","Implement exponential backoff"],
          metrics: ["429 error rate","Throttled requests per second","Request queue length","Rate limit bucket fill rate","Legitimate vs rejected ratio"],
          tradeoffs: ["Higher limits risk backend overload","Lower limits reject legitimate traffic","Burst allowance can cause spikes"]
        },
        {
          name: "Backpressure",
          title: "Request queue & backpressure handling",
          description: "When request rate exceeds processing capacity, the gateway queues requests. Queue buildup increases latency, consumes memory, and can lead to cascading failures as queued requests timeout.",
          symptoms: ["Request latency increases linearly","Queue size growing","Memory usage spiking","Timeout errors from queued requests"],
          causes: ["Backend throughput lower than frontend traffic","Slow processing causing queue to back up","No circuit breaker protection","Insufficient gateway resources"],
          effects: ["Latency explosion from queue wait","Memory exhaustion on gateway","Timeout cascades","Complete service collapse"],
          mitigations: ["Implement circuit breakers early","Use shed load policy when queue full","Scale gateway resources","Reduce request size/complexity","Implement deadline propagation"],
          metrics: ["Queue length","Queue wait time","Memory usage","Timeout rate","Drop rate"],
          tradeoffs: ["Shedding load impacts users","Circuit breaker prevents cascades","Scaling adds cost"]
        },
        {
          name: "Bursts",
          title: "Traffic spike & burst handling",
          description: "Traffic spikes from deployments, cache invalidations, or legitimate demand surges overwhelm gateways and backends. Handling spikes gracefully requires proper burst allowances and load shedding strategies.",
          symptoms: ["P99 latency spikes","Error rate spikes","Gateway CPU utilization jumps","Cascading failures downstream"],
          causes: ["Unexpected traffic spike","Thundering herd from cache expiry","Batch job triggering simultaneous requests","Marketing campaign or viral event"],
          effects: ["Cascading latency increase","Downstream service overload","Complete backend saturation","Service unavailability"],
          mitigations: ["Implement adaptive load shedding","Use priority queues for important requests","Scale backends to handle spikes","Implement request deduplication","Use cache to absorb spikes"],
          metrics: ["Peak traffic rate","Spike detection sensitivity","Load shed rate","Error rate during spikes","Recovery time"],
          tradeoffs: ["Aggressive shedding impacts user experience","Scaling costs for spike capacity","Deduplication adds complexity"]
        },
        {
          name: "Gateway",
          title: "Gateway resource saturation",
          description: "API Gateways themselves can become saturated—CPU from routing logic, memory from request buffering, or network from traffic forwarding. Gateway saturation limits throughput regardless of backend capacity.",
          symptoms: ["Gateway CPU at 100%","Gateway memory usage high","NIC saturation visible","Requests stuck at gateway"],
          causes: ["Gateway resources under-provisioned","Complex routing rules consuming CPU","Large request/response bodies","Excessive logging/tracing overhead"],
          effects: ["Gateway becomes bottleneck","Throughput limited by gateway capacity","Latency increases even if backends healthy","Complete service bottleneck"],
          mitigations: ["Scale gateway horizontally","Optimize routing logic","Reduce request body size","Implement request compression","Use more efficient gateway"],
          metrics: ["Gateway CPU utilization","Gateway memory usage","NIC bandwidth","Request throughput per gateway","Gateway connection count"],
          tradeoffs: ["More gateways increase complexity","Optimization requires code changes","Compression adds latency"]
        }
      ],
      comparisons: [
        { tech: "Kafka", problem: "Message throughput overload" },
        { tech: "Redis", problem: "Client connection saturation" },
        { tech: "Load Balancer", problem: "Connection limit exhaustion" },
        { tech: "Nginx", problem: "Worker process saturation" },
        { tech: "Envoy", problem: "Filter execution backpressure" }
      ],
      insight: "API Gateway traffic management is a balancing act between protecting backends and serving legitimate requests. Naive rate limiting that simply rejects all excess traffic is crude. Sophisticated gateways implement adaptive rate limiting, priority queues, request shedding, and circuit breakers to gracefully degrade rather than fail catastrophically. The key insight: the gateway is a shaper and protector, not just a router. Understanding token bucket algorithms, queue discipline, and backpressure propagation is essential for reliable gateway operation at scale."
    },
  "api-gateway-upstream": {
      header: {
        eyebrow: "API Gateway — service dependency health",
        title: "Upstream dependency instability",
        description: "Guide covering backend latency propagation, timeout amplification, and retry-driven cascades."
      },
      synonyms: ["Backend latency","Upstream failures","Dependency timeouts","Retry storms","Tail latency amplification","Dependency flapping","Upstream saturation","Cascading errors"],
      questions: ["Why is gateway latency high when gateway CPU is normal?","How do retries amplify upstream outages?","How do circuit breakers reduce blast radius?","What timeout strategy prevents cascading failures?"],
      layers: [
        {
          name: "Timeouts",
          title: "Timeout budgets and propagation",
          description: "Misaligned timeout budgets across layers can convert slow backends into full request failures.",
          symptoms: ["Gateway timeout spikes","Backend still processing after client timeout","Error bursts at fixed timeout boundaries"],
          causes: ["Gateway timeout shorter than realistic upstream latency","No end-to-end deadline propagation","Long tail dependency behavior"],
          effects: ["Request failure inflation","Wasted backend work","Unstable client behavior"],
          mitigations: ["Set layered timeout budgets coherently","Use deadline propagation","Tune per-route timeout by SLO class"],
          metrics: ["Timeout rate by route","Upstream p95/p99 latency","Late response count","Request cancellation rate"],
          tradeoffs: ["Short timeouts protect resources but may cut off recoverable calls","Long timeouts improve completion but increase queue pressure"]
        },
        {
          name: "Retries",
          title: "Retry policy and amplification risk",
          description: "Retries can recover transient errors or amplify overload if budgets are unbounded.",
          symptoms: ["Retry volume spikes during incidents","Amplified QPS on failing backend","Increased queue depth and latency"],
          causes: ["Aggressive retries without jitter","Retries on non-idempotent operations","No per-client retry budget"],
          effects: ["Cascading saturation","Prolonged incident duration","Duplicate side effects"],
          mitigations: ["Bound retries with backoff+jitter","Retry only idempotent classes","Use global retry budgets"],
          metrics: ["Retry rate","Retry success ratio","Amplification factor","Upstream saturation indicators"],
          tradeoffs: ["Fewer retries reduce amplification but may lower success on transient faults","More retries improve short blips but increase overload risk"]
        },
        {
          name: "Isolation",
          title: "Circuit breakers and outlier controls",
          description: "Isolation controls prevent one failing upstream from degrading all traffic paths.",
          symptoms: ["All routes degraded by one backend","No quick recovery after backend failure","Queue growth across unrelated endpoints"],
          causes: ["Missing circuit breakers","No outlier ejection","Shared worker pools without partitioning"],
          effects: ["Cross-service blast radius","Poor fault containment","Higher error budget burn"],
          mitigations: ["Per-upstream circuit breakers","Connection pool partitioning","Fallback/partial response paths"],
          metrics: ["Breaker open events","Outlier ejections","Route-level error isolation","Fallback success rate"],
          tradeoffs: ["Aggressive breakers may reject recoverable requests","Fallback paths improve availability but may reduce feature fidelity"]
        },
        {
          name: "Operations",
          title: "Dependency-aware incident response",
          description: "Operational preparedness determines recovery speed during upstream instability.",
          symptoms: ["Slow incident triage","Unclear ownership for failing dependency","Frequent manual config toggles"],
          causes: ["No dependency map/runbook","Insufficient per-upstream observability","No pre-defined degradation modes"],
          effects: ["Longer MTTR","Higher customer impact","Repeated incidents"],
          mitigations: ["Maintain dependency maps and route ownership","Per-upstream dashboards and SLOs","Pre-tested degrade modes"],
          metrics: ["MTTR by dependency incident","Incident recurrence","Route-level SLO adherence","Change success rate during incident"],
          tradeoffs: ["More observability and runbooks require operational investment","Static degrade modes may not fit every incident type"]
        }
      ],
      comparisons: [
        { tech: "Service Mesh", problem: "Upstream outlier instability" },
        { tech: "Kubernetes", problem: "Dependency readiness coupling" },
        { tech: "Kafka", problem: "Downstream sink backpressure" },
        { tech: "MongoDB", problem: "Dependency-driven query stalls" },
        { tech: "Elasticsearch", problem: "Node-level dependency hotspots" }
      ],
      insight: "Gateway uptime depends heavily on dependency posture. Reliability comes from controlled degradation, not waiting for every upstream to be perfect."
    },
  "cassandra-compaction": {
      header: {
        eyebrow: "Cassandra — storage engine",
        title: "Storage and compaction pressure",
        description: "Guide covering compaction storms, SSTable proliferation, and disk IO contention in Cassandra."
      },
      synonyms: ["Compaction storms","SSTable pressure","Compaction backlog","Write amplification","Storage saturation","Flush pressure","Disk amplification","Compaction debt"],
      questions: ["Why does Cassandra latency spike during compaction?","How does compaction strategy change performance behavior?","What causes compaction backlog to persist?","How do I tune storage pressure without data risk?"],
      layers: [
        {
          name: "Write Path",
          title: "Memtable flush and SSTable growth",
          description: "Write-heavy workloads create many SSTables that must later be compacted.",
          symptoms: ["SSTable count rises rapidly","Flush frequency increases","Write latency volatility"],
          causes: ["High write rate","Small memtables","Poor table design for write patterns"],
          effects: ["Read amplification","Higher disk seeks","Compaction debt buildup"],
          mitigations: ["Tune memtable and flush thresholds","Right-size table model and partition width","Avoid pathological write bursts"],
          metrics: ["SSTable count","Flush latency","Write latency","Pending flush tasks"],
          tradeoffs: ["Larger memtables improve write efficiency but increase memory demand","Aggressive flushing lowers memory risk but increases IO churn"]
        },
        {
          name: "Compaction",
          title: "Compaction strategy and backlog behavior",
          description: "Compaction strategy determines merge frequency, IO cost, and read amplification profile.",
          symptoms: ["Pending compactions grow","Periodic IO spikes","Read latency degrades over time"],
          causes: ["Mismatched compaction strategy","Insufficient disk throughput","Uneven table-level workload"],
          effects: ["Compaction storms","Longer repair windows","Node instability under load"],
          mitigations: ["Use strategy aligned with access patterns","Set compaction throughput limits sanely","Isolate hot tables with focused tuning"],
          metrics: ["Pending compaction tasks","Compaction throughput","Read latency during compaction","Disk utilization"],
          tradeoffs: ["Higher compaction throughput speeds recovery but competes with foreground traffic","Conservative compaction protects latency but extends debt period"]
        },
        {
          name: "Disk",
          title: "Disk IO contention across workloads",
          description: "Foreground reads/writes and background compaction compete for the same disks.",
          symptoms: ["High IO wait","Queue depth spikes","Read and write latencies degrade together"],
          causes: ["Shared storage bottleneck","Insufficient IOPS headroom","Concurrent repair and compaction"],
          effects: ["Throughput collapse under peaks","Timeout increases","Reduced cluster resilience"],
          mitigations: ["Use faster disks and balanced node capacity","Separate maintenance windows","Throttle background tasks"],
          metrics: ["Disk IO wait","Queue depth","Timeout rate","Node-level latency"],
          tradeoffs: ["Throttling maintenance improves foreground latency but prolongs maintenance completion","Upgrading storage increases cost"]
        },
        {
          name: "Operations",
          title: "Operational controls and prevention",
          description: "Sustained compaction health requires proactive controls, not incident-only tuning.",
          symptoms: ["Recurring compaction incidents","Unpredictable performance after scaling events","Backlog returns quickly after cleanup"],
          causes: ["No table-level SLOs","Insufficient forecasting of growth","Reactive-only operations"],
          effects: ["Frequent firefighting","Missed performance objectives","Higher operational risk"],
          mitigations: ["Track table growth and compaction budgets","Automate backlog alerts","Capacity plan for steady-state + peak"],
          metrics: ["Backlog trend","Growth rate by table","Incident frequency","Time-to-recover"],
          tradeoffs: ["More proactive controls require observability investment","Over-provisioning reduces risk but raises baseline cost"]
        }
      ],
      comparisons: [
        { tech: "Elasticsearch", problem: "Segment merge pressure" },
        { tech: "Kafka", problem: "Log retention and IO pressure" },
        { tech: "MongoDB", problem: "Checkpoint and disk saturation" },
        { tech: "PostgreSQL", problem: "Vacuum/maintenance IO contention" },
        { tech: "Redis", problem: "Persistence-induced latency spikes" }
      ],
      insight: "Cassandra compaction problems are debt problems: if background merge debt grows faster than it is paid down, the cluster eventually becomes unstable."
    },
  "cassandra-consistency": {
      header: {
        eyebrow: "Cassandra — correctness operations",
        title: "Consistency and repair problems",
        description: "Guide covering replica drift, delayed repair, and consistency-level tradeoffs under real failure conditions."
      },
      synonyms: ["Replica drift","Read repair issues","Repair backlog","Anti-entropy lag","Digest mismatch","Replica divergence","Consistency debt","Quorum mismatch"],
      questions: ["Why do Cassandra replicas return different values?","How does delayed repair affect correctness?","When does read repair become too expensive?","How should consistency level be selected per workload?"],
      layers: [
        {
          name: "Writes",
          title: "Write path and hinted handoff behavior",
          description: "Replica availability during writes determines how much inconsistency debt is created.",
          symptoms: ["Hints accumulate","Intermittent stale reads","Cross-node value mismatch after failures"],
          causes: ["Node outages during writes","Low consistency writes under partition events","Hints not replayed promptly"],
          effects: ["Replica divergence","Correctness uncertainty","Higher repair burden"],
          mitigations: ["Set consistency by data criticality","Monitor hint backlog","Reduce prolonged node unavailability"],
          metrics: ["Hints in queue","Write CL distribution","Replica ack failure rate","Stale read incidents"],
          tradeoffs: ["Lower write CL improves latency but increases inconsistency risk","Higher write CL improves correctness but reduces availability"]
        },
        {
          name: "Reads",
          title: "Read path and read-repair overhead",
          description: "Reads can detect divergence but may incur latency and additional write traffic.",
          symptoms: ["Read latency spikes at stronger CL","Digest mismatches observed","Read repair traffic bursts"],
          causes: ["Diverged replicas","Uneven data freshness","Aggressive read repair settings"],
          effects: ["Tail latency growth","Extra network/storage load","User-facing inconsistency during convergence"],
          mitigations: ["Use targeted CL policies","Tune read repair configuration","Reduce divergence via timely repair"],
          metrics: ["Digest mismatch rate","Read repair rate","Read latency by CL","Cross-node read variance"],
          tradeoffs: ["More read repair improves correctness but increases latency","Weaker CL lowers latency but can return stale data"]
        },
        {
          name: "Repair",
          title: "Anti-entropy repair scheduling and debt",
          description: "Repair is essential for long-term consistency and tombstone cleanup safety.",
          symptoms: ["Repair windows exceed schedule","Backlog grows after incidents","Inconsistency events repeat"],
          causes: ["Large datasets with slow repair cadence","Insufficient maintenance capacity","Competing compaction/repair IO"],
          effects: ["Persistent drift","Operational fragility","Increased chance of correctness incidents"],
          mitigations: ["Run incremental repairs with strict cadence","Prioritize critical keyspaces","Allocate maintenance headroom"],
          metrics: ["Repair duration","Repair backlog age","Segments repaired per cycle","Consistency incident count"],
          tradeoffs: ["Frequent repair consumes resources","Infrequent repair increases correctness risk"]
        },
        {
          name: "Failure",
          title: "Topology changes and failure recovery",
          description: "Node replacement, DC events, and network partitions can amplify consistency risk if procedures are weak.",
          symptoms: ["Post-recovery stale reads","Inconsistent behavior by region","Long convergence periods"],
          causes: ["Incomplete bootstrap/decommission processes","Cross-DC instability","Lack of validated recovery runbooks"],
          effects: ["Extended correctness uncertainty","Service-level trust erosion","Manual intervention burden"],
          mitigations: ["Use hardened topology-change runbooks","Test partition/failover scenarios","Validate convergence before traffic normalization"],
          metrics: ["Convergence time","Post-event mismatch count","Runbook success rate","Recovery error rate"],
          tradeoffs: ["Safer recovery steps can increase maintenance duration","Faster cutovers may carry residual consistency debt"]
        }
      ],
      comparisons: [
        { tech: "MongoDB", problem: "Replication staleness window" },
        { tech: "MySQL", problem: "Replica consistency lag" },
        { tech: "Kafka", problem: "ISR and leader consistency risk" },
        { tech: "Elasticsearch", problem: "Replica refresh divergence" },
        { tech: "DynamoDB", problem: "Eventual consistency tradeoffs" }
      ],
      insight: "Cassandra consistency is an operational contract, not just a CL setting. Repair discipline and failure handling determine whether theoretical guarantees hold in production."
    },
  "cassandra-distribution": {
      header: {
        eyebrow: "Cassandra — wide-column distributed database",
        title: "Data distribution imbalance",
        description: "Staff+/Principal-level guide covering hot partitions, partition skew, shard imbalance, and uneven token distribution in Cassandra clusters."
      },
      synonyms: ["Hot partitions","Partition skew","Uneven token distribution","Hot shards","Uneven node utilization","Shard hotspotting","Uneven partition load","Token ring imbalance"],
      questions: ["Why is one Cassandra node consistently overloaded?","How do I detect hot partitions in Cassandra?","What causes uneven token distribution?","Why is partition read/write latency variable?","How does shard key design affect Cassandra performance?","What causes one node to have higher CPU than others?","How do I rebalance uneven data distribution?","Why is one node filling disk faster?"],
      layers: [
        {
          name: "Partition Key",
          title: "Partition key design & cardinality",
          description: "Cassandra distributes data using a hash ring where the partition key determines which node owns each row. Poor partition key design (low cardinality, skewed distributions) causes uneven data distribution and hotspotting.",
          symptoms: ["One node has significantly more data","One node receiving more requests","Uneven CPU utilization across cluster","One node disk filling faster"],
          causes: ["Low-cardinality partition key (e.g., country_code)","Tenant hotspotting where one customer dominates","Time-based skew with time-series data","Boolean flags as partition key"],
          effects: ["Hotspot node becomes bottleneck","Other nodes underutilized","Uneven memory and storage pressure","Cascading failures when hotspot overloaded"],
          mitigations: ["Use high-cardinality partition key","Composite partition key with tenant + ID","Bucketing or salting strategy","Redesign table schema","Use secondary indexes for alternative access"],
          metrics: ["Partition size distribution","Request rate per node","CPU utilization variance","Disk usage per node","P99 latency by node"],
          tradeoffs: ["Composite keys increase query complexity","Secondary indexes add write overhead","Bucketing increases partition count"]
        },
        {
          name: "Token",
          title: "Token assignment & ring imbalance",
          description: "Cassandra uses tokens to assign partitions to nodes. Uneven token assignment or node failures that aren't rebalanced cause some nodes to own more partition ranges than others.",
          symptoms: ["Token ownership imbalanced across nodes","Some nodes handling more replicas","Uneven read repair traffic","Compaction storms on specific nodes"],
          causes: ["Manual token assignment without balancing","Nodes not fully integrated after restart","Uneven replica placement","Rack awareness misconfiguration"],
          effects: ["Uneven data and request distribution","Some nodes overloaded while others idle","Repair storms on unbalanced nodes","Cascading failures from load imbalance"],
          mitigations: ["Use virtual nodes (vnodes)","Rebalance cluster after topology changes","Monitor token distribution","Implement proper rack awareness","Run cleanup after node join"],
          metrics: ["Tokens per node","Partitions per node","Token distribution skew","Disk usage per node","Request distribution"],
          tradeoffs: ["Rebalancing causes data movement","vnodes increase compaction load","Cleanup reduces availability"]
        },
        {
          name: "Replica",
          title: "Replica placement & replication factor",
          description: "Cassandra replicates data to multiple nodes based on replication factor. Poor replica placement or replication factor mismatches can concentrate replicas on overloaded nodes.",
          symptoms: ["All replicas concentrated on few nodes","Some nodes receiving all replica writes","Replication lag on specific nodes","Uneven write load across cluster"],
          causes: ["Replication factor too low for replication strategy","Rack awareness not configured","Data center topology misunderstood","Replicas placed on same rack"],
          effects: ["Write load concentrated on few nodes","Replication bottleneck","Lack of fault tolerance","Coordinated failures possible"],
          mitigations: ["Increase replication factor","Configure rack awareness properly","Tune replication strategy","Monitor replica distribution","Implement multi-DC replication"],
          metrics: ["Replicas per node","Replication latency","Write load distribution","Replica placement distribution","Repair success rate"],
          tradeoffs: ["Higher replication factor increases storage","Cross-DC replication adds latency","Complex topology is harder to manage"]
        },
        {
          name: "Workload",
          title: "Uneven query workload distribution",
          description: "Even with balanced data distribution, queries can be uneven if clients are biased toward certain data ranges or if certain partitions are accessed much more frequently.",
          symptoms: ["One node CPU spiking despite balanced data","Read traffic not evenly distributed","Specific partition requests dominating","Node load varies by time of day"],
          causes: ["Client-side key distribution bias","Cache locality bias from application","Popular data in few partitions","Time-series access patterns"],
          effects: ["Bottleneck node limits throughput","Other nodes underutilized","Tail latency from hotspot","Cascading impact to application"],
          mitigations: ["Implement client-side load balancing","Cache hot partitions externally","Denormalize data for access patterns","Use caching layer","Monitor and redistribute load"],
          metrics: ["Requests per partition","CPU per node","Request latency distribution","Cache hit ratio","Hot partition detection"],
          tradeoffs: ["Denormalization increases storage","External caching adds complexity","Load balancing adds latency"]
        }
      ],
      comparisons: [
        { tech: "Kafka", problem: "Hot partitions" },
        { tech: "MongoDB", problem: "Hot shards" },
        { tech: "DynamoDB", problem: "Partition key hotspotting" },
        { tech: "Elasticsearch", problem: "Hot shards" },
        { tech: "HBase", problem: "Region hotspotting" }
      ],
      insight: "Cassandra data distribution imbalance is fundamentally a schema and token design problem. Poor partition key selection is irreversible without re-seeding the table. Understanding token ring topology, replication strategy, and partition key cardinality is essential for scalable Cassandra operations."
    },
  "cassandra-tombstones": {
      header: {
        eyebrow: "Cassandra — delete-heavy workloads",
        title: "Read amplification and tombstones",
        description: "Guide covering tombstone-heavy reads, timeout risk, and modeling patterns that reduce scan amplification."
      },
      synonyms: ["Tombstone explosion","Slow reads","Read amplification","Tombstone scan overhead","Delete-heavy degradation","TTL debt","Range scan blowup","Read timeout pressure"],
      questions: ["Why do reads time out on tombstone-heavy partitions?","How do TTL and deletes impact query latency?","How can I detect tombstone hotspots?","Which schema changes reduce tombstone overhead?"],
      layers: [
        {
          name: "Modeling",
          title: "Schema and delete pattern drivers",
          description: "Data model and delete/TTL behavior determine tombstone volume and persistence.",
          symptoms: ["High tombstones per partition","Latency growth over data age","Frequent read timeouts on specific tables"],
          causes: ["Delete-heavy workflows","Broad TTL on high-churn tables","Very wide partitions"],
          effects: ["Read amplification","Increased CPU and IO","Query instability"],
          mitigations: ["Model for bounded partition size","Use targeted TTL/deletes","Avoid unnecessary tombstone generation"],
          metrics: ["Tombstones per read","Partition width","Timeouts by table","Read latency trend"],
          tradeoffs: ["Data-model refactors are expensive","Reducing TTL may increase retained data volume"]
        },
        {
          name: "Read Path",
          title: "Merge and scan overhead during reads",
          description: "Reads merge data across SSTables and skip tombstones, raising cost significantly.",
          symptoms: ["High read latency with moderate traffic","Large SSTable fan-in for reads","Increased CPU on read-heavy nodes"],
          causes: ["Too many SSTables touched per query","Inefficient range scans","Unbounded query patterns"],
          effects: ["Tail-latency spikes","User-visible timeouts","Lower cluster throughput"],
          mitigations: ["Constrain query ranges","Improve partition key/selectivity","Tune compaction to reduce SSTable fan-in"],
          metrics: ["SSTables per read","Read CPU time","P99 read latency","Timeout rate"],
          tradeoffs: ["Narrower queries may require more requests","Compaction tuning may increase background IO"]
        },
        {
          name: "Compaction",
          title: "Tombstone purge timing and backlog",
          description: "Tombstones are only purged during compaction after grace conditions, so backlog can persist.",
          symptoms: ["Tombstones linger for long periods","Compaction cannot keep up","Performance stays degraded despite deletes"],
          causes: ["Slow compaction cadence","Large datasets with limited IO","Misaligned gc_grace_seconds and repair practices"],
          effects: ["Persistent read overhead","Operational complexity","Long-lived performance debt"],
          mitigations: ["Align repair cadence and grace settings safely","Increase compaction capacity","Prioritize affected keyspaces"],
          metrics: ["Tombstone purge rate","Compaction backlog","Age of tombstones","Repair cadence adherence"],
          tradeoffs: ["Aggressive purge settings can risk data resurrection if repairs are weak","More compaction capacity increases cost"]
        },
        {
          name: "Operations",
          title: "Detection and guardrails",
          description: "Continuous detection prevents tombstone debt from silently accumulating.",
          symptoms: ["Late detection after user complaints","Repeated incidents on same tables","Unclear ownership of schema fixes"],
          causes: ["No tombstone SLO alerts","Insufficient table-level observability","Reactive operational process"],
          effects: ["Recurring outages","Unplanned schema migrations","Higher toil"],
          mitigations: ["Alert on tombstones/read thresholds","Table-level ownership and review","Pre-production load testing on delete patterns"],
          metrics: ["Incidents per quarter","Threshold breach frequency","Mean time to detect","Schema review compliance"],
          tradeoffs: ["More guardrails slow schema changes","Extra telemetry adds operational overhead"]
        }
      ],
      comparisons: [
        { tech: "PostgreSQL", problem: "Bloat and vacuum debt" },
        { tech: "Elasticsearch", problem: "Deleted-doc merge debt" },
        { tech: "MongoDB", problem: "Fragmentation and scan overhead" },
        { tech: "Kafka", problem: "Log compaction lag" },
        { tech: "Redis", problem: "Key churn and eviction pressure" }
      ],
      insight: "Tombstone incidents are usually model-plus-maintenance problems. If delete behavior and compaction/repair cadence are misaligned, read paths eventually become unstable."
    },
  "elasticsearch-indexing": {
      header: {
        eyebrow: "Elasticsearch — write path performance",
        title: "Indexing and merge backpressure",
        description: "Guide covering indexing lag, merge backlog, refresh pressure, and write/search contention."
      },
      synonyms: ["Indexing lag","Merge pressure","Segment merge backlog","Write backpressure","Refresh pressure","Bulk indexing bottleneck","Translog pressure","Ingest saturation"],
      questions: ["Why does indexing throughput drop under sustained writes?","How do merges impact search latency?","Why are bulk requests timing out?","How do refresh settings affect write performance?"],
      layers: [
        {
          name: "Ingest",
          title: "Bulk ingest throughput and rejection behavior",
          description: "Ingest pipelines and write thread pools can saturate under high sustained volume.",
          symptoms: ["Bulk request rejections","Indexing queue growth","Ingest latency spike"],
          causes: ["Bulk size too large","Insufficient ingest node capacity","Pipeline processor overhead"],
          effects: ["Delayed data availability","Error retries and amplification","Write-path instability"],
          mitigations: ["Tune bulk size/concurrency","Scale ingest capacity","Optimize expensive ingest processors"],
          metrics: ["Indexing throughput","Bulk rejection rate","Ingest latency","Thread pool queue depth"],
          tradeoffs: ["Higher concurrency improves throughput but increases contention","Lighter pipelines improve speed but may reduce transformation fidelity"]
        },
        {
          name: "Refresh",
          title: "Refresh interval and visibility pressure",
          description: "Frequent refreshes improve freshness but reduce indexing efficiency.",
          symptoms: ["Lower indexing throughput with tight refresh intervals","CPU and IO churn","Search/index interference"],
          causes: ["Very low refresh interval on heavy-write indices","High shard count with frequent refresh","Concurrent search load"],
          effects: ["Write throughput ceiling","Latency volatility","Increased resource consumption"],
          mitigations: ["Use larger refresh interval for heavy ingest periods","Separate hot-write and hot-search indices when possible","Align freshness goals with business need"],
          metrics: ["Refresh time","Refresh frequency","Indexing throughput vs refresh setting","Search latency impact"],
          tradeoffs: ["Longer refresh improves throughput but delays document visibility","Short refresh improves freshness but raises overhead"]
        },
        {
          name: "Merge",
          title: "Segment merge backlog and IO contention",
          description: "Segment merges are essential but can saturate IO and throttle indexing/search.",
          symptoms: ["Pending merges accumulate","Merge time spikes","Node IO wait increases"],
          causes: ["High segment creation rate","Underpowered storage","Concurrent heavy indexing and querying"],
          effects: ["Indexing slowdown","Search latency spikes","Cluster instability during peaks"],
          mitigations: ["Tune merge policy and throttles","Use faster storage for hot nodes","Stagger heavy indexing jobs"],
          metrics: ["Pending merge count","Merge time","Disk IO wait","Indexing latency"],
          tradeoffs: ["Higher merge throughput reduces backlog but can hurt foreground traffic","Lower merge pressure protects latency but extends indexing debt"]
        },
        {
          name: "Operations",
          title: "Backpressure-aware operating model",
          description: "Operational workflows should manage ingest surges before they trigger sustained write debt.",
          symptoms: ["Frequent ingest incidents during batch windows","Recovery takes long after traffic peaks","Repeated emergency tuning changes"],
          causes: ["No ingestion guardrails","No staged batch ingestion","Insufficient capacity planning for peak writes"],
          effects: ["Burned error budgets","Operational churn","Unpredictable search freshness"],
          mitigations: ["Define ingestion SLOs and cutoffs","Use scheduled/staggered bulk jobs","Pre-scale for known indexing events"],
          metrics: ["Ingest incident count","Time-to-recover from backlog","SLO compliance for freshness","Capacity headroom during peak"],
          tradeoffs: ["Guardrails can throttle business throughput during peaks","Peak headroom adds infrastructure cost"]
        }
      ],
      comparisons: [
        { tech: "Cassandra", problem: "Compaction backlog under write load" },
        { tech: "Kafka", problem: "Log IO pressure under sustained writes" },
        { tech: "MongoDB", problem: "Checkpoint/write pressure" },
        { tech: "PostgreSQL", problem: "Write amplification under heavy updates" },
        { tech: "Redis", problem: "AOF persistence pressure" }
      ],
      insight: "Indexing reliability in Elasticsearch is debt management: ingest creates segment debt, and merges repay it. Stability depends on matching creation and repayment rates."
    },
  "elasticsearch-memory": {
      header: {
        eyebrow: "Elasticsearch — JVM memory behavior",
        title: "Heap and memory pressure",
        description: "Guide covering heap exhaustion, GC pressure, memory circuit breakers, and query-memory tradeoffs."
      },
      synonyms: ["GC pressure","Heap exhaustion","Old-gen saturation","Circuit breaker trips","Fielddata pressure","Heap thrashing","JVM memory pressure","GC pause spikes"],
      questions: ["Why are Elasticsearch nodes spending too much time in GC?","What causes circuit breaker exceptions?","How do aggregations impact heap?","How should heap be sized relative to filesystem cache?"],
      layers: [
        {
          name: "Queries",
          title: "Query and aggregation memory demand",
          description: "Search and aggregation workloads can consume heap quickly under concurrency.",
          symptoms: ["GC pauses increase during heavy queries","Circuit breaker exceptions","Search latency spikes"],
          causes: ["High-cardinality aggregations","Large result windows","Excessive concurrent heavy queries"],
          effects: ["Request rejections","Tail-latency inflation","Node instability"],
          mitigations: ["Constrain expensive query patterns","Use pagination/search_after wisely","Pre-aggregate where possible"],
          metrics: ["Query memory usage","Breaker trip count","Search latency percentiles","Rejected requests"],
          tradeoffs: ["Tighter limits improve stability but may block analytical queries","Richer query capability increases memory risk"]
        },
        {
          name: "Heap",
          title: "JVM heap occupancy and GC behavior",
          description: "Heap pressure and GC tuning directly affect latency and throughput stability.",
          symptoms: ["Old-gen near full","Long stop-the-world pauses","Throughput drops during GC cycles"],
          causes: ["Heap undersized for workload","Object churn from heavy query patterns","Poor GC tuning defaults for workload"],
          effects: ["Latency outliers","Node eviction risk","Cluster rebalancing churn"],
          mitigations: ["Right-size heap and workload limits","Tune GC with production data","Reduce allocation-heavy query patterns"],
          metrics: ["Heap used percent","Old-gen occupancy","GC pause duration","GC frequency"],
          tradeoffs: ["Larger heap reduces frequency but can increase pause duration","Smaller heap improves cache availability but raises GC pressure"]
        },
        {
          name: "Data Structures",
          title: "Fielddata/doc values and cache pressure",
          description: "Fielddata and related structures can consume large memory unexpectedly.",
          symptoms: ["Memory growth on specific fields","Frequent evictions from caches","Unpredictable node memory behavior"],
          causes: ["Text field aggregations without keyword strategy","Overuse of fielddata","Broad query patterns with low selectivity"],
          effects: ["Heap contention","Search slowdowns","Stability regressions"],
          mitigations: ["Use keyword/doc_values appropriately","Restrict expensive field usage","Implement query linting for dangerous patterns"],
          metrics: ["Fielddata memory","Query cache hit ratio","Eviction count","Field-level usage hotspots"],
          tradeoffs: ["Restricting fields improves stability but limits ad-hoc analytics","More index fields improve flexibility but increase index cost"]
        },
        {
          name: "Recovery",
          title: "Memory pressure impact on cluster recovery",
          description: "Memory-stressed nodes recover slowly and can trigger cascading reallocation.",
          symptoms: ["Frequent node restarts","Shard relocation churn","Prolonged yellow/red states"],
          causes: ["OOM events","Insufficient headroom during peak traffic","Heavy recovery traffic plus live load"],
          effects: ["Extended degraded cluster state","Higher operational risk","SLO misses"],
          mitigations: ["Reserve memory headroom for recovery","Throttle recovery if needed","Stage heavy operations away from peak windows"],
          metrics: ["Node restart count","Recovery duration","Shard relocation events","Cluster health transitions"],
          tradeoffs: ["More headroom improves resilience but lowers nominal utilization","Throttled recovery reduces pressure but extends convergence time"]
        }
      ],
      comparisons: [
        { tech: "JVM services", problem: "GC pause amplification" },
        { tech: "Redis", problem: "Memory ceiling pressure" },
        { tech: "MongoDB", problem: "Working set overflow" },
        { tech: "Cassandra", problem: "Heap/compaction contention" },
        { tech: "Kafka", problem: "Page cache pressure under IO load" }
      ],
      insight: "Elasticsearch memory incidents are frequently query-shape incidents. Capacity planning must include workload guardrails, not only bigger nodes."
    },
  "elasticsearch-query": {
      header: {
        eyebrow: "Elasticsearch — distributed search & analytics",
        title: "Query execution pressure",
        description: "Staff+/Principal-level guide covering slow searches, aggregation bottlenecks, query execution backpressure, and concurrent search pressure in Elasticsearch clusters."
      },
      synonyms: ["Slow searches","Aggregation pressure","Query backpressure","Search thread pool saturation","Query latency explosion","Expensive searches","Bulk query pressure","Search queue buildup"],
      questions: ["Why is my Elasticsearch search latency increasing?","How do I optimize slow aggregations?","What causes query backpressure in Elasticsearch?","Why is the search thread pool saturated?","How do I detect expensive queries?","Why are some nodes handling more search load?","What causes query queue buildup?","How do I scale Elasticsearch for high query volume?"],
      layers: [
        {
          name: "Query",
          title: "Slow searches & inefficient queries",
          description: "Elasticsearch searches can be slow due to inefficient query logic, missing optimizations, or expensive filtering. Each slow query consumes thread pool resources, reducing capacity for other queries.",
          symptoms: ["Search latency increasing","High query per second consuming resources","Thread pool queue building up","Some shards taking much longer"],
          causes: ["Inefficient query DSL (nested queries)","Missing filters that could reduce search space","Complex wildcard searches","Script-based scoring"],
          effects: ["Latency tail increase from slow queries","Thread pool exhaustion","Other queries queued waiting","Complete search timeout"],
          mitigations: ["Optimize query DSL","Use filters instead of queries where possible","Implement query caching","Add appropriate indexes","Profile slow queries"],
          metrics: ["Query latency percentiles","Queries per second","Slow query log entries","Thread pool usage","Query cache hit ratio"],
          tradeoffs: ["Query optimization takes analysis time","More indexes increase write overhead","Query caching has memory cost"]
        },
        {
          name: "Aggregation",
          title: "Aggregation pipeline bottlenecks",
          description: "Aggregations (facets, histograms, cardinality) scan many documents and build in-memory structures. Complex nested aggregations can become severe bottlenecks.",
          symptoms: ["Aggregation latency much higher than search","Memory pressure during aggregations","Concurrent aggregations blocking","Aggregation timeouts"],
          causes: ["High cardinality aggregations (unique users)","Nested aggregations on large datasets","Cardinality estimation on unbounded fields","Aggregation on non-indexed fields"],
          effects: ["Latency explosion from aggregations","Memory exhaustion","Other queries blocked","Complete service degradation"],
          mitigations: ["Use approximate cardinality (HyperLogLog)","Implement pre-aggregation","Reduce aggregation scope","Use keyword instead of text fields","Sample large datasets"],
          metrics: ["Aggregation latency","Memory per aggregation","Aggregation throughput","Cardinality estimation error","Pre-aggregation hit rate"],
          tradeoffs: ["Approximate cardinality reduces accuracy","Pre-aggregation adds latency to indexing","Sampling reduces result accuracy"]
        },
        {
          name: "Concurrency",
          title: "Search thread pool saturation",
          description: "Elasticsearch uses fixed-size thread pools for search. When concurrent queries exceed thread pool size, new queries queue and wait. Thread pool saturation causes latency explosion.",
          symptoms: ["Search thread pool at max queue","Requests being rejected","Latency increasing with concurrent queries","Search timeout errors"],
          causes: ["Slow queries consuming all threads","Too many concurrent requests for cluster","Thread pool size too small","Uneven query distribution"],
          effects: ["New queries queued and delayed","Latency increases quadratically","Cascading timeouts","Service unavailability"],
          mitigations: ["Increase thread pool size","Reduce per-query latency","Implement circuit breakers","Scale cluster nodes","Add request deduplication"],
          metrics: ["Search thread pool active","Search thread pool queue length","Request rejection rate","Queue wait latency","Thread pool utilization"],
          tradeoffs: ["Larger thread pools increase memory","Optimizing queries takes effort","Scaling adds cost"]
        },
        {
          name: "Distribution",
          title: "Uneven query load distribution",
          description: "Some shards or nodes can receive disproportionate query load, becoming bottlenecks while other nodes sit idle. Query load imbalance limits effective throughput.",
          symptoms: ["One shard much slower than others","One node CPU high","Shard query latency variable","Scatter-gather very uneven"],
          causes: ["Hot shard receiving more requests","Uneven data distribution","Replica imbalance","Client-side routing issues"],
          effects: ["Slowest shard limits query latency","Other shards underutilized","Effective throughput limited","Tail latency from slowest shard"],
          mitigations: ["Rebalance shard distribution","Implement client-side request routing","Use preferred nodes","Monitor shard metrics","Implement hot shard detection"],
          metrics: ["Query latency per shard","Query rate per shard","CPU per shard","GC pressure per node","Scatter-gather latency"],
          tradeoffs: ["Rebalancing causes cluster churn","Client-side routing increases complexity","Hot shard mitigation requires code changes"]
        }
      ],
      comparisons: [
        { tech: "MongoDB", problem: "Query execution pressure" },
        { tech: "PostgreSQL", problem: "Slow query execution" },
        { tech: "Cassandra", problem: "Partition scan latency" },
        { tech: "Solr", problem: "Query handler thread saturation" },
        { tech: "Kafka", problem: "Fetch request backpressure" }
      ],
      insight: "Elasticsearch query execution pressure is fundamentally about matching query complexity to cluster capacity. Unlike databases where slow queries are individual incidents, in Elasticsearch, slow queries have systemic effects by consuming shared thread pool resources. Strong Elasticsearch operators understand this multiplier effect: each slow query degrades service for other queries. Query optimization is not optional; it's essential for cluster stability."
    },
  "elasticsearch-shards": {
      header: {
        eyebrow: "Elasticsearch — shard allocation health",
        title: "Shard distribution imbalance",
        description: "Guide covering hot shards, uneven allocation, relocation churn, and node-level skew effects."
      },
      synonyms: ["Hot shards","Uneven allocation","Shard skew","Node hotspotting","Allocation imbalance","Query hotspot shard","Primary skew","Relocation churn"],
      questions: ["Why is one Elasticsearch node overloaded?","How does shard imbalance impact latency?","What causes allocation skew after scaling events?","How do you rebalance shards safely?"],
      layers: [
        {
          name: "Allocation",
          title: "Shard placement and allocation deciders",
          description: "Allocation rules can concentrate load if shard count or constraints are poorly tuned.",
          symptoms: ["Shards per node highly uneven","Node CPU skew","Frequent balancing events"],
          causes: ["Unbalanced shard count strategy","Overly strict allocation rules","Recent topology changes"],
          effects: ["Localized bottlenecks","Inefficient cluster capacity usage","Higher incident probability"],
          mitigations: ["Review shard sizing and count","Tune allocation awareness pragmatically","Rebalance with controlled pace"],
          metrics: ["Shards per node","CPU/heap variance","Relocation events","Allocation decision failures"],
          tradeoffs: ["Aggressive balancing improves utilization but adds churn","Conservative balancing reduces churn but may keep hotspots longer"]
        },
        {
          name: "Query Path",
          title: "Hot shard query concentration",
          description: "Traffic concentration on specific shards drives node hotspots even with balanced storage.",
          symptoms: ["One shard dominates query time","Tail latency tied to shard subset","Replica nodes unevenly loaded"],
          causes: ["Skewed tenant/data access","Query routing bias","Index strategy concentrating hot data"],
          effects: ["P99 degradation","Reduced throughput","Localized failures under peak"],
          mitigations: ["Adjust routing/index design","Use adaptive replica selection","Split or reindex hot datasets"],
          metrics: ["Query rate per shard","Latency per shard","Hot shard hit ratio","Node request distribution"],
          tradeoffs: ["Reindexing improves distribution but is operationally expensive","More shards increase parallelism but raise overhead"]
        },
        {
          name: "Topology",
          title: "Scaling events and relocation side effects",
          description: "Node adds/removes can induce temporary imbalance and performance volatility.",
          symptoms: ["Latency spikes during relocation","Recovery traffic saturates nodes","Persistent skew after scale changes"],
          causes: ["Too many concurrent relocations","Insufficient relocation throttling","Unbalanced node hardware profiles"],
          effects: ["Transient SLO breaches","Long stabilization windows","Operator fatigue"],
          mitigations: ["Throttle relocation during traffic peaks","Use hardware-consistent node groups","Verify post-scale balance checks"],
          metrics: ["Relocation throughput","Recovery duration","Latency during topology changes","Post-change skew score"],
          tradeoffs: ["Slow relocations improve stability but delay balance","Fast relocations recover quicker but risk user impact"]
        },
        {
          name: "Operations",
          title: "Continuous skew detection and controls",
          description: "Preventive controls catch emerging imbalance before it becomes incident-grade.",
          symptoms: ["Hotspot incidents recur on same indices","Late detection after user-facing impact","Manual balancing becomes routine"],
          causes: ["No shard-level SLOs","Weak anomaly detection","Reactive-only balancing process"],
          effects: ["Repeat incidents","Higher toil","Unpredictable performance"],
          mitigations: ["Establish shard skew alerts","Automate periodic balance checks","Define ownership for index lifecycle decisions"],
          metrics: ["Skew incident frequency","Alert lead time","Manual rebalance count","SLO compliance by index"],
          tradeoffs: ["More automation requires robust safeguards","More governance slows ad-hoc index changes"]
        }
      ],
      comparisons: [
        { tech: "Kafka", problem: "Hot partitions and broker skew" },
        { tech: "MongoDB", problem: "Hot shards" },
        { tech: "Cassandra", problem: "Token imbalance" },
        { tech: "Kubernetes", problem: "Placement skew across nodes" },
        { tech: "API Gateway", problem: "Route-level hotspotting" }
      ],
      insight: "Shard skew is not just a data-size issue; it is a traffic and topology issue. Healthy clusters balance both bytes and requests."
    },
  "kafka-coordination": {
    "header": {
        "eyebrow": "Kafka — cluster coordination",
        "title": "Cluster coordination instability",
        "description": "Guide covering rebalance storms, group churn, heartbeat failures, and unstable partition assignment behavior."
    },
    "synonyms": [
        "Rebalance storms",
        "Group churn",
        "Coordination failures",
        "Membership flapping",
        "Heartbeat failures",
        "Assignment thrashing",
        "Coordinator overload",
        "Session timeout churn"
    ],
    "questions": [
        "Why are consumer groups rebalancing continuously?",
        "How do heartbeat and session timeout settings interact?",
        "How does autoscaling trigger group churn?",
        "How do you stop partition ownership flapping?"
    ],
    "layers": [
        {
            "name": "Coordinator",
            "title": "Group coordinator pressure",
            "description": "Coordinator nodes can become overloaded by frequent joins, leaves, and metadata updates.",
            "symptoms": [
                "Frequent group state transitions",
                "Long rebalance times",
                "Join/sync latency spikes"
            ],
            "causes": [
                "Many consumer instances restarting",
                "Coordinator hotspotting",
                "Large groups with frequent membership change"
            ],
            "effects": [
                "Processing pauses during rebalances",
                "Lag jumps after each rebalance",
                "Operational instability"
            ],
            "mitigations": [
                "Use static group membership where possible",
                "Reduce churn from deployments",
                "Distribute coordinator load"
            ],
            "metrics": [
                "Rebalances per hour",
                "JoinGroup/SyncGroup latency",
                "Coordinator request rate",
                "Group state transition count"
            ],
            "tradeoffs": [
                "Longer timeouts reduce churn but slow failover",
                "Static membership reduces flexibility during dynamic scaling"
            ]
        },
        {
            "name": "Members",
            "title": "Heartbeat and session timing failures",
            "description": "Consumers missing heartbeats are evicted, forcing full or partial reassignment.",
            "symptoms": [
                "Consumers repeatedly leave and rejoin",
                "Missed heartbeat logs",
                "Partition reassignments under CPU spikes"
            ],
            "causes": [
                "GC pauses or CPU starvation",
                "Network jitter",
                "Tight session timeouts"
            ],
            "effects": [
                "Duplicate processing risk",
                "Ordering disruption windows",
                "Throughput drops during rebalance"
            ],
            "mitigations": [
                "Tune heartbeat/session/max poll intervals",
                "Avoid long blocking calls in poll loop",
                "Set CPU/memory headroom"
            ],
            "metrics": [
                "Heartbeat failure count",
                "Poll interval breaches",
                "Consumer process GC pauses",
                "Member eviction rate"
            ],
            "tradeoffs": [
                "Relaxed intervals improve stability but delay unhealthy member detection",
                "Overly strict intervals increase false evictions"
            ]
        },
        {
            "name": "Deployments",
            "title": "Release and autoscaling induced churn",
            "description": "Rolling updates and horizontal autoscaling can create membership churn if uncontrolled.",
            "symptoms": [
                "Rebalance spikes during deploy windows",
                "Throughput dips on scale events",
                "Lag never fully recovers"
            ],
            "causes": [
                "Large concurrent pod restarts",
                "Scale oscillation",
                "No graceful shutdown handling"
            ],
            "effects": [
                "Frequent stop-the-world consumer phases",
                "Tail latency increase",
                "Reduced effective capacity"
            ],
            "mitigations": [
                "Stagger rollouts",
                "Graceful partition revocation handling",
                "Stabilize autoscaling thresholds"
            ],
            "metrics": [
                "Deploy-time rebalance count",
                "Scale up/down frequency",
                "Lag recovery time",
                "Consumer availability during rollout"
            ],
            "tradeoffs": [
                "Slower rollouts improve stability but delay release speed",
                "Autoscaling hysteresis reduces oscillation but reacts slower to surges"
            ]
        },
        {
            "name": "Topology",
            "title": "Metadata and partition topology churn",
            "description": "Frequent partition movement or leader changes can amplify coordination instability.",
            "symptoms": [
                "Leader election churn",
                "Metadata refresh spikes",
                "Temporary assignment inconsistencies"
            ],
            "causes": [
                "Aggressive reassignments",
                "Broker instability",
                "Frequent topology changes"
            ],
            "effects": [
                "Consumer pause windows",
                "Inconsistent fetch performance",
                "Higher operational risk"
            ],
            "mitigations": [
                "Plan reassignment windows carefully",
                "Stabilize broker health before rebalance operations",
                "Limit concurrent topology changes"
            ],
            "metrics": [
                "Leader election count",
                "Metadata update rate",
                "Partition movement events",
                "Assignment convergence time"
            ],
            "tradeoffs": [
                "Faster balancing can increase short-term turbulence",
                "Conservative balancing prolongs uneven load"
            ]
        }
    ],
    "comparisons": [
        { "tech": "Kubernetes", "problem": "Control-plane scheduling churn" },
        { "tech": "Zookeeper/etcd", "problem": "Coordination hot spots" },
        { "tech": "API Gateway", "problem": "Config rollout instability" },
        { "tech": "MongoDB", "problem": "Replica state flapping" },
        { "tech": "Elasticsearch", "problem": "Shard relocation churn" }
    ],
    "insight": "Kafka coordination issues are usually churn problems, not raw capacity problems. Reducing membership and topology volatility is often the fastest path to stability."
},
  "kafka-partition": {
      header: {
        eyebrow: "Kafka — distributed systems",
        title: "Partitioning & data distribution imbalance",
        description: "Staff+/Principal-level guide covering partition skew, broker hotspotting, consumer imbalance, and workload distribution failures across the Kafka stack."
      },
      synonyms: ["Hot partitions","Partition skew","Broker hotspotting","Uneven consumer load","Traffic skew","Data skew","Consumer skew","Uneven partition distribution"],
      questions: ["What happens if one Kafka partition becomes very hot?","How do you debug uneven Kafka consumer lag?","How would you handle partition skew in Kafka?","Why would one Kafka broker have significantly higher CPU usage?","How do bad partition keys affect Kafka scalability?","Why does adding more consumers not improve throughput sometimes?"],
      layers: [
        {
          name: "Producer",
          title: "Producer layer distribution imbalance",
          description: "The producer determines which partition receives a message using partition keys and hashing logic. Poor partition key design is one of the most common causes of hotspotting.",
          symptoms: ["One partition gets far higher traffic","One broker CPU spikes disproportionately","One consumer constantly lags","Uneven network throughput across brokers"],
          causes: ["Low-cardinality keys (e.g. country_code)","Tenant hotspotting from one large customer","Time-based burst traffic on specific keys","Sticky partitioner batching behavior"],
          effects: ["Localized broker saturation","Consumer lag accumulation","Reduced parallelism efficiency","Increased replication pressure"],
          mitigations: ["Use high-cardinality partition keys","Apply composite partition keys","Introduce key salting","Increase partition count carefully"],
          metrics: ["Partition-level throughput","Bytes in/out per broker","Consumer lag per partition","Broker CPU utilization"],
          tradeoffs: ["More partitions increase metadata overhead","Key salting weakens strict ordering guarantees"]
        },
        {
          name: "Broker",
          title: "Broker layer distribution imbalance",
          description: "Even logically balanced traffic can cause uneven broker load due to leadership concentration or operational partition movement.",
          symptoms: ["One broker consistently hotter than others","Uneven disk usage across cluster","Localized broker throttling","High network utilization on specific brokers"],
          causes: ["Uneven partition reassignment","Leadership imbalance","Rack-awareness misconfiguration","Hot partitions concentrated on few brokers"],
          effects: ["Broker instability","ISR shrink","Leader election churn","Cluster-wide throughput degradation"],
          mitigations: ["Preferred leader election","Partition reassignment balancing","Rack-aware placement","Broker scaling"],
          metrics: ["Leader partition count","Broker disk usage","Broker network throughput","Replication fetch latency"],
          tradeoffs: ["Frequent reassignment may temporarily destabilize the cluster","More brokers increase operational complexity"]
        },
        {
          name: "Consumer",
          title: "Consumer layer distribution imbalance",
          description: "Consumer groups rely on partition-to-consumer assignment. Hot partitions naturally create overloaded consumers even when the consumer group is large.",
          symptoms: ["One consumer constantly lagging","Other consumers mostly idle","Uneven CPU utilization across group","Slow dashboard freshness"],
          causes: ["Hot partitions upstream","Insufficient partition count","Uneven batch sizes","Blocking downstream dependencies"],
          effects: ["Consumer lag growth","Inefficient autoscaling","Reduced processing throughput","SLA degradation"],
          mitigations: ["Increase partition count","Improve partition key distribution","Optimize downstream processing","Adaptive consumer scaling"],
          metrics: ["Lag per partition","Consumer throughput","Processing latency","Consumer CPU usage"],
          tradeoffs: ["More consumers do not help when partition count is low","Over-scaling consumers may increase rebalance overhead"]
        },
        {
          name: "Storage",
          title: "Storage layer distribution imbalance",
          description: "Hot partitions create uneven disk growth and storage IO pressure across brokers, which can cascade into replication and stability issues.",
          symptoms: ["One broker disk nearly full","Flush latency spikes","Page cache pressure","Replication slowdown"],
          causes: ["Partition skew","Uneven retention configuration","Replication concentration","Hot broker assignment"],
          effects: ["Replication lag","ISR shrink","Broker instability","Potential cascading cluster failures"],
          mitigations: ["Partition rebalancing","Tiered storage","Retention tuning","Broker scaling"],
          metrics: ["Disk utilization","IO wait","Page cache hit ratio","Replication lag"],
          tradeoffs: ["Longer retention improves replay but amplifies storage pressure","Tiered storage adds operational complexity"]
        }
      ],
      comparisons: [
        { tech: "MongoDB", problem: "Hot shards" },
        { tech: "Redis", problem: "Hot keys" },
        { tech: "Cassandra", problem: "Hot partitions" },
        { tech: "Elasticsearch", problem: "Hot shards" },
        { tech: "Kubernetes", problem: "Uneven pod distribution" }
      ],
      insight: "Distributed systems scale efficiently only when workload distribution remains balanced across compute, storage, network, and coordination layers."
    },
  "kafka-storage": {
      header: {
        eyebrow: "Kafka — distributed systems",
        title: "Storage & replication pressure",
        description: "Staff+/Principal-level guide covering disk throughput bottlenecks, replication lag, ISR shrink, segment management pressure, and storage-bound scalability failures."
      },
      synonyms: ["Replication lag","ISR shrink","Under replicated partitions","Broker saturation","Disk pressure","IO saturation","Replication bottleneck","Replica fetch lag","Storage bottleneck","Disk throughput exhaustion","Broker IO pressure","Kafka disk saturation"],
      questions: ["Why do Kafka partitions become under replicated?","How would you debug ISR shrink in Kafka?","Why does producer latency increase even though consumers are healthy?","How does disk saturation impact Kafka throughput?","What causes Kafka replication lag?","Why does Kafka performance degrade during retention spikes?","How does replication factor affect Kafka scalability?","What happens when follower brokers cannot keep up?"],
      layers: [
        {
          name: "Broker Disk",
          title: "Broker disk layer pressure",
          description: "Kafka relies heavily on fast sequential disk IO. Every broker continuously appends logs, flushes segments, serves reads, and performs replication writes. When disk throughput becomes saturated, broker responsiveness degrades rapidly, especially in high-throughput clusters and large retention systems.",
          symptoms: ["Increased producer latency from slow persistence","Followers fall behind leaders (ISR shrink)","Broker request queue grows continuously","Disk utilization near 100% with IO wait spikes","Consumer fetch latency increases"],
          causes: ["Insufficient disk throughput for traffic (HDDs with SSD-scale traffic)","Large message sizes (10MB+ payloads)","Excessive retention (90+ days on high-throughput topics)","Excessive partition count (too many open file handles)","Broker hotspotting with many hot partitions"],
          effects: ["Producer timeout failures and slow acknowledgements","Replication instability and followers lagging","ISR shrinks, reducing fault tolerance","Consumer lag from delayed fetch responses","Cluster-wide cascading instability"],
          mitigations: ["Upgrade to SSD/NVMe storage","Reduce message sizes and move blobs externally","Rebalance partitions to avoid hotspotting","Reduce retention for ultra-hot topics","Tune segment.bytes and retention.bytes","Increase broker count to spread load"],
          metrics: ["Disk utilization","IO wait","Log flush latency","Request queue size","Bytes in/out","Under replicated partitions"],
          tradeoffs: ["More brokers increase operational complexity","Lower retention reduces replay capability","Larger segment sizes slow recovery and compaction"]
        },
        {
          name: "Replication",
          title: "Replica synchronization pressure",
          description: "Followers continuously fetch data from leaders via replication pipelines. If replication throughput cannot keep up with leader writes, followers lag behind, ISR shrinks, and replication instability appears.",
          symptoms: ["Replica fetch lag growing","Under replicated partitions increasing","Fluctuating ISR counts","Producer ack delays for acks=all","Follower disks struggling with write rate"],
          causes: ["Slow follower disks unable to persist replicated data","Network bottlenecks between brokers","Overloaded brokers handling too many replicas","Cross-AZ latency amplifying replication time","Excessive replication factor for topology"],
          effects: ["Weaker fault tolerance with smaller ISR","Increased write latency for durability","Leader election instability","Risk of unclean elections and data loss","Cascading failures across cluster"],
          mitigations: ["Faster replication network paths","Reduce broker imbalance and hotspotting","Tune replica.fetch.max.bytes for optimal throughput","Reduce replication factor where appropriate","Separate replication traffic from client traffic"],
          metrics: ["Replica fetch lag","ISR size per partition","Replication fetch rate","Network latency between brokers","Follower disk write latency"],
          tradeoffs: ["Lower replication factor reduces durability","Dedicated replication bandwidth increases complexity","Tuning fetch sizes impacts memory usage"]
        },
        {
          name: "Retention",
          title: "Retention & segment management pressure",
          description: "Kafka continuously rolls segments, deletes old segments, and compacts logs. Heavy retention activity creates significant storage housekeeping pressure that competes with replication and client fetch operations.",
          symptoms: ["Disk IO spikes during cleanup periods","Periodic broker slowdowns at scheduled compaction times","Compaction backlog accumulating","Page cache churn from excessive IO","Broker unresponsiveness during retention enforcement"],
          causes: ["Excessive retention windows (90+ days on high-throughput topics)","Compacted topics under heavy message churn","Extremely small segment sizes creating many files","Too many partitions with retention overhead","Inefficient deletion policies"],
          effects: ["IO amplification and storage fragmentation","Slower replication as disk becomes saturated","Increased broker instability and latency variance","Page cache inefficiency","Cascading failures during housekeeping"],
          mitigations: ["Optimize retention windows to minimum viable","Tune compaction policies for topic patterns","Increase segment sizes (segment.ms and segment.bytes)","Reduce unnecessary partition count","Use log retention policies effectively"],
          metrics: ["Segment deletion rate","Compaction lag","Disk throughput during cleanup","Page cache hit ratio","GC pause times"],
          tradeoffs: ["Longer retention increases storage costs","Smaller segments improve recovery speed but increase overhead","Aggressive compaction impacts memory"]
        },
        {
          name: "Network",
          title: "Network replication pressure",
          description: "Replication itself consumes significant network bandwidth. Heavy replication traffic can saturate network interfaces, cross-AZ bandwidth, and inter-broker communication links.",
          symptoms: ["Replication fetch lag despite healthy disks","Packet retransmissions visible in network metrics","NIC saturation on broker NICs","Increased request latency across cluster","Cross-AZ replication severely lagging"],
          causes: ["Large message payloads amplifying network traffic","Excessive replication factor creating too many replicas","Cross-region replication over high-latency links","Burst traffic overwhelming network capacity","Inadequate bandwidth provisioning"],
          effects: ["Replication slowdown despite fast local disks","ISR instability from replication delays","Producer latency spikes for acks=all","Leader flapping from connectivity issues","Network-induced cascading failures"],
          mitigations: ["Enable compression (snappy, lz4, zstd)","Better networking infrastructure (higher throughput)","Traffic balancing and rate limiting","Dedicated replication bandwidth allocation","Reduce payload sizes where possible"],
          metrics: ["Replication fetch lag","Network saturation per NIC","Packet retransmissions","Cross-region latency","Bytes sent/received"],
          tradeoffs: ["Compression increases CPU usage","Dedicated bandwidth increases infrastructure cost","Reducing replication factor reduces durability"]
        }
      ],
      comparisons: [
        { tech: "MongoDB", problem: "Replication lag" },
        { tech: "Cassandra", problem: "Compaction pressure" },
        { tech: "Elasticsearch", problem: "Merge pressure" },
        { tech: "Redis", problem: "Persistence bottleneck" },
        { tech: "Kubernetes", problem: "etcd disk saturation" }
      ],
      insight: "Distributed systems frequently become IO-bound long before they become CPU-bound. Kafka scalability is fundamentally constrained by storage throughput, replication efficiency, and balanced IO distribution. Strong Kafka engineering is often storage engineering disguised as streaming infrastructure."
    },
  "kafka-throughput": {
    "header": {
        "eyebrow": "Kafka — streaming infrastructure",
        "title": "Throughput imbalance",
        "description": "Guide covering producer-consumer rate mismatch, lag growth, backpressure propagation, and throughput collapse patterns."
    },
    "synonyms": [
        "Consumer lag",
        "Backpressure",
        "Queue buildup",
        "Pipeline saturation",
        "Fetch bottleneck",
        "Lag amplification",
        "Throughput choke point",
        "Processing backlog"
    ],
    "questions": [
        "Why is consumer lag growing while brokers look healthy?",
        "How do you isolate producer-rate versus consumer-rate bottlenecks?",
        "Why does throughput collapse during peak traffic?",
        "How does downstream latency propagate into Kafka lag?"
    ],
    "layers": [
        {
            "name": "Ingress",
            "title": "Producer ingress rate mismatch",
            "description": "Producers can outpace broker write and consumer read capacity, creating sustained lag growth.",
            "symptoms": [
                "Produced records/sec consistently exceeds consumed records/sec",
                "Topic backlog grows continuously",
                "End-to-end processing delay rises"
            ],
            "causes": [
                "Burst traffic without shaping",
                "Large messages reduce effective throughput",
                "Unbounded producer retries"
            ],
            "effects": [
                "Data freshness SLA misses",
                "Increased recovery time after spikes",
                "Retry storms"
            ],
            "mitigations": [
                "Apply producer-side rate shaping",
                "Use compression and sane batch size",
                "Tune retry and timeout policy"
            ],
            "metrics": [
                "Records in vs out per second",
                "Backlog size by topic",
                "Consumer lag slope",
                "Produce request latency"
            ],
            "tradeoffs": [
                "Rate limiting protects stability but can delay ingestion",
                "Higher batching improves throughput but increases per-record latency"
            ]
        },
        {
            "name": "Broker",
            "title": "Broker queue and IO pressure",
            "description": "Broker internals become bottlenecks when request queues and disk/network IO saturate.",
            "symptoms": [
                "Request queue depth increases",
                "Disk IO wait spikes",
                "Network saturation on hot brokers"
            ],
            "causes": [
                "Hot partitions on few brokers",
                "Slow storage path",
                "Insufficient broker count"
            ],
            "effects": [
                "Ack delays",
                "Higher produce latency",
                "Replica lag growth"
            ],
            "mitigations": [
                "Rebalance partitions/leaders",
                "Scale brokers and storage throughput",
                "Tune network and request queues"
            ],
            "metrics": [
                "Request queue size",
                "Disk IO wait",
                "Broker network throughput",
                "Under-replicated partitions"
            ],
            "tradeoffs": [
                "More brokers increase operational complexity",
                "Aggressive rebalancing introduces temporary churn"
            ]
        },
        {
            "name": "Consumers",
            "title": "Consumer processing bottlenecks",
            "description": "Consumers may be constrained by CPU, deserialization, external calls, or low partition parallelism.",
            "symptoms": [
                "Lag concentrated in specific partitions",
                "Consumer CPU pinned",
                "Slow commit progression"
            ],
            "causes": [
                "Heavy per-message processing",
                "Blocking downstream APIs",
                "Too few partitions for concurrency"
            ],
            "effects": [
                "Latency tails increase",
                "Autoscaling appears ineffective",
                "Missed downstream SLAs"
            ],
            "mitigations": [
                "Optimize processing path",
                "Increase partitions carefully",
                "Isolate slow handlers and use dead-letter flow"
            ],
            "metrics": [
                "Lag per partition",
                "Processing time per message",
                "Commit latency",
                "Consumer CPU utilization"
            ],
            "tradeoffs": [
                "More partitions improve parallelism but raise metadata overhead",
                "Async processing improves throughput but complicates ordering"
            ]
        },
        {
            "name": "Downstream",
            "title": "Backpressure from dependencies",
            "description": "Databases, services, or sinks downstream can throttle consumer throughput and feed back into Kafka lag.",
            "symptoms": [
                "Lag spikes correlate with sink latency",
                "Retry counts increase",
                "Consumer throughput oscillates"
            ],
            "causes": [
                "Sink write limits",
                "Connection pool exhaustion",
                "Inefficient batch flush policies"
            ],
            "effects": [
                "Backlog accumulation",
                "Instability during recovery",
                "Cascading failures"
            ],
            "mitigations": [
                "Circuit breakers and bounded retries",
                "Adaptive batch sizing",
                "Separate fast and slow lanes"
            ],
            "metrics": [
                "Sink latency and error rate",
                "Retry rate",
                "Batch flush time",
                "End-to-end latency"
            ],
            "tradeoffs": [
                "Strict backpressure protects systems but increases queueing delay",
                "More buffering increases recovery complexity"
            ]
        }
    ],
    "comparisons": [
        { "tech": "API Gateway", "problem": "Request queue buildup" },
        { "tech": "Redis", "problem": "Event loop saturation" },
        { "tech": "Elasticsearch", "problem": "Search queue pressure" },
        { "tech": "MongoDB", "problem": "Query backlog under load" },
        { "tech": "Kubernetes", "problem": "Autoscaling lag vs demand spikes" }
    ],
    "insight": "Kafka throughput stability is about sustained rate matching: ingestion, replication, processing, and sink throughput must remain balanced under normal and spike traffic."
},
  "kubernetes-lifecycle": {
      header: {
        eyebrow: "Kubernetes — pod lifecycle",
        title: "Application lifecycle instability",
        description: "Guide covering CrashLoopBackOff, restart storms, probe flapping, and rollout instability."
      },
      synonyms: ["CrashLoopBackOff","Restart storms","Probe flapping","Startup failures","Rollout instability","Readiness failures","Liveness failures","Container churn"],
      questions: ["Why are pods repeatedly restarting?","How do probes create false-negative failures?","Why do rollouts fail under load?","How do startup and shutdown hooks influence stability?"],
      layers: [
        {
          name: "Startup",
          title: "Startup dependency and bootstrap failures",
          description: "Containers fail early when dependencies or startup budgets are misconfigured.",
          symptoms: ["CrashLoopBackOff soon after deployment","Startup timeout events","Readiness never achieved"],
          causes: ["Missing env/config/secret","Dependency unavailable at boot","Insufficient startupProbe windows"],
          effects: ["Service unavailability windows","Rollout rollback triggers","Increased alert noise"],
          mitigations: ["Harden startup checks","Use startupProbe appropriately","Fail fast with actionable logs"],
          metrics: ["Startup duration","CrashLoopBackOff count","First readiness time","Deployment failure rate"],
          tradeoffs: ["Longer startup windows reduce false kills but delay bad-pod detection","Strict startup checks improve safety but can slow recovery"]
        },
        {
          name: "Probes",
          title: "Probe strategy and false failure loops",
          description: "Liveness/readiness probes can destabilize healthy pods if thresholds are unrealistic.",
          symptoms: ["Probe failures under transient load","Pods restart despite healthy process","Traffic flaps between replicas"],
          causes: ["Probe timeout too low","Probe endpoint dependent on slow downstreams","No separation of liveness vs readiness behavior"],
          effects: ["Unnecessary restarts","Reduced effective capacity","Tail latency spikes"],
          mitigations: ["Set probe budgets from real latency data","Keep liveness simple and local","Use readiness to gate traffic safely"],
          metrics: ["Probe failure rate","Restart count","Ready replicas over time","Traffic failover frequency"],
          tradeoffs: ["Conservative probes improve stability but detect true failures slower","Aggressive probes detect faster but increase false-positive restarts"]
        },
        {
          name: "Rollouts",
          title: "Deployment and rollout turbulence",
          description: "Rollout parameters can overload systems or trigger churn during updates.",
          symptoms: ["Rollout stalls","Error spikes during deployment","Replica oscillation"],
          causes: ["MaxUnavailable too high for workload","No canary stage","Incompatible schema/config rollout order"],
          effects: ["User-visible incidents during releases","Rollback churn","Degraded SLOs"],
          mitigations: ["Use canary and progressive delivery","Tune surge/unavailable values","Enforce backward-compatible rollout sequencing"],
          metrics: ["Rollout duration","Error rate during deploy","Rollback frequency","Replica stability"],
          tradeoffs: ["Safer rollouts reduce risk but slow delivery","Faster rollouts shorten lead time but raise blast radius"]
        },
        {
          name: "Runtime",
          title: "Runtime resilience and shutdown behavior",
          description: "Graceful termination and runtime backpressure handling determine whether lifecycle events are smooth.",
          symptoms: ["Dropped in-flight requests on restart","Long tail during termination","Connection reset spikes"],
          causes: ["No preStop handling","Termination grace too short","No drain strategy for background workers"],
          effects: ["Request failures during scale/down","State inconsistency","Operational fragility"],
          mitigations: ["Implement graceful drain and preStop hooks","Set realistic termination grace","Test scale and restart behavior regularly"],
          metrics: ["Termination duration","In-flight request loss","Scale event error rate","Graceful shutdown success rate"],
          tradeoffs: ["Longer grace periods reduce drop risk but slow autoscaling response","More drain logic increases application complexity"]
        }
      ],
      comparisons: [
        { tech: "Systemd", problem: "Service restart loops" },
        { tech: "Nomad", problem: "Task restart instability" },
        { tech: "Kafka", problem: "Consumer churn and lag spikes" },
        { tech: "MongoDB", problem: "Election instability during process churn" },
        { tech: "API Gateway", problem: "Canary rollout regressions" }
      ],
      insight: "Lifecycle instability is usually a control-loop issue: probes, rollout policy, and app behavior must agree on what healthy means under load."
    },
  "kubernetes-networking": {
      header: {
        eyebrow: "Kubernetes — service connectivity",
        title: "Cluster networking problems",
        description: "Guide covering service discovery failures, DNS instability, CNI issues, and policy-driven connectivity outages."
      },
      synonyms: ["Service discovery failures","DNS issues","CNI problems","Pod connectivity failures","Network policy blocks","Service routing failures","East-west traffic instability","kube-proxy issues"],
      questions: ["Why can pods not reach services intermittently?","How do CoreDNS failures manifest in apps?","What CNI conditions create packet loss spikes?","How do network policies accidentally block production traffic?"],
      layers: [
        {
          name: "DNS",
          title: "DNS resolution path instability",
          description: "CoreDNS and upstream resolver issues can break service discovery at scale.",
          symptoms: ["Intermittent NXDOMAIN/timeouts","Application retries on DNS lookups","Latency spikes on first calls"],
          causes: ["CoreDNS overload","DNS cache inefficiency","Upstream resolver instability"],
          effects: ["Service-to-service failures","Connection storm behavior","Request latency inflation"],
          mitigations: ["Scale CoreDNS and tune cache","Reduce unnecessary DNS churn","Monitor resolver dependency health"],
          metrics: ["DNS query latency","DNS error rate","CoreDNS CPU/memory","Query volume"],
          tradeoffs: ["Larger DNS cache improves latency but can serve stale records","More replicas improve resilience but add overhead"]
        },
        {
          name: "Service Mesh",
          title: "Service routing and kube-proxy behavior",
          description: "Service routing layers can create drops/timeouts if rules or conntrack are stressed.",
          symptoms: ["Timeouts to ClusterIP services","Uneven service reachability","Node-specific connectivity issues"],
          causes: ["Conntrack table pressure","kube-proxy rule churn","Overlay/underlay mismatch"],
          effects: ["Partial outages","Regional incident patterns","Difficult debugging under load"],
          mitigations: ["Tune conntrack and node networking","Reduce churn in service endpoints","Validate kube-proxy mode and limits"],
          metrics: ["Service timeout rate","Conntrack utilization","Endpoint update rate","Node-to-node packet loss"],
          tradeoffs: ["Higher conntrack limits require memory","More stable endpoints can slow rollout responsiveness"]
        },
        {
          name: "CNI",
          title: "CNI dataplane and packet path failures",
          description: "CNI plugin behavior and node networking health are core to pod connectivity.",
          symptoms: ["Packet drops between pods","High retransmits","Cross-node latency spikes"],
          causes: ["CNI plugin bugs/misconfig","MTU mismatch","Node NIC saturation"],
          effects: ["Application-level retries","Throughput collapse on affected paths","SLO degradation"],
          mitigations: ["Standardize MTU and routing","Upgrade and validate CNI versions","Capacity-plan node networking"],
          metrics: ["Packet drop rate","Retransmit rate","Pod-to-pod RTT","Node NIC utilization"],
          tradeoffs: ["Safer CNI upgrades require staged rollout effort","Conservative MTU improves compatibility but may reduce throughput"]
        },
        {
          name: "Policy",
          title: "Network policy and access control regressions",
          description: "Policy changes can unintentionally block required paths and create silent outages.",
          symptoms: ["Sudden traffic denial after policy deploy","Only some namespaces affected","Health checks fail without app changes"],
          causes: ["Overly broad deny rules","Missing allow for dependency path","Policy drift across environments"],
          effects: ["Hidden partial outages","Operational confusion","Emergency rollbacks"],
          mitigations: ["Policy dry-run/canary process","Contract tests for critical traffic paths","Versioned policy governance"],
          metrics: ["Denied flow count","Policy rollout failure rate","Mean time to restore connectivity","Policy drift incidents"],
          tradeoffs: ["Strict policies improve security but raise operational complexity","Broader allow rules reduce outages but widen attack surface"]
        }
      ],
      comparisons: [
        { tech: "Service Mesh", problem: "Control/data plane mismatch" },
        { tech: "API Gateway", problem: "Upstream connectivity instability" },
        { tech: "Kafka", problem: "Broker interconnect latency spikes" },
        { tech: "MongoDB", problem: "Replica sync delay due to network jitter" },
        { tech: "Elasticsearch", problem: "Cross-node transport instability" }
      ],
      insight: "Kubernetes networking incidents are often layered failures. DNS, routing, dataplane, and policy must all be healthy for simple service calls to succeed."
    },
  "kubernetes-resources": {
      header: {
        eyebrow: "Kubernetes — container orchestration",
        title: "Resource exhaustion & OOMKills",
        description: "Staff+/Principal-level guide covering memory pressure, CPU throttling, resource starvation, noisy neighbors, and pod crash loops in Kubernetes clusters."
      },
      synonyms: ["OOMKills","CPU throttling","Resource starvation","Memory pressure","Pod eviction","Noisy neighbors","Resource contention","Pod restart storms"],
      questions: ["Why are my pods getting OOMKilled?","How do I detect memory leaks in Kubernetes?","Why is my pod CPU-throttled despite having capacity?","What causes noisy neighbor problems?","How do I set appropriate memory requests/limits?","Why is pod restart latency increasing?","How do I debug resource pressure?","What's the right strategy for resource quotas?"],
      layers: [
        {
          name: "Memory",
          title: "Memory exhaustion & OOMKill",
          description: "Kubernetes kills (OOMKills) pods when memory usage exceeds the configured limit. Memory leaks, unbounded growth, or misconfigured limits cause OOMKills that interrupt service and trigger restarts.",
          symptoms: ["Pods getting OOMKilled frequently","Restart count increasing","Memory usage growing over time","Pod eviction visible in events"],
          causes: ["Memory leaks in application code","Limit set too low for workload","Cache growth without bounds","Memory inefficiency in dependencies"],
          effects: ["Service interruption from pod restarts","Loss of in-flight requests","Loss of cached state","Cascading failures from restart storms"],
          mitigations: ["Increase memory limit (temporary)","Fix memory leak in application","Implement memory monitoring","Use memory limits correctly","Implement circuit breakers"],
          metrics: ["Memory usage per pod","OOMKill count","Restart count","Memory limit utilization","Heap size trends"],
          tradeoffs: ["Higher limits increase node cost","Memory profiling adds overhead","Fixing leaks takes development time"]
        },
        {
          name: "CPU",
          title: "CPU throttling & scheduling contention",
          description: "Kubernetes throttles CPU when pod usage exceeds limits. Over-committed nodes cause all pods to experience CPU throttling, reducing performance even if individual pods request reasonable CPU.",
          symptoms: ["P99 latency spikes intermittently","CPU throttling metrics increasing","Pod latency increasing under load","Queue buildup from slow processing"],
          causes: ["CPU limit set too low","Node over-committed with too many pods","Burst traffic overwhelming CPU allocation","Inefficient CPU usage in application"],
          effects: ["Latency tail increases from throttling","Throughput reduction","Cascading impact to dependent services","SLA violations"],
          mitigations: ["Increase CPU limit","Reduce pods per node","Optimize application CPU efficiency","Implement auto-scaling","Use burst detection"],
          metrics: ["CPU throttling percentage","P99 latency","CPU utilization","Throttling event count","Burst CPU requests"],
          tradeoffs: ["Higher CPU limits increase cost","Fewer pods per node reduces density","Optimization takes development effort"]
        },
        {
          name: "Requests",
          title: "Misconfigured requests & limits",
          description: "Incorrectly set resource requests/limits cause scheduling failures, under-utilization, or over-commitment. Requests too high prevent scheduling, requests too low cause contention.",
          symptoms: ["Pods in Pending state for scheduling","Uneven node utilization","Some nodes fully allocated","Resource quota exhausted"],
          causes: ["Requests set too high for cluster capacity","Requests not reflecting actual usage","Limits not properly set","Quota misconfiguration"],
          effects: ["New pods fail to schedule","Cluster can't scale workload","Wasted resources from over-provisioning","Cascading scheduling failures"],
          mitigations: ["Right-size requests based on actual usage","Use Vertical Pod Autoscaler (VPA)","Implement resource quotas correctly","Monitor utilization vs limits","Implement bin-packing"],
          metrics: ["Pod scheduling wait time","Node utilization","Request vs actual usage","Quota utilization","Pending pod count"],
          tradeoffs: ["VPA adds complexity and latency","Tight limits risk OOMKills","Over-provisioning wastes money"]
        },
        {
          name: "Node",
          title: "Node-level resource pressure",
          description: "Node-level resource exhaustion (memory or disk) causes kubelet to evict pods based on priority. Node pressure cascades to multiple pods simultaneously.",
          symptoms: ["Multiple pods evicted from same node","Node NotReady status","Disk full on node","Node kubelet unstable"],
          causes: ["Node under-provisioned for workload","Disk space filled by logs or containers","Too many pods on single node","Node drift from updates"],
          effects: ["Cascading pod evictions","Multiple service disruptions","Leader election if node had critical pods","Cluster stability impact"],
          mitigations: ["Monitor node resources proactively","Implement pod disruption budgets","Scale nodes horizontally","Implement cluster autoscaling","Proper log rotation"],
          metrics: ["Node allocatable resources","Node available resources","Pod eviction rate","Node condition status","Disk usage per node"],
          tradeoffs: ["More nodes increase operational complexity","Pod disruption budgets reduce pack efficiency","Autoscaling adds latency"]
        }
      ],
      comparisons: [
        { tech: "Docker", problem: "Container resource limits" },
        { tech: "ECS", problem: "Task resource exhaustion" },
        { tech: "Redis", problem: "Memory eviction pressure" },
        { tech: "MongoDB", problem: "Cache pressure" },
        { tech: "Cassandra", problem: "Heap exhaustion" }
      ],
      insight: "Kubernetes resource management requires understanding both the scheduler's perspective and the kubelet's perspective. Misalignment between requests/limits causes either scheduling failures or runtime OOMKills. Request/limit pairs must reflect both cluster capacity and application requirements."
    },
  "kubernetes-scheduling": {
      header: {
        eyebrow: "Kubernetes — workload placement",
        title: "Scheduling and placement failures",
        description: "Guide covering Pending pods, placement deadlocks, and resource-fit failures in Kubernetes clusters."
      },
      synonyms: ["Pending pods","Scheduling starvation","Unschedulable pods","Placement failures","Affinity deadlock","Taint mismatch","Bin-packing failure","Capacity fit issues"],
      questions: ["Why are pods stuck in Pending state?","How do affinity and anti-affinity create deadlocks?","Why does autoscaler fail to place some workloads?","How do taints and tolerations break expected placement?"],
      layers: [
        {
          name: "Capacity",
          title: "Requests and node-fit constraints",
          description: "Pods are unschedulable when requests cannot be satisfied by current node inventory.",
          symptoms: ["Pending pods age increases","Insufficient CPU/memory events","Low deployment progress"],
          causes: ["Oversized requests","Fragmented node capacity","No suitable instance types"],
          effects: ["Release delays","Service capacity shortfall","SLO risk under demand"],
          mitigations: ["Right-size requests","Introduce shape-diverse node pools","Use VPA/HPA with guardrails"],
          metrics: ["Pending pod count/age","FailedScheduling events","Node allocatable vs requested","Deployment progress rate"],
          tradeoffs: ["Smaller requests improve placement but can increase runtime contention","More node types improve fit but increase fleet complexity"]
        },
        {
          name: "Policies",
          title: "Affinity, anti-affinity, and topology constraints",
          description: "Strict placement rules can unintentionally make workloads impossible to place.",
          symptoms: ["Pods fail due to affinity conflicts","Zone spread constraints unmet","Deadlock during rolling updates"],
          causes: ["Over-constrained anti-affinity","Rigid topology spread constraints","Misaligned labels/selectors"],
          effects: ["Stalled rollouts","Capacity underutilization","Reduced resilience"],
          mitigations: ["Relax non-critical hard constraints","Validate policies in staging","Use topology spread pragmatically"],
          metrics: ["Constraint-related scheduling failures","Zone balance ratio","Rollout stall duration","Policy conflict count"],
          tradeoffs: ["Relaxed constraints improve availability but may reduce fault isolation","Hard constraints increase safety but reduce schedulability"]
        },
        {
          name: "Node Rules",
          title: "Taints, tolerations, and selectors mismatch",
          description: "Workloads can become stranded if tolerations/selectors do not match available nodes.",
          symptoms: ["Pods eligible for zero nodes","Specialized pools underutilized","Unexpected pending during node pool changes"],
          causes: ["Missing tolerations","Incorrect node selectors","Drift in labels/taints"],
          effects: ["Critical workloads blocked","Inefficient capacity usage","Incident during failover events"],
          mitigations: ["Automate policy validation","Standardize node labels/taints","Use admission checks for required tolerations"],
          metrics: ["Eligible nodes per pod","Taint mismatch events","Node pool utilization","Policy drift count"],
          tradeoffs: ["More strict validation may block deployments early","Looser selectors can weaken workload isolation"]
        },
        {
          name: "Autoscaling",
          title: "Autoscaler reaction and provisioning lag",
          description: "Cluster autoscaler may react too slowly or not at all for certain constraint patterns.",
          symptoms: ["Pending persists despite autoscaler activity","Scale-up loops without placement success","Burst demand misses"],
          causes: ["Node group maxed out","Unsupported constraints for available node groups","Cloud provisioning delays"],
          effects: ["Extended under-capacity periods","User-facing degradation","Manual intervention toil"],
          mitigations: ["Tune autoscaler profiles","Add fallback node groups","Pre-scale for predictable surges"],
          metrics: ["Scale-up latency","Pending after scale events","Provisioning failure rate","Capacity headroom"],
          tradeoffs: ["Pre-scaling improves reliability but costs more","Broad fallback pools improve placement but may dilute workload affinity"]
        }
      ],
      comparisons: [
        { tech: "YARN", problem: "Container placement starvation" },
        { tech: "Mesos", problem: "Offer mismatch and scheduling stalls" },
        { tech: "Kafka", problem: "Partition assignment imbalance" },
        { tech: "API Gateway", problem: "Route saturation due to placement skew" },
        { tech: "Elasticsearch", problem: "Shard allocation constraints" }
      ],
      insight: "Scheduling failures are usually policy-plus-capacity mismatches. Good clusters pair realistic requests with constraints that reflect reliability goals, not perfection."
    },
  "mongodb-distribution": {
      header: {
        eyebrow: "MongoDB — sharded distributed database",
        title: "Data distribution imbalance",
        description: "Staff+/Principal-level guide covering hot shards, shard skew, uneven partition distribution, and shard key imbalance in MongoDB sharded clusters."
      },
      synonyms: ["Hot shards","Shard skew","Uneven data distribution","Shard hotspotting","Uneven shard load","Low-cardinality shard key","Tenant hotspotting","Shard imbalance"],
      questions: ["Why is one shard consistently overloaded in my cluster?","How do I detect shard imbalance?","What causes one shard to have much more data?","Why is shard write latency variable?","How does shard key selection affect performance?","What causes tenant hotspotting in multi-tenant systems?","How do I rebalance uneven shard distribution?","Why is one shard disk filling faster?"],
      layers: [
        {
          name: "Shard Key",
          title: "Shard key design & cardinality",
          description: "MongoDB distributes data based on the shard key. Poor shard key design (low cardinality, skewed values, monotonic sequences) causes some shards to contain disproportionately more data and requests.",
          symptoms: ["One shard significantly larger than others","One shard receiving more writes","Uneven CPU across shards","Chunks not splitting evenly"],
          causes: ["Low-cardinality shard key (boolean, status)","Monotonically increasing shard key (timestamps)","Tenant hotspotting (one customer dominates)","Poor cardinality estimation"],
          effects: ["Hotspot shard becomes bottleneck","Other shards underutilized","Uneven resource distribution","Cascading failures when hotspot overloaded"],
          mitigations: ["Use compound shard key (tenant + ID)","Add random prefix (salting) for hot keys","Hash-based shard keys for distribution","Redesign schema","Use field-level sharding"],
          metrics: ["Shard size distribution","Document count per shard","Write rate per shard","Chunk count per shard","P99 latency by shard"],
          tradeoffs: ["Compound keys complicate queries","Hashing makes range queries inefficient","Salting increases key complexity"]
        },
        {
          name: "Chunks",
          title: "Chunk management & migration",
          description: "MongoDB splits data into chunks and distributes across shards. Uneven chunk distribution or migration failures cause imbalance. Balancer oversees chunk movement.",
          symptoms: ["Chunk count imbalanced","Balancer not migrating chunks","Chunks stuck on wrong shard","Migrations failing"],
          causes: ["Balancer disabled during growth","Chunk size too large for rebalancing","Network issues preventing migration","Auto-split failures"],
          effects: ["Chunks concentrated on few shards","Rebalancing stalls","Permanent imbalance","Performance degradation"],
          mitigations: ["Enable balancer during off-peak","Tune chunk size appropriately","Monitor balancer activity","Implement manual rebalancing","Fix network issues"],
          metrics: ["Chunk distribution by shard","Balancer activity rate","Migration success rate","Chunk size","Rebalance time"],
          tradeoffs: ["Rebalancing causes I/O overhead","Smaller chunks increase move overhead","Manual balancing requires expertise"]
        },
        {
          name: "Zones",
          title: "Zone sharding & replica placement",
          description: "Zone sharding allows controlling which chunks live on which shards based on shard key ranges. Misconfigured zones cause imbalance by concentrating ranges on few shards.",
          symptoms: ["All write traffic on one zone","Uneven zone allocation","Replica placement imbalanced","Zone enforcement not working"],
          causes: ["Zone configuration too narrow","Zone tags not properly assigned","Range-based sharding creating skew","Replica set imbalance"],
          effects: ["Zone becomes bottleneck","Other zones underutilized","Replication imbalance","Cascading zone failure"],
          mitigations: ["Rebalance zone boundaries","Assign tags correctly","Monitor zone metrics","Implement multi-zone writes","Spread ranges evenly"],
          metrics: ["Chunk distribution by zone","Request rate per zone","Latency by zone","Replication lag","Zone utilization"],
          tradeoffs: ["Zone rebalancing causes migration","Frequent zone changes disrupt queries","Complex zone logic is hard to debug"]
        },
        {
          name: "Workload",
          title: "Uneven query workload distribution",
          description: "Even with balanced data, queries can be uneven if applications query certain shard key ranges more frequently. Query patterns matter as much as data distribution.",
          symptoms: ["One shard CPU high despite balanced data","Query latency variable by shard","Specific documents accessed frequently","Hot document list visible"],
          causes: ["Application query pattern bias","Cache locality from application","Popular data concentrated in ranges","Time-series workload skew"],
          effects: ["Hotspot shard limits throughput","Other shards underutilized","Tail latency from hotspot","Cascading application impact"],
          mitigations: ["Cache hot data externally","Denormalize for access patterns","Implement application-level sharding","Use read preference","Monitor query patterns"],
          metrics: ["Query rate per shard","CPU per shard","Memory per shard","Hot key detection","Query distribution"],
          tradeoffs: ["External caching adds latency","Denormalization increases storage","Application sharding adds complexity"]
        }
      ],
      comparisons: [
        { tech: "Cassandra", problem: "Hot partitions" },
        { tech: "DynamoDB", problem: "Partition key hotspotting" },
        { tech: "Elasticsearch", problem: "Hot shards" },
        { tech: "PostgreSQL", problem: "Uneven partition distribution" },
        { tech: "Kafka", problem: "Uneven partition load" }
      ],
      insight: "MongoDB shard distribution imbalance is fundamentally a shard key problem. Unlike query optimization which can improve performance incrementally, a poor shard key causes structural imbalance that no amount of tuning can fix. Get it right the first time."
    },
  "mongodb-query": {
      header: {
        eyebrow: "MongoDB — distributed data systems",
        title: "Query performance degradation",
        description: "Staff+/Principal-level guide covering slow queries, collection scans, index misses, aggregation bottlenecks, and query execution pressure across MongoDB deployments."
      },
      synonyms: ["Slow queries","Query latency","Collection scans","Query execution bottlenecks","Index misses","Query planner issues","Inefficient query design","Aggregation pipeline bottlenecks"],
      questions: ["Why is my MongoDB query suddenly slow?","How do I detect full collection scans?","Why is CPU spiking for specific queries?","How do I optimize aggregation pipelines?","What causes query planner regressions?","How do I identify missing indexes?","Why are my dashboards responding slowly?","How do I debug large document scans?"],
      layers: [
        {
          name: "Index Layer",
          title: "Index & query planning layer",
          description: "MongoDB queries rely on index selection for performance. Poor index design, missing indexes, or query planner regressions cause the database to perform full collection scans, resulting in high CPU and latency.",
          symptoms: ["Full collection scans visible in explain output","High CPU usage for specific queries","Slow dashboard APIs","Query timeout spikes","Increasing query latency"],
          causes: ["Missing indexes on frequently queried fields","Low-cardinality indexes on high-cardinality data","Query planner choosing suboptimal indexes","Sparse or partial indexes not matching query patterns"],
          effects: ["Collection-wide scanning overhead","CPU saturation on mongod process","Memory pressure from scanning documents","Slow application response times","Cascading slowdowns in dependent services"],
          mitigations: ["Add missing indexes on frequently queried fields","Analyze query patterns with explain() and indexStats","Rebuild fragmented indexes","Use covered queries when possible","Optimize index selectivity"],
          metrics: ["Execution stage in explain output","Docs scanned vs docs returned","CPU usage per query","Query latency percentiles","Cache hit ratio"],
          tradeoffs: ["More indexes increase write latency","Index maintenance adds overhead","Memory usage increases with index count"]
        },
        {
          name: "Aggregation",
          title: "Aggregation pipeline bottlenecks",
          description: "Aggregation pipelines can become CPU-intensive and memory-constrained when stages execute in the wrong order, lack indexes, or operate on large datasets without proper filtering.",
          symptoms: ["Aggregation queries timeout","High memory usage during aggregation","CPU spikes during pipeline execution","Slow dashboard computations"],
          causes: ["$lookup operations on large collections without indexes","$group stages without pre-filtering","Expensive string operations in pipelines","Sorting large result sets in memory"],
          effects: ["CPU exhaustion during aggregation","Memory pressure and potential OOMKills","Slow analytics queries","Increased latency for all users"],
          mitigations: ["Push $match stages early to filter documents","Use $allowDiskUse for large sorts and groups","Avoid $lookup on non-indexed fields","Optimize expression complexity","Use $project to reduce document size"],
          metrics: ["Pipeline execution time","Memory used during aggregation","Stages causing slowdown","Network bytes out","CPU time per stage"],
          tradeoffs: ["$allowDiskUse impacts performance vs memory","Complex projections reduce memory but add CPU","Early filtering reduces throughput but improves latency"]
        },
        {
          name: "Large Scans",
          title: "Large document & collection scanning",
          description: "Scanning large documents or entire collections without proper filtering causes severe performance degradation. MongoDB must load each document into memory, parse it, and apply filters.",
          symptoms: ["Query latency increases with collection size","Memory usage spikes during queries","Slow response times for range queries","OOMKill on aggregation operations"],
          causes: ["Queries scanning entire collections without index support","Large document sizes (>16MB) being scanned","Pagination without proper indexing","Time-series data without time-range filtering"],
          effects: ["Linear latency degradation with data growth","Memory exhaustion on secondary reads","Impact on other queries sharing resources","Cascading slowdowns across application"],
          mitigations: ["Add indexes to support range queries","Use pagination with indexed sort fields","Implement time-range filtering for time-series data","Archive old data to reduce active collection size","Use projection to fetch only needed fields"],
          metrics: ["Bytes scanned per query","Documents scanned ratio","Memory usage during query","Query execution time","Collection size trends"],
          tradeoffs: ["Pagination adds complexity to application code","Data archival reduces feature scope","Projection limits available fields in queries"]
        },
        {
          name: "Execution",
          title: "Query execution pressure & contention",
          description: "Query execution pressure occurs when too many concurrent queries compete for resources, causing contention, lock delays, and cascading latency increases.",
          symptoms: ["Increased query latency under load","Lock waits visible in profiling","Queued operations in currentOp","Uneven query latency distribution"],
          causes: ["Too many concurrent queries on same collection","Write-heavy workloads blocking reads","Long-running queries holding locks","Inefficient queries running at scale"],
          effects: ["Query queue buildup","Latency tail increases dramatically","Timeout failures under load","Application cascading failures"],
          mitigations: ["Increase replica set size for read scaling","Use connection pooling with appropriate limits","Kill long-running queries proactively","Scale horizontally with sharding","Use read preferences to distribute read load"],
          metrics: ["Queue length","Lock wait time","Concurrent operations","Average query latency","95th/99th percentile latency"],
          tradeoffs: ["More replicas increase replication overhead","Sharding adds complexity and routing overhead","Connection limits reduce throughput"]
        }
      ],
      comparisons: [
        { tech: "PostgreSQL", problem: "Slow sequential scans" },
        { tech: "Cassandra", problem: "Partition scan latency" },
        { tech: "Elasticsearch", problem: "Query execution pressure" },
        { tech: "Redis", problem: "Scan command blocking" },
        { tech: "DynamoDB", problem: "Index scan pressure" }
      ],
      insight: "MongoDB query performance is fundamentally determined by index selectivity and execution planning. Strong engineers optimize not just for single queries, but for query patterns and resource contention under load."
    },
  "mongodb-replication": {
      header: {
        eyebrow: "MongoDB — replication architecture",
        title: "Replication & consistency delays",
        description: "Staff+/Principal-level guide covering secondary lag, oplog replication bottlenecks, replication throughput imbalance, and consistency guarantees in MongoDB replica sets."
      },
      synonyms: ["Secondary lag","Replica lag","Replication backlog","Replication delay","Oplog lag","Write-after-read inconsistency","Stale secondary reads","Replication sync delay"],
      questions: ["Why are secondaries lagging behind the primary?","How do I debug oplog replication delays?","What causes read-after-write inconsistency?","Why is replication falling behind after traffic spikes?","How does oplog sizing affect replication?","What causes failover delays in MongoDB?","Why are secondary reads returning stale data?","How do I detect replication bottlenecks?"],
      layers: [
        {
          name: "Oplog",
          title: "Oplog application & replication pipeline",
          description: "MongoDB replication uses an oplog (operations log) that the primary writes to and secondaries continuously apply. When secondaries cannot keep up with oplog application, replica lag accumulates.",
          symptoms: ["Increasing seconds of lag on secondaries","Stale reads from secondaries","Delayed failover due to lag","Oplog application thread falling behind"],
          causes: ["Write throughput exceeds secondary disk IO capacity","Large individual operations blocking oplog thread","Replication lag from secondary disk saturation","CPU contention on secondary processing oplog"],
          effects: ["Read-after-write inconsistency","Delayed failover readiness","Potential data loss if primary fails","Increased inconsistency window"],
          mitigations: ["Increase secondary disk throughput (SSD)","Reduce write throughput with batching","Scale secondaries to match primary capacity","Use better network for replication","Optimize oplog processing"],
          metrics: ["Seconds of replication lag","Oplog application rate","Oplog entries queued","Secondary replication thread latency","Disk IO wait on secondary"],
          tradeoffs: ["More secondaries increase replication overhead","Larger oplog consumes more disk space","Faster replication requires better hardware"]
        },
        {
          name: "Network",
          title: "Network replication delays",
          description: "Replication data must traverse the network from primary to each secondary. Network latency, packet loss, and bandwidth limitations can significantly delay oplog application.",
          symptoms: ["Consistent replication lag across all secondaries","Lag increases during high-throughput periods","Cross-AZ replication significantly lagging","Network packet loss visible in metrics"],
          causes: ["High network latency between data centers","Insufficient replication bandwidth","Packet retransmissions on replication traffic","Network congestion from other workloads"],
          effects: ["Slow oplog application on all replicas","Delayed failover readiness","Increased window of potential data inconsistency","Cascading lag propagation"],
          mitigations: ["Use dedicated replication network","Increase network bandwidth allocation","Optimize replication batch size","Use compression for replication traffic","Reduce cross-AZ replication load"],
          metrics: ["Network latency to secondaries","Replication bandwidth utilization","Packet loss on replication links","RTT to replicas","Network throughput"],
          tradeoffs: ["Compression increases CPU usage","Larger batches reduce latency but increase memory","Dedicated network requires infrastructure cost"]
        },
        {
          name: "Disk",
          title: "Secondary disk saturation & write pressure",
          description: "Secondaries continuously write oplog entries and apply operations to their data files. When secondary disk throughput is lower than primary write throughput, the oplog application thread falls behind.",
          symptoms: ["Replication lag growing over time","IO wait on secondary disks","Slow disk writes visible in profiling","Lag spikes during compaction on secondary"],
          causes: ["Secondary using slower disks than primary","Heavy disk compaction competing with replication","Too many partitions or collections competing for IO","Background operations (indexing, garbage collection)"],
          effects: ["Oplog application lag accumulation","Delayed replica availability for reads","Cascading lag if secondary becomes primary","Data inconsistency window increases"],
          mitigations: ["Upgrade secondary disk to match primary","Schedule compaction during low-traffic periods","Separate replication IO from application IO","Increase background task parallelism","Use better storage technology"],
          metrics: ["Secondary disk throughput","IO wait percentage","Flush latency","Compaction frequency","Oplog apply latency"],
          tradeoffs: ["SSD upgrade is expensive","Scheduling compaction reduces availability","Separating IO requires infrastructure changes"]
        },
        {
          name: "CPU",
          title: "CPU contention & oplog processing",
          description: "Applying oplog entries requires parsing operations, updating data structures, and maintaining consistency. Heavy write workloads or complex operations can cause CPU contention on the oplog application thread.",
          symptoms: ["High CPU usage during replication","Oplog application thread at 100% CPU","Lag increases despite sufficient disk/network","Lag varies with query complexity"],
          causes: ["Complex write operations requiring heavy computation","Thousands of writes per second to process","Background queries competing for CPU","Index updates during replication"],
          effects: ["Oplog application cannot keep up","Replication lag growth","Slower failover readiness","Cascading failures if lag triggers priority change"],
          mitigations: ["Increase CPU resources on secondaries","Batch writes into fewer operations","Reduce concurrent background operations","Optimize operation complexity","Use faster CPUs"],
          metrics: ["CPU utilization on oplog thread","Context switch rate","Instructions per operation","Background CPU contention","Operation complexity metrics"],
          tradeoffs: ["CPU upgrade is expensive","Batching increases latency","Reducing operations changes application behavior"]
        }
      ],
      comparisons: [
        { tech: "PostgreSQL", problem: "Replication lag" },
        { tech: "Kafka", problem: "Replica fetch lag" },
        { tech: "Cassandra", problem: "Repair delays" },
        { tech: "MySQL", problem: "Binlog replication lag" },
        { tech: "AWS RDS", problem: "Replica sync lag" }
      ],
      insight: "MongoDB replication is fundamentally about throughput matching: the primary writes to the oplog at rate X, and secondaries must apply those operations at rate >= X. When any layer (network, disk, or CPU) cannot match the write throughput, lag accumulates."
    },
  "mongodb-resources": {
      header: {
        eyebrow: "MongoDB — database capacity",
        title: "Resource saturation",
        description: "Guide covering CPU, memory, and disk saturation in MongoDB and how bottlenecks cascade into latency and replication risk."
      },
      synonyms: ["Memory pressure","Disk pressure","CPU saturation","Working set overflow","Cache churn","IO bottleneck","Resource contention","Node saturation"],
      questions: ["How do I identify whether MongoDB is CPU-bound, memory-bound, or IO-bound?","Why does latency spike when working set exceeds RAM?","How does resource pressure affect replica lag?","What is the fastest way to stabilize saturation events?"],
      layers: [
        {
          name: "CPU",
          title: "CPU contention and query concurrency",
          description: "Expensive queries and high concurrency can saturate CPU and inflate tail latency.",
          symptoms: ["High user CPU on primary","P99 query latency spikes","Slow query log growth"],
          causes: ["Collection scans","Complex aggregations","Excessive concurrent operations"],
          effects: ["Request queueing","Timeouts","Reduced throughput"],
          mitigations: ["Fix worst queries first","Add/select indexes","Bound concurrency with connection pool discipline"],
          metrics: ["CPU utilization","Run queue length","Slow queries per minute","P95/P99 latency"],
          tradeoffs: ["More indexes help reads but raise write cost","Concurrency limits improve latency but cap throughput"]
        },
        {
          name: "Memory",
          title: "WiredTiger cache and working set pressure",
          description: "When active data exceeds memory, cache churn increases read amplification and latency variance.",
          symptoms: ["Cache eviction pressure","Frequent page faults","Latency spikes under read load"],
          causes: ["Working set larger than RAM","Poor locality in access patterns","Insufficient cache headroom"],
          effects: ["Disk reads increase","Query latency instability","Secondary read performance drops"],
          mitigations: ["Reduce hot working set","Archive cold data","Tune cache and schema access patterns"],
          metrics: ["Cache used/dirty ratio","Page fault rate","Disk read IOPS","Latency jitter"],
          tradeoffs: ["Aggressive caching improves reads but may starve writes","Archival lowers cost but increases data retrieval complexity"]
        },
        {
          name: "Disk",
          title: "Storage and checkpoint pressure",
          description: "Checkpointing, journaling, and heavy write bursts can saturate disks and impact durability latency.",
          symptoms: ["High IO wait","Journal/flush latency rises","Write latency spikes"],
          causes: ["Slow storage class","Write burst patterns","Competing background maintenance"],
          effects: ["Replication lag increase","Write timeout risk","Failover vulnerability"],
          mitigations: ["Upgrade storage throughput","Smooth write bursts with batching","Schedule maintenance off-peak"],
          metrics: ["IO wait","Flush/checkpoint latency","Write concern latency","Disk queue depth"],
          tradeoffs: ["Higher-end storage increases cost","Batching improves throughput but can add micro-burst latency"]
        },
        {
          name: "Cluster",
          title: "Replica set impact under saturation",
          description: "Resource pressure on primary/secondaries affects replication health and failover readiness.",
          symptoms: ["Secondary lag growth","Election sensitivity","Stale reads increase"],
          causes: ["Primary saturation","Under-provisioned secondaries","Cross-AZ network + disk contention"],
          effects: ["Wider inconsistency windows","Longer failover recovery","Data freshness SLA misses"],
          mitigations: ["Capacity parity across replicas","Monitor replication lag SLOs","Tune read/write concern by criticality"],
          metrics: ["Replication lag","Election frequency","Majority write latency","Secondary apply rate"],
          tradeoffs: ["Stricter write concern improves correctness but increases latency","Read from secondaries improves scale but may return stale data"]
        }
      ],
      comparisons: [
        { tech: "PostgreSQL", problem: "CPU/IO saturation under mixed workloads" },
        { tech: "Cassandra", problem: "Compaction and disk pressure" },
        { tech: "Elasticsearch", problem: "Heap and IO contention" },
        { tech: "Redis", problem: "Memory ceiling and eviction pressure" },
        { tech: "Kafka", problem: "Broker IO saturation" }
      ],
      insight: "MongoDB incidents are often multi-resource: CPU, memory, and disk interact. The most reliable strategy is bottleneck isolation with targeted mitigation, not blanket scaling."
    },
  "redis-access": {
      header: {
        eyebrow: "Redis — access distribution",
        title: "Data access imbalance",
        description: "Guide covering hot keys, key skew, shard hotspotting, and tail-latency amplification in Redis deployments."
      },
      synonyms: ["Hot keys","Key skew","Uneven access patterns","Shard hotspotting","Access concentration","Read skew","Traffic skew","Key-level hotspots"],
      questions: ["Why is one Redis shard overloaded while others are idle?","How do hot keys impact Redis p99 latency?","How can I detect skewed access quickly?","What mitigations work without breaking consistency?"],
      layers: [
        {
          name: "Clients",
          title: "Client access pattern skew",
          description: "Application behavior often concentrates traffic on a small key set.",
          symptoms: ["One key dominates command volume","Unbalanced shard CPU","Latency spikes on specific operations"],
          causes: ["Popular entities with no spreading strategy","Read fan-out to same cache entry","Missing local cache layer"],
          effects: ["Hot shard bottleneck","Lower effective cluster throughput","User-facing latency variance"],
          mitigations: ["Shard-aware key design","Client-side request coalescing","Short-lived local cache for hot reads"],
          metrics: ["Top-N key frequency","Ops/sec by key prefix","CPU by shard","Latency by key group"],
          tradeoffs: ["Caching hot reads can serve stale data briefly","More key indirection increases code complexity"]
        },
        {
          name: "Server",
          title: "Single-thread hotspot behavior",
          description: "A hot command stream can monopolize Redis event loop time on one node.",
          symptoms: ["Event loop delay on one node","Command queue growth","Tail latency jumps"],
          causes: ["Burst traffic to same slot","High-cost commands on hot keys","Insufficient horizontal split"],
          effects: ["Timeouts for otherwise cheap commands","Uneven cluster utilization","Backpressure to callers"],
          mitigations: ["Avoid expensive commands on hot paths","Split hot datasets by key strategy","Use replicas for read-heavy hotspots"],
          metrics: ["Instantaneous ops/sec","Command latency percentiles","Blocked clients","Node-level CPU"],
          tradeoffs: ["More splitting may reduce locality","Read replicas add consistency lag concerns"]
        },
        {
          name: "Cluster",
          title: "Slot and shard distribution skew",
          description: "Even if key count is balanced, request distribution may remain imbalanced across slots.",
          symptoms: ["Node CPU skew despite similar memory usage","One slot range receives most requests","Frequent throttling on single shard"],
          causes: ["Hash tags concentrating traffic","Business key patterns with uneven popularity","Suboptimal cluster resharding decisions"],
          effects: ["Capacity wasted on idle shards","Hotspot-led downtime risk","Operational firefighting"],
          mitigations: ["Reshard based on traffic, not only data size","Remove harmful hash-tag patterns","Introduce traffic-aware key partitioning"],
          metrics: ["Requests per slot range","Shard CPU variance","Resharding event impact","Error rate by node"],
          tradeoffs: ["Resharding can cause transient latency","Traffic-based partitioning may complicate key lookup"]
        },
        {
          name: "App",
          title: "Application-level imbalance controls",
          description: "Application design often determines whether hot key behavior is amplified or dampened.",
          symptoms: ["Repeated cache stampedes","Same key misses across many workers","Burst retries against hot key"],
          causes: ["No jittered TTL","No stampede protection","Aggressive retry logic"],
          effects: ["Amplified load spikes","Backend overload","Volatile user latency"],
          mitigations: ["Use jittered expirations","Implement single-flight/stampede guards","Bound retries and apply backoff"],
          metrics: ["Miss burst amplitude","Retry rate","Stampede incidents","Backend fallback latency"],
          tradeoffs: ["Stronger controls may serve stale values briefly","Retry limits can fail requests earlier"]
        }
      ],
      comparisons: [
        { tech: "Kafka", problem: "Hot partitions" },
        { tech: "MongoDB", problem: "Hot shards" },
        { tech: "Cassandra", problem: "Partition hotspotting" },
        { tech: "Elasticsearch", problem: "Hot shard queries" },
        { tech: "API Gateway", problem: "Route-level traffic concentration" }
      ],
      insight: "In Redis, hotspot problems are throughput-allocation problems. Capacity exists, but access distribution prevents you from using it effectively."
    },
  "redis-latency": {
      header: {
        eyebrow: "Redis — runtime behavior",
        title: "Latency and blocking operations",
        description: "Guide covering event-loop blocking, long-running commands, and latency spikes in single-threaded execution paths."
      },
      synonyms: ["Event loop blocking","Latency spikes","Slowlog pressure","Blocking commands","Main thread stalls","Tail latency","Long Lua execution","Command starvation"],
      questions: ["Why does Redis p99 latency spike even at moderate CPU?","Which command patterns block Redis the most?","How do Lua scripts affect latency?","How can we reduce blocking without losing functionality?"],
      layers: [
        {
          name: "Commands",
          title: "High-complexity command impact",
          description: "Commands with O(n) behavior can block the event loop when run on large keys.",
          symptoms: ["Slowlog fills with specific command types","Sudden tail latency spikes","Client timeouts during heavy operations"],
          causes: ["Large set/hash/list operations","Unbounded scans in hot paths","Expensive key deletion patterns"],
          effects: ["Command queueing","User-facing latency outliers","Cascade retries from clients"],
          mitigations: ["Replace heavy commands with incremental patterns","Use key size limits","Move heavy maintenance off peak"],
          metrics: ["Slowlog max time","Per-command latency","Timeout rate","Queue depth"],
          tradeoffs: ["Incremental patterns increase code complexity","Background maintenance windows reduce flexibility"]
        },
        {
          name: "Scripts",
          title: "Lua and transaction blocking behavior",
          description: "Long-running scripts or multi-key transactions can monopolize server time.",
          symptoms: ["Latency spikes during script execution","Temporary throughput collapse","Blocked client growth"],
          causes: ["Complex scripts over large datasets","Non-idempotent retries with scripts","Large multi-key atomic blocks"],
          effects: ["Cluster instability under load","SLA misses","Operational unpredictability"],
          mitigations: ["Bound script runtime and data scope","Precompute heavy logic outside Redis","Use safer script rollout and monitoring"],
          metrics: ["Script execution duration","Blocked clients","Ops/sec drop during scripts","Timeout distribution"],
          tradeoffs: ["Less in-Redis logic may increase network calls","Splitting transactions may weaken atomicity guarantees"]
        },
        {
          name: "Network",
          title: "Client burst and connection pressure",
          description: "Burst traffic and poor client behavior can create server-side latency amplification.",
          symptoms: ["Connection churn","Short bursts of command pile-up","Latency correlated with connection spikes"],
          causes: ["No connection pooling","Aggressive retries","Synchronous fan-out request patterns"],
          effects: ["Queue backpressure","Wasted server cycles","Upstream instability"],
          mitigations: ["Use connection pooling","Apply client-side backoff/jitter","Set sane timeout and retry budgets"],
          metrics: ["Connection count","New connections/sec","Retry rate","P99 latency"],
          tradeoffs: ["Tighter retry budgets may increase visible errors","Pooling requires lifecycle management in clients"]
        },
        {
          name: "Operations",
          title: "Operational guardrails for latency SLOs",
          description: "Operational discipline is required to prevent planned tasks from causing service stalls.",
          symptoms: ["Latency incidents during maintenance windows","Unpredictable tails after config changes","SLO breaches without sustained load increase"],
          causes: ["Unsafe maintenance commands in production","No canary for config changes","Inadequate latency alert thresholds"],
          effects: ["Reliability regressions","Emergency rollback frequency","Reduced confidence in cache tier"],
          mitigations: ["Canary config changes","Command allowlist/denylist for production","Latency SLO-driven alerting"],
          metrics: ["SLO burn rate","Maintenance-related incidents","Rollback frequency","Latency before/after changes"],
          tradeoffs: ["Stronger guardrails can slow operational changes","More observability raises telemetry costs"]
        }
      ],
      comparisons: [
        { tech: "Node.js", problem: "Event loop blocking" },
        { tech: "Elasticsearch", problem: "Thread pool saturation" },
        { tech: "API Gateway", problem: "Request queue backpressure" },
        { tech: "Kafka", problem: "Consumer processing stall" },
        { tech: "MongoDB", problem: "Lock/contention latency tails" }
      ],
      insight: "Redis latency issues are often not capacity issues but fairness issues: one expensive operation can degrade every request on a node."
    },
  "redis-memory": {
      header: {
        eyebrow: "Redis — in-memory data store",
        title: "Memory pressure & eviction",
        description: "Staff+/Principal-level guide covering memory exhaustion, cache thrashing, eviction pressure, and resource saturation in Redis deployments."
      },
      synonyms: ["Eviction pressure","Cache thrashing","OOM pressure","Memory exhaustion","Unbounded growth","Memory fragmentation","Eviction storms","Cache miss explosion"],
      questions: ["Why is my Redis cache evicting too many keys?","How do I detect memory pressure in Redis?","What causes OOM errors in production?","Why is cache hit ratio dropping suddenly?","How do I manage TTL effectively?","What's causing memory fragmentation?","Why are evictions increasing?","How do I size Redis memory correctly?"],
      layers: [
        {
          name: "Allocation",
          title: "Unbounded key growth & allocation",
          description: "Redis stores all data in memory without built-in limits. If application code doesn't properly manage key lifecycle or TTLs, memory grows unbounded until Redis runs out of available memory and begins evicting keys.",
          symptoms: ["Memory usage grows linearly with time","No plateau in memory consumption","Evictions increasing daily","Cache hit ratio degrading"],
          causes: ["No TTL set on keys","Keys inserted faster than expired","Memory leak in application logic","Misconfigured eviction policy"],
          effects: ["Eviction storms when memory full","Cache thrashing from constant evictions","Application experiencing cache misses","Cascading performance degradation"],
          mitigations: ["Set appropriate TTLs on all keys","Implement TTL renewal strategy","Use eviction policy (LRU/LFU)","Monitor key count and memory","Prune keys during off-peak"],
          metrics: ["Memory usage trend","Eviction rate","Keys count","Cache hit/miss ratio","TTL distribution"],
          tradeoffs: ["Aggressive TTL reduces data freshness","Manual pruning requires logic","Eviction policies have overhead"]
        },
        {
          name: "Eviction",
          title: "Eviction policy & cache thrashing",
          description: "When Redis reaches maxmemory, it evicts keys according to the configured policy. Under high memory pressure, eviction rate increases dramatically, causing cache thrashing where freshly-loaded data is immediately evicted.",
          symptoms: ["High eviction rate (keys/sec)","Cache hit ratio near zero","Constant cache misses","Application latency spikes"],
          causes: ["maxmemory set too low","Working set larger than available memory","Inefficient eviction policy for access pattern","Burst traffic exceeding capacity"],
          effects: ["Severe cache hit ratio degradation","Backend database overloaded from cache misses","Application latency explosion","Cascading backend failures"],
          mitigations: ["Increase maxmemory limit","Upgrade to larger Redis instance","Optimize eviction policy (LRU vs LFU)","Reduce working set size","Implement circuit breaker"],
          metrics: ["Eviction rate","Cache hit ratio","Evicted keys/sec","Memory fragmentation","Operations rate"],
          tradeoffs: ["Larger memory is more expensive","Better eviction policy adds CPU","Reducing working set impacts features"]
        },
        {
          name: "Large Objects",
          title: "Large object storage & memory blast radius",
          description: "Storing large objects in Redis (large strings, big hashes, large sorted sets) creates disproportionate memory usage and fragmentation.",
          symptoms: ["Memory usage not proportional to key count","High per-key memory overhead","Fragmentation ratio increasing","Evictions not freeing expected memory"],
          causes: ["Storing serialized blobs (images, JSON)","Large documents stored as strings","Inefficient data structures","Compression not enabled"],
          effects: ["Inefficient memory utilization","Cache thrashing from large evictions","Memory fragmentation","Reduced effective cache capacity"],
          mitigations: ["Move large objects to external storage","Store references instead of full objects","Use compression for large strings","Optimize data structure encoding","Use smaller, focused keys"],
          metrics: ["Memory per key","Fragmentation ratio","Encoding efficiency","Object size distribution","Peak memory"],
          tradeoffs: ["External storage adds latency","Compression uses CPU","Smaller keys increase operation count"]
        },
        {
          name: "Fragmentation",
          title: "Memory fragmentation & allocation overhead",
          description: "Redis memory fragmentation occurs when freed memory cannot be reused due to allocator limitations. High fragmentation means available memory is scattered and unusable, forcing premature eviction.",
          symptoms: ["Fragmentation ratio > 1.5","Memory not freed after key deletion","Evictions occurring despite deleted keys","Memory trending upward even with deletes"],
          causes: ["Fragmentation from deletion patterns","Allocator limitations","Large object deletion creating holes","Long-lived allocations preventing compaction"],
          effects: ["Wasted memory due to fragmentation","Premature eviction of useful keys","Reduced effective cache capacity","Application performance impact"],
          mitigations: ["Monitor fragmentation ratio","Restart Redis periodically","Use jemalloc for better fragmentation","Optimize deletion patterns","Implement key reorganization"],
          metrics: ["Fragmentation ratio","Memory efficiency","Allocated vs used memory","Deletion rate","Reallocations"],
          tradeoffs: ["Restarts cause temporary unavailability","Reorganization requires downtime","Better allocator has memory overhead"]
        }
      ],
      comparisons: [
        { tech: "Memcached", problem: "Memory eviction pressure" },
        { tech: "MongoDB", problem: "Cache pressure" },
        { tech: "Cassandra", problem: "Heap exhaustion" },
        { tech: "Elasticsearch", problem: "JVM heap pressure" },
        { tech: "Kafka", problem: "Page cache pressure" }
      ],
      insight: "Redis memory pressure is fundamentally about proportional capacity planning. The cache is only useful when hit ratio remains high. Once memory pressure forces evictions faster than typical query patterns, the cache becomes a liability, turning the backend database into the bottleneck."
    },
  "redis-replication": {
      header: {
        eyebrow: "Redis — durability and replication",
        title: "Replication and persistence delays",
        description: "Guide covering replica lag, AOF/RDB overhead, and durability-performance tradeoffs in Redis."
      },
      synonyms: ["Replica lag","Persistence bottleneck","AOF fsync lag","RDB snapshot pressure","Replication backlog","Sync delay","Durability latency","Disk persistence overhead"],
      questions: ["Why are Redis replicas lagging behind primary?","How do AOF settings impact latency?","Why do snapshots cause spikes?","How do I balance durability guarantees and speed?"],
      layers: [
        {
          name: "Replication",
          title: "Primary-to-replica stream lag",
          description: "Replicas can fall behind when apply speed is lower than primary mutation rate.",
          symptoms: ["Replica offset lag grows","Read replicas return stale data","Failover readiness decreases"],
          causes: ["High write burst rate","Replica CPU/disk bottleneck","Network jitter on replication links"],
          effects: ["Inconsistency windows widen","Failover risk increases","Read-after-write surprises"],
          mitigations: ["Provision replica capacity near primary","Reduce write spikes with batching","Use dedicated replication networking"],
          metrics: ["Replication offset lag","Replica apply throughput","Replica staleness window","Replication RTT"],
          tradeoffs: ["More replicas improve read scale but increase replication load","Batching smooths writes but changes write visibility timing"]
        },
        {
          name: "AOF",
          title: "AOF fsync and write latency pressure",
          description: "AOF durability mode can dominate write latency under heavy mutation workloads.",
          symptoms: ["Write latency spikes on fsync intervals","AOF rewrite contention","Command latency jitter"],
          causes: ["Strict fsync policy on busy disks","Large append-only file growth","Concurrent AOF rewrite pressure"],
          effects: ["Tail latency increase","Throughput drop during rewrite","Operational instability"],
          mitigations: ["Tune appendfsync by criticality","Place AOF on faster storage","Schedule rewrite with headroom"],
          metrics: ["AOF fsync latency","AOF rewrite duration","Write latency percentiles","Disk queue depth"],
          tradeoffs: ["Stricter fsync improves durability but slows writes","Relaxed fsync lowers latency but increases loss window"]
        },
        {
          name: "RDB",
          title: "Snapshot fork and copy-on-write overhead",
          description: "RDB snapshot creation can cause memory and latency disturbances during fork and write phases.",
          symptoms: ["Latency jump during BGSAVE","Memory usage spike from copy-on-write","Short throughput dip"],
          causes: ["Frequent snapshots","Large in-memory dataset","High write churn during snapshot"],
          effects: ["Transient latency degradation","Memory pressure incidents","Potential eviction amplification"],
          mitigations: ["Adjust snapshot cadence","Use replicas for persistence offload","Increase memory headroom"],
          metrics: ["Fork time","Snapshot duration","Copy-on-write memory delta","Latency during snapshot windows"],
          tradeoffs: ["Less frequent snapshots reduce overhead but weaken recovery point objective","Offloading persistence increases topology complexity"]
        },
        {
          name: "Recovery",
          title: "Failover and consistency behavior",
          description: "Lag and persistence state influence failover correctness and recovery speed.",
          symptoms: ["Long promotion times","Stale promotion candidate risk","Recovery uncertainty after incident"],
          causes: ["Replica lag at failover moment","Inadequate persistence checkpoints","Insufficient failover testing"],
          effects: ["Data freshness loss","Longer outage windows","Confidence loss in DR posture"],
          mitigations: ["Promote lowest-lag replicas","Regular failover drills","Monitor persistence and lag SLOs"],
          metrics: ["Failover duration","Lag at promotion","Data loss window estimate","Recovery success rate"],
          tradeoffs: ["Frequent drills consume resources","Tighter RPO goals often increase run-time overhead"]
        }
      ],
      comparisons: [
        { tech: "MongoDB", problem: "Secondary replication lag" },
        { tech: "MySQL", problem: "Replica apply delay" },
        { tech: "Kafka", problem: "Follower fetch lag" },
        { tech: "Cassandra", problem: "Repair lag debt" },
        { tech: "Elasticsearch", problem: "Translog and flush pressure" }
      ],
      insight: "Redis durability and replication tuning is a risk-budget decision: lower latency and lower data-loss risk often push in opposite directions."
    }
};