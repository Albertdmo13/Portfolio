import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Marquee from "react-fast-marquee";
import "./App.css";

// Components
import ThreeLogo from "./components/ThreePixelLogo";
import PixelBlast from "./components/PixelBlast";
import IconRain from "./components/IconRain";
import TextType from "./components/TextType";
import SpotlightCard from "./components/SpotlightCard";
import SectionTitle from "./components/SectionTitle";
import SectionBg from "./components/SectionBg";
import GameCard from "./components/GameCard";
import NineSliceBorder from "./components/NineSliceBorder";
import TrajectorySection from "./components/TrajectorySection";

// URLs, textures, and constants
const skills_icons_url = "/Portfolio/icons/skills_icons";
const nine_slice_texture = "/Portfolio/misc/9_slice.png";
const nine_slice_texture2 = "/Portfolio/misc/9_slice_2.png";
const carpet_nine_slice_texture = "/Portfolio/misc/carpet_9_slice.png";
const BACKGROUND_IMAGE_BASE_HEIGHT_PX = 300;
const SKILLS_TITLE_IMG = "/Portfolio/misc/skills.png";

const cardBackgrounds = [
  "/Portfolio/misc/GameCardBackground1.png",
  "/Portfolio/misc/GameCardBackground2.png",
  "/Portfolio/misc/GameCardBackground3.png",
  "/Portfolio/misc/GameCardBackground4.png",
];

const gameCards = [
  "/Portfolio/misc/GameCard1.png",
  "/Portfolio/misc/GameCard2.png",
  "/Portfolio/misc/GameCard3.png",
];

const gameCards_small = [
  "/Portfolio/misc/GameCard1_small.png",
  "/Portfolio/misc/GameCard2_small.png",
  "/Portfolio/misc/GameCard3_small.png",
];

