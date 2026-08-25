import type { MetadataRoute } from "next";
import { blogPosts } from "./blog/blogData";
import { services } from "./serviceData";
import { newsletterPosts } from "../lib/newsletter-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];

  const now = new Date();
  const staticRoutes = ["", "/blog", "/newsletter", "/guestbook", "/privacy"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));
  const blogRoutes = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));
  const serviceRoutes = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const newsletterRoutes = newsletterPosts.map((post) => ({
    url: `${siteUrl}/newsletter/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  return [...staticRoutes, ...blogRoutes, ...newsletterRoutes, ...serviceRoutes];
}
