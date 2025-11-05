import { useState, useEffect, useRef, useMemo } from "react";
import ThreeLogo from "./components/ThreePixelLogo";
import PixelBlast from "./components/PixelBlast";
import IconRain from "./components/IconRain";
import TextType from "./components/TextType";
import SkillsWindow from "./components/SkillsWindow";

import "./App.css";

const skills_icons_url = "/Portfolio/icons/skills_icons";
const BACKGROUND_IMAGE_URL = "/Portfolio/backgrounds/window_view_big.png"; // Constant for the image path

// New constant: Set the original pixel height of the image (e.g., if the image is 192x80 pixels)
const BACKGROUND_IMAGE_BASE_HEIGHT_PX = 270;

const skills = [
  { name: "Angular", icon_url: skills_icons_url + "/angular.png" },
  { name: "Arduino", icon_url: skills_icons_url + "/arduino.png" },
  { name: "Aseprite", icon_url: skills_icons_url + "/aseprite.png" },
  { name: "Blender", icon_url: skills_icons_url + "/blender.png" },
  { name: "CSS", icon_url: skills_icons_url + "/css.png" },
  { name: "GameMaker", icon_url: skills_icons_url + "/gamemaker.png" },
  { name: "Git", icon_url: skills_icons_url + "/git.png" },
  { name: "GitHub", icon_url: skills_icons_url + "/github.png" },
  { name: "Java", icon_url: skills_icons_url + "/java.png" },
  { name: "JavaScript", icon_url: skills_icons_url + "/js.png" },
  { name: "Linux", icon_url: skills_icons_url + "/linux.png" },
  { name: "OpenGL", icon_url: skills_icons_url + "/opengl.png" },
  { name: "Photoshop", icon_url: skills_icons_url + "/photoshop.png" },
  { name: "Python", icon_url: skills_icons_url + "/python.png" },
  { name: "React", icon_url: skills_icons_url + "/react.png" },
];

const sparkFrames = [
  "/Portfolio/spark/spark1.png",
  "/Portfolio/spark/spark2.png",
  "/Portfolio/spark/spark3.png",
  "/Portfolio/spark/spark4.png",
  "/Portfolio/spark/spark5.png",
  "/Portfolio/spark/spark6.png",
  "/Portfolio/spark/spark7.png",
  "/Portfolio/spark/spark8.png",
  "/Portfolio/spark/spark9.png",
  "/Portfolio/spark/spark10.png",
];

// Header buttons definition
const headerButtons = {
  github: {
    normal: "/Portfolio/header_buttons/btn_github.png",
    hover: "/Portfolio/header_buttons/btn_github_hovered.png",
    link: "https://github.com/Albertdmo13",
  },
  linkedin: {
    normal: "/Portfolio/header_buttons/btn_linkedin.png",
    hover: "/Portfolio/header_buttons/btn_linkedin_hovered.png",
    link: "https://www.linkedin.com/in/albertdmo/",
  },
  cv: {
    normal: "/Portfolio/header_buttons/btn_curriculum.png",
    hover: "/Portfolio/header_buttons/btn_curriculum_hovered.png",
    link: "/Portfolio/curriculum.pdf",
  },
};

const dotFrames = [
  skills_icons_url + "/dot1.png",
  skills_icons_url + "/dot2.png",
  skills_icons_url + "/dot3.png",
  skills_icons_url + "/dot4.png",
  skills_icons_url + "/dot5.png",
  skills_icons_url + "/dot6.png",
  skills_icons_url + "/dot7.png",
  skills_icons_url + "/dot8.png",
];

const getSkillsIconUrls = () => skills.map((skill) => skill.icon_url);

