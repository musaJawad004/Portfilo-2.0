export type Service = {
  number: string;
  slug: string;
  code: string;
  favicon: string;
  title: string;
  description: string;
  statement: string;
  outcome: string;
  skills: string[];
  deliverables: string[];
  process: string[];
};

export const services: Service[] = [
  {
    number: "01",
    slug: "ai-agents-automation",
    code: "AGENT",
    favicon: "/service-icons/agent.svg",
    title: "AI Agents & Automation",
    description: "Production agents that reason, use tools, automate workflows, and connect securely to your product data.",
    statement: "Turn repetitive product and business workflows into dependable agent systems that can think, act, and report.",
    outcome: "A production-ready agent with clear guardrails, measurable performance, and an interface your team can actually operate.",
    skills: ["OpenAI", "Claude", "Ollama", "Tool Calling"],
    deliverables: ["Agent architecture", "Tool integrations", "Memory and guardrails", "Monitoring dashboard"],
    process: ["Map the workflow", "Design agent tools", "Test edge cases", "Deploy and evaluate"],
  },
  {
    number: "02",
    slug: "rag-custom-llms",
    code: "RAG",
    favicon: "/service-icons/rag.svg",
    title: "RAG & Custom LLMs",
    description: "Search, retrieval, fine-tuning, and evaluation systems built around your knowledge and real user needs.",
    statement: "Give your product accurate answers grounded in private documents, databases, and domain-specific knowledge.",
    outcome: "A traceable knowledge system with strong retrieval quality, controlled generation, and repeatable evaluation.",
    skills: ["Embeddings", "Vector DB", "Fine-Tuning", "Evaluation"],
    deliverables: ["Data ingestion", "Retrieval pipeline", "Model adaptation", "Quality evaluation"],
    process: ["Audit knowledge", "Build retrieval", "Tune responses", "Measure accuracy"],
  },
  {
    number: "03",
    slug: "mobile-product-development",
    code: "APP",
    favicon: "/service-icons/mobile.svg",
    title: "Mobile Product Development",
    description: "Fast, polished iOS and Android products that bring AI features into a reliable everyday experience.",
    statement: "Move from product idea to a polished cross-platform application ready for real users and app store release.",
    outcome: "A stable, responsive mobile product with production APIs, analytics, notifications, and release-ready builds.",
    skills: ["Flutter", "React Native", "Firebase", "App Stores"],
    deliverables: ["Product UI", "iOS and Android apps", "Backend integration", "Store delivery"],
    process: ["Define the product", "Prototype flows", "Build and integrate", "Test and release"],
  },
  {
    number: "04",
    slug: "backends-deployment",
    code: "API",
    favicon: "/service-icons/backend.svg",
    title: "Backends & Deployment",
    description: "Scalable APIs, model serving, databases, authentication, and cloud infrastructure ready for production.",
    statement: "Build the reliable system behind your product, from secure data models to production model serving.",
    outcome: "A documented backend with predictable performance, secure access, observability, and room to scale.",
    skills: ["Node.js", "PostgreSQL", "RunPod", "CI/CD"],
    deliverables: ["REST APIs", "Database design", "Authentication", "Production deployment"],
    process: ["Model the system", "Build core APIs", "Secure and test", "Deploy and monitor"],
  },
  {
    number: "05",
    slug: "cicd-release-automation",
    code: "CI/CD",
    favicon: "/service-icons/cicd.svg",
    title: "CI/CD & Release Automation",
    description: "Automated build, test, and release pipelines that make shipping safer, faster, and repeatable across environments.",
    statement: "Replace fragile manual releases with a clear delivery pipeline that catches issues before customers do.",
    outcome: "Repeatable releases with automated checks, environment control, versioning, and faster recovery when something fails.",
    skills: ["GitHub Actions", "Docker", "Testing", "App Delivery"],
    deliverables: ["Build pipelines", "Automated testing", "Release workflows", "Environment controls"],
    process: ["Audit delivery", "Define quality gates", "Automate releases", "Track reliability"],
  },
  {
    number: "06",
    slug: "cloud-infrastructure-management",
    code: "CLOUD",
    favicon: "/service-icons/cloud.svg",
    title: "Cloud Infrastructure Management",
    description: "Reliable cloud environments for applications, models, databases, monitoring, and production scaling.",
    statement: "Create a cloud foundation that keeps your application available, observable, secure, and ready to grow.",
    outcome: "A maintainable infrastructure setup with clear environments, model serving, monitoring, backups, and scaling rules.",
    skills: ["AWS", "RunPod", "Containers", "Monitoring"],
    deliverables: ["Cloud architecture", "Container workloads", "Model hosting", "Monitoring and alerts"],
    process: ["Assess workloads", "Design infrastructure", "Provision services", "Monitor and optimize"],
  },
  {
    number: "07",
    slug: "saas-api-integrations",
    code: "SAAS",
    favicon: "/service-icons/saas.svg",
    title: "SaaS & API Integrations",
    description: "Connected product ecosystems with secure APIs, subscriptions, authentication, webhooks, and third-party services.",
    statement: "Connect the services your product depends on without creating brittle workflows or hidden operational risk.",
    outcome: "A resilient integration layer with secure authentication, reliable webhooks, error recovery, and useful operational logs.",
    skills: ["REST APIs", "Webhooks", "Auth", "Automation"],
    deliverables: ["API integrations", "Webhook systems", "Subscription flows", "Automation workflows"],
    process: ["Map integrations", "Design contracts", "Handle failures", "Launch and observe"],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
