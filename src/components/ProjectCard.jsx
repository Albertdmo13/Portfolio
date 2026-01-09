import { useState } from "react";
import NineSliceBorder from "./NineSliceBorder";
import { useIsMobile } from "../hooks/useIsMobile";

export default function ProjectCard({ project, pxSize, nineSliceTexture, isVisible = true }) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  const CardWrapper = project.link ? "a" : "div";
  const cardProps = project.link
    ? {
        href: project.link,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <CardWrapper
      {...cardProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`scroll-reveal ${isVisible ? "visible" : ""}`}
      style={{
        textDecoration: "none",
        transition: "transform 0.3s ease, filter 0.3s ease",
        transform: isHovered ? `translateY(-${pxSize * 3}px)` : "translateY(0)",
        cursor: project.link ? "pointer" : "default",
        width: "100%",
        display: "block",
        filter: isHovered ? "drop-shadow(0 0 20px rgba(138, 99, 255, 0.6))" : "drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))",
      }}
    >
      <NineSliceBorder
        texture={nineSliceTexture}
        pixelSize={pxSize}
        slice={4}
        style={{
          width: "100%",
          backgroundColor: "rgba(10, 5, 20, 0.8)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: isHovered 
            ? `inset 0 0 30px rgba(138, 99, 255, 0.3), 0 0 40px rgba(138, 99, 255, 0.4)`
            : "inset 0 0 20px rgba(0, 0, 0, 0.5)",
          padding: `${pxSize * 4}px`,
        }}
      >
        {/* Title and Tech Stack at the top */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: `${pxSize * 3}px`,
            gap: `${pxSize * 3}px`,
            flexWrap: "wrap", // Allow wrapping on small screens
          }}
        >
          <h3
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: `${pxSize * 0.6}rem`,
              color: "#fff",
              textShadow: "4px 4px 0 #000, 0 0 20px rgba(138, 99, 255, 0.5)",
              lineHeight: 1.4,
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            {project.title}
          </h3>

          {/* Tech stack icons next to title */}
          {project.techStack && project.techStack.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: `${pxSize * 2}px`,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {project.techStack.map((tech, idx) => (
                <img
                  key={idx}
                  src={tech}
                  alt="tech"
                  style={{
                    width: `${pxSize * 16}px`,
                    height: `${pxSize * 16}px`,
                    imageRendering: "pixelated",
                    filter: "drop-shadow(0 0 5px rgba(138, 99, 255, 0.3))",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                />
              ))}
            </div>
          )}
        </div>

        {/* Video and Description side by side */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // Responsive direction
            gap: `${pxSize * 4}px`,
            alignItems: "flex-start",
          }}
        >
          {/* Project Image or Video - Left */}
          {(project.image || project.video) && (
            <div
              style={{
                width: isMobile ? "100%" : "65%", // Responsive width
                aspectRatio: "16 / 9",
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#0a0514",
                border: `${pxSize * 0.5}px solid #3b3379`,
                flexShrink: 0,
              }}
            >
              {project.video ? (
                <video
                  src={project.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    imageRendering: "auto",
                    transition: "transform 0.3s ease, filter 0.3s ease",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    filter: isHovered ? "brightness(1.1) contrast(1.1)" : "brightness(1)",
                  }}
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    imageRendering: "auto",
                    transition: "transform 0.3s ease, filter 0.3s ease",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    filter: isHovered ? "brightness(1.1) contrast(1.1)" : "brightness(1)",
                  }}
                />
              )}
              
              {/* Vignette effect */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          )}

          {/* Description and Tags - Right */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: `${pxSize * 3}px`,
            }}
          >
            {/* Tags on top of description */}
            {project.tags && project.tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: `${pxSize * 1.5}px`,
                  flexWrap: "wrap",
                  marginTop: "auto",
                }}
              >
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: `${pxSize * 0.28}rem`,
                      backgroundColor: "rgba(138, 99, 255, 0.95)",
                      color: "#fff",
                      padding: `${pxSize * 1}px ${pxSize * 2}px`,
                      borderRadius: `${pxSize * 0.5}px`,
                      textShadow: "2px 2px 0 #000",
                      border: `${pxSize * 0.25}px solid rgba(200, 180, 255, 0.5)`,
                      boxShadow: "0 0 10px rgba(138, 99, 255, 0.5)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {/* Description */}
            {project.description && (
              <p
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: `${pxSize * 0.35}rem`,
                  color: "#d4c8e6",
                  lineHeight: 1.7,
                  textShadow: "2px 2px 0 #000",
                  margin: 0,
                }}
              >
                {project.description}
              </p>
            )}


          </div>
        </div>
      </NineSliceBorder>
    </CardWrapper>
  );
}