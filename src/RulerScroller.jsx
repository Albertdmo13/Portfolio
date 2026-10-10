import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './RulerScroller.css';

const RulerScroller = ({ label = "HERO", heroHeight = 0 }) => {
  const [activeSectionName, setActiveSectionName] = useState((label || "HERO").toUpperCase());
  const [sectionsData, setSectionsData] = useState([]);

  // Butter-smooth scroll tracking with Framer Motion
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001
  });

  const activeTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const [percentString, setPercentString] = useState("000%");

  // Update percent readout as scroll progresses
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((v) => {
      setPercentString(Math.round(v * 100).toString().padStart(3, '0') + '%');
    });
    return unsubscribe;
  }, [smoothProgress]);

  // Robust calculation of section coordinates
  const calculateSections = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const totalScrollable = scrollHeight - window.innerHeight;

    if (totalScrollable <= 0) return;

    const sections = Array.from(document.querySelectorAll('.section'));
    const heroName = (label || "HERO").toUpperCase();

    // Top section is always the HERO starting at 0%
    const data = [
      { id: 'hero', name: heroName, percentage: 0 }
    ];

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;

      let percentage = (absoluteTop / totalScrollable) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      const titleEl = sec.querySelector('.section-label');
      const name = titleEl ? titleEl.textContent.trim() : sec.id;
      data.push({
        id: sec.id,
        name: name.toUpperCase(),
        percentage
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

    setSectionsData(data);
  }, [label]);

  // Accurate Active Section Detection based on current scroll position
  const updateActiveSection = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const heroThreshold = heroHeight > 0 ? heroHeight * 0.55 : 300;

    // Inside the Hero section
    if (scrollY < heroThreshold) {
      setActiveSectionName((label || "HERO").toUpperCase());
      return;
    }

    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    // When user reached the bottom of the page, activate the last section
    if (window.innerHeight + scrollY >= scrollHeight - 60) {
      const sections = document.querySelectorAll('.section');
      if (sections.length > 0) {
        const lastSec = sections[sections.length - 1];
        const titleEl = lastSec.querySelector('.section-label');
        const name = titleEl ? titleEl.textContent.trim() : lastSec.id;
        setActiveSectionName(name.toUpperCase());
        return;
      }
    }

    // Section at reading focus line (35% from viewport top)
    const focusY = window.innerHeight * 0.35;
    const sections = Array.from(document.querySelectorAll('.section'));
    let currentActive = null;

    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= focusY && rect.bottom > focusY) {
        currentActive = sec;
        break;
      }
    }

    if (!currentActive) {
      let closestDist = Infinity;
      for (const sec of sections) {
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
      setActiveSectionName(name.toUpperCase());
    }
  }, [label, heroHeight]);

  // Recalculate coordinates whenever layout changes or hero expands
  useEffect(() => {
    calculateSections();
    updateActiveSection();

    // Staggered timers to ensure coordinates are accurate as images, fonts, and loader resolve
    const t1 = setTimeout(() => { calculateSections(); updateActiveSection(); }, 200);
    const t2 = setTimeout(() => { calculateSections(); updateActiveSection(); }, 600);
    const t3 = setTimeout(() => { calculateSections(); updateActiveSection(); }, 1300);
    const t4 = setTimeout(() => { calculateSections(); updateActiveSection(); }, 2200);

    // Watch for document body resize shifts (images loading, content expanding)
    const resizeObserver = new ResizeObserver(() => {
      calculateSections();
      updateActiveSection();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    window.addEventListener('resize', calculateSections);
    window.addEventListener('scroll', updateActiveSection, { passive: true });

    if (window.lenis) {
      window.lenis.on('scroll', updateActiveSection);
    }

    // Listen to document font loading
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        calculateSections();
        updateActiveSection();
      });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateSections);
      window.removeEventListener('scroll', updateActiveSection);
      if (window.lenis) {
        window.lenis.off('scroll', updateActiveSection);
      }
    };
  }, [calculateSections, updateActiveSection, heroHeight]);

  const handleSectionClick = (secId) => {
    if (secId === 'hero') {
      if (window.lenis) {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const el = document.getElementById(secId);
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el);
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const totalTicks = 101; // 0 to 100

  return (
    <div className="ruler-scroller">
      <div className="ruler-ticks">
        {/* Background Static Ticks */}
        {Array.from({ length: totalTicks }).map((_, index) => {
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
        })}

        {/* Section Title Markers */}
        {sectionsData.map((sec) => {
          const isActive = activeSectionName === sec.name;
          return (
            <div
              key={sec.id}
              className={`ruler-section-marker ${isActive ? 'active' : ''}`}
              style={{ top: `${sec.percentage}%` }}
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
          <span className="ruler-label active-label">
            {percentString}
          </span>
          <div className="ruler-line active-line" />
        </motion.div>
      </div>
    </div>
  );
};

export default RulerScroller;
