import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { SmoothMotion } from "../SmoothMotion";
import { BlogVisual } from "./BlogVisual";
import { blogPosts } from "./blogData";

export const metadata: Metadata = {
  title: "Blog",
  description: "Field notes by Muhammad Musa on AI agents, RAG, Claude, fine-tuning, local LLMs, and building production software.",
};

export default function BlogPage() {
  return (
    <>
      <SmoothMotion />
      <SiteHeader />
      <main className="blog-page">
        <header className="blog-index-header">
          <div>
            <p>009 / FIELD NOTES</p>
            <span>{String(blogPosts.length).padStart(2, "0")} PUBLISHED ESSAYS</span>
          </div>
          <h1>Blog.</h1>
          <p>
            Notes on building AI products, model systems, and software that survives contact with real users.
          </p>
        </header>

        <section className="blog-masonry" aria-label="Published articles">
          {blogPosts.map((post, index) => (
            <article
              className={`blog-card blog-card-${post.size}`}
              key={post.slug}
              style={{ "--blog-delay": `${index * 70}ms` } as CSSProperties}
            >
              <a href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                <BlogVisual visual={post.visual} label={post.title} />
                <div className="blog-card-copy">
                  <div className="blog-card-index">
                    <span>{post.number} / {post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <footer>
                    <span className="blog-author-mark" aria-hidden="true">✦</span>
                    <strong>Muhammad Musa</strong>
                    <time>{post.date}</time>
                  </footer>
                </div>
              </a>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
