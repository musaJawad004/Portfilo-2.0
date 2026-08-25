export const newsletterTopics = [
  "Agents", "RAG", "Models", "Mobile", "Backend", "Cloud", "Developer Tools", "AI Research",
] as const;

export type NewsletterTopic = (typeof newsletterTopics)[number];

type PostSeed = {
  slug: string;
  title: string;
  label: string;
  topic: NewsletterTopic;
  focus: string;
  date: string;
  source: { label: string; url: string };
};

const seeds: PostSeed[] = [
  ["flutter-isolates", "Flutter Isolates: Getting Work Off the UI Thread", "ISOLATES", "Mobile", "moving CPU-bound work off the UI thread with isolates and message passing", "2026-08-25", ["Flutter, Concurrency and isolates", "https://docs.flutter.dev/perf/isolates"]],
  ["flutter-jank", "Flutter Jank Is a Rebuild Problem", "RENDER PERF", "Mobile", "the frame pipeline, rebuild scope, and the free fixes for dropped frames", "2026-08-23", ["Flutter, Performance best practices", "https://docs.flutter.dev/perf/best-practices"]],
  ["flutter-architecture", "Flutter Architecture: Layers Before Libraries", "APP ARCHITECTURE", "Mobile", "layered UI and data separation with unidirectional flow, before state libraries", "2026-08-21", ["Flutter, App architecture guide", "https://docs.flutter.dev/app-architecture"]],
  ["react-native-new-architecture", "React Native's New Architecture, in Plain Terms", "NEW ARCHITECTURE", "Mobile", "JSI, Fabric, TurboModules, and life after the async bridge", "2026-08-19", ["React Native, About the New Architecture", "https://reactnative.dev/architecture/landing-page"]],
  ["react-native-hermes", "Hermes and the React Native Startup Budget", "STARTUP", "Mobile", "bytecode precompilation, time-to-interactive, and the no-JIT tradeoff", "2026-08-17", ["React Native, Using Hermes", "https://reactnative.dev/docs/hermes"]],
  ["nodejs-event-loop", "The Node.js Event Loop Is Your Real Bottleneck", "EVENT LOOP", "Backend", "loop phases, blocking handlers, and offloading CPU work to worker threads", "2026-08-15", ["Node.js, The event loop", "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick"]],
  ["nodejs-streams-backpressure", "Node Streams and the Backpressure You're Ignoring", "STREAMS", "Backend", "flow control, the drain handshake, and pipeline for constant-memory data", "2026-08-13", ["Node.js, Backpressuring in streams", "https://nodejs.org/en/learn/modules/backpressuring-in-streams"]],
  ["fastapi-async", "FastAPI Async: Where await Actually Helps", "ASYNC PYTHON", "Backend", "async def versus def, the threadpool, and not blocking the event loop", "2026-08-11", ["FastAPI, Concurrency and async/await", "https://fastapi.tiangolo.com/async/"]],
  ["ci-pipeline-speed", "A CI Pipeline Nobody Waits For", "CI SPEED", "Cloud", "dependency caching, parallel jobs, and cancelling stale runs", "2026-08-09", ["GitHub, Caching dependencies", "https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/caching-dependencies-to-speed-up-workflows"]],
  ["progressive-delivery", "Progressive Delivery: Ship to 1% First", "PROGRESSIVE DELIVERY", "Cloud", "canary rollouts, feature flags, and automatic rollback to shrink blast radius", "2026-08-07", ["Google Cloud, Deployment strategies", "https://cloud.google.com/architecture/application-deployment-and-testing-strategies"]],
  ["database-indexing", "Indexes Are the Query Plan You Control", "INDEXING", "Backend", "scan versus seek, composite indexes, EXPLAIN, and the write-time cost", "2026-08-05", ["PostgreSQL, Indexes", "https://www.postgresql.org/docs/current/indexes.html"]],
  ["database-migrations", "Zero-Downtime Migrations Are a Sequencing Problem", "MIGRATIONS", "Backend", "expand-and-contract, dual writes, backfills, and avoiding long locks", "2026-08-03", ["PostgreSQL, ALTER TABLE", "https://www.postgresql.org/docs/current/sql-altertable.html"]],
  ["agents-need-computers", "Agents Need Computers, Not Bigger Prompts", "AGENT RUNTIME", "Agents", "execution environments, files, networks, retries, and the tight action loop", "2026-08-24", ["OpenAI, From model to agent", "https://openai.com/index/equip-responses-api-computer-environment/"]],
  ["long-running-agent-work", "The New Unit of Work Is an Agent Run", "DELEGATED WORK", "Agents", "long-horizon delegated work and how teams supervise it", "2026-08-22", ["OpenAI, How agents are transforming work", "https://openai.com/index/how-agents-are-transforming-work/"]],
  ["responses-api-production", "Responses API in Production: The Parts That Matter", "RESPONSES API", "Agents", "tools, traces, state, and production failure handling", "2026-08-20", ["OpenAI, New tools for building agents", "https://openai.com/index/new-tools-for-building-agents/"]],
  ["agent-reliability-loop", "The Agent Reliability Loop", "EVAL LOOP", "Agents", "planning, execution, observation, evaluation, and correction", "2026-08-18", ["OpenAI Agents SDK docs", "https://openai.github.io/openai-agents-python/"]],
  ["multi-agent-not-default", "Multi-Agent Is Not the Default", "ORCHESTRATION", "Agents", "when specialist agents help and when a single loop wins", "2026-08-16", ["Anthropic, Building effective agents", "https://www.anthropic.com/research/building-effective-agents"]],
  ["agent-memory-practical", "Agent Memory Without the Hype", "MEMORY", "Agents", "short-term state, durable facts, and retrieval boundaries", "2026-08-14", ["LangGraph memory docs", "https://langchain-ai.github.io/langgraph/concepts/memory/"]],
  ["tool-contracts", "Tool Contracts Are Your Agent API", "TOOL DESIGN", "Agents", "schemas, permissions, idempotency, and observable tool results", "2026-08-12", ["OpenAI function calling docs", "https://platform.openai.com/docs/guides/function-calling"]],
  ["computer-use-safety", "Computer Use Needs a Seatbelt", "COMPUTER USE", "Agents", "sandboxing, confirmations, allowlists, and audit trails", "2026-08-10", ["OpenAI computer use guide", "https://platform.openai.com/docs/guides/tools-computer-use"]],
  ["rag-is-data-product", "RAG Is a Data Product", "RAG SYSTEM", "RAG", "ingestion quality, ownership, freshness, and retrieval feedback", "2026-08-08", ["Pinecone RAG guide", "https://www.pinecone.io/learn/retrieval-augmented-generation/"]],
  ["hybrid-search", "Hybrid Search Beats Semantic Search Alone", "HYBRID RETRIEVAL", "RAG", "dense vectors, lexical signals, reranking, and filters", "2026-08-06", ["Weaviate hybrid search docs", "https://weaviate.io/developers/weaviate/search/hybrid"]],
  ["chunking-boundaries", "Chunking Is an Information Architecture Problem", "CHUNKING", "RAG", "document structure, semantic boundaries, and answer completeness", "2026-08-04", ["Unstructured chunking docs", "https://docs.unstructured.io/open-source/core-functionality/chunking"]],
  ["rag-evals", "RAG Evals Before RAG Vibes", "RETRIEVAL EVALS", "RAG", "retrieval recall, groundedness, answer relevance, and regression sets", "2026-08-02", ["OpenAI evals guide", "https://platform.openai.com/docs/guides/evals"]],
  ["rerankers", "Rerankers Are the Quiet Upgrade", "RERANKING", "RAG", "two-stage retrieval and relevance ordering", "2026-07-31", ["Cohere rerank docs", "https://docs.cohere.com/docs/rerank-2"]],
  ["rag-permissions", "Permission-Aware RAG or Data Leak", "ACCESS CONTROL", "RAG", "document ACLs, tenant filters, and safe caching", "2026-07-29", ["OWASP LLM Top 10", "https://genai.owasp.org/llm-top-10/"]],
  ["knowledge-freshness", "Fresh Knowledge Needs an Expiry Date", "FRESHNESS", "RAG", "change detection, reindexing, deletion, and cache invalidation", "2026-07-27", ["Qdrant indexing docs", "https://qdrant.tech/documentation/concepts/indexing/"]],
  ["fine-tuning-decision", "Fine-Tuning Is a Product Decision", "FINE-TUNING", "Models", "choosing fine-tuning only when prompts and retrieval stop being enough", "2026-07-25", ["OpenAI fine-tuning guide", "https://platform.openai.com/docs/guides/fine-tuning"]],
  ["small-models", "Small Models Win More Often Than You Think", "SMALL MODELS", "Models", "latency, cost, privacy, distillation, and task fit", "2026-07-23", ["Meta Llama 3.1", "https://ai.meta.com/blog/meta-llama-3-1/"]],
  ["local-models", "Local Models: Where Ollama Actually Fits", "LOCAL AI", "Models", "private prototypes, offline workflows, model testing, and constraints", "2026-07-21", ["Ollama docs", "https://docs.ollama.com/"]],
  ["model-routing", "Model Routing Without a Science Project", "MODEL ROUTING", "Models", "routing by capability, risk, latency, and cost", "2026-07-19", ["Vercel AI Gateway docs", "https://vercel.com/docs/ai-gateway"]],
  ["structured-output", "Structured Output Is an Interface Contract", "STRUCTURED DATA", "Models", "schema validation, retries, and downstream stability", "2026-07-17", ["OpenAI structured outputs", "https://platform.openai.com/docs/guides/structured-outputs"]],
  ["context-window", "A Bigger Context Window Is Not Memory", "CONTEXT", "Models", "context selection, attention cost, and durable state", "2026-07-15", ["Anthropic context windows", "https://docs.anthropic.com/en/docs/build-with-claude/context-windows"]],
  ["quantization", "Quantization: The Useful Version", "INFERENCE", "Models", "memory reduction, throughput, quality checks, and deployment tradeoffs", "2026-07-13", ["Hugging Face quantization docs", "https://huggingface.co/docs/transformers/quantization/overview"]],
  ["flutter-ai-apps", "Shipping AI Features in Flutter Without a Mess", "FLUTTER + AI", "Mobile", "streaming, cancellation, state, and mobile UX for AI responses", "2026-07-11", ["Flutter architecture guide", "https://docs.flutter.dev/app-architecture"]],
  ["react-native-ai", "React Native AI Apps Need Native Constraints", "REACT NATIVE", "Mobile", "network variability, background limits, and responsive interaction", "2026-07-09", ["React Native performance", "https://reactnative.dev/docs/performance"]],
  ["mobile-streaming", "Streaming Text Is a Mobile Interaction Problem", "STREAMING UX", "Mobile", "partial output, scroll stability, stop controls, and accessibility", "2026-07-07", ["MDN Streams API", "https://developer.mozilla.org/en-US/docs/Web/API/Streams_API"]],
  ["offline-first-ai", "Offline-First AI Is Mostly Good State Design", "OFFLINE FIRST", "Mobile", "queues, reconciliation, local caches, and honest availability", "2026-07-05", ["Android offline-first guide", "https://developer.android.com/topic/architecture/data-layer/offline-first"]],
  ["mobile-auth", "Mobile Auth That Survives the Real World", "AUTH", "Mobile", "token rotation, secure storage, deep links, and session recovery", "2026-07-03", ["OWASP MASVS", "https://mas.owasp.org/MASVS/"]],
  ["app-store-ai", "AI App Store Review: Design for Disclosure", "APP STORES", "Mobile", "privacy, generated content, moderation, and clear user control", "2026-07-01", ["Apple App Review Guidelines", "https://developer.apple.com/app-store/review/guidelines/"]],
  ["push-notifications", "Push Notifications Are a Product Budget", "NOTIFICATIONS", "Mobile", "relevance, quiet hours, delivery tracking, and opt-out design", "2026-06-29", ["Firebase Cloud Messaging", "https://firebase.google.com/docs/cloud-messaging"]],
  ["api-cache-aside", "Cache-Aside Without Stale-Data Chaos", "CACHE ASIDE", "Backend", "cache reads, misses, invalidation, and failure modes", "2026-06-27", ["AWS caching best practices", "https://aws.amazon.com/caching/best-practices/"]],
  ["idempotent-apis", "Idempotency Is the Difference Between Retry and Duplicate", "IDEMPOTENCY", "Backend", "safe retries, request keys, and durable results", "2026-06-25", ["Stripe idempotent requests", "https://docs.stripe.com/api/idempotent_requests"]],
  ["postgres-ai", "Postgres Is Still a Great AI Backend", "POSTGRES", "Backend", "relational truth, vectors, JSON, transactions, and operational simplicity", "2026-06-23", ["PostgreSQL documentation", "https://www.postgresql.org/docs/current/"]],
  ["queues", "Queues Turn AI Demos Into Products", "DURABLE JOBS", "Backend", "backpressure, retries, dead letters, and delayed work", "2026-06-21", ["Vercel Queues docs", "https://vercel.com/docs/queues"]],
  ["webhooks", "Webhooks Need Receipts", "WEBHOOKS", "Backend", "signature verification, deduplication, ordering, and replay", "2026-06-19", ["GitHub webhook best practices", "https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks"]],
  ["rate-limits", "Rate Limits Are Part of the Product", "RATE LIMITS", "Backend", "budgets, fairness, retries, and user feedback", "2026-06-17", ["IETF RateLimit Fields", "https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/"]],
  ["observability", "Tracing the AI Request End to End", "OBSERVABILITY", "Backend", "correlation IDs, spans, model calls, tool calls, and cost", "2026-06-15", ["OpenTelemetry docs", "https://opentelemetry.io/docs/"]],
  ["serverless-ai", "Serverless AI Backends Need Different Defaults", "SERVERLESS", "Cloud", "timeouts, streaming, cold starts, and background work", "2026-06-13", ["Vercel Functions docs", "https://vercel.com/docs/functions"]],
  ["containers-for-agents", "Containers Are the Boundary Agents Need", "SANDBOXES", "Cloud", "ephemeral execution, resource limits, isolation, and artifacts", "2026-06-11", ["Docker security docs", "https://docs.docker.com/engine/security/"]],
  ["gpu-serving", "GPU Serving Is a Queueing Problem", "MODEL SERVING", "Cloud", "batching, concurrency, memory pressure, and autoscaling", "2026-06-09", ["Hugging Face TGI docs", "https://huggingface.co/docs/text-generation-inference/index"]],
  ["cicd-mobile", "CI/CD for Mobile Without Release-Day Fear", "MOBILE CI/CD", "Cloud", "signed builds, staged rollout, checks, and rollback", "2026-06-07", ["GitHub Actions docs", "https://docs.github.com/en/actions"]],
  ["preview-environments", "Every AI Change Deserves a Preview", "PREVIEW ENVS", "Cloud", "branch deployments, test data, eval gates, and review links", "2026-06-05", ["Vercel preview deployments", "https://vercel.com/docs/deployments/environments"]],
  ["secrets", "Secrets Do Not Belong in the Client", "SECRETS", "Cloud", "server-only credentials, rotation, scoped access, and auditability", "2026-06-03", ["OWASP secrets management", "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"]],
  ["claude-code-teams", "Claude Code and the Shift to Agent Teams", "CLAUDE CODE", "Developer Tools", "parallel coding agents, context ownership, and code review", "2026-06-01", ["Anthropic, Claude Opus 4.6", "https://www.anthropic.com/news/claude-opus-4-6"]],
  ["coding-agent-briefs", "Your Coding Agent Needs a Better Brief", "AGENT BRIEFS", "Developer Tools", "scope, acceptance criteria, constraints, and verification", "2026-05-30", ["GitHub Copilot coding agent", "https://docs.github.com/en/copilot/using-github-copilot/coding-agent"]],
  ["ai-code-review", "AI Code Review Is a Second Pair of Eyes", "CODE REVIEW", "Developer Tools", "risk-based review, evidence, false positives, and human ownership", "2026-05-28", ["Google Engineering Practices", "https://google.github.io/eng-practices/review/"]],
  ["mcp", "MCP Makes Tool Access Portable", "MCP", "Developer Tools", "tool discovery, permissions, transports, and reusable integrations", "2026-05-26", ["Model Context Protocol docs", "https://modelcontextprotocol.io/docs/getting-started/intro"]],
  ["developer-ai-replacement", "Companies Tried to Replace Developers With AI. Now They Want Judgment Back", "HUMANS + AI", "Developer Tools", "why generation is cheap but product judgment remains scarce", "2026-05-24", ["OpenAI, Agents transforming work", "https://openai.com/index/how-agents-are-transforming-work/"]],
  ["prompt-to-repo", "Prompt to Repo Is Not a Delivery Process", "DELIVERY", "Developer Tools", "architecture, tests, operations, and product responsibility", "2026-05-22", ["DORA capabilities", "https://dora.dev/capabilities/"]],
  ["eval-gates-ci", "Put AI Evals in CI", "EVAL GATES", "Developer Tools", "regression datasets, thresholds, traces, and release confidence", "2026-05-20", ["OpenAI evals guide", "https://platform.openai.com/docs/guides/evals"]],
  ["multimodal-reasoning", "Multimodal Reasoning Moves Beyond Chat", "MULTIMODAL", "AI Research", "vision, audio, tool use, and grounded action", "2026-05-18", ["Meta, Muse Spark", "https://ai.meta.com/blog/introducing-model-meta-superintelligence-labs/"]],
  ["coding-agents-2026", "Coding Agents in 2026: What Actually Changed", "CODING AGENTS", "AI Research", "longer tasks, larger codebases, agent teams, and verification", "2026-05-16", ["Anthropic, Claude Opus 4.6", "https://www.anthropic.com/news/claude-opus-4-6"]],
  ["open-models", "Open Models Are an Infrastructure Choice", "OPEN MODELS", "AI Research", "control, customization, licensing, hardware, and maintenance", "2026-05-14", ["Meta Llama 3.1", "https://ai.meta.com/blog/meta-llama-3-1/"]],
  ["synthetic-data", "Synthetic Data Needs a Quality Loop", "SYNTHETIC DATA", "AI Research", "generation, filtering, diversity, evaluation, and contamination", "2026-05-12", ["Meta Llama 3.1", "https://ai.meta.com/blog/meta-llama-3-1/"]],
  ["ai-science", "AI for Science Needs Auditable Artifacts", "AI SCIENCE", "AI Research", "reproducible analysis, tools, compute, and human review", "2026-05-10", ["Anthropic newsroom", "https://www.anthropic.com/news"]],
  ["benchmarks-product", "Benchmarks Are Not Your Product Eval", "BENCHMARKS", "AI Research", "task-specific success, real distributions, and operational failure", "2026-05-08", ["Stanford HELM", "https://crfm.stanford.edu/helm/latest/"]],
] .map(([slug, title, label, topic, focus, date, [sourceLabel, sourceUrl]]) => ({
  slug, title, label, topic: topic as NewsletterTopic, focus, date,
  source: { label: sourceLabel, url: sourceUrl },
})) as PostSeed[];

