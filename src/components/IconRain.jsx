import { useEffect, useRef } from "react";

export default function IconRain({
  icons,
  iconSize = 32,
  speed = 0.5,
  density = 20,
  pixelScale = 5,
  pixelSnap = true,
  color1 = "#ffffff",
  color2 = "#000000",
  dotFrames = [],
  dotInterval = 1000,
  dotLifetime = 3000,
  dotAnimDuration = 1000,
  dotSize = 12,
  minDistance = 2.0,
  parallaxSpeed = 0,
}) {
  const canvasRef = useRef(null);
  
  // Use refs for state that doesn't trigger re-renders
  const drops = useRef([]);
  const trails = useRef([]);
  const animFrame = useRef(null);

  const scaledIcon = iconSize * pixelScale;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    // 1. Reset Refs immediately on mount to clean up any previous mess
    trails.current = [];
    drops.current = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { innerWidth: w, innerHeight: h } = window;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = false;
    };

    resize();
    window.addEventListener("resize", resize);

    ctx.imageSmoothingEnabled = false;

    // --- Color Helpers ---
    const hexToRgb = (hex) => {
      const num = parseInt(hex.slice(1), 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    };
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const recolor = (img) => {
      const off = document.createElement("canvas");
      const octx = off.getContext("2d", { willReadFrequently: true });
      off.width = img.width;
      off.height = img.height;
      octx.drawImage(img, 0, 0);
      const data = octx.getImageData(0, 0, off.width, off.height);
      const d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] === 0) continue;
        if (d[i] === 255 && d[i + 1] === 255 && d[i + 2] === 255) {
          d[i] = c1.r;
          d[i + 1] = c1.g;
          d[i + 2] = c1.b;
        } else if (d[i] === 0 && d[i + 1] === 0 && d[i + 2] === 0) {
          d[i] = c2.r;
          d[i + 1] = c2.g;
          d[i + 2] = c2.b;
        }
      }
      octx.putImageData(data, 0, 0);
      const n = new Image();
      n.src = off.toDataURL("image/png");
      return n;
    };

    const loadImages = (sources) =>
      Promise.all(
        sources.map(
          (src) =>
            new Promise((res) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = src;
              img.onload = () => res(img);
            })
        )
      );

    // Flag to track if this specific effect instance is still active
    let isMounted = true;

    (async () => {
      // 2. Load images
      const [baseIcons, baseDots] = await Promise.all([
        loadImages(icons),
        loadImages(dotFrames),
      ]);

      // 3. CRITICAL CHECK: 
      // If the component unmounted while we were waiting for images, STOP.
      // Do not populate refs, do not start animation.
      if (!isMounted) return;

      // 4. Force clear again inside the async block (Safety lock)
      // This guarantees we are starting with a blank slate for *this* run.
      drops.current = [];
      trails.current = [];

      const recoloredIcons = baseIcons.map(recolor);
      const recoloredDots = baseDots.map(recolor);

      const rand = (max) => Math.random() * max;
      
      const findPos = (arr, tries = 40) => {
        for (let i = 0; i < tries; i++) {
          const x = rand(canvas.width - scaledIcon);
          const y = rand(canvas.height);
          if (
            arr.every(
              (d) => Math.hypot(d.x - x, d.y - y) >= scaledIcon * minDistance
            )
          )
            return { x, y };
        }
        return { x: rand(canvas.width - scaledIcon), y: rand(canvas.height) };
      };

      const createInitialTrail = (drop, currentTime) => {
        if (!recoloredDots.length) return;

        // Calculate how many dots fit in the lifetime
        const maxDots = Math.floor(dotLifetime / dotInterval);
        // Cap strictly to avoid overload
        const count = Math.min(maxDots, 5); 

        const pxPerMs = drop.vy / 16.67; // approx velocity per ms

        for (let i = 1; i <= count; i++) {
          const timeAgo = i * dotInterval;
          const distanceBack = pxPerMs * timeAgo;
          
          // Don't create trails that are extremely far off-screen
          if(drop.y - distanceBack < -200) continue;

          trails.current.push({
            x: Math.floor((drop.x + scaledIcon / 2 - dotSize / 2) / pixelScale) * pixelScale,
            y: Math.floor((drop.y - distanceBack + scaledIcon / 2 - dotSize / 2) / pixelScale) * pixelScale,
            birth: currentTime - timeAgo,
          });
        }
      };

      const initTime = performance.now();

      // --- Initialize Drops ---
      drops.current = Array.from({ length: density }, () => {
        const pos = findPos(drops.current);
        const drop = {
          ...pos,
          icon: recoloredIcons[Math.floor(rand(recoloredIcons.length))],
          lastDot: initTime,
          vy: (0.7 + Math.random() * 1.2) * speed,
        };
        
        createInitialTrail(drop, initTime);
        return drop;
      });

      const animate = (time) => {
        // Stop if unmounted
        if (!isMounted) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scrollY = window.scrollY || 0;
        const offset = scrollY * parallaxSpeed;
        const visibleHeight = window.innerHeight;

        // --- Render Trails ---
        trails.current = trails.current.filter((t) => !t.done);
        
        for (const t of trails.current) {
          const age = time - t.birth;
          const fcount = recoloredDots.length;

          // Cleanup old trails
          if (age >= dotLifetime) {
            t.done = true;
            continue;
          }
          if (!fcount) continue;

          const visualTy = t.y - offset;

          // Cull trails far off bottom screen
          if (visualTy > visibleHeight + 100) {
             t.done = true; 
             continue;
          }

          const idx =
            age < dotLifetime - dotAnimDuration
              ? 0
              : 1 +
                Math.min(
                  Math.floor(
                    ((age - (dotLifetime - dotAnimDuration)) /
                      dotAnimDuration) *
                      (fcount - 2)
                  ),
                  fcount - 1
                );
                
          ctx.drawImage(recoloredDots[idx], t.x, visualTy, dotSize, dotSize);
        }

        // --- Render Drops ---
        for (const d of drops.current) {
          const img = d.icon;
          const visualY = d.y - offset;

          const x = pixelSnap ? Math.floor(d.x / pixelScale) * pixelScale : d.x;
          const y = pixelSnap ? Math.floor(visualY / pixelScale) * pixelScale : visualY;

          ctx.drawImage(img, x, y, scaledIcon, scaledIcon);

          // Spawn new trail dot
          if (time - d.lastDot >= dotInterval && recoloredDots.length) {
            trails.current.push({
              x: Math.floor((d.x + scaledIcon / 2 - dotSize / 2) / pixelScale) * pixelScale,
              y: Math.floor((d.y + scaledIcon / 2 - dotSize / 2) / pixelScale) * pixelScale,
              birth: time,
            });
            d.lastDot = time;
          }

          d.y += d.vy;

          // --- Wrapping Logic ---
          if (visualY > visibleHeight + scaledIcon) {
            // Reset to top
            const p = findPos(drops.current);
            d.x = p.x;
            d.y = offset - scaledIcon - 50; 
            d.vy = (0.7 + Math.random() * 0.6) * speed;
            d.lastDot = time;
            createInitialTrail(d, time); 
            
          } else if (visualY < -scaledIcon - 300) {
             // Reset to bottom
             const p = findPos(drops.current);
             d.x = p.x;
             d.y = offset + visibleHeight + scaledIcon;
             d.vy = (0.7 + Math.random() * 0.6) * speed;
             d.lastDot = time;
             createInitialTrail(d, time);
          }
        }

        animFrame.current = requestAnimationFrame(animate);
      };

      animFrame.current = requestAnimationFrame(animate);
    })();

    return () => {
      // 5. Cleanup
      isMounted = false; // Kill the async loop
      cancelAnimationFrame(animFrame.current);
      window.removeEventListener("resize", resize);
    };
  }, [
    icons,
    dotFrames,
    color1,
    color2,
    scaledIcon,
    speed,
    density,
    pixelScale,
    pixelSnap,
    dotInterval,
    dotLifetime,
    dotAnimDuration,
    dotSize,
    minDistance,
    parallaxSpeed,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "transparent",
      }}
    />
  );
}