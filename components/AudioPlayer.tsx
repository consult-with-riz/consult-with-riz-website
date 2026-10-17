"use client";

import { useAudio } from "@/contexts/audio-context";

export function AudioPlayer() {
  const { isPlaying } = useAudio();

  if (!isPlaying) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(34,51,44,0.92)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,92,53,0.25)",
        borderRadius: 99,
        padding: "0.4rem 1rem",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          color: "#ff5c35",
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "0.875rem",
          animation: "pulse-dot 1.4s ease-in-out infinite",
        }}
      >
        ♪
      </span>
      <span
        style={{
          color: "#ff5c35",
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "0.875rem",
        }}
      >
        playing
      </span>
    </div>
  );
}
