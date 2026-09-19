import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

// Local architectural images from building_architecture/images
import imgCour1 from '../../images/image4.png';
import imgCour2 from '../../images/image6.png';
import imgCour3 from '../../images/image7.png';
import imgCour4 from '../../images/image8.png';
import imgCour5 from '../../images/image9.png';
import athangudiTiles from '../../images/athangudi_tiles.png';
import tiles from '../../images/tiles.jpg';
import carvings from '../../images/carvings.png';
import img1 from '../../images/image1.png';
import img2 from '../../images/image2.png';
import img3 from '../../images/image3.png';

const SERVICES = [
  {
    number: '01',
    title: 'Chettinad Home Design',
    heading: ['Homes Rooted', 'In Tradition'],
    description:
      'Designing contemporary homes inspired by Chettinad traditions, with thoughtful courtyards, thinnai spaces, generous proportions, and layouts made for modern family living.',
    image: img3,
    supportingImages: [imgCour1, imgCour2],
  },
  {
    number: '02',
    title: 'Athangudi Tilework',
    heading: ['Floors With', 'A Story to Tell'],
    description:
      'Bringing handcrafted Athangudi tiles into contemporary homes, adding distinctive patterns, natural character, and the timeless craft of Chettinad to every living space.',
    image: athangudiTiles,
    supportingImages: [tiles, imgCour3],
  },
  {
    number: '03',
    title: 'Courtyard & Thinnai',
    heading: ['Spaces That', 'Breathe Naturally'],
    description:
      'Creating central courtyards, shaded thinnai verandahs, high ceilings, and connected spaces that bring natural light, airflow, cooling, and everyday family life together.',
    image: imgCour5,
    supportingImages: [img2, img1],
  },
  {
    number: '04',
    title: 'Traditional Carvings',
    heading: ['Details Crafted', 'By Hand'],
    description:
      'Integrating handcrafted wood carvings and traditional architectural details into entrances, pillars, doors, and living spaces to give each home a distinctive Chettinad identity.',
    image: carvings,
    supportingImages: [imgCour4, imgCour5],
  },
  {
    number: '05',
    title: 'Traditional Construction',
    heading: ['Built With', 'Time-Tested Methods'],
    description:
      'Combining lime plaster, Semmann red-earth bricks, natural materials, climate-responsive planning, and skilled craftsmanship to create homes designed for comfort and longevity.',
    image: imgCour4,
    supportingImages: [img3, imgCour1],
  },
];

