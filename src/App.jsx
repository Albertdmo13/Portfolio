import { useState, useEffect, useRef, useMemo } from "react";
import ThreeLogo from "./components/ThreePixelLogo";
import PixelBlast from "./components/PixelBlast";
import IconRain from "./components/IconRain";
import TextType from "./components/TextType";
import SpotlightCard from "./components/SpotlightCard";
import Marquee from "react-fast-marquee";
import SectionTitle from "./components/SectionTitle";
import SectionBg from "./components/SectionBg";
import "./App.css";

// ... (Constants and helper components remain the same) ...

const skills_icons_url = "/Portfolio/icons/skills_icons";
const nine_slice_texture = "/Portfolio/misc/9_slice.png";
const nine_slice_texture2 = "/Portfolio/misc/9_slice_2.png";
const BACKGROUND_IMAGE_URL = "/Portfolio/backgrounds/window_view_big.png";
const BACKGROUND_IMAGE_BASE_HEIGHT_PX = 300;

const skills = [
  {
    name: "Angular",
    icon_url: skills_icons_url + "/angular.png",
    color_icon_url: skills_icons_url + "/angular_color.png",
  },
  {
    name: "Arduino",
    icon_url: skills_icons_url + "/arduino.png",
    color_icon_url: skills_icons_url + "/arduino_color.png",
  },
  {
    name: "Aseprite",
    icon_url: skills_icons_url + "/aseprite.png",
    color_icon_url: skills_icons_url + "/aseprite_color.png",
  },
  {
    name: "Blender",
    icon_url: skills_icons_url + "/blender.png",
    color_icon_url: skills_icons_url + "/blender_color.png",
  },
  {
    name: "CSS",
    icon_url: skills_icons_url + "/css.png",
    color_icon_url: skills_icons_url + "/css_color.png",
  },
  {
    name: "GameMaker",
    icon_url: skills_icons_url + "/gamemaker.png",
    color_icon_url: skills_icons_url + "/gamemaker_color.png",
  },
  {
    name: "Git",
    icon_url: skills_icons_url + "/git.png",
    color_icon_url: skills_icons_url + "/git_color.png",
  },
  {
    name: "GitHub",
    icon_url: skills_icons_url + "/github.png",
    color_icon_url: skills_icons_url + "/github_color.png",
  },
  {
    name: "Java",
    icon_url: skills_icons_url + "/java.png",
    color_icon_url: skills_icons_url + "/java_color.png",
  },
  {
    name: "JavaScript",
    icon_url: skills_icons_url + "/js.png",
    color_icon_url: skills_icons_url + "/js_color.png",
  },
  {
    name: "Linux",
    icon_url: skills_icons_url + "/linux.png",
    color_icon_url: skills_icons_url + "/linux_color.png",
  },
  {
    name: "OpenGL",
    icon_url: skills_icons_url + "/opengl.png",
    color_icon_url: skills_icons_url + "/opengl_color.png",
  },
  {
    name: "Photoshop",
    icon_url: skills_icons_url + "/photoshop.png",
    color_icon_url: skills_icons_url + "/photoshop_color.png",
  },
  {
    name: "Python",
    icon_url: skills_icons_url + "/python.png",
    color_icon_url: skills_icons_url + "/python_color.png",
  },
  {
    name: "React",
    icon_url: skills_icons_url + "/react.png",
    color_icon_url: skills_icons_url + "/react_color.png",
  },
  {
    name: "SQL",
    icon_url: skills_icons_url + "/sql.png",
    color_icon_url: skills_icons_url + "/sql_color.png",
  },
];

const cardItems = [
  { title: "Card 1", text: "T" },
  { title: "Card 2", text: "T" },
  { title: "Card 3", text: "T" },
  { title: "Card 4", text: "T" },
  { title: "Card 5", text: "T" },
  { title: "Card 6", text: "T" },
];

const sparkFrames = [
  // ... (sparkFrames array remains the same) ...
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

const headerButtons = {
  // ... (headerButtons object remains the same) ...
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
  // ... (dotFrames array remains the same) ...
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

function HoverButton({ href, normalSrc, hoverSrc, alt, width, height }) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="pixel-button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width,
        height,
      }}
    >
      <img src={hover ? hoverSrc : normalSrc} alt={alt} draggable="false" />
    </a>
  );
}

