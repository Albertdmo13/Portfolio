import { useState } from 'react'
import ThreeLogo from "./components/ThreePixelLogo";

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ThreeLogo url={"/3dmodels/albertdmo_pixel_logo_gold.glb"} />
    </>
  )
}

export default App
