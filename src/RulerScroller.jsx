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
    // Intersection Observer for Sections
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
      let mostVisible = null;
      let maxRatio = 0;
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisible = entry.target;
        }
      });
      
      if (mostVisible) {
        const titleEl = mostVisible.querySelector('.section-label');
        const name = titleEl ? titleEl.textContent : mostVisible.id;
        setActiveSectionName(name.toUpperCase());
      } else if (window.scrollY < 200) {
        setActiveSectionName(label.toUpperCase());
      }
    }, {
      root: null,
      rootMargin: '-20% 0px -40% 0px', // Trigger when well into the screen
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(sec => observer.observe(sec));

    return () => observer.disconnect();
  }, [label]);

  const totalTicks = 101; // 0 to 100

  return (
    <div className="ruler-scroller">
      <div className="ruler-vertical-text">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSectionName}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeSectionName}
          </motion.div>
        </AnimatePresence>
      </div>
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
