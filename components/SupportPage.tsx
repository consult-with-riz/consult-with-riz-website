"use client";
import AnimateIn from "@/components/AnimateIn";
import { SUPPORT_CURRENCY, SUPPORT_OPTIONS, SUPPORT_FREE } from "@/lib/support";

/**
 * aiwithriz.com/support: a friendly tip jar for YouTube viewers. Each
 * amount is its own Stripe Payment Link (lib/support.ts), so a tap goes
 * straight to Apple Pay / Google Pay. Casual on purpose: a tip, not an invoice.
 */

function Cup() {
  return (
    <svg viewBox="0 0 160 170" className="sp-cup" aria-hidden="true">
      {/* steam */}
      <path className="sp-steam s1" d="M62 52 C 52 40, 72 32, 62 18" />
      <path className="sp-steam s2" d="M82 52 C 72 38, 94 30, 82 12" />
      <path className="sp-steam s3" d="M102 52 C 92 40, 112 32, 102 18" />
      {/* saucer */}
      <ellipse cx="80" cy="154" rx="66" ry="10" className="sp-saucer" />
      {/* cup */}
      <path d="M30 66 h100 v40 a50 46 0 0 1 -100 0 z" className="sp-body" />
      <path d="M130 78 h8 a16 16 0 0 1 0 32 h-12" className="sp-handle" />
      <ellipse cx="80" cy="66" rx="50" ry="9" className="sp-rim" />
      <ellipse cx="80" cy="67" rx="43" ry="6" className="sp-coffee" />
      {/* a small heart on the cup */}
      <path d="M80 112 c-9-7-14-11-14-17 a7 7 0 0 1 14-2 a7 7 0 0 1 14 2 c0 6-5 10-14 17z" className="sp-heart" />
    </svg>
  );
}

