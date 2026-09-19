import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);
  const contentRef = useRef(null);
  const colRefs = useRef([]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // Existing footer entrance animation
      tl.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );

      // Individual footer columns staggered upward assembly animation
      const cols =
        colRefs.current.filter(Boolean).length > 0
          ? colRefs.current.filter(Boolean)
          : gsap.utils.toArray('.footer-nav-col', footerRef.current);

      if (cols.length > 0) {
        tl.fromTo(
          cols,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
          },
          0.1
        );
      }
    },
    { scope: footerRef }
  );

  return (
    <footer className="site-footer" ref={footerRef} id="contact">
      {/* LARGE OVERSIZED EDITORIAL WATERMARK BACKGROUND TEXT */}
      <div className="footer-watermark-wrap" aria-hidden="true">
        <span className="footer-watermark-text">KARAIKUDI CONSTRUCTION</span>
      </div>

      <div className="footer-container" ref={contentRef}>
        {/* TOP BRAND & CTA HEADER */}
        <div className="footer-top-row">
          <div className="footer-brand-wrap">
            <h2 className="footer-brand-title">KARAIKUDI CONSTRUCTION</h2>
            <span className="footer-brand-subtitle">
              ARCHITECTURE • DESIGN • BUILD
            </span>
            <p className="footer-brand-desc">
              Building contemporary residences through the timeless principles,
              materials, and craftsmanship of Chettinad architecture.
            </p>
          </div>

          <div className="footer-cta-block">
            <span className="footer-cta-lead">Ready to Build Your Home?</span>
            <a
              href="tel:+919095033391"
              className="footer-cta-btn"
              aria-label="Call +91 90950 33391 to Start a Project"
            >
              <span>Start a Project</span>
              <span className="footer-cta-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>

        {/* MIDDLE COLUMNS: NAV, SERVICES, CONTACT, SOCIAL */}
        <div className="footer-nav-grid">
          {/* Col 1: Navigation */}
          <div
            className="footer-nav-col"
            ref={(el) => (colRefs.current[0] = el)}
          >
            <h3 className="footer-col-title">Navigation</h3>
            <ul className="footer-links-list">
              <li>
                <a href="#" className="footer-link">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="footer-link">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Services
                </a>
              </li>
              <li>
                <a href="#find-your-home" className="footer-link">
                  Residences
                </a>
              </li>
              <li>
                <a href="#why-choose-us" className="footer-link">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#work-process" className="footer-link">
                  Work Process
                </a>
              </li>
              <li>
                <a href="#connect" className="footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Services */}
          <div
            className="footer-nav-col"
            ref={(el) => (colRefs.current[1] = el)}
          >
            <h3 className="footer-col-title">Services</h3>
            <ul className="footer-links-list">
              <li>
                <a href="#services" className="footer-link">
                  Chettinad Home Design
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Architecture & Planning
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Traditional Construction
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Renovation
                </a>
              </li>

            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div
            className="footer-nav-col"
            ref={(el) => (colRefs.current[2] = el)}
          >
            <h3 className="footer-col-title">Direct Contact</h3>
            <div className="footer-contact-items">
              <a href="tel:+919095033391" className="footer-contact-link">
                +91 90950 33391
              </a>
              <a
                href="mailto:hello@karaikudiconstruction.com"
                className="footer-contact-link"
              >
                hello@karaikudiconstruction.com
              </a>
              <p className="footer-address">
                Karaikudi
                <br />
                Tamilnadu, India
              </p>
            </div>
          </div>

          {/* Col 4: Connect */}
          <div
            className="footer-nav-col"
            ref={(el) => (colRefs.current[3] = el)}
          >
            <h3 className="footer-col-title">Connect</h3>
            <ul className="footer-links-list">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link social-link"
                >
                  <span>Instagram</span>
                  <span className="social-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link social-link"
                >
                  <span>LinkedIn</span>
                  <span className="social-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link social-link"
                >
                  <span>Facebook</span>
                  <span className="social-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © 2026 Karaikudi Construction | All Rights Reserved
          </p>
          <div className="footer-legal-links">
            <a href="#" className="footer-legal-link">
              Privacy Policy
            </a>
            <span className="footer-legal-dot">•</span>
            <a href="#" className="footer-legal-link">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
