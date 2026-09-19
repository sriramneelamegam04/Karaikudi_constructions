import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const NUM_SEGMENTS = 6;

export default function Segmented3DCube({ images, containerRef }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1);

  const sceneRef = useRef(null);
  const colsRef = useRef([]);
  const facesARef = useRef([]);
  const facesBRef = useRef([]);
  const shadowsARef = useRef([]);
  const shadowsBRef = useRef([]);
  const imgsARef = useRef([]);
  const imgsBRef = useRef([]);

  useEffect(() => {
    // 1. Preload all images into browser cache to guarantee zero flicker
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    let isTransitioning = false;
    let activeIdx = 0;
    let delayedTimer = null;

    // Helper to calculate segment geometry from the container's current width
    const getGeometry = () => {
      const totalWidth =
        (containerRef?.current && containerRef.current.offsetWidth) ||
        (sceneRef.current && sceneRef.current.offsetWidth) ||
        window.innerWidth;
      const segWidth = totalWidth / NUM_SEGMENTS;
      const halfDepth = segWidth / 2;
      return { segWidth, halfDepth };
    };

    // Initialize 3D column positions
    const initColumns = () => {
      const { halfDepth } = getGeometry();

      colsRef.current.forEach((col, i) => {
        if (!col) return;
        gsap.set(col, {
          z: -halfDepth,
          rotateY: 0,
        });

        if (facesARef.current[i]) {
          gsap.set(facesARef.current[i], {
            transform: `translateZ(${halfDepth}px) rotateY(0deg)`,
          });
        }

        if (facesBRef.current[i]) {
          gsap.set(facesBRef.current[i], {
            transform: `rotateY(90deg) translateZ(${halfDepth}px)`,
          });
        }

        if (shadowsARef.current[i]) gsap.set(shadowsARef.current[i], { opacity: 0 });
        if (shadowsBRef.current[i]) gsap.set(shadowsBRef.current[i], { opacity: 0 });
      });
    };

    initColumns();

    // Perform the segmented 3D cube wave transition
    const performTransition = () => {
      if (isTransitioning) return;
      isTransitioning = true;

      const incomingIdx = (activeIdx + 1) % images.length;

      // Ensure Face B has the incoming image ready
      imgsBRef.current.forEach((img) => {
        if (img) img.src = images[incomingIdx];
      });
      setNextIdx(incomingIdx);

      const { halfDepth } = getGeometry();

      // Configure initial 3D transform for all columns before animation starts
      colsRef.current.forEach((col, i) => {
        if (!col) return;
        gsap.set(col, {
          z: -halfDepth,
          rotateY: 0,
        });
        if (facesARef.current[i]) {
          gsap.set(facesARef.current[i], {
            transform: `translateZ(${halfDepth}px) rotateY(0deg)`,
          });
        }
        if (facesBRef.current[i]) {
          gsap.set(facesBRef.current[i], {
            transform: `rotateY(90deg) translateZ(${halfDepth}px)`,
          });
        }
        if (shadowsARef.current[i]) gsap.set(shadowsARef.current[i], { opacity: 0 });
        if (shadowsBRef.current[i]) gsap.set(shadowsBRef.current[i], { opacity: 0.4 });
      });

      const tl = gsap.timeline({
        onComplete: () => {
          activeIdx = incomingIdx;
          setCurrentIdx(incomingIdx);

          // Update Face A images to the new current image
          imgsARef.current.forEach((img) => {
            if (img) img.src = images[incomingIdx];
          });

          // Reset all columns seamlessly back to 0deg
          colsRef.current.forEach((col, i) => {
            if (!col) return;
            gsap.set(col, { rotateY: 0, z: -halfDepth });
            if (facesARef.current[i]) {
              gsap.set(facesARef.current[i], {
                transform: `translateZ(${halfDepth}px) rotateY(0deg)`,
              });
            }
            if (facesBRef.current[i]) {
              gsap.set(facesBRef.current[i], {
                transform: `rotateY(90deg) translateZ(${halfDepth}px)`,
              });
            }
            if (shadowsARef.current[i]) gsap.set(shadowsARef.current[i], { opacity: 0 });
            if (shadowsBRef.current[i]) gsap.set(shadowsBRef.current[i], { opacity: 0 });
          });

          isTransitioning = false;
          // Schedule next transition after 4.5 seconds
          delayedTimer = gsap.delayedCall(4.5, performTransition);
        },
      });

      // 1. Staggered 3D Rotation (rotateY: 0 -> -90deg)
      tl.to(
        colsRef.current,
        {
          rotateY: -90,
          duration: 0.85,
          stagger: 0.07,
          ease: 'power2.inOut',
        },
        0
      );

      // 2. Subtle Z-recession so the rotating corners stay within the scene plane
      tl.to(
        colsRef.current,
        {
          z: -halfDepth - halfDepth * 0.32,
          duration: 0.42,
          stagger: 0.07,
          ease: 'power1.out',
        },
        0
      );
      tl.to(
        colsRef.current,
        {
          z: -halfDepth,
          duration: 0.43,
          stagger: 0.07,
          ease: 'power1.in',
        },
        0.42
      );

      // 3. Dynamic directional lighting on turning faces
      tl.to(
        shadowsARef.current,
        {
          opacity: 0.45,
          duration: 0.85,
          stagger: 0.07,
          ease: 'power2.inOut',
        },
        0
      );
      tl.to(
        shadowsBRef.current,
        {
          opacity: 0,
          duration: 0.85,
          stagger: 0.07,
          ease: 'power2.inOut',
        },
        0
      );
    };

    // First transition triggers after 4.5s
    delayedTimer = gsap.delayedCall(4.5, performTransition);

    const handleResize = () => {
      if (!isTransitioning) {
        initColumns();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (delayedTimer) delayedTimer.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, [images, containerRef]);

  return (
    <div className="segmented-cube-scene" ref={sceneRef}>
      {Array.from({ length: NUM_SEGMENTS }).map((_, i) => {
        const leftPercent = (i / NUM_SEGMENTS) * 100;
        const widthPercent = 100 / NUM_SEGMENTS;
        const imgLeftOffset = -i * 100; // Shift inner image by -i segment widths

        return (
          <div
            key={i}
            className="segment-col-wrapper"
            style={{
              left: `${leftPercent}%`,
              width: `calc(${widthPercent}% + 0.6px)`,
            }}
          >
            <div
              className="segment-cube-box"
              ref={(el) => (colsRef.current[i] = el)}
            >
              {/* FACE A: CURRENT IMAGE STRIP */}
              <div
                className="segment-face segment-face-a"
                ref={(el) => (facesARef.current[i] = el)}
              >
                <div
                  className="segment-img-crop"
                  style={{
                    width: `${NUM_SEGMENTS * 100}%`,
                    left: `${imgLeftOffset}%`,
                  }}
                >
                  <img
                    ref={(el) => (imgsARef.current[i] = el)}
                    src={images[currentIdx]}
                    alt="Luxury Architectural Estate"
                    className="segment-img"
                  />
                </div>
                <div
                  className="segment-shadow"
                  ref={(el) => (shadowsARef.current[i] = el)}
                />
              </div>

              {/* FACE B: NEXT IMAGE STRIP */}
              <div
                className="segment-face segment-face-b"
                ref={(el) => (facesBRef.current[i] = el)}
              >
                <div
                  className="segment-img-crop"
                  style={{
                    width: `${NUM_SEGMENTS * 100}%`,
                    left: `${imgLeftOffset}%`,
                  }}
                >
                  <img
                    ref={(el) => (imgsBRef.current[i] = el)}
                    src={images[nextIdx]}
                    alt="Luxury Architectural Estate"
                    className="segment-img"
                  />
                </div>
                <div
                  className="segment-shadow"
                  ref={(el) => (shadowsBRef.current[i] = el)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
