import React, { useState } from 'react';

// Local architectural photography from building_architecture/images
import imgCour2 from '../../images/image6.png';
import img1 from '../../images/image1.png';
import img2 from '../../images/image2.png';
import imgCour4 from '../../images/image8.png';

const PROCESS_STEPS = [
  {
    id: 'step-1',
    number: '01.',
    stepLabel: 'Step 01.',
    collapsedTitle: ['Site &', 'Vision'],
    title: 'Site & Vision',
    description:
      'Understanding your site, lifestyle, family needs, climate, and architectural aspirations to establish the foundation for a truly personal Chettinad home.',
    cta: 'Begin your journey',
    image: imgCour2,
  },

  {
    id: 'step-2',
    number: '02.',
    stepLabel: 'Step 02.',
    collapsedTitle: ['Design &', 'Planning'],
    title: 'Design & Planning',
    description:
      'Developing thoughtful spatial layouts with courtyards, thinnai spaces, natural ventilation, traditional proportions, and contemporary functionality.',
    cta: 'Explore the design',
    image: img1,
  },

  {
    id: 'step-3',
    number: '03.',
    stepLabel: 'Step 03.',
    collapsedTitle: ['Craft &', 'Construction'],
    title: 'Craft & Construction',
    description:
      'Bringing the design to life through precise construction, authentic materials, skilled craftsmanship, lime plaster, Semmann brick, Athangudi tiles, and timber detailing.',
    cta: 'Follow the build',
    image: img2,
  },

  {
    id: 'step-4',
    number: '04.',
    stepLabel: 'Step 04.',
    collapsedTitle: ['Finishing &', 'Handover'],
    title: 'Finishing & Handover',
    description:
      'Completing every architectural detail with careful finishing, quality checks, traditional craftsmanship, and a final walkthrough before your home is ready to be lived in.',
    cta: 'Welcome home',
    image: imgCour4,
  },
];

export default function WorkProcessSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleMouseEnterCard = (index) => {
    setActiveIdx(index);
  };

  const handleMouseLeaveTrack = () => {
    // Return smoothly to Process 01 as default expanded item
    setActiveIdx(0);
  };

  return (
    <section className="process-section" id="work-process">
      <div className="process-container">
        {/* ===================================================
            HEADER AREA: TITLE & EDITORIAL PARAGRAPH
            =================================================== */}
        <div className="process-header-row">
          <div className="process-header-left">
            <span className="process-eyebrow">Easy steps</span>
            <h2 className="process-heading">
              From Site<br />
              to Sanctuary
            </h2>
          </div>

          <div className="process-header-right">
            <p className="process-header-desc">
              From understanding the land to handing over the finished home,
              every stage is carefully considered, transparent, and collaborative.
            </p>
          </div>
        </div>

        {/* ===================================================
            HORIZONTAL ACCORDION: 4 PROCESS CARDS
            =================================================== */}
        <div
          className="process-cards-track"
          onMouseLeave={handleMouseLeaveTrack}
        >
          {PROCESS_STEPS.map((step, idx) => {
            const isExpanded = activeIdx === idx;

            return (
              <div
                key={step.id}
                className={`process-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
                onMouseEnter={() => handleMouseEnterCard(idx)}
                onClick={() => setActiveIdx(idx)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={`${step.stepLabel} ${step.title}`}
              >
                {/* Full Background Image Layer for Expanded State */}
                <div className="process-bg-layer">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="process-bg-img"
                    loading="lazy"
                  />
                  <div className="process-img-overlay" aria-hidden="true"></div>
                </div>

                {/* EXPANDED CONTENT (Visible when Active) */}
                <div className="process-expanded-content">
                  <div className="process-expanded-top">
                    <h3 className="process-expanded-title">{step.title}</h3>
                    <p className="process-expanded-desc">{step.description}</p>
                  </div>

                  <div className="process-expanded-bottom">
                    <button type="button" className="process-cta-pill">
                      <span>{step.cta}</span>
                      <span className="process-pill-arrow" aria-hidden="true">↗</span>
                    </button>

                    <span className="process-expanded-number">{step.number}</span>
                  </div>
                </div>

                {/* COLLAPSED CONTENT (Visible when Inactive) */}
                <div className="process-collapsed-content">
                  <span className="process-collapsed-step">{step.stepLabel}</span>

                  <div className="process-collapsed-title-wrap">
                    {step.collapsedTitle.map((line, i) => (
                      <span key={i} className="process-collapsed-title-line">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