const hardSkills = [
  {
    name: "Angular",
    icon_url: skills_icons_url + "/angular.png",
    color_icon_url: skills_icons_url + "/angular_color.png",
    cardBackground: cardBackgrounds[2],
    category: "Web",
    mastery: 0,
    description: "Framework for building dynamic web applications.",
  },
  {
    name: "Arduino",
    icon_url: skills_icons_url + "/arduino.png",
    color_icon_url: skills_icons_url + "/arduino_color.png",
    cardBackground: cardBackgrounds[0],
    category: "Embedded",
    mastery: 1,
    description: "Open-source hardware platform for electronics projects.",
  },
  {
    name: "Aseprite",
    icon_url: skills_icons_url + "/aseprite.png",
    color_icon_url: skills_icons_url + "/aseprite_color.png",
    cardBackground: cardBackgrounds[3],
    category: "Art",
    mastery: 2,
    description: "Pixel art and 2D animation editor.",
  },
  {
    name: "Blender",
    icon_url: skills_icons_url + "/blender.png",
    color_icon_url: skills_icons_url + "/blender_color.png",
    cardBackground: cardBackgrounds[1],
    category: "Art",
    mastery: 1,
    description: "3D creation suite for modeling, animation, and rendering.",
  },
  {
    name: "CSS",
    icon_url: skills_icons_url + "/css.png",
    color_icon_url: skills_icons_url + "/css_color.png",
    cardBackground: cardBackgrounds[2],
    category: "Web",
    mastery: 1,
    description: "Language for styling and designing web pages.",
  },
  {
    name: "GameMaker",
    icon_url: skills_icons_url + "/gamemaker.png",
    color_icon_url: skills_icons_url + "/gamemaker_color.png",
    cardBackground: cardBackgrounds[1],
    category: "Game Dev",
    mastery: 2,
    description: "Game engine for creating 2D games easily.",
  },
  {
    name: "Git",
    icon_url: skills_icons_url + "/git.png",
    color_icon_url: skills_icons_url + "/git_color.png",
    cardBackground: cardBackgrounds[0],
    category: "SW Dev",
    mastery: 1,
    description: "Distributed version control system for source code.",
  },
  {
    name: "GitHub",
    icon_url: skills_icons_url + "/github.png",
    color_icon_url: skills_icons_url + "/github_color.png",
    cardBackground: cardBackgrounds[1],
    category: "SW Dev",
    mastery: 1,
    description: "Platform for hosting and collaborating on Git projects.",
  },
  {
    name: "Java",
    icon_url: skills_icons_url + "/java.png",
    color_icon_url: skills_icons_url + "/java_color.png",
    cardBackground: cardBackgrounds[3],
    category: "SW Dev",
    mastery: 0,
    description: "Object-oriented programming language for multiple platforms.",
  },
  {
    name: "JavaScript",
    icon_url: skills_icons_url + "/js.png",
    color_icon_url: skills_icons_url + "/js_color.png",
    cardBackground: cardBackgrounds[1],
    category: "Web",
    mastery: 0,
    description: "Essential language for web interactivity and logic.",
  },
  {
    name: "Linux",
    icon_url: skills_icons_url + "/linux.png",
    color_icon_url: skills_icons_url + "/linux_color.png",
    cardBackground: cardBackgrounds[2],
    category: "SW Dev",
    mastery: 1,
    description: "Open-source operating system known for stability and power.",
  },
  {
    name: "OpenGL",
    icon_url: skills_icons_url + "/opengl.png",
    color_icon_url: skills_icons_url + "/opengl_color.png",
    cardBackground: cardBackgrounds[3],
    category: "SW Dev",
    mastery: 1,
    description: "API for rendering real-time 2D and 3D graphics.",
  },
  {
    name: "Photoshop",
    icon_url: skills_icons_url + "/photoshop.png",
    color_icon_url: skills_icons_url + "/photoshop_color.png",
    cardBackground: cardBackgrounds[1],
    category: "Art",
    mastery: 1,
    description: "Professional tool for image editing and design.",
  },
  {
    name: "Python",
    icon_url: skills_icons_url + "/python.png",
    color_icon_url: skills_icons_url + "/python_color.png",
    cardBackground: cardBackgrounds[0],
    category: "SW Dev",
    mastery: 2,
    description: "Versatile language for development, AI, and automation.",
  },
  {
    name: "React",
    icon_url: skills_icons_url + "/react.png",
    color_icon_url: skills_icons_url + "/react_color.png",
    cardBackground: cardBackgrounds[3],
    category: "Web",
    mastery: 0,
    description: "Library for building dynamic user interfaces.",
  },
  {
    name: "SQL",
    icon_url: skills_icons_url + "/sql.png",
    color_icon_url: skills_icons_url + "/sql_color.png",
    cardBackground: cardBackgrounds[3],
    category: "Data",
    mastery: 1,
    description: "Language for managing relational databases.",
  },
];

