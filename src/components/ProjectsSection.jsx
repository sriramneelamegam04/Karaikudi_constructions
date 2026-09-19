import React from 'react';
import ZoomParallax from './ZoomParallax';

// Authentic local architectural images
import img1 from '../../images/image1.png';
import img3 from '../../images/image3.png';
import imgCour3 from '../../images/image7.png';
import mainMansionImg from '../../images/chettinad_mansion_image.png';
import cloudVideo from '../../videos/clouds_over_mansion.mp4';

export const PROJECTS_DATA = [
  {
    src: img1,
    number: '01',
    title: 'Modern Chettinad Residence',
    category: 'Residential Architecture',
    location: 'Karaikudi, Tamil Nadu',
    year: '2024',
    description:
      'A harmonious dialogue between traditional Chettinad courtyard planning, Athangudi tile craft, and modern climate-responsive comfort.',
  },
  {
    src: img3,
    number: '02',
    title: 'Contemporary Monolith Villa',
    category: 'Private Residence',
    location: 'Chettinad, Tamil Nadu',
    year: '2024',
    description:
      'High-ceilinged thinnai spaces, natural lime plaster walls, and central skylights bringing daylight and airflow into family living.',
  },
  {
    src: imgCour3,
    number: '03',
    title: 'Athangudi Heritage Estate',
    category: 'Heritage Restoration',
    location: 'Alagappapuram, Tamil Nadu',
    year: '2023',
    description:
      'Restoring century-old timber pillar craft and geometric Athangudi floor patterns alongside contemporary indoor-outdoor living.',
  },
  {
    src: mainMansionImg,
    videoSrc: cloudVideo,
    number: '04',
    title: 'Chettinad Architectural Mansion',
    category: 'Grand Estate & Sanctuary',
    location: 'Karaikudi, Tamil Nadu',
    year: '2024',
    description:
      'A majestic synthesis of grand Chettinad colonnades, ancestral lime plaster finishes, Burma teak pillars, and sustainable courtyards engineered for visionary luxury living.',
  },
];

export default function ProjectsSection() {
  const projectsHeader = (
    <div className="projects-gallery-header">
      <div className="projects-gallery-header-left">
        <span className="projects-gallery-eyebrow">Portfolio</span>
        <span className="projects-gallery-badge-text">Selected Works</span>
      </div>

      <div className="projects-gallery-header-right">
        <h2 className="projects-gallery-title">
          Homes shaped by place, climate & authentic craftsmanship
        </h2>
      </div>
    </div>
  );

  return (
    <section
      className="projects-gallery-wrapper"
      id="portfolio"
      aria-label="Architectural Projects Portfolio"
    >
      <ZoomParallax
        images={PROJECTS_DATA}
        mainIndex={3}
        videoSrc={cloudVideo}
        scrollDistancePercent={220}
        driftAmount={260}
        parallaxStrength={1}
        background="#FAF7F2"
        header={projectsHeader}
        caption="SCROLL TO EXPLORE RESIDENCES"
      />
    </section>
  );
}
