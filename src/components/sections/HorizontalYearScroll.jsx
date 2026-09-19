import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HorizontalYearScroll.css";

// High-resolution architectural photography assets
import projectImg1 from "../../../images/image3.png";
import projectImg2 from "../../../images/image6.png";
import projectImg3 from "../../../images/image7.png";
import projectImg4 from "../../../images/image8.png";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ *
 *  Layout constants — the JS measurement and the inline styles read
 *  from the same numbers so they can never drift apart.
 * ------------------------------------------------------------------ */
const PAD_LEFT = 0.06; // display name's resting left offset  (6vw)
const PAD_RIGHT = 0.05; // vertical name's right margin        (5vw)
const PAD_BOTTOM = 0.09; // display name's bottom offset        (9vh)

/* Each project:
 *   name      – the large type that rotates out (keep it short-ish)
 *   display   – optional override if `name` is too long for the big type
 *   location  – small line above the title
 *   title     – the project's given name
 *   body      – one or two sentences, no more
 *   specs     – short facts, rendered as a rule-separated row
 */
const DEFAULT_PROJECTS = [
  {
    name: "Heritage Courtyard Residence",
    location: "Karaikudi, Chettinad",
    title: "The Athangudi Palace Villa",
    body: "Handcrafted Athangudi tile flooring, double-height teak colonnades, and cross-ventilated verandas designed for timeless comfort.",
    specs: ["4 Beds", "4 Baths", "5,400 sq.ft", "Dual Courtyards"],
    image: projectImg1,
    alt: "Teak colonnade and courtyard of the Heritage Courtyard Residence",
    bg: "#2A2320",
  },
  {
    name: "Thinnai House",
    location: "Kanadukathan, Chettinad",
    title: "The Verandah Residence",
    body: "A raised thinnai wraps the entrance, shading the interior through the afternoon and opening the house to the street in the evening.",
    specs: ["3 Beds", "3 Baths", "3,850 sq.ft", "Raised Thinnai"],
    image: projectImg2,
    alt: "Raised thinnai verandah with carved timber columns",
    bg: "#3A2B22",
  },
  {
    name: "Lime Plaster Villa",
    location: "Devakottai, Chettinad",
    title: "The Kottan House",
    body: "Walls finished in hand-burnished lime plaster, laid over a modern structural frame that carries the spans a traditional wall could not.",
    specs: ["4 Beds", "5 Baths", "6,200 sq.ft", "Central Courtyard"],
    image: projectImg3,
    alt: "Hand-burnished lime plaster wall in raking afternoon light",
    bg: "#332A24",
  },
  {
    name: "Red Earth Farmhouse",
    location: "Pallathur, Chettinad",
    title: "The Kalam Residence",
    body: "Built on red earth with a traditional roof form, sized for a family that wanted the mansion proportions without the mansion footprint.",
    specs: ["3 Beds", "3 Baths", "4,100 sq.ft", "Open Kalam"],
    image: projectImg4,
    alt: "Traditional pitched roof farmhouse on red earth",
    bg: "#2E211B",
  },
];

