"use client";

import type { ReactNode } from "react";
import { scrollToSection } from "./scrollToSection";

export function SectionJump({ target, children }: { target: string; children: ReactNode }) {
  const jumpToSection = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(target, target === "contact");
  };

  return (
    <a href={`#${target}`} onClick={jumpToSection}>
      {children}
    </a>
  );
}
