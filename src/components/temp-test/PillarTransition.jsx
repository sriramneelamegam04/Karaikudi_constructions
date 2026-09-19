import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import pillarImg from '../../../images/pillar.png';
import './PillarTransition.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * PillarTransition
 * -----------------
 * A scroll-driven bridge section: two pillars rise up from the bottom
 * center of the viewport, hold together for a beat, then travel outward
 * to the left/right edges of the section — unveiling the Home section
 * content that sits behind/after them.
 *
 * Usage: drop this between <ServicesSection /> and <HomeSection /> (or
 * wherever the transition should live). It pins itself for the duration
 * of its own scroll distance, then releases naturally into normal flow.
 *
 *   <ServicesSection />
 *   <PillarTransition />
 *   <HomeSection />
 *
 * Pillar art: uses your pillar.png (place it at ./assets/pillar.png next
 * to this component, or update the import path below). Both pillars
 * reuse the same source image — the right one is mirrored via CSS
 * (`scaleX(-1)` in PillarTransition.css) so the pair reads as a matched
 * set rather than two identical copies facing the same way.
 *
 * Tuning knobs are called out inline — offset distance, corner distance,
 * hold length, ease, and pin distance (`end: '+=140%'`).
 */

export default function PillarTransition() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Together offset: how close the two pillars sit to center before
        // they split. Corner offset: final resting distance from center.
        const TOGETHER_OFFSET = 150; // px, each side — bump this if pillar width grows
        const CORNER_OFFSET = '42vw'; // near the section edges

        gsap.set(leftRef.current, { xPercent: -50, x: -TOGETHER_OFFSET, yPercent: 100, opacity: 0 });
        gsap.set(rightRef.current, { xPercent: -50, x: TOGETHER_OFFSET, yPercent: 100, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=140%', // total pinned scroll distance — increase for a slower reveal
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            // markers: true, // uncomment while tuning
          },
        });

        tl.to(
          [leftRef.current, rightRef.current],
          { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        )
          .to({}, { duration: 0.15 }) // brief hold once risen, before the split begins
          .to(leftRef.current, { x: `-${CORNER_OFFSET}`, duration: 0.55, ease: 'power3.inOut' }, '>')
          .to(rightRef.current, { x: CORNER_OFFSET, duration: 0.55, ease: 'power3.inOut' }, '<');
      });

      // Reduced motion: skip the pin/scrub entirely, show pillars already
      // resting at the corners as a static frame.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(leftRef.current, { xPercent: -50, x: '-42vw', yPercent: 0, opacity: 1 });
        gsap.set(rightRef.current, { xPercent: -50, x: '42vw', yPercent: 0, opacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="pillar-transition" aria-hidden="true">
      <div className="pillar-transition__bg" />

      <div ref={leftRef} className="pillar pillar--left">
        <img src={pillarImg} alt="" className="pillar-image" draggable="false" />
      </div>

      <div ref={rightRef} className="pillar pillar--right">
        <img src={pillarImg} alt="" className="pillar-image pillar-image--mirrored" draggable="false" />
      </div>
    </section>
  );
}
