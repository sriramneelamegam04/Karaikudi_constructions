import React, { useId } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import logo from '../../images/logo.png';

gsap.registerPlugin(ScrollTrigger);

export default function Header({ headerRef }) {
  const circleId = useId();

  useGSAP(
    () => {
      const heroWrapper = document.querySelector('.hero-scroll-wrapper');
      if (!heroWrapper || !headerRef?.current) return;

      const headerEl = headerRef.current;

      // Check if page loaded already scrolled past Stage 1
      const isPastStage1 = window.scrollY > window.innerHeight * 0.4;
      if (isPastStage1) {
        gsap.set(headerEl, {
          opacity: 0,
          y: -24,
          visibility: 'hidden',
          pointerEvents: 'none',
        });
      } else {
        gsap.set(headerEl, {
          opacity: 1,
          y: 0,
          visibility: 'visible',
        });
      }

      // Synchronize visibility strictly with Hero Stage 1 active scroll
      // As Stage 1 dissolves into Stage 2 (within the first 40% of viewport scroll),
      // the header fades out and hides completely, remaining hidden for Stage 2 & all subsequent sections.
      const st = ScrollTrigger.create({
        trigger: heroWrapper,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.45}`,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress; // 0 = Stage 1 active, 1 = Stage 2 / rest of page
          gsap.set(headerEl, {
            opacity: 1 - p,
            y: -24 * p,
            visibility: p >= 0.98 ? 'hidden' : 'visible',
            pointerEvents: p >= 0.4 ? 'none' : 'auto',
          });
        },
        onLeave: () => {
          gsap.set(headerEl, {
            opacity: 0,
            y: -24,
            visibility: 'hidden',
            pointerEvents: 'none',
          });
        },
        onEnterBack: () => {
          gsap.set(headerEl, {
            visibility: 'visible',
          });
        },
      });

      return () => {
        st.kill();
      };
    },
    { scope: headerRef }
  );

  return (
    <header
      className="site-header"
      ref={headerRef}
      aria-label="Main Site Navigation"
    >
      {/* LEFT: Circular Animated Architectural Brand Mark + Title */}
      <a href="#" className="header-brand" aria-label="Karaikudi Construction Home">
        <div className="brand-mark-wrapper">
          {/* Continuous Rotating Circular Text */}
          <svg
            viewBox="0 0 120 120"
            className="brand-circular-text-svg"
            aria-hidden="true"
          >
            <defs>
              <path
                id={circleId}
                d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0"
              />
            </defs>
            <text className="brand-circular-text">
              <textPath href={`#${circleId}`} startOffset="0%">
                KARAIKUDI • HERITAGE • CONSTRUCTION •
              </textPath>
            </text>
          </svg>

          {/* Stationary Central Logo with Subtle Hover Scale */}
          <div className="brand-logo-center">
            <img src={logo} alt="Karaikudi Construction Logo" className="brand-central-img" />
          </div>
        </div>

        {/* <span className="brand-title">Karaikudi Construction</span> */}
      </a>

      {/* RIGHT: "Contact us" Minimal Luxury Action */}
      <div className="header-actions">
        <a href="#contact" className="nav-contact-btn" aria-label="Contact us">
          <span>Contact us</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="contact-btn-arrow"
            aria-hidden="true"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      </div>
    </header>
  );
}
