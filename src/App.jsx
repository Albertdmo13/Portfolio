import { useState } from 'react'
import ThreeLogo from "./components/ThreePixelLogo";
import PixelBlast from './components/PixelBlast';
import IconRain from "./components/IconRain";
import './App.css'
import { dot } from 'three/tsl';

const pxSize = 4;
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
]

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
]

// Function to get just the icon URLs from skills
const getSkillsIconUrls = () => skills.map(skill => skill.icon_url);

function App() {
  return (
    <>
      {/* Fondo de color sólido */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'fixed',
          inset: 0,
          backgroundColor: '#251500ff',
          zIndex: -2
        }}
      />

      {/* Fondo de PixelBlast encima del color sólido */}
        <div style={{ width: '100%', height: '100%', position: 'fixed', inset: 0, zIndex: -1 }}>
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

        <div>
          <IconRain
            icons={getSkillsIconUrls()}
            iconSize={34}
            pixelScale={pxSize}
            speed={0.1}
            density={getSkillsIconUrls().length*0.75}
            pixelSnap={false}
            color1="#725900"  // reemplaza el blanco // OLD: 5F4A00
            color2="#251500"  // reemplaza el negro
            dotFrames={dotFrames}
            dotInterval={500}        // cada 500 ms
            dotLifetime={3000}       // dura 3 segundos
            dotAnimDuration={1000}  // duración de la animación del punto
            dotSize={10*pxSize}             // tamaño del punto
          />
        </div>

        {/* Logo centrado */}
      <div
        style={{
          position: 'fixed',
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
    </>
  )
}

export default App
