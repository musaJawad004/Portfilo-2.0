const achievements = [
  {
    label: "AI AGENTS",
    detail: "Built AI agents and LLM-powered workflows with OpenAI, Ollama, and local models.",
  },
  {
    label: "CUSTOM LLMS",
    detail: "Trained and fine-tuned 5+ custom LLMs for production product features.",
  },
  {
    label: "DEPLOYMENT",
    detail: "Deployed and served models on RunPod for reliable production AI features.",
  },
  {
    label: "MOBILE APPS",
    detail: "Shipped 10+ iOS and Android apps with Flutter and React Native.",
  },
  {
    label: "PRODUCT GROWTH",
    detail: "Grew active users to 10K+ across products shipped to real customers.",
  },
  {
    label: "BACKENDS",
    detail: "Developed REST APIs, scalable backends, and SaaS automation tools with Node.js and Express.",
  },
];

const tools = [
  "LLMs",
  "AI Agents",
  "RAG",
  "Ollama",
  "RunPod",
  "Flutter",
  "React Native",
  "Node.js",
  "Express",
  "Firebase",
  "PostgreSQL",
  "MongoDB",
];

export function ExperienceSection() {
  return (
    <section className="experience-section" id="experience" aria-labelledby="experience-title">
      <header className="experience-heading">
        <div>
          <p>005 / EXPERIENCE</p>
          <span>01 ACTIVE ROLE</span>
        </div>
        <h2 id="experience-title">Experience</h2>
        <p>BUILDING PRODUCTION AI AND MOBILE PRODUCTS FROM IDEA TO RELEASE.</p>
      </header>

      <div className="experience-board">
        <aside className="experience-facts" aria-label="Employment details">
          <div>
            <small>START DATE</small>
            <strong>JUN 2023</strong>
          </div>
          <div>
            <small>STATUS</small>
            <strong>PRESENT</strong>
          </div>
          <div>
            <small>DURATION</small>
            <strong>03Y 03M</strong>
          </div>
          <div>
            <small>LOCATION</small>
            <strong>LAHORE / REMOTE</strong>
          </div>
        </aside>

        <article className="experience-role">
          <header className="experience-role-header">
            <span>01 / CURRENT POSITION</span>
            <span>FULL-TIME / REMOTE</span>
          </header>

          <div className="experience-role-intro">
            <div>
              <p>GLIXEN TECHNOLOGIES</p>
              <h3>AI Engineer &amp; Full-Stack Mobile App Developer</h3>
            </div>
            <p>
              Building AI agents, RAG systems, custom LLMs, mobile apps, and
              scalable backends that ship to real users.
            </p>
          </div>

          <ol className="experience-achievements">
            {achievements.map((achievement, index) => (
              <li key={achievement.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{achievement.label}</strong>
                <p>{achievement.detail}</p>
              </li>
            ))}
          </ol>

          <footer className="experience-tools">
            <span>TOOLS / SYSTEMS</span>
            <ul>
              {tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </footer>
        </article>
      </div>
    </section>
  );
}
