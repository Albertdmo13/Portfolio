import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Lenis from 'lenis';
import { motion, AnimatePresence, useInView } from "framer-motion";
import { portfolioData } from "./data";
import LatticeLoader from "./LatticeLoader";
import TextType from "./TextType";
import SpecularButton from "./SpecularButton";
import RubberSegment from "./RubberSegment";
import BusinessCardHero from "./BusinessCardHero";
import ImageCarousel from "./ImageCarousel";
import RulerScroller from "./RulerScroller";
import CopyEmailButton from "./CopyEmailButton";
import Grainient from "./Grainient";
import ProjectDetailSection from "./ProjectDetailSection";
import "./App.css";

function AnimatedCard({ children, className, style, delay = 0, ...props }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <motion.article
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.35, delay: delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.article>
  );
}

function GridSnappedSection({
  id,
  label,
  isLast = false,
  sectionAnimation,
  children
}) {
  const contentRef = useRef(null);
  const [padding, setPadding] = useState({ top: 48, bottom: 48, targetHeight: 0 });

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.offsetHeight;
      if (!h) return;
      const minPadding = 80; // Minimum 80px total vertical breathing space (~40px top, ~40px bottom)
      const targetHeight = Math.ceil((h + minPadding) / 32) * 32;
      const extra = targetHeight - h;
      const top = Math.floor(extra / 2);
      const bottom = extra - top;
      setPadding({ top, bottom, targetHeight });
    };

    measure();
    const t1 = setTimeout(measure, 100);
    const t2 = setTimeout(measure, 400);

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    window.addEventListener('resize', measure);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <motion.section
      id={id}
      className="section"
      style={{
        height: padding.targetHeight ? `${padding.targetHeight}px` : undefined,
        minHeight: padding.targetHeight ? `${padding.targetHeight}px` : undefined,
        paddingTop: `${padding.top}px`,
        paddingBottom: `${padding.bottom}px`,
        boxSizing: 'border-box'
      }}
      {...sectionAnimation}
    >
      <div className="section-divider-line" style={{ top: 0 }} />
      {isLast && <div className="section-divider-line" style={{ top: '100%' }} />}
      {label && (
        <div className="section-label-track">
          <h2 className="section-label">
            {label}
          </h2>
        </div>
      )}
      <div ref={contentRef} className="section-content-wrapper">
        {children}
      </div>
    </motion.section>
  );
}

// Minimal SVG icons
const Icons = {
  Github: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  Linkedin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Cv: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  External: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Globe: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Copy: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  ),
  Check: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Info: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  ChevronUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const JAVA_ICON_DATA_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Cpath fill='%23ffffff' d='M47.617 98.12c-19.192 5.362 11.677 16.439 36.115 5.969-4.003-1.556-6.874-3.351-6.874-3.351-10.897 2.06-15.952 2.222-25.844 1.092-8.164-.935-3.397-3.71-3.397-3.71zm33.189-10.46c-14.444 2.779-22.787 2.69-33.354 1.6-8.171-.845-2.822-4.805-2.822-4.805-21.137 7.016 11.767 14.977 41.309 6.336-3.14-1.106-5.133-3.131-5.133-3.131zm11.319-60.575c.001 0-42.731 10.669-22.323 34.187 6.024 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.793 15.634-29.58zm9.998 81.144s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.095.171-4.45-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.952-3.487-32.013 6.85-13.742 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM85 77.896c2.395-1.634 5.703-3.053 5.703-3.053s-9.424 1.685-18.813 2.474c-11.494.964-23.823 1.154-30.012.326-14.652-1.959 8.033-7.348 8.033-7.348s-8.812-.596-19.644 4.644C17.455 81.134 61.958 83.958 85 77.896zm5.609 15.145c-.108.29-.468.616-.468.616 31.273-8.221 19.775-28.979 4.822-23.725-1.312.464-2 1.543-2 1.543s.829-.334 2.678-.72c7.559-1.575 18.389 10.119-5.032 22.286zM64.181 70.069c-4.614-10.429-20.26-19.553.007-35.559C89.459 14.563 76.492 1.587 76.492 1.587c5.23 20.608-18.451 26.833-26.999 39.667-5.821 8.745 2.857 18.142 14.688 28.815zm27.274 51.748c-19.187 3.612-42.854 3.191-56.887.874 0 0 2.874 2.38 17.646 3.331 22.476 1.437 57-.8 57.816-11.436.001 0-1.57 4.032-18.575 7.231z'/%3E%3C/svg%3E";

