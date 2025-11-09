import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeLogo from "./components/ThreePixelLogo";
import PixelBlast from "./components/PixelBlast";
import IconRain from "./components/IconRain";
import TextType from "./components/TextType";
import SpotlightCard from "./components/SpotlightCard";
import Marquee from "react-fast-marquee";
import SectionTitle from "./components/SectionTitle";
import SectionBg from "./components/SectionBg";
import GameCard from "./components/GameCard";
import "./App.css";

const skills_icons_url = "/Portfolio/icons/skills_icons";
const nine_slice_texture = "/Portfolio/misc/9_slice.png";
const nine_slice_texture2 = "/Portfolio/misc/9_slice_2.png";
const BACKGROUND_IMAGE_BASE_HEIGHT_PX = 300;

const cardBackgrounds = [
  "/Portfolio/misc/GameCardBackground1.png",
  "/Portfolio/misc/GameCardBackground2.png",
];
const skills = [
  {
    name: "Angular",
    icon_url: skills_icons_url + "/angular.png",
    color_icon_url: skills_icons_url + "/angular_color.png",
    cardBackground: cardBackgrounds[0],
  },
  {
    name: "Arduino",
    icon_url: skills_icons_url + "/arduino.png",
    color_icon_url: skills_icons_url + "/arduino_color.png",
    cardBackground: cardBackgrounds[1],
  },
  {
    name: "Aseprite",
    icon_url: skills_icons_url + "/aseprite.png",
    color_icon_url: skills_icons_url + "/aseprite_color.png",
    cardBackground: cardBackgrounds[0],
  },
  {
    name: "Blender",
    icon_url: skills_icons_url + "/blender.png",
    color_icon_url: skills_icons_url + "/blender_color.png",
    cardBackground: cardBackgrounds[1],
  },
  {
    name: "CSS",
    icon_url: skills_icons_url + "/css.png",
    color_icon_url: skills_icons_url + "/css_color.png",
    cardBackground: cardBackgrounds[0],
  },
  {
    name: "GameMaker",
    icon_url: skills_icons_url + "/gamemaker.png",
    color_icon_url: skills_icons_url + "/gamemaker_color.png",
    cardBackground: cardBackgrounds[1],
  },
  {
    name: "Git",
    icon_url: skills_icons_url + "/git.png",
    color_icon_url: skills_icons_url + "/git_color.png",
    cardBackground: cardBackgrounds[0],
  },
  {
    name: "GitHub",
    icon_url: skills_icons_url + "/github.png",
    color_icon_url: skills_icons_url + "/github_color.png",
    cardBackground: cardBackgrounds[1],
  },
  {
    name: "Java",
    icon_url: skills_icons_url + "/java.png",
    color_icon_url: skills_icons_url + "/java_color.png",
    cardBackground: cardBackgrounds[0],
  },
  {
    name: "JavaScript",
    icon_url: skills_icons_url + "/js.png",
    color_icon_url: skills_icons_url + "/js_color.png",
    cardBackground: cardBackgrounds[1],
  },
  {
    name: "Linux",
    icon_url: skills_icons_url + "/linux.png",
    color_icon_url: skills_icons_url + "/linux_color.png",
    cardBackground: cardBackgrounds[0],
  },
  {
    name: "OpenGL",
    icon_url: skills_icons_url + "/opengl.png",
    color_icon_url: skills_icons_url + "/opengl_color.png",
    cardBackground: cardBackgrounds[1],
  },
  {
    name: "Photoshop",
    icon_url: skills_icons_url + "/photoshop.png",
    color_icon_url: skills_icons_url + "/photoshop_color.png",
    cardBackground: cardBackgrounds[0],
  },
  {
    name: "Python",
    icon_url: skills_icons_url + "/python.png",
    color_icon_url: skills_icons_url + "/python_color.png",
    cardBackground: cardBackgrounds[1],
  },
  {
    name: "React",
    icon_url: skills_icons_url + "/react.png",
    color_icon_url: skills_icons_url + "/react_color.png",
    cardBackground: cardBackgrounds[0],
  },
  {
    name: "SQL",
    icon_url: skills_icons_url + "/sql.png",
    color_icon_url: skills_icons_url + "/sql_color.png",
    cardBackground: cardBackgrounds[1],
  },
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
      style={{ width, height }}
    >
      <img src={hover ? hoverSrc : normalSrc} alt={alt} draggable="false" />
    </a>
  );
}

