/**
 * Fills the right of "Hi, I'm Riz" when his photo has moved up to the top
 * of the page: the ten years as a panel — the headline number, the six
 * companies as a logo grid, and the reach. Same facts as the trust row it
 * replaces, given room.
 */
const LOGOS = [
  { src: "/logos/spglobal.svg", alt: "S&P Global", h: 23 },
  { src: "/logos/careem.png", alt: "Careem", h: 26 },
  { src: "/logos/motive.svg", alt: "Motive", h: 23 },
  { src: "/logos/bolt.png", alt: "Bolt", h: 34 },
  { src: "/logos/wise.svg", alt: "Wise", h: 26 },
  { src: "/logos/shapingwealth.png", alt: "Shaping Wealth", h: 42 },
];

export default function TrackRecordPanel() {
  return (
    <div className="trp">
      <style>{`
        .trp { min-width: 0; background: var(--cream); border: 1px solid var(--line); border-radius: 24px; padding: 40px 38px 34px; }
        .trp-eyebrow {
          font-family: var(--font-geist-mono), monospace; font-size: 12px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
        }
        .trp-big { display: flex; align-items: center; gap: 18px; margin-top: 14px; }
        .trp-num { font-size: 5rem; font-weight: 600; line-height: 1; letter-spacing: -0.04em; color: var(--coral); }
        /* two lines, centred on the number; "high-growth" never splits */
        .trp-label { font-size: 1.25rem; line-height: 1.3; font-weight: 500; color: var(--ink); white-space: nowrap; }
        .trp-grid {
          margin-top: 30px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
          background: var(--line); border: 1px solid var(--line); border-radius: 14px; overflow: hidden;
        }
        .trp-cell { background: #fff; height: 96px; display: flex; align-items: center; justify-content: center; padding: 0 12px; }
        .trp-cell img { display: block; width: auto; max-width: 100%; }
        .trp-foot {
          margin-top: 24px; display: flex; justify-content: space-between; gap: 8px 16px; flex-wrap: wrap;
          font-size: 1rem; color: var(--body);
        }
        .trp-foot b { color: var(--ink); font-weight: 600; }
        @media (max-width: 960px) { .trp { max-width: 520px; } }
        @media (max-width: 420px) { .trp { padding: 28px 20px 24px; } .trp-big { gap: 12px; } .trp-num { font-size: 3.2rem; } .trp-label { font-size: 1rem; white-space: normal; min-width: 0; } .trp-cell { height: 70px; } .trp-foot { font-size: 0.92rem; } }
      `}</style>
      <span className="trp-eyebrow">The track record</span>
      <div className="trp-big">
        <span className="trp-num">10+</span>
        <span className="trp-label">years inside<br />high-growth operations</span>
      </div>
      <div className="trp-grid">
        {LOGOS.map((l) => (
          <div key={l.alt} className="trp-cell">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.src} alt={l.alt} style={{ height: l.h }} />
          </div>
        ))}
      </div>
      <div className="trp-foot">
        <span><b>70+</b> markets</span>
        <span><b>$3.9M</b> saved at Bolt</span>
        <span><b>7+</b> clients since 2025</span>
      </div>
    </div>
  );
}
