import React, { useRef } from "react";
import ProjectCard from "./ProjectCard";
import { projects, nine_slice_texture } from "../constants";
import { useOnScreen } from "../hooks/useOnScreen";

export default function ProjectsSection({ pxSize }) {
  const ref = useRef(null);
  const isVisible = useOnScreen(ref, "-20%");

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${isVisible ? "visible" : ""}`}
      style={{
        width: "100%",
        padding: `${pxSize * 10}px 0`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: `${pxSize * 10}px`,
        marginBottom: `${pxSize * 20}px`,
      }}
    >
      <img
        src="/Portfolio/misc/projects.png"
        alt="PROJECTS"
        style={{
          imageRendering: "pixelated",
          height: `${pxSize * 16}px`,
          marginBottom: `${pxSize * 8}px`,
          filter: "drop-shadow(0 0 10px rgba(138, 99, 255, 0.8))",
          animation: "float 3s ease-in-out infinite",
        }}
      />

      <div
        style={{
          width: "80%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          gap: `${pxSize * 8}px`,
          padding: `${pxSize * 4}px`,
        }}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            pxSize={pxSize}
            nineSliceTexture={nine_slice_texture}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}
