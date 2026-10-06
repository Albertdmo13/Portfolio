import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function ImageCarousel({ images, base }) {
  const scrollRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragged, setDragged] = useState(false);

  // Duplicate the images enough times to ensure seamless infinite looping without hitting scrollbar limits
  const K = 20;
  const extendedImages = Array(K).fill(images).flat();

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

    if (isHovered) return;

    let animationId;
    let scrollAmount = 1;
    let exactScroll = el.scrollLeft;

    const step = () => {
      if (!isHovered) {
        exactScroll += scrollAmount;
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
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

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
          overflowX: 'auto', 
          gap: '16px', 
          paddingBottom: '8px', 
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
