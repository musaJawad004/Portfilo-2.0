import { notFound } from "next/navigation";
import { NewsletterHeader } from "../../NewsletterHeader";
import { getCommunityPost } from "../../../../lib/newsletter-community";

export default async function CommunityIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getCommunityPost(slug);
  if (!post) notFound();
  return <div className="mmn-shell"><NewsletterHeader/><article className="mmn-community-article"><header><span className="mmn-kicker">COMMUNITY FIELD NOTE / {post.topic}</span><h1>{post.title}</h1><p>{post.excerpt}</p><span className="mmn-kicker">{post.authorName} / {new Date(post.createdAt).toLocaleDateString()}</span></header><div>{post.body.split(/\n\n+/).map((paragraph, index)=><p key={index}>{paragraph}</p>)}</div></article><footer className="mmn-footer"><a href="/newsletter">← NEWSLETTER</a><span>COMMUNITY DESK</span></footer></div>;
}
