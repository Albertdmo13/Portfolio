import React from 'react';
import './GameCard.css';
// Make sure to save your sprite image as 'game-card-sprite.png' in this folder
const cardSprite = '/Portfolio/misc/GameCard.png';

// Corrected dimensions of the original sprite (100x140 pixels)
const BASE_WIDTH = 100;
const BASE_HEIGHT = 140;

// Pixel coordinates for the content boxes from your sprite (adjusted for new layout)
const TITLE_BOX = { top: 5, left: 4, width: 92, height: 12 }; // Title sits at the very top
const IMAGE_AREA = { top: 22, left: 7, width: 86, height: 56 }; // Illustration area
const DESCRIPTION_BOX = { top: 87, left: 9, width: 82, height: 41 }; // Description sits below illustration

const ITEM_BOX = { top: 37, left: 37, width: 26, height: 26 };

const GameCard = ({
  pixelSize = 3,
  image,
  title = "Card Title",
  description = "Card description.",
  item,
  className = '',
}) => {

  const cardStyle = {
    '--pixel-size': pixelSize,
    '--sprite-url': `url(${cardSprite})`,
    width: `${BASE_WIDTH * pixelSize}px`,
    height: `${BASE_HEIGHT * pixelSize}px`,
  };

  const titleBoxStyle = {
    top: `${TITLE_BOX.top * pixelSize}px`,
    left: `${TITLE_BOX.left * pixelSize}px`,
    width: `${TITLE_BOX.width * pixelSize}px`,
    height: `${TITLE_BOX.height * pixelSize}px`,
  };

  const imageAreaStyle = {
    top: `${IMAGE_AREA.top * pixelSize}px`,
    left: `${IMAGE_AREA.left * pixelSize}px`,
    width: `${IMAGE_AREA.width * pixelSize}px`,
    height: `${IMAGE_AREA.height * pixelSize}px`,
    backgroundImage: image ? `url(${image})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#000',
  };

  const descriptionBoxStyle = {
    top: `${DESCRIPTION_BOX.top * pixelSize}px`,
    left: `${DESCRIPTION_BOX.left * pixelSize}px`,
    width: `${DESCRIPTION_BOX.width * pixelSize}px`,
    height: `${DESCRIPTION_BOX.height * pixelSize}px`,
  };

  const itemBoxStyle = {
    top: `${ITEM_BOX.top * pixelSize}px`,
    left: `${ITEM_BOX.left * pixelSize}px`,
    width: `${ITEM_BOX.width * pixelSize}px`,
    height: `${ITEM_BOX.height * pixelSize}px`,
  };

  return (
    <div
      className={`game-card-wrapper ${className}`.trim()}
      style={cardStyle}
    >
      {/* 1. Main illustration (behind frame) */}
      <div className="game-card-image-area" style={imageAreaStyle}></div>

      {/* 2. Item icon (on top of illustration, behind frame) */}
      {item && (
        <img
          src={item}
          className="game-card-item-icon"
          style={itemBoxStyle}
          alt="Card item"
        />
      )}

      {/* 3. Sprite frame (on top of illustration and item) */}
      <div className="game-card-sprite-frame"></div>

      {/* 4. Text (on top of everything) */}
      <div className="game-card-title-box" style={titleBoxStyle}>
        {title && <h3>{title}</h3>}
      </div>
      <div className="game-card-description-box" style={descriptionBoxStyle}>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
};

export default React.memo(GameCard);
