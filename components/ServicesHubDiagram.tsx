"use client";
import { useState } from "react";

/* ── geometry constants ──────────────────────────────────────────── */
const CX = 294;          // SVG center x
const CY = 268;          // SVG center y
const CR = 104;          // center circle radius
const OR = 192;          // orbit radius (center-to-node-center)
const NR = 74;           // node circle radius

// Node positions in the initial SVG viewport
// Three nodes at 120° steps: top, bottom-right, bottom-left. Path order.
const NODES = [
  { id: "ops-diagnostic", cx: CX,                                             cy: CY - OR,                                             fill: "#ff5c35", num: "01", label: ["OPS & AI", "DIAGNOSTIC"] },
  { id: "fractional-coo", cx: Math.round(CX + OR * Math.cos(Math.PI / 6)),     cy: Math.round(CY + OR * Math.sin(Math.PI / 6)),     fill: "#22332C", num: "02", label: ["FRACTIONAL COO /", "CHIEF OF STAFF"] },
  { id: "fit-call",        cx: Math.round(CX + OR * Math.cos(5 * Math.PI / 6)), cy: Math.round(CY + OR * Math.sin(5 * Math.PI / 6)), fill: "#5A6660", num: "03", label: ["FREE", "FIT CALL"] },
] as const;

/* ── component ───────────────────────────────────────────────────── */
export default function ServicesHubDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const paused = hovered !== null;

  const orbitStyle = {
    transformOrigin: `${CX}px ${CY}px`,
    animation: "svc-orbit 12s linear infinite",
    animationPlayState: paused ? "paused" : "running",
  } as React.CSSProperties;

  const counterStyle = (ncx: number, ncy: number) => ({
    transformOrigin: `${ncx}px ${ncy}px`,
    animation: "svc-counter 12s linear infinite",
    animationPlayState: paused ? "paused" : "running",
  } as React.CSSProperties);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <svg
      viewBox="0 0 588 536"
      style={{ width: "100%", maxWidth: 560, height: "auto", display: "block", margin: "0 auto" }}
    >
      {/* ── spokes (inside orbit group so they track the nodes) ───── */}
      <g style={orbitStyle}>
        {NODES.map((n) => (
          <line
            key={`spoke-${n.id}`}
            x1={CX} y1={CY} x2={n.cx} y2={n.cy}
            style={{ stroke: "var(--line)" }} strokeWidth="1.5" strokeDasharray="5 4"
          />
        ))}
      </g>

      {/* ── glow ring (static, sits on top of spokes) ─────────────── */}
      <circle cx={CX} cy={CY} r={CR + 28} fill="none" stroke="#FFFFFF" strokeWidth="30" />

      {/* ── center circle - pulse only, does NOT rotate ───────────── */}
      <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: "svc-pulse 3s ease-in-out infinite" } as React.CSSProperties}>
        <circle cx={CX} cy={CY} r={CR} fill="#22332C" />
        <text x={CX} y={CY - 22} textAnchor="middle" fontSize="18" fill="rgba(255,255,255,0.9)" letterSpacing="0.03em" style={{ fontFamily: "var(--font-body), sans-serif" }}>Ops that run</text>
        <text x={CX} y={CY + 3}  textAnchor="middle" fontSize="18" fill="rgba(255,255,255,0.9)" style={{ fontFamily: "var(--font-body), sans-serif" }}>without the</text>
        <text x={CX} y={CY + 28} textAnchor="middle" fontSize="18" fill="rgba(255,255,255,0.9)" style={{ fontFamily: "var(--font-body), sans-serif" }}>founder</text>
      </g>

      {/* ── orbiting nodes ────────────────────────────────────────── */}
      <g style={orbitStyle}>
        {NODES.map((n) => {
          const isHovered = hovered === n.id;
          return (
            <g key={n.id}>
              {/*
               * Counter-rotation group: rotates -θ around the node's INITIAL
               * SVG position.  Combined with the parent's +θ orbit, this keeps
               * all text inside the circle perfectly upright at every angle.
               */}
              <g style={counterStyle(n.cx, n.cy)}>
                {/* Scale wrapper - only scales the active hovered node */}
                <g
                  style={{
                    transformOrigin: `${n.cx}px ${n.cy}px`,
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                    transition: "transform 0.2s ease",
                    cursor: "pointer",
                  } as React.CSSProperties}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => goTo(n.id)}
                >
                  {/* circle */}
                  <circle
                    cx={n.cx}
                    cy={n.cy}
                    r={NR}
                    fill={n.fill}
                    stroke="#fff"
                    strokeWidth={isHovered ? 2 : 0}
                    style={{ transition: "stroke-width 0.2s ease" }}
                  />

                  {/* number - display face, centered in circle */}
                  <text
                    x={n.cx} y={n.cy - (n.label.length > 1 ? 14 : 6)}
                    textAnchor="middle" dominantBaseline="auto"
                    fontSize="32" fontWeight="500" fill="#fff"
                    style={{ pointerEvents: "none", fontFamily: "var(--font-display), sans-serif", letterSpacing: "-0.012em" } as React.CSSProperties}
                  >
                    {n.num}
                  </text>

                  {/* label - mono, below number, one or two lines, stays inside circle */}
                  <text
                    x={n.cx} y={n.cy + (n.label.length > 1 ? 14 : 24)}
                    textAnchor="middle" dominantBaseline="auto"
                    fontFamily="var(--font-dm-mono), monospace"
                    fontSize={n.label.length > 1 ? "11" : "12.5"}
                    fill="#fff"
                    fontWeight="600"
                    letterSpacing="0.05em"
                    style={{ pointerEvents: "none", transition: "fill 0.2s ease" } as React.CSSProperties}
                  >
                    {n.label.map((line, li) => (
                      <tspan key={line} x={n.cx} dy={li === 0 ? 0 : 15}>
                        {line}
                      </tspan>
                    ))}
                  </text>

                  {/* native browser tooltip */}
                  <title>{n.label.join(" ")}</title>
                </g>
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
