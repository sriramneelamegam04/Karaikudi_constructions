import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ModernVsTraditional.css';

// Authentic architectural comparison images from building_architecture/images
import imgModern1 from '../../images/modern1.png';
import imgTrad1 from '../../images/trad1.png';
import imgModern2 from '../../images/modern2.png';
import imgTrad2 from '../../images/trad2.jpg';
import imgModern3 from '../../images/modern3.png';
import imgTrad3 from '../../images/trad3.png';
import imgModern4 from '../../images/modern4.png';
import imgTrad4 from '../../images/trad4.png';

const DIFFERENCES = [
  {
    id: '01',
    number: '01',
    tabTitle: 'Flooring & Comfort',
    category: '01 — Flooring & Thermal Comfort',
    modern: {
      label: 'Modern Architecture',
      title: 'Polished Stone & Tile Finishes',
      description:
        'Marble / granite / vitrified flooring and contemporary finishes.',
      image: imgModern1,
      alt: 'Contemporary polished floor finishes and modern architectural interior',
    },
    traditional: {
      label: 'Traditional Chettinad',
      title: 'Handcrafted Athangudi Assemblies',
      description:
        'Handcrafted Athangudi tiles and traditional floor assemblies associated with cooler underfoot comfort in warm climates.',
      image: imgTrad1,
      alt: 'Handcrafted Athangudi heritage tiles with geometric motifs',
    },
  },

  {
    id: '02',
    number: '02',
    tabTitle: 'Climate & Cooling',
    category: '02 — Climate & Cooling',
    modern: {
      label: 'Modern Architecture',
      title: 'Mechanical Climate Control',
      description:
        'Contemporary homes may rely more on mechanical cooling when passive design is limited.',
      image: imgModern2,
      alt: 'Sealed modern architecture relying on mechanical cooling systems',
    },
    traditional: {
      label: 'Traditional Chettinad',
      title: 'Passive Courtyards & Lime Plaster',
      description:
        'Lime plaster, courtyards, shaded verandahs, thick walls, high ceilings and cross-ventilation support passive thermal comfort.',
      image: imgTrad2,
      alt: 'Traditional Chettinad courtyard with shaded verandahs and high ceilings',
    },
  },

  {
    id: '03',
    number: '03',
    tabTitle: 'Materials & Environment',
    category: '03 — Materials & Environment',
    modern: {
      label: 'Modern Architecture',
      title: 'Cement & Industrial Inputs',
      description:
        'Cement-intensive and industrial construction can involve significant embodied energy and environmental impacts.',
      image: imgModern3,
      alt: 'Industrial concrete and steel modern architectural construction',
    },
    traditional: {
      label: 'Traditional Chettinad',
      title: 'Lime-Based & Indigenous Earth',
      description:
        'Lime-based construction and locally sourced materials can reduce dependence on some high-impact industrial materials while preserving regional craftsmanship.',
      image: imgTrad3,
      alt: 'Traditional lime plaster and locally sourced stone architectural masonry',
    },
  },

  {
    id: '04',
    number: '04',
    tabTitle: 'Craft & Character',
    category: '04 — Craft & Long-Term Character',
    modern: {
      label: 'Modern Architecture',
      title: 'Standardized Factory Finishes',
      description:
        'Standardized and machine-produced finishes provide consistency and speed.',
      image: imgModern4,
      alt: 'Standardized machine-produced contemporary architectural finishes',
    },
    traditional: {
      label: 'Traditional Chettinad',
      title: 'Artisan Woodwork & Detailing',
      description:
        'Handcrafted woodwork, Athangudi tiles, lime plaster and traditional detailing create unique character and preserve local craftsmanship.',
      image: imgTrad4,
      alt: 'Ornate hand-carved Chettinad teak woodwork and pillar craftsmanship',
    },
  },
];

const CYCLE_DURATION_MS = 5000; // Exactly 5 seconds per comparison

