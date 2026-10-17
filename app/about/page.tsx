import AnimateIn from "@/components/AnimateIn";
import { ABOUT_INTRO } from "@/components/about/aboutContent";
import {
  AboutCtas,
  AboutPath,
  AboutPrinciples,
  AboutStyles,
  AboutTestimonials,
  AboutTrackRecord,
} from "@/components/about/AboutSections";

export const metadata = {
  title: "About · Rizwan Mahmood",
  description:
    "Fractional COO and Chief of Staff. Ten years next to founders at S&P Global, Careem, Bolt and Wise.",
};

/**
 * About has one job the other pages can't do: would a founder trust this
 * person inside their company? So it carries the story and the judgment,
 * and leaves the numbers to the homepage and case studies.
 */
export default function About() {
  return (
    <>
      <AboutStyles />
      <style>{`
        .about-hero { background: var(--cream); padding: 120px 0 64px; }
        .about-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 56px; align-items: center; }
        .about-title {
          font-size: clamp(2.3rem, 1.4rem + 2.6vw, 3.6rem);
          line-height: 1.06; letter-spacing: -0.02em; font-weight: 500; color: var(--ink); margin: 0;
        }
        .about-photo {
          border-radius: 20px; overflow: hidden; aspect-ratio: 4 / 5;
          box-shadow: 0 28px 72px -16px rgba(14,14,13,0.32);
        }
        .about-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr; gap: 36px; }
          .about-photo { max-width: 420px; }
        }
        @media (max-width: 767px) {
          .about-hero { padding: 96px 0 40px; }
        }
      `}</style>

      <section className="about-hero">
        <div className="max-w-site about-grid">
          <div className="ab-intro">
            <AnimateIn>
              <h1 className="about-title">
                Most of my career, I&apos;ve been the person{" "}
                <span className="ab-accent">next to the founder.</span>
              </h1>
              <p className="ab-role">{ABOUT_INTRO.role}</p>
            </AnimateIn>
            <AnimateIn delay={120}>
              {ABOUT_INTRO.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <AboutCtas />
              <AboutTrackRecord />
            </AnimateIn>
          </div>
          <AnimateIn delay={160}>
            <div className="about-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/riz-photo-new.jpg" alt="Rizwan Mahmood" />
            </div>
          </AnimateIn>
        </div>
      </section>

      <AboutPath />
      <AboutPrinciples />
      <AboutTestimonials />
    </>
  );
}
