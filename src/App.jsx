import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import "./App.css";

// Components
import IconRainBackground from "./components/IconRainBackground";
import PixelBlast from "./components/PixelBlast";
import Header from "./components/Header";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import TrajectorySection from "./components/TrajectorySection";
import GameCard from "./components/GameCard";
import TooltipCard from "./components/TooltipCard";

import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";

// Constants
import {
  hardSkills,
  softSkills,
  sparkFrames,
  headerButtons,
  nine_slice_texture,
} from "./constants";

function App() {
  const [pxSize, setPxSize] = useState(1);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle resizing
  useEffect(() => {
    const updatePixelSize = () => {
      const width = window.innerWidth;
      // Enforce minimum scale of 2 for mobile to ensure text is readable
      const scale = width < 768 ? 2 : Math.max(2, Math.round((width / 1920) * 3));
      setPxSize(scale);
    };
    updatePixelSize();
    window.addEventListener("resize", updatePixelSize);
    document.addEventListener("fullscreenchange", updatePixelSize);
    return () => {
      window.removeEventListener("resize", updatePixelSize);
      document.removeEventListener("fullscreenchange", updatePixelSize);
    };
  }, []);

  // Track mouse for tooltip
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="app-container">
      {/* PixelBlast Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#0e0911",
          zIndex: -2,
        }}
      />
      <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
        <PixelBlast
          variant="square"
          pixelSize={pxSize}
          color="#190044"
          patternScale={3}
          patternDensity={1.2}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={5.0}
          edgeFade={0}
          transparent
          antialias={false}
          shape="circle"
          parallaxSpeed={0.2}
        />
      </div>

      {/* Background Rain */}
      <IconRainBackground pxSize={pxSize} />

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          minHeight: "100vh",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Header Section */}
        <section
          style={{
            height: "85vh",
            width: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Header pxSize={pxSize} sparkFrames={sparkFrames} />
        </section>

        {/* About Me Section */}
        <AboutSection pxSize={pxSize} />

        {/* Skills Section */}
        <SkillsSection
          pxSize={pxSize}
          hoveredSkill={hoveredSkill}
          setHoveredSkill={setHoveredSkill}
          hardSkills={hardSkills}
          softSkills={softSkills}
        />

        {/* Trajectory Section */}
        <TrajectorySection
          pxSize={pxSize}
          nineSliceTexture={nine_slice_texture}
        />

        {/* Projects / Games Section (Marquee) */}
        <ProjectsSection pxSize={pxSize} />
        
        {/* Contact Section */}
        <ContactSection pxSize={pxSize} />

        {/* Footer */}
        <footer
          style={{
            width: "100%",
            padding: `${pxSize * 4}px`,
            textAlign: "center",
            color: "#666",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: `${pxSize * 0.25}rem`,
            backgroundColor: "#0e0911",
          }}
        >
          <p>© 2025 Alberto Díaz Maroto Ortiz. All rights reserved.</p>
        </footer>
      </div>

      {/* Tooltip Layer */}
      <TooltipCard
        hoveredSkill={hoveredSkill}
        mousePos={mousePos}
        pxSize={pxSize}
      />
    </div>
  );
}

export default App;
