"use client";

import { useEffect, useRef } from "react";
import { services } from "./serviceData";

export function ServicesSection() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let activeCard = 0;
    let resetTimer: number | undefined;
    const timer = window.setInterval(() => {
      if (isPaused.current || document.hidden) return;

      const cards = Array.from(gallery.children) as HTMLElement[];
      if (!cards.length) return;

      activeCard += 1;
      gallery.scrollTo({
        left: cards[activeCard].offsetLeft - cards[0].offsetLeft,
        behavior: "smooth",
      });

      if (activeCard === services.length) {
        resetTimer = window.setTimeout(() => {
          activeCard = 0;
          gallery.scrollTo({ left: 0, behavior: "auto" });
        }, 720);
      }
    }, 2200);

    return () => {
      window.clearInterval(timer);
      if (resetTimer) window.clearTimeout(resetTimer);
    };
  }, []);

  return (
    <section className="services-section" id="services" aria-labelledby="services-title">
      <header className="services-heading">
        <div className="services-title-block">
          <p><span aria-hidden="true" /> MY EXPERTISE</p>
          <h2 id="services-title">WHAT I OFFER</h2>
        </div>

        <p className="services-intro">
          I design and build production AI products from intelligent systems to
          mobile experiences and scalable backends. Every service is focused on
          one result: a reliable product people can actually use.
        </p>
      </header>

      <div className="services-gallery-wrap">
        <div className="services-scroll-note" aria-hidden="true">
          <span>SCROLL</span>
          <i />
          <b>→</b>
        </div>

        <div
          className="services-gallery"
          aria-label="Services offered"
          ref={galleryRef}
          onFocus={() => { isPaused.current = true; }}
          onBlur={() => { isPaused.current = false; }}
          onTouchStart={() => { isPaused.current = true; }}
          onTouchEnd={() => { isPaused.current = false; }}
        >
          {[...services, ...services].map((service, index) => (
            <article
              className="service-card"
              key={`${service.number}-${index}`}
              aria-hidden={index >= services.length ? true : undefined}
            >
              <header>
                <span>{service.number} / SERVICE</span>
                <span>MM_{service.number}</span>
              </header>

              <div className="service-visual" aria-hidden="true">
                <div className="service-orbit service-orbit-one" />
                <div className="service-orbit service-orbit-two" />
                <span>{service.code}</span>
                <i className="service-node service-node-one" />
                <i className="service-node service-node-two" />
                <i className="service-node service-node-three" />
              </div>

              <div className="service-copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul aria-label={`${service.title} technologies`}>
                  {service.skills.map((skill) => <li key={skill}>{skill}</li>)}
                </ul>
                <a
                  className="service-detail-link"
                  href={`/services/${service.slug}`}
                  tabIndex={index >= services.length ? -1 : undefined}
                >
                  VIEW SERVICE <span aria-hidden="true">↗</span>
                </a>
              </div>

              <span className="service-index" aria-hidden="true">{service.number}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
