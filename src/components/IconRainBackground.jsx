import { useMemo } from "react";
import IconRain from "./IconRain";
import { getSkillsIconUrls, dotFrames } from "../constants";

export default function IconRainBackground({ pxSize }) {
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
