import React from 'react';

const MARQUEE_ITEMS = [
  'ROOTED IN CHETTINAD',
  'TRADITIONAL CRAFTSMANSHIP',
  'AUTHENTIC MATERIALS',
  'BUILT FOR GENERATIONS',
  'MODERN HERITAGE LIVING',
  'TIMELESS PROPORTIONS',
];

export default function MarqueeSection() {
  return (
    <section className="marquee-section" aria-label="Brand Philosophy Marquee">
      <div className="marquee-track-wrap">
        {/* Primary Track */}
        <div className="marquee-group">
          {MARQUEE_ITEMS.map((item, index) => (
            <React.Fragment key={`p-${index}`}>
              <span className="marquee-phrase">{item}</span>
              <span className="marquee-separator" aria-hidden="true">
                •
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Duplicate Track for Seamless Infinite Continuous Loop */}
        <div className="marquee-group" aria-hidden="true">
          {MARQUEE_ITEMS.map((item, index) => (
            <React.Fragment key={`d-${index}`}>
              <span className="marquee-phrase">{item}</span>
              <span className="marquee-separator" aria-hidden="true">
                •
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
