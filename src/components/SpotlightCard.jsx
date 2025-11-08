import { useRef } from 'react';
import './SpotlightCard.css';

const SpotlightCard = ({
  children,
  className = '',
  texture,
  pixelSize = 1,
  slice = 4,
  maxRotation = 15, // base tilt, smaller base for smoother scaling
}) => {
  const divRef = useRef(null);
  let hoverBoost = 2.5; // how much stronger tilt becomes on hover

  const handleMouseMove = e => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const { width, height, left, top } = rect;
    const x = e.clientX - left;
    const y = e.clientY - top;

    const percentX = x / width - 0.5;
    const percentY = y / height - 0.5;

    // stronger tilt on hover
    const rotateX = percentY * maxRotation * -hoverBoost;
    const rotateY = percentX * maxRotation * hoverBoost;

    divRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    divRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    if (!divRef.current) return;
    divRef.current.style.setProperty('--rotate-x', '0deg');
    divRef.current.style.setProperty('--rotate-y', '0deg');
  };

  const visualBorderWidth = slice * pixelSize;

  const style = {
    '--texture-url': texture ? `url(${texture})` : 'none',
    '--slice-amount': slice,
    '--border-width-visual': `${visualBorderWidth}px`,
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`card-spotlight ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
