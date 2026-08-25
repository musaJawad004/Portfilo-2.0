import { newsletterPosts } from "../../lib/newsletter-data";
import { NewsletterHeaderClient } from "./NewsletterHeaderClient";

export function NewsletterHeader() {
  return <NewsletterHeaderClient
    searchItems={newsletterPosts.map(({ slug, title, topic }) => ({ slug, title, topic }))}
  />;
}
