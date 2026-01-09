import { useRef, useState, useEffect } from "react";
import ThreeLogo from "./ThreePixelLogo";
import TextType from "./TextType";
import HoverButton from "./HoverButton";
import { headerButtons } from "../constants";

export default function Header({ pxSize, sparkFrames }) {
  const logoRef = useRef(null);
  const [logoVisible, setLogoVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Constrain logo size on very small screens to prevent overflow
  // pxSize is min 2 on mobile, but for the 3D logo we might need smaller
  // Use a divisor of 500 to balance size and fit (calculated sweet spot)
  const logoPixelSize = Math.min(pxSize, windowWidth / 500);

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
          pixelSize={logoPixelSize}
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
