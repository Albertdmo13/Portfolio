import { useState } from 'react'
import ThreeLogo from "./components/ThreePixelLogo";
import PixelBlast from './components/PixelBlast';
import './App.css'

const pxSize = 4;

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
