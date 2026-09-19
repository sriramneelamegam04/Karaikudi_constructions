import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import "./ScrollExpandPage.css";

import heroImage from "../../images/hero1.png";

const clamp = (value, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const lerp = (from, to, amount) =>
  from + (to - from) * amount;

const smoothstep = (start, end, value) => {
  const x = clamp((value - start) / (end - start));
  return x * x * (3 - 2 * x);
};

const easeInOutCubic = (t) =>
  t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

const easeOutQuart = (t) =>
  1 - Math.pow(1 - t, 4);

function ArrowDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 seh-arrow-svg"
      aria-hidden="true"
    >
      <path
        d="M12 4v15m0 0-5-5m5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ScrollExpandHero({
  image = heroImage,
  backgroundColor = "var(--color-cream-bg, #f5f0e6)", // Light warm cream matching project

  leftWord = "HERITAGE",
  rightWord = "LEGACIES",

  beforeBadge = "About Our Approach",
  beforeTitle = "We build homes rooted in place",
  beforeCta = "Explore Our Approach",
  beforeDesc1 = "We design and build distinctive residences inspired by the architectural heritage of Chettinad, where craftsmanship, proportion, natural materials, and climate-responsive spaces come together.",
  beforeDesc2 = "From traditional courtyards and thinnai verandahs to lime plaster, Semmann brick, Athangudi tiles, and handcrafted timber, every detail is thoughtfully adapted for contemporary living.",

  finalEyebrow = "KARAIKUDI CONSTRUCTIONS",
  finalTitle = "We build homes rooted in place",
  finalAccent = "Explore Our Approach",
  finalDesc1 = "We design and build distinctive residences inspired by the architectural heritage of Chettinad, where craftsmanship, proportion, natural materials, and climate-responsive spaces come together.",
  finalDesc2 = "From traditional courtyards and thinnai verandahs to lime plaster, Semmann brick, Athangudi tiles, and handcrafted timber, every detail is thoughtfully adapted for contemporary living.",
  finalContact = "+91 XXXXX XXXXX",
  finalEmail = "hello@karaikudiconstruction.com",
}) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  const [progress, setProgress] = useState(0);

  const [screenWidth, setScreenWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  const isMobile = screenWidth < 768;

  /* =========================================================
     SMOOTH SCROLL (LENIS) + PINNING
  ========================================================= */

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
      syncTouch: false,

      easing: (t) =>
        Math.min(
          1,
          1.001 - Math.pow(2, -10 * t)
        ),
    });

    let rafId;

    const updatePinAndProgress = () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = section.offsetHeight - vh;

      // ---- Robust Pinning (Immune to overflow-x:hidden or ancestor quirks) ----
      if (rect.top > 0) {
        stage.style.position = "absolute";
        stage.style.top = "0px";
        stage.style.bottom = "auto";
      } else if (-rect.top >= total) {
        stage.style.position = "absolute";
        stage.style.top = `${Math.max(0, total)}px`;
        stage.style.bottom = "auto";
      } else {
        stage.style.position = "fixed";
        stage.style.top = "0px";
        stage.style.bottom = "auto";
      }

      targetProgress.current = clamp(
        -rect.top / Math.max(total, 1)
      );
    };

    const raf = (time) => {
      lenis.raf(time);

      /*
       * Additional interpolation makes
       * the reveal animation softer.
       */
      currentProgress.current +=
        (targetProgress.current - currentProgress.current) * 0.085;

      setProgress(currentProgress.current);

      rafId = requestAnimationFrame(raf);
    };

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      updatePinAndProgress();
    };

    const handleNativeScroll = () => {
      updatePinAndProgress();
    };

    lenis.on("scroll", updatePinAndProgress);
    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    updatePinAndProgress();
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", updatePinAndProgress);
      lenis.destroy();
      window.removeEventListener("scroll", handleNativeScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =========================================================
     TIMELINE

     0.00 - 0.06
     Solid colour only + Before-reveal text introduction

     0.06 - 0.35
     Vintage doorway grows upward

     0.35 - 0.44
     Doorway holds

     0.44 - 0.82
     Doorway expands fullscreen

     0.78+
     Final content
  ========================================================= */

  /* =========================================================
     BEFORE REVEAL INTRO
  ========================================================= */
  const beforeOpacity = 1 - smoothstep(0.04, 0.22, progress);
  const beforeTranslateY = lerp(0, -32, smoothstep(0.0, 0.22, progress));

  /* =========================================================
     PHASE 1 — DOORWAY GROW
  ========================================================= */

  const revealRaw = smoothstep(0.055, 0.35, progress);
  const reveal = easeOutQuart(revealRaw);

  /*
   * Width of the doorway opening.
   */
  const initialWidth = isMobile ? 10 : 4;
  const compactWidth = isMobile ? 80 : 44;
  const doorwayWidth = lerp(initialWidth, compactWidth, reveal);

  /*
   * Doorway grows from bottom.
   */
  const compactHeight = isMobile ? 76 : 89;
  const doorwayHeight = lerp(0, compactHeight, reveal);

  /* =========================================================
     PHASE 2 — FULLSCREEN EXPANSION
  ========================================================= */

  const expandRaw = smoothstep(0.44, 0.82, progress);
  const expand = easeInOutCubic(expandRaw);

  const finalWidth = lerp(doorwayWidth, 100, expand);
  const finalHeight = lerp(doorwayHeight, 100, expand);

  /* =========================================================
     VINTAGE ARCH SHAPE
  ========================================================= */

  const archTransition = smoothstep(0.46, 0.82, progress);

  const archX = lerp(48, 0, archTransition);
  const archY = lerp(isMobile ? 16 : 19, 0, archTransition);

  /* =========================================================
     SIDE TEXT
  ========================================================= */

  const sideEnter = smoothstep(0.16, 0.32, progress);
  const sideExit = 1 - smoothstep(0.5, 0.7, progress);
  const sideOpacity = sideEnter * sideExit;

  const sideMove = smoothstep(0.48, 0.7, progress);
  const leftX = lerp(0, -110, sideMove);
  const rightX = lerp(0, 110, sideMove);

  /* =========================================================
     SCROLL LABEL
  ========================================================= */

  const scrollHintOpacity =
    smoothstep(0.13, 0.24, progress) *
    (1 - smoothstep(0.46, 0.57, progress));

  /* =========================================================
     FINAL CONTENT
  ========================================================= */

  const finalReveal = smoothstep(0.78, 0.94, progress);
  const finalY = lerp(65, 0, finalReveal);
  const finalScale = lerp(0.94, 1, finalReveal);

  /* =========================================================
     IMAGE CINEMATIC OVERLAY
  ========================================================= */

  const overlayOpacity = smoothstep(0.64, 0.88, progress);

  return (
    <div
      ref={sectionRef}
      id="about"
      className="relative seh-main-wrapper"
      style={{
        backgroundColor,
      }}
    >
      {/* =====================================================
          PINNED VIEWPORT STAGE
      ====================================================== */}
      <div
        ref={stageRef}
        className="seh-sticky-stage"
        style={{
          backgroundColor,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* ===================================================
            BEFORE-REVEAL ARCHITECTURAL INTRO
        ==================================================== */}
        <div
          className="seh-before-content"
          style={{
            opacity: beforeOpacity,
            transform: `translate3d(0, ${beforeTranslateY}px, 0)`,
            pointerEvents: beforeOpacity > 0.1 ? "auto" : "none",
          }}
        >
          <div className="seh-before-inner">
            {beforeBadge && (
              <span className="seh-badge">{beforeBadge}</span>
            )}
            <h2 className="seh-before-title">{beforeTitle}</h2>
            {beforeCta && (
              <p className="seh-before-kicker">{beforeCta}</p>
            )}
            <div className="seh-before-desc-wrap">
              {beforeDesc1 && (
                <p className="seh-before-desc">{beforeDesc1}</p>
              )}
              {beforeDesc2 && (
                <p className="seh-before-desc seh-desc-secondary">{beforeDesc2}</p>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================
            LEFT TEXT
        ==================================================== */}
        <div
          className="seh-side-text-container seh-side-text-left"
          style={{
            opacity: sideOpacity,
            transform: `translate3d(${leftX}px, -50%, 0)`,
          }}
        >
          <p className="seh-side-text">
            {leftWord}
          </p>
        </div>

        {/* ===================================================
            RIGHT TEXT
        ==================================================== */}
        <div
          className="seh-side-text-container seh-side-text-right"
          style={{
            opacity: sideOpacity,
            transform: `translate3d(${rightX}px, -50%, 0)`,
          }}
        >
          <p className="seh-side-text">
            {rightWord}
          </p>
        </div>

        {/* ===================================================
            MOBILE SIDE TEXT
        ==================================================== */}
        <div
          className="seh-mobile-side-text"
          style={{
            opacity: sideOpacity,
          }}
        >
          <span className="seh-mobile-side-word seh-mobile-left">
            {leftWord}
          </span>
          <span className="seh-mobile-side-word seh-mobile-right">
            {rightWord}
          </span>
        </div>

        {/* ===================================================
            VINTAGE HOUSE ENTRANCE MASK
        ==================================================== */}
        <div
          className="absolute bottom-0 left-1/2 z-20 overflow-hidden will-change-[width,height,border-radius] seh-doorway-box"
          style={{
            width: `${finalWidth}vw`,
            height: `${finalHeight}vh`,
            transform: "translateX(-50%)",
            borderTopLeftRadius: `${archX}% ${archY}%`,
            borderTopRightRadius: `${archX}% ${archY}%`,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          {/* =================================================
              FIXED IMAGE
          ================================================== */}
          <img
            src={image}
            alt="Traditional Karaikudi heritage house"
            draggable="false"
            className="pointer-events-none absolute bottom-0 left-1/2 h-[100svh] w-screen max-w-none -translate-x-1/2 select-none object-cover object-center seh-doorway-img"
          />

          {/* =================================================
              CINEMATIC OVERLAYS
          ================================================== */}
          <div
            className="pointer-events-none absolute inset-0 seh-scrim-vertical"
            style={{
              opacity: overlayOpacity,
            }}
          />
        </div>

        {/* ===================================================
            SCROLL TO REVEAL
        ==================================================== */}
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2 seh-scroll-hint"
          style={{
            opacity: scrollHintOpacity,
          }}
        >
          <span className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.4em] seh-scroll-hint-text">
            Scroll to reveal
          </span>
          <ArrowDown />
        </div>

        {/* ===================================================
            FINAL CONTENT (AFTER REVEAL)
        ==================================================== */}
        <div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-6 text-center seh-final-overlay"
          style={{
            opacity: finalReveal,
          }}
        >
          <div
            className="seh-final-content-box"
            style={{
              transform: `translate3d(0, ${finalY}px, 0) scale(${finalScale})`,
              pointerEvents: finalReveal > 0.4 ? "auto" : "none",
            }}
          >
            <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.5em] text-amber-200/90 md:text-[11px] seh-final-eyebrow">
              {finalEyebrow}
            </p>

            <h2 className="text-[7.5vw] font-medium uppercase leading-[0.9] tracking-[-0.03em] text-white drop-shadow-2xl md:text-[4.2vw] seh-final-title">
              {finalTitle}
            </h2>

            <p className="mt-2 font-serif text-[5.5vw] italic leading-tight tracking-normal text-amber-100/95 drop-shadow-xl md:text-[2.6vw] seh-final-accent">
              {finalAccent}
            </p>

            <div className="seh-final-desc-wrap">
              {finalDesc1 && (
                <p className="seh-final-desc">{finalDesc1}</p>
              )}
              {finalDesc2 && (
                <p className="seh-final-desc seh-desc-secondary">{finalDesc2}</p>
              )}
            </div>

            <div className="seh-final-contact-bar">
              {finalContact && (
                <div className="seh-contact-item">
                  <span className="seh-contact-label">Contact:</span>
                  <a href={`tel:${finalContact.replace(/[^0-9+]/g, '')}`} className="seh-contact-value">
                    {finalContact}
                  </a>
                </div>
              )}
              {finalEmail && (
                <div className="seh-contact-item">
                  <span className="seh-contact-label">Email:</span>
                  <a href={`mailto:${finalEmail}`} className="seh-contact-value">
                    {finalEmail}
                  </a>
                </div>
              )}
            </div>

            <div className="seh-final-cta-wrap">
              <a href="#services" className="seh-final-btn">
                <span>Explore Our Approach</span>
                <span className="seh-btn-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