export default function ModernVsTraditional() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100% within 5 seconds
  const [revealPos, setRevealPos] = useState(0); // Exact left edge (0%) at start
  const [isVisible, setIsVisible] = useState(true);

  const sectionRef = useRef(null);
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Preload all comparison images into memory to avoid flashing
  useEffect(() => {
    DIFFERENCES.forEach((item) => {
      const imgM = new Image();
      imgM.src = item.modern.image;
      const imgT = new Image();
      imgT.src = item.traditional.image;
    });
  }, []);

  // Pause progression when section is scrolled out of viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Automatic 5-second cycle starting from complete left edge (0%) -> stopping at exact center (50%)
  const runCycle = useCallback((timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progressRatio = Math.min(1, elapsed / CYCLE_DURATION_MS);
    setProgress(progressRatio * 100);

    // Exact reveal:
    // 1. Starts at complete left edge (0%)
    // 2. Moves smoothly from 0% -> 50%
    // 3. Stops and holds at EXACTLY 50% (equal 50/50 Modern vs Traditional split)
    let currentReveal = 0;
    if (elapsed <= 350) {
      currentReveal = 0;
    } else if (elapsed > 350 && elapsed < 3200) {
      const revealProgress = (elapsed - 350) / 2850; // 0 to 1
      // Smooth cubic ease out to exact 50%
      const ease = 1 - Math.pow(1 - revealProgress, 3);
      currentReveal = ease * 50;
    } else {
      currentReveal = 50; // Strictly stops at 50%
    }
    setRevealPos(currentReveal);

    if (elapsed >= CYCLE_DURATION_MS) {
      // 5 seconds completed -> advance to next difference and reset to 0%
      setCurrentIdx((prev) => (prev + 1) % DIFFERENCES.length);
      startTimeRef.current = timestamp;
      setRevealPos(0);
      setProgress(0);
    }

    if (isVisible) {
      animationFrameRef.current = requestAnimationFrame(runCycle);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      startTimeRef.current = null;
      animationFrameRef.current = requestAnimationFrame(runCycle);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, currentIdx, runCycle]);

  const handleTabClick = (index) => {
    if (index === currentIdx) return;
    setCurrentIdx(index);
    setRevealPos(0);
    setProgress(0);
    startTimeRef.current = null;
  };

  const currentDiff = DIFFERENCES[currentIdx];

  return (
    <section
      className="mvt-section"
      ref={sectionRef}
      id="modern-vs-traditional"
      aria-label="Modern vs Traditional Architecture Comparison"
    >
      <div className="mvt-bg-gradient" aria-hidden="true" />

      <div className="mvt-container">
        {/* ===================================================
            1. SECTION EDITORIAL HEADER
            =================================================== */}
        <div className="mvt-header">
          <div className="mvt-badge-wrap">
            <span className="mvt-badge">The Difference</span>
          </div>
          <h2 className="mvt-title">
            Modern Convenience. <br />
            <em>Traditional Intelligence.</em>
          </h2>
          <p className="mvt-subtitle">
            Four choices that reveal the difference between contemporary
            construction and traditional Chettinad wisdom.
          </p>
        </div>

        {/* ===================================================
            2. AUTOMATIC REVEAL COMPARISON STAGE
            =================================================== */}
        <div className="mvt-reveal-stage">
          <div
            className="mvt-reveal-frame"
            aria-label={`Comparison: ${currentDiff.category}`}
          >
            {/* -------------------------------------------------
                LAYER 1: MODERN ARCHITECTURE (BASE LAYER)
                ------------------------------------------------- */}
            <div className="mvt-layer-base">
              <img
                key={`modern-${currentDiff.id}`}
                src={currentDiff.modern.image}
                alt={currentDiff.modern.alt}
                className="mvt-img"
              />
              <div className="mvt-img-overlay" aria-hidden="true" />

              {/* Corner Tag */}
              <span className="mvt-corner-label mvt-corner-modern">
                Modern Architecture
              </span>

              {/* Floating Modern Information Panel (Bottom Left) */}
              <div className="mvt-info-panel mvt-panel-modern">
                <span className="mvt-panel-category">
                  {currentDiff.category}
                </span>
                <h3 className="mvt-panel-title">{currentDiff.modern.title}</h3>
                <p className="mvt-panel-desc">
                  {currentDiff.modern.description}
                </p>
              </div>
            </div>

            {/* -------------------------------------------------
                LAYER 2: TRADITIONAL CHETTINAD (CLIPPED OVERLAY)
                ------------------------------------------------- */}
            <div
              className="mvt-layer-reveal"
              style={{
                clipPath: `polygon(${revealPos}% 0, 100% 0, 100% 100%, ${revealPos}% 100%)`,
                WebkitClipPath: `polygon(${revealPos}% 0, 100% 0, 100% 100%, ${revealPos}% 100%)`,
              }}
            >
              <img
                key={`trad-${currentDiff.id}`}
                src={currentDiff.traditional.image}
                alt={currentDiff.traditional.alt}
                className="mvt-img"
              />
              <div className="mvt-img-overlay" aria-hidden="true" />

              {/* Corner Tag */}
              <span className="mvt-corner-label mvt-corner-traditional">
                Traditional Chettinad
              </span>

              {/* Floating Traditional Information Panel (Bottom Right) */}
              <div className="mvt-info-panel mvt-panel-traditional">
                <span className="mvt-panel-category">
                  {currentDiff.category}
                </span>
                <h3 className="mvt-panel-title">
                  {currentDiff.traditional.title}
                </h3>
                <p className="mvt-panel-desc">
                  {currentDiff.traditional.description}
                </p>
              </div>
            </div>

            {/* -------------------------------------------------
                LAYER 3: AUTOMATIC MOVING DIVIDER & KNOB
                ------------------------------------------------- */}
            <div
              className="mvt-divider-wrap"
              style={{ left: `${revealPos}%` }}
              aria-hidden="true"
            >
              <div className="mvt-divider-line" />
              <div className="mvt-drag-knob">
                <div className="mvt-knob-arrows">
                  <svg
                    width="8"
                    height="10"
                    viewBox="0 0 9 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="7 2 2 6 7 10" />
                  </svg>
                  <span className="mvt-knob-divider" />
                  <svg
                    width="8"
                    height="10"
                    viewBox="0 0 9 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="2 2 7 6 2 10" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            3. STEP TABS WITH 5-SECOND PROGRESS BARS
            =================================================== */}
        <div
          className="mvt-tabs-container"
          role="tablist"
          aria-label="4 Key Architectural Differences"
        >
          {DIFFERENCES.map((diff, idx) => {
            const isActive = idx === currentIdx;
            return (
              <button
                key={diff.id}
                type="button"
                className={`mvt-step-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => handleTabClick(idx)}
                role="tab"
                aria-selected={isActive}
                aria-label={`View difference ${diff.number}: ${diff.tabTitle}`}
              >
                {/* 5-Second Active Progress Bar */}
                <div className="mvt-tab-progress-track" aria-hidden="true">
                  <div
                    className="mvt-tab-progress-bar"
                    style={{
                      width: isActive ? `${progress}%` : '0%',
                    }}
                  />
                </div>

                <div className="mvt-tab-meta">
                  <span className="mvt-tab-number">{diff.number}</span>
                  <span className="mvt-tab-status">
                    {isActive ? 'Active (5s)' : 'View'}
                  </span>
                </div>

                <h3 className="mvt-tab-title">{diff.tabTitle}</h3>
                <p className="mvt-tab-summary">
                  {diff.traditional.description.slice(0, 75)}...
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
