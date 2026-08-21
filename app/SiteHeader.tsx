"use client";

import { useEffect, useRef, useState } from "react";
import { services } from "./serviceData";
import { scrollToSection } from "./scrollToSection";

const navItems = [
  { label: "About", target: "about" },
  { label: "Work", target: "work" },
  { label: "Experience", target: "experience" },
];

export function SiteHeader() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const target = window.sessionStorage.getItem("portfolio-section");
    if (window.location.pathname === "/" && target) {
      window.sessionStorage.removeItem("portfolio-section");
      window.setTimeout(() => jumpToTarget(target), 180);
    }
    return () => {
      if (servicesCloseTimer.current) window.clearTimeout(servicesCloseTimer.current);
    };
  }, []);

  const openServices = () => {
    if (servicesCloseTimer.current) {
      window.clearTimeout(servicesCloseTimer.current);
      servicesCloseTimer.current = null;
    }
    setServicesOpen(true);
  };

  const closeServicesSoon = () => {
    if (servicesCloseTimer.current) window.clearTimeout(servicesCloseTimer.current);
    servicesCloseTimer.current = window.setTimeout(() => {
      setServicesOpen(false);
      servicesCloseTimer.current = null;
    }, 360);
  };

  const jumpToTarget = (target: string) => {
    scrollToSection(target, target === "about" || target === "contact");
  };

  const goToSection = (target: string) => {
    setServicesOpen(false);
    if (document.getElementById(target)) {
      jumpToTarget(target);
      return;
    }

    window.sessionStorage.setItem("portfolio-section", target);
    window.location.assign("/");
  };

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <a className="wordmark" href="/" aria-label="Muhammad Musa home">
        <span className="wordmark-name">MUHAMMAD MUSA</span>
      </a>

      <div className="nav-links">
        {navItems.map((item) => (
          <button type="button" onClick={() => goToSection(item.target)} key={item.label}>
            {item.label}
          </button>
        ))}

        <a className="nav-blog-link" href="/blog">Blog</a>

        <div
          className={`nav-services-menu${servicesOpen ? " is-open" : ""}`}
          onMouseEnter={openServices}
          onMouseLeave={closeServicesSoon}
          onFocus={openServices}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setServicesOpen(false);
            }
          }}
        >
          <button
            className="nav-services-trigger"
            type="button"
            aria-expanded={servicesOpen}
            onClick={() => setServicesOpen((open) => !open)}
          >
            SERVICES <span aria-hidden="true">+</span>
          </button>

          <div className="nav-services-panel">
            <header>
              <span>007 / SERVICES</span>
              <strong>SELECT A CAPABILITY</strong>
            </header>
            <div>
              {services.map((service) => (
                <a href={`/services/${service.slug}`} key={service.slug} onClick={() => setServicesOpen(false)}>
                  <span>{service.number}</span>
                  <strong>{service.title}</strong>
                  <b aria-hidden="true">↗</b>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="nav-actions">
        <button className="nav-mobile-services" type="button" onClick={() => goToSection("services")}>SERVICES</button>
        <button className="nav-cta nav-cta-project" type="button" onClick={() => goToSection("contact")}>
          [ START A PROJECT ]
        </button>
        <a className="nav-cta nav-cta-call" href="https://calendly.com/musajawad004/" target="_blank" rel="noreferrer">
          [ BOOK A CALL ]
        </a>
      </div>
    </nav>
  );
}
