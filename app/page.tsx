import { AsciiPortrait } from "./AsciiPortrait";
import { ExperienceSection } from "./ExperienceSection";
import { ProjectsShowcase } from "./ProjectsShowcase";
import { RecognitionSection } from "./RecognitionSection";
import { ServicesSection } from "./ServicesSection";
import { SiteHeader } from "./SiteHeader";
import { SkillsSection } from "./SkillsSection";
import { SectionJump } from "./SectionJump";
import { WorldMap } from "@/components/ui/map";
import { SmoothMotion } from "./SmoothMotion";
import { SiteFooter } from "./SiteFooter";
import { LatestBlogSection } from "./LatestBlogSection";
import { NewsletterSection } from "./NewsletterSection";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <SmoothMotion />
      <div id="smooth-wrapper">
      <main className="hero-shell" id="smooth-content">

      <section className="hero-stage" aria-labelledby="hero-title">
        <div className="corner-index corner-index-left">001 / HOME</div>

        <aside className="capability-index" aria-label="Core capabilities">
          <div className="capability-heading">
            <span>CORE CAPABILITIES</span>
            <span>03 / DISCIPLINES</span>
          </div>
          <div className="capability-grid">
            <div>
              <span>01</span>
              <strong>AI AGENTS</strong>
              <small>TOOLS / WORKFLOWS</small>
            </div>
            <div>
              <span>02</span>
              <strong>MOBILE PRODUCTS</strong>
              <small>IOS / ANDROID</small>
            </div>
            <div>
              <span>03</span>
              <strong>RAG &amp; LLMS</strong>
              <small>SEARCH / SYSTEMS</small>
            </div>
          </div>
        </aside>

        <div className="portrait-field">
          <AsciiPortrait />
        </div>

        <article className="identity-panel">
          <header className="panel-status">
            <span className="status-dot" aria-hidden="true" />
            <span>AVAILABLE FOR PROJECTS</span>
            <span className="panel-id">ID_MM_001</span>
          </header>

          <div className="panel-content">
            <p className="eyebrow">01 / IDENTITY</p>
            <p className="person-name">Muhammad Musa</p>
            <h1 id="hero-title">
              <span>I Build AI Products</span>
              <span>That Actually Ship.</span>
            </h1>
            <p className="role">AI Engineer &amp; Full-Stack Mobile App Developer</p>

            <dl className="metrics" aria-label="Career highlights">
              <div>
                <dt>YEARS</dt>
                <dd>03+</dd>
              </div>
              <div>
                <dt>APPS</dt>
                <dd>10+</dd>
              </div>
              <div>
                <dt>USERS</dt>
                <dd>10K+</dd>
              </div>
              <div>
                <dt>LLMS</dt>
                <dd>05+</dd>
              </div>
            </dl>
          </div>

          <footer className="panel-actions">
            <SectionJump target="work">
              <span>VIEW SELECTED WORK</span>
              <span aria-hidden="true">↗</span>
            </SectionJump>
            <SectionJump target="contact">
              <span>START A PROJECT</span>
              <span className="action-arrow" aria-hidden="true">↗</span>
            </SectionJump>
          </footer>
        </article>

      </section>

      <section className="about-section" id="about" aria-labelledby="about-title">
        <header className="about-heading">
          <p className="about-index">002 / ABOUT</p>
          <div>
            <h2 id="about-title">About Me</h2>
            <p className="about-intro">
              AI engineer and product builder based in Lahore, Pakistan.
            </p>
          </div>
        </header>

        <div className="about-grid">
          <article className="about-card location-card">
            <header className="about-card-header">
              <span>01 / LOCATION</span>
              <span>31.5204° N / 74.3587° E</span>
            </header>

            <div className="location-copy">
              <p>BASED IN</p>
              <h3>Lahore, Pakistan</h3>
            </div>

            <div className="location-visual" aria-label="Location marker for Lahore, Pakistan">
              <WorldMap className="location-world-map" />
            </div>
          </article>

          <article className="about-card what-card">
            <header className="about-card-header">
              <span>03 / WHAT I DO</span>
              <span>IDEA → PRODUCTION</span>
            </header>

            <div className="what-content">
              <p className="what-kicker">GLIXEN TECHNOLOGIES / AI ENGINEER</p>
              <h3>I build AI apps that actually ship.</h3>
              <p className="what-lead">Not demos. Real products people use every day.</p>
              <div className="what-details">
                <p className="what-body">
                  I build intelligent systems, then turn them into mobile and
                  full-stack products that launch.
                </p>
                <div className="what-build-block">
                  <p className="what-build-title">WHAT I BUILD</p>
                  <ul>
                    <li>LLMs</li>
                    <li>AI Agents</li>
                    <li>RAG Systems</li>
                    <li>CI/CD Workflows</li>
                    <li>Mobile Apps</li>
                    <li>Backends</li>
                  </ul>
                </div>
              </div>
            </div>

            <ol className="what-process" aria-label="Product results">
              <li>
                <span>YEARS</span>
                <strong>03+</strong>
                <small>BUILDING PRODUCTS</small>
              </li>
              <li>
                <span>APPS</span>
                <strong>10+</strong>
                <small>IOS + ANDROID</small>
              </li>
              <li>
                <span>USERS</span>
                <strong>10K+</strong>
                <small>ACTIVE ACROSS APPS</small>
              </li>
              <li>
                <span>LLMS</span>
                <strong>05+</strong>
                <small>TRAINED + TUNED</small>
              </li>
            </ol>
          </article>
        </div>

        <div className="about-support-grid">
          <article className="about-card quotes-card">
            <header className="about-card-header">
              <span>02 / FAVORITE QUOTES</span>
              <span>03 / PRINCIPLES</span>
            </header>

            <div className="quotes-list">
              <blockquote>
                <p>“If you can&apos;t explain it simply, you don&apos;t understand it well enough.”</p>
                <cite>- Albert Einstein</cite>
              </blockquote>
              <blockquote>
                <p>“Life is what happens to you while you&apos;re busy making other plans.”</p>
                <cite>- John Lennon</cite>
              </blockquote>
              <blockquote>
                <p>“Knowing is not enough, we must apply. Willing is not enough, we must do.”</p>
                <cite>- Bruce Lee</cite>
              </blockquote>
            </div>
          </article>
        </div>
      </section>

      <ProjectsShowcase />
      <SkillsSection />
      <ServicesSection />
      <ExperienceSection />
      <RecognitionSection />
      <LatestBlogSection />
      <NewsletterSection />
      <SiteFooter />
      </main>
      </div>
    </>
  );
}