const TECH_ICON_MAP = {
  "React": "react",
  "JavaScript": "javascript",
  "Python": "python",
  "Flask": "flask",
  "MySQL": "mysql",
  "Docker": "docker",
  "Qt": "qt",
  "Raspberry Pi 5": "raspberrypi",
  "C / C++": "cplusplus",
  "SQL": "postgresql",
  "HTML / CSS": "html5",
  "Angular": "angular",
  "Node.js": "nodedotjs",
  "OpenGL": "opengl",
  "Three.js basics": "threedotjs",
  "Three.js básico": "threedotjs",
  "Git": "git",
  "GitHub": "github",
  "Linux": "linux",
  "Blender": "blender",
  "Arduino": "arduino",
  "Aseprite": "aseprite",
  "GameMaker": "gamemaker",
};

const getTechIconUrl = (techName) => {
  if (techName === "Java") {
    return JAVA_ICON_DATA_URL;
  }
  const iconName = TECH_ICON_MAP[techName];
  return iconName ? `https://cdn.simpleicons.org/${iconName}/white` : null;
};

const resolveAssetUrl = (base, path) => (path ? `${base}${path.replace(/^\/?(Portfolio\/)?/, "")}` : "");

const scrollToEl = (target, offset = -60, duration = 1.2) => {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (window.lenis) {
    window.lenis.scrollTo(el, { offset, duration });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// Polished variants for project detail showcase
const projectDetailVariants = {
  initial: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
  },
  animate: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.35, ease: "easeOut" },
    },
    transitionEnd: { overflow: "visible" },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
    transition: {
      opacity: { duration: 0.22, ease: "easeOut" },
      height: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
    },
  },
};

