import type { Metadata } from "next";
import { Wix_Madefor_Text } from "next/font/google";
import "./globals.css";
import { jsonLd, SITE_URL as SEO_SITE_URL } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AudioProvider } from "@/contexts/audio-context";
import { AudioPlayer } from "@/components/AudioPlayer";

// One family carries display and body. 400/500 do the work, 600/700 cover
// the semibold and bold cases.
//
// Upright only — the italic cut is deliberately not loaded, because nothing
// on the site is italic any more. globals.css also sets
// font-synthesis-style: none, so a stray font-style: italic renders upright
// rather than being sheared into a faux-oblique.
//
// The variable names the rest of the CSS references are remapped onto this
// one font in globals.css, so pointing them all here is the whole swap. Mono
// is the system stack rather than a second webfont: the only mono on the site
// is 12px instrumentation labels.
const wixMadeforText = Wix_Madefor_Text({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  variable: "--font-wix-madefor-text",
  display: "swap",
});

/** Who the site is, for search engines and AI answer engines. */
const SITE_ENTITY = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rizwan Mahmood",
  url: SEO_SITE_URL,
  jobTitle: "Fractional COO and Chief of Staff",
  description: "Rizwan Mahmood is a fractional COO and Chief of Staff for founder-led startups. Ten years in operations at Careem, Bolt and Wise. Every process he installs gets automated before he hands it over. Based in Tallinn.",
  sameAs: ["https://www.linkedin.com/in/consult-with-riz/", "https://www.instagram.com/etz.riz/"],
};

export const metadata: Metadata = {
  metadataBase: new URL(SEO_SITE_URL),
  title: "Rizwan Mahmood · Fractional COO & Chief of Staff",
  description:
    "Fractional COO and Chief of Staff for founder-led startups. I run the operations so you can run the company, and I automate what shouldn't need a person.",
  icons: {
    icon: "/favicon/v1-coral-circle-serif-icon-black-R.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${wixMadeforText.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(SITE_ENTITY) }}
        />
        <AudioProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AudioPlayer />
        </AudioProvider>
      </body>
    </html>
  );
}
