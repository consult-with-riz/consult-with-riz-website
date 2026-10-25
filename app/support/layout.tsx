// Link-only page for YouTube viewers: not in any menu, footer or the sitemap,
// and kept out of search.
export const metadata = {
  title: "Support the channel · Riz",
  description: "If a video helped you, a coffee keeps the next one coming.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
