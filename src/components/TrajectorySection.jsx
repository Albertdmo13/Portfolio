import React from "react";
import SectionBg from "./SectionBg";
import NineSliceBorder from "./NineSliceBorder";
import "./TrajectorySection.css";

const trajectoryData = [
  {
    date: "2022 - Present",
    title: "Computer Engineering",
    company: "UCLM Escuela Superior de Informatica",
    description: "Student",
  },
  {
    date: "2024 - Present",
    title: "Assistant Researcher",
    company: "VISILAB",
    description: "",
  },
];

const TRAJECTORY_TITLE_IMG = "/Portfolio/misc/trajectory.png";

export default function TrajectorySection({ pxSize, nineSliceTexture }) {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "5rem",
        marginBottom: "5rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${-pxSize * 20}px`,
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
          src={TRAJECTORY_TITLE_IMG}
          alt="Trajectory"
          style={{
            width: `${pxSize * 128}px`,
            height: "auto",
            imageRendering: "pixelated",
            filter: "drop-shadow(0 0 10px rgba(138, 99, 255, 0.8))",
            animation: "float 3s ease-in-out infinite",
          }}
        />
      </div>

      <SectionBg
        texture={nineSliceTexture}
        pixelSize={pxSize}
        slice={4}
        style={{
          width: "90%",
          maxWidth: "1200px",
          padding: `${pxSize * 8}px`,
          display: "flex",
          justifyContent: "center",
          overflow: "visible", // Important for 3D/pop-out effects
        }}
      >
        <div className="trajectory-wrapper">
          <div className="trajectory-line" />
          
          {trajectoryData.map((item, index) => (
            <div key={index} className="trajectory-item">
              <div className="trajectory-dot" />
              
              <div className="trajectory-date">
                {item.date}
              </div>
              
              <div className="trajectory-content">
                <NineSliceBorder
                  texture={nineSliceTexture}
                  pixelSize={pxSize}
                  slice={4}
                  style={{
                    padding: "1.5rem",
                    backgroundColor: "rgba(0, 0, 0, 0.3)", // Slight darken
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      color: "#fff",
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {item.title}
                  </h3>
                  <h4
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      color: "#8a63ff",
                      fontSize: "0.7rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {item.company}
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      color: "#c8c3d6",
                      fontSize: "0.6rem",
                      lineHeight: "1.6",
                    }}
                  >
                    {item.description}
                  </p>
                </NineSliceBorder>
              </div>
            </div>
          ))}
        </div>
      </SectionBg>
    </section>
  );
}
