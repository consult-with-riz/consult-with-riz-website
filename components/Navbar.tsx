"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  // Temporary: merged homepage versions, shared for review before one replaces "/".
  { label: "Home V2", href: "/home-v2" },
  { label: "Home V3", href: "/home-v3" },
  { label: "Services", href: "/services" },
  { label: "Case studies", href: "/case-studies" },
  { label: "My CV", href: "/cv", cta: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [darkHero, setDarkHero] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      const pastThreshold = y > 80;
      setScrolled(pastThreshold);
      setHidden(pastThreshold && y > lastY);
      lastY = y;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Re-detect dark hero whenever the route changes, after the new page renders
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setDarkHero(!!document.querySelector('[data-hero="dark"]'));
      // Also reset scroll state on navigation (page starts at top)
      setScrolled(window.scrollY > 80);
      setHidden(false);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Keep the nav visible whenever the mobile drawer is open
  useEffect(() => {
    if (open) setHidden(false);
  }, [open]);

  // White text only when we're at the top of a dark-hero page
  const light = darkHero && !scrolled;

  const textColor = light ? "rgba(255,255,255,0.82)" : "var(--body)";
  const textHover = light ? "#ffffff" : "var(--ink)";
  const logoColor = light ? "#ffffff" : "var(--ink)";
  const barColor = light ? "#ffffff" : "var(--ink)";

  return (
    <>
    <style>{`
      .nav-cta {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 9px 18px; border-radius: 8px;
        background: var(--coral); color: #fff;
        font-family: var(--font-dm-sans), sans-serif; font-weight: 600; font-size: 0.95rem;
        text-decoration: none; white-space: nowrap;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      .nav-cta:hover { background: var(--coral-d); transform: translateY(-1px); }
      .nav-cta--menu { align-self: flex-start; margin-top: 0.5rem; font-size: 1.05rem; padding: 11px 22px; }
    `}</style>
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition:
          "background 0.25s ease, backdrop-filter 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
        transform: hidden && !open ? "translateY(-100%)" : "translateY(0)",
        background: scrolled ? "rgba(255,255,255,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        boxShadow: scrolled ? "0 8px 24px rgba(34,51,44,0.08)" : "none",
      }}
    >
      <div
        className="max-w-site flex items-center justify-between md:justify-start"
        style={{ height: scrolled ? 60 : 68, transition: "height 0.25s ease" }}
      >
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <span
            className="animate-pulse-dot"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#ff5c35",
              display: "inline-block",
              marginTop: 2,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 600,
              fontSize: "1.5rem",
              color: logoColor,
              letterSpacing: "-0.02em",
              transition: "color 0.3s ease",
            }}
          >
            Riz
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8"
          style={{
            marginLeft: "auto",
            flexWrap: "nowrap",
            flexShrink: 0,
          }}
        >
          {navLinks.map((l) =>
            "cta" in l ? (
              <Link key={l.href} href={l.href} className="nav-cta">
                {l.label}
              </Link>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: textColor,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = textHover)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
              >
                {l.label}
              </Link>
            )
          )}
        </nav>

        {/* Hamburger */}
        <button
          className="flex md:hidden flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <span
            style={{
              display: "block", width: 22, height: 2,
              background: barColor, borderRadius: 2,
              transition: "transform 0.2s, background 0.3s ease",
              transform: open ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block", width: 22, height: 2,
              background: barColor, borderRadius: 2,
              opacity: open ? 0 : 1,
              transition: "opacity 0.2s, background 0.3s ease",
            }}
          />
          <span
            style={{
              display: "block", width: 22, height: 2,
              background: barColor, borderRadius: 2,
              transition: "transform 0.2s, background 0.3s ease",
              transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 360 : 0,
          transition: "max-height 0.3s ease",
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          borderTop: open ? "1px solid var(--line)" : "none",
        }}
      >
        <div className="max-w-site flex flex-col gap-2 py-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={"cta" in l ? "nav-cta nav-cta--menu" : undefined}
              style={
                "cta" in l
                  ? undefined
                  : {
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontWeight: 500,
                      fontSize: "1.125rem",
                      color: "var(--body)",
                      textDecoration: "none",
                      padding: "0.5rem 0",
                    }
              }
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
    </>
  );
}
