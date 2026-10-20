"use client";
import PromiseHero from "@/components/PromiseHero";
import HeroSection from "@/components/hero-section";
import WhatIDo from "@/components/blocks/WhatIDo";
import ByTheNumbers from "@/components/blocks/ByTheNumbers";
import WorkTogether from "@/components/blocks/WorkTogether";
import HireComparison from "@/components/HireComparison";
import TestimonialsSection from "@/components/Testimonials";
import ServicesFAQ from "@/components/ServicesFAQ";
import ActionCTA from "@/components/ActionCTA";

/**
 * Home V3 (unlinked, for review): the first merged version — the old
 * homepage and the services page merged. Opens on the 90-day
 * promise, then today's homepage, then fractional vs full-time, the
 * testimonials, the FAQ and a closing nudge to book the fit call.
 */
export default function HomeV3() {
  return (
    <div className="hv2">
      {/* Backgrounds alternate cream / white down the page, starting cream.
          Scoped to this page so the live sections keep their own colours.
          The closing card shares the FAQ's white band, so the cream footer
          still alternates. */}
      <style>{`
        .hv2 .sa-hero { background: var(--cream); }
        .hv2 .hz-section { background: #fff; }
        .hv2 .whatido { background: var(--cream); }
        .hv2 .whatido .soft-card { background: #fff; }
        .hv2 .pb-section { background: #fff; }
        .hv2 .path-section { background: var(--cream) !important; }
        .hv2 .hc { background: #fff; }
        .hv2 .testimonials-section { background: var(--cream) !important; }
        .hv2 .sa-faq-section { background: #fff; }
        .hv2 .ac-wrap { background: #fff; }

        /* One even rhythm between sections: 64px above and below each on
           desktop, 44px on phones. The colour change does the separating,
           so the old 96-112px paddings read as dead space. "Hi, I'm Riz"
           drops the top room it keeps for the nav when it opens a page. */
        .hv2 .sa-hero { padding-bottom: 64px; }
        .hv2 .hz-section .hz-hero,
        .hv2 .section-pad.whatido,
        .hv2 .section-pad.pb-section,
        .hv2 .section-pad.path-section,
        .hv2 .hc,
        .hv2 .testimonials-section,
        .hv2 .sa-faq-section { padding-top: 64px; padding-bottom: 64px; }
        .hv2 .ac-wrap { padding-bottom: 64px; }
        @media (max-width: 767px) {
          .hv2 .sa-hero { padding-bottom: 44px; }
          .hv2 .hz-section .hz-hero,
          .hv2 .section-pad.whatido,
          .hv2 .section-pad.pb-section,
          .hv2 .section-pad.path-section,
          .hv2 .hc,
          .hv2 .testimonials-section,
          .hv2 .sa-faq-section { padding-top: 44px; padding-bottom: 44px; }
          .hv2 .ac-wrap { padding-bottom: 44px; }
        }
      `}</style>
      <PromiseHero anchor="#how-people-work-with-me" />
      <HeroSection />
      <WhatIDo />
      <ByTheNumbers />
      <WorkTogether expandable />
      <HireComparison />
      <TestimonialsSection
        heading={
          <>
            Founders I&apos;ve <span style={{ color: "var(--coral)" }}>worked with.</span>
          </>
        }
      />
      <ServicesFAQ />
      <ActionCTA />
    </div>
  );
}
