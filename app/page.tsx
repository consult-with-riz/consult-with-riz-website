"use client";
import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimateIn from "@/components/AnimateIn";
import BookingSection from "@/components/BookingSection";
import HeroSection from "@/components/hero-section";
import CalBookingButton from "@/components/CalModal";
import { playToggleSound } from "@/lib/sounds";
import WhatIDo from "@/components/blocks/WhatIDo";
import ByTheNumbers from "@/components/blocks/ByTheNumbers";

const PORTRAIT_URL =
  "https://cdn.prod.website-files.com/68e7ded517d0693d2c345250/6a3a46d312c6d02c8e46bab1_691d97efffebe375af48ce33_Remove_GMNI-removebg-preview.png";

// ─── ASK-AN-AI POPUP (identical prompt/options/behavior as components/DirectLineCTA.tsx) ──
const AI_PROMPT =
  "I'm about to talk with Rizwan Mahmood, a fractional COO and Chief of Staff who ran operations at Careem, Bolt and Wise and automates the processes he installs, using n8n and Claude. Help me think through what to ask him and whether my startup needs a fractional COO, a Chief of Staff, or neither yet.";

const ENCODED_AI_PROMPT = encodeURIComponent(AI_PROMPT);

function AskAiChatGPTIcon() {
  return (
    <svg viewBox="0 0 24 24" width={26} height={26} fill="#0D0D0D" aria-hidden="true">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 5.7332A4.485 4.485 0 0 1 4.7213 3.7823v5.6772a.7664.7664 0 0 0 .3879.6765l5.8428 3.3685-2.02 1.1685a.0757.0757 0 0 1-.071 0l-4.8455-2.7935A4.504 4.504 0 0 1 2.35 5.7332zm16.5963 3.8558L13.0932 6.2151l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8404 2.7935a4.4992 4.4992 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 6.8449V4.5125a.0662.0662 0 0 1 .0284-.0615l4.8404-2.7899a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0623a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4599a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997z" />
    </svg>
  );
}

function AskAiClaudeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={26} height={26} fill="none" aria-hidden="true">
      <g stroke="#D97757" strokeWidth={2.2} strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="8" />
        <line x1="12" y1="16" x2="12" y2="22" />
        <line x1="2" y1="12" x2="8" y2="12" />
        <line x1="16" y1="12" x2="22" y2="12" />
        <line x1="4.9" y1="4.9" x2="9.2" y2="9.2" />
        <line x1="14.8" y1="14.8" x2="19.1" y2="19.1" />
        <line x1="19.1" y1="4.9" x2="14.8" y2="9.2" />
        <line x1="9.2" y1="14.8" x2="4.9" y2="19.1" />
      </g>
    </svg>
  );
}

function AskAiPerplexityIcon() {
  return (
    <svg viewBox="0 0 24 24" width={26} height={26} fill="#1F1F1F" aria-hidden="true">
      <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.0765 0v7.0896H1.6026v10.3976h2.4739v6.3542l6.7591-6.4471v6.4471h1.1554v-6.5372l6.6521 6.5372v-6.4471h2.4739V7.0896zM13.7331 2.6199v4.4697l-3.4763 3.0011V5.9497l3.4763-3.3298zm-8.4212.0177L8.7 5.9603v4.1354L5.3119 7.1618V2.6376zM2.7579 8.2449h1.9989v6.5518l-1.9989-1.7212V8.2449zm1.1958 8.3218l3.7592 3.2371v2.6903l-3.7592-3.5772v-2.3502zm4.9146 4.1697v-5.6524l-3.7395-3.2202V9.5807l4.895 4.2255v6.9302zm1.1554-6.9433l4.895-4.2223v3.4693l-3.7592 3.2192v5.6533l-1.1358.923v-6.9425zm8.6541 2.6905l-3.7592 3.5772v-2.6906l3.7592-3.2367v2.3501zM21.2421 13.078l-1.9989 1.7212V8.2449h1.9989v4.8331z" />
    </svg>
  );
}

