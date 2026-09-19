import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import StatsSection from './StatsSection';

// Local architectural images from building_architecture/images
import imgCour1 from '../../images/image4.png';
import imgCour2 from '../../images/image6.png';
import imgCour3 from '../../images/image7.png';
import imgCour4 from '../../images/image8.png';
import imgCour5 from '../../images/image9.png';

gsap.registerPlugin(ScrollTrigger);

export default function ImageShowcaseSection() {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);

  // Gallery card refs
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const centerCardRef = useRef(null);
  const centerImgRef = useRef(null);
  const card4Ref = useRef(null);
  const card5Ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP (> 1024px)
      // ==========================================
      mm.add('(min-width: 1025px)', () => {
        // Pinned scroll timeline: reveals the middle 5th image from the center into its full-view display
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: '+=140%',
            pin: stageRef.current,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // 1. Initial hold on the clean 4-card gallery
        tl.to({}, { duration: 0.12 });

        // 2. Side cards smoothly glide outward and fade as the center full hero expands
        tl.to(
          card1Ref.current,
          {
            x: -440,
            opacity: 0,
            scale: 0.72,
            ease: 'power1.inOut',
            duration: 0.88,
          },
          0.12
        )
          .to(
            card2Ref.current,
            {
              x: -280,
              opacity: 0,
              scale: 0.8,
              ease: 'power1.inOut',
              duration: 0.88,
            },
            0.12
          )
          .to(
            card4Ref.current,
            {
              x: 280,
              opacity: 0,
              scale: 0.8,
              ease: 'power1.inOut',
              duration: 0.88,
            },
            0.12
          )
          .to(
            card5Ref.current,
            {
              x: 440,
              opacity: 0,
              scale: 0.72,
              ease: 'power1.inOut',
              duration: 0.88,
            },
            0.12
          );

        // 3. Middle Card: reveals from the center and expands to its full original wide-screen size
        tl.fromTo(
          centerCardRef.current,
          {
            width: 0,
            height: '360px',
            opacity: 0,
            scale: 0.9,
            marginRight: 'calc(-1 * var(--showcase-gap, 1.4vw))',
            boxShadow: '0 0 0 rgba(40, 18, 25, 0)',
          },
          {
            width: 'min(90vw, 1380px)',
            height: '460px',
            borderRadius: '18px',
            opacity: 1,
            scale: 1,
            marginRight: '0px',
            boxShadow: '0 28px 65px -10px rgba(40, 18, 25, 0.22)',
            ease: 'power2.inOut',
            duration: 0.88,
          },
          0.12
        );

        // Center image gentle focus zoom
        tl.fromTo(
          centerImgRef.current,
          { scale: 1.08 },
          { scale: 1, ease: 'power2.inOut', duration: 0.88 },
          0.12
        );
      });

      // ==========================================
      // TABLET (769px - 1024px)
      // ==========================================
      mm.add('(min-width: 769px) and (max-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: '+=125%',
            pin: stageRef.current,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        tl.to({}, { duration: 0.12 });

        tl.to(
          card1Ref.current,
          { x: -300, opacity: 0, scale: 0.75, ease: 'power1.inOut', duration: 0.88 },
          0.12
        )
          .to(
            card2Ref.current,
            { x: -180, opacity: 0, scale: 0.82, ease: 'power1.inOut', duration: 0.88 },
            0.12
          )
          .to(
            card4Ref.current,
            { x: 180, opacity: 0, scale: 0.82, ease: 'power1.inOut', duration: 0.88 },
            0.12
          )
          .to(
            card5Ref.current,
            { x: 300, opacity: 0, scale: 0.75, ease: 'power1.inOut', duration: 0.88 },
            0.12
          );

        tl.fromTo(
          centerCardRef.current,
          {
            width: 0,
            height: '300px',
            opacity: 0,
            scale: 0.9,
            marginRight: 'calc(-1 * var(--showcase-gap, 1.2vw))',
            boxShadow: '0 0 0 rgba(40, 18, 25, 0)',
          },
          {
            width: '92vw',
            height: '410px',
            borderRadius: '16px',
            opacity: 1,
            scale: 1,
            marginRight: '0px',
            boxShadow: '0 24px 55px -10px rgba(40, 18, 25, 0.2)',
            ease: 'power2.inOut',
            duration: 0.88,
          },
          0.12
        );

        tl.fromTo(
          centerImgRef.current,
          { scale: 1.08 },
          { scale: 1, ease: 'power2.inOut', duration: 0.88 },
          0.12
        );
      });

      // ==========================================
      // MOBILE (<= 768px)
      // ==========================================
      mm.add('(max-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: '+=100%',
            pin: stageRef.current,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        tl.to({}, { duration: 0.12 });

        tl.to(
          [card1Ref.current, card2Ref.current],
          { x: -180, opacity: 0, ease: 'power1.inOut', duration: 0.88 },
          0.12
        ).to(
          [card4Ref.current, card5Ref.current],
          { x: 180, opacity: 0, ease: 'power1.inOut', duration: 0.88 },
          0.12
        );

        tl.fromTo(
          centerCardRef.current,
          {
            width: 0,
            height: '240px',
            opacity: 0,
            scale: 0.9,
            marginRight: 'calc(-1 * var(--showcase-gap, 0.65rem))',
            boxShadow: '0 0 0 rgba(40, 18, 25, 0)',
          },
          {
            width: '92vw',
            height: '380px',
            borderRadius: '14px',
            opacity: 1,
            scale: 1,
            marginRight: '0px',
            boxShadow: '0 20px 45px -8px rgba(40, 18, 25, 0.18)',
            ease: 'power2.inOut',
            duration: 0.88,
          },
          0.12
        );

        tl.fromTo(
          centerImgRef.current,
          { scale: 1.08 },
          { scale: 1, ease: 'power2.inOut', duration: 0.88 },
          0.12
        );
      });

      return () => {
        mm.revert();
      };
    },
    { scope: wrapperRef }
  );

  return (
    <div className="showcase-scroll-wrapper" ref={wrapperRef} id="showcase">
      <section className="showcase-pinned-stage" ref={stageRef}>
        {/* 5-IMAGE HORIZONTAL CARDS GALLERY - VISIBLE INITIALLY */}
        <div className="showcase-gallery-container">
          <div className="showcase-cards-track">
            {/* Card 1: Small Left */}
            <div
              className="showcase-card card-small card-left-outer"
              ref={card1Ref}
            >
              <img
                src={imgCour1}
                alt="Modern Villa Sunset"
                loading="eager"
              />
            </div>

            {/* Card 2: Medium Left */}
            <div
              className="showcase-card card-medium card-left-inner"
              ref={card2Ref}
            >
              <img
                src={imgCour2}
                alt="Contemporary Residence Pool"
                loading="eager"
              />
            </div>

            {/* Card 3: LARGE CENTER FOCUS CARD */}
            <div
              className="showcase-card card-center"
              ref={centerCardRef}
              style={{ width: 0, opacity: 0, overflow: 'hidden' }}
            >
              <img
                src={imgCour3}
                alt="Modern Architectural Residence"
                ref={centerImgRef}
                className="center-focus-img"
                loading="eager"
              />
            </div>

            {/* Card 4: Medium Right */}
            <div
              className="showcase-card card-medium card-right-inner"
              ref={card4Ref}
            >
              <img
                src={imgCour4}
                alt="Minimalist Glass Residence"
                loading="eager"
              />
            </div>

            {/* Card 5: Small Right */}
            <div
              className="showcase-card card-small card-right-outer"
              ref={card5Ref}
            >
              <img
                src={imgCour5}
                alt="Luxury Pool House"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* FRAMER-INSPIRED EDITORIAL STATS COMPONENT */}
        <StatsSection />
      </section>
    </div>
  );
}
