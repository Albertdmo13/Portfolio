import { useRef } from "react";
import NineSliceBorder from "./NineSliceBorder";
import SectionBg from "./SectionBg";
import SectionTitle from "./SectionTitle";
import { useOnScreen } from "../hooks/useOnScreen";
import { chest_inventory_texture, carpet_nine_slice_texture } from "../constants";

export default function AboutSection({ pxSize }) {
  const ref = useRef(null);
  const isVisible = useOnScreen(ref, "-20%");

  // Calculate the border thickness/padding for the image to sit inside the frame
  const borderPadding = pxSize * 6;

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
          width: "min(1200px, 95%)", // Added constraint to keep it contained
          marginTop: `${pxSize * 5}px`,
          marginBottom: `${pxSize * 40}px`,
          padding: `${pxSize * 3}px 0`,
          display: "flex",
          flexDirection: "row", // Ensure side-by-side
          gap: `${pxSize * 4}px`, // Add space between image and text
          
          // CRITICAL FIX 1: Use 'stretch'. 
          // This forces the Image container to match the height of the Text container.
          alignItems: "stretch", 
          justifyContent: "center",
        }}
      >

        {/* Picture Section (Left) */}
        <div
          style={{
            flex: "0 0 auto", // Don't shrink, don't grow
            width: `${pxSize * 100}px`, // Fixed width
            position: "relative",
            display: "flex", 
          }}
        >
            {/* Spacer: Ensures a minimum height if the text is too short */}
            <div style={{ width: "100%", minHeight: "250px", height: "100%" }} />
            
            {/* The actual photo */}
            <img
              src="/Portfolio/media/IMG_4997.JPG"
              alt="Profile"
              style={{
                position: "absolute",
                // CRITICAL FIX 2: Explicitly calculate width/height.
                // We offset the Top/Left by the padding, and subtract double padding from width/height.
                top: `${borderPadding}px`,
                left: `${borderPadding}px`,
                width: `calc(100% - ${borderPadding * 2}px)`,
                height: `calc(100% - ${borderPadding * 2}px)`,
                
                objectFit: "cover",
                borderRadius: `${pxSize}px`, // Optional: Softens image corners inside the pixel border
              }}
            />
        </div>

        {/* About Me Text Section (Right) */}
        <SectionBg
          texture={carpet_nine_slice_texture}
          pixelSize={pxSize}
          slice={16}
          className="about-section-bg"
          style={{
            flex: "1 1 400px", // Allow growing/shrinking
            maxWidth: "800px",
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
                maxWidth: "100%",
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
