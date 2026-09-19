import React from 'react';
import ScrollExpandPage from './ScrollExpandPage';
import heroImage from '../../images/hero2.png';

export default function AboutSection() {
  return (
    <section className="about-section-wrapper" id="about" aria-label="About Karaikudi Construction">
      <ScrollExpandPage
        image={heroImage}
        backgroundColor="var(--color-cream-bg, #f5f0e6)"
        leftWord="HERITAGE"
        rightWord="LEGACIES"
      />
    </section>
  );
}

