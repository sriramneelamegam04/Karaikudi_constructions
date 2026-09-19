import React, { useState, useEffect, useRef, useId } from 'react';
import './Preloader.css';

// Critical brand and hero assets to preload
import logo from '../../images/logo.png';
import hero1 from '../../images/hero1.png';
import hero2 from '../../images/hero2.png';
import hero3 from '../../images/hero3.png';

const CRITICAL_ASSETS = [logo, hero1, hero2, hero3];

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'fading' | 'splitting' | 'done'
  const circleId = useId();
  const progressTargetRef = useRef(0);
  const hasFinishedRef = useRef(false);

  // Lock body scroll while preloader is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow || '';
      document.body.style.position = originalPosition || '';
      document.body.style.width = originalWidth || '';
    };
  }, []);

  // Preload critical assets & update target progress
  useEffect(() => {
    let loadedCount = 0;
    const total = CRITICAL_ASSETS.length;

    // Check prefers-reduced-motion
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setPhase('done');
      if (onComplete) onComplete();
      return;
    }

    const onAssetLoaded = () => {
      loadedCount++;
      progressTargetRef.current = Math.min(100, Math.round((loadedCount / total) * 100));
    };

    CRITICAL_ASSETS.forEach((src) => {
      const img = new Image();
      img.onload = onAssetLoaded;
      img.onerror = onAssetLoaded; // Proceed even if an asset errors
      img.src = src;
    });

    // Safety fallback: Ensure progress reaches 100% within 1.8s max even on slow networks
    const fallbackTimer = setTimeout(() => {
      progressTargetRef.current = 100;
    }, 1200);

    return () => clearTimeout(fallbackTimer);
  }, [onComplete]);

  // Smooth counter interpolation loop
  useEffect(() => {
    let animId;

    const updateCounter = () => {
      setProgress((prev) => {
        const target = progressTargetRef.current;
        if (prev < target) {
          const step = Math.max(1, Math.ceil((target - prev) * 0.12));
          const next = Math.min(target, prev + step);
          return next;
        }
        return prev;
      });

      animId = requestAnimationFrame(updateCounter);
    };

    animId = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(animId);
  }, []);

  // Trigger phase progression once progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && !hasFinishedRef.current) {
      hasFinishedRef.current = true;

      // 1. Fade out the center content
      const fadeTimer = setTimeout(() => {
        setPhase('fading');
      }, 200);

      // 2. Split open the top and bottom shutters
      const splitTimer = setTimeout(() => {
        setPhase('splitting');
      }, 450);

      // 3. Mark completed and remove preloader
      const completeTimer = setTimeout(() => {
        setPhase('done');
        // Restore document scroll
        document.body.style.overflow = '';
        if (onComplete) onComplete();
      }, 1450); // 450ms + 950ms shutter transition + 50ms buffer

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(splitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, onComplete]);

  if (phase === 'done') {
    return null;
  }

  const isFading = phase === 'fading' || phase === 'splitting';
  const isSplitting = phase === 'splitting';

  const formattedProgress = String(progress).padStart(2, '0');

  return (
    <div
      className={`preloader-root ${isSplitting ? 'is-splitting' : ''}`}
      aria-label="Loading Karaikudi Chettinad Architecture"
      role="status"
      aria-live="polite"
    >
      {/* TOP SHUTTER (Moves Up) */}
      <div className="preloader-shutter preloader-shutter-top" />

      {/* BOTTOM SHUTTER (Moves Down) */}
      <div className="preloader-shutter preloader-shutter-bottom" />

      {/* CENTER BRAND STAGE & PROGRESS */}
      <div className={`preloader-content ${isFading ? 'is-fading' : ''}`}>
        {/* Animated Circular Logo Badge */}
        <div className="preloader-logo-wrapper">
          <svg
            viewBox="0 0 120 120"
            className="preloader-circular-text-svg"
            aria-hidden="true"
          >
            <defs>
              <path
                id={circleId}
                d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0"
              />
            </defs>
            <text className="preloader-circular-text">
              <textPath href={`#${circleId}`} startOffset="0%">
                KARAIKUDI • HERITAGE • ARCHITECTURE •
              </textPath>
            </text>
          </svg>

          <div className="preloader-logo-center">
            <img
              src={logo}
              alt="Karaikudi Construction"
              className="preloader-logo-img"
            />
          </div>
        </div>

        {/* Editorial Subtitle */}
        <div className="preloader-tagline">Crafted for Generations</div>

        {/* Progress Bar Runner */}
        <div className="preloader-bar-track">
          <div
            className="preloader-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Minimal Progress Readout */}
        <div className="preloader-counter">
          {formattedProgress} <span>—</span> 100
        </div>
      </div>
    </div>
  );
}
