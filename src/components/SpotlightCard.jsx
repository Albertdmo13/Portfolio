import { useRef, useState } from 'react';
import './SpotlightCard.css';

const SpotlightCard = ({
  children,
  className = '',
  texture,
  pixelSize = 1,
  slice = 4,
  maxRotation = 15,
  onMouseEnter,
  onMouseLeave,
  style: customStyle = {},
  isHovered: externalHovered, // New prop
}) => {
  const divRef = useRef(null);
  const [internalHovered, setInternalHovered] = useState(false);
  let hoverBoost = 2.5;

  // Determine effective hover state: use external if provided, otherwise internal
  const isHovered = externalHovered !== undefined ? externalHovered : internalHovered;

  const handleMouseMove = e => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const { width, height, left, top } = rect;
    const x = e.clientX - left;
    const y = e.clientY - top;

    const percentX = x / width - 0.5;
    const percentY = y / height - 0.5;

    const rotateX = percentY * maxRotation * -hoverBoost;
    const rotateY = percentX * maxRotation * hoverBoost;

    // Calculate holographic effect variables
    const holoX = (x / width) * 100;
    const holoY = (y / height) * 100;
    // Opacity based on distance from center (0 at center, 1 at edges)
    const distFromCenter = Math.sqrt(percentX * percentX + percentY * percentY) * 2; // *2 because percent is -0.5 to 0.5
    const holoOpacity = Math.min(distFromCenter, 1);

    divRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    divRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
    divRef.current.style.setProperty('--holo-x', `${holoX}%`);
    divRef.current.style.setProperty('--holo-y', `${holoY}%`);
    divRef.current.style.setProperty('--holo-opacity', `${holoOpacity}`);
  };

  const handleMouseLeave = e => {
    if (!divRef.current) return;
    divRef.current.style.setProperty('--rotate-x', '0deg');
    divRef.current.style.setProperty('--rotate-y', '0deg');
    divRef.current.style.setProperty('--holo-opacity', '0'); // Hide holo effect
    setInternalHovered(false);
    if (typeof onMouseLeave === 'function') onMouseLeave(e);
  };

  const handleMouseEnter = e => {
    setInternalHovered(true);
    if (typeof onMouseEnter === 'function') onMouseEnter(e);
  };

  const visualBorderWidth = slice * pixelSize;

  const style = {
    '--texture-url': texture ? `url(${texture})` : 'none',
    '--slice-amount': slice,
    '--border-width-visual': `${visualBorderWidth}px`,
    '--pixel-size': pixelSize,
    ...customStyle,
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`card-spotlight ${className} ${isHovered ? 'hovered' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