const coverColors = [
  "#8BE95B", "#F3E84D", "#F2B84B", "#8ED7FF", "#E9A1FF",
  "#A7F0D1", "#FF9E9E", "#C7B7FF", "#FFB47A", "#9BE3C5",
];

export type NewsletterPost = PostSeed & {
  issue: number;
  excerpt: string;
  readingMinutes: number;
  color: string;
  sections: NewsletterSection[];
};

export type NewsletterSection = {
  heading: string;
  paragraphs: string[];
  checklist?: string[];
  note?: string;
  flow?: string[];
  table?: { columns: string[]; rows: string[][] };
  mindMap?: { center: string; branches: string[] };
};

const topicPlaybooks: Record<NewsletterTopic, {
  system: string[];
  failures: string[];
  metrics: string[];
  decisions: string[];
}> = {
  Agents: {
    system: ["Intent + policy", "Plan one action", "Run a typed tool", "Observe the result", "Evaluate + continue"],
    failures: ["Unbounded loops", "Unsafe tool permissions", "Hidden retries", "Missing human approval"],
    metrics: ["Successful task rate", "Tool error rate", "Steps per run", "Human escalation rate"],
    decisions: ["Single agent first", "Typed tool contracts", "Durable state outside the model", "Explicit stop conditions"],
  },
  RAG: {
    system: ["Ingest + version", "Chunk by meaning", "Retrieve candidates", "Rerank + authorize", "Answer with evidence"],
    failures: ["Stale documents", "Bad chunk boundaries", "Missing tenant filters", "Answers without citations"],
    metrics: ["Recall at K", "Grounded answer rate", "Freshness lag", "Permission leakage rate"],
    decisions: ["Hybrid retrieval", "Metadata filters", "Rerank before generation", "Deletion propagation"],
  },
  Models: {
    system: ["Define task", "Build eval set", "Choose baseline", "Adapt or route", "Measure + release"],
    failures: ["Benchmark chasing", "Training on weak labels", "No rollback model", "Cost hidden by averages"],
    metrics: ["Task success", "P95 latency", "Cost per success", "Regression by cohort"],
    decisions: ["Prompt before fine-tune", "Smallest capable model", "Structured output", "Version every release"],
  },
  Mobile: {
    system: ["Local intent", "Optimistic state", "Stream response", "Persist checkpoint", "Reconcile in background"],
    failures: ["Unstable scroll", "Lost app state", "Weak-network dead ends", "Tiny cancellation controls"],
    metrics: ["Time to first feedback", "Crash-free sessions", "Recovery rate", "Task completion"],
    decisions: ["Offline-aware state", "Cancelable streams", "Native secure storage", "Accessible touch targets"],
  },
  Backend: {
    system: ["Validate request", "Authorize scope", "Execute idempotently", "Persist truth", "Emit observable result"],
    failures: ["Duplicate writes", "Retry storms", "Stale cache", "Untraceable requests"],
    metrics: ["P50 and P95 latency", "Error budget", "Queue age", "Duplicate prevention rate"],
    decisions: ["Database owns truth", "Queues absorb bursts", "Idempotency at boundaries", "Trace every dependency"],
  },
  Cloud: {
    system: ["Build immutable artifact", "Verify policy", "Deploy preview", "Shift traffic", "Observe + rollback"],
    failures: ["Secrets in clients", "No rollback path", "Unbounded concurrency", "Production-only testing"],
    metrics: ["Deployment frequency", "Change failure rate", "Recovery time", "Cost per workload"],
    decisions: ["Ephemeral environments", "Scoped secrets", "Capacity limits", "Automated release gates"],
  },
  "Developer Tools": {
    system: ["Write a precise brief", "Generate a small change", "Run local checks", "Review the diff", "Ship with evidence"],
    failures: ["Prompt-to-repo dumps", "Skipped verification", "Context overload", "No ownership after merge"],
    metrics: ["Accepted change rate", "Review corrections", "Escaped defects", "Cycle time"],
    decisions: ["Small scoped tasks", "Tests as acceptance criteria", "Human owns architecture", "Agents report evidence"],
  },
  "AI Research": {
    system: ["State hypothesis", "Control variables", "Run reproducibly", "Inspect failures", "Publish artifacts"],
    failures: ["Contaminated evals", "Cherry-picked examples", "Missing baselines", "Irreproducible runs"],
    metrics: ["Effect size", "Variance across seeds", "Reproduction rate", "Operational relevance"],
    decisions: ["Real task distributions", "Versioned datasets", "Multiple baselines", "Auditable artifacts"],
  },
};

