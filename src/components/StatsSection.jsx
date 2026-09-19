import React, { useRef, useState, useEffect } from 'react';
import './StatsSection.css';

export const DEFAULT_STATS = [
  {
    value: 25,
    suffix: '+',
    title: 'Years of Construction Experience',
    description: 'Mastery in heritage Chettinad architecture & modern structural execution.',
  },
  {
    value: 15,
    suffix: '+',
    title: 'Homes & Projects',
    description: 'Custom villas, courtyard residences & bespoke heritage estates.',
  },
  {
    value: 10,
    suffix: 'k+',
    title: 'Traditional Craft Techniques',
    description: 'Handcrafted timber pillars, lime plaster & Athangudi tilework.',
  },
  {
    value: 20,
    suffix: '+',
    title: 'Site-Responsive Design',
    description: 'Climate-adaptive layouts with natural cooling and airflow.',
  },
];

function StatItem({ item, index, isTriggered }) {
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    if (!isTriggered) return;

    // Check prefers-reduced-motion
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setCurrentVal(item.value);
      return;
    }

    let animId;
    let startTime = null;
    const duration = 1800; // ms
    const delay = index * 120; // Staggered delay

    const timer = setTimeout(() => {
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Smooth easeOutExpo curve
        const ease =
          progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        const val = Math.round(ease * item.value);
        setCurrentVal(val);

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else {
          setCurrentVal(item.value);
        }
      };

      animId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isTriggered, item.value, index]);

  return (
    <div
      className={`framer-stat-col ${isTriggered ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="framer-stat-number-wrap">
        <span>{currentVal}</span>
        <span className="framer-stat-suffix">{item.suffix}</span>
      </div>
      <h3 className="framer-stat-title">{item.title}</h3>
      <p className="framer-stat-desc">{item.description}</p>
    </div>
  );
}

export default function StatsSection({ stats = DEFAULT_STATS, className = '' }) {
  const containerRef = useRef(null);
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTriggered) {
          setIsTriggered(true);
        }
      },
      { threshold: 0.05, rootMargin: '60px' }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [isTriggered]);

  return (
    <div className={`framer-stats-container ${className}`} ref={containerRef}>
      <div className="framer-stats-grid">
        {stats.map((item, index) => (
          <StatItem
            key={item.title}
            item={item}
            index={index}
            isTriggered={isTriggered}
          />
        ))}
      </div>
    </div>
  );
}