export default function ServicesSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(null);

  const sectionRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Layers for main large image
  const currentImgRef = useRef(null);
  const nextImgRef = useRef(null);

  // Layers for large editorial heading
  const currentTitleRef = useRef(null);
  const nextTitleRef = useRef(null);

  // Layers for top service title (01. Buy a Home)
  const currentMetaRef = useRef(null);
  const nextMetaRef = useRef(null);

  // Layers for 2 supporting images
  const currentSupportingRef = useRef(null);
  const nextSupportingRef = useRef(null);

  // Layers for description paragraph
  const currentDescRef = useRef(null);
  const nextDescRef = useRef(null);

  // Preload all service images into cache
  useEffect(() => {
    SERVICES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
      s.supportingImages.forEach((src) => {
        const sub = new Image();
        sub.src = src;
      });
    });
  }, []);

  const changeService = (targetIdx) => {
    if (isAnimatingRef.current || targetIdx === currentIdx) return;
    isAnimatingRef.current = true;
    setNextIdx(targetIdx);
  };

  const handleNext = () => {
    const next = (currentIdx + 1) % SERVICES.length;
    changeService(next);
  };

  const handlePrev = () => {
    const prev = (currentIdx - 1 + SERVICES.length) % SERVICES.length;
    changeService(prev);
  };

  // Automatically change to the next service every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimatingRef.current) {
        const next = (currentIdx + 1) % SERVICES.length;
        changeService(next);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIdx]);

  // GSAP Transition: Physical slide-in from LEFT -> RIGHT
  useEffect(() => {
    if (nextIdx === null) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentIdx(nextIdx);
          setNextIdx(null);
          isAnimatingRef.current = false;
        },
      });

      // 1. MAIN LARGE IMAGE: Enters from LEFT -> RIGHT (-100% -> 0)
      if (currentImgRef.current && nextImgRef.current) {
        gsap.set(nextImgRef.current, { xPercent: -100, opacity: 1, scale: 1 });

        tl.to(
          currentImgRef.current,
          {
            xPercent: 30,
            opacity: 0.15,
            scale: 0.96,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        ).to(
          nextImgRef.current,
          {
            xPercent: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        );
      }

      // 2. LARGE EDITORIAL TITLE: Enters from LEFT -> RIGHT (-80px -> 0)
      if (currentTitleRef.current && nextTitleRef.current) {
        gsap.set(nextTitleRef.current, { x: -80, opacity: 0 });

        tl.to(
          currentTitleRef.current,
          {
            x: 60,
            opacity: 0,
            duration: 0.45,
            ease: 'power2.in',
          },
          0.05
        ).to(
          nextTitleRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power2.out',
          },
          0.15
        );
      }

      // 3. 2 SUPPORTING IMAGES: Enters from LEFT -> RIGHT (-45px -> 0)
      if (currentSupportingRef.current && nextSupportingRef.current) {
        gsap.set(nextSupportingRef.current, { x: -45, opacity: 0 });

        tl.to(
          currentSupportingRef.current,
          {
            x: 35,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
          },
          0.08
        ).to(
          nextSupportingRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          0.2
        );
      }

      // 4. DESCRIPTION TEXT: Enters from LEFT -> RIGHT (-35px -> 0)
      if (currentDescRef.current && nextDescRef.current) {
        gsap.set(nextDescRef.current, { x: -35, opacity: 0 });

        tl.to(
          currentDescRef.current,
          {
            x: 25,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
          },
          0.1
        ).to(
          nextDescRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          0.24
        );
      }

      // 5. TOP SERVICE NUMBER & TITLE: Enters from LEFT -> RIGHT (-30px -> 0)
      if (currentMetaRef.current && nextMetaRef.current) {
        gsap.set(nextMetaRef.current, { x: -30, opacity: 0 });

        tl.to(
          currentMetaRef.current,
          {
            x: 20,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
          },
          0.12
        ).to(
          nextMetaRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out',
          },
          0.28
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [nextIdx]);

  const currentService = SERVICES[currentIdx];
  const nextService = nextIdx !== null ? SERVICES[nextIdx] : null;

  return (
    <section className="services-section" ref={sectionRef} id="services">
      <div className="services-container">
        {/* ===================================================
            LEFT COLUMN: ONE LARGE DOMINANT ARCHITECTURAL IMAGE
            =================================================== */}
        <div className="services-left-col">
          <div className="services-image-frame">
            <img
              ref={currentImgRef}
              src={currentService.image}
              alt={currentService.title}
              className="services-large-img"
            />
            {nextService && (
              <img
                ref={nextImgRef}
                src={nextService.image}
                alt={nextService.title}
                className="services-large-img img-incoming"
              />
            )}
          </div>
        </div>

        {/* ===================================================
            RIGHT COLUMN: EDITORIAL CONTENT & CONTROLS
            =================================================== */}
        <div className="services-right-col">
          {/* TOP ROW: Service Number & Title + "Our Services" */}
          <div className="services-top-row">
            <div className="services-meta-viewport">
              <h3 className="services-meta-title" ref={currentMetaRef}>
                {currentService.number}. {currentService.title}
              </h3>
              {nextService && (
                <h3 className="services-meta-title incoming" ref={nextMetaRef}>
                  {nextService.number}. {nextService.title}
                </h3>
              )}
            </div>

            <span className="services-top-badge">Our Services</span>
          </div>

          {/* MIDDLE ROW: 2 Supporting Images + Description */}
          <div className="services-middle-row">
            {/* 2 Supporting Images */}
            <div className="services-supporting-viewport">
              <div className="services-supporting-track" ref={currentSupportingRef}>
                {currentService.supportingImages.map((src, i) => (
                  <div key={i} className="services-sub-card">
                    <img src={src} alt="Architectural detail" />
                  </div>
                ))}
              </div>
              {nextService && (
                <div className="services-supporting-track incoming" ref={nextSupportingRef}>
                  {nextService.supportingImages.map((src, i) => (
                    <div key={i} className="services-sub-card">
                      <img src={src} alt="Architectural detail" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description Text */}
            <div className="services-desc-viewport">
              <p className="services-desc-text" ref={currentDescRef}>
                {currentService.description}
              </p>
              {nextService && (
                <p className="services-desc-text incoming" ref={nextDescRef}>
                  {nextService.description}
                </p>
              )}
            </div>
          </div>

          {/* BOTTOM ROW: Large Editorial Service Title + Navigation Controls */}
          <div className="services-bottom-row">
            <div className="services-title-viewport">
              <h2 className="services-editorial-title" ref={currentTitleRef}>
                {currentService.heading.map((line, i) => (
                  <span key={i} className="services-title-line">
                    {line}
                  </span>
                ))}
              </h2>
              {nextService && (
                <h2 className="services-editorial-title incoming" ref={nextTitleRef}>
                  {nextService.heading.map((line, i) => (
                    <span key={i} className="services-title-line">
                      {line}
                    </span>
                  ))}
                </h2>
              )}
            </div>

            {/* Circular Navigation Buttons */}
            <div className="services-nav-controls">
              <button
                type="button"
                className="services-nav-btn btn-prev"
                onClick={handlePrev}
                aria-label="Previous service"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                className="services-nav-btn btn-next"
                onClick={handleNext}
                aria-label="Next service"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Clear Section Boundary Divider */}
        <div className="services-bottom-divider-wrap" aria-hidden="true">
          <div className="services-divider-line" />
          <span className="services-divider-diamond">✦</span>
          <div className="services-divider-line" />
        </div>
      </div>
    </section>
  );
}
