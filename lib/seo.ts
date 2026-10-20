// lib/seo.ts
//
// Structured data and machine-readable site files, so search engines and AI
// answer engines (ChatGPT, Perplexity, Google AI Overviews) can tell what the
// site is, what each post is, and lift its FAQ answers.

// NEXT_PUBLIC_SITE_URL overrides it, e.g. for a preview deployment.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.consultwithriz.com";

/** Absolute URL for a site path, or the input untouched if already absolute. */
export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * JSON-LD as a string safe to drop into a <script>. `<` is escaped so a post
 * title or answer containing "</script>" cannot break out of the tag — the
 * sanitisation the Next.js JSON-LD guide recommends.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Markdown inline syntax stripped, for plain-text answers. */
function plainText(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The questions and answers of a post's FAQ section: the `## FAQ` or
 * `## Frequently Asked Questions…` heading, then `### question` followed by
 * its answer paragraphs, up to the next `##` heading. Empty when a post has
 * no FAQ, so no FAQPage markup is emitted for it.
 */
export function faqFromMarkdown(body: string): { question: string; answer: string }[] {
  const lines = body.replace(/\r/g, "").split("\n");
  const start = lines.findIndex((l) => /^##\s+(faq\b|frequently asked questions)/i.test(l.trim()));
  if (start < 0) return [];

  const items: { question: string; answer: string }[] = [];
  let current: { question: string; answer: string[] } | null = null;

  for (const raw of lines.slice(start + 1)) {
    const line = raw.trim();
    if (/^##\s/.test(line) || line.startsWith("<!--")) break;
    const q = line.match(/^###\s+(.+)$/);
    if (q) {
      if (current) items.push({ question: current.question, answer: plainText(current.answer.join(" ")) });
      current = { question: plainText(q[1]), answer: [] };
    } else if (current && line) {
      current.answer.push(line);
    }
  }
  if (current) items.push({ question: current.question, answer: plainText(current.answer.join(" ")) });

  return items.filter((i) => i.question && i.answer);
}
