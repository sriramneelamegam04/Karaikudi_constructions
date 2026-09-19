import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Hanging lantern and luxury architectural assets
import hangingLampImg from '../../images/hanging_lamp.png';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    number: '01.',
    title: ['Chettinad', 'Expertise'],
    description:
      'Deep understanding of Chettinad architecture, traditional proportions, spatial planning, craftsmanship, and the way these principles can be adapted for modern living.',
  },
  {
    number: '02.',
    title: ['Authentic', 'Materials'],
    description:
      'We work with lime plaster, Semmann red-earth bricks, Athangudi tiles, natural stone, timber, and other materials that give each home its authentic character.',
  },
  {
    number: '03.',
    title: ['Climate', 'Responsive'],
    description:
      'Courtyards, shaded verandahs, high ceilings, natural ventilation, and thoughtful orientation create comfortable homes that work naturally with the Tamil climate.',
  },
  {
    number: '04.',
    title: ['Craftsmanship', 'Driven'],
    description:
      'Traditional details are carefully executed through skilled craftsmanship, from handcrafted timber and tilework to lime finishes and architectural elements.',
  },
  {
    number: '05.',
    title: ['Built Around', 'You'],
    description:
      'Every home is thoughtfully shaped around your site, lifestyle, family, aspirations, and the way you want to experience traditional Chettinad living today.',
  },
];

