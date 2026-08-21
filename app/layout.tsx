import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Muhammad Musa | AI Engineer & Product Builder",
    template: "%s | Muhammad Musa",
  },
  description:
    "I build AI products that actually ship: AI agents, RAG systems, custom LLMs, and production mobile applications.",
  applicationName: "Muhammad Musa Portfolio",
  authors: [{ name: "Muhammad Musa" }],
  creator: "Muhammad Musa",
  publisher: "Muhammad Musa",
  category: "technology",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  keywords: [
    "Muhammad Musa",
    "AI Engineer",
    "AI Product Engineer",
    "Mobile App Developer",
    "LLM Developer",
    "RAG Systems",
  ],
  icons: {
    icon: "/favicon-mm-white.svg",
    shortcut: "/favicon-mm-white.svg",
    apple: "/favicon-mm-white.svg",
  },
  openGraph: {
    type: "website",
    title: "Muhammad Musa | AI Engineer & Product Builder",
    description: "I Build AI Products That Actually Ship.",
    siteName: "Muhammad Musa Portfolio",
    images: [
      {
        url: "/og-banner.svg",
        width: 1200,
        height: 630,
        alt: "Muhammad Musa: I Build AI Products That Actually Ship.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Musa | AI Engineer & Product Builder",
    description: "I Build AI Products That Actually Ship.",
    images: ["/og-banner.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Muhammad Musa",
    jobTitle: "AI Engineer and Full-Stack Mobile App Developer",
    description:
      "AI engineer building production AI agents, RAG systems, custom LLMs, mobile apps, and scalable backends.",
    worksFor: {
      "@type": "Organization",
      name: "Glixen Technologies",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    sameAs: [
      "https://github.com/musaJawad004",
      "https://www.linkedin.com/in/muhammadmusadev/",
    ],
    ...(siteUrl ? { url: siteUrl } : {}),
  };

  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