export default function SupportPage() {
  return (
    <section className="sp">
      <style>{`
        .sp { background: var(--cream); padding: 120px 0 96px; }
        .sp-wrap { max-width: 880px; margin: 0 auto; padding: 0 24px; }
        .sp-head { text-align: center; }
        .sp-cup { width: 150px; margin: 0 auto; display: block; overflow: visible; }
        .sp-body { fill: var(--ink); }
        .sp-handle { fill: none; stroke: var(--ink); stroke-width: 9; stroke-linecap: round; }
        .sp-rim { fill: #2f463c; }
        .sp-coffee { fill: #8a5a3b; }
        .sp-saucer { fill: rgba(34,51,44,0.14); }
        .sp-heart { fill: var(--coral); transform-origin: 80px 102px; animation: sp-beat 2.4s ease-in-out infinite; }
        @keyframes sp-beat { 0%, 100% { transform: scale(1); } 12% { transform: scale(1.18); } 24% { transform: scale(1); } }
        .sp-steam { fill: none; stroke: rgba(34,51,44,0.35); stroke-width: 4; stroke-linecap: round; opacity: 0; animation: sp-steam 3s ease-in-out infinite; }
        .sp-steam.s2 { animation-delay: 0.9s; } .sp-steam.s3 { animation-delay: 1.8s; }
        @keyframes sp-steam { 0% { opacity: 0; transform: translateY(8px); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(-12px); } }
        .sp-eyebrow { display: inline-block; margin-top: 18px; font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--coral); }
        .sp-h1 { margin: 10px 0 0; font-size: clamp(2.4rem, 1.6rem + 3vw, 3.8rem); font-weight: 500; line-height: 1.04; letter-spacing: -0.02em; color: var(--ink); }
        .sp-h1 em { font-style: normal; color: var(--coral); }
        .sp-lede { margin: 16px auto 0; max-width: 46ch; font-size: 1.15rem; line-height: 1.6; color: var(--body); }

        .sp-amounts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 40px; }
        .sp-amt {
          position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
          min-height: 150px; padding: 20px 12px; border-radius: 20px; text-decoration: none; text-align: center;
          background: #fff; border: 1.5px solid var(--line); color: var(--ink);
          transition: transform 0.25s cubic-bezier(.3,1.4,.5,1), border-color 0.2s ease, box-shadow 0.25s ease;
        }
        .sp-amt:hover { transform: translateY(-5px); border-color: var(--coral); box-shadow: 0 18px 36px -18px rgba(255,92,53,0.5); }
        .sp-amt:focus-visible { outline: 2px solid var(--coral); outline-offset: 3px; }
        .sp-amt.is-featured { border-color: var(--coral); background: #FFF6F2; }
        .sp-amt.is-featured::before { content: "Most picked"; position: absolute; top: -11px; left: 50%; transform: translateX(-50%); padding: 3px 10px; border-radius: 999px; background: var(--coral); color: #fff; font-size: 11px; font-weight: 600; white-space: nowrap; }
        .sp-amt.is-off { opacity: 0.55; pointer-events: none; }
        .sp-cups { font-size: 1.5rem; letter-spacing: 2px; line-height: 1; }
        .sp-price { font-size: 2rem; font-weight: 600; letter-spacing: -0.02em; line-height: 1; }
        .sp-price.is-custom { font-size: 1.3rem; }
        .sp-label { font-size: 0.9rem; color: var(--body); }
        .sp-soon { font-family: var(--font-geist-mono), monospace; font-size: 10.5px; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; }
        .sp-secure { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 18px; font-size: 0.9rem; color: var(--muted); }
        .sp-secure svg { flex-shrink: 0; }

        .sp-free { margin-top: 64px; padding-top: 36px; border-top: 1px solid var(--line); }
        .sp-free h2 { margin: 0; text-align: center; font-size: 1.4rem; font-weight: 500; color: var(--ink); }
        .sp-free-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
        .sp-free-item { display: block; padding: 18px 20px; border-radius: 16px; background: rgba(255,255,255,0.6); border: 1px solid var(--line); text-decoration: none; color: inherit; transition: background 0.2s ease, border-color 0.2s ease; }
        a.sp-free-item:hover { background: #fff; border-color: var(--ink); }
        .sp-free-item b { display: block; font-weight: 600; color: var(--ink); }
        .sp-free-item span { display: block; margin-top: 4px; font-size: 0.9rem; line-height: 1.45; color: var(--body); }
        @media (max-width: 760px) {
          .sp { padding: 100px 0 64px; }
          .sp-amounts { grid-template-columns: 1fr 1fr; }
          .sp-amt { min-height: 128px; }
          .sp-free-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) { .sp-heart, .sp-steam { animation: none; } .sp-steam { opacity: 0.6; } .sp-amt { transition: none; } }
      `}</style>

      <div className="sp-wrap">
        <div className="sp-head">
          <AnimateIn><Cup /></AnimateIn>
          <AnimateIn delay={80}>
            <span className="sp-eyebrow">Support the channel</span>
            <h1 className="sp-h1">Buy me a <em>coffee.</em></h1>
            <p className="sp-lede">If a video helped you, a coffee keeps the next one coming. Pick an amount. It takes ten seconds.</p>
          </AnimateIn>
        </div>

        <AnimateIn delay={160}>
          <div className="sp-amounts">
            {SUPPORT_OPTIONS.map((o) => {
              const off = !o.link;
              return (
                <a
                  key={o.id}
                  href={off ? undefined : o.link}
                  className={`sp-amt${o.id === "two" ? " is-featured" : ""}${off ? " is-off" : ""}`}
                  aria-disabled={off || undefined}
                >
                  <span className="sp-cups" aria-hidden="true">{o.cups ? "☕".repeat(o.cups) : "💛"}</span>
                  <span className={`sp-price${o.amount === null ? " is-custom" : ""}`}>
                    {o.amount === null ? "Pick yours" : `${SUPPORT_CURRENCY}${o.amount}`}
                  </span>
                  <span className="sp-label">{o.label}</span>
                  {off && <span className="sp-soon">Link not set yet</span>}
                </a>
              );
            })}
          </div>
          <p className="sp-secure">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
            Secure checkout by Stripe · Apple Pay, Google Pay and cards
          </p>
        </AnimateIn>

        <AnimateIn delay={220}>
          <div className="sp-free">
            <h2>Rather not pay? These help too.</h2>
            <div className="sp-free-grid">
              {SUPPORT_FREE.map((f) =>
                f.href ? (
                  <a key={f.label} href={f.href} target="_blank" rel="noopener noreferrer" className="sp-free-item">
                    <b>{f.label} →</b><span>{f.note}</span>
                  </a>
                ) : (
                  <div key={f.label} className="sp-free-item"><b>{f.label}</b><span>{f.note}</span></div>
                ),
              )}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
