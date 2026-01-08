import React from "react";
import "./GameCard.css";

// Corrected dimensions of the original sprite (100x140 pixels)
const BASE_WIDTH = 100;
const BASE_HEIGHT = 140;

// Pixel coordinates for the content boxes from your sprite
// Default Layout
const DEFAULT_LAYOUT = {
  TITLE_BOX: { top: 5, left: 4, width: 92, height: 12 },
  IMAGE_AREA: { top: 22, left: 7, width: 86, height: 56 },
  DESCRIPTION_BOX: { top: 86, left: 9, width: 82, height: 41 },
  CATEGORY_BOX: { top: 126, left: 3, width: 55, height: 10 },
  ITEM_BOX: { top: 37, left: 37, width: 26, height: 26 },
};

// Soft Skill Layout
const SOFT_LAYOUT = {
  TITLE_BOX: { top: 6, left: 6, width: 88, height: 24 },
  IMAGE_AREA: { top: 39, left: 7, width: 86, height: 56 },
  DESCRIPTION_BOX: { top: 103, left: 8, width: 84, height: 31 },
  CATEGORY_BOX: { top: 0, left: 0, width: 0, height: 0 }, // Hidden
  ITEM_BOX: { top: 41, left: 24, width: 52, height: 52 }, // Centered in Image Area
};

const GameCard = ({
  pixelSize = 3,
  image,
  title = "Card Title",
  category = "Category",
  description = "Card description.",
  item,
  className = "",
  cardSprite,
  isSoft = false,
}) => {
  const layout = isSoft ? SOFT_LAYOUT : DEFAULT_LAYOUT;

  const cardStyle = {
    "--pixel-size": pixelSize,
    "--sprite-url": `url(${cardSprite})`,
    width: `${BASE_WIDTH * pixelSize}px`,
    height: `${BASE_HEIGHT * pixelSize}px`,
  };

  const titleBoxStyle = {
    top: `${layout.TITLE_BOX.top * pixelSize}px`,
    left: `${layout.TITLE_BOX.left * pixelSize}px`,
    width: `${layout.TITLE_BOX.width * pixelSize}px`,
    height: `${layout.TITLE_BOX.height * pixelSize}px`,
  };

  const categoryBoxStyle = {
    top: `${layout.CATEGORY_BOX.top * pixelSize}px`,
    left: `${layout.CATEGORY_BOX.left * pixelSize}px`,
    width: `${layout.CATEGORY_BOX.width * pixelSize}px`,
    height: `${layout.CATEGORY_BOX.height * pixelSize}px`,
  };

  const imageAreaStyle = {
    top: `${layout.IMAGE_AREA.top * pixelSize}px`,
    left: `${layout.IMAGE_AREA.left * pixelSize}px`,
    width: `${layout.IMAGE_AREA.width * pixelSize}px`,
    height: `${layout.IMAGE_AREA.height * pixelSize}px`,
    backgroundImage: image ? `url(${image})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#000",
  };

  const descriptionBoxStyle = {
    top: `${layout.DESCRIPTION_BOX.top * pixelSize}px`,
    left: `${layout.DESCRIPTION_BOX.left * pixelSize}px`,
    width: `${layout.DESCRIPTION_BOX.width * pixelSize}px`,
    height: `${layout.DESCRIPTION_BOX.height * pixelSize}px`,
  };

  const itemBoxStyle = {
    top: `${layout.ITEM_BOX.top * pixelSize}px`,
    left: `${layout.ITEM_BOX.left * pixelSize}px`,
    width: `${layout.ITEM_BOX.width * pixelSize}px`,
    height: `${layout.ITEM_BOX.height * pixelSize}px`,
  };

  return (
    <div className={`game-card-wrapper ${className}`.trim()} style={cardStyle}>
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

      {/* 4. Text layers (on top of everything) */}
      <div
        className="game-card-title-box"
        style={{
          ...titleBoxStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {title && (
          <h3
            style={{
              fontSize:
                title.length > 9
                  ? `calc(6px * var(--pixel-size))`
                  : `calc(8px * var(--pixel-size))`,
            }}
          >
            {title}
          </h3>
        )}
      </div>
      <div className="game-card-category-box" style={categoryBoxStyle}>
        {category && <p className="category-text">{category}</p>}
      </div>
      <div className="game-card-description-box" style={descriptionBoxStyle}>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
};

export default React.memo(GameCard);
