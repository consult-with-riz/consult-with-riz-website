// Hidden page: reachable by URL only, kept out of search and unlinked.
export const metadata = {
  title: "Services · Rizwan Mahmood",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