const ASK_AI_OPTIONS = [
  {
    name: "ChatGPT",
    href: `https://chat.openai.com/?q=${ENCODED_AI_PROMPT}`,
    icon: <AskAiChatGPTIcon />,
  },
  {
    name: "Claude",
    href: `https://claude.ai/new?q=${ENCODED_AI_PROMPT}`,
    icon: <AskAiClaudeIcon />,
  },
  {
    name: "Perplexity",
    href: `https://www.perplexity.ai/search?q=${ENCODED_AI_PROMPT}`,
    icon: <AskAiPerplexityIcon />,
  },
];

// ─── BY THE NUMBERS ──────────────────────────────────────────────────────────


// ─── WORKFLOW STEPS (before/after toggle) ───────────────────────────────────

// ─── BEFORE ICONS ──────────────────────────────────────────────

// ─── COMPANY LOGOS ──────────────────────────────────────────────────────────


// ─── ENGAGEMENT FLOW ─────────────────────────────────────────────────────────

const FLOW = [
  {
    when: "Weeks 1–2",
    title: "Diagnose",
    body: "I map how the business actually runs. Who decides, where work waits, which numbers nobody trusts.",
  },
  {
    when: "Month 1",
    title: "Install",
    body: "Operating cadence, owners and a weekly scorecard. The founder stops being the router for every decision.",
  },
  {
    when: "Months 2–3",
    title: "Automate",
    body: "Whatever repeats gets built into a workflow. Reporting, handoffs, follow-ups. I design it on n8n and Claude.",
  },
  {
    when: "Then",
    title: "Hand over",
    body: "Documented, owned by your team, running without me. Stay on as advisor, or go.",
  },
];

// ─── ROUTE CARD ICONS (matches "How I think" icon style) ────────────────────

const routeIconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "#ff5c35",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function RouteBuildIcon() {
  return (
    <svg {...routeIconProps}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function RouteMicIcon() {
  return (
    <svg {...routeIconProps}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

function RouteBookIcon() {
  return (
    <svg {...routeIconProps}>
      <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H10a2 2 0 0 1 2 2v16a1.5 1.5 0 0 0-1.5-1.5H2z" />
      <path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H14a2 2 0 0 0-2 2v16a1.5 1.5 0 0 1 1.5-1.5H22z" />
    </svg>
  );
}

// ─── CLICKABLE CARD (whole card navigates, inner links/buttons still work) ──

function ClickableCard({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div
      className={className}
      role="link"
      tabIndex={0}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("a, button")) return;
        router.push(href);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(href);
      }}
    >
      {children}
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Home() {

  const [aiPickerOpen, setAiPickerOpen] = useState(false);
  const aiWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aiPickerOpen) return;

    function handlePointerDown(e: MouseEvent) {
      if (aiWrapRef.current && !aiWrapRef.current.contains(e.target as Node)) {
        setAiPickerOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAiPickerOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [aiPickerOpen]);

  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [isAfter, setIsAfter] = useState(false);
  const [hoveredBACard, setHoveredBACard] = useState<number | null>(null);
  const portraitAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioFadeRafRef = useRef<number | null>(null);



  const PORTRAIT_AUDIO_VOLUME = 0.5;
  const PORTRAIT_FADE_IN_MS = 1000;
  const PORTRAIT_FADE_OUT_MS = 500;

  function fadePortraitAudio(audio: HTMLAudioElement, to: number, duration: number, onDone?: () => void) {
    if (audioFadeRafRef.current !== null) {
      cancelAnimationFrame(audioFadeRafRef.current);
      audioFadeRafRef.current = null;
    }
    const from = audio.volume;
    const startTime = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      audio.volume = from + (to - from) * t;
      if (t < 1) {
        audioFadeRafRef.current = requestAnimationFrame(step);
      } else {
        audioFadeRafRef.current = null;
        onDone?.();
      }
    };
    audioFadeRafRef.current = requestAnimationFrame(step);
  }

  function handleAudioClick() {
    if (!portraitAudioRef.current) {
      const audio = new Audio("/audio/portrait-track.mp3");
      audio.loop = true;
      audio.volume = 0;
      audio.addEventListener("error", () => {
        setAudioState("idle");
      });
      portraitAudioRef.current = audio;
    }
    const audio = portraitAudioRef.current;

    if (audioState === "playing") {
      fadePortraitAudio(audio, 0, PORTRAIT_FADE_OUT_MS, () => audio.pause());
      setAudioState("paused");
      return;
    }

    audio
      .play()
      .then(() => {
        fadePortraitAudio(audio, PORTRAIT_AUDIO_VOLUME, PORTRAIT_FADE_IN_MS);
        setAudioState("playing");
      })
      .catch(() => {
        // Fail silently - e.g. file missing or playback blocked.
      });
  }

  useEffect(() => {
    function handleVisibilityChange() {
      const audio = portraitAudioRef.current;
      if (document.hidden && audio && !audio.paused) {
        fadePortraitAudio(audio, 0, PORTRAIT_FADE_OUT_MS, () => audio.pause());
        setAudioState("idle");
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (audioFadeRafRef.current !== null) {
        cancelAnimationFrame(audioFadeRafRef.current);
      }
      if (portraitAudioRef.current) {
        portraitAudioRef.current.pause();
        portraitAudioRef.current = null;
      }
    };
  }, []);


  // Toggle only changes state on manual click; the auto-toggling demo
  // animation has been removed entirely. The sound lives in lib/sounds.ts.

  return (
    <>
      {/* KEYFRAMES + THESIS GRID + PROOF GRID */}
      <style>{`
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin {
          from { transform: translateX(-50%) rotate(0deg); }
          to   { transform: translateX(-50%) rotate(360deg); }
        }
        .personality-subhead {
          font-size: 1.25rem;
          line-height: 1.7;
          color: #4A524A;
          max-width: 60ch;
        }
        /* Above 1200px the section container is capped at 1120px of usable
           width (--maxw: 1200px minus 40px padding each side). At that fixed
           width the sentence needs a ~13% smaller font to hold a single line,
           so drop the max-width cap and nudge the size down just there. */
        @media (min-width: 1200px) {
          .personality-subhead {
            font-size: 1.125rem;
            max-width: none;
            white-space: nowrap;
          }
        }
        /* ===== ROUTES - "How people work with me" ===== */
        .route-hero-v2 {
          position: relative;
          overflow: hidden;
          background: var(--cream);
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 48px 52px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .route-hero-v2:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 60px rgba(34,51,44,0.14);
        }
        .route-hero-texture {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(34,51,44,0.05) 1.5px, transparent 1.5px);
          background-size: 24px 24px;
          pointer-events: none;
          z-index: 0;
        }
        .route-hero-glow {
          position: absolute;
          top: 50%;
          right: -10%;
          width: 420px;
          height: 420px;
          transform: translateY(-50%);
          background: radial-gradient(circle, rgba(255,92,53,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .route-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: center;
        }
        .route-authority-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 20px;
          margin-top: 24px;
        }
        .route-authority-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: rgba(34,51,44,0.72);
          letter-spacing: 0.02em;
        }
        .route-authority-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(255,92,53,0.16);
          color: #ff5c35;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .route-price-block {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          text-align: right;
        }
        .route-price-from {
          font-family: var(--font-geist-mono), monospace;
          font-size: 14px;
          color: rgba(34,51,44,0.72);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .route-price-value {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 6px;
        }
        .route-price-amount {
          font-family: var(--font-fraunces), serif;
          font-size: 44px;
          font-weight: 500;
          color: #22332C;
          line-height: 1;
        }
        .route-price-suffix {
          font-family: var(--font-geist-mono), monospace;
          font-size: 14px;
          color: rgba(34,51,44,0.72);
        }
        .route-trust-line {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 14px;
          color: rgba(34,51,44,0.72);
          letter-spacing: 0.02em;
          margin-top: 4px;
        }
        .route-hero-btn {
          display: inline-block;
          background: #ff5c35;
          color: #ffffff;
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.22s;
        }
        .route-hero-btn:hover {
          background: #e8431b;
          transform: translateY(-2px);
        }
        .route-tag-chip {
          display: inline-flex;
          width: fit-content;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.1em;
          padding: 4px 12px;
          border-radius: 4px;
        }
        .route-tag-chip--ink {
          background: rgba(34,51,44,0.06);
          color: #22332C;
        }
        .route-tag-chip--coral {
          background: rgba(255,92,53,0.12);
          color: #ff5c35;
        }
        .route-cards-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 28px;
        }
        .route-card-v2 {
          position: relative;
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .route-card-v2:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 36px rgba(34,51,44,0.1);
          border-color: #22332C;
        }
        .route-card-v2:hover .route-card-title {
          color: #ff5c35;
        }
        .route-card-icon {
          position: absolute;
          top: 28px;
          right: 28px;
        }
        .route-card-title {
          font-family: var(--font-fraunces), serif;
          font-size: 20px;
          font-weight: 600;
          color: #22332C;
          padding-right: 30px;
          transition: color 0.25s ease;
        }
        .route-authority-line {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: rgba(34,51,44,0.72);
          letter-spacing: 0.02em;
        }
        .route-card-buttons {
          display: flex;
          gap: 8px;
          margin-top: 4px;
          position: relative;
          z-index: 1;
        }
        .route-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #22332C;
          color: var(--cream);
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.22s ease;
        }
        .route-btn-primary:hover {
          background: #ff5c35;
        }
        .route-btn-arrow {
          display: inline-block;
          transition: transform 0.22s ease;
        }
        .route-btn-primary:hover .route-btn-arrow {
          transform: translateX(3px);
        }
        .route-btn-ghost {
          display: inline-flex;
          align-items: center;
          background: transparent;
          border: 1px solid var(--line);
          color: #22332C;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .route-btn-ghost:hover {
          border-color: #22332C;
          background: rgba(34,51,44,0.04);
        }
        .route-footnote {
          margin-top: 24px;
          text-align: center;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: rgba(34,51,44,0.72);
        }
        .route-footnote a {
          color: #ff5c35;
          text-decoration: none;
        }
        .route-footnote a:hover {
          text-decoration: underline;
        }
        @media (max-width: 860px) {
          .route-hero-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .route-price-block {
            align-items: flex-start;
            text-align: left;
          }
          .route-hero-glow {
            right: -30%;
          }
        }
        @media (max-width: 768px) {
          .route-cards-row {
            grid-template-columns: 1fr;
          }
        }
        /* ===== MERGED HERO - "Have a chat with me?" + Consulting & coaching ===== */
        .merged-hero {
          padding: 32px 52px 24px;
        }
        .merged-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: auto 1fr auto;
          grid-template-areas:
            "photo text  price"
            "photo cta   price"
            "proof proof proof";
          gap: 32px;
          align-items: start;
        }
        .merged-hero-photo-col {
          grid-area: photo;
          align-self: start;
          margin-top: 4px;
        }
        .merged-hero-text {
          grid-area: text;
        }
        .merged-hero-photo {
          width: 128px;
          height: 128px;
          min-width: 128px;
          min-height: 128px;
          border-radius: 50%;
          object-fit: cover;
          object-position: top center;
          border: 5px solid #ffffff;
          box-shadow: 0 10px 24px rgba(34,51,44,0.2);
          display: block;
        }
        .merged-hero-heading {
          font-family: var(--font-fraunces), serif;
          font-size: clamp(1.6rem, 1.35rem + 1.1vw, 2.15rem);
          line-height: 1.12;
          letter-spacing: -0.013em;
          font-weight: 500;
          color: #22332C;
          margin: 14px 0 0;
        }
        .merged-hero-heading-accent {
          color: #ff5c35;
        }
        .merged-hero-desc {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 16px;
          color: rgba(34,51,44,0.72);
          line-height: 1.7;
          max-width: 460px;
          margin: 8px 0 0;
        }
        .merged-hero-price {
          grid-area: price;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          gap: 6px;
          text-align: right;
          height: 100%;
        }
        .merged-cta-row {
          grid-area: cta;
          display: flex;
          align-items: center;
          gap: 28px;
          width: fit-content;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--line);
        }
        .merged-ladder-ai {
          display: inline-flex;
          align-items: center;
          gap: 14px;
        }
        .merged-door-btn {
          font-size: 14px;
          padding: 12px 22px;
        }
        .merged-ai-popover {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .merged-ai-popover-link {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(34,51,44,0.18), 0 2px 6px rgba(34,51,44,0.1);
          text-decoration: none;
          animation: mergedAiPopoverIn 150ms ease-out backwards;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .merged-ai-popover-link:hover,
        .merged-ai-popover-link:focus-visible {
          transform: scale(1.1);
          box-shadow: 0 12px 26px rgba(34,51,44,0.24), 0 4px 10px rgba(34,51,44,0.14);
        }
        .merged-ai-popover-link svg {
          width: 26px;
          height: 26px;
        }
        @keyframes mergedAiPopoverIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .merged-ai-popover-label {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #22332C;
          background: #ffffff;
          padding: 4px 10px;
          border-radius: 100px;
          box-shadow: 0 4px 12px rgba(34,51,44,0.14);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease;
        }
        .merged-ai-popover-link:hover .merged-ai-popover-label,
        .merged-ai-popover-link:focus-visible .merged-ai-popover-label {
          opacity: 1;
        }
        .merged-proof {
          grid-area: proof;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--line);
        }
        @media (max-width: 640px) {
          .merged-hero {
            padding: 28px 24px 20px;
          }
          .merged-hero-grid {
            grid-template-columns: 1fr;
            grid-template-areas:
              "photo"
              "text"
              "price"
              "cta"
              "proof";
            justify-items: center;
            text-align: center;
          }
          .merged-hero-desc {
            max-width: none;
          }
          .merged-hero-price {
            align-items: center;
            justify-content: flex-start;
            text-align: center;
            height: auto;
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid var(--line);
          }
          .merged-cta-row {
            flex-wrap: wrap;
            justify-content: center;
            width: auto;
            margin-top: 0;
            padding-top: 0;
            border-top: none;
          }
          .merged-ladder-ai {
            flex-wrap: wrap;
            justify-content: center;
          }
          .merged-ai-popover {
            width: 100%;
            flex-wrap: wrap;
            justify-content: center;
          }
          @keyframes mergedAiPopoverIn {
            from {
              opacity: 0;
              transform: scale(0.5);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .merged-proof {
            justify-content: center;
          }
        }
        .flow-grid {
          margin-top: var(--heading-gap);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .flow-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: 100%;
          padding: 28px 24px;
        }
        .flow-num {
          font-family: var(--font-geist-mono), monospace;
          font-size: 14px;
          font-weight: 600;
          color: #ff5c35;
        }
        .flow-when {
          font-family: var(--font-geist-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(34,51,44,0.6);
        }
        .flow-title {
          font-size: 22px;
          font-weight: 600;
          color: #22332C;
        }
        .flow-body {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(34,51,44,0.78);
        }
        @media (max-width: 960px) {
          .flow-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .flow-grid { grid-template-columns: 1fr; }
        }
        .thesis-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          align-items: stretch;
          gap: 0;
        }
        .portrait-col {
          display: block;
        }
        .portrait-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .flow-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .flow-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: 100%;
          padding: 28px 24px;
        }
        .flow-num {
          font-family: var(--font-geist-mono), monospace;
          font-size: 14px;
          font-weight: 600;
          color: #ff5c35;
        }
        .flow-when {
          font-family: var(--font-geist-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(34,51,44,0.6);
        }
        .flow-title {
          font-size: 22px;
          font-weight: 600;
          color: #22332C;
        }
        .flow-body {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(34,51,44,0.78);
        }
        @media (max-width: 960px) {
          .flow-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .flow-grid { grid-template-columns: 1fr; }
        }
        .thesis-grid {
            grid-template-columns: 1fr;
          }
          .portrait-col {
            display: block;
            height: 480px;
          }
          .portrait-sticky {
            position: relative;
            height: 100%;
          }
        }
        .by-numbers-grid {
          display: grid;
          grid-template-columns: 35% 65%;
          gap: 0;
          align-items: start;
        }
        @media (max-width: 768px) {
          .by-numbers-grid {
            grid-template-columns: 1fr;
          }
        }
        @keyframes hand-wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          10%           { transform: rotate(-12deg); }
          30%           { transform: rotate(12deg); }
        }
        @keyframes statFlow {
          0%   { background-position: 0% center }
          100% { background-position: 300% center }
        }
        @keyframes terminalIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .terminal-line {
          opacity: 0;
          animation: terminalIn 0.3s ease forwards;
        }
        .terminal-cursor::after {
          content: "█";
          color: #ff5c35;
          animation: blink 1s step-end infinite;
          margin-left: 4px;
        }

        /* ===== SELECTED WORK - SYSTEM ROWS ===== */
        .work-rows-list {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .work-rows-list::before {
          content: '';
          position: absolute;
          left: 21px;
          top: 30px;
          bottom: 30px;
          width: 2px;
          background: linear-gradient(to bottom, rgba(193,122,90,0.4) 0%, rgba(193,122,90,0.05) 100%);
          z-index: 0;
        }
        .work-row {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 24px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 22px 26px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .work-row:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 36px rgba(34,51,44,0.10);
          border-color: #ff5c35;
        }
        .work-row-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid #C17A5A;
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: var(--font-geist-mono), 'Geist Mono', monospace;
          font-size: 14px;
          font-weight: 600;
          color: #C17A5A;
          transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .work-row:hover .work-row-badge {
          background: #ff5c35;
          border-color: #ff5c35;
          color: #fff;
        }
        .work-row-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1 1 42%;
          min-width: 0;
        }
        .work-row-tag {
          display: inline-flex;
          width: fit-content;
          font-family: var(--font-montserrat), sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ff5c35;
          background: rgba(255,92,53,0.08);
          padding: 3px 10px;
          border-radius: 100px;
        }
        .work-row-title {
          font-family: var(--font-fraunces), serif;
          font-size: 20px;
          font-weight: 600;
          color: #22332C;
          line-height: 1.3;
        }
        .work-row-result {
          font-family: inherit;
          font-size: 14px;
          color: rgba(34,51,44,0.72);
          line-height: 1.5;
          flex: 1 1 30%;
          min-width: 0;
        }
        .work-row-arrow {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #5E594E;
          font-size: 16px;
          transition: all 0.25s ease;
        }
        .work-row:hover .work-row-arrow {
          background: #ff5c35;
          border-color: #ff5c35;
          color: #fff;
          transform: translate(2px, -2px);
        }
        .work-view-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 28px;
          background: #22332C;
          color: var(--cream);
          font-family: var(--font-inter-tight), 'Inter Tight', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 26px;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.22s ease, transform 0.22s ease;
        }
        .work-view-all:hover {
          background: #ff5c35;
          transform: translateY(-2px);
        }
        @media (max-width: 640px) {
          .work-rows-list::before {
            display: none;
          }
          .work-row {
            position: relative;
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
            padding: 20px 20px 24px;
          }
          .work-row-arrow {
            position: absolute;
            top: 20px;
            right: 20px;
          }
        }
      `}</style>

      {/* SECTION 1 - HERO */}
      <HeroSection />

      {/* SECTION 3 - WHAT I DO
          Replaces the old "What I actually believe" essay block, in the
          same slot: straight after the hero, before the numbers. */}
      <WhatIDo />

      {/* BY THE NUMBERS
          The board: one row per company, chronological, no filter. Markup
          and styles live in components/blocks/ByTheNumbers.tsx and the
          .bnum-* block at the end of globals.css. */}
      <ByTheNumbers />

      {/* SECTION 5 - HOW AN ENGAGEMENT RUNS */}
      <section className="section-pad" style={{ background: "#FFFFFF" }}>
        <div className="max-w-site">
          <div className="block-head is-center">
            <span className="pill-eyebrow">How it runs</span>
            <h2 className="block-title">
              In the room for a while.{" "}
              <span className="text-ramp">Then out of the way.</span>
            </h2>
          </div>
          <div className="flow-grid">
            {FLOW.map((f, i) => (
              <AnimateIn key={f.title} delay={i * 90}>
                <article className="soft-card flow-card">
                  <span className="flow-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flow-when">{f.when}</span>
                  <h3 className="flow-title">{f.title}</h3>
                  <p className="flow-body">{f.body}</p>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 - ROUTES */}
      <section id="how-people-work-with-me" className="section-pad" style={{ background: "var(--paper)" }}>
        <div className="max-w-site">
          <AnimateIn delay={80}>
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: 48,
                color: "#22332C",
                fontWeight: 500,
                marginBottom: 56,
              }}
            >
              How people work with me.
            </h2>
          </AnimateIn>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* ROW 1 - Consulting & "Have a chat with me?" merged hero */}
            <AnimateIn delay={200}>
              <div className="route-hero-v2 merged-hero">
                <div className="route-hero-texture" aria-hidden="true" />
                <div className="route-hero-glow" aria-hidden="true" />

                <div className="merged-hero-grid">
                  {/* Portrait */}
                  <div className="merged-hero-photo-col">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/riz-photo-new.jpg"
                      alt="Rizwan Mahmood"
                      className="merged-hero-photo"
                    />
                  </div>

                  {/* Eyebrow, headline, description */}
                  <div className="merged-hero-text">
                    <span className="route-tag-chip route-tag-chip--coral" style={{ marginBottom: 16 }}>
                      RETAINER
                    </span>
                    <h3 className="merged-hero-heading">
                      Fractional COO <span className="merged-hero-heading-accent">or Chief of Staff.</span>
                    </h3>
                    <p className="merged-hero-desc">
                      1–2 days a week inside your leadership team. I own operations, cadence and follow-through, and automate what repeats.
                    </p>
                  </div>

                  {/* Price block - right side, stacked vertically */}
                  <div className="merged-hero-price">
                    <span className="route-price-from">Monthly retainer</span>
                    <span className="route-price-value">
                      <span className="route-price-amount">Scoped</span>
                    </span>
                    <span className="route-trust-line">to your stage · quoted after the Diagnostic</span>
                  </div>

                  {/* CTAs - left, under headline/description */}
                  <div className="merged-cta-row">
                    <CalBookingButton className="route-hero-btn">Book a call →</CalBookingButton>

                    <div className="merged-ladder-ai" ref={aiWrapRef}>
                      <button
                        type="button"
                        className="route-btn-ghost merged-door-btn"
                        onClick={() => setAiPickerOpen((open) => !open)}
                        aria-expanded={aiPickerOpen}
                        aria-haspopup="menu"
                      >
                        Ask an AI about Riz →
                      </button>

                      {aiPickerOpen && (
                        <div className="merged-ai-popover" role="menu">
                          {ASK_AI_OPTIONS.map((opt, i) => (
                            <a
                              key={opt.name}
                              href={opt.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="merged-ai-popover-link"
                              style={{ animationDelay: `${i * 50}ms` }}
                              aria-label={`Ask ${opt.name} about Riz`}
                              role="menuitem"
                            >
                              {opt.icon}
                              <span className="merged-ai-popover-label" aria-hidden="true">{opt.name}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Proof strip */}
                  <div className="route-authority-row merged-proof">
                    <span className="route-authority-chip">
                      <span className="route-authority-icon">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01z" />
                        </svg>
                      </span>
                      10+ yrs ops · Careem · Bolt · Wise
                    </span>
                    <span className="route-authority-chip">
                      <span className="route-authority-icon">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" />
                        </svg>
                      </span>
                      $3.9M cost cut at Bolt
                    </span>
                    <span className="route-authority-chip">
                      <span className="route-authority-icon">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      Ops + automation, one person
                    </span>
                  </div>
                </div>
              </div>
            </AnimateIn>

            {/* ROW 2 - 3 columns */}
            <div className="route-cards-row">
              {/* CARD A - A system built for you */}
              <AnimateIn delay={280}>
                <ClickableCard href="/services#ops-diagnostic" className="route-card-v2">
                  <span className="route-card-icon"><RouteBuildIcon /></span>
                  <span className="route-tag-chip route-tag-chip--ink">FIXED SCOPE</span>
                  <p className="route-card-title">Ops Diagnostic</p>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 14,
                      color: "rgba(34,51,44,0.72)",
                      lineHeight: 1.65,
                      flexGrow: 1,
                    }}
                  >
                    Two weeks. How the business really runs, where it breaks, and a 90-day plan with an automation shortlist. Credited against month one if we continue.
                  </p>
                  <p className="route-authority-line">$3,500 · fixed scope</p>
                  <div className="route-card-buttons">
                    <Link href="/services#ops-diagnostic" className="route-btn-primary">
                      Details <span className="route-btn-arrow">→</span>
                    </Link>
                  </div>
                </ClickableCard>
              </AnimateIn>

              {/* CARD B - Speaking & workshops */}
              <AnimateIn delay={360}>
                <ClickableCard href="/booking" className="route-card-v2">
                  <span className="route-card-icon"><RouteBookIcon /></span>
                  <span className="route-tag-chip route-tag-chip--ink">1:1 ADVISORY</span>
                  <p className="route-card-title">An hour with an operator</p>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 14,
                      color: "rgba(34,51,44,0.72)",
                      lineHeight: 1.65,
                      flexGrow: 1,
                    }}
                  >
                    One problem, sixty minutes. Cadence, hiring, cost, or what to automate first. $140, flat.
                  </p>
                  <p className="route-authority-line">Recording and action plan included</p>
                  <div className="route-card-buttons">
                    <Link href="/booking" className="route-btn-primary">
                      Book <span className="route-btn-arrow">→</span>
                    </Link>
                  </div>
                </ClickableCard>
              </AnimateIn>

              {/* CARD C - Just want to learn? */}
              <AnimateIn delay={440}>
                <ClickableCard href="/case-studies" className="route-card-v2">
                  <span className="route-card-icon"><RouteBuildIcon /></span>
                  <span className="route-tag-chip route-tag-chip--coral">PROOF</span>
                  <p className="route-card-title">Want to see the work first?</p>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 14,
                      color: "rgba(34,51,44,0.72)",
                      lineHeight: 1.65,
                      flexGrow: 1,
                    }}
                  >
                    Seven cases from Bolt, Wise, Careem and client work since. What the problem was, what I did, what moved.
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#ff5c35",
                    }}
                  >
                    $3.9M · 8→3 days · 20s
                  </p>
                  <div className="route-card-buttons">
                    <Link href="/case-studies" className="route-btn-primary">
                      Case studies <span className="route-btn-arrow">→</span>
                    </Link>
                  </div>
                </ClickableCard>
              </AnimateIn>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 9 - BOOKING */}
      <BookingSection />
    </>
  );
}
