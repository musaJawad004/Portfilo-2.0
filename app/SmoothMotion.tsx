"use client";

import { useLayoutEffect } from "react";

type PortfolioSmoother = {
  kill: () => void;
  scrollTo: (target: Element | string | number, smooth?: boolean, position?: string) => void;
};

declare global {
  interface Window {
    __portfolioSmoother?: PortfolioSmoother;
  }
}

const revealSelector = [
  ".about-section",
  ".project-showcase",
  ".skills-section",
  ".services-section",
  ".experience-section",
  ".recognition-section",
  ".home-blog-section",
  ".service-detail-overview",
  ".service-detail-process",
  ".service-detail-stack",
  ".service-detail-next",
  ".site-footer",
  ".privacy-policy",
  ".privacy-contact",
].join(", ");

export function SmoothMotion() {
  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let disposed = false;
    let cleanup = () => {};

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/ScrollSmoother"),
    ]).then(([gsapModule, triggerModule, smootherModule]) => {
      if (disposed) return;

      const gsap = gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      const ScrollSmoother = smootherModule.ScrollSmoother;

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
      document.documentElement.classList.add("gsap-motion-ready");

      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 0.85,
        smoothTouch: 0.08,
        effects: true,
        normalizeScroll: false,
      });

      window.__portfolioSmoother = smoother;

      const revealTweens: ReturnType<typeof gsap.fromTo>[] = [];
      const revealTriggers = gsap.utils.toArray<HTMLElement>(revealSelector).map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: "top 90%",
          once: true,
          onEnter: () => {
            const tween = gsap.fromTo(
              section,
              { autoAlpha: 0, y: 30 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.72,
                ease: "power3.out",
                clearProps: "transform,opacity,visibility",
              },
            );
            revealTweens.push(tween);
          },
        }),
      );

      const projectStory = document.querySelector<HTMLElement>(".project-scroll-story");
      const projectSticky = document.querySelector<HTMLElement>(".project-scroll-sticky");
      const projectPin = projectStory && projectSticky
        ? ScrollTrigger.create({
            trigger: projectStory,
            start: "top 72px",
            end: "bottom bottom",
            pin: projectSticky,
            pinSpacing: false,
            invalidateOnRefresh: true,
          })
        : null;

      ScrollTrigger.refresh();

      cleanup = () => {
        revealTriggers.forEach((trigger) => trigger.kill());
        revealTweens.forEach((tween) => {
          tween.kill();
        });
        projectPin?.kill();
        smoother.kill();
        if (window.__portfolioSmoother === smoother) delete window.__portfolioSmoother;
        document.documentElement.classList.remove("gsap-motion-ready");
      };
    }).catch(() => {
      document.documentElement.classList.remove("gsap-motion-ready");
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return null;
}
