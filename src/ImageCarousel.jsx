import { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

const K = 12;

export default function ImageCarousel({
  images = [],
  base,
  accentColor = 'var(--accent-color)',
  altPrefix = 'Figure',
}) {
  const scrollRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const exactScrollRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isTouchingRef = useRef(false);
  const scrollEndTimerRef = useRef(null);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const draggedRef = useRef(false);
  const touchStartXRef = useRef(0);

  // Duplicate the images enough times to ensure seamless infinite looping without hitting boundaries
  const extendedImages = useMemo(() => {
    const safeImages = Array.isArray(images) ? images : [];
    return safeImages.length > 0 ? Array(K).fill(safeImages).flat() : [];
  }, [images]);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    draggedRef.current = false;
    clearTimeout(scrollEndTimerRef.current);
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
    exactScrollRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    isDraggingRef.current = false;
    if (scrollRef.current) {
      exactScrollRef.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (scrollRef.current) {
      exactScrollRef.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 4) {
      draggedRef.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    exactScrollRef.current = scrollRef.current.scrollLeft;
  };

  const handleTouchStart = (e) => {
    isHoveredRef.current = true;
    isTouchingRef.current = true;
    draggedRef.current = false;
    clearTimeout(scrollEndTimerRef.current);
    if (e.touches && e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
    }
    if (scrollRef.current) {
      exactScrollRef.current = scrollRef.current.scrollLeft;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      const diff = Math.abs(e.touches[0].clientX - touchStartXRef.current);
      if (diff > 6) {
        draggedRef.current = true;
      }
    }
    if (scrollRef.current) {
      exactScrollRef.current = scrollRef.current.scrollLeft;
    }
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    if (scrollRef.current) {
      exactScrollRef.current = scrollRef.current.scrollLeft;
    }
    clearTimeout(scrollEndTimerRef.current);
    // Allow touch momentum scrolling to settle naturally before resuming auto-glide
    scrollEndTimerRef.current = setTimeout(() => {
      if (!isTouchingRef.current && !isDraggingRef.current) {
        isHoveredRef.current = false;
        if (scrollRef.current) {
          exactScrollRef.current = scrollRef.current.scrollLeft;
        }
      }
    }, 450);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    exactScrollRef.current = scrollRef.current.scrollLeft;

    // While momentum inertia continues after touch release or drag, defer resuming auto-glide
    if (isTouchingRef.current || isHoveredRef.current || isDraggingRef.current) {
      clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = setTimeout(() => {
        if (!isTouchingRef.current && !isDraggingRef.current) {
          isHoveredRef.current = false;
          if (scrollRef.current) {
            exactScrollRef.current = scrollRef.current.scrollLeft;
          }
        }
      }, 450);
    }
  };

  const handleImageClick = (e, url) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setSelectedImage(url);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Initial start in the middle set to allow scrolling left or right seamlessly
    if (el.scrollLeft === 0) {
      const initialScroll = (el.scrollWidth / K) * 5;
      el.scrollLeft = initialScroll;
      exactScrollRef.current = initialScroll;
    } else {
      exactScrollRef.current = el.scrollLeft;
    }

    let animationId = 0;
    let isVisible = false;
    let lastTime = performance.now();
    const speed = 25; // Slower, elegant glide speed (pixels per second)

    const step = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const currentEl = scrollRef.current;
      if (currentEl) {
        const isPaused = isHoveredRef.current || isDraggingRef.current || isTouchingRef.current;
        if (!isPaused && isVisible && delta > 0 && delta < 0.1) {
          exactScrollRef.current += speed * delta;

          const oneSetWidth = currentEl.scrollWidth / K;
          if (oneSetWidth > 0) {
            while (exactScrollRef.current >= oneSetWidth * (K - 2)) {
              exactScrollRef.current -= oneSetWidth * 4;
            }
            while (exactScrollRef.current <= oneSetWidth * 2) {
              exactScrollRef.current += oneSetWidth * 4;
            }
          }
          currentEl.scrollLeft = exactScrollRef.current;
        } else if (isPaused) {
          exactScrollRef.current = currentEl.scrollLeft;
        }
      }

      if (isVisible) {
        animationId = requestAnimationFrame(step);
      } else {
        animationId = 0;
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && animationId === 0) {
        lastTime = performance.now();
        animationId = requestAnimationFrame(step);
      }
    }, { threshold: 0.05 });

    io.observe(el);

    lastTime = performance.now();
    animationId = requestAnimationFrame(step);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      clearTimeout(scrollEndTimerRef.current);
      io.disconnect();
    };
  }, []);

  if (extendedImages.length === 0) return null;

  return (
    <>
      <div 
        ref={scrollRef}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          overflowX: 'auto', 
          gap: '16px', 
          paddingTop: '14px', 
          paddingBottom: '14px', 
          paddingLeft: '4px',
          paddingRight: '4px',
          WebkitOverflowScrolling: 'touch', 
          width: '100%',
          height: '208px',
          minHeight: '208px',
          boxSizing: 'border-box',
          scrollbarWidth: 'none', /* Firefox */
          '--accent-color': accentColor,
        }}
      >
        {extendedImages.map((imgUrl, i) => {
          const fullUrl = `${base}${imgUrl.replace(/^\/?(Portfolio\/)?/, "")}`;
          return (
            <img 
              key={i}
              src={fullUrl}
              alt={`${altPrefix} ${i + 1}`}
              loading="lazy"
              decoding="async"
              draggable={false}
              height={180}
              onClick={(e) => handleImageClick(e, fullUrl)}
            style={{ 
              height: '180px', 
              width: 'auto', 
              minWidth: '120px',
              borderRadius: '8px', 
              flexShrink: 0, 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              objectFit: 'contain', 
              border: '1px solid var(--glass-border)',
              cursor: 'grab',
              transition: 'border-color 0.2s ease',
              WebkitUserDrag: 'none',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
            onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
          />
        );
      })}
      </div>

      {createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'zoom-out',
                padding: '40px'
              }}
            >
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={selectedImage}
                alt="Enlarged view"
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  cursor: 'default'
                }}
              />
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