const softSkills = [
  {
    name: "Teamwork",
    icon_url: skills_icons_url + "/teamwork.png",
    color_icon_url: skills_icons_url + "/teamwork.png",
    cardBackground: cardBackgrounds[0],
    category: "Soft",
    mastery: 1,
    description: "Collaborating effectively with others.",
  },
  {
    name: "Problem Solving",
    icon_url: skills_icons_url + "/problem_solving.png",
    color_icon_url: skills_icons_url + "/problem_solving.png",
    cardBackground: cardBackgrounds[1],
    category: "Soft",
    mastery: 1,
    description: "Finding solutions to complex issues.",
  },
  {
    name: "Communication",
    icon_url: skills_icons_url + "/communication.png",
    color_icon_url: skills_icons_url + "/communication.png",
    cardBackground: cardBackgrounds[2],
    category: "Soft",
    mastery: 1,
    description: "Conveying ideas clearly.",
  },
  {
    name: "Adaptability",
    icon_url: skills_icons_url + "/adaptability.png",
    color_icon_url: skills_icons_url + "/adaptability.png",
    cardBackground: cardBackgrounds[3],
    category: "Soft",
    mastery: 1,
    description: "Adjusting to new challenges.",
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
    link: "https://www.linkedin.com/in/alberto-d%C3%ADaz-maroto-ortiz-348766398/",
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

// Helpers
const getSkillsIconUrls = () => hardSkills.map((skill) => skill.icon_url);

// Reusable UI
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

function IconRainBackground({ pxSize }) {
  const icons = useMemo(() => getSkillsIconUrls(), []);
  return (
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
        icons={icons}
        iconSize={34}
        pixelScale={pxSize}
        speed={0.5 * (pxSize / 4)}
        density={icons.length * 1.2}
        pixelSnap={false}
        color1="#3b3379"
        color2="#0e0911"
        dotFrames={dotFrames}
        dotInterval={500}
        dotLifetime={3000}
        dotAnimDuration={1000}
        dotSize={10 * pxSize}
        parallaxSpeed={0.5}
      />
    </div>
  );
}

function Header({ pxSize, sparkFrames, headerButtons }) {
  const logoRef = useRef(null);
  const [logoVisible, setLogoVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setLogoVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (logoRef.current) {
      observer.observe(logoRef.current);
    }

    return () => {
      if (logoRef.current) {
        observer.unobserve(logoRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Horizontally centers the stack
        justifyContent: "center", // Vertically centers the whole group (Model + Text + Buttons)
        textAlign: "center",
        zIndex: 1,
      }}
    >
      {/* Name Header */}
      <div
        style={{
          color: "#8a63ff",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: `${pxSize * 0.8}rem`, // Slightly larger than the subtitle
          textShadow: "4px 4px 0 #000",
          marginBottom: `${pxSize * 4}px`, // Spacing between name and model
          textAlign: "center",
          zIndex: 2,
          width: "100%",
          padding: `0 ${pxSize * 2}px`, // Prevent text from touching edges on small screens
        }}
      >
        <span style={{ color: "white" }}>A</span>lberto{" "}
        <span style={{ color: "white" }}>D</span>íaz{" "}
        <span style={{ color: "white" }}>M</span>aroto{" "}
        <span style={{ color: "white" }}>O</span>rtiz
      </div>

      {/* Wrap ThreeLogo in a full-width container with explicit centering.
        This guarantees horizontal centering regardless of the model's internal canvas size,
        without affecting the vertical flow.
      */}
      <div
        ref={logoRef}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          minHeight: `${pxSize * 50}px`, // Placeholder height to prevent layout shift
        }}
      >
        <ThreeLogo
          url={"/Portfolio/3dmodels/albertdmo_pixel_logo_blue.glb"}
          pixelSize={pxSize}
          sparkFrames={sparkFrames}
          visible={logoVisible}
        />
      </div>

      <div
        style={{
          color: "#c8c3d6",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: `${pxSize * 0.6}rem`,
          letterSpacing: "2px",
          textShadow: "4px 4px 0 #000",
          whiteSpace: "nowrap",
          // Add a small margin top if you need to push the text away from the model
          // marginTop: `${pxSize * 2}px`
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
  );
}


// Hook for scroll animation
function useOnScreen(ref, rootMargin = "-200px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { rootMargin }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [ref, rootMargin]);
  return isIntersecting;
}

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
  const [placeholders, setPlaceholders] = useState(0);

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

      // Calculate placeholders
      // Grid padding is pxSize * 4 on left and right
      const paddingX = pxSize * 8;
      const availableWidth = element.clientWidth - paddingX;
      // Grid column min width is 110px for hard, 160px for soft
      const minColWidth = isSoft ? 160 : 110;
      const numColumns = Math.floor(availableWidth / minColWidth);

      if (numColumns > 0) {
        const needed = (numColumns - (skills.length % numColumns)) % numColumns;
        setPlaceholders(needed);
      }
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

          {/* Empty Slots */}
          {[...Array(placeholders)].map((_, i) => (
            <div
              key={`empty-${i}`}
              style={{
                width: "100%",
                aspectRatio: "3/4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.5rem",
              }}
            >
              <NineSliceBorder
                texture={nine_slice_texture2}
                pixelSize={pxSize}
                slice={4}
                style={{
                  width: "100%",
                  height: "100%",
                  opacity: 0.2,
                  filter: "brightness(0.3) grayscale(1)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </SectionBg>
  );
}

function SkillsSection({
  pxSize,
  hoveredSkill,
  setHoveredSkill,
}) {
  const ref = useRef(null);
  const isVisible = useOnScreen(ref, "-200px");

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
            top: `${-pxSize * 16}px`,
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
            padding: "0 1rem",
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

function AboutSection({ pxSize }) {
  const ref = useRef(null);
  const isVisible = useOnScreen(ref, "-200px");

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
        style={{
          position: "relative",
          marginTop: `${-pxSize * 45}px`,
          marginBottom: `${pxSize * 40}px`,
          padding: `${pxSize * 3}px 0`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SectionBg
          texture={carpet_nine_slice_texture}
          pixelSize={pxSize}
          slice={16}
          className="about-section-bg"
          style={{
            width: "min(1000px, 90%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: `${pxSize * 3}px`,
          }}
        >
          <div style={{ width: "100%", textAlign: "center" }}>
            <SectionTitle
              text="ABOUT ME"
              pixelSize={pxSize * 1.6}
              color="#ffffffff"
              shadowColor="#5A2BFF"
            />

            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: `${pxSize * 0.35}rem`,
                color: "#c8c3d6",
                textShadow: "3px 3px 0 #000",
                lineHeight: 1.6,
                margin: `${pxSize * 2}px auto 0`,
                maxWidth: "800px",
              }}
            >
I'm a computer science student with a strong passion for game development and programming. I enjoy blending code, design, 3D, and other forms of art. I aim to gain experience and knowledge in new technologies and fields where I can apply both my artistic and technical skills.
            </p>
          </div>
        </SectionBg>
      </div>
    </section>
  );
}

function TooltipCard({ hoveredSkill, mousePos, pxSize }) {
  if (!hoveredSkill) return null;

  const cardWidth = 100 * pxSize;
  const cardHeight = 140 * pxSize;
  const offset = 5 * pxSize;

  let left = mousePos.x + offset;
  let top = mousePos.y + offset;

  if (top + cardHeight > window.innerHeight) {
    top = mousePos.y - cardHeight - offset;
  }
  if (left + cardWidth > window.innerWidth) {
    left = window.innerWidth - cardWidth - offset;
  }

  return (
    <AnimatePresence>
      {hoveredSkill && (
        <motion.div
          key="tooltip-card"
          initial={{ opacity: 0, scale: 0.9, filter: "brightness(3)" }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: ["brightness(2)", "brightness(1.2)", "brightness(1)"],
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
            item={hoveredSkill.color_icon_url}
            category={hoveredSkill.category}
            cardSprite={gameCards[hoveredSkill.mastery]}
            description={hoveredSkill.description}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [pxSize, setPxSize] = useState(4);
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

  const iconRainElement = useMemo(
    () => <IconRainBackground pxSize={pxSize} />,
    [pxSize]
  );

  return (
    <div className="App" style={{ overflowX: "hidden" }}>
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

      <header
        ref={bannerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {iconRainElement}

        {/* Centro del header */}
        <Header
          pxSize={pxSize}
          sparkFrames={sparkFrames}
          headerButtons={headerButtons}
        />
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
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
          <AboutSection pxSize={pxSize} />
          <SkillsSection
            pxSize={pxSize}
            hoveredSkill={hoveredSkill}
            setHoveredSkill={setHoveredSkill}
          />

          <TrajectorySection
            pxSize={pxSize}
            nineSliceTexture={nine_slice_texture}
          />
        </div>
      </main>
      {/* Tooltip GameCard animado (fuera del main para evitar clipping) */}
      <TooltipCard
        hoveredSkill={hoveredSkill}
        mousePos={mousePos}
        pxSize={pxSize}
      />
    </div>
  );
}

export default App;