/* 🔸 Reusable button component that swaps its image on hover */
function HoverButton({ href, normalSrc, hoverSrc, alt, width, height }) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width,
        height,
        display: "inline-block",
        margin: "0 8px",
      }}
    >
      <img
        src={hover ? hoverSrc : normalSrc}
        alt={alt}
        draggable="false"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          imageRendering: "pixelated",
          display: "block",
        }}
      />
    </a>
  );
}
function App() {
  const [pxSize, setPxSize] = useState(4);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const bannerRef = useRef(null);
  const backgroundRef = useRef(null);

  // Dynamically scale pixel size based on screen width
  useEffect(() => {
    const updatePixelSize = () => {
      const width = window.innerWidth;
      const scale = Math.max(1, Math.round((width / 1920) * 3));
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

  // Intersection Observer for the background section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.6) {
            setSkillsVisible(true);
          } else {
            setSkillsVisible(false);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -20% 0px", // waits until user scrolls deeper
        threshold: [0, 0.25, 0.5, 0.6, 0.75, 1],
      }
    );

    if (backgroundRef.current) {
      observer.observe(backgroundRef.current);
    }

    return () => {
      if (backgroundRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(backgroundRef.current);
      }
    };
  }, [backgroundRef]);

  // Calculate the actual height of the background image container based on pxSize
  const backgroundHeight = BACKGROUND_IMAGE_BASE_HEIGHT_PX * pxSize;

  // Calculate the scaled vertical offset using the dynamic pxSize
  const verticalOffset = 17 * pxSize;

  const iconRainElement = useMemo(
    () => (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <IconRain
          icons={getSkillsIconUrls()}
          iconSize={34}
          pixelScale={pxSize}
          speed={0.5 * (pxSize / 4)}
          density={getSkillsIconUrls().length * 0.75}
          pixelSnap={false}
          color1="#3b3379"
          color2="#19061e"
          dotFrames={dotFrames}
          dotInterval={500}
          dotLifetime={3000}
          dotAnimDuration={1000}
          dotSize={10 * pxSize}
        />
      </div>
    ),
    [pxSize]
  );

  return (
    <div className="App" style={{ overflowX: "hidden" }}>
      {/* === HEADER SECTION === */}
      <header
        ref={bannerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Background layers */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#170a19",
            zIndex: -2,
          }}
        />
        <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
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
          />
        </div>

        {iconRainElement}

        {/* Centered logo, text, and buttons */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div>
            <ThreeLogo
              url={"/Portfolio/3dmodels/albertdmo_pixel_logo_gold.glb"}
              pixelSize={pxSize}
              sparkFrames={sparkFrames}
            />
          </div>

          {/* Text below the logo */}
          <div
            style={{
              color: "#c3d2d6",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: `${pxSize * 0.6}rem`,
              letterSpacing: "2px",
              textShadow: "4px 4px 0 #000",
              whiteSpace: "nowrap",
            }}
          >
            <TextType
              text={["Computer Scientist", "Game Developer", "Digital Artist"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="_"
            />
          </div>

          {/* Header buttons */}
          <div
            style={{
              marginTop: `${pxSize * 20}px`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: `${pxSize * 3}px`,
            }}
          >
            <HoverButton
              href={headerButtons.github.link}
              normalSrc={headerButtons.github.normal}
              hoverSrc={headerButtons.github.hover}
              alt="GitHub"
              width={`${pxSize * 51}px`}
              height={`${pxSize * 23}px`}
            />
            <HoverButton
              href={headerButtons.linkedin.link}
              normalSrc={headerButtons.linkedin.normal}
              hoverSrc={headerButtons.linkedin.hover}
              alt="LinkedIn"
              width={`${pxSize * 49}px`}
              height={`${pxSize * 23}px`}
            />
            <HoverButton
              href={headerButtons.cv.link}
              normalSrc={headerButtons.cv.normal}
              hoverSrc={headerButtons.cv.hover}
              alt="Curriculum"
              width={`${pxSize * 57}px`}
              height={`${pxSize * 24}px`}
            />
          </div>
        </div>
      </header>

      {/* === SEPARATOR BETWEEN HEADER AND NEXT SECTION === */}
      <div
        style={{
          width: "100%",
          height: `${pxSize * 33}px`,
          backgroundColor: "#000000",
        }}
      />

      {/* === BACKGROUND IMAGE AND SKILLS WINDOW CONTAINER === */}
      <div
        ref={backgroundRef}
        style={{
          position: "relative",
          width: "100%",
          height: `${backgroundHeight}px`,
          zIndex: 10,
        }}
      >
        {/* Background Image Element */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
            imageRendering: "pixelated",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* SkillsWindow - Centered, scaled offset, and conditionally visible */}
        {skillsVisible && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, calc(-50% - ${verticalOffset}px))`,
              zIndex: 20,
              opacity: skillsVisible ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          >
            <SkillsWindow pixelSize={pxSize} />
          </div>
        )}
      </div>

      {/* === MAIN CONTENT === */}
      <main
        style={{
          backgroundColor: "#000000",
          color: "#f7f4e7",
          fontFamily: "sans-serif",
          minHeight: "150vh",
          padding: "4rem 2rem",
        }}
      >
        <h1>Welcome to the next section</h1>
        <p>Test</p>
      </main>
    </div>
  );
}

export default App;
