import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './ZoomParallax.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * ZoomParallax
 * ------------------------------------------------------------------
 * Seamless, GSAP ScrollTrigger-pinned Zoom Parallax for the Projects section:
 * - Displays 4 images: 3 surrounding satellite cards + 1 central main mansion
 * - Center project image (mainIndex) expands progressively to 100vw x 100vh
 * - As zoom nears completion, smoothly crossfades from still image to looping video
 * - Surrounding satellite project cards drift outward and fade away
 * - Fully reversible when scrolling upward or downward
 * - High-performance GPU transforms with zero layout shift or overflow
 */

const DEFAULT_POSITIONS = [
  { top: '12%', left: '4%', width: '26%', height: '40%' },   // Satellite 1 (Top-Left)
  { top: '12%', left: '70%', width: '26%', height: '40%' },  // Satellite 2 (Top-Right)
  { top: '64%', left: '32%', width: '36%', height: '30%' },  // Satellite 3 (Bottom-Center)
  { top: '16%', left: '32%', width: '36%', height: '46%' },  // Main Center Mansion (index 3)
];

export default function ZoomParallax({
  images = [],
  mainIndex = 3,
  videoSrc = null,
  positions = DEFAULT_POSITIONS,
  gap = 8,
  radius = 16,
  scrollDistancePercent = 220, // scroll distance in % of viewport height
  satelliteScale = 1,
  driftAmount = 260, // px drift
  parallaxStrength = 1,
  background = '#FAF7F2',
  align = 'center',
  containerWidthPercent = 94,
  header,
  caption = 'SCROLL TO EXPLORE RESIDENCES',
  captionClassName = '',
}) {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const gridRef = useRef(null);
  const tileRefs = useRef([]);
  const headerRef = useRef(null);
  const captionRef = useRef(null);
  const mainOverlayRef = useRef(null);
  const mainVideoRef = useRef(null);
  const lastProgressRef = useRef(0);

  const slots = images.slice(0, 4).map((img, i) => ({
    ...img,
    pos: positions[i] || DEFAULT_POSITIONS[i] || DEFAULT_POSITIONS[0],
    isMain: i === mainIndex,
  }));

  // Ensure video begins playing seamlessly
  useEffect(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.play().catch(() => { });
    }
  }, []);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const stage = stageRef.current;
      const grid = gridRef.current;
      if (!wrapper || !stage || !grid) return;

      const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
      const lerp = (a, b, t) => a + (b - a) * t;
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const getLayoutConstants = () => {
        const vw = window.innerWidth;
        const actualContainerPct = vw < 768 ? 98 : containerWidthPercent;
        const currentGap = vw < 768 ? Math.max(3, gap / 2) : gap;
        const containerWidth = (vw * actualContainerPct) / 100;
        const containerLeft =
          align === 'left'
            ? 0
            : align === 'right'
              ? vw - containerWidth
              : (vw - containerWidth) / 2;
        return { vw, actualContainerPct, currentGap, containerWidth, containerLeft };
      };

      const applyLayout = () => {
        const { actualContainerPct, currentGap, containerLeft } = getLayoutConstants();
        grid.style.width = `${actualContainerPct}%`;
        grid.style.left = `${containerLeft}px`;
        tileRefs.current.forEach((el) => {
          if (el) el.style.margin = `${currentGap}px`;
        });
      };

      const updateTransforms = (rawProgress) => {
        lastProgressRef.current = rawProgress;
        const { vw, containerWidth, containerLeft, currentGap } = getLayoutConstants();
        const vh = window.innerHeight;

        // Progress breakdown:
        // 0.00 -> 0.08: Initial hold (collage sits still so user reads header)
        // 0.08 -> 0.85: Zoom & Drift animation
        // 0.85 -> 1.00: Fullscreen hold (expanded view holds with video & inquiry CTA)
        const p = clamp((rawProgress - 0.08) / 0.77, 0, 1);
        const t = easeOutCubic(p);

        // Header fade out during early zoom
        if (headerRef.current) {
          const headerOpacity = clamp(1 - p * 3.5, 0, 1);
          headerRef.current.style.opacity = `${headerOpacity}`;
          headerRef.current.style.transform = `translate3d(0, ${-p * 35}px, 0)`;
          headerRef.current.style.pointerEvents = p > 0.2 ? 'none' : 'auto';
        }

        tileRefs.current.forEach((el, i) => {
          if (!el) return;
          const pos = slots[i]?.pos;
          if (!pos) return;

          const pct = (v) => parseFloat(v) / 100;
          const homeLeft = containerLeft + pct(pos.left) * containerWidth + currentGap;
          const homeTop = pct(pos.top) * vh + currentGap;
          const homeWidth = pct(pos.width) * containerWidth - currentGap * 2;
          const homeHeight = pct(pos.height) * vh - currentGap * 2;
          const homeCx = homeLeft + homeWidth / 2;
          const homeCy = homeTop + homeHeight / 2;

          if (slots[i].isMain) {
            const scaleX = vw / Math.max(1, homeWidth);
            const scaleY = vh / Math.max(1, homeHeight);
            const targetCx = vw / 2;
            const targetCy = vh / 2;
            const dx = lerp(0, targetCx - homeCx, t);
            const dy = lerp(0, targetCy - homeCy, t);
            const sx = lerp(1, scaleX, t);
            const sy = lerp(1, scaleY, t);

            el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
            el.style.borderRadius = `${lerp(radius, 0, t).toFixed(1)}px`;
            el.style.zIndex = '10';

            // Smooth video crossfade when central image reaches near full-screen
            if (mainVideoRef.current) {
              const videoOpacity = clamp((p - 0.65) / 0.28, 0, 1);
              mainVideoRef.current.style.opacity = `${videoOpacity.toFixed(3)}`;
            }

            // Expanded editorial overlay fade-in
            if (mainOverlayRef.current) {
              const overlayOpacity = clamp((p - 0.72) / 0.25, 0, 1);
              mainOverlayRef.current.style.opacity = `${overlayOpacity.toFixed(3)}`;
              mainOverlayRef.current.style.transform = `translate3d(0, ${lerp(20, 0, overlayOpacity).toFixed(1)}px, 0)`;
              mainOverlayRef.current.style.pointerEvents = overlayOpacity > 0.6 ? 'auto' : 'none';
            }
          } else {
            const dirX = homeCx - vw / 2;
            const dirY = homeCy - vh / 2;
            const len = Math.hypot(dirX, dirY) || 1;
            const nx = dirX / len;
            const ny = dirY / len;
            const driftT = lerp(0, driftAmount * parallaxStrength, t);
            const fadeT = clamp((t - 0.35) / 0.45, 0, 1);

            el.style.transform = `translate3d(${(nx * driftT).toFixed(2)}px, ${(ny * driftT).toFixed(2)}px, 0) scale(${satelliteScale})`;
            el.style.opacity = `${(1 - fadeT).toFixed(3)}`;
            el.style.borderRadius = `${radius}px`;
            el.style.zIndex = '1';
          }
        });

        if (captionRef.current) {
          const captionOpacity = clamp(1 - Math.abs(p - 0.3) * 3.5, 0, 1);
          captionRef.current.style.opacity = `${captionOpacity.toFixed(3)}`;
        }
      };

      applyLayout();
      updateTransforms(0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${scrollDistancePercent}%`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            updateTransforms(self.progress);
          },
          onRefresh: () => {
            applyLayout();
            updateTransforms(lastProgressRef.current);
          },
        },
      });

      tl.to({}, { duration: 1 });

      const onResize = () => {
        applyLayout();
        updateTransforms(lastProgressRef.current);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    },
    { scope: wrapperRef }
  );

  return (
    <div
      ref={wrapperRef}
      className="zoom-parallax-wrapper relative w-full"
      style={{ background }}
    >
      <div
        ref={stageRef}
        className="zoom-parallax-stage left-0 w-full h-screen overflow-hidden"
        style={{ background }}
      >
        {header && (
          <div ref={headerRef} className="zoom-parallax-header-wrap">
            {header}
          </div>
        )}

        <div ref={gridRef} className="absolute inset-y-0">
          {slots.map((img, i) => {
            const currentVideo = img.videoSrc || (img.isMain ? videoSrc : null);

            return (
              <div
                key={i}
                ref={(el) => (tileRefs.current[i] = el)}
                className={`zoom-parallax-tile absolute overflow-hidden ${img.isMain ? 'is-main-tile' : 'is-satellite-tile'
                  }`}
                style={{
                  top: img.pos.top,
                  left: img.pos.left,
                  width: img.pos.width,
                  height: img.pos.height,
                  transformOrigin: 'center center',
                  willChange: 'transform, opacity',
                }}
              >
                {/* Base Project Image */}
                <img
                  src={img.src}
                  alt={img.alt || img.title || 'Chettinad Architectural Project'}
                  className="h-full w-full object-cover zoom-tile-img"
                  draggable={false}
                  loading={img.isMain ? 'eager' : 'lazy'}
                />

                {/* Looping video layer for main center mansion */}
                {img.isMain && currentVideo && (
                  <video
                    ref={mainVideoRef}
                    src={currentVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="zoom-main-video-layer absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity: 0,
                      pointerEvents: 'none',
                      willChange: 'opacity',
                    }}
                  />
                )}

                {img.title && !img.isMain && (
                  <div className="zoom-tile-badge">
                    <span className="zoom-tile-number">{img.number || `0${i + 1}`}</span>
                    <span className="zoom-tile-title">{img.title}</span>
                  </div>
                )}

                {img.isMain && (
                  <div
                    ref={mainOverlayRef}
                    className="zoom-main-expanded-overlay"
                    style={{ opacity: 0 }}
                  >
                    <div className="zoom-main-content-box">
                      <div className="zoom-main-badge-row">
                        <span className="zoom-main-num">{img.number || '04'}</span>
                        <span className="zoom-main-dot">•</span>
                        <span className="zoom-main-cat">
                          {img.category || 'Grand Estate & Sanctuary'}
                        </span>
                      </div>
                      <h3 className="zoom-main-title">
                        {img.title || 'Chettinad Architectural Mansion'}
                      </h3>
                      <p className="zoom-main-desc">
                        {img.description ||
                          'A majestic synthesis of grand Chettinad colonnades, ancestral lime plaster finishes, Burma teak pillars, and sustainable courtyards engineered for visionary luxury living.'}
                      </p>
                      <div className="zoom-main-footer">
                        <span className="zoom-main-location">
                          {img.location || 'Karaikudi, Tamil Nadu'}
                        </span>
                        <a href="#connect" className="zoom-main-cta">
                          <span>Inquire Residence</span>
                          <span className="zoom-main-arrow" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {caption && (
          <div
            ref={captionRef}
            className={`zoom-parallax-caption pointer-events-none absolute inset-x-0 bottom-8 flex justify-center opacity-0 ${captionClassName}`}
          >
            <span className="zoom-parallax-caption-pill rounded-full px-5 py-2 text-xs tracking-[0.22em] uppercase text-white backdrop-blur">
              {caption}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}