import { useRef } from 'react';
import './SectionBg.css';

const SectionBg = ({
  children,
  className = '',
  texture,
  pixelSize = 1,
  slice = 4,
}) => {
  const divRef = useRef(null);

  const visualBorderWidth = slice * pixelSize;

  const style = {
    '--texture-url': texture ? `url(${texture})` : 'none',
    '--slice-amount': slice,
    '--border-width-visual': `${visualBorderWidth}px`,
  };

  return (
    <div
      ref={divRef}
      className={`section-bg ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default SectionBg;
