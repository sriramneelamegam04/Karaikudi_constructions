import React, { useState, useEffect, useRef } from 'react';
import './TestimonialsSection.css';
import banyanLeft from '../../images/banyan_branch_left.png';
import banyanRight from '../../images/banyan_branch_right.png';

// 5 Architectural Client Testimonials
export const TESTIMONIALS = [
  {
    id: '01',
    number: '01',
    quote:
      'We wanted a home that felt deeply connected to Chettinad without compromising the comforts of modern living. The courtyard, thinnai, and natural airflow have completely changed the way our family experiences the house.',
    client: 'Devanathan & Malini Raman',
    location: 'Modern Chettinad Residence • Karaikudi, Tamil Nadu',
    project: 'Chettinad Residence',
  },

  {
    id: '02',
    number: '02',
    quote:
      'The attention to traditional materials was remarkable. From the lime-plastered walls to the Athangudi tiles and handcrafted timber details, every element feels purposeful and beautifully connected to the heritage of the region.',
    client: 'Kavitha Sundaram',
    location: 'Heritage Residence • Athangudi, Tamil Nadu',
    project: 'Heritage Residence',
  },

  {
    id: '03',
    number: '03',
    quote:
      'What impressed us most was how naturally the house stays connected to the outdoors. The courtyard brings in light and breeze throughout the day, while the shaded thinnai has become our favourite place to gather as a family.',
    client: 'Dr. Arvind Chidambaram',
    location: 'Courtyard Home • Alagappapuram, Tamil Nadu',
    project: 'Courtyard Home',
  },

  {
    id: '04',
    number: '04',
    quote:
      'They understood that building a Chettinad home is about much more than appearance. The proportions, materials, ventilation, craftsmanship, and relationship between spaces were all carefully considered.',
    client: 'Meera & Rajeshwar Krishnan',
    location: 'Traditional Residence • Kottaiyur, Tamil Nadu',
    project: 'Traditional Residence',
  },

  {
    id: '05',
    number: '05',
    quote:
      'From the first site discussion to the final finishing, the entire process felt thoughtful and transparent. We now have a home that carries the character of our heritage while fitting naturally into the way our family lives today.',
    client: 'Siddharth Alagappan',
    location: 'Modern Heritage Home • Kanadukathan, Tamil Nadu',
    project: 'Modern Heritage Home',
  },
];

export default function TestimonialsSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Auto-rotation every 5 seconds (5000ms)
  // Automatically restarts/resets timer whenever currentIdx changes or isPaused toggles
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % TESTIMONIALS.length);
      }, 5000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIdx, isPaused]);

  // Manual navigation handlers — automatically reset timer by updating currentIdx
  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handleDotClick = (index) => {
    if (index !== currentIdx) {
      setCurrentIdx(index);
    }
  };

  const activeTestimonial = TESTIMONIALS[currentIdx];

  return (
    <section
      className="testimonials-section"
      id="testimonials"
      aria-label="Client Testimonials and Perspectives"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="testimonials-container">
        {/* ===================================================
            SECTION EDITORIAL HEADER
            =================================================== */}
        <div className="testimonials-header">
          <div className="testimonials-badge-wrap">
            <span className="testimonials-badge">Client Perspectives</span>
          </div>
          <h2 className="testimonials-title">
            Words From Our <em>Homes</em>
          </h2>
        </div>

        {/* ===================================================
            TESTIMONIAL STAGE (SINGLE ACTIVE TESTIMONIAL)
            =================================================== */}
        <div className="testimonials-stage">
          {/* Large subtle architectural quotation element */}
          <div className="testimonials-watermark-quote" aria-hidden="true">
            <svg
              width="96"
              height="76"
              viewBox="0 0 96 76"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.6 0C11.4 0 0 11.6 0 26C0 43.2 17 57 27.6 76L41.6 68C33.6 52.4 35 39.6 39 31.2C41.2 26.4 42.4 21.6 42.4 16.8C42.4 7.6 34.8 0 25.6 0ZM79.2 0C65 0 53.6 11.6 53.6 26C53.6 43.2 70.6 57 81.2 76L95.2 68C87.2 52.4 88.6 39.6 92.6 31.2C94.8 26.4 96 21.6 96 16.8C96 7.6 88.4 0 79.2 0Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Dynamic Content Container with key for smooth fade + slide transition */}
          <div className="testimonials-card-viewport">
            <div key={activeTestimonial.id} className="testimonials-content-card">
              {/* Testimonial Quote in elegant editorial serif */}
              <blockquote className="testimonials-quote-text">
                “{activeTestimonial.quote}”
              </blockquote>

              {/* Client Information */}
              <div className="testimonials-author-block">
                <div className="testimonials-author-line" aria-hidden="true" />
                <div className="testimonials-author-meta">
                  <span className="testimonials-author-name">
                    {activeTestimonial.client}
                  </span>
                  <span className="testimonials-author-location">
                    {activeTestimonial.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            NAVIGATION & COUNTER CONTROLS
            =================================================== */}
        <div className="testimonials-controls">
          {/* Small 01 / 05 Style Counter */}
          <div className="testimonials-counter" aria-live="polite">
            <span className="counter-current">0{currentIdx + 1}</span>
            <span className="counter-divider">/</span>
            <span className="counter-total">0{TESTIMONIALS.length}</span>
          </div>

          {/* Subtle Navigation Progress Dots */}
          <div
            className="testimonials-dots"
            role="tablist"
            aria-label="Testimonials pagination"
          >
            {TESTIMONIALS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={idx === currentIdx}
                aria-label={`Go to testimonial ${idx + 1} by ${item.client}`}
                className={`testimonials-dot ${idx === currentIdx ? 'active' : ''}`}
                onClick={() => handleDotClick(idx)}
              >
                {idx === currentIdx && (
                  <span
                    className={`testimonials-progress-bar ${isPaused ? 'is-paused' : ''
                      }`}
                    key={`bar-${currentIdx}`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="testimonials-arrows">
            <button
              type="button"
              className="testimonials-arrow-btn prev"
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>

            <button
              type="button"
              className="testimonials-arrow-btn next"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* FOREGROUND — Banyan Tree Branches with Wind Sway */}
      <div className="banyan-branch-left-wrap" aria-hidden="true">
        <img
          src={banyanLeft}
          alt=""
          className="banyan-sway-left"
        />
      </div>

      <div className="banyan-branch-right-wrap" aria-hidden="true">
        <img
          src={banyanRight}
          alt=""
          className="banyan-sway-right"
        />
      </div>
    </section>
  );
}
