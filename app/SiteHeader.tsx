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
  const [compactMenuOpen, setCompactMenuOpen] = useState(false);
  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compactMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!compactMenuOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!compactMenuRef.current?.contains(event.target as Node)) {
        setCompactMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCompactMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [compactMenuOpen]);

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
    setCompactMenuOpen(false);
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
        <a className="nav-blog-link" href="/newsletter">Newsletter</a>
        <a className="nav-blog-link" href="/guestbook">Guestbook</a>

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

      <div className={`nav-compact-menu${compactMenuOpen ? " is-open" : ""}`} ref={compactMenuRef}>
        <button
          className="nav-compact-trigger"
          type="button"
          aria-label={compactMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="compact-navigation-panel"
          aria-expanded={compactMenuOpen}
          onClick={() => setCompactMenuOpen((open) => !open)}
        >
          <span aria-hidden="true"><i /><i /><i /></span>
        </button>

        <div className="nav-compact-panel" id="compact-navigation-panel">
          <header>
            <span>NAVIGATION / MENU</span>
            <strong>ALL OPTIONS</strong>
          </header>

          <div className="nav-compact-primary">
            {navItems.map((item, index) => (
              <button type="button" onClick={() => goToSection(item.target)} key={item.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
              </button>
            ))}
            <a href="/blog" onClick={() => setCompactMenuOpen(false)}>
              <span>04</span><strong>Blog</strong>
            </a>
            <a href="/newsletter" onClick={() => setCompactMenuOpen(false)}>
              <span>05</span><strong>Newsletter</strong>
            </a>
            <a href="/guestbook" onClick={() => setCompactMenuOpen(false)}>
              <span>06</span><strong>Guestbook</strong>
            </a>
          </div>

          <div className="nav-compact-services-heading">
            <span>007 / SERVICES</span>
            <strong>SELECT A CAPABILITY</strong>
          </div>
          <div className="nav-compact-services">
            {services.map((service) => (
              <a href={`/services/${service.slug}`} key={service.slug} onClick={() => setCompactMenuOpen(false)}>
                <span>{service.number}</span>
                <strong>{service.title}</strong>
                <b aria-hidden="true">↗</b>
              </a>
            ))}
          </div>

          <footer>
            <button type="button" onClick={() => goToSection("contact")}>[ START A PROJECT ]</button>
            <a href="https://calendly.com/musajawad004/" target="_blank" rel="noreferrer">[ BOOK A CALL ]</a>
          </footer>
        </div>
      </div>
    </nav>
  );
}
