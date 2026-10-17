// Small UI sounds, synthesised with Web Audio rather than shipped as audio
// files so they cost nothing to load and can never 404.
//
// One AudioContext is shared by every sound and created lazily inside the
// click that first needs it, which is what the browser's autoplay policy
// requires. Everything is wrapped in try/catch: a sound failing must never
// interfere with what the user actually clicked.

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedCtx) sharedCtx = new AudioCtx();
  if (sharedCtx.state === "suspended") sharedCtx.resume();
  return sharedCtx;
}

type Tone = {
  /** Start frequency in Hz. */
  from: number;
  /** Optional end frequency — the tone glides to it over `glide` seconds. */
  to?: number;
  /** Seconds to reach `to`. */
  glide?: number;
  /** Peak gain, 0-1. */
  gain: number;
  /** Seconds from start until the tone has decayed to silence. */
  decay: number;
  /** Seconds to wait before this tone starts. */
  delay?: number;
};

function playTones(tones: Tone[]) {
  // These sounds are decoration, not feedback anyone depends on, so stay
  // silent for people who have asked for reduced motion.
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    for (const tone of tones) {
      const start = now + (tone.delay ?? 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(tone.from, start);
      if (tone.to !== undefined) {
        osc.frequency.exponentialRampToValueAtTime(tone.to, start + (tone.glide ?? 0.06));
      }
      gain.gain.setValueAtTime(tone.gain, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.decay);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + tone.decay + 0.01);
    }
  } catch {
    // Fail silently - e.g. Web Audio unsupported or blocked before user gesture.
  }
}

/** Played on every "Book a call" CTA. A bright two-tone pop. */
export function playPopSound() {
  playTones([
    { from: 420, to: 900, glide: 0.06, gain: 0.16, decay: 0.14 },
    { from: 1320, gain: 0.05, decay: 0.09, delay: 0.01 },
  ]);
}

/** Played by the manual/automated toggle in the workflow demo. */
export function playToggleSound() {
  playTones([{ from: 520, to: 880, glide: 0.08, gain: 0.15, decay: 0.12 }]);
}
/* ---------------------------------------------------------------------------
   Service card tones.

   One per card, and each is shaped like its icon's movement rather than being
   six arbitrary pitches: the scanner sweeps down, the dial glides up and
   settles, the payload leaves and arrives, the agent ticks three times, the
   deal steps up twice, the room resolves into a chord.

   Quieter than the click sounds (peak 0.05-0.09 against the CTA's 0.16)
   because a hover is not a decision — these should sit under the page, not
   announce themselves.
--------------------------------------------------------------------------- */
const SERVICE_TONES: Tone[][] = [
  // 0 · diagnosis — a scanner passing down over the page
  [{ from: 760, to: 360, glide: 0.22, gain: 0.06, decay: 0.26 }],
  // 1 · readiness — a needle sweeping up and settling
  [{ from: 340, to: 680, glide: 0.16, gain: 0.06, decay: 0.24 }],
  // 2 · automation — departure, then arrival at the far node
  [
    { from: 560, gain: 0.055, decay: 0.09 },
    { from: 940, gain: 0.05, decay: 0.11, delay: 0.13 },
  ],
  // 3 · agents — three ticks, the same rhythm as the typing dots
  [
    { from: 880, gain: 0.04, decay: 0.05 },
    { from: 880, gain: 0.04, decay: 0.05, delay: 0.08 },
    { from: 880, gain: 0.04, decay: 0.06, delay: 0.16 },
  ],
  // 4 · pipeline — a deal stepping one stage up
  [
    { from: 480, gain: 0.055, decay: 0.08 },
    { from: 720, gain: 0.055, decay: 0.14, delay: 0.09 },
  ],
  // 5 · workshops — a warm open fifth, the room together
  [
    { from: 440, gain: 0.05, decay: 0.3 },
    { from: 660, gain: 0.038, decay: 0.3, delay: 0.02 },
  ],
];

/**
 * Rate-limited: sweeping the pointer across the grid would otherwise fire
 * six overlapping tones in half a second, which is the difference between a
 * detail and an irritation.
 */
let lastToneAt = 0;

export function playServiceTone(index: number) {
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  if (now - lastToneAt < 220) return;
  lastToneAt = now;
  playTones(SERVICE_TONES[index % SERVICE_TONES.length]);
}