function App() {
  const [pxSize, setPxSize] = useState(4);
  const [contentVisible, setContentVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const bannerRef = useRef(null);
  const headerTriggerRef = useRef(null);
  const mainContentRef = useRef(null);

  // Actualiza posición del ratón
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Escala dinámica de píxel
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

  // Intersection Observer para mostrar el contenido principal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setContentVisible(entry.isIntersecting);
        });
      },
      { root: null, threshold: 0.1 }
    );
    if (mainContentRef.current) observer.observe(mainContentRef.current);
    return () => {
      if (mainContentRef.current) observer.unobserve(mainContentRef.current);
    };
  }, [mainContentRef]);

  const iconRainElement = useMemo(
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
          height: "100svh",
          overflow: "hidden",
        }}
      >
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

        {/* Centro del header */}
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
          <ThreeLogo
            url={"/Portfolio/3dmodels/albertdmo_pixel_logo_blue.glb"}
            pixelSize={pxSize}
            sparkFrames={sparkFrames}
          />

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
            bottom: "10vh",
            width: "10px",
            height: "10px",
          }}
        />
      </header>

      <main
        ref={mainContentRef}
        className={`main-content ${contentVisible ? "visible" : ""}`}
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "60%", padding: "0 2rem" }}>
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
                <SectionTitle
                  text="SKILLS"
                  pixelSize={pxSize * 2}
                  color="#ffffffff"
                  shadowColor="#5A2BFF"
                />

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
                      "repeat(auto-fill, minmax(110px, 1fr))",
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
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
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
                            fontFamily: "alice, sans-serif",
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
{/* Tooltip GameCard animado (fuera del main para evitar clipping) */}
<AnimatePresence>
  {hoveredSkill && (
    (() => {
      // card dimensions in pixels
      const cardWidth = 100 * pxSize;
      const cardHeight = 140 * pxSize;
      const offset = 5 * pxSize;

      // default position (below mouse)
      let left = mousePos.x + offset;
      let top = mousePos.y + offset;

      // if tooltip would overflow bottom of screen, flip upward
      if (top + cardHeight > window.innerHeight) {
        top = mousePos.y - cardHeight - offset;
      }

      // also prevent right-side overflow
      if (left + cardWidth > window.innerWidth) {
        left = window.innerWidth - cardWidth - offset;
      }

      return (
        <motion.div
          key="tooltip-card"
          initial={{ opacity: 0, scale: 0.9, filter: "brightness(3)" }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: [
              "brightness(2)", // very bright at start
              "brightness(1.2)", // quick fade down
              "brightness(1)" // normal brightness
            ],
          }}
          exit={{ opacity: 0, scale: 0.9, filter: "brightness(1)" }}
          transition={{
            duration: 0.15,
            ease: "easeOut",
            filter: { duration: 0.35, ease: "easeOut" },
          }}
          style={{
            position: "fixed",
            left: `${left}px`,
            top: `${top}px`,
            pointerEvents: "none",
            zIndex: 999999,
          }}
        >
          <GameCard
            pixelSize={pxSize}
            image={hoveredSkill.cardBackground}
            title={hoveredSkill.name}
            description={`This is a ${hoveredSkill.name} skill card.`}
            item={hoveredSkill.color_icon_url}
          />
        </motion.div>
      );
    })()
  )}
</AnimatePresence>

    </div>
  );
}

export default App;
