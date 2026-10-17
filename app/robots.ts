import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Open to every crawler, AI search crawlers included (OAI-SearchBot,
 * PerplexityBot, Claude-SearchBot…): a site they cannot read is a site they
 * never cite. Points them at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
