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
}) => {
  const divRef = useRef(null);
  const [hovered, setHovered] = useState(false); // 👈 Variable para detectar si está en hover
  let hoverBoost = 2.5;

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

    divRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    divRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleMouseLeave = e => {
    if (!divRef.current) return;
    divRef.current.style.setProperty('--rotate-x', '0deg');
    divRef.current.style.setProperty('--rotate-y', '0deg');
    setHovered(false);
    if (typeof onMouseLeave === 'function') onMouseLeave(e);
  };

  const handleMouseEnter = e => {
    setHovered(true);
    if (typeof onMouseEnter === 'function') onMouseEnter(e);
  };

  const visualBorderWidth = slice * pixelSize;

  const style = {
    '--texture-url': texture ? `url(${texture})` : 'none',
    '--slice-amount': slice,
    '--border-width-visual': `${visualBorderWidth}px`,
    '--pixel-size': pixelSize,
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`card-spotlight ${className} ${hovered ? 'hovered' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
