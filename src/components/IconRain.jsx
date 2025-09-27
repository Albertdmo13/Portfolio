import { useEffect, useRef } from "react";

export default function IconRain({
  icons,
  iconSize = 32,
  speed = 2,
  density = 20, // number of icons visible
  pixelScale = 5,
  pixelSnap = true,
  color1 = "#ffffff", // reemplaza el blanco
  color2 = "#000000"  // reemplaza el negro
}) {
  const scaled_iconSize = iconSize * pixelScale;
  const canvasRef = useRef(null);
  const drops = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    ctx.imageSmoothingEnabled = false;

    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.replace("#", ""), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
      };
    };
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const recolorImage = (img) => {
      const offCanvas = document.createElement("canvas");
      const offCtx = offCanvas.getContext("2d");
      offCanvas.width = img.width;
      offCanvas.height = img.height;

      offCtx.drawImage(img, 0, 0);
      const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // White to color1
        if (r === 255 && g === 255 && b === 255 && a > 0) {
          data[i] = c1.r;
          data[i + 1] = c1.g;
          data[i + 2] = c1.b;
        }
        // Black to color2
        else if (r === 0 && g === 0 && b === 0 && a > 0) {
          data[i] = c2.r;
          data[i + 1] = c2.g;
          data[i + 2] = c2.b;
        }
      }

      offCtx.putImageData(imageData, 0, 0);

      const newImg = new Image();
      newImg.src = offCanvas.toDataURL();
      return newImg;
    };

    const loadedIcons = icons.map((src) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous"; // por si las imágenes vienen de otra ruta
      img.onload = () => {
        img.recolored = recolorImage(img);
      };
      return img;
    });

    function shuffle(arr) {
      return arr
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);
    }

    function initDrops() {
      drops.current = [];
      let iconPool = shuffle(loadedIcons);

      for (let i = 0; i < density; i++) {
        if (iconPool.length === 0) {
          iconPool = shuffle(loadedIcons);
        }
        drops.current.push({
          x: Math.floor(Math.random() * (canvas.width - scaled_iconSize) / pixelScale) * pixelScale,
          y: Math.floor(Math.random() * canvas.height / pixelScale) * pixelScale,
          icon: iconPool.pop()
        });
      }
    }

    initDrops();

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      drops.current.forEach((drop) => {
        const iconToDraw = drop.icon.recolored || drop.icon;
        if (iconToDraw.complete) {
          ctx.drawImage(
            iconToDraw,
            pixelSnap
              ? Math.floor(drop.x / pixelScale) * pixelScale
              : Math.floor(drop.x),
            pixelSnap
              ? Math.floor(drop.y / pixelScale) * pixelScale
              : Math.floor(drop.y),
            scaled_iconSize,
            scaled_iconSize
          );
        }

        drop.y += speed;

        if (drop.y > canvas.height + scaled_iconSize) {
          drop.y = -scaled_iconSize;
          drop.x = Math.random() * (canvas.width - scaled_iconSize);
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [icons, scaled_iconSize, speed, density, pixelScale, pixelSnap, color1, color2]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "transparent"
      }}
    />
  );
}