export default function HorizontalYearScroll({ projects = DEFAULT_PROJECTS }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  useLayoutEffect(() => {
    const total = projects.length;
    if (total < 2) return;

    const mm = gsap.matchMedia();

    /* Horizontal storytelling only runs when motion is welcome.
       With reduced motion the panels simply stack — see the CSS at the
       bottom of this file. */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const names = gsap.utils.toArray(".hys-display", track);

      const distance = () => window.innerWidth * (total - 1);
      // Rotated names read better a little smaller, and need more of the
      // available height on narrow screens.
      const vertScale = () => (window.innerWidth < 768 ? 0.6 : 0.46);

      gsap.set(names, { transformOrigin: "left bottom" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track, { x: () => -distance(), duration: total - 1 }, 0);

      names.forEach((el, i) => {
        // The last name never rotates — there is no panel after it to
        // form the L with, so it stays horizontal as the final image.
        if (i === total - 1) return;

        tl.fromTo(
          el,
          { rotate: 0, x: 0, scale: 1 },
          {
            rotate: -90,
            scale: vertScale,
            /* After a -90° turn about the left-bottom origin the element
               hangs up and to the LEFT of that origin, so its right edge
               sits exactly on the origin. Pushing the origin to
               (100% - PAD_RIGHT) lands the whole thing flush against the
               panel's right edge, bottom still aligned. */
            x: () => window.innerWidth * (1 - PAD_RIGHT - PAD_LEFT),
            duration: 0.55,
          },
          i
        );
      });

      if (progressRef.current) {
        tl.fromTo(
          progressRef.current,
          { scaleX: 1 / total },
          { scaleX: 1, duration: total - 1 },
          0
        );
      }
    });

    // Web fonts change the width of the name, which changes where the
    // rotated copy lands. Re-measure once they're in.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => mm.revert();
  }, [projects]);

  return (
    <section
      ref={sectionRef}
      aria-label="Selected projects"
      className="hys-section relative h-screen w-full overflow-hidden bg-[#2A2320] text-[#F5EFE4]"
    >
      <div ref={trackRef} className="hys-track flex h-full will-change-transform">
        {projects.map((p) => (
          <article
            key={p.title}
            className="hys-panel relative h-full w-screen shrink-0 overflow-hidden"
            style={{ backgroundColor: p.bg }}
          >
            {/* The image is the panel. Everything else sits on top of it. */}
            <img
              src={p.image}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              className="hys-img-bg absolute inset-0 h-full w-full object-cover"
            />

            {/* Two scrims in one: the bottom is lifted for the type, and a
                light wash over the whole frame keeps ivory text readable
                even over a bright image. */}
            <div
              aria-hidden="true"
              className="hys-scrim absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(20,15,12,0.92) 0%, rgba(20,15,12,0.72) 26%, rgba(20,15,12,0.18) 58%, rgba(20,15,12,0.30) 100%)",
              }}
            />

            {/* Large project name — this is the element that rotates. */}
            <h3
              className="hys-display pointer-events-none absolute z-20 m-0 select-none font-semibold leading-[0.92] tracking-[-0.03em] will-change-transform"
              style={{
                left: `${PAD_LEFT * 100}vw`,
                bottom: `${PAD_BOTTOM * 100}vh`,
                width: "max-content",
                maxWidth: "34vw",
                fontSize: "clamp(1.75rem, 5.2vw, 5rem)",
                textWrap: "balance",
              }}
            >
              {p.display ?? p.name}
            </h3>

            {/* Written detail. Held clear of the right-hand lane the
                rotated name moves into. */}
            <div className="hys-details absolute bottom-[42vh] right-[18vw] z-20 w-[min(38ch,44vw)] md:bottom-[9vh] md:right-[15vw]">
              <p className="hys-location m-0 text-[clamp(0.72rem,0.85vw,0.9rem)] tracking-[0.12em] text-[#E0C9A6]">
                {p.location}
              </p>

              <h4 className="hys-title mb-0 mt-3 text-[clamp(1.25rem,2.1vw,2rem)] font-normal leading-tight tracking-tight">
                {p.title}
              </h4>

              <p className="hys-body mt-4 text-[clamp(0.88rem,1vw,1.02rem)] leading-relaxed text-[#F5EFE4]/75">
                {p.body}
              </p>

              {p.specs?.length > 0 && (
                <ul className="hys-specs m-0 mt-6 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-[clamp(0.75rem,0.9vw,0.92rem)] text-[#F5EFE4]/85">
                  {p.specs.map((s, i) => (
                    <li
                      key={s}
                      className={`hys-spec-item ${
                        i === 0 ? "" : "border-l border-[#F5EFE4]/25 pl-5"
                      }`}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Thin progress rule, pinned above the panels */}
      <div className="hys-progress-track pointer-events-none absolute bottom-[4vh] left-[6vw] right-[5vw] z-30 h-px bg-[#F5EFE4]/20">
        <div
          ref={progressRef}
          className="hys-progress-bar h-full origin-left bg-[#E0C9A6]"
          style={{ transform: "scaleX(0.25)" }}
        />
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .hys-section { height: auto; }
          .hys-track  { display: block; }
          .hys-panel  { width: 100%; height: 100svh; }
        }
      `}</style>
    </section>
  );
}
