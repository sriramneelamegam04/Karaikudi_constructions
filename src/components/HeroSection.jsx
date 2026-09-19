import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import img1 from '../../images/hero1.png';
import img2 from '../../images/hero2.png';
import img3 from '../../images/hero3.png';
import Segmented3DCube from './Segmented3DCube';

const ARCHITECTURAL_IMAGES = [img1, img2, img3];

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection({ headerRef }) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const mediaWrapperRef = useRef(null);
  const vignetteRef = useRef(null);
  const topScrimRef = useRef(null);
  const stage1ContentRef = useRef(null);
  const stage1HeadlineRef = useRef(null);
  const stage1CardRef = useRef(null);
  const stage1ScrollRef = useRef(null);
  const stage2ContentRef = useRef(null);
  const stage2TopRef = useRef(null);
  const stage2BottomRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop & Large Screens (> 1024px)
      mm.add('(min-width: 1025px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            pin: stageRef.current,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // 1. Stage 1 Content fades out & translates slightly upward
        tl.to(
          stage1ContentRef.current,
          {
            opacity: 0,
            y: -40,
            duration: 0.35,
            ease: 'power1.out',
          },
          0
        );

        // 2. Stage background shifts from dark black to warm ivory/cream
        tl.to(
          stageRef.current,
          {
            backgroundColor: '#f5f0e6',
            duration: 0.7,
            ease: 'power1.inOut',
          },
          0.1
        );

        // 3. Header colors adapt to cream background (white -> deep burgundy)
        if (headerRef?.current) {
          tl.to(
            headerRef.current,
            {
              '--header-text-color': '#281219',
              '--header-border-color': 'rgba(40, 18, 25, 0.22)',
              '--header-btn-bg': 'rgba(40, 18, 25, 0.05)',
              '--header-btn-hover-bg': 'rgba(40, 18, 25, 0.12)',
              duration: 0.5,
              ease: 'power1.inOut',
            },
            0.2
          );
        }

        // 4. Overlays fade away
        tl.to(
          [vignetteRef.current, topScrimRef.current],
          {
            opacity: 0,
            duration: 0.55,
            ease: 'power1.out',
          },
          0.1
        );

        // 5. Hero Image frame transforms (100vw x 100vh -> centered 60vw x 430px with 32px rounded corners)
        tl.to(
          mediaWrapperRef.current,
          {
            width: '60vw',
            height: '430px',
            borderRadius: '32px',
            boxShadow: '0 30px 80px -15px rgba(40, 18, 25, 0.22)',
            duration: 0.75,
            ease: 'power2.inOut',
          },
          0.15
        );

        // 6. Stage 2 Editorial Content enters
        tl.to(
          stage2ContentRef.current,
          {
            opacity: 1,
            duration: 0.2,
          },
          0.45
        )
          .fromTo(
            stage2TopRef.current,
            { opacity: 0, y: -25 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
            0.45
          )
          .fromTo(
            stage2BottomRef.current,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
            0.5
          );
      });

      // Tablet Viewport (768px - 1024px)
      mm.add('(min-width: 768px) and (max-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            pin: stageRef.current,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        tl.to(stage1ContentRef.current, { opacity: 0, y: -30, duration: 0.35 }, 0)
          .to(stageRef.current, { backgroundColor: '#f5f0e6', duration: 0.7 }, 0.1)
          .to([vignetteRef.current, topScrimRef.current], { opacity: 0, duration: 0.5 }, 0.1)
          .to(
            mediaWrapperRef.current,
            {
              width: '74vw',
              height: '380px',
              borderRadius: '28px',
              boxShadow: '0 25px 60px -15px rgba(40, 18, 25, 0.2)',
              duration: 0.75,
              ease: 'power2.inOut',
            },
            0.15
          )
          .to(stage2ContentRef.current, { opacity: 1, duration: 0.2 }, 0.45)
          .fromTo(stage2TopRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.45 }, 0.45)
          .fromTo(stage2BottomRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45 }, 0.5);

        if (headerRef?.current) {
          tl.to(
            headerRef.current,
            {
              '--header-text-color': '#281219',
              '--header-border-color': 'rgba(40, 18, 25, 0.22)',
              '--header-btn-bg': 'rgba(40, 18, 25, 0.05)',
              duration: 0.5,
            },
            0.2
          );
        }
      });

      // Mobile Viewport (<= 767px)
      mm.add('(max-width: 767px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            pin: stageRef.current,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        tl.to(stage1ContentRef.current, { opacity: 0, y: -25, duration: 0.35 }, 0)
          .to(stageRef.current, { backgroundColor: '#f5f0e6', duration: 0.7 }, 0.1)
          .to([vignetteRef.current, topScrimRef.current], { opacity: 0, duration: 0.5 }, 0.1)
          .to(
            mediaWrapperRef.current,
            {
              width: '88vw',
              height: '320px',
              borderRadius: '22px',
              boxShadow: '0 20px 50px -10px rgba(40, 18, 25, 0.2)',
              duration: 0.75,
              ease: 'power2.inOut',
            },
            0.15
          )
          .to(stage2ContentRef.current, { opacity: 1, duration: 0.2 }, 0.45)
          .fromTo(stage2TopRef.current, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.45 }, 0.45)
          .fromTo(stage2BottomRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.45 }, 0.5);

        if (headerRef?.current) {
          tl.to(
            headerRef.current,
            {
              '--header-text-color': '#281219',
              '--header-border-color': 'rgba(40, 18, 25, 0.22)',
              '--header-btn-bg': 'rgba(40, 18, 25, 0.05)',
              duration: 0.5,
            },
            0.2
          );
        }
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <div className="hero-scroll-wrapper" ref={containerRef}>
      <section className="hero-pinned-stage" ref={stageRef}>
        {/* Pinned Architectural Image Frame with Segmented 3D Cube Wave Transition */}
        <div className="hero-media-wrapper" ref={mediaWrapperRef}>
          <Segmented3DCube
            images={ARCHITECTURAL_IMAGES}
            containerRef={mediaWrapperRef}
          />
          <div className="hero-vignette" ref={vignetteRef} />
          <div className="hero-top-scrim" ref={topScrimRef} />
        </div>

        {/* STAGE 1: INITIAL STATE OVERLAYS */}
        <div className="stage1-content" ref={stage1ContentRef}>
          <div className="stage1-center">
            <div className="stage1-tagline">Built. Rooted. Timeless.</div>
            <h1 className="stage1-headline" ref={stage1HeadlineRef}>
              Homes Inspired by the Soul of <br />
              <span className="italic">Chettinad</span>
            </h1>
          </div>

          <div className="stage1-bottom-bar">
            <div className="stage1-project-card" ref={stage1CardRef}>
              <span className="card-label">Featured Residence</span>
              <h2 className="card-title">Modern Chettinad Residence</h2>
              <span className="card-location">Karaikudi, Tamil Nadu</span>
            </div>

            <div className="stage1-scroll-indicator" ref={stage1ScrollRef}>
              <span>Scroll to explore</span>
              <div className="scroll-line-container">
                <div className="scroll-line-runner"></div>
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 2: SCROLLED EDITORIAL STATE */}
        <div className="stage2-content" ref={stage2ContentRef}>
          <div className="stage2-headline-top" ref={stage2TopRef}>
            <h2 className="stage2-title">Where Tradition</h2>
          </div>

          <div className="stage2-headline-bottom" ref={stage2BottomRef}>
            <h2 className="stage2-title">
              <span className="italic">Meets</span> Modern Living
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
