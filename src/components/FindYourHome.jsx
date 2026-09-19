import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import pillarImg from '../../images/pillar.png';
import pillarMobileImg from '../../images/pillar_mobile.png';
import './FindYourHome.css';

gsap.registerPlugin(ScrollTrigger);

// 5 Authentic Chettinad architectural estates
import prop1 from '../../images/image1.png';
import prop2 from '../../images/image3.png';
import prop3 from '../../images/image4.png';
import prop4 from '../../images/image6.png';
import prop5 from '../../images/image9.png';

const PROJECTS_DATA = [
  {
    id: 'project-1',
    num: '01',
    name: 'The Athangudi Palace Villa',
    location: 'Karaikudi, Chettinad',
    image: prop1,
    alt: 'The Athangudi Palace Villa in Karaikudi, Chettinad',
    tag: 'Heritage Manor',
  },
  {
    id: 'project-2',
    num: '02',
    name: 'The Monolith Teak Residence',
    location: 'Devakottai, Tamil Nadu',
    image: prop2,
    alt: 'The Monolith Teak Residence in Devakottai, Tamil Nadu',
    tag: 'Vernacular Estate',
  },
  {
    id: 'project-3',
    num: '03',
    name: 'The Semmann Earth Manor',
    location: 'Kanadukathan, Tamil Nadu',
    image: prop3,
    alt: 'The Semmann Earth Manor in Kanadukathan, Tamil Nadu',
    tag: 'Ancestral Courtyard',
  },
  {
    id: 'project-4',
    num: '04',
    name: 'The Arched Verandah Sanctuary',
    location: 'Pudukkottai, Tamil Nadu',
    image: prop4,
    alt: 'The Arched Verandah Sanctuary in Pudukkottai, Tamil Nadu',
    tag: 'Pavilion Villa',
  },
  {
    id: 'project-5',
    num: '05',
    name: 'The Heritage Lightwell Estate',
    location: 'Alagappapuram, Tamil Nadu',
    image: prop5,
    alt: 'The Heritage Lightwell Estate in Alagappapuram, Tamil Nadu',
    tag: 'Landmark Residence',
  },
];

const DISPLAY_DURATION = 3800; // ms per project in the continuous loop

