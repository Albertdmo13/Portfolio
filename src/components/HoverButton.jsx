import { useState } from "react";

export default function HoverButton({ href, normalSrc, hoverSrc, alt, width, height }) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="pixel-button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ width, height }}
    >
      <img src={hover ? hoverSrc : normalSrc} alt={alt} draggable="false" />
    </a>
  );
}
