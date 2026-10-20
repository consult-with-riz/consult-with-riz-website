// Unlinked review page: reachable by URL only, kept out of search.
export const metadata = {
  title: "Next 7 · Rizwan Mahmood",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
