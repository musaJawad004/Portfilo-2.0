export type BlogVisual = "agent" | "rag" | "claude" | "return" | "tuning" | "local";

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  points?: string[];
};

export type BlogPost = {
  slug: string;
  number: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  visual: BlogVisual;
  size: "tall" | "medium" | "compact";
  intro: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-agents-that-actually-ship",
    number: "01",
    title: "AI Agents That Actually Ship",
    category: "AI AGENTS",
    excerpt: "What separates a dependable production agent from a looping demo.",
    date: "AUG. 18 2026",
    readTime: "8 MIN READ",
    visual: "agent",
    size: "tall",
    intro:
      "The hard part of an AI agent is not making it call a tool once. The hard part is making it finish useful work repeatedly, safely, and with enough visibility that a team can trust it.",
    sections: [
      {
        heading: "Start with a bounded job",
        paragraphs: [
          "A production agent needs a clear finish line. Give it one job, explicit inputs, approved tools, and a definition of done. Broad prompts create impressive demos but unpredictable systems.",
          "I treat the model as one component inside a product workflow. The application still owns permissions, state, retries, and the final user experience.",
        ],
      },
      {
        heading: "Reliability is an engineering problem",
        paragraphs: [
          "Agent quality comes from the system around the model: structured outputs, deterministic checks, timeouts, idempotent tools, human approval points, and useful failure states.",
        ],
        points: [
          "Keep tool contracts small and typed",
          "Store every decision and tool result",
          "Test failure paths before happy paths",
          "Measure completion quality, not token activity",
        ],
      },
      {
        heading: "The agent should earn autonomy",
        paragraphs: [
          "Begin with suggestions, then supervised actions, then carefully scoped automation. Autonomy is not a switch. It is a product capability earned through evidence.",
        ],
      },
      {
        heading: "A production architecture that stays understandable",
        paragraphs: [
          "A useful agent loop is simple enough to inspect: receive a goal, assemble approved context, choose a permitted action, execute through a typed tool, verify the result, and either continue or stop. The orchestrator should enforce limits instead of trusting the model to remember them.",
          "Persist the task state outside the conversation. That makes retries safer, lets a human resume interrupted work, and prevents a long prompt from becoming the only source of truth.",
        ],
        points: ["Typed tool inputs", "Durable task state", "Step and cost limits", "Human approval gates"],
      },
      {
        heading: "What to measure after launch",
        paragraphs: [
          "Track task completion, correction rate, tool failures, time saved, and the percentage of runs that require a human rescue. Token usage is an operating metric, not evidence that the agent created value.",
          "Review failed traces every week. They reveal missing tools, weak instructions, bad retrieval, and product rules that were never written down. That feedback loop is how an agent becomes dependable.",
        ],
      },
    ],
  },
  {
    slug: "rag-beyond-the-demo",
    number: "02",
    title: "RAG Beyond the Demo",
    category: "RAG SYSTEMS",
    excerpt: "Retrieval quality, citations, evaluation, and the details that make answers trustworthy.",
    date: "AUG. 11 2026",
    readTime: "7 MIN READ",
    visual: "rag",
    size: "medium",
    intro:
      "RAG is often shown as upload, embed, search, answer. Real products need a much more deliberate retrieval system because the model can only reason over what the pipeline actually finds.",
    sections: [
      {
        heading: "Retrieval is the product",
        paragraphs: [
          "Chunking, metadata, query rewriting, ranking, and access control decide whether the answer can be correct. A stronger model cannot recover a document that never reached its context.",
        ],
      },
      {
        heading: "Evaluate the full path",
        paragraphs: [
          "Measure retrieval recall separately from answer quality. Keep a small set of real user questions, expected sources, and unacceptable answers, then run it on every pipeline change.",
        ],
        points: ["Source recall", "Citation accuracy", "Answer completeness", "Latency and cost"],
      },
      {
        heading: "Make uncertainty visible",
        paragraphs: [
          "A trustworthy RAG system cites what it used, says when evidence is missing, and lets the user inspect the source. Confidence should come from evidence, not fluent wording.",
        ],
      },
      {
        heading: "Build the retrieval pipeline in layers",
        paragraphs: [
          "Start with clean ingestion and stable document identifiers. Split by semantic structure where possible, attach useful metadata, create embeddings, retrieve a broad candidate set, and rerank only the best candidates before generation.",
          "Filters should enforce tenant, role, language, document type, and freshness before content reaches the model. Security rules applied after generation are already too late.",
        ],
        points: ["Parse and normalize", "Chunk with context", "Retrieve and filter", "Rerank and cite"],
      },
      {
        heading: "Common failure modes",
        paragraphs: [
          "Large chunks can hide the exact passage. Tiny chunks can remove the meaning around it. Duplicate documents distort rankings, stale embeddings surface deleted content, and vague queries retrieve semantically related but operationally wrong sources.",
          "The fix is rarely a longer prompt. Inspect the retrieved evidence first, then improve the stage that lost the answer.",
        ],
      },
    ],
  },
  {
    slug: "where-claude-is-going",
    number: "03",
    title: "Where Claude Is Going",
    category: "CLAUDE",
    excerpt: "From a chat window toward an operating layer for serious knowledge work.",
    date: "AUG. 04 2026",
    readTime: "6 MIN READ",
    visual: "claude",
    size: "compact",
    intro:
      "Claude is becoming most useful when it can understand a workspace, operate tools, and preserve the reasoning behind a result. The direction is bigger than chat and closer to collaborative computing.",
    sections: [
      {
        heading: "Context becomes infrastructure",
        paragraphs: [
          "The valuable unit is no longer a single prompt. It is a connected working context: files, decisions, tools, constraints, and the history needed to continue the job.",
        ],
      },
      {
        heading: "Coding is the proving ground",
        paragraphs: [
          "Software work exposes every weakness quickly. The model must inspect real systems, make precise changes, validate them, and explain tradeoffs. Those same capabilities transfer to research, operations, and product work.",
        ],
      },
      {
        heading: "The interface will become quieter",
        paragraphs: [
          "The best AI interface may show less conversation and more progress, artifacts, approvals, and clear outcomes. The model moves into the workflow instead of asking the workflow to move into chat.",
        ],
      },
      {
        heading: "What this means for product teams",
        paragraphs: [
          "Teams should design around artifacts and permissions instead of an endless transcript. Show what Claude changed, what evidence it used, what remains uncertain, and which action needs approval.",
          "The strongest products will combine a capable model with domain context and a clear operating boundary. Model intelligence matters, but workflow design determines whether that intelligence is useful.",
        ],
      },
      {
        heading: "The developer role moves upward",
        paragraphs: [
          "Developers spend less time producing routine syntax and more time specifying behavior, connecting systems, reviewing consequences, and building evaluation loops. The job becomes more product-aware, not less technical.",
        ],
        points: ["Define constraints", "Design tool access", "Review generated changes", "Own production outcomes"],
      },
    ],
  },
  {
    slug: "developers-were-replaced-then-wanted-back",
    number: "04",
    title: "AI Replaced Developers. Then Companies Wanted Them Back.",
    category: "ENGINEERING",
    excerpt: "Why software leverage is rising while engineering judgment remains essential.",
    date: "JUL. 28 2026",
    readTime: "9 MIN READ",
    visual: "return",
    size: "medium",
    intro:
      "The replacement story confuses generating code with owning a product. AI can compress implementation time, but companies still need people who understand users, systems, risk, and what should be built.",
    sections: [
      {
        heading: "Code was never the whole job",
        paragraphs: [
          "A developer turns incomplete goals into reliable behavior. That includes architecture, tradeoffs, security, deployment, observability, maintenance, and countless decisions that are invisible in a code diff.",
        ],
      },
      {
        heading: "AI changes the shape of the team",
        paragraphs: [
          "Smaller teams can now explore more ideas and ship faster. The highest leverage goes to engineers who can direct models, verify outputs, connect systems, and stay accountable for the result.",
        ],
        points: ["More prototypes", "Faster iteration", "Higher review burden", "Greater need for product judgment"],
      },
      {
        heading: "The durable skill is ownership",
        paragraphs: [
          "Tools will keep improving. The person who can take a messy problem from idea to production remains valuable because ownership cannot be reduced to autocomplete.",
        ],
      },
      {
        heading: "Where AI genuinely removes work",
        paragraphs: [
          "Boilerplate, migrations, test scaffolds, documentation drafts, refactors, and unfamiliar API exploration can move much faster. This is meaningful leverage and it changes how much a small engineering team can attempt.",
          "But generated output increases the amount of code that can enter a system. Review, observability, security, and architectural consistency become more important because mistakes can also be produced faster.",
        ],
      },
      {
        heading: "How developers stay valuable",
        paragraphs: [
          "Learn to frame ambiguous problems, create tight feedback loops, and judge the difference between code that runs and a product that works. Use AI aggressively for speed while preserving a disciplined standard for evidence and quality.",
        ],
        points: ["Understand the user", "Model the system", "Validate assumptions", "Own the release"],
      },
    ],
  },
  {
    slug: "fine-tuning-vs-rag",
    number: "05",
    title: "Fine-Tuning vs RAG: Choose the Right Tool",
    category: "MODEL OPS",
    excerpt: "Change what the model knows, how it behaves, or what it can access at runtime.",
    date: "JUL. 19 2026",
    readTime: "7 MIN READ",
    visual: "tuning",
    size: "tall",
    intro:
      "RAG and fine-tuning solve different problems. One supplies changing knowledge at runtime. The other teaches a model a more consistent behavior or task pattern.",
    sections: [
      {
        heading: "Use RAG for changing knowledge",
        paragraphs: [
          "Product catalogs, policies, private documents, and recent records belong in retrieval. The source stays inspectable and can be updated without training another model.",
        ],
      },
      {
        heading: "Use fine-tuning for repeated behavior",
        paragraphs: [
          "Fine-tuning helps when you need a stable format, domain-specific transformation, classification behavior, or a consistent style demonstrated across many examples.",
        ],
      },
      {
        heading: "Combine them carefully",
        paragraphs: [
          "A tuned model can follow the workflow while RAG provides current evidence. Start with prompts and retrieval, measure the gaps, and fine-tune only when the data supports it.",
        ],
        points: ["Define the failure", "Build an evaluation set", "Choose the smallest intervention", "Measure after release"],
      },
      {
        heading: "A simple decision framework",
        paragraphs: [
          "If the answer must cite current private information, start with RAG. If the model repeatedly fails to follow a stable transformation despite strong examples, consider fine-tuning. If both knowledge and behavior matter, evaluate them independently before combining the systems.",
          "Do not fine-tune to hide a weak product specification. Training data permanently scales both the clarity and the confusion inside your examples.",
        ],
      },
      {
        heading: "The evaluation plan comes first",
        paragraphs: [
          "Create a held-out set that represents easy, difficult, and dangerous cases. Compare the prompt baseline, retrieval baseline, and tuned candidate on quality, latency, and cost. A new model should ship only when it wins on the metric users actually feel.",
        ],
        points: ["Task success", "Grounded accuracy", "Format consistency", "Latency per request"],
      },
    ],
  },
  {
    slug: "local-llms-real-products",
    number: "06",
    title: "Local LLMs Are Ready for Real Products",
    category: "LOCAL AI",
    excerpt: "Where private, fast, task-specific models already make practical sense.",
    date: "JUL. 10 2026",
    readTime: "8 MIN READ",
    visual: "local",
    size: "compact",
    intro:
      "Local models are not a replacement for every hosted frontier model. They are another deployment option with real advantages when privacy, latency, offline access, or predictable cost matters.",
    sections: [
      {
        heading: "Choose the task before the model",
        paragraphs: [
          "Extraction, routing, classification, drafting, and constrained assistants often need less general intelligence than teams assume. A smaller model can be excellent when the task is narrow and evaluated well.",
        ],
      },
      {
        heading: "Product constraints decide",
        paragraphs: [
          "Hardware, memory, response time, concurrency, and update strategy matter as much as benchmark scores. The best model is the one that fits the complete product envelope.",
        ],
      },
      {
        heading: "Hybrid systems are practical",
        paragraphs: [
          "Use a local model for frequent private work and route difficult requests to a stronger hosted model. A thoughtful router can improve cost and privacy without lowering the user experience.",
        ],
      },
      {
        heading: "Plan the deployment envelope",
        paragraphs: [
          "Quantization can reduce memory and improve speed, but quality must be tested on your task. Context length, batching, prompt caching, and hardware acceleration all affect the experience users receive.",
          "Package the model service behind the same stable API contract you would use for a hosted provider. That keeps the application portable when model or infrastructure needs change.",
        ],
      },
      {
        heading: "Good first use cases",
        paragraphs: [
          "Start where privacy is valuable and the output is easy to verify: document classification, structured extraction, internal search, offline drafting, or a local coding assistant for a known repository.",
          "Avoid beginning with an unrestricted high-stakes assistant. A narrow success creates the data and operational confidence needed for a larger system.",
        ],
        points: ["Private extraction", "Offline assistance", "Fast classification", "Local knowledge search"],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
