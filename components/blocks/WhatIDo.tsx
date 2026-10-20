"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playServiceTone } from "@/lib/sounds";
import { WID_VARIANT_CSS, WID_SHORT, WID_ROLE } from "@/components/blocks/whatidoVariants";

/**
 * The service grid.
 *
 * Cards alternate width down the page (wide/narrow, then narrow/wide) so the
 * grid has a rhythm rather than reading as a spreadsheet — the descriptions
 * are genuinely different lengths, and forcing them into equal columns either
 * strands whitespace or clips text.
 *
 */
type Slot = "tl" | "tr" | "ml" | "mr" | "bl" | "br";

const SERVICES: { title: string; body: string; icon: React.ReactNode; slot: Slot }[] = [
  {
    title: "Operating cadence",
    body: "Weekly business review. Leadership meeting that ends in decisions. Clear owners. The rhythm that stops everything routing through the founder.",
    slot: "tl",
    icon: (
      <>
        <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
        <path d="M7 9h7M7 12.5h10M7 16h5" opacity="0.45" />
        <path className="ic-scan" d="M2.5 7.5h19" strokeWidth="1.8" />
      </>
    ),
  },
  {
    title: "Metrics that mean something",
    body: "A handful of numbers the whole team can read. Reported the same way every week, without someone building it by hand.",
    slot: "tr",
    icon: (
      <>
        <path d="M3.5 18a9 9 0 0 1 17 0" />
        <path d="M3.5 18h2M18.5 18h2M6 11l1.4 1.4M18 11l-1.4 1.4M12 8v2" opacity="0.45" />
        <g className="ic-needle" style={{ transformOrigin: "12px 18px" }}>
          <path d="M12 18 8.5 13.5" strokeWidth="1.8" />
        </g>
        <circle cx="12" cy="18" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    title: "Process and handoffs",
    body: "Where work waits between people, I fix the handoff. Onboarding, approvals, month-end, hiring. Written down, owned, and running.",
    slot: "ml",
    icon: (
      <>
        <rect x="2.5" y="8.5" width="6" height="7" rx="1.8" />
        <rect x="15.5" y="8.5" width="6" height="7" rx="1.8" />
        <path d="M8.5 12h7" opacity="0.45" />
        <circle className="ic-travel" cx="9.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    title: "The founder's desk",
    body: "Chief of Staff work. Priorities, follow-through, board and investor updates, the projects nobody else owns. You stop being the bottleneck.",
    slot: "mr",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="12" rx="3" />
        <path d="M9 17v2.5l3.2-2.5" />
        <circle className="ic-type ic-type-1" cx="9" cy="11" r="1.1" fill="currentColor" stroke="none" />
        <circle className="ic-type ic-type-2" cx="12" cy="11" r="1.1" fill="currentColor" stroke="none" />
        <circle className="ic-type ic-type-3" cx="15" cy="11" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    title: "Cost and unit economics",
    body: "Where the money leaks. At Bolt that was courier cost: 21% of GMV down to 14%.",
    slot: "bl",
    icon: (
      <>
        <path d="M4 4.5v15M12 4.5v15M20 4.5v15" opacity="0.45" />
        <rect className="ic-deal" x="5.5" y="8" width="5" height="4" rx="1.2" fill="currentColor" stroke="none" />
        <rect x="13.5" y="13.5" width="5" height="4" rx="1.2" opacity="0.45" />
      </>
    ),
  },
  {
    title: "The automation layer",
    body: "Anything repeatable gets automated before I leave. I design it on n8n and Claude. You keep the system, not a dependency on me.",
    slot: "br",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="11" rx="2" />
        <path d="M8 20h8M12 15v5" />
        <circle className="ic-lean ic-lean-1" cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
        <circle className="ic-lean ic-lean-2" cx="15.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
  },
];


/**
 * The spokes are measured, not hand-drawn coordinates.
 *
 * Card positions move with the viewport and with however long the copy runs,
 * so the only way a connector actually lands on its card is to read the real
 * geometry after layout and draw to it. Recomputed on resize and whenever the
 * fonts settle, since a late webfont reflows every card.
 */
type Spoke = {
  key: string;
  d: string;
  /** output port, on the hub rim */
  from: { x: number; y: number };
  /** input port, on the card edge */
  to: { x: number; y: number };
  /** arrowhead polygon, already oriented */
  arrow: string;
};

function useSpokes(
  gridRef: React.RefObject<HTMLDivElement | null>,
  hubRef: React.RefObject<HTMLElement | null>,
  count: number,
) {
  const [spokes, setSpokes] = useState<Spoke[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const grid = gridRef.current;
    const hub = hubRef.current;
    if (!grid || !hub) return;
    const g = grid.getBoundingClientRect();
    const h = hub.getBoundingClientRect();
    if (g.width === 0) return;

    const cx = h.left - g.left + h.width / 2;
    const cy = h.top - g.top + h.height / 2;
    const r = h.width / 2;

    const PORT = 5;   // input/output port radius
    const HEAD = 7;   // arrowhead length

    type Rect = { l: number; r: number; t: number; b: number };
    const rects: Rect[] = [];
    const cards = [...grid.querySelectorAll<HTMLElement>("[data-spoke]")];
    cards.forEach((card) => {
      const c = card.getBoundingClientRect();
      rects.push({ l: c.left - g.left, r: c.right - g.left, t: c.top - g.top, b: c.bottom - g.top });
    });

    /**
     * One connector: leave the hub along an axis, arrive on that same axis at
     * the given border. Flat out, flat in — the whole shape of an n8n wire.
     */
    function wire(c: Rect, nx: number, ny: number, slack: number, shift: number) {
      // Keeps the port off the 18px corner radius, and no further. At 34
      // the top-right card's left-edge target landed 3px ABOVE the bottom
      // edge of the card beside it, so every approach clipped that card's
      // corner; at 20 the target drops into the clear gap below it and the
      // full curve fits. The inset is a corner guard, not a margin.
      const inset = 20;
      // The target slides along the border. `shift` moves it as a fraction
      // of the room available on that edge, which is the last free variable
      // when a corridor is too tight for the straight-on approach.
      const spanX = Math.max(0, c.r - c.l - inset * 2);
      const spanY = Math.max(0, c.b - c.t - inset * 2);
      const bx =
        nx !== 0
          ? nx < 0
            ? c.l
            : c.r
          : Math.min(Math.max(cx + shift * spanX, c.l + inset), c.r - inset);
      const by =
        ny !== 0
          ? ny < 0
            ? c.t
            : c.b
          : Math.min(Math.max(cy + shift * spanY, c.t + inset), c.b - inset);

      // Stack outward from the border so nothing is occluded: edge, port,
      // arrowhead, then the line.
      const portX = bx + nx * PORT;
      const portY = by + ny * PORT;
      const tipX = bx + nx * PORT * 2;
      const tipY = by + ny * PORT * 2;
      const tx = tipX + nx * HEAD;
      const ty = tipY + ny * HEAD;

      const sx = cx - nx * r;
      const sy = cy - ny * r;
      const k = slack * Math.min(96, Math.max(44, Math.hypot(tx - sx, ty - sy) * 0.38));
      const p1 = { x: sx - nx * k, y: sy - ny * k };
      const p2 = { x: tx + nx * k, y: ty + ny * k };

      return {
        d: `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}, ${tx.toFixed(1)} ${ty.toFixed(1)}`,
        from: { x: sx, y: sy },
        to: { x: portX, y: portY },
        arrow: [
          `${tipX.toFixed(1)},${tipY.toFixed(1)}`,
          `${(tx + ny * 4.6).toFixed(1)},${(ty - nx * 4.6).toFixed(1)}`,
          `${(tx - ny * 4.6).toFixed(1)},${(ty + nx * 4.6).toFixed(1)}`,
        ].join(" "),
        curve: { s: { x: sx, y: sy }, p1, p2, e: { x: tx, y: ty } },
        len: Math.hypot(tx - sx, ty - sy),
      };
    }

    type Curve = ReturnType<typeof wire>["curve"];
    function hitsAnother(cu: Curve, own: number) {
      for (let i = 1; i < 32; i++) {
        const t = i / 32;
        const u = 1 - t;
        const x = u * u * u * cu.s.x + 3 * u * u * t * cu.p1.x + 3 * u * t * t * cu.p2.x + t * t * t * cu.e.x;
        const y = u * u * u * cu.s.y + 3 * u * u * t * cu.p1.y + 3 * u * t * t * cu.p2.y + t * t * t * cu.e.y;
        for (let j = 0; j < rects.length; j++) {
          if (j === own) continue;
          const q = rects[j];
          if (x > q.l && x < q.r && y > q.t && y < q.b) return true;
        }
      }
      return false;
    }

    const next: Spoke[] = [];
    rects.forEach((c, i) => {
      // Two borders to aim at — the nearest vertical one and the nearest
      // horizontal one — each tried with a full, then half, then nearly
      // straight control handle.
      //
      // The handle length is what matters. This grid leaves 20px corridors
      // between some cards, and a 96px handle bows the curve outside a
      // corridor that narrow even when the direct line through it is clear.
      // Shortening the handle pulls the curve back onto that line. The first
      // clean option wins, so a connector only straightens as much as it has
      // to and keeps the full n8n curve everywhere there is room.
      const sides: [number, number][] = [
        [cx < c.l ? -1 : 1, 0],
        [0, cy < c.t ? -1 : 1],
      ];
      const slacks = [1, 0.55, 0.3];
      const shifts = [0, 0.28, -0.28];
      const options = sides.flatMap(([nx, ny]) =>
        slacks.flatMap((sl) => shifts.map((sh) => wire(c, nx, ny, sl, sh))),
      );
      const byNearest = [...options].sort((a, b) => a.len - b.len);
      const best = byNearest.find((o) => !hitsAnother(o.curve, i)) ?? byNearest[0];

      next.push({ key: String(i), d: best.d, from: best.from, to: best.to, arrow: best.arrow });
    });

    setBox({ w: g.width, h: g.height });
    setSpokes(next);
  }, [gridRef, hubRef]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, gridRef, count]);

  return { spokes, box };
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="wid-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
           strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}

