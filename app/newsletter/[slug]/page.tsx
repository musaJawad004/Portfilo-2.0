import { notFound } from "next/navigation";
import { getNewsletterPost, newsletterPosts } from "../../../lib/newsletter-data";
import { getAuthoredArticle } from "../../../lib/newsletter-articles";
import { NewsletterHeader } from "../NewsletterHeader";
import { NewsletterCover } from "../NewsletterCover";
import { ArticleVisuals } from "../ArticleVisuals";
import { ArticleBody } from "../ArticleBody";

export function generateStaticParams() {
  return newsletterPosts.map(({ slug }) => ({ slug }));
}

export default async function IssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getNewsletterPost(slug);
  if (!post) notFound();

  const authored = getAuthoredArticle(slug);
  const title = authored?.title ?? post.title;
  const excerpt = authored?.excerpt ?? post.excerpt;
  const readingMinutes = authored?.readingMinutes ?? post.readingMinutes;

  return (
    <div className="mmn-shell">
      <NewsletterHeader />
      <article className="mmn-article">
        <div className="mmn-article-top">
          <NewsletterCover post={post} featured />
          <div className="mmn-article-title">
            <span className="mmn-kicker">ISSUE {String(post.issue).padStart(3, "0")} / {post.topic}</span>
            <h1>{title}</h1>
            <p>{excerpt}</p>
            <span className="mmn-kicker">{post.date} / {readingMinutes} MIN READ</span>
          </div>
        </div>
        <div className="mmn-article-body">
          <aside className="mmn-aside">
            MUHAMMAD MUSA<br />{post.topic}<br />PRODUCTION FIELD NOTE<br /><br />SOURCE-LED<br />NO SPONSORED LINKS
          </aside>
          {authored ? (
            <div>
              <ArticleBody blocks={authored.blocks} />
            </div>
          ) : (
            <div className="mmn-prose">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((p, index) => (
                    <p key={p}>
                      {index === 0 ? (
                        <>
                          <strong>{p.split(". ")[0]}.</strong>
                          {p.includes(". ") ? ` ${p.split(". ").slice(1).join(". ")}` : ""}
                        </>
                      ) : (
                        p
                      )}
                    </p>
                  ))}
                  <ArticleVisuals section={section} />
                  {section.checklist && (
                    <ul>
                      {section.checklist.map((item) => (
                        <li key={item}>[ OK ] {item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <div className="mmn-source">
                <span className="mmn-kicker">PRIMARY SOURCE</span>
                <p>
                  <a href={post.source.url} target="_blank" rel="noreferrer">
                    {post.source.label} ↗
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </article>
      <footer className="mmn-footer">
        <a href="/newsletter">← ALL ISSUES</a>
        <span>MUHAMMAD MUSA NEWSLETTER</span>
      </footer>
    </div>
  );
}
