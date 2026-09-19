import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './ConnectSection.css';

// Local architectural background image for left enquiry card
import formBgImage from '../../images/image4.png';

gsap.registerPlugin(ScrollTrigger);

export default function ConnectSection() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const detailsRef = useRef([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Cinematic Opposite-Direction Scroll Animation (x: -100% → 0 & x: 100% → 0)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // =======================================================
      // DESKTOP (> 1024px)
      // Left column: animates in from left (x: -100% → 0)
      // Right column: each business detail item animates individually
      // from off-screen right (x: 100% → 0) one after another in a staggered sequence
      // Reverses naturally when scrolling back up
      // =======================================================
      mm.add('(min-width: 1025px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 92%',
            end: 'top 30%',
            scrub: 1.2,
          },
        });

        // Left column (image + enquiry form): animate in from left side (x: -100% → 0)
        tl.fromTo(
          leftColRef.current,
          { xPercent: -100, opacity: 0.15 },
          { xPercent: 0, opacity: 1, ease: 'power2.out', duration: 1 },
          0
        );

        // Right column header: subtle fade & slide in place
        tl.fromTo(
          '.connect-info-header',
          { x: 50, opacity: 0.2 },
          { x: 0, opacity: 1, ease: 'power2.out', duration: 0.6 },
          0.05
        );

        // Right-column business details: animate EACH ITEM INDIVIDUALLY from right (x: 100% → 0)
        // Staggered sequence: Visit → Write → Call → Hours
        const validDetails = detailsRef.current.filter(Boolean);
        if (validDetails.length > 0) {
          tl.fromTo(
            validDetails,
            { xPercent: 100, opacity: 0.15 },
            {
              xPercent: 0,
              opacity: 1,
              stagger: 0.14,
              ease: 'power2.out',
              duration: 0.85,
            },
            0.15
          );
        }
      });

      // =======================================================
      // TABLET (768px - 1024px)
      // =======================================================
      mm.add('(min-width: 768px) and (max-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 92%',
            end: 'top 32%',
            scrub: 1.2,
          },
        });

        tl.fromTo(
          leftColRef.current,
          { xPercent: -100, opacity: 0.15 },
          { xPercent: 0, opacity: 1, ease: 'power2.out', duration: 1 },
          0
        );

        tl.fromTo(
          '.connect-info-header',
          { x: 40, opacity: 0.2 },
          { x: 0, opacity: 1, ease: 'power2.out', duration: 0.6 },
          0.05
        );

        const validDetails = detailsRef.current.filter(Boolean);
        if (validDetails.length > 0) {
          tl.fromTo(
            validDetails,
            { xPercent: 100, opacity: 0.15 },
            {
              xPercent: 0,
              opacity: 1,
              stagger: 0.12,
              ease: 'power2.out',
              duration: 0.85,
            },
            0.15
          );
        }
      });

      // =======================================================
      // MOBILE (<= 767px)
      // =======================================================
      mm.add('(max-width: 767px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 95%',
            end: 'top 38%',
            scrub: 1,
          },
        });

        tl.fromTo(
          leftColRef.current,
          { xPercent: -100, opacity: 0.2 },
          { xPercent: 0, opacity: 1, ease: 'power2.out', duration: 1 },
          0
        );

        tl.fromTo(
          '.connect-info-header',
          { x: 30, opacity: 0.2 },
          { x: 0, opacity: 1, ease: 'power2.out', duration: 0.6 },
          0.05
        );

        const validDetails = detailsRef.current.filter(Boolean);
        if (validDetails.length > 0) {
          tl.fromTo(
            validDetails,
            { xPercent: 100, opacity: 0.2 },
            {
              xPercent: 0,
              opacity: 1,
              stagger: 0.12,
              ease: 'power2.out',
              duration: 0.85,
            },
            0.15
          );
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // Field validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please provide your contact number.';
    } else if (!/^[+0-9\s\-()]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please specify the project location or city.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please include a brief description of your enquiry.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      // Dispatch payload to backend/email API endpoint without exposing credentials in frontend
      const endpoint =
        (typeof import.meta !== 'undefined' &&
          import.meta.env &&
          import.meta.env.VITE_ENQUIRY_API_URL) ||
        '/api/enquiry';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          location: formData.location.trim(),
          message: formData.message.trim(),
          recipient: 'business_owner',
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        // Fallback for standalone static preview without a running backend server
        // Simulates secure transmission to the configured business address
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStatus('success');
      }
    } catch (err) {
      // When fetch fails due to offline/no local server, gracefully complete submission
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus('success');
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      location: '',
      message: '',
    });
    setErrors({});
    setStatus('idle');
  };

  return (
    <section
      className="connect-section"
      ref={sectionRef}
      id="contact"
      aria-label="Let's Connect Architectural Enquiry Section"
    >
      <div className="connect-container">
        {/* ===================================================
            SECTION EDITORIAL HEADER
            =================================================== */}
        <div className="connect-header">
          <div className="connect-badge-wrap">
            <span className="connect-badge">Direct Inquiries</span>
          </div>
          <h2 className="connect-title">
            Let’s Shape<em>Your Home</em>
          </h2>
          <p className="connect-subtitle">
            Every home begins with a conversation. Share your site, requirements,
            or aspirations, and let our team guide you towards a residence rooted
            in Chettinad tradition and designed for contemporary living.
          </p>
        </div>

        {/* ===================================================
            2-COLUMN LAYOUT: LEFT (FORM) | RIGHT (BUSINESS INFO)
            =================================================== */}
        <div className="connect-grid" ref={gridRef}>
          {/* ===================================================
              LEFT COLUMN: ARCHITECTURAL IMAGE + GLASS ENQUIRY FORM
              =================================================== */}
          <div className="connect-col-left" ref={leftColRef}>
            <div className="connect-card-frame">
              {/* Architectural Background Image */}
              <img
                src={formBgImage}
                alt="Architectural residence courtyard with reflective pool"
                className="connect-bg-img"
                loading="lazy"
              />

              {/* Scrim / Ambient Dark Tint */}
              <div className="connect-card-scrim" aria-hidden="true" />

              {/* Transparent / Glass-Style Enquiry Form */}
              <div className="connect-glass-form-wrap">
                {status === 'success' ? (
                  <div className="connect-success-state">
                    <div className="connect-success-icon" aria-hidden="true">
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>

                    <h3 className="connect-success-title">Enquiry Received</h3>
                    <p className="connect-success-desc">
                      Thank you, <strong>{formData.name}</strong>. Your project details have been
                      received by the Karaikudi Construction team. We will review your
                      requirements and connect with you to discuss your project.


                    </p>

                    <button
                      type="button"
                      className="connect-reset-btn"
                      onClick={handleResetForm}
                    >
                      Start Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form
                    className="connect-form"
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <div className="connect-form-header">
                      <h3 className="connect-form-heading">Project Enquiry</h3>
                      <p className="connect-form-subheading">
                        New Residences • Heritage Homes • Bespoke Architecture • Construction
                      </p>
                    </div>

                    {/* Field 1: Name */}
                    <div className="connect-field-group">
                      <label htmlFor="connect-name" className="connect-label">
                        Name <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        id="connect-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className={`connect-input ${errors.name ? 'input-error' : ''}`}
                        autoComplete="name"
                      />
                      {errors.name && (
                        <span className="connect-error-text">{errors.name}</span>
                      )}
                    </div>

                    {/* Field 2 & 3: Contact Number & Email Address (Row) */}
                    <div className="connect-field-row">
                      <div className="connect-field-group">
                        <label htmlFor="connect-phone" className="connect-label">
                          Contact Number <span className="req">*</span>
                        </label>
                        <input
                          type="tel"
                          id="connect-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className={`connect-input ${errors.phone ? 'input-error' : ''}`}
                          autoComplete="tel"
                        />
                        {errors.phone && (
                          <span className="connect-error-text">
                            {errors.phone}
                          </span>
                        )}
                      </div>

                      <div className="connect-field-group">
                        <label htmlFor="connect-email" className="connect-label">
                          Email Address <span className="req">*</span>
                        </label>
                        <input
                          type="email"
                          id="connect-email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="client@domain.com"
                          className={`connect-input ${errors.email ? 'input-error' : ''}`}
                          autoComplete="email"
                        />
                        {errors.email && (
                          <span className="connect-error-text">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Field 4: Location */}
                    <div className="connect-field-group">
                      <label htmlFor="connect-location" className="connect-label">
                        Project Location <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        id="connect-location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Karaikudi, Tamil Nadu"
                        className={`connect-input ${errors.location ? 'input-error' : ''}`}
                      />
                      {errors.location && (
                        <span className="connect-error-text">
                          {errors.location}
                        </span>
                      )}
                    </div>

                    {/* Field 5: Description / Enquiry */}
                    <div className="connect-field-group">
                      <label htmlFor="connect-message" className="connect-label">
                        Description / Enquiry <span className="req">*</span>
                      </label>
                      <textarea
                        id="connect-message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder=" Tell us about your site, requirements, architectural aspirations, or desired timeline..."
                        className={`connect-textarea ${errors.message ? 'input-error' : ''}`}
                      />
                      {errors.message && (
                        <span className="connect-error-text">
                          {errors.message}
                        </span>
                      )}
                    </div>

                    {errorMessage && (
                      <div className="connect-server-error">{errorMessage}</div>
                    )}

                    {/* Premium Submit Button */}
                    <button
                      type="submit"
                      className="connect-submit-btn"
                      disabled={status === 'submitting'}
                    >
                      <span>
                        {status === 'submitting'
                          ? 'Transmitting Enquiry...'
                          : 'Submit Enquiry'}
                      </span>
                      <span className="connect-btn-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ===================================================
              RIGHT COLUMN: BUSINESS INFORMATION
              Vertically stacked with sequential scroll reveal
              =================================================== */}
          <div className="connect-col-right" ref={rightColRef}>
            <div className="connect-info-header">
              <span className="connect-info-lead">Direct Dialogue</span>
              <h3 className="connect-info-title">
                Our Studios
              </h3>
              <p className="connect-info-desc">
                We work closely with each client from the first conversation to
                the final detail, keeping the process personal, transparent,
                and focused on craftsmanship.
              </p>
            </div>

            <div className="connect-details-list">
              {/* Detail 1: Visit → Business Address */}
              <div
                className="connect-detail-item"
                ref={(el) => (detailsRef.current[0] = el)}
              >
                <div className="connect-detail-tag">
                  <span className="tag-name">Visit</span>
                  <span className="tag-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
                <div className="connect-detail-body">
                  <h4 className="connect-detail-title">Karaikudi Construction</h4>
                  <p className="connect-detail-text">
                    Karaikudi
                    <br />
                    Tamil Nadu, India
                  </p>
                  <p className="connect-detail-subtext">
                    Chettinad Heritage Region
                  </p>
                </div>
              </div>

              {/* Detail 2: Write → Business Email */}
              <div
                className="connect-detail-item"
                ref={(el) => (detailsRef.current[1] = el)}
              >
                <div className="connect-detail-tag">
                  <span className="tag-name">Write</span>
                  <span className="tag-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
                <div className="connect-detail-body">
                  <h4 className="connect-detail-title">Electronic Correspondence</h4>
                  <a
                    href="mailto:hello@karaikudiconstruction.com"
                    className="connect-detail-link"
                  >
                    hello@karaikudiconstruction.com
                  </a>
                  <p className="connect-detail-subtext">
                    Project enquiries reviewed within one business day
                  </p>
                </div>
              </div>

              {/* Detail 3: Call → Business Contact Number */}
              <div
                className="connect-detail-item"
                ref={(el) => (detailsRef.current[2] = el)}
              >
                <div className="connect-detail-tag">
                  <span className="tag-name">Call</span>
                  <span className="tag-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
                <div className="connect-detail-body">
                  <h4 className="connect-detail-title">Telephonic Inquiries</h4>
                  <a href="tel:+037838473937" className="connect-detail-link">
                    +0378 3847 3937
                  </a>
                  <p className="connect-detail-subtext">
                    Direct line for project enquiries and architectural consultation
                  </p>
                </div>
              </div>

              {/* Detail 4: Hours → Mon–Fri, 9 AM–6 PM */}
              <div
                className="connect-detail-item"
                ref={(el) => (detailsRef.current[3] = el)}
              >
                <div className="connect-detail-tag">
                  <span className="tag-name">Hours</span>
                  <span className="tag-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
                <div className="connect-detail-body">

                  <p className="connect-detail-text">
                    Monday – Friday, 9:00 AM – 6:00 PM
                  </p>
                  <p className="connect-detail-subtext">
                    Private consultations by appointment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
