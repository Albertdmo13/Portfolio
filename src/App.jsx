import { useState, useEffect, useRef } from 'react'
import ThreeLogo from "./components/ThreePixelLogo";
import PixelBlast from './components/PixelBlast';
import IconRain from "./components/IconRain";
import './App.css';

const skills_icons_url = "/icons/skills_icons";

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
  "/spark/spark1.png",
  "/spark/spark2.png",
  "/spark/spark3.png",
  "/spark/spark4.png",
  "/spark/spark5.png",
  "/spark/spark6.png",
  "/spark/spark7.png",
  "/spark/spark8.png",
  "/spark/spark9.png",
  "/spark/spark10.png",
];

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

const getSkillsIconUrls = () => skills.map(skill => skill.icon_url);

function App() {
  const [pxSize, setPxSize] = useState(4);
  const bannerRef = useRef(null);

  useEffect(() => {
    const updatePixelSize = () => {
      const width = window.innerWidth;
      const scale = Math.max(1, Math.round((width / 1920) * 4));
      setPxSize(scale);
    };

    updatePixelSize();
    window.addEventListener('resize', updatePixelSize);
    document.addEventListener('fullscreenchange', updatePixelSize);

    return () => {
      window.removeEventListener('resize', updatePixelSize);
      document.removeEventListener('fullscreenchange', updatePixelSize);
    };
  }, []);

  return (
    <div className="App" style={{ overflowX: "hidden" }}>
      {/* HEADER BANNER */}
      <header
        ref={bannerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#251500ff",
            zIndex: -2,
          }}
        />

        {/* PixelBlast background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
          }}
        >
          <PixelBlast
            variant="square"
            pixelSize={pxSize}
            color="#443400"
            patternScale={3}
            patternDensity={1.2}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.6}
            edgeFade={0}
            transparent
            antialias={false}
            shape="circle"
          />
        </div>

        {/* IconRain now positioned relative to banner, not viewport */}
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
            speed={0.3 * (pxSize / 4)}
            density={getSkillsIconUrls().length * 0.75}
            pixelSnap={false}
            color1="#725900"
            color2="#251500"
            dotFrames={dotFrames}
            dotInterval={500}
            dotLifetime={3000}
            dotAnimDuration={1000}
            dotSize={10 * pxSize}
          />
        </div>

        {/* Centered logo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          <ThreeLogo
            url={"/3dmodels/albertdmo_pixel_logo_gold.glb"}
            pixelSize={pxSize}
            sparkFrames={sparkFrames}
          />
        </div>
      </header>

      {/* PAGE CONTENT */}
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
        <p>
          Test
        </p>
      </main>
    </div>
  );
}

export default App;
