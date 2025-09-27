import { useState } from 'react'
import ThreeLogo from "./components/ThreePixelLogo";
import PixelBlast from './components/PixelBlast';
import IconRain from "./components/IconRain";
import './App.css'

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
          backgroundColor: '#251500ff', // <-- cambia el color aquí
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
            iconSize={32}
            pixelScale={pxSize}
            speed={0.2}
            density={getSkillsIconUrls().length/2}
            pixelSnap={false}
            color1="#5F4A00"  // reemplaza el blanco
            color2="#251500"  // reemplaza el negro
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
        />
      </div>
    </>
  )
}

export default App
