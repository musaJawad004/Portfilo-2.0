import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Muhammad Musa Newsletter", template: "%s | Muhammad Musa Newsletter" },
  description: "Field notes on AI agents, RAG, models, mobile products, backends, cloud systems, and developer tools.",
  openGraph: { title: "Muhammad Musa Newsletter", description: "Production notes for people who ship AI products.", type: "website" },
};

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
