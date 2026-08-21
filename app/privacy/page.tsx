import type { Metadata } from "next";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { SmoothMotion } from "../SmoothMotion";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy - Muhammad Musa" },
  description: "Privacy policy for the Muhammad Musa portfolio and contact form.",
  openGraph: {
    title: "Privacy Policy - Muhammad Musa",
    description: "How information submitted through this portfolio is handled.",
    images: [],
  },
  twitter: {
    title: "Privacy Policy - Muhammad Musa",
    description: "How information submitted through this portfolio is handled.",
    images: [],
  },
};

const policySections = [
  {
    number: "01",
    title: "Information you provide",
    body: "When you use the contact form, this site collects the name, email address, and project message you choose to submit. Please do not include passwords, payment information, health information, or other sensitive personal data.",
  },
  {
    number: "02",
    title: "How the information is used",
    body: "Submitted information is used only to review your inquiry, reply to you, discuss a potential project, and keep reasonable business records related to that conversation.",
  },
  {
    number: "03",
    title: "Email delivery",
    body: "The contact form uses Resend as an email delivery provider. Your submitted name, email address, and message are transmitted to Resend only so the inquiry can be delivered to Muhammad Musa.",
  },
  {
    number: "04",
    title: "Cookies and tracking",
    body: "This portfolio does not use advertising cookies or sell visitor data. The site may receive standard technical request information from its hosting provider for security, reliability, and performance purposes.",
  },
  {
    number: "05",
    title: "Retention and disclosure",
    body: "Messages may be retained for as long as reasonably needed to respond, maintain project records, or meet legal obligations. Personal information is not sold. It may be disclosed only when required by law or needed to protect the site and its users.",
  },
  {
    number: "06",
    title: "External links",
    body: "This site links to GitHub, LinkedIn, Gmail, Calendly, credential providers, and other external services. Their own privacy policies apply after you leave this site.",
  },
  {
    number: "07",
    title: "Your choices",
    body: "You may ask about, correct, or request deletion of personal information you previously submitted, subject to any records that must be retained for legal or legitimate business purposes.",
  },
  {
    number: "08",
    title: "Policy updates",
    body: "This policy may be updated when the portfolio, contact tools, or legal requirements change. The latest effective date will always appear at the top of this page.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <SmoothMotion />
      <div id="smooth-wrapper">
        <main className="privacy-page" id="smooth-content">
          <section className="privacy-hero" aria-labelledby="privacy-title">
            <div className="privacy-hero-meta">
              <span>009 / LEGAL</span>
              <span>EFFECTIVE / AUG 21 2026</span>
            </div>
            <div className="privacy-hero-copy">
              <p>PORTFOLIO DATA POLICY</p>
              <h1 id="privacy-title">Privacy, kept simple.</h1>
              <p>This page explains what this portfolio collects, why it is needed, and how you can contact me about your information.</p>
            </div>
          </section>

          <section className="privacy-policy" aria-label="Privacy policy sections">
            {policySections.map((section) => (
              <article key={section.number}>
                <span>{section.number}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="privacy-contact">
            <div>
              <p>QUESTIONS / REQUESTS</p>
              <h2>Contact Muhammad Musa.</h2>
            </div>
            <a href="mailto:musajawad004@gmail.com">MUSAJAWAD004@GMAIL.COM <span aria-hidden="true">↗</span></a>
          </section>

          <SiteFooter />
        </main>
      </div>
    </>
  );
}