function App() {
  const [pxSize, setPxSize] = useState(4);
  // Renamed to contentVisible for clarity, since it controls more than just skills
  const [contentVisible, setContentVisible] = useState(false);
  const bannerRef = useRef(null);
  // Re-purposing backgroundRef to observe the main content area
  const headerTriggerRef = useRef(null);
  const mainContentRef = useRef(null);

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

  // Intersection Observer for the main content section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Show main content when it scrolls INTO view
            setContentVisible(true);
          } else {
            // This will hide it again when you scroll back to top
            setContentVisible(false);
          }
        });
      },
      {
        root: null,
        threshold: 0.1, // Trigger when 10% of the main element is visible
      }
    );

    if (mainContentRef.current) observer.observe(mainContentRef.current);

    return () => {
      if (mainContentRef.current) observer.unobserve(mainContentRef.current);
    };
  }, [mainContentRef]); // Ensure this dependency is correct

  const iconRainElement = useMemo(
    // ... (IconRain definition remains the same) ...
    () => (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: -1,
        }}
      >
        <IconRain
          icons={getSkillsIconUrls()}
          iconSize={34}
          pixelScale={pxSize}
          speed={0.5 * (pxSize / 4)}
          density={getSkillsIconUrls().length * 1.2}
          pixelSnap={false}
          color1="#3b3379"
          color2="#0e0911"
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
      <header
        ref={bannerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100svh", // 'svh' is good for mobile
          overflow: "hidden",
        }}
      >
        {/* Background layers */}
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
              url={"/Portfolio/3dmodels/albertdmo_pixel_logo_blue.glb"}
              pixelSize={pxSize}
              sparkFrames={sparkFrames}
            />
          </div>

          {/* Text below the logo */}
          <div
            style={{
              color: "#c8c3d6",
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
              width={`${pxSize * 50}px`}
              height={`${pxSize * 22}px`}
            />
            <HoverButton
              href={headerButtons.linkedin.link}
              normalSrc={headerButtons.linkedin.normal}
              hoverSrc={headerButtons.linkedin.hover}
              alt="LinkedIn"
              width={`${pxSize * 48}px`}
              height={`${pxSize * 22}px`}
            />
            <HoverButton
              href={headerButtons.cv.link}
              normalSrc={headerButtons.cv.normal}
              hoverSrc={headerButtons.cv.hover}
              alt="Curriculum"
              width={`${pxSize * 56}px`}
              height={`${pxSize * 22}px`}
            />
          </div>
        </div>
        <div
          ref={headerTriggerRef}
          style={{
            position: "absolute",
            bottom: "10vh", // Sits 10% from the bottom of the header
            width: "10px",
            height: "10px",
            pointerEvents: "none", // Makes it invisible to the mouse
          }}
        />
      </header>
      {/* ALWAYS RENDER <main>, and add the ref back */}
      <main
        ref={mainContentRef}
        className={`main-content ${contentVisible ? "visible" : ""}`}
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "50vh", // Ensures total page height forces a scrollbar
          display: "flex",
          justifyContent: "center", // centers the content horizontally
        }}
      >
        {/* Content wrapper that limits total width */}
        <div
          style={{
            width: "60%",
            padding: "0 2rem", // keeps nice spacing on smaller screens
          }}
        >
          <section style={{ position: "relative" }}>
            <div
              className={`marquee-wrapper ${contentVisible ? "visible" : ""}`}
              style={{
                position: "relative",
                fontFamily: "'Press Start 2P', monospace",
                margin: "0 auto",
                top: "-10vh",
                overflow: "hidden",
                textAlign: "center",
                padding: `${pxSize * 4}px 0`,
              }}
            >
              <SectionBg
                texture={nine_slice_texture}
                pixelSize={pxSize}
                slice={4}
                className="skills-section-bg"
              >
                {/* Título más pequeño con sombra roja */}
                <SectionTitle
                  text="SKILLS"
                  pixelSize={pxSize * 2}
                  color="#ffffffff"
                  shadowColor="#5A2BFF"
                />
                {/* Marquee Content */}
                <div style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                  <Marquee
                    pauseOnHover={false}
                    speed={40}
                    gradient={true}
                    gradientWidth={pxSize * 20}
                    gradientColor="#150B27"
                  >
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: `0 ${pxSize * 8}px`,
                        }}
                      >
                        <img
                          src={skill.color_icon_url}
                          alt={skill.name}
                          style={{
                            width: `${pxSize * 26}px`,
                            height: `${pxSize * 26}px`,
                            imageRendering: "pixelated",
                          }}
                        />
                      </div>
                    ))}
                  </Marquee>
                </div>

                <div
                  style={{
                    position: "relative",
                    display: "grid",
                    fontFamily: "'Press Start 2P', monospace",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: "1rem",
                    margin: "0 auto",
                    marginTop: `${pxSize * 8}px`,
                    alignContent: "start",
                  }}
                >
                  {skills.map((skill, index) => (
                    <SpotlightCard
                      key={index}
                      texture={nine_slice_texture2}
                      pixelSize={pxSize}
                      slice={4}
                      maxRotation={15}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: `0px`,
                        }}
                      >
                        <img
                          src={skill.color_icon_url}
                          alt={skill.name}
                          style={{
                            width: `${pxSize * 26}px`,
                            height: `${pxSize * 26}px`,
                            imageRendering: "pixelated",
                            marginBottom: `${pxSize * 3}px`,
                          }}
                        />
                        <span
                          style={{
                            color: "white",
                            textAlign: "center",
                            textShadow: "3px 3px 0 #000",
                          }}
                        >
                          {skill.name}
                        </span>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </SectionBg>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
