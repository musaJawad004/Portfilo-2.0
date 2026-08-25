import { NewsletterHeader } from "./NewsletterHeader";
import { ArchiveGrid, type CardPost } from "./ArchiveGrid";
import { FirstVisitSubscribe } from "./FirstVisitSubscribe";
import { newsletterPosts } from "../../lib/newsletter-data";

export default function NewsletterPage() {
  // Trim to the fields the cards need so the client payload stays small
  // (drops the heavy `sections` bodies).
  const cards: CardPost[] = newsletterPosts.map(
    ({ slug, title, topic, excerpt, issue, readingMinutes, date, color, label }) => ({
      slug, title, topic, excerpt, issue, readingMinutes, date, color, label,
    }),
  );

  return <div className="mmn-shell">
    <NewsletterHeader/>
    <section className="mmn-masthead">
      <div>
        <span className="mmn-kicker">INDEPENDENT / PRODUCTION FIELD NOTES</span>
        <h1>MUHAMMAD MUSA NEWSLETTER</h1>
        <p>Field notes for people building AI products that have to work after the demo.</p>
      </div>
    </section>
    <main className="mmn-main">
      <header className="mmn-section-head">
        <div><span className="mmn-kicker">ARCHIVE / {newsletterPosts.length}</span><h2>Recent posts</h2></div>
        <p>Primary sources, production patterns, and honest tradeoffs. NGL, the useful part starts where the demo ends.</p>
      </header>
      <ArchiveGrid posts={cards} />
    </main>
    <footer className="mmn-footer"><span>MUHAMMAD MUSA NEWSLETTER / 2026</span><span>RESEARCHED FROM PRIMARY SOURCES</span></footer>
    <FirstVisitSubscribe />
  </div>;
}
