import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MobileSectionCombobox.css";

export default function MobileSectionCombobox({
  activeSection,
  sections = [],
  onSelectSection,
  visible = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close combobox when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("touchstart", handleOutsideClick, { passive: true });
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Close combobox on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Close combobox when scrolling
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => {
      setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const currentItem =
    sections.find((s) => s.id === activeSection) ||
    sections[0] || { id: "experience", label: "Experience", accent: "#60a5fa" };

  const currentLabel = currentItem ? currentItem.label : "Sections";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          className="mobile-section-combobox-root"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* Main sticky touchable section tag with smooth resize layout animation */}
          <motion.div
            layout
            transition={{
              layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
            }}
            className="mobile-combobox-tag-pill-wrapper"
          >
            <button
              type="button"
              className={`mobile-combobox-tag-btn ${isOpen ? "is-open" : ""}`}
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={`Current section: ${currentLabel}. Tap to change section.`}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
            >
              <span
                className="mobile-combobox-pip"
                style={{ backgroundColor: currentItem?.accent || "var(--accent-color)" }}
                aria-hidden="true"
              />
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={currentItem?.id || "default"}
                  initial={{ opacity: 0, y: 5, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -5, filter: "blur(2px)" }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="mobile-combobox-label"
                >
                  {currentLabel}
                </motion.span>
              </AnimatePresence>
              <svg
                className="mobile-combobox-arrow"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </motion.div>

          {/* Minimalist straight-corner combobox dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="mobile-combobox-listbox"
                role="listbox"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {sections.map((sec) => {
                  const isActive = sec.id === activeSection;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      className={`mobile-combobox-option ${isActive ? "is-active" : ""}`}
                      onClick={() => {
                        setIsOpen(false);
                        onSelectSection(sec.id);
                      }}
                    >
                      <div className="mobile-combobox-option-left">
                        <span
                          className="mobile-combobox-option-pip"
                          style={{
                            backgroundColor: sec.accent || "var(--accent-color)",
                            opacity: isActive ? 1 : 0.4,
                          }}
                          aria-hidden="true"
                        />
                        <span className="mobile-combobox-option-text">{sec.label}</span>
                      </div>
                      {isActive && (
                        <span className="mobile-combobox-active-badge">
                          ACTIVE
                        </span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
