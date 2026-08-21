"use client";

export function scrollToSection(target: string, smooth = false) {
  const section = document.getElementById(target);
  if (!section) return;

  const headerHeight = document.querySelector<HTMLElement>(".site-nav")?.getBoundingClientRect().height ?? 72;
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);

  if (window.__portfolioSmoother) {
    window.__portfolioSmoother.scrollTo(section, smooth, `top ${headerHeight}px`);
    return;
  }

  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  document.documentElement.classList.toggle("instant-section-jump", !smooth);
  window.scrollTo({
    top: Math.max(0, sectionTop - headerHeight),
    behavior: smooth ? "smooth" : "auto",
  });
  window.requestAnimationFrame(() => document.documentElement.classList.remove("instant-section-jump"));
}

