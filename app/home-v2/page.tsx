"use client";
import HeroSection from "@/components/hero-section";
import WhatIDo from "@/components/blocks/WhatIDo";
import ByTheNumbers from "@/components/blocks/ByTheNumbers";
import WorkTogether from "@/components/blocks/WorkTogether";
import TestimonialsSection from "@/components/Testimonials";

/**
 * Home V2 (unlinked, for review): the homepage as it was before the
 * merged version replaced it.
 */
export default function HomeV2() {
  return (
    <>
      <HeroSection />

      <WhatIDo />

      <ByTheNumbers />

      <WorkTogether />

      {/* IN THEIR WORDS */}
      <TestimonialsSection
        heading={
          <>
            Founders I&apos;ve <span style={{ color: "var(--coral)" }}>worked with.</span>
          </>
        }
      />
    </>
  );
}
