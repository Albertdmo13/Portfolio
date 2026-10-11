import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function ImageCarousel({
  images = [],
  base,
  accentColor = 'var(--accent-color)',
  altPrefix = 'Figure',
}) {
  const scrollRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragged, setDragged] = useState(false);

  // Duplicate the images enough times to ensure seamless infinite looping without excessive DOM nodes
  const safeImages = Array.isArray(images) ? images : [];
  const K = 4;
  const extendedImages = safeImages.length > 0 ? Array(K).fill(safeImages).flat() : [];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setDragged(true);
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleImageClick = (e, url) => {
    if (dragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setSelectedImage(url);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    // Initial start in the middle set to allow scrolling left
    if (el.scrollLeft === 0) {
      el.scrollLeft = el.scrollWidth / K;
    }

    let animationId = 0;
    let isVisible = false;
    let exactScroll = el.scrollLeft;
    let lastTime = performance.now();
    const speed = 25; // Slower, elegant glide speed (pixels per second)

    const step = (time) => {
      if (!isHovered && isVisible) {
        const delta = (time - lastTime) / 1000;
        if (delta > 0 && delta < 0.1) {
          exactScroll += speed * delta;
          el.scrollLeft = exactScroll;

          const oneSetWidth = el.scrollWidth / K;

          // Infinite loop seamless snapping
          while (exactScroll >= oneSetWidth * 2) {
            exactScroll -= oneSetWidth;
          }
          while (exactScroll <= oneSetWidth) {
            exactScroll += oneSetWidth;
          }
        }
      }
      lastTime = time;
      if (isVisible && !isHovered) {
        animationId = requestAnimationFrame(step);
      }
    };

    const startAnimation = () => {
      if (animationId === 0) {
        lastTime = performance.now();
        animationId = requestAnimationFrame(step);
      }
    };

    const stopAnimation = () => {
      if (animationId !== 0) {
        cancelAnimationFrame(animationId);
        animationId = 0;
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !isHovered) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }, { threshold: 0.05 });

    io.observe(el);

    if (!isHovered && isVisible) {
      startAnimation();
    }

    return () => {
      stopAnimation();
      io.disconnect();
    };
  }, [isHovered]);

  if (safeImages.length === 0) return null;

  return (
    <>
      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
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
        {extendedImages.map((imgUrl, i) => (
          <img 
            key={i}
            src={`${base}${imgUrl.replace(/^\/?(Portfolio\/)?/, "")}`}
            alt={`${altPrefix} ${i + 1}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            height={180}
            onClick={(e) => handleImageClick(e, `${base}${imgUrl.replace(/^\/?(Portfolio\/)?/, "")}`)}
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
        ))}
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
