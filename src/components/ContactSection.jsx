import React, { useRef } from "react";
import SectionTitle from "./SectionTitle";
import SectionBg from "./SectionBg";
import HoverButton from "./HoverButton";
import { headerButtons, nine_slice_texture } from "../constants";
import { useOnScreen } from "../hooks/useOnScreen";

export default function ContactSection({ pxSize }) {
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
        marginBottom: `${pxSize * 20}px`,
      }}
    >
      <div style={{ 
        width: "min(1200px, 90%)", 
        textAlign: "center",
        animation: "float 3s ease-in-out infinite",
      }}>
        <SectionTitle
          text="CONTACT ME"
          pixelSize={pxSize * 1.6}
          color="#fff"
          shadowColor="#5A2BFF"
        />
      </div>

      <SectionBg
        texture={nine_slice_texture}
        pixelSize={pxSize}
        slice={4}
        style={{
          padding: `${pxSize * 8}px`,
          backgroundColor: "rgba(10, 5, 20, 0.8)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: `${pxSize * 6}px`,
          maxWidth: "800px",
          width: "90%",
        }}
      >
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: "#d4c8e6",
            fontSize: `${pxSize * 0.5}rem`,
            lineHeight: "1.8",
            textAlign: "center",
            margin: 0,
            textShadow: "2px 2px 0 #000",
          }}
        >
          Feel free to reach out for more information!
        </p>

        <div
          style={{
            display: "flex",
            gap: `${pxSize * 4}px`,
            marginTop: `${pxSize * 4}px`,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
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
        
        <a 
          href="mailto:adiazmarotoortiz@gmail.com"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: "#8a63ff",
            fontSize: `${pxSize * 0.4}rem`,
            textDecoration: "none",
            marginTop: `${pxSize * 4}px`,
            textShadow: "1px 1px 0 #000",
            transition: "all 0.2s ease",
            borderBottom: "2px solid transparent",
          }}
          onMouseEnter={e => {
            e.target.style.color = "#fff";
            e.target.style.borderBottom = "2px solid #fff";
          }}
          onMouseLeave={e => {
            e.target.style.color = "#8a63ff";
            e.target.style.borderBottom = "2px solid transparent";
          }}
        >
          adiazmarotoortiz@gmail.com
        </a>

      </SectionBg>
    </section>
  );
}
