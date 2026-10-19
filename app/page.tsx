"use client";
import AnimateIn from "@/components/AnimateIn";
import HeroSection from "@/components/hero-section";
import WhatIDo from "@/components/blocks/WhatIDo";
import ByTheNumbers from "@/components/blocks/ByTheNumbers";
import WorkTogether from "@/components/blocks/WorkTogether";
import TestimonialsSection from "@/components/Testimonials";

export default function Home() {
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