const sectionAnimation = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 }
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  const [loaderStatus, setLoaderStatus] = useState("working");
  const [accentColor, setAccentColor] = useState("#60a5fa");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth <= 768 : false));
  const [windowHeight, setWindowHeight] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 800));
  const [heroHeight, setHeroHeight] = useState(0);
  const [isHeroOccluded, setIsHeroOccluded] = useState(false);
  const [activeHoveredCluster, setActiveHoveredCluster] = useState(null);
  const [activeProjectDetail, setActiveProjectDetail] = useState(() => {
    return window.location.hash.toLowerCase().includes("flowdip") ? "flowdip" : null;
  });
  const [hoveredProjectIconId, setHoveredProjectIconId] = useState(null);
  const [suppressedSideButtonsProject, setSuppressedSideButtonsProject] = useState(null);

  const base = import.meta.env.BASE_URL;
  const assetUrl = useCallback((path) => resolveAssetUrl(base, path), [base]);

  const handleOpenProjectDetail = (projectId) => {
    setActiveProjectDetail(projectId);
    setTimeout(() => {
      scrollToEl(document.getElementById(`${projectId}-section`) || document.getElementById(projectId));
    }, 120);
  };

  const handleCloseProjectDetail = useCallback(() => {
    const currentId = activeProjectDetail;
    const targetEl = (currentId ? document.getElementById(`project-card-${currentId}`) : null) || document.getElementById("projects");

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      if (rect.top < 60 || rect.bottom < 120) {
        scrollToEl(targetEl, -70, 0.7);
      }
    }

    if (window.location.hash.toLowerCase().includes("flowdip")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    setActiveProjectDetail(null);
    setSuppressedSideButtonsProject(null);
  }, [activeProjectDetail]);

  // Close project detail smoothly on Escape key press
  useEffect(() => {
    if (!activeProjectDetail) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseProjectDetail();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProjectDetail, handleCloseProjectDetail]);

  // Close expanded project cluster when tapping outside on mobile/touch screens
  useEffect(() => {
    if (!activeHoveredCluster) return;
    const handleOutsideTap = (e) => {
      if (!e.target.closest('.project-seam-action-cluster')) {
        setActiveHoveredCluster(null);
      }
    };
    document.addEventListener('touchstart', handleOutsideTap, { passive: true });
    document.addEventListener('click', handleOutsideTap);
    return () => {
      document.removeEventListener('touchstart', handleOutsideTap);
      document.removeEventListener('click', handleOutsideTap);
    };
  }, [activeHoveredCluster]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.toLowerCase().includes("flowdip")) {
        setActiveProjectDetail("flowdip");
        setTimeout(() => {
          scrollToEl(document.getElementById("flowdip-section") || document.getElementById("flowdip"));
        }, 150);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const heroStageRef = useRef(null);
  const heroContainerRef = useRef(null);
  const heroCardRef = useRef(null);
  const navHeaderRef = useRef(null);
  const uncompressedNavHeightRef = useRef(110);
  const compressedNavHeightRef = useRef(48);

  const getSnappedNavDiff = useCallback(() => {
    const uncompressed = uncompressedNavHeightRef.current || 110;
    const compressed = compressedNavHeightRef.current || 48;
    return Math.round(Math.max(0, uncompressed - compressed) / 32) * 32 || 64;
  }, []);

  const snappedNavDiff = getSnappedNavDiff();
  const baseExtra = heroHeight > 0 && windowHeight > 0 ? Math.max(0, heroHeight - windowHeight) : 0;
  const needsHeroScroll = isMobile && baseExtra > 0;
  const effectiveHeroHeight = heroHeight + (needsHeroScroll ? snappedNavDiff : 0);

  useEffect(() => {
    if (!heroContainerRef.current) return;
    const updateHeight = () => {
      if (heroContainerRef.current) {
        const rawHeight = heroContainerRef.current.offsetHeight;
        if (rawHeight > 0) {
          const snappedHeight = Math.ceil(Math.max(512, rawHeight) / 32) * 32;
          setHeroHeight(snappedHeight);
        }
      }
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(heroContainerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateScrollLogic = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const currentWindowHeight = window.innerHeight;
      const navSnappedDiff = getSnappedNavDiff();

      // Excess height when hero is taller than screen (2-stage scroll on mobile)
      const curBaseExtra = Math.max(0, heroHeight - currentWindowHeight);
      const needsScroll = isMobile && curBaseExtra > 0;
      const extraScroll = needsScroll ? Math.max(0, curBaseExtra + navSnappedDiff) : Math.max(0, curBaseExtra);
      const curEffectiveHeroHeight = heroHeight + (needsScroll ? navSnappedDiff : 0);

      const compressThreshold = needsScroll
        ? 24
        : Math.max(0, heroHeight - (uncompressedNavHeightRef.current || 110));
      setIsScrolled(scrollY >= compressThreshold);

      if (!heroStageRef.current || !heroHeight) {
        ticking = false;
        return;
      }

      if (needsScroll && scrollY < extraScroll) {
        heroStageRef.current.style.position = 'absolute';
        heroStageRef.current.style.top = '0px';
        heroStageRef.current.style.transform = 'none';
      } else {
        heroStageRef.current.style.position = 'fixed';
        heroStageRef.current.style.top = needsScroll ? `-${extraScroll}px` : '0px';
        heroStageRef.current.style.transform = 'none';
      }

      if (heroCardRef.current) {
        const stage2Scroll = Math.max(0, scrollY - extraScroll);
        const stage2Range = Math.max(1, currentWindowHeight * 0.55);
        const progress = Math.min(1, stage2Scroll / stage2Range);
        const opacity = 1 - progress;

        heroCardRef.current.style.opacity = opacity.toFixed(3);

        if (opacity <= 0.01) {
          heroCardRef.current.style.pointerEvents = 'none';
          heroCardRef.current.style.visibility = 'hidden';
        } else {
          heroCardRef.current.style.pointerEvents = 'auto';
          heroCardRef.current.style.visibility = 'visible';
        }
      }

      const occluded = scrollY >= curEffectiveHeroHeight;
      setIsHeroOccluded(prev => (prev !== occluded ? occluded : prev));

      if (occluded) {
        heroStageRef.current.style.visibility = 'hidden';
      } else {
        heroStageRef.current.style.visibility = 'visible';
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollLogic);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    if (window.lenis) {
      window.lenis.on('scroll', handleScroll);
    }
    updateScrollLogic();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (window.lenis) {
        window.lenis.off('scroll', handleScroll);
      }
    };
  }, [heroHeight, isMobile, windowHeight, getSnappedNavDiff]);

  const updateNavHeight = useCallback(() => {
    if (navHeaderRef.current) {
      const h = navHeaderRef.current.offsetHeight;
      if (h > 0) {
        if (isScrolled || navHeaderRef.current.classList.contains('nav-compressed')) {
          compressedNavHeightRef.current = h;
        } else {
          uncompressedNavHeightRef.current = h;
        }
      }
    }
  }, [isScrolled]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setWindowHeight(window.innerHeight);
      updateNavHeight();
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [updateNavHeight]);

  useEffect(() => {
    updateNavHeight();
  }, [isScrolled, updateNavHeight]);

  // Simulate hover for grid elements (projects, publications, skills) on mobile based on scroll coordinates
  useEffect(() => {
    let activeCards = new Set();
    let ticking = false;
    let cachedCards = null;

    const runMobileHover = () => {
      // Only active on mobile viewports (<= 768px)
      if (window.innerWidth > 768) {
        if (activeCards.size > 0) {
          activeCards.forEach((card) => card.classList.remove('is-hovered'));
          activeCards.clear();
        }
        ticking = false;
        return;
      }

      // Focal reading line: central region of mobile viewport (~48% of screen height)
      const focusY = window.innerHeight * 0.48;
      if (!cachedCards || cachedCards.length === 0) {
        cachedCards = document.querySelectorAll(
          '.projects-grid .project-card, .publications-list .project-card, .skills-grid .skill-category-card'
        );
      }
      const targetCards = cachedCards;

      if (targetCards.length === 0) {
        ticking = false;
        return;
      }

      const newActiveCards = new Set();
      let closestCard = null;
      let minDistance = Infinity;

      for (let i = 0; i < targetCards.length; i++) {
        const card = targetCards[i];
        const rect = card.getBoundingClientRect();

        // Card strictly encompasses the focal line
        if (rect.top <= focusY && rect.bottom >= focusY) {
          newActiveCards.add(card);
        } else if (rect.bottom > 80 && rect.top < window.innerHeight - 80) {
          const cardCenter = (rect.top + rect.bottom) / 2;
          const dist = Math.abs(cardCenter - focusY);
          if (dist < minDistance) {
            minDistance = dist;
            closestCard = card;
          }
        }
      }

      // If between card boundaries or during quick scrolls, latch onto the closest clearly visible card
      if (newActiveCards.size === 0 && closestCard && minDistance < window.innerHeight * 0.35) {
        newActiveCards.add(closestCard);
      }

      // Only perform DOM updates if the active set has changed
      let hasChanged = activeCards.size !== newActiveCards.size;
      if (!hasChanged) {
        for (const card of newActiveCards) {
          if (!activeCards.has(card)) {
            hasChanged = true;
            break;
          }
        }
      }

      if (hasChanged) {
        activeCards.forEach((card) => {
          if (!newActiveCards.has(card)) {
            card.classList.remove('is-hovered');
          }
        });
        newActiveCards.forEach((card) => {
          if (!activeCards.has(card)) {
            card.classList.add('is-hovered');
          }
        });
        activeCards = newActiveCards;
      }
      ticking = false;
    };

    const updateMobileHover = () => {
      if (window.innerWidth > 768) {
        if (activeCards.size > 0) {
          activeCards.forEach((card) => card.classList.remove('is-hovered'));
          activeCards.clear();
        }
        return;
      }
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(runMobileHover);
      }
    };

    const handleResizeOrScroll = () => {
      cachedCards = null;
      updateMobileHover();
    };

    window.addEventListener('scroll', updateMobileHover, { passive: true });
    window.addEventListener('resize', handleResizeOrScroll);

    if (window.lenis) {
      window.lenis.on('scroll', updateMobileHover);
    }

    updateMobileHover();
    const timer = setTimeout(updateMobileHover, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updateMobileHover);
      window.removeEventListener('resize', updateMobileHover);
      if (window.lenis) {
        window.lenis.off('scroll', updateMobileHover);
      }
      activeCards.forEach((card) => card.classList.remove('is-hovered'));
    };
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLoaderStatus("done");
    }, 600);
    const timer2 = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const color = rootStyle.getPropertyValue('--accent-color').trim();
    if (color) setAccentColor(color);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });
    window.lenis = lenis;

    let rafId = 0;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const id = target.getAttribute('href');
        if (id === '#' || !id) {
          lenis.scrollTo(0);
        } else {
          scrollToEl(id);
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  const t = portfolioData[lang] || portfolioData.en;

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LatticeLoader
              status={loaderStatus}
              color="var(--accent-color)"
              doneColor="#10a37f"
              label="Loading Portfolio"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Hero Stage (Background + Business Card) */}
      <div
        id="hero"
        className="hero-fixed-stage"
        ref={heroStageRef}
        style={{ height: effectiveHeroHeight > 0 ? `${effectiveHeroHeight}px` : undefined }}
      >
        <div className="hero-background-grainient" aria-hidden="true">
          <Grainient
            paused={isLoading || isHeroOccluded}
            color1="#343343"
            color2="#0d0d0e"
            color3="#565972"
            timeSpeed={0.4}
            colorBalance={0.09}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={16}
            blendAngle={0}
            blendSoftness={0.58}
            rotationAmount={500}
            noiseScale={1.65}
            grainAmount={isMobile ? 0.032 : 0.04}
            grainScale={isMobile ? 12 : 8}
            grainAnimated={true}
            grainSpeed={0.35}
            contrast={1.5}
            gamma={1}
            saturation={0.75}
            centerX={0}
            centerY={0}
            zoom={0.7}
          />
        </div>

        <div className="hero-foreground-container" ref={heroContainerRef}>
          <div className="hero-card-fade-wrapper" ref={heroCardRef}>
            <BusinessCardHero
              t={t}
              lang={lang}
              Icons={Icons}
              onContactClick={() => scrollToEl('#contact')}
            />
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <header ref={navHeaderRef} className={`nav-header ${isMobile && isScrolled ? 'nav-compressed' : ''}`}>
        <div className="nav-content">
          <a href="#" className="nav-brand">
            {t.personalInfo.shortName}
          </a>
          <div className="nav-links-inner">
            <a href="#experience" className="nav-link">{t.nav.experience}</a>
            <a href="#projects" className="nav-link">{t.nav.projects}</a>
            <a href="#publications" className="nav-link">{t.nav.publications}</a>
            <a href="#skills" className="nav-link">{t.nav.skills}</a>
            <a href="#contact" className="nav-link">{t.nav.contact}</a>
          </div>
          <div className="nav-actions">
            <RubberSegment
              items={[
                { value: "en", label: "EN" },
                { value: "es", label: "ES" },
              ]}
              value={lang}
              onChange={(val) => setLang(val)}
              size="sm"
              radius={9999}
              inset={2}
              trackColor="rgba(255, 255, 255, 0.06)"
              thumbColor="#ffffff"
              textColor="rgba(255, 255, 255, 0.65)"
              activeTextColor="#0a0a0f"
              aria-label="Language selector"
            />
            <SpecularButton
              size="sm"
              radius={8}
              tint="rgba(255, 255, 255, 0.05)"
              blur={10}
              lineColor={accentColor}
              baseColor="#3a3a44"
              intensity={1.3}
              autoAnimate={true}
              onClick={() => {
                window.open(assetUrl(t.personalInfo.links.cv), "_blank");
              }}
            >
              <Icons.Cv />
              {t.nav.cv}
            </SpecularButton>
          </div>
        </div>
      </header>

      {/* Ruler Scroller */}
      <RulerScroller
        label="HERO"
        heroHeight={effectiveHeroHeight}
        activeProjectDetail={activeProjectDetail}
        activeProjectAccent={
          activeProjectDetail
            ? t.projects.find((p) => p.id === activeProjectDetail)?.accentColor || "#2CC091"
            : null
        }
        activeProjectTitle={
          activeProjectDetail
            ? t.projects.find((p) => p.id === activeProjectDetail)?.title || "FlowDiP"
            : null
        }
      />

      {/* Main Page Layout Layer */}
      <div className="background-layer">
        {/* Spacer reserving the hero section's exact height in document flow */}
        <div
          className="hero-scroll-spacer"
          style={{ height: effectiveHeroHeight > 0 ? `${effectiveHeroHeight}px` : undefined }}
          aria-hidden="true"
        />

        {/* Subsequent Content Layer that scrolls on top and occludes the fixed hero stage */}
        <div className="subsequent-content-layer">
          <div className="foreground-layer">
            <main className="main-content sections-main animate-in">
              {/* Trajectory / Experience Section */}
              <GridSnappedSection
                id="experience"
                label={t.sections.trajectory}
                sectionAnimation={sectionAnimation}
              >
                <div className="timeline-container">
                  <div className="timeline-track" />
                  <div className="timeline-items">
                    {t.trajectory.map((item, idx) => (
                      <motion.div
                        key={idx}
                        className="timeline-item"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.35, delay: idx * 0.08 }}
                      >
                        <div className="timeline-marker">
                          <span className="timeline-dot" />
                          <span className="timeline-connector" />
                        </div>
                        <div className="timeline-card">
                          <div className="timeline-inner">
                            <div className="timeline-content">
                              <div className="timeline-header">
                                <h3 className="timeline-role">{item.role}</h3>
                                <span className="timeline-period">{item.period}</span>
                              </div>
                              {item.institution && (
                                <p className="timeline-institution">
                                  {item.link ? (
                                    <a href={item.link} target="_blank" rel="noreferrer" className="timeline-link">
                                      {item.institution}
                                    </a>
                                  ) : (
                                    item.institution
                                  )}
                                </p>
                              )}
                              {item.description && <p className="timeline-desc">{item.description}</p>}
                            </div>
                            {item.logo && (() => {
                              const logoImg = (
                                <img
                                  src={assetUrl(item.logo)}
                                  alt={`${item.institution} logo`}
                                  width={72}
                                  height={72}
                                  loading="lazy"
                                  decoding="async"
                                  className="timeline-logo"
                                />
                              );
                              return item.link ? (
                                <a href={item.link} target="_blank" rel="noreferrer" className="timeline-logo-link" style={{ display: 'flex' }}>
                                  {logoImg}
                                </a>
                              ) : logoImg;
                            })()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GridSnappedSection>

              {/* Projects Section */}
              <GridSnappedSection
                id="projects"
                label={t.sections.projects}
                sectionAnimation={sectionAnimation}
              >
                <div className="projects-grid">
                  {t.projects.map((proj, idx) => (
                    <AnimatedCard
                      key={proj.id}
                      id={`project-card-${proj.id}`}
                      className={`project-card ${suppressedSideButtonsProject === proj.id ? "side-buttons-suppressed" : ""}`}
                      style={{
                        '--project-accent': proj.accentColor || 'var(--accent-color)'
                      }}
                      delay={(idx % 4) * 0.15}
                      onMouseLeave={() => {
                        if (suppressedSideButtonsProject === proj.id) {
                          setSuppressedSideButtonsProject(null);
                        }
                      }}
                    >
                      {proj.video && (
                        <div className="project-media">
                          <video
                            src={assetUrl(proj.video)}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="project-video"
                            style={{ aspectRatio: '16 / 9' }}
                          />
                        </div>
                      )}
                      {proj.logo && (
                        <div className="project-seam-logo-anchor">
                          <div
                            className={`project-seam-action-cluster ${(proj.hasDetails || proj.id === "flowdip" || proj.liveAppUrl) ? "has-expanded-links" : ""} ${activeHoveredCluster === proj.id ? "is-expanded" : ""}`}
                            onMouseEnter={() => {
                              if (!isMobile) setActiveHoveredCluster(proj.id);
                            }}
                            onMouseLeave={() => {
                              if (!isMobile) setActiveHoveredCluster(null);
                            }}
                          >
                            {(proj.hasDetails || proj.id === "flowdip" || proj.liveAppUrl || proj.link) && (
                              <div className="project-seam-expanded-buttons" aria-label={`${proj.title} actions`}>
                                {(proj.hasDetails || proj.id === "flowdip") && (
                                  <button
                                    type="button"
                                    className={`project-seam-action-btn project-seam-action-btn--info ${activeProjectDetail === proj.id ? "is-active" : ""}`}
                                    title={`${proj.title} ${t.projectLinks?.info || "Info"}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (activeProjectDetail === proj.id) {
                                        handleCloseProjectDetail();
                                      } else {
                                        setSuppressedSideButtonsProject(proj.id);
                                        setHoveredProjectIconId(null);
                                        setActiveHoveredCluster(null);
                                        handleOpenProjectDetail(proj.id);
                                      }
                                    }}
                                  >
                                    <Icons.Info />
                                    <span>{t.projectLinks?.shortInfo || "INFO"}</span>
                                  </button>
                                )}
                                {(proj.liveAppUrl || proj.link) && (
                                  <a
                                    href={proj.liveAppUrl || proj.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`project-seam-action-btn project-seam-action-btn--live ${hoveredProjectIconId === proj.id ? "is-hovered" : ""}`}
                                    title={`${proj.title} ${t.projectLinks?.liveApp || "Live App"}`}
                                    onMouseEnter={() => setHoveredProjectIconId(proj.id)}
                                    onMouseLeave={() => setHoveredProjectIconId(null)}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Icons.External />
                                    <span>{t.projectLinks?.shortLiveApp || "APP"}</span>
                                  </a>
                                )}
                              </div>
                            )}

                            {(() => {
                              const isHoveredClass = hoveredProjectIconId === proj.id ? "is-hovered" : "";
                              const onMouseEnter = () => setHoveredProjectIconId(proj.id);
                              const onMouseLeave = () => setHoveredProjectIconId(null);
                              const logoImg = (
                                <img
                                  src={assetUrl(proj.logo)}
                                  alt={`${proj.title} logo`}
                                  width={64}
                                  height={64}
                                  loading="lazy"
                                  decoding="async"
                                  className={`project-seam-logo ${isHoveredClass}`}
                                />
                              );

                              return proj.link ? (
                                <a
                                  href={proj.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`project-seam-logo-link ${isHoveredClass}`}
                                  title={`${proj.title} logo`}
                                  onMouseEnter={onMouseEnter}
                                  onMouseLeave={onMouseLeave}
                                  onClick={(e) => {
                                    const hasExpandedLinks = Boolean(proj.hasDetails || proj.id === "flowdip" || proj.liveAppUrl || proj.link);
                                    const isTouchOrMobile = isMobile || (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: none)").matches);
                                    if (hasExpandedLinks && isTouchOrMobile) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setActiveHoveredCluster(prev => prev === proj.id ? null : proj.id);
                                    }
                                  }}
                                >
                                  {logoImg}
                                </a>
                              ) : (
                                <div
                                  className={`project-seam-logo-container ${isHoveredClass}`}
                                  onMouseEnter={onMouseEnter}
                                  onMouseLeave={onMouseLeave}
                                  onClick={(e) => {
                                    if (proj.websiteUrl || proj.liveAppUrl || proj.link || proj.hasDetails) {
                                      e.stopPropagation();
                                      setActiveHoveredCluster(prev => prev === proj.id ? null : proj.id);
                                    }
                                  }}
                                >
                                  {logoImg}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                      <div className="project-body">
                        <div className="project-top">
                          <div className="project-heading-group">
                            <div className="project-title-row">
                              {proj.accentColor && (
                                <span
                                  className="project-accent-indicator"
                                  style={{ backgroundColor: proj.accentColor }}
                                  aria-hidden="true"
                                />
                              )}
                              <h3 className="project-title">{proj.title}</h3>
                            </div>
                            <p className="project-subtitle">{proj.subtitle}</p>
                          </div>
                        </div>
                        <p className="project-desc">{proj.description}</p>
                        <div className="project-tags">
                          {proj.tags.map((tag, i) => {
                            const iconUrl = getTechIconUrl(tag);
                            return (
                              <span key={i} className="project-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                {iconUrl && (
                                  <img
                                    src={iconUrl}
                                    alt={tag}
                                    width={16}
                                    height={16}
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                )}
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                        <div className="project-links">
                          {(proj.hasDetails || proj.id === "flowdip") && (
                            <button
                              type="button"
                              onClick={() => {
                                if (activeProjectDetail === proj.id) {
                                  handleCloseProjectDetail();
                                } else {
                                  handleOpenProjectDetail(proj.id);
                                }
                              }}
                              className="project-link-btn"
                              style={{ cursor: "pointer", background: "none", border: "1px solid var(--glass-border)" }}
                            >
                              <Icons.Info /> {t.projectLinks?.info || "Info"}
                            </button>
                          )}
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className={`project-link-btn project-link-btn--app ${hoveredProjectIconId === proj.id ? "is-hovered" : ""}`}
                            >
                              <Icons.External /> {t.projectLinks?.liveApp || "Live App"}
                            </a>
                          )}
                          {proj.github && (
                            <a href={proj.github} target="_blank" rel="noreferrer" className="project-link-btn">
                              <Icons.Github /> Source
                            </a>
                          )}
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </GridSnappedSection>

              {/* Slid Project Detail Section (FlowDiP) */}
              <AnimatePresence
                onExitComplete={() => {
                  window.dispatchEvent(new Event('resize'));
                  if (window.lenis) window.lenis.resize();
                }}
              >
                {activeProjectDetail && (
                  <motion.div
                    id={`${activeProjectDetail}-section`}
                    key={`project-detail-section-${activeProjectDetail}`}
                    className="project-detail-motion-wrapper"
                    variants={projectDetailVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onAnimationComplete={() => {
                      window.dispatchEvent(new Event('resize'));
                      if (window.lenis) window.lenis.resize();
                    }}
                  >
                    <ProjectDetailSection
                      projectId={activeProjectDetail}
                      project={t.projects.find((p) => p.id === activeProjectDetail)}
                      onClose={handleCloseProjectDetail}
                      lang={lang}
                      Icons={Icons}
                      getTechIconUrl={getTechIconUrl}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Publications Section */}
              <GridSnappedSection
                id="publications"
                label={t.sections.publications || "Publications"}
                sectionAnimation={sectionAnimation}
              >
                <div className="publications-list" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {t.publications && t.publications.map((pub, idx) => {
                    const openPaper = () => {
                      if (pub.link) window.open(pub.link, "_blank", "noopener,noreferrer");
                    };

                    return (
                      <AnimatedCard
                        key={idx}
                        className="project-card publication-card"
                        style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer' }}
                        delay={idx * 0.15}
                        onClick={openPaper}
                        onAuxClick={(e) => {
                          if (e.button === 1) openPaper();
                        }}
                        tabIndex={0}
                        role="link"
                        aria-label={`${pub.title} - View Paper`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            openPaper();
                          }
                        }}
                      >
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <div style={{ flexGrow: 1 }}>
                            <h3 className="project-title" style={{ margin: 0, color: 'var(--text-main)' }}>{pub.title}</h3>
                            {pub.authors && (
                              <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.55)', fontStyle: 'italic' }}>
                                {pub.authors}
                              </p>
                            )}
                          </div>
                          {pub.logo && (
                            <img
                              src={assetUrl(pub.logo)}
                              alt="Publication logo"
                              width={64}
                              height={42}
                            loading="lazy"
                            decoding="async"
                            style={{ width: '64px', height: '42px', aspectRatio: '598.7 / 394.9', objectFit: 'contain', flexShrink: 0, filter: 'invert(1)', opacity: 0.8 }}
                          />
                        )}
                      </div>
                      <p className="project-desc" style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
                        <strong>Abstract:</strong> {pub.abstract}
                      </p>
                      {pub.images && pub.images.length > 0 && (
                        <div
                          style={{ marginTop: '16px' }}
                          onClick={(e) => e.stopPropagation()}
                          onAuxClick={(e) => e.stopPropagation()}
                        >
                          <ImageCarousel images={pub.images} base={base} />
                        </div>
                      )}
                    </AnimatedCard>
                    );
                  })}
                </div>
              </GridSnappedSection>

              {/* Skills Section */}
              <GridSnappedSection
                id="skills"
                label={t.sections.skills}
                sectionAnimation={sectionAnimation}
              >
                <div className="skills-grid">
                  {t.skillCategories.map((cat, idx) => (
                    <AnimatedCard
                      key={idx}
                      className="skill-category-card"
                      delay={(idx % 4) * 0.15}
                    >
                      <h3 className="skill-category-name">{cat.name}</h3>
                      <div className="skill-pill-container">
                        {cat.skills.map((skill, i) => {
                          const iconUrl = getTechIconUrl(skill);
                          return (
                            <span key={i} className="skill-pill">
                              {iconUrl && (
                                <img
                                  src={iconUrl}
                                  alt={skill}
                                  width={20}
                                  height={20}
                                  loading="lazy"
                                  decoding="async"
                                  className="skill-pill-icon"
                                  onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                                />
                              )}
                              <span>{skill}</span>
                            </span>
                          );
                        })}
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </GridSnappedSection>

              {/* Contact Section */}
              <GridSnappedSection
                id="contact"
                label={t.sections.contact}
                isLast={true}
                sectionAnimation={sectionAnimation}
              >
                <div className="contact-card">
                  <h3 className="contact-card-title">{t.contact.title}</h3>
                  <p className="contact-card-desc">{t.contact.desc}</p>
                  <div className="contact-actions">
                    <CopyEmailButton
                      email={t.personalInfo.email}
                      copiedText={t.contact.copiedBtn}
                      Icons={Icons}
                    />
                    <SpecularButton
                      size="md"
                      radius={10}
                      tint="rgba(255, 255, 255, 0.06)"
                      blur={14}
                      lineColor={accentColor}
                      baseColor="#40404c"
                      intensity={1.5}
                      autoAnimate={true}
                      onClick={() => {
                        window.location.href = t.personalInfo.links.email;
                      }}
                    >
                      <Icons.Mail />
                      {t.contact.clientBtn}
                    </SpecularButton>
                  </div>
                </div>
              </GridSnappedSection>
            </main>

            {/* Footer */}
            <footer className="footer">
              <p className="footer-text">
                © {new Date().getFullYear()} {t.personalInfo.name}. {t.footer.text}
              </p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