/**
 * `variant` (1-5) picks one of the treatments in whatidoVariants.ts; without
 * it the section looks as it always has.
 */
export default function WhatIDo({ variant }: { variant?: number } = {}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { spokes, box } = useSpokes(gridRef, hubRef, SERVICES.length);

  const autoplay = variant === 2 || variant === 6;   // spotlight that moves on its own
  const focus = autoplay || variant === 9;            // one card focused at a time
  const n = SERVICES.length;

  // in view: starts the highlighter (5), the spotlights (2, 6) and the pulses (8)
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!variant) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [variant]);

  // spotlight (2, 6): one card at a time while on screen; hover takes over.
  // Click to trace (9): nothing until the visitor picks a card.
  const [active, setActive] = useState<number | null>(autoplay ? 0 : null);
  const [hovering, setHovering] = useState(false);
  const step = variant === 6 ? 2800 : 2600;
  useEffect(() => {
    if (!autoplay || !inView || hovering) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((a) => ((a ?? -1) + 1) % n), step);
    return () => clearInterval(t);
  }, [autoplay, inView, hovering, n, step]);

  // assembles as you scroll (10): how many cards the scroll has reached
  const [lit, setLit] = useState(0);
  useEffect(() => {
    if (variant !== 10) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setLit(n); return; }
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // starts as the section's top passes 75% of the screen, done when its
      // bottom reaches 85%
      const start = innerHeight * 0.75, end = innerHeight * 0.85;
      const p = Math.min(Math.max((start - r.top) / (r.height - (end - start) || 1), 0), 1);
      const next = Math.min(n, Math.floor(p * (n + 0.5)));
      setLit((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [variant, n]);

  const isActive = (i: number) => focus && active === i;
  const sectionClass = [
    "section-pad whatido",
    variant ? `wid-v${variant}` : "",
    inView ? "is-in" : "",
    focus && active !== null ? "has-active" : "",
    variant === 6 && hovering ? "is-paused" : "",
  ].filter(Boolean).join(" ");

  return (
    <section ref={sectionRef} className={sectionClass}>
      {variant ? <style>{WID_VARIANT_CSS[variant] ?? ""}</style> : null}
      <div className="max-w-site">
        <div className="block-head is-center">
          <h2 className="block-title">
            The operating system{" "}
            <span className="text-ramp">a growing company runs on.</span>
          </h2>
          {variant === 7 && (
            <div className="wid-legend" aria-hidden="true">
              <span className="tone-coo"><i />COO: runs the operation</span>
              <span className="tone-cos"><i />Chief of Staff: runs the founder&apos;s week</span>
              <span className="tone-auto"><i />Automation: keeps it running</span>
            </div>
          )}
          {variant === 9 && (
            <p className="wid-hint"><b>Hover or tap</b> any part of the system to trace it back to me.</p>
          )}
        </div>

        <div className="wid-grid" ref={gridRef} onPointerLeave={() => variant === 9 && setActive(null)}>
          <svg
            className="wid-spokes"
            viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
            width={box.w || undefined}
            height={box.h || undefined}
            aria-hidden="true"
          >
            {spokes.map((sp) => {
              const i = Number(sp.key);
              const cls = [
                `spoke-i${i}`,
                isActive(i) ? "is-active" : "",
                variant === 10 && i < lit ? "is-lit" : "",
                variant === 7 ? `tone-${WID_ROLE[i].tone}` : "",
              ].filter(Boolean).join(" ");
              return (
                <g key={sp.key} className={cls}>
                  <path className="spoke-line" d={sp.d} pathLength={variant === 10 ? 1 : undefined} />
                  <polygon className="spoke-head" points={sp.arrow} />
                  <circle className="spoke-port" cx={sp.from.x} cy={sp.from.y} r="5" />
                  <circle className="spoke-port" cx={sp.to.x} cy={sp.to.y} r="5" />
                  {variant === 8 && inView && (
                    <circle className="spoke-pulse" r="5">
                      <animateMotion
                        path={sp.d}
                        dur="4.8s"
                        begin={`${i * 0.35}s`}
                        repeatCount="indefinite"
                        keyPoints="0;1;1"
                        keyTimes="0;0.19;1"
                        calcMode="linear"
                      />
                      {/* gone once it lands, until the next round */}
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0;0"
                        keyTimes="0;0.02;0.19;0.23;1"
                        dur="4.8s"
                        begin={`${i * 0.35}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Back to a plain div: with the sound gone it does nothing, so
              presenting it as a button would promise an interaction that is
              not there. */}
          <div className="wid-hub" ref={hubRef} aria-hidden="true">
            <span>{variant === 9 && active !== null ? WID_SHORT[active] : "Riz"}</span>
          </div>

          {SERVICES.map((s, i) => {
            const cls = [
              `soft-card wid-card wid-${s.slot} wid-n${i}`,
              isActive(i) ? "is-active" : "",
              variant === 10 && i < lit ? "is-lit" : "",
              variant === 7 ? `tone-${WID_ROLE[i].tone}` : "",
            ].filter(Boolean).join(" ");
            return (
              <article
                key={s.title}
                className={cls}
                data-spoke=""
                tabIndex={variant === 9 ? 0 : undefined}
                aria-pressed={variant === 9 ? active === i : undefined}
                style={{
                  ["--stagger" as string]: `${i * 0.3}s`,
                  ["--mark-delay" as string]: `${0.15 + i * 0.22}s`,
                  ["--pulse-delay" as string]: `${i * 0.35}s`,
                }}
                onPointerEnter={(e) => {
                  // Pointer only: a touch "hover" fires on tap, and firing a
                  // tone at someone who just scrolled past is not a detail.
                  if (e.pointerType === "mouse") {
                    playServiceTone(i);
                    if (focus) { setHovering(true); setActive(i); }
                  }
                }}
                onPointerLeave={() => focus && setHovering(false)}
                onClick={() => variant === 9 && setActive((a) => (a === i ? null : i))}
                onFocus={() => variant === 9 && setActive(i)}
              >
                <span className="wid-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {variant === 7 && <span className="wid-role">{WID_ROLE[i].label}</span>}
                {variant === 6 && <span className="wid-progress" aria-hidden="true" key={`p${active}`} />}
                <Icon>{s.icon}</Icon>
                <h3 className="wid-title"><span className="wid-mark">{s.title}</span></h3>
                <p className="wid-body">{s.body}</p>
              </article>
            );
          })}

        </div>
      </div>
    </section>
  );
}
