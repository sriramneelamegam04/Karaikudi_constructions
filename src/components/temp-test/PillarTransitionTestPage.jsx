import React, { useEffect, useRef } from 'react';
import PillarTransition from './PillarTransition';
import './PillarTransitionTestPage.css';

/**
 * TEMPORARY TEST HARNESS
 * -----------------------
 * Renders PillarTransition in an isolated test environment with
 * preceding and succeeding sections to test the scroll-driven pinning,
 * pillar rise, split animation, and responsive behavior.
 */
export default function PillarTransitionTestPage({ onExitTest }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-test-page">
      {/* Floating Test Control Header */}
      <aside className="pt-test-banner" aria-label="Test Environment Controls">
        <div className="pt-test-badge">
          <span className="pt-pulse-indicator" />
          TEMPORARY COMPONENT TEST: <code>PillarTransition.jsx</code>
        </div>
        <div className="pt-test-actions">
          <button
            type="button"
            className="pt-btn-scroll"
            onClick={() => {
              const el = document.querySelector('.pillar-transition');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Scroll to Transition ↓
          </button>
          <button
            type="button"
            className="pt-btn-exit"
            onClick={onExitTest}
          >
            ← Return to Production Landing Page
          </button>
        </div>
      </aside>

      {/* 1. Mock Preceding Section (e.g. Services) */}
      <header className="pt-mock-section pt-section-before">
        <div className="pt-mock-container">
          <span className="pt-mock-kicker">Preceding Section (e.g. Services)</span>
          <h1 className="pt-mock-title">Architectural Craftsmanship &amp; Services</h1>
          <p className="pt-mock-desc">
            Scroll down slowly to test the <strong>PillarTransition</strong> bridge section.
            The two Corinthian vintage pillars will rise together from the bottom center,
            hold briefly, and split outward to reveal the next section.
          </p>
          <div className="pt-scroll-hint">
            <span>Scroll Down to Trigger Animation</span>
            <div className="pt-arrow-down">↓</div>
          </div>
        </div>
      </header>

      {/* 2. The Component Under Test */}
      <main className="pt-test-subject-wrap">
        <PillarTransition />
      </main>

      {/* 3. Mock Succeeding Section (e.g. Home Showcase) */}
      <section className="pt-mock-section pt-section-after">
        <div className="pt-mock-container">
          <span className="pt-mock-kicker">Succeeding Section (e.g. Find Your Home)</span>
          <h2 className="pt-mock-title">Unveiled Estate Showcase</h2>
          <p className="pt-mock-desc">
            The pillars have successfully parted to the section edges, seamlessly releasing
            scroll pinning and transitioning into this destination content.
          </p>
        </div>
      </section>
    </div>
  );
}
