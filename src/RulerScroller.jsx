import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './RulerScroller.css';

function ActivePercentText({ progress }) {
  const [percent, setPercent] = useState("000%");
  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      setPercent(Math.round(v * 100).toString().padStart(3, '0') + '%');
    });
    return unsub;
  }, [progress]);
  return <>{percent}</>;
}

const RulerScroller = ({
  label = "HERO",
  heroHeight = 0,
  visible = true
}) => {
  const [activeSectionName, setActiveSectionName] = useState((label || "HERO").toUpperCase());
  const [activeSectionAccent, setActiveSectionAccent] = useState(null);
  const [sectionsData, setSectionsData] = useState([]);
  const sectionsDataRef = useRef([]);

  // Butter-smooth scroll tracking with Framer Motion
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001
  });

  const activeTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Robust calculation of section coordinates
  const calculateSections = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const totalScrollable = scrollHeight - window.innerHeight;

    if (totalScrollable <= 0) return;

    // Query standard portfolio sections
    const rawSections = Array.from(document.querySelectorAll('.section'));
    const heroName = (label || "HERO").toUpperCase();

    // Top section is always the HERO starting at 0%
    const data = [
      { id: 'hero', name: heroName, percentage: 0, accentColor: null, isProject: false }
    ];

    rawSections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;

      let percentage = (absoluteTop / totalScrollable) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      const titleEl = sec.querySelector('.section-label');
      const name = titleEl ? titleEl.textContent.trim() : sec.id;

      data.push({
        id: sec.id,
        name: name.toUpperCase(),
        percentage,
        isProject: false,
        accentColor: null
      });
    });

    // Sort sections by percentage
    data.sort((a, b) => a.percentage - b.percentage);

    // Prevent visual label overlaps with a clean spacing buffer
    const MIN_DIST = 3.5;
    for (let i = 1; i < data.length; i++) {
      if (data[i].percentage - data[i - 1].percentage < MIN_DIST) {
        data[i].percentage = data[i - 1].percentage + MIN_DIST;
      }
    }

    // Push back gently if the last items overflow 100%
    if (data[data.length - 1].percentage > 100) {
      let overflow = data[data.length - 1].percentage - 100;
      for (let i = data.length - 1; i >= 0; i--) {
        data[i].percentage = Math.max(0, data[i].percentage - overflow);
        if (i > 0 && data[i].percentage - data[i - 1].percentage < MIN_DIST) {
          overflow = MIN_DIST - (data[i].percentage - data[i - 1].percentage);
        } else {
          break;
        }
      }
    }

    sectionsDataRef.current = data;
    setSectionsData((prev) => {
      if (
        prev.length === data.length &&
        prev.every(
          (p, i) =>
            p.id === data[i].id &&
            p.name === data[i].name &&
            Math.abs(p.percentage - data[i].percentage) < 0.05
        )
      ) {
        return prev;
      }
      return data;
    });
  }, [label]);

  // Accurate Active Section Detection based on current scroll position
  const updateActiveSection = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1200) return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const extraScroll = Math.max(0, heroHeight - window.innerHeight);
    const heroThreshold = heroHeight > 0
      ? extraScroll + (heroHeight - extraScroll) * 0.55
      : 300;

    // Inside the Hero section
    if (scrollY < heroThreshold) {
      const heroStr = (label || "HERO").toUpperCase();
      setActiveSectionName((prev) => (prev !== heroStr ? heroStr : prev));
      setActiveSectionAccent((prev) => (prev !== null ? null : prev));
      return;
    }

    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    // When user reached the bottom of the page, activate the last section
    if (window.innerHeight + scrollY >= scrollHeight - 60) {
      const curData = sectionsDataRef.current;
      if (curData.length > 0) {
        const lastSec = curData[curData.length - 1];
        setActiveSectionName((prev) => (prev !== lastSec.name ? lastSec.name : prev));
        setActiveSectionAccent((prev) => (prev !== lastSec.accentColor ? lastSec.accentColor : prev));
        return;
      }
    }

    // Section at reading focus line (35% from viewport top)
    const focusY = window.innerHeight * 0.35;
    const rawSections = Array.from(document.querySelectorAll('.section'));
    let currentActive = null;

    for (const sec of rawSections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= focusY && rect.bottom > focusY) {
        currentActive = sec;
        break;
      }
    }

    if (!currentActive) {
      let closestDist = Infinity;
      for (const sec of rawSections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= focusY) {
          const dist = focusY - rect.top;
          if (dist < closestDist) {
            closestDist = dist;
            currentActive = sec;
          }
        }
      }
    }

    if (currentActive) {
      const titleEl = currentActive.querySelector('.section-label');
      const name = titleEl ? titleEl.textContent.trim() : currentActive.id;
      const nextName = name.toUpperCase();

      setActiveSectionName((prev) => (prev !== nextName ? nextName : prev));
      setActiveSectionAccent(null);
    }
  }, [label, heroHeight]);

  // Recalculate coordinates whenever layout changes or hero expands
  useEffect(() => {
    let isMounted = true;

    calculateSections();
    updateActiveSection();

    // Staggered timers to ensure coordinates are accurate as layout and animations resolve
    const t1 = setTimeout(() => {
      if (!isMounted) return;
      calculateSections();
      updateActiveSection();
    }, 200);
    const t2 = setTimeout(() => {
      if (!isMounted) return;
      calculateSections();
      updateActiveSection();
    }, 600);
    const t3 = setTimeout(() => {
      if (!isMounted) return;
      calculateSections();
      updateActiveSection();
    }, 1200);

    // Watch for document body resize shifts (sections opening, collapsing)
    let roRaf = 0;
    const resizeObserver = new ResizeObserver(() => {
      if (!isMounted) return;
      if (roRaf) cancelAnimationFrame(roRaf);
      roRaf = requestAnimationFrame(() => {
        if (!isMounted) return;
        calculateSections();
        updateActiveSection();
      });
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    let ticking = false;
    const throttledUpdate = () => {
      if (!isMounted) return;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          if (!isMounted) return;
          updateActiveSection();
          ticking = false;
        });
      }
    };

    window.addEventListener('resize', calculateSections);
    window.addEventListener('scroll', throttledUpdate, { passive: true });

    // Listen to document font loading
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!isMounted) return;
        calculateSections();
        updateActiveSection();
      });
    }

    return () => {
      isMounted = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (roRaf) cancelAnimationFrame(roRaf);
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateSections);
      window.removeEventListener('scroll', throttledUpdate);
    };
  }, [calculateSections, updateActiveSection]);

  const handleSectionClick = (secId) => {
    if (secId === 'hero') {
      if (window.lenis) {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const el = document.getElementById(secId) || document.getElementById(`${secId}-section`);
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el, { offset: -40 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const totalTicks = 101; // 0 to 100

  const staticTicks = useMemo(() => {
    return Array.from({ length: totalTicks }).map((_, index) => {
      const isMajor = index % 10 === 0;
      return (
        <div 
          key={index} 
          className="ruler-tick-container"
          style={{ top: `${index}%` }}
        >
          {isMajor && (
            <span className="ruler-label major-label">
              {index.toString().padStart(2, '0')}
            </span>
          )}
          <div className={`ruler-line ${isMajor ? 'major' : 'minor'}`} />
        </div>
      );
    });
  }, [totalTicks]);

  return (
    <div className={`ruler-scroller ${!visible ? 'ruler-hidden' : ''}`}>
      <div className="ruler-ticks">
        {/* Background Static Ticks */}
        {staticTicks}

        {/* Section Title Markers */}
        {sectionsData.map((sec) => {
          const isActive = activeSectionName === sec.name;
          const markerColor = sec.accentColor || 'var(--accent-color)';
          return (
            <div
              key={sec.id}
              className={`ruler-section-marker ${isActive ? 'active' : ''} ${sec.isProject ? 'is-project-marker' : ''}`}
              style={{
                top: `${sec.percentage}%`,
                ...(isActive
                  ? {
                      color: markerColor,
                      fontWeight: 700
                    }
                  : {})
              }}
              onClick={() => handleSectionClick(sec.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSectionClick(sec.id);
                }
              }}
              title={`Scroll to ${sec.name}`}
            >
              {sec.name}
            </div>
          );
        })}

        {/* Floating Active Indicator */}
        <motion.div 
          className="ruler-tick-container active-indicator"
          style={{ top: activeTop }}
        >
          <span
            className="ruler-label active-label"
            style={{
              color: activeSectionAccent || 'var(--accent-color)',
              transition: 'color 0.25s ease'
            }}
          >
            <ActivePercentText progress={smoothProgress} />
          </span>
          <div
            className="ruler-line active-line"
            style={{
              backgroundColor: activeSectionAccent || 'var(--accent-color)',
              transition: 'background-color 0.25s ease, width 0.2s ease'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default RulerScroller;
