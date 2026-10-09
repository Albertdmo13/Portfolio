import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import './RulerScroller.css';

const RulerScroller = ({ label = "PORTFOLIO" }) => {
  const [activeSectionName, setActiveSectionName] = useState(label);
  
  // Butter-smooth scroll tracking with Framer Motion
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001
  });
  
  const activeTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  
  const [percentString, setPercentString] = useState("000%");

  useEffect(() => {
    // Update the text percentage efficiently
    const unsubscribe = smoothProgress.onChange((v) => {
      setPercentString(Math.round(v * 100).toString().padStart(3, '0') + '%');
    });
    return unsubscribe;
  }, [smoothProgress]);

  useEffect(() => {
    const visibilityMap = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        visibilityMap.set(entry.target, entry.intersectionRatio);
      });
      
      let mostVisible = null;
      let maxRatio = 0;
      
      visibilityMap.forEach((ratio, target) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisible = target;
        }
      });
      
      if (mostVisible && maxRatio > 0) {
        const titleEl = mostVisible.querySelector('.section-label');
        const name = titleEl ? titleEl.textContent : mostVisible.id;
        setActiveSectionName(name.toUpperCase());
      } else if (window.scrollY < 200) {
        setActiveSectionName(label.toUpperCase());
      }
    }, {
      root: null,
      rootMargin: '-20% 0px -40% 0px', // Trigger when well into the screen
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    });

    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => {
      visibilityMap.set(sec, 0);
      observer.observe(sec);
    });

    return () => observer.disconnect();
  }, [label]);

  const [sectionsData, setSectionsData] = useState([]);

  useEffect(() => {
    const calculateSections = () => {
      const sections = Array.from(document.querySelectorAll('.section'));
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const totalScrollable = scrollHeight - window.innerHeight;
      
      if (totalScrollable <= 0) return;

      const data = sections.map((sec) => {
        const rect = sec.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        
        let percentage = (absoluteTop / totalScrollable) * 100;
        percentage = Math.max(0, Math.min(100, percentage));

        const titleEl = sec.querySelector('.section-label');
        const name = titleEl ? titleEl.textContent : sec.id;
        return { id: sec.id, name: name.toUpperCase(), percentage };
      });
      
      // Also add the hero as the first section at 0%
      data.unshift({ id: 'hero', name: label.toUpperCase(), percentage: 0 });

      // Sort by percentage
      data.sort((a, b) => a.percentage - b.percentage);

      // Resolve overlaps (minimum 6% distance to prevent text overlap)
      const MIN_DIST = 6;
      for (let i = 1; i < data.length; i++) {
        if (data[i].percentage - data[i - 1].percentage < MIN_DIST) {
          data[i].percentage = data[i - 1].percentage + MIN_DIST;
        }
      }

      // If the last ones were pushed past 100, push them back up
      if (data[data.length - 1].percentage > 100) {
        let diff = data[data.length - 1].percentage - 100;
        for (let i = data.length - 1; i >= 0; i--) {
          data[i].percentage -= diff;
          if (i > 0 && data[i].percentage - data[i - 1].percentage < MIN_DIST) {
            diff += (MIN_DIST - (data[i].percentage - data[i - 1].percentage));
          } else {
            break; // resolved
          }
        }
      }
      
      setSectionsData(data);
    };

    calculateSections();
    const timeout = setTimeout(calculateSections, 800);
    window.addEventListener('resize', calculateSections);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', calculateSections);
    };
  }, [label]);

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
