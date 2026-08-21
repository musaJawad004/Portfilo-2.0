import { SiteHeader } from "./SiteHeader";
import { Service, services } from "./serviceData";
import { SmoothMotion } from "./SmoothMotion";
import { SiteFooter } from "./SiteFooter";

export function ServiceDetail({ service }: { service: Service }) {
  const currentIndex = services.findIndex((item) => item.slug === service.slug);
  const nextService = services[(currentIndex + 1) % services.length];

  return (
    <>
      <title>{`Muhammad Musa - ${service.title}`}</title>
      <link rel="icon" type="image/svg+xml" sizes="any" href={`${service.favicon}?v=3`} />
      <link rel="shortcut icon" type="image/svg+xml" href={`${service.favicon}?v=3`} />
      <SiteHeader />
      <SmoothMotion />
      <div id="smooth-wrapper">
      <main id="smooth-content" className={`service-page service-page-${service.number}`}>

      <section className="service-detail-hero" aria-labelledby="service-detail-title">
        <div className="service-detail-copy">
          <p className="service-detail-path">
            <a href="/#services">SERVICES</a> / {service.number}
          </p>
          <p className="service-detail-kicker">PRODUCTION CAPABILITY / MM_{service.number}</p>
          <h1 id="service-detail-title">{service.title}</h1>
          <p className="service-detail-statement">{service.statement}</p>
          <div className="service-detail-actions">
            <a href="https://calendly.com/musajawad004/" target="_blank" rel="noreferrer">
              START THIS PROJECT <span aria-hidden="true">↗</span>
            </a>
            <a href="/#services">ALL SERVICES</a>
          </div>
        </div>

        <div className="service-detail-visual" aria-hidden="true">
          <span className="detail-visual-index">{service.number}</span>
          <div className="detail-visual-system">
            <i /><i /><i /><i />
            <strong>{service.code}</strong>
          </div>
          <p>IDEA / SYSTEM / PRODUCT</p>
        </div>
      </section>

      <section className="service-detail-overview" aria-label="Service overview">
        <div className="service-overview-lead">
          <p>WHAT YOU GET</p>
          <h2>{service.outcome}</h2>
        </div>

        <div className="service-deliverables">
          {service.deliverables.map((item, index) => (
            <article key={item}>
              <span>0{index + 1}</span>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="service-detail-process" aria-labelledby="service-process-title">
        <header>
          <p>DELIVERY SYSTEM</p>
          <h2 id="service-process-title">FROM PROBLEM TO PRODUCTION</h2>
        </header>

        <ol>
          {service.process.map((step, index) => (
            <li key={step}>
              <span>0{index + 1}</span>
              <strong>{step}</strong>
              <i aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <section className="service-detail-stack" aria-label="Technology stack">
        <p>CORE STACK</p>
        <ul>
          {service.skills.map((skill) => <li key={skill}>{skill}</li>)}
        </ul>
      </section>

      <footer className="service-detail-next">
        <span>NEXT SERVICE / {nextService.number}</span>
        <a href={`/services/${nextService.slug}`}>
          {nextService.title} <b aria-hidden="true">→</b>
        </a>
      </footer>
      <SiteFooter />
      </main>
      </div>
    </>
  );
}
