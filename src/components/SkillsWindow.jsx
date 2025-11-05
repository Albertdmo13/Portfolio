import { useState, useEffect } from "react";
import "./SkillsWindow.css";

// ==========================================================
// NEW COMPONENT: Progressive Text Typing Effect
// ==========================================================
const ProgressiveText = ({ text, delay = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // When the 'text' prop changes (i.e., new skill is selected), reset and start typing
  useEffect(() => {
    setDisplayedText(""); // Clear text immediately
    setCurrentIndex(0); // Reset index to start typing from the beginning
  }, [text]);

  // Typing logic
  useEffect(() => {
    if (!text || currentIndex >= text.length) {
      return; // Stop if no text or fully typed
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.substring(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, delay);

    return () => clearTimeout(timer); // Cleanup timer on unmount or dependency change
  }, [text, currentIndex, delay]);

  return <>{displayedText}</>;
};
// ==========================================================

const ProgressBar = ({ level, maxLevel = 100, pixelSize }) => {
  const progressPercent = Math.min(level, maxLevel) / maxLevel;
  const progressBarHeight = 2.5 * pixelSize;

  return (
    <div
      className="progress-bar-container"
      style={{
        height: `${progressBarHeight}px`,
        marginTop: `${0.8 * pixelSize}px`,
        marginBottom: `${0.4 * pixelSize}px`,
      }}
    >
      <div
        className="progress-bar-fill"
        style={{
          width: `${progressPercent * 100}%`,
          transition: "width 0.4s ease-out",
        }}
      />
    </div>
  );
};

export default function SkillsWindow({ pixelSize = 3 }) {
  // We need to keep track of the PREVIOUSLY selected item to display it during the fade-out
  const [selected, setSelected] = useState(null);
  const [displayItem, setDisplayItem] = useState(null); // The item currently displayed to the user
  const [groupedItems, setGroupedItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const BASE_WIDTH = 352;
  const BASE_HEIGHT = 189;

  const WINDOW_WIDTH = BASE_WIDTH * pixelSize;
  const WINDOW_HEIGHT = BASE_HEIGHT * pixelSize;
  const LIST_WIDTH = 60 * pixelSize;
  const INFO_WIDTH = 120 * pixelSize;
  const MEDIA_WIDTH = WINDOW_WIDTH - LIST_WIDTH - INFO_WIDTH;
  const HANDLE_HEIGHT = 0 * pixelSize;
  const TEXT_DELAY = 20; // ms per character for progressive text

  // --- Load data from JSON ---
  useEffect(() => {
    fetch("/Portfolio/data/skills.json")
      .then((res) => res.json())
      .then((data) => setGroupedItems(data))
      .catch((err) => console.error("Error loading skills.json:", err));
  }, []);

  // Handle selection with transition
  const handleSelect = (item) => {
    if (selected?.id === item.id) return; // Prevent transition if clicking the same item

    // 1. Start fade-out animation
    setIsAnimating(true);

    // 2. Wait for fade-out (250ms), then update the displayed item and start fade-in
    setTimeout(() => {
      setSelected(item); // Update the true selected item
      setDisplayItem(item); // Update the item for display
      setIsAnimating(false);
    }, 250); // Match this duration to the fadeOutBox animation duration
  };

  // Initial selection setup (for when the window first loads and no item is selected)
  useEffect(() => {
    if (selected) {
      setDisplayItem(selected);
    }
  }, [selected]);

  // The content itself only shows once the fade-out is complete (isAnimating is false)
  const infoContent = (
    // Use 'displayItem' for all content, ensuring the old content stays visible during the fade-out
    <div className={`skills-info-container ${isAnimating ? "fade-out" : ""}`}>
      {/* ICON + NAME + PROGRESS BAR (SIDE BY SIDE) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: `${3 * pixelSize}px`,
          marginBottom: `${3 * pixelSize}px`,
        }}
      >
        {/* ICON */}
        <img
          src={`/Portfolio/icons/${displayItem?.icon}`}
          alt={`${displayItem?.name} icon`}
          style={{
            width: `${30 * pixelSize}px`,
            height: `${30 * pixelSize}px`,
            imageRendering: "pixelated",
            flexShrink: 0,
          }}
        />

        {/* NAME + PROGRESS BAR */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: `${0.6 * pixelSize}px`,
            }}
          >
            <span style={{ fontWeight: "bold" }}>{displayItem?.name}</span>
            <span>Lv. {displayItem?.level}</span>
          </div>
          <ProgressBar level={displayItem?.level || 0} pixelSize={pixelSize} />
        </div>
      </div>

      {/* DESCRIPTION - NOW USING PROGRESSIVE TEXT */}
      <div className="skills-info-box description-box">
        {/* We only want to start typing when the item is done fading in (isAnimating is false) */}
        {!isAnimating ? (
          <ProgressiveText
            text={displayItem?.description || ""}
            delay={TEXT_DELAY} // Adjust this value (ms per character) for speed
          />
        ) : (
          // During fade-out, show the static text to ensure a smooth transition
          displayItem?.description
        )}
      </div>
    </div>
  );

  return (
    <div
      className="skills-window"
      style={{
        width: `${WINDOW_WIDTH}px`,
        height: `${WINDOW_HEIGHT}px`,
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* === LEFT SECTION === */}
      <div
        className="skills-list"
        style={{
          width: `${LIST_WIDTH}px`,
          padding: `${2 * pixelSize}px`,
          paddingTop: `${HANDLE_HEIGHT}px`,
          overflowY: "auto",
        }}
      >
        {groupedItems.length > 0 ? (
          groupedItems.map((group) => (
            <div key={group.title} className="skills-group">
              <div className="skills-section-title">{group.title}</div>
              {group.skills.length > 0 ? (
                group.skills.map((item) => (
                  <div
                    key={item.id}
                    className={`skills-list-item ${
                      selected?.id === item.id ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(item)}
                    style={{
                      marginBottom: `${2 * pixelSize}px`,
                      padding: `${1.5 * pixelSize}px ${2 * pixelSize}px`,
                      cursor: "pointer",
                    }}
                  >
                    {item.name}
                  </div>
                ))
              ) : (
                <div
                  className="skills-list-item-empty"
                  style={{
                    padding: `${1.5 * pixelSize}px ${2 * pixelSize}px`,
                  }}
                >
                  [EMPTY]
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="skills-loading">Loading skills...</div>
        )}
      </div>

      {/* === MIDDLE SECTION (INFO) === */}
      <div
        className="skills-info"
        style={{
          width: `${INFO_WIDTH}px`,
          padding: `${3 * pixelSize}px`,
          paddingTop: `${HANDLE_HEIGHT + 2 * pixelSize}px`,
        }}
      >
        {/* Render the info content if there is an item to display OR we are animating */}
        {displayItem || isAnimating ? (
          infoContent
        ) : (
          <div className="skills-placeholder animated-placeholder">
            Select a skill to view its detailed information and progress.
          </div>
        )}
      </div>

      {/* === RIGHT SECTION (MEDIA) === */}
      <div
        className="skills-media"
        style={{
          width: `${MEDIA_WIDTH}px`,
          padding: `${3 * pixelSize}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          overflowY: "auto",
          gap: `${2 * pixelSize}px`,
        }}
      >
        {displayItem && displayItem.media && displayItem.media.length > 0 ? (
          displayItem.media.map((file, index) => (
            <img
              key={index}
              src={`/Portfolio/media/${file}`}
              alt={`${displayItem.name} preview ${index + 1}`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: `${1.5 * pixelSize}px`,
                imageRendering: "pixelated",
              }}
            />
          ))
        ) : (
          <div className="skills-media-placeholder">[No Media]</div>
        )}
      </div>
    </div>
  );
}
