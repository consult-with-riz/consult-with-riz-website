"use client";
import PromiseHero from "@/components/PromiseHero";
import WhatIDo from "@/components/blocks/WhatIDo";
import ByTheNumbers from "@/components/blocks/ByTheNumbers";
import WorkTogether from "@/components/blocks/WorkTogether";
import HireComparison from "@/components/HireComparison";
import TestimonialsSection from "@/components/Testimonials";
import ServicesFAQ from "@/components/ServicesFAQ";
import ActionCTA from "@/components/ActionCTA";

/**
 * The next homepage. Without "Hi, I'm Riz": the promise (with Riz's photo)
 * leads straight into the operating system. Bands alternate cream / white
 * from the top, the FAQ opens from its heading, and the closing card takes
 * its own white band so the cream footer still alternates.
 *
 * `osVariant` picks the operating-system treatment (1-5) while we choose.
 */
export default function HomeNext({ osVariant }: { osVariant?: number }) {
  return (
    <div className="hn">
      <style>{`
        .hn .sa-hero { background: var(--cream); }
        .hn .whatido { background: #fff; }
        .hn .pb-section { background: var(--cream); }
        .hn .path-section { background: #fff !important; }
        .hn .hc { background: var(--cream); }
        .hn .hc .hc-race { background: #fff; }
        .hn .hc .hc-card.them { background: rgba(255,255,255,0.6); }
        .hn .testimonials-section { background: #fff !important; }
        .hn .sa-faq-section { background: var(--cream); }
        .hn .ac-wrap { background: #fff; }

        /* one even rhythm: 64px above and below each section, 44px on phones */
        .hn .sa-hero { padding-bottom: 64px; }
        .hn .section-pad.whatido,
        .hn .section-pad.pb-section,
        .hn .section-pad.path-section,
        .hn .hc,
        .hn .testimonials-section,
        .hn .sa-faq-section,
        .hn .ac-wrap { padding-top: 64px; padding-bottom: 64px; }
        @media (max-width: 767px) {
          .hn .sa-hero { padding-bottom: 44px; }
          .hn .section-pad.whatido,
          .hn .section-pad.pb-section,
          .hn .section-pad.path-section,
          .hn .hc,
          .hn .testimonials-section,
          .hn .sa-faq-section,
          .hn .ac-wrap { padding-top: 44px; padding-bottom: 44px; }
        }
      `}</style>
      <PromiseHero anchor="#how-people-work-with-me" photo />
      <WhatIDo variant={osVariant} />
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
      <ServicesFAQ collapsible />
      <ActionCTA />
    </div>
  );
}
