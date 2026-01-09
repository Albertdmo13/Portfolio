import { useRef, useState, useLayoutEffect } from "react";
import SectionBg from "./SectionBg";
import SpotlightCard from "./SpotlightCard";
import NineSliceBorder from "./NineSliceBorder";
import { useOnScreen } from "../hooks/useOnScreen";
import { nine_slice_texture, nine_slice_texture2, SKILLS_TITLE_IMG } from "../constants";

function SkillGroup({
  title,
  skills,
  pxSize,
  hoveredSkill,
  setHoveredSkill,
  isSoft = false,
}) {
  const contentRef = useRef(null);
  const [bgDimensions, setBgDimensions] = useState({
    width: "100%",
    height: "auto",
  });
  useLayoutEffect(() => {
    const calculateDimensions = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const rawWidth = element.scrollWidth;
      const rawHeight = element.scrollHeight;

      // Snap to nearest multiple of tile size (pxSize * 4 * slice)
      // slice=4, so tile is 4 pixels. Scaled by pxSize.
      // Actually 9-slice usually repeats the center.
      // Let's just snap to a reasonable grid to avoid jitter.
      const tileSize = pxSize * 4;

      const snappedWidth = Math.ceil(rawWidth / tileSize) * tileSize;
      const snappedHeight = Math.ceil(rawHeight / tileSize) * tileSize;

      setBgDimensions({
        width: `${snappedWidth}px`,
        height: `${snappedHeight}px`,
      });
    };

    const observer = new ResizeObserver(() => {
      calculateDimensions();
    });

    observer.observe(contentRef.current);
    calculateDimensions();

    return () => observer.disconnect();
  }, [pxSize, skills.length]);

  return (
    <SectionBg
      texture={nine_slice_texture}
      pixelSize={pxSize}
      slice={4}
      className="skills-section-bg"
      style={{
        width: bgDimensions.width,
        height: bgDimensions.height,
        transition: "width 0.2s ease, height 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        flex: "1 1 300px", // Allow growing/shrinking, min-width 300px
        maxWidth: "600px", // Don't get too wide
      }}
    >
      <div
        ref={contentRef}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: `${pxSize * 1.5}px ${pxSize * 4}px`,
          boxSizing: "border-box",
          fontFamily: "'Press Start 2P', monospace", // Added font family
        }}
      >
        <h3
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: "#fff",
            fontSize: `${pxSize * 0.5}rem`,
            textAlign: "center",
            marginBottom: `${pxSize * 4}px`,
            textShadow: "2px 2px 0 #000",
          }}
        >
          {title}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(${
              isSoft ? "160px" : "110px"
            }, 1fr))`,
            gap: "0",
            width: "100%",
          }}
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredSkill(skill)}
              onMouseLeave={() => setHoveredSkill(null)}
              style={{
                padding: "0.5rem",
                display: "flex",
                zIndex: hoveredSkill?.name === skill.name ? 100 : 1,
                position: "relative",
                aspectRatio: "3/4",
              }}
            >
              <SpotlightCard
                texture={nine_slice_texture}
                pixelSize={pxSize}
                slice={4}
                maxRotation={15}
                style={{ width: "100%", height: "100%" }}
                isHovered={hoveredSkill?.name === skill.name}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%",
                    padding: `${pxSize * (isSoft ? 4 : 2)}px`,
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {skill.color_icon_url && (
                      <img
                        src={skill.color_icon_url}
                        alt={skill.name}
                        style={{
                          width: `${pxSize * (isSoft ? 52 : 26)}px`,
                          height: `${pxSize * (isSoft ? 52 : 26)}px`,
                          imageRendering: "pixelated",
                          position: "relative",
                          zIndex: 10,
                          filter: "none",
                        }}
                      />
                    )}
                  </div>

                  <div style={{ marginTop: `${pxSize * 2}px` }}>
                    <NineSliceBorder
                      texture={nine_slice_texture2}
                      pixelSize={pxSize}
                      slice={4}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: `${pxSize}px ${pxSize * 2}px`,
                        position: "relative",
                        zIndex: 5,
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          textAlign: "center",
                          textShadow: "3px 3px 0 #000",
                          fontSize: `${pxSize * 0.3}rem`,
                          lineHeight: 1.2,
                          whiteSpace: isSoft ? "normal" : "nowrap",
                        }}
                      >
                        {skill.name}
                      </span>
                    </NineSliceBorder>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </SectionBg>
  );
}

export default function SkillsSection({
  pxSize,
  hoveredSkill,
  setHoveredSkill,
  hardSkills,
  softSkills,
}) {
  const ref = useRef(null);
  const isVisible = useOnScreen(ref, "-20%");

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${isVisible ? "visible" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="skills-wrapper"
        style={{
          position: "relative",
          marginTop: "0",
          paddingTop: `${pxSize * 6}px`,
          paddingBottom: `${pxSize * 4}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start", // Align top
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${-pxSize * 0}px`,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={SKILLS_TITLE_IMG}
            alt="Skills"
            style={{
              width: `${pxSize * 71}px`,
              height: "auto",
              imageRendering: "pixelated",
              filter: "drop-shadow(0 0 10px rgba(138, 99, 255, 0.8))",
              animation: "float 3s ease-in-out infinite",
            }}
          />
          <style>
            {`
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-${pxSize * 2}px); }
              }
            `}
          </style>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "center",
            width: "100%",
            marginTop: `${pxSize * 20}px`, // Push down to make room for title
          }}
        >
          <SkillGroup
            title="HARD SKILLS"
            skills={hardSkills}
            pxSize={pxSize}
            hoveredSkill={hoveredSkill}
            setHoveredSkill={setHoveredSkill}
          />
          <SkillGroup
            title="SOFT SKILLS"
            skills={softSkills}
            pxSize={pxSize}
            hoveredSkill={hoveredSkill}
            setHoveredSkill={setHoveredSkill}
            isSoft={true}
          />
        </div>
      </div>
    </section>
  );
}