function buildSections(seed: PostSeed): NewsletterSection[] {
  const playbook = topicPlaybooks[seed.topic];
  return [
    {
      heading: "The signal",
      paragraphs: [
        `${seed.title} is really a systems problem about ${seed.focus}. The demo proves that one path can work. Production asks whether the same path remains safe, explainable, and useful after retries, stale state, weak networks, and unexpected user behavior.`,
        `The practical starting point is a written contract: what enters, what leaves, who is allowed to trigger it, where truth is stored, and which failure requires a person. Without that contract, teams often add model capability where they actually need product boundaries.`,
      ],
      note: `FIELD NOTE: ${playbook.decisions[0]}. Complexity should be earned by a measured failure, not added in anticipation of one.`,
      mindMap: { center: seed.label, branches: playbook.decisions },
    },
    {
      heading: "How I would build it",
      paragraphs: [
        `Start with one narrow, valuable path. Make every boundary visible: inputs, policy decisions, external calls, latency, cost, persisted state, and the final user outcome. Keep each stage replaceable so the product can change models or infrastructure without rewriting the workflow.`,
        `Then build the feedback loop from real failures. A small regression set made from actual incidents is more valuable than a large dashboard of averages. Each fixed failure becomes a test that runs before the next release.`,
      ],
      flow: playbook.system,
      checklist: ["Define input, output, and authority", "Persist deterministic state", "Make retries safe", "Trace the full path", "Give users a recovery path"],
    },
    {
      heading: "Where teams get burned",
      paragraphs: [
        `The most expensive mistakes are rarely syntax errors. They are missing boundaries: a retry that duplicates work, a cache that bypasses permissions, a model decision with no trace, or an interface that leaves the user trapped after failure.`,
        `Use the failure list below as a pre-launch review. If the team cannot show how the system detects and recovers from each one, the feature is not finished yet.`,
      ],
      table: { columns: ["Failure mode", "What to add"], rows: playbook.failures.map((failure, index) => [failure, playbook.decisions[index]]) },
    },
    {
      heading: "Production architecture",
      paragraphs: [
        `Treat the feature as explicit stages rather than one mysterious request. Each stage needs an owner, timeout, typed result, error category, and trace identifier. That makes partial failure repairable instead of forcing the whole workflow to start again.`,
        `Keep the source of truth outside probabilistic components. Models may propose actions, rank options, and produce language, but identity, permissions, billing, inventory, and durable user state belong in deterministic services.`,
      ],
      note: `ARCHITECTURE RULE: a model can recommend a state change. A deterministic service authorizes and commits it.`,
    },
    {
      heading: "What to measure",
      paragraphs: [
        `Measure completed user outcomes before clever outputs. Segment results by workflow, device, model, tenant, and release because a global average can hide the exact cohort that is failing.`,
        `A metric should change a decision. Put thresholds around the measures below and let meaningful regressions block a release. Cost only counts as efficient when the task succeeds.`,
      ],
      table: { columns: ["Signal", "Why it matters"], rows: playbook.metrics.map((metric, index) => [metric, ["Connects engineering to user value", "Exposes tail behavior", "Makes tradeoffs visible", "Catches release regressions"][index]]) },
    },
    {
      heading: "Ship note",
      paragraphs: [
        `Ship the smallest version that can be measured honestly. Keep the boundary sharp, make failures visible, and improve from real usage. That is how ${seed.label.toLowerCase()} becomes dependable infrastructure instead of another impressive prototype.`,
      ],
      checklist: playbook.decisions,
    },
  ];
}

export const newsletterPosts: NewsletterPost[] = seeds.map((seed, index) => ({
  ...seed,
  issue: seeds.length - index,
  excerpt: `A field guide to ${seed.focus}, with the architecture choices, failure modes, and release checks that matter in production.`,
  readingMinutes: 7 + (index % 6),
  color: coverColors[(index * 7 + seed.slug.length) % coverColors.length],
  sections: buildSections(seed),
}));

export function getNewsletterPost(slug: string) {
  return newsletterPosts.find((post) => post.slug === slug);
}

export function postsForTopics(topics: string[], viewed: string[] = []) {
  const chosen = new Set(topics);
  const seen = new Set(viewed);
  return newsletterPosts
    .filter((post) => !seen.has(post.slug))
    .sort((a, b) => Number(chosen.has(b.topic)) - Number(chosen.has(a.topic)) || b.date.localeCompare(a.date));
}
