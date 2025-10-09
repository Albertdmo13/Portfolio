import { useEffect, useRef } from "react";

export default function IconRain({
  icons,
  iconSize = 32,
  speed = 2,
  density = 20,
  pixelScale = 5,
  pixelSnap = true,
  color1 = "#ffffff",
  color2 = "#000000",
  dotFrames = [],         // lista de frames: [frame0, frame1, ...]
  dotInterval = 1000,
  dotLifetime = 3000,
  dotAnimDuration = 1000, // duración de la animación final
  dotSize = 12,
  minDistance = 2.0       // múltiplo de scaled_iconSize para evitar solapamiento
}) {
  const scaled_iconSize = iconSize * pixelScale;
  const canvasRef = useRef(null);
  const drops = useRef([]);
  const trails = useRef([]);

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

    // --- utilidades ---
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.replace("#", ""), 16);
      return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
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
        const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
        if (a > 0) {
          if (r === 255 && g === 255 && b === 255) {
            data[i] = c1.r; data[i + 1] = c1.g; data[i + 2] = c1.b;
          } else if (r === 0 && g === 0 && b === 0) {
            data[i] = c2.r; data[i + 1] = c2.g; data[i + 2] = c2.b;
          }
        }
      }
      offCtx.putImageData(imageData, 0, 0);
      const newImg = new Image();
      newImg.src = offCanvas.toDataURL();
      return newImg;
    };

    // --- cargar íconos principales ---
    const loadedIcons = icons.map((src) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";
      img.onload = () => { img.recolored = recolorImage(img); };
      return img;
    });

    // --- cargar y recolorear frames del dot ---
    const loadedDotFrames = dotFrames.map((src) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";
      img.onload = () => { img.recolored = recolorImage(img); };
      return img;
    });

    function shuffle(arr) {
      return arr.map((a) => ({ sort: Math.random(), value: a }))
                .sort((a, b) => a.sort - b.sort)
                .map((a) => a.value);
    }

    // --- helper para colocar icono sin solapamiento ---
    function findNonOverlappingPosition(existing, maxTries = 50) {
      for (let t = 0; t < maxTries; t++) {
        const candidate = {
          x: Math.floor(Math.random() * (canvas.width - scaled_iconSize) / pixelScale) * pixelScale,
          y: pixelSnap
            ? Math.random() * canvas.height
            : Math.floor(Math.random() * canvas.height / pixelScale) * pixelScale
        };
        let tooClose = false;
        for (let drop of existing) {
          const dx = candidate.x - drop.x;
          const dy = candidate.y - drop.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < scaled_iconSize * minDistance) {
            tooClose = true;
            break;
          }
        }
        if (!tooClose) return candidate;
      }
      // fallback: si no encuentra sitio tras varios intentos
      return {
        x: Math.random() * (canvas.width - scaled_iconSize),
        y: Math.random() * canvas.height
      };
    }

    function initDrops() {
      drops.current = [];
      let iconPool = shuffle(loadedIcons);
      for (let i = 0; i < density; i++) {
        if (iconPool.length === 0) iconPool = shuffle(loadedIcons);
        const pos = findNonOverlappingPosition(drops.current);
        drops.current.push({
          x: pos.x,
          y: pos.y,
          icon: iconPool.pop(),
          lastDot: Date.now()
        });
      }
    }
    initDrops();

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      const now = Date.now();

      // --- dibujar trails detrás de los íconos ---
      trails.current = trails.current.filter((trail) => !trail.finished);
      trails.current.forEach((trail) => {
        const age = now - trail.created;
        if (!loadedDotFrames.length) return;

        if (age < dotLifetime - dotAnimDuration) {
          const img = loadedDotFrames[0].recolored || loadedDotFrames[0];
          if (img.complete) ctx.drawImage(img, trail.x, trail.y, dotSize, dotSize);
        } else {
          const animAge = age - (dotLifetime - dotAnimDuration);
          const progress = animAge / dotAnimDuration;
          let frameIndex = 1 + Math.floor(progress * (loadedDotFrames.length - 2));
          if (frameIndex >= loadedDotFrames.length) {
            trail.finished = true;
            return;
          }
          const img = loadedDotFrames[frameIndex].recolored || loadedDotFrames[frameIndex];
          if (img.complete) ctx.drawImage(img, trail.x, trail.y, dotSize, dotSize);
        }
      });

      // --- dibujar íconos ---
      drops.current.forEach((drop) => {
        const iconToDraw = drop.icon.recolored || drop.icon;
        if (iconToDraw.complete) {
          ctx.drawImage(
            iconToDraw,
            pixelSnap ? Math.floor(drop.x / pixelScale) * pixelScale : Math.floor(drop.x),
            pixelSnap ? Math.floor(drop.y / pixelScale) * pixelScale : Math.floor(drop.y),
            scaled_iconSize,
            scaled_iconSize
          );
        }

        // generar dot
        if (loadedDotFrames.length && now - drop.lastDot > dotInterval) {
          trails.current.push({
            x: Math.floor((drop.x + scaled_iconSize / 2 - dotSize / 2) / pixelScale) * pixelScale,
            y: Math.floor((drop.y + scaled_iconSize / 2 - dotSize / 2) / pixelScale) * pixelScale,
            created: now,
            finished: false
          });
          drop.lastDot = now;
        }

        // movimiento
        drop.y += speed;
        if (drop.y > canvas.height + scaled_iconSize) {
          // reposicionar evitando solapamiento
          const pos = findNonOverlappingPosition(drops.current.filter(d => d !== drop));
          drop.y = -scaled_iconSize;
          drop.x = pos.x;
        }
      });

      requestAnimationFrame(animate);
    }
    animate();

    return () => { window.removeEventListener("resize", resize); };
  }, [icons, scaled_iconSize, speed, density, pixelScale, pixelSnap, color1, color2, dotFrames, dotInterval, dotLifetime, dotAnimDuration, dotSize, minDistance]);

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
