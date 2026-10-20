import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Every page, for search engines and AI crawlers. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/case-studies", "/cv"].map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
