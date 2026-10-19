/**
 * A small, dependency-free confetti burst from a point on screen.
 * Draws on a temporary full-screen canvas that removes itself when the
 * last piece has fallen. Skipped for people who prefer reduced motion.
 */
const COLORS = ["#FF5C35", "#FFB199", "#22332C", "#C17A5A", "#F4C95D", "#7FB7A4"];

type Piece = {
  x: number; y: number; vx: number; vy: number;
  w: number; h: number; rot: number; vr: number;
  color: string; shape: "rect" | "circle"; life: number;
};

export function burstConfetti(x: number, y: number, count = 70) {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed", inset: "0", width: "100vw", height: "100vh",
    pointerEvents: "none", zIndex: "9999",
  });
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return; }
  ctx.scale(dpr, dpr);

  const pieces: Piece[] = Array.from({ length: count }, () => {
    // fan out upwards, mostly, with a little spread to the sides
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
    const speed = 6 + Math.random() * 7;
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 5,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() < 0.25 ? "circle" : "rect",
      life: 1,
    };
  });

  // Motion is time-based, not per-frame: each step is scaled by how long
  // the last frame actually took (k = 1 at 60fps). A dropped frame, or a
  // 120Hz screen, then changes how often we draw but never how fast the
  // pieces fall, so the fall stays smooth.
  const start = performance.now();
  let last = start;
  const frame = (now: number) => {
    const elapsed = now - start;
    const k = Math.min((now - last) / (1000 / 60), 3);
    last = now;
    const drag = Math.pow(0.985, k);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = 0;
    for (const p of pieces) {
      p.vy += 0.25 * k;      // gravity
      p.vx *= drag;          // air drag
      p.vy *= drag;
      p.x += p.vx * k;
      p.y += p.vy * k;
      p.rot += p.vr * k;
      if (elapsed > 1400) p.life -= 0.02 * k;
      if (p.life <= 0 || p.y > window.innerHeight + 20) continue;
      alive++;
      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.h / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // squash the width as it spins, so it reads as paper flipping
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w * Math.cos(p.rot * 2), p.h);
      }
      ctx.restore();
    }
    if (alive > 0 && elapsed < 4000) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
