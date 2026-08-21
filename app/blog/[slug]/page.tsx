import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../SiteFooter";
import { SiteHeader } from "../../SiteHeader";
import { SmoothMotion } from "../../SmoothMotion";
import { BlogVisual } from "../BlogVisual";
import { blogPosts, getBlogPost } from "../blogData";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Muhammad Musa`,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const currentIndex = blogPosts.findIndex((entry) => entry.slug === post.slug);
  const nextPost = blogPosts[(currentIndex + 1) % blogPosts.length];

  return (
    <>
      <SmoothMotion />
      <SiteHeader />
      <main className="blog-article-page">
        <article>
          <header className="blog-article-hero">
            <div className="blog-article-heading">
              <a href="/blog" className="blog-back-link">← ALL FIELD NOTES</a>
              <div className="blog-article-meta">
                <span>{post.number} / {post.category}</span>
                <span>{post.date} / {post.readTime}</span>
              </div>
              <h1>{post.title}</h1>
              <p>{post.intro}</p>
              <div className="blog-article-byline">
                <span className="blog-author-mark" aria-hidden="true">✦</span>
                <strong>Written by Muhammad Musa</strong>
              </div>
            </div>
            <BlogVisual visual={post.visual} label={post.title} />
          </header>

          <div className="blog-article-body">
            <aside>
              <span>ARTICLE INDEX</span>
              {post.sections.map((section, index) => (
                <a href={`#section-${index + 1}`} key={section.heading}>
                  {String(index + 1).padStart(2, "0")} / {section.heading}
                </a>
              ))}
            </aside>

            <div className="blog-prose">
              {post.sections.map((section, index) => (
                <section id={`section-${index + 1}`} key={section.heading}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.points && (
                    <ul>
                      {section.points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>

          <a className="blog-next-post" href={`/blog/${nextPost.slug}`}>
            <span>NEXT FIELD NOTE / {nextPost.number}</span>
            <strong>{nextPost.title}</strong>
            <b aria-hidden="true">↗</b>
          </a>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