export default function WhyChooseUsSection() {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const stackDeckRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP & TABLET (> 768px)
      // ==========================================
      mm.add('(min-width: 769px)', () => {
        // Card 0 starts visible and active at the top of the stack
        gsap.set(cardRefs.current[0], {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          zIndex: 1,
        });

        // Subsequent cards start poised below the stack viewport
        for (let i = 1; i < CARDS.length; i++) {
          gsap.set(cardRefs.current[i], {
            yPercent: 125,
            scale: 0.98,
            opacity: 0,
            zIndex: i + 1,
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: '+=220%',
            pin: stageRef.current,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const stepDuration = 1;

        // Transition 1: Card 2 stacks over Card 1
        tl.to(
          cardRefs.current[0],
          {
            scale: 0.94,
            yPercent: -4,
            opacity: 0.55,
            ease: 'power1.out',
            duration: stepDuration,
          },
          0
        ).to(
          cardRefs.current[1],
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            ease: 'power1.out',
            duration: stepDuration,
          },
          0
        );

        // Transition 2: Card 3 stacks over Card 2
        tl.to(
          cardRefs.current[0],
          {
            scale: 0.88,
            yPercent: -8,
            opacity: 0.25,
            ease: 'power1.out',
            duration: stepDuration,
          },
          1
        )
          .to(
            cardRefs.current[1],
            {
              scale: 0.94,
              yPercent: -4,
              opacity: 0.55,
              ease: 'power1.out',
              duration: stepDuration,
            },
            1
          )
          .to(
            cardRefs.current[2],
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              ease: 'power1.out',
              duration: stepDuration,
            },
            1
          );

        // Transition 3: Card 4 stacks over Card 3
        tl.to(
          cardRefs.current[0],
          {
            scale: 0.82,
            yPercent: -12,
            opacity: 0,
            ease: 'power1.out',
            duration: stepDuration,
          },
          2
        )
          .to(
            cardRefs.current[1],
            {
              scale: 0.88,
              yPercent: -8,
              opacity: 0.25,
              ease: 'power1.out',
              duration: stepDuration,
            },
            2
          )
          .to(
            cardRefs.current[2],
            {
              scale: 0.94,
              yPercent: -4,
              opacity: 0.55,
              ease: 'power1.out',
              duration: stepDuration,
            },
            2
          )
          .to(
            cardRefs.current[3],
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              ease: 'power1.out',
              duration: stepDuration,
            },
            2
          );

        // Transition 4: Card 5 stacks over Card 4
        tl.to(
          cardRefs.current[1],
          {
            scale: 0.82,
            yPercent: -12,
            opacity: 0,
            ease: 'power1.out',
            duration: stepDuration,
          },
          3
        )
          .to(
            cardRefs.current[2],
            {
              scale: 0.88,
              yPercent: -8,
              opacity: 0.25,
              ease: 'power1.out',
              duration: stepDuration,
            },
            3
          )
          .to(
            cardRefs.current[3],
            {
              scale: 0.94,
              yPercent: -4,
              opacity: 0.55,
              ease: 'power1.out',
              duration: stepDuration,
            },
            3
          )
          .to(
            cardRefs.current[4],
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              ease: 'power1.out',
              duration: stepDuration,
            },
            3
          );
      });

      // ==========================================
      // MOBILE (<= 768px)
      // ==========================================
      mm.add('(max-width: 768px)', () => {
        gsap.set(cardRefs.current[0], {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          zIndex: 1,
        });

        for (let i = 1; i < CARDS.length; i++) {
          gsap.set(cardRefs.current[i], {
            yPercent: 120,
            scale: 0.98,
            opacity: 0,
            zIndex: i + 1,
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: '+=170%',
            pin: stageRef.current,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const stepDuration = 1;

        // 1 over 0
        tl.to(
          cardRefs.current[0],
          {
            scale: 0.95,
            yPercent: -3,
            opacity: 0.5,
            duration: stepDuration,
          },
          0
        ).to(
          cardRefs.current[1],
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            duration: stepDuration,
          },
          0
        );

        // 2 over 1
        tl.to(cardRefs.current[0], { opacity: 0.15, scale: 0.9, duration: stepDuration }, 1)
          .to(
            cardRefs.current[1],
            {
              scale: 0.95,
              yPercent: -3,
              opacity: 0.5,
              duration: stepDuration,
            },
            1
          )
          .to(
            cardRefs.current[2],
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              duration: stepDuration,
            },
            1
          );

        // 3 over 2
        tl.to(cardRefs.current[0], { opacity: 0, duration: stepDuration }, 2)
          .to(cardRefs.current[1], { opacity: 0.15, scale: 0.9, duration: stepDuration }, 2)
          .to(
            cardRefs.current[2],
            {
              scale: 0.95,
              yPercent: -3,
              opacity: 0.5,
              duration: stepDuration,
            },
            2
          )
          .to(
            cardRefs.current[3],
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              duration: stepDuration,
            },
            2
          );

        // 4 over 3
        tl.to(cardRefs.current[1], { opacity: 0, duration: stepDuration }, 3)
          .to(cardRefs.current[2], { opacity: 0.15, scale: 0.9, duration: stepDuration }, 3)
          .to(
            cardRefs.current[3],
            {
              scale: 0.95,
              yPercent: -3,
              opacity: 0.5,
              duration: stepDuration,
            },
            3
          )
          .to(
            cardRefs.current[4],
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              duration: stepDuration,
            },
            3
          );
      });

      return () => {
        mm.revert();
      };
    },
    { scope: wrapperRef }
  );

  return (
    <div className="why-choose-us-wrapper" ref={wrapperRef} id="why-choose-us">
      <section className="why-choose-us-stage" ref={stageRef}>
        <div className="why-content-container">
          {/* ===================================================
              LEFT SIDE: HANGING LAMP & FIXED EDITORIAL CONTENT
              =================================================== */}
          <div className="why-left-column-group">
            {/* Architectural Hanging Lanterns with Wind Sway Motion */}
            <div className="why-hanging-lamp-container" aria-hidden="true">
              <div className="why-hanging-lamp-anchor">
                {/* Chains extending straight down from ceiling to each lamp's top attachment */}
                <div className="why-lamp-chains-mount">
                  <div className="why-lamp-chain why-chain-left" />
                  <div className="why-lamp-chain why-chain-right" />
                </div>
                {/* Lantern Body with Warm Ambient Glows */}
                <div className="why-lamp-body">
                  <div className="why-lamp-glow why-glow-large" />
                  <div className="why-lamp-glow why-glow-small" />
                  <img
                    src={hangingLampImg}
                    alt="Traditional Chettinad architectural hanging lantern"
                    className="why-lamp-img"
                  />
                </div>
              </div>
            </div>

            <div className="why-col-left">
              <span className="why-eyebrow">
                <span className="why-eyebrow-dot" aria-hidden="true" />
                Why Choose Us
              </span>

              <h2 className="why-heading">
                Tradition <br />
                With Purpose
              </h2>

              <p className="why-description">
                We combine traditional Chettinad architectural knowledge with
                contemporary construction practices to create homes that are authentic,
                comfortable, and built for generations.
              </p>
            </div>
          </div>

          {/* ===================================================
              RIGHT SIDE: STACKED GLASSMORPHISM CARDS DECK
              =================================================== */}
          <div className="why-col-right">
            <div className="why-stack-deck" ref={stackDeckRef}>
              {CARDS.map((card, idx) => (
                <div
                  key={card.number}
                  className="why-glass-card why-stacked-card"
                  ref={(el) => (cardRefs.current[idx] = el)}
                  style={{ zIndex: idx + 1 }}
                >
                  <div className="why-card-top-row">
                    <span className="why-card-number">{card.number}</span>
                    <span className="why-card-badge">{`0${idx + 1} / 0${CARDS.length}`}</span>
                  </div>
                  <h3 className="why-card-title">
                    {card.title.map((line, i) => (
                      <span key={i} className="why-card-title-line">
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="why-card-desc">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
