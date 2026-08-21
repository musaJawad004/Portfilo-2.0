import { BlogVisual } from "./blog/BlogVisual";
import { blogPosts } from "./blog/blogData";

export function LatestBlogSection() {
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section className="home-blog-section" aria-labelledby="home-blog-title">
      <header className="home-blog-heading">
        <div>
          <p>008 / FIELD NOTES</p>
          <h2 id="home-blog-title">Latest From the Blog.</h2>
        </div>
        <div>
          <p>Practical notes on production AI, model systems, and the engineering decisions behind reliable products.</p>
          <a href="/blog">[ VIEW ALL BLOGS ] <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <div className="home-blog-grid">
        {latestPosts.map((post) => (
          <article className="home-blog-card" key={post.slug}>
            <a href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
              <BlogVisual visual={post.visual} label={post.title} />
              <div className="home-blog-card-copy">
                <div>
                  <span>{post.number} / {post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <footer>
                  <strong>MUHAMMAD MUSA</strong>
                  <time>{post.date}</time>
                  <b aria-hidden="true">↗</b>
                </footer>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
