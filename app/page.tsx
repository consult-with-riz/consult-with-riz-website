"use client";
import HomeNext from "@/components/HomeNext";

/**
 * The homepage: the 90-day promise with Riz's photo, the operating system
 * (colour-coded), the numbers, the three ways in, fractional vs a full-time
 * COO, testimonials, the FAQ (opens from its heading) and a closing nudge to
 * book the fit call. Earlier versions live at /home-v2, /home-v3 and
 * /home-v4, and other operating-system designs at /next-*, all unlinked,
 * for review.
 */
export default function Home() {
  return <HomeNext osVariant={3} />;
}
