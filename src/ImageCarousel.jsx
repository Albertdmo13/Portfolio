import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function ImageCarousel({ images, base }) {
  const scrollRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const exactScrollRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isTouchingRef = useRef(false);
  const scrollEndTimerRef = useRef(null);

  const startXRef = useRef(0);
  const scrollLeftStateRef = useRef(0);
  const draggedRef = useRef(false);
  const touchStartXRef = useRef(0);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Duplicate the images enough times to ensure seamless infinite looping without hitting scrollbar limits
  const K = 20;
  const extendedImages = Array(K).fill(images).flat();

  const handleMouseDown = (e) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    draggedRef.current = false;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStateRef.current = scrollRef.current.scrollLeft;
    exactScrollRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    isHoveredRef.current = false;
    setIsDragging(false);
    isDraggingRef.current = false;
    if (scrollRef.current) {
      exactScrollRef.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
    scrollRef.current.scrollLeft = scrollLeftStateRef.current - walk;
    exactScrollRef.current = scrollRef.current.scrollLeft;
  };

  const handleTouchStart = (e) => {
    setIsHovered(true);
    isHoveredRef.current = true;
    isTouchingRef.current = true;
    draggedRef.current = false;
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
    scrollEndTimerRef.current = setTimeout(() => {
      setIsHovered(false);
      isHoveredRef.current = false;
      if (scrollRef.current) {
        exactScrollRef.current = scrollRef.current.scrollLeft;
      }
    }, 400);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    exactScrollRef.current = scrollRef.current.scrollLeft;

    if (isTouchingRef.current || isHoveredRef.current || isDraggingRef.current) {
      clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = setTimeout(() => {
        if (!isTouchingRef.current) {
          setIsHovered(false);
          isHoveredRef.current = false;
          if (scrollRef.current) {
            exactScrollRef.current = scrollRef.current.scrollLeft;
          }
        }
      }, 400);
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
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    // Initial start in the middle set to allow scrolling left or right
    if (el.scrollLeft === 0) {
      const initialScroll = (el.scrollWidth / K) * 10;
      el.scrollLeft = initialScroll;
      exactScrollRef.current = initialScroll;
    } else {
      exactScrollRef.current = el.scrollLeft;
    }

    let animationId;
    let lastTime = performance.now();
    const speed = 25; // pixels per second (slower, gentle scroll)

    const step = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const currentEl = scrollRef.current;
      if (currentEl) {
        const isPaused = isHoveredRef.current || isDraggingRef.current || isTouchingRef.current;
        if (!isPaused && delta > 0 && delta < 0.1) {
          exactScrollRef.current += speed * delta;

          const oneSetWidth = currentEl.scrollWidth / K;
          if (oneSetWidth > 0) {
            while (exactScrollRef.current >= oneSetWidth * (K - 2)) {
              exactScrollRef.current -= oneSetWidth * 5;
            }
            while (exactScrollRef.current <= oneSetWidth * 2) {
              exactScrollRef.current += oneSetWidth * 5;
            }
          }
          currentEl.scrollLeft = exactScrollRef.current;
        } else if (isPaused) {
          exactScrollRef.current = currentEl.scrollLeft;
        }
      }

      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    
    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(scrollEndTimerRef.current);
    };
  }, []);

  return (
    <>
      <div 
        ref={scrollRef}
        onMouseEnter={() => { setIsHovered(true); isHoveredRef.current = true; }}
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
          paddingTop: '12px',
          paddingBottom: '12px', 
          WebkitOverflowScrolling: 'touch', 
          width: '100%',
          scrollbarWidth: 'none', /* Firefox */
        }}
      >
        {extendedImages.map((imgUrl, i) => (
          <img 
            key={i}
            src={`${base}${imgUrl.replace(/^\/?(Portfolio\/)?/, "")}`}
            alt={`Publication figure ${i + 1}`}
            draggable={false}
            onClick={(e) => handleImageClick(e, `${base}${imgUrl.replace(/^\/?(Portfolio\/)?/, "")}`)}
            style={{ 
              height: '180px', 
              width: 'auto', 
              borderRadius: '8px', 
              flexShrink: 0, 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              objectFit: 'contain', 
              border: '1px solid var(--glass-border)',
              cursor: 'grab',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              WebkitUserDrag: 'none',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = '#60a5fa'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
            onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
          />
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'zoom-out',
                padding: '24px'
              }}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'relative',
                  maxWidth: 'min(760px, 85vw)',
                  maxHeight: 'min(520px, 72vh)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#11131a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 25px rgba(96, 165, 250, 0.12)',
                  cursor: 'default'
                }}
              >
                <img
                  src={selectedImage}
                  alt="Figure preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'min(480px, 66vh)',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    display: 'block'
                  }}
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  aria-label="Close preview"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    lineHeight: 1,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.85)';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
