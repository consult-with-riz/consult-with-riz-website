"use client";
import { useEffect } from "react";
import Link from "next/link";
import { burstConfetti } from "@/lib/confetti";

/** Where Stripe sends people after paying: a thank-you, with confetti. */
export default function SupportThanks() {
  useEffect(() => {
    const t = setTimeout(() => burstConfetti(window.innerWidth / 2, window.innerHeight * 0.38, 90), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <section style={{ background: "var(--cream)", minHeight: "78vh", display: "flex", alignItems: "center", padding: "120px 24px 80px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "3.2rem", lineHeight: 1 }} aria-hidden="true">☕</div>
        <h1 style={{ margin: "18px 0 0", fontSize: "clamp(2.2rem, 1.6rem + 2.4vw, 3.2rem)", fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink)" }}>
          Thank you. <span style={{ color: "var(--coral)" }}>Seriously.</span>
        </h1>
        <p style={{ margin: "14px 0 0", fontSize: "1.12rem", lineHeight: 1.6, color: "var(--body)" }}>
          That coffee goes straight into the next video. Your receipt is on its way to your inbox.
        </p>
        <Link href="/" className="btn-ghost" style={{ marginTop: 28, display: "inline-flex" }}>Back to consultwithriz.com</Link>
      </div>
    </section>
  );
}
