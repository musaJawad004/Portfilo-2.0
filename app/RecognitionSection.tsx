const honors = [
  {
    number: "01",
    title: "Innovation in AI Integration",
    type: "INNOVATION AWARD",
    date: "01.2026",
    description:
      "Received for pioneering the integration of Ollama and fine-tuned LLMs into production mobile apps, improving user engagement and reducing response latency.",
  },
  {
    number: "02",
    title: "Top Performer Award",
    type: "TOP PERFORMER",
    date: "03.2025",
    description:
      "Recognized for consistently delivering high-quality AI-powered mobile applications ahead of schedule and demonstrating technical leadership across projects.",
  },
  {
    number: "03",
    title: "Employee of the Month",
    type: "EMPLOYEE RECOGNITION",
    date: "08.2024",
    description:
      "Awarded for outstanding team contributions, building scalable LLM-powered features, mentoring junior developers, and driving key product milestones.",
  },
];

const certifications = [
  {
    number: "01",
    title: "Claude 101",
    issuer: "ANTHROPIC",
    date: "08.05.2026",
    credential: "qw4i3pvm4gqf",
    href: "https://verify.skilljar.com/c/qw4i3pvm4gqf",
  },
  {
    number: "02",
    title: "Introduction to Claude Cowork",
    issuer: "ANTHROPIC",
    date: "08.05.2026",
    credential: "xmjiy83q3pqs",
    href: "https://verify.skilljar.com/c/xmjiy83q3pqs",
  },
];

export function RecognitionSection() {
  return (
    <section className="recognition-section" id="recognition" aria-labelledby="recognition-title">
      <header className="recognition-heading">
        <div>
          <p>006 / RECOGNITION</p>
          <span>05 VERIFIED RECORDS</span>
        </div>
        <h2 id="recognition-title">Recognition</h2>
        <p>HONORS, AWARDS, AND CERTIFICATIONS EARNED THROUGH PRODUCT WORK.</p>
      </header>

      <div className="recognition-grid">
        <article className="recognition-panel honors-panel">
          <header>
            <span>HONORS &amp; AWARDS</span>
            <span>03 / GLIXEN</span>
          </header>
          <div className="honors-list">
            {honors.map((honor) => (
              <article key={honor.number}>
                <div className="recognition-mark" aria-hidden="true">
                  <span>{honor.number}</span>
                </div>
                <div>
                  <h3>{honor.title}</h3>
                  <p className="recognition-meta">
                    {honor.type} / {honor.date} / GLIXEN TECHNOLOGIES
                  </p>
                  <p className="recognition-description">{honor.description}</p>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="recognition-panel certifications-panel">
          <header>
            <span>CERTIFICATIONS</span>
            <span>02 / ANTHROPIC</span>
          </header>
          <div className="certification-list">
            {certifications.map((certificate) => (
              <a
                href={certificate.href}
                key={certificate.number}
                target="_blank"
                rel="noreferrer"
                aria-label={`Verify ${certificate.title} certificate`}
              >
                <div className="recognition-mark is-certificate" aria-hidden="true">
                  <span>{certificate.number}</span>
                </div>
                <div>
                  <p className="certification-issuer">{certificate.issuer}</p>
                  <h3>{certificate.title}</h3>
                  <p className="recognition-meta">
                    {certificate.date} / {certificate.credential}
                  </p>
                </div>
                <span className="certification-action">
                  VERIFY <b aria-hidden="true">↗</b>
                </span>
              </a>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
