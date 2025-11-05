import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer, EffectPass, RenderPass, Effect } from 'postprocessing';
import './PixelBlast.css';

/* ======================================================
   ===  TOUCH + LIQUID SETUP FUNCTIONS  =================
====================================================== */
const createTouchTexture = () => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context not available');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const trail = [];
  let last = null;
  const maxAge = 64;
  let radius = 0.1 * size;
  const speed = 1 / maxAge;

  const clear = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawPoint = (p) => {
    const pos = { x: p.x * size, y: (1 - p.y) * size };
    let intensity = 1;
    const easeOutSine = (t) => Math.sin((t * Math.PI) / 2);
    const easeOutQuad = (t) => -t * (t - 2);
    if (p.age < maxAge * 0.3) intensity = easeOutSine(p.age / (maxAge * 0.3));
    else intensity = easeOutQuad(1 - (p.age - maxAge * 0.3) / (maxAge * 0.7)) || 0;
    intensity *= p.force;
    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = size * 5;
    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius;
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,0,0,1)';
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const addTouch = (norm) => {
    let force = 0;
    let vx = 0;
    let vy = 0;
    if (last) {
      const dx = norm.x - last.x;
      const dy = norm.y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / (d || 1);
      vy = dy / (d || 1);
      force = Math.min(dd * 10000, 1);
    }
    last = { x: norm.x, y: norm.y };
    trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy });
  };

  const update = () => {
    clear();
    for (let i = trail.length - 1; i >= 0; i--) {
      const point = trail[i];
      const f = point.force * speed * (1 - point.age / maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > maxAge) trail.splice(i, 1);
    }
    for (let i = 0; i < trail.length; i++) drawPoint(trail[i]);
    texture.needsUpdate = true;
  };

  return {
    canvas,
    texture,
    addTouch,
    update,
    set radiusScale(v) {
      radius = 0.1 * size * v;
    },
    get radiusScale() {
      return radius / (0.1 * size);
    },
    size,
  };
};

const createLiquidEffect = (texture, opts) => {
  const fragment = `
    uniform sampler2D uTexture;
    uniform float uStrength;
    uniform float uTime;
    uniform float uFreq;

    void mainUv(inout vec2 uv) {
      vec4 tex = texture2D(uTexture, uv);
      float vx = tex.r * 2.0 - 1.0;
      float vy = tex.g * 2.0 - 1.0;
      float intensity = tex.b;
      float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);
      float amt = uStrength * intensity * wave;
      uv += vec2(vx, vy) * amt;
    }
  `;
  return new Effect('LiquidEffect', fragment, {
    uniforms: new Map([
      ['uTexture', new THREE.Uniform(texture)],
      ['uStrength', new THREE.Uniform(opts?.strength ?? 0.025)],
      ['uTime', new THREE.Uniform(0)],
      ['uFreq', new THREE.Uniform(opts?.freq ?? 4.5)],
    ]),
  });
};

const SHAPE_MAP = { square: 0, circle: 1, triangle: 2, diamond: 3 };

/* ======================================================
   ===  MAIN PIXELBLAST COMPONENT  =======================
====================================================== */
const PixelBlast = ({
  variant = 'square',
  pixelSize = 3,
  color = '#B19EEF',
  color2 = '#00aaff',
  className,
  style,
  antialias = true,
  patternScale = 2,
  patternDensity = 1,
  liquid = false,
  liquidStrength = 0.1,
  liquidRadius = 1,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
  noiseAmount = 0,
  sparkFrames = [],
  sparkRate = 0.02,
  sparkSize = 0.05,
  sparkLifetime = 1.2,
}) => {
  const containerRef = useRef(null);
  const speedRef = useRef(speed);
  const threeRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // --- Main shader quad ---
    const material = new THREE.ShaderMaterial({
      vertexShader: `void main(){gl_Position=vec4(position,1.0);}`,
      fragmentShader: `precision highp float; uniform vec3 uColor; out vec4 fragColor; void main(){ fragColor=vec4(uColor,1.0); }`,
      uniforms: { uColor: { value: new THREE.Color(color) } },
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // --- Load spark textures ---
    const sparkTextures = [];
    const loader = new THREE.TextureLoader();
    sparkFrames.forEach((url) => {
      const tex = loader.load(url);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.generateMipmaps = false;
      tex.encoding = THREE.sRGBEncoding;
      sparkTextures.push(tex);
    });

    // --- Sparks setup ---
    const sparks = [];
    const spawnSpark = () => {
      if (!sparkTextures.length) return;
      const texture = sparkTextures[Math.floor(Math.random() * sparkTextures.length)];
      const mat = new THREE.SpriteMaterial({
        map: texture,
        color: new THREE.Color(color2),
        transparent: true,
        opacity: 1.0,
        depthTest: false,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.setScalar(sparkSize);
      sprite.position.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1.2, 0);
      sprite.userData = { lifetime: 0 };
      scene.add(sprite);
      sparks.push(sprite);
    };

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      const delta = clock.getDelta();

      // Spawn new sparks
      if (Math.random() < sparkRate) spawnSpark();

      // Update sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.userData.lifetime += delta;
        s.material.opacity = 1.0 - s.userData.lifetime / sparkLifetime;
        s.position.y += 0.005;
        if (s.userData.lifetime > sparkLifetime) {
          scene.remove(s);
          s.material.dispose();
          sparks.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      sparks.forEach((s) => {
        s.material.dispose();
        scene.remove(s);
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [antialias, color, color2, sparkFrames, sparkRate, sparkSize, sparkLifetime]);

  return <div ref={containerRef} className={`pixel-blast-container ${className ?? ''}`} style={style} />;
};

export default PixelBlast;