export default function FindYourHome({ projects = PROJECTS_DATA }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPillarsArrived, setIsPillarsArrived] = useState(false);

  const sectionRef = useRef(null);
  const leftPillarRef = useRef(null);
  const rightPillarRef = useRef(null);
  const showcaseWrapRef = useRef(null);
  const activeCardRef = useRef(null);
  const stickyNoteRef = useRef(null);
  const total = projects.length;

  const activeProject = projects[currentIndex] || projects[0];

  // ==================================================================
  // 1. SCROLL-DRIVEN PINNED PILLAR ARRIVAL & UNVEIL ANIMATION
  // Pinned continuously from Services into FindYourHome:
  // Order: 1. Pillars rise -> 2. Hold in center -> 3. Part to corners (Pillar Arrival complete)
  //        -> 4. StickyNotes animation starts only after pillar arrival completes.
  // ==================================================================
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ==============================================
      // DESKTOP (> 768px)
      // ==============================================
      mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
        const TOGETHER_OFFSET = 120;

        const sectionWidth = sectionRef.current?.offsetWidth || window.innerWidth;
        const pillarWidth =
          leftPillarRef.current?.getBoundingClientRect().width || 180;
        const gutter = 16;
        const halfSection = sectionWidth / 2;
        const halfPillar = pillarWidth / 2;
        const leftOffsetPx = -(halfSection - halfPillar - gutter);
        const rightOffsetPx = halfSection - halfPillar - gutter;

        gsap.set(leftPillarRef.current, {
          xPercent: -50,
          x: -TOGETHER_OFFSET,
          yPercent: 100,
          opacity: 0,
        });
        gsap.set(rightPillarRef.current, {
          xPercent: -50,
          x: TOGETHER_OFFSET,
          yPercent: 100,
          opacity: 0,
        });

        if (showcaseWrapRef.current) {
          gsap.set(showcaseWrapRef.current, { opacity: 0.15, scale: 0.96 });
        }

        if (stickyNoteRef.current) {
          gsap.set(stickyNoteRef.current, {
            opacity: 0,
            scale: 0.8,
            y: 25,
            rotation: 0,
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=140%',
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress >= 0.95) {
                setIsPillarsArrived(true);
              }
            },
            onLeave: () => {
              setIsPillarsArrived(true);
            },
          },
        });

        tl.to(
          [leftPillarRef.current, rightPillarRef.current],
          { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        )
          .to({}, { duration: 0.15 })
          .to(
            leftPillarRef.current,
            { x: leftOffsetPx, duration: 0.5, ease: 'power3.inOut' },
            '>'
          )
          .to(
            rightPillarRef.current,
            { x: rightOffsetPx, duration: 0.5, ease: 'power3.inOut' },
            '<'
          )
          .to(
            showcaseWrapRef.current,
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
            '<'
          )
          .fromTo(
            stickyNoteRef.current,
            { opacity: 0, scale: 0.8, y: 25, rotation: 0 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              rotation: 4.2,
              duration: 0.35,
              ease: 'back.out(1.5)',
            },
            '>'
          );
      });

      // ==============================================
      // MOBILE (<= 768px) — fixed pillar positioning
      // Uses pure pixel values computed from the
      // section's actual width and the pillar's rendered
      // width so GSAP never has to parse calc() strings.
      // ==============================================
      mm.add('(max-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const TOGETHER_OFFSET = 50;

        // Compute the exact pixel distance from center to the
        // left/right edges. The pillars start centered (CSS left: 50%
        // + GSAP xPercent: -50), so moving x by ±halfSection positions
        // the pillar center at the viewport edge. We pull back by
        // half the pillar width so the outer edge is flush with the
        // section edge (plus a small gutter).
        const sectionWidth = sectionRef.current?.offsetWidth || window.innerWidth;
        const sectionHeight = sectionRef.current?.offsetHeight || window.innerHeight;
        const measuredWidth = leftPillarRef.current?.getBoundingClientRect().width;
        const pillarWidth =
          (measuredWidth && measuredWidth > 20) ? measuredWidth : (sectionHeight * 0.170713);
        const gutter = 4; // px breathing room
        const halfSection = sectionWidth / 2;
        const halfPillar = pillarWidth / 2;
        // Move pillar center to: gutter + halfPillar from edge
        // = -(halfSection - halfPillar - gutter) from current center
        const leftOffsetPx = -(halfSection - halfPillar - gutter);
        const rightOffsetPx = halfSection - halfPillar - gutter;

        gsap.set(leftPillarRef.current, {
          xPercent: -50,
          x: -TOGETHER_OFFSET,
          yPercent: 100,
          opacity: 0,
        });
        gsap.set(rightPillarRef.current, {
          xPercent: -50,
          x: TOGETHER_OFFSET,
          yPercent: 100,
          opacity: 0,
        });

        if (showcaseWrapRef.current) {
          gsap.set(showcaseWrapRef.current, { opacity: 0.15, scale: 0.96 });
        }

        if (stickyNoteRef.current) {
          gsap.set(stickyNoteRef.current, {
            opacity: 0,
            scale: 0.8,
            y: 25,
            rotation: 0,
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=140%',
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            ignoreMobileResize: true,
            onUpdate: (self) => {
              if (self.progress >= 0.95) {
                setIsPillarsArrived(true);
              }
            },
            onLeave: () => {
              setIsPillarsArrived(true);
            },
          },
        });

        // 1. Pillars rise from bottom center together (0 -> 0.4)
        tl.to(
          [leftPillarRef.current, rightPillarRef.current],
          { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        )
          // 2. Brief center hold once risen (0.4 -> 0.55)
          .to({}, { duration: 0.15 })
          // 3. Move outward to left/right edges (0.55 -> 1.05)
          .to(
            leftPillarRef.current,
            { x: leftOffsetPx, duration: 0.5, ease: 'power3.inOut' },
            '>'
          )
          .to(
            rightPillarRef.current,
            { x: rightOffsetPx, duration: 0.5, ease: 'power3.inOut' },
            '<'
          )
          .to(
            showcaseWrapRef.current,
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
            '<'
          )
          // 4. Sticky note appears after pillars arrive
          .fromTo(
            stickyNoteRef.current,
            { opacity: 0, scale: 0.8, y: 25, rotation: 0 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              rotation: 1.5,
              duration: 0.35,
              ease: 'back.out(1.5)',
            },
            '>'
          );
      });

      // Reduced motion: skip pinned scrub, pillars at final resting position
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const isMobile = window.innerWidth <= 768;

        let leftX, rightX;
        const sectionWidth = sectionRef.current?.offsetWidth || window.innerWidth;
        const sectionHeight = sectionRef.current?.offsetHeight || window.innerHeight;
        const measuredWidth = leftPillarRef.current?.getBoundingClientRect().width;
        const pillarWidth =
          (measuredWidth && measuredWidth > 20) ? measuredWidth : (isMobile ? sectionHeight * 0.170713 : 180);
        const gutter = isMobile ? 4 : 16;
        leftX = -(sectionWidth / 2 - pillarWidth / 2 - gutter);
        rightX = sectionWidth / 2 - pillarWidth / 2 - gutter;

        setIsPillarsArrived(true);
        gsap.set(leftPillarRef.current, { xPercent: -50, x: leftX, yPercent: 0, opacity: 1 });
        gsap.set(rightPillarRef.current, { xPercent: -50, x: rightX, yPercent: 0, opacity: 1 });
        if (showcaseWrapRef.current) {
          gsap.set(showcaseWrapRef.current, { opacity: 1, scale: 1 });
        }
        if (stickyNoteRef.current) {
          gsap.set(stickyNoteRef.current, { opacity: 1, scale: 1, y: 0, rotation: isMobile ? 1.5 : 4.2 });
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // ==================================================================
  // 2. PROJECT CONTINUOUS SLIDESHOW LOOP
  // ==================================================================
  const transitionTo = useCallback(
    (targetIndex, direction = 'next') => {
      if (isAnimating) return;
      setIsAnimating(true);

      const card = activeCardRef.current;
      if (!card) {
        setCurrentIndex(targetIndex);
        setIsAnimating(false);
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        gsap.to(card, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            setCurrentIndex(targetIndex);
            gsap.fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            setIsAnimating(false);
          },
        });
        return;
      }

      const exitX = direction === 'next' ? -80 : 80;
      const exitRot = direction === 'next' ? -8 : 8;

      // Project flies out smoothly
      gsap.to(card, {
        xPercent: exitX,
        yPercent: -20,
        rotation: exitRot,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentIndex(targetIndex);

          const enterX = direction === 'next' ? 70 : -70;
          const enterRot = direction === 'next' ? 6 : -6;

          gsap.fromTo(
            card,
            {
              xPercent: enterX,
              yPercent: 15,
              rotation: enterRot,
              opacity: 0,
              scale: 0.92,
            },
            {
              xPercent: 0,
              yPercent: 0,
              rotation: -0.8,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: 'power3.out',
              onComplete: () => {
                setIsAnimating(false);
              },
            }
          );
        },
      });
    },
    [isAnimating]
  );

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % total;
    transitionTo(nextIdx, 'next');
  }, [currentIndex, total, transitionTo]);

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + total) % total;
    transitionTo(prevIdx, 'prev');
  }, [currentIndex, total, transitionTo]);

  const handleSelect = (idx) => {
    if (idx === currentIndex || isAnimating) return;
    const dir = idx > currentIndex ? 'next' : 'prev';
    transitionTo(idx, dir);
  };

  // Continuous loop - only starts once pillars have arrived into position
  useEffect(() => {
    if (!isPillarsArrived) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, DISPLAY_DURATION);

    return () => clearInterval(interval);
  }, [isPillarsArrived, handleNext, isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Mobile Touch Swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) handleNext();
    else if (diff < -45) handlePrev();
  };

  return (
    <section
      ref={sectionRef}
      id="find-your-home"
      aria-label="Find Your Home - Chettinad Architectural Projects"
      className="fyh-flying-notes-section"
    >
      {/* =========================================================
          MAJESTIC VINTAGE PILLARS (Pinned Arrival: Center Rise -> Part to Corners)
          Height matches full section height, extending top to bottom
         ========================================================= */}
      <div
        ref={leftPillarRef}
        className="fyh-pillar-element fyh-pillar-left pillar pillar--left"
        aria-hidden="true"
      >
        <picture>
          <source media="(max-width: 768px)" srcSet={pillarMobileImg} />
          <img
            src={pillarImg}
            alt=""
            className="fyh-pillar-photo pillar-image"
            draggable="false"
          />
        </picture>
      </div>

      <div
        ref={rightPillarRef}
        className="fyh-pillar-element fyh-pillar-right pillar pillar--right"
        aria-hidden="true"
      >
        <picture>
          <source media="(max-width: 768px)" srcSet={pillarMobileImg} />
          <img
            src={pillarImg}
            alt=""
            className="fyh-pillar-photo fyh-pillar-photo--mirrored pillar-image pillar-image--mirrored"
            draggable="false"
          />
        </picture>
      </div>

      <div ref={showcaseWrapRef} className="fyh-flying-container">
        {/* =========================================================
            1. MINIMAL EDITORIAL HEADER
           ========================================================= */}
        <header className="fyh-flying-header">
          <div className="fyh-header-left">
            <span className="fyh-badge-tag">Selected Works</span>
            <h2 className="fyh-header-headline">Build Your Home</h2>
          </div>
        </header>

        {/* =========================================================
            2. MAIN SCRAPBOOK SHOWCASE STAGE
           ========================================================= */}
        <div
          className="fyh-stage-viewport"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Subtle Background Layer Notes (Depth Collage) */}
          <div className="fyh-bg-paper-layer layer-left" aria-hidden="true" />
          <div className="fyh-bg-paper-layer layer-right" aria-hidden="true" />

          {/* SINGLE ANIMATED PROJECT BUNDLE */}
          <div ref={activeCardRef} className="fyh-project-bundle">
            {/* 1. Main Archival Photograph Frame */}
            <div className="fyh-photo-card">
              <div className="fyh-photo-wrapper">
                <img
                  src={activeProject.image}
                  alt={activeProject.alt}
                  className="fyh-photo-element"
                />
              </div>
            </div>

            {/* 2. Sticky Note Positioned at Outer Corner (Does NOT Cover Image) */}
            <div ref={stickyNoteRef} className="fyh-sticky-note">
              <div className="fyh-sticky-pin" aria-hidden="true" />
              <div className="fyh-sticky-content">
                <span className="fyh-sticky-tag">PROJECT {activeProject.num}</span>
                <h3 className="fyh-sticky-name">{activeProject.name}</h3>
                <p className="fyh-sticky-location">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="fyh-sticky-pin-icon"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {activeProject.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            3. MINIMAL SCRAPBOOK NAVIGATION CONTROLS
           ========================================================= */}
        <div className="fyh-bottom-nav">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isAnimating}
            className="fyh-circle-btn fyh-btn-prev"
            aria-label="Previous project"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="fyh-pagination-dots" aria-hidden="true">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`fyh-dot ${idx === currentIndex ? 'is-active' : ''}`}
                aria-label={`Go to project ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={isAnimating}
            className="fyh-circle-btn fyh-btn-next"
            aria-label="Next project"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
