import { NewsletterHeader } from "../NewsletterHeader";
import { SubscribeForm } from "../SubscribeForm";

export const metadata = { title: "About" };

export default function NewsletterAboutPage() {
  return <div className="mmn-shell"><NewsletterHeader/><main className="mmn-about">
    <header><span className="mmn-kicker">ABOUT / THE EDITOR</span><h1>Muhammad Musa writes for builders who have to ship.</h1></header>
    <div className="mmn-about-grid">
      <article><span className="mmn-kicker">THE SHORT VERSION</span><p>I am an AI engineer and full-stack mobile app developer at Glixen Technologies in Lahore. I build AI agents, RAG systems, custom LLMs, mobile apps, and the production backends that keep them useful after launch.</p><p>Over the last three years, I have shipped 10+ iOS and Android apps, trained and fine-tuned 5+ custom language models, and helped products reach 10K+ active users.</p></article>
      <aside><span className="mmn-kicker">WHAT THIS NEWSLETTER COVERS</span><ul><li>AI agents and reliable tool use</li><li>RAG, retrieval, and evaluation</li><li>Mobile product engineering</li><li>Backends, cloud, CI/CD, and model ops</li><li>Honest field notes from production work</li></ul></aside>
    </div>
    <section className="mmn-about-principle"><span>01</span><h2>Useful before impressive.</h2><p>Every issue starts with a real engineering question, uses primary sources, shows the architecture, names the tradeoffs, and ends with a release checklist.</p></section>
    <section className="mmn-about-subscribe" id="subscribe"><div><span className="mmn-kicker">JOIN THE SIGNAL</span><h2>One researched issue matched to what you build.</h2></div><SubscribeForm/></section>
  </main><footer className="mmn-footer"><a href="/newsletter">← HOME</a><span>MUHAMMAD MUSA NEWSLETTER</span></footer></div>;
}
