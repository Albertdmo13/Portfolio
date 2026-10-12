import { useEffect, useRef } from 'react';
import {
  Clock,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';

import './FloatingLines.css';

const vertexShader = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;
uniform float lineIntensity;
uniform float bloomSize;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;
uniform vec3 backgroundColor;
uniform bool isTransparent;
uniform bool lightMode;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  float c = cos(r);
  float s = sin(r);
  return mat2(c, s, -s, c);
}

vec3 background_color(vec2 uv) {
  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  vec3 col = mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)))
           + mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 sampleGradientStop(int idx) {
  if (idx <= 0) return lineGradient[0];
  if (idx == 1) return lineGradient[1];
  if (idx == 2) return lineGradient[2];
  if (idx == 3) return lineGradient[3];
  if (idx == 4) return lineGradient[4];
  if (idx == 5) return lineGradient[5];
  if (idx == 6) return lineGradient[6];
  return lineGradient[7];
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }
  if (lineGradientCount == 1) {
    return lineGradient[0];
  }

  float clampedT = clamp(t, 0.0, 1.0);
  float scaled = clampedT * float(lineGradientCount - 1);
  int idx = int(floor(scaled));
  float f = fract(scaled);

  int maxIdx = lineGradientCount - 1;
  if (idx >= maxIdx) {
    return sampleGradientStop(maxIdx);
  }

  vec3 c1 = sampleGradientStop(idx);
  vec3 c2 = sampleGradientStop(idx + 1);

  return mix(c1, c2, f);
}

// Wave equation with thicker core lines and soft, wide ambient bloom
float wave(vec2 uv, float offset, float time, float x_movement, float bendDelta) {
  float amp = sin(offset + time * 0.2) * 0.3;
  float y   = sin(uv.x + offset + x_movement) * amp + bendDelta;

  float dist = abs(uv.y - y);

  // Thicker core line (gentler falloff and wider base profile)
  float core = 0.042 / (dist * 6.8 + 0.014);

  // Expanded atmospheric bloom that illuminates the surrounding backdrop
  float bloom = 0.0;
  if (bloomSize > 0.001) {
    float bSize = max(bloomSize, 0.05);
    bloom = (0.045 * bSize) / (dist * (1.9 / bSize) + 0.038) * exp(-dist * (1.7 / bSize));
  }

  return core + bloom;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);
  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  float time = iTime * animationSpeed;
  float x_movement = time * 0.1;

  float bendDelta = 0.0;
  if (interactive && bendInfluence > 0.0001) {
    vec2 mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
    vec2 d = baseUv - mouseUv;
    bendDelta = (mouseUv.y - baseUv.y) * exp(-dot(d, d) * bendRadius) * bendStrength * bendInfluence;
  }

  float logDist = log(length(baseUv) + 1.0);

  if (enableBottom) {
    mat2 rot = rotate(bottomWavePosition.z * logDist);
    vec2 ruv = baseUv * rot;

    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float normIndex = fi / max(float(bottomLineCount - 1), 1.0);
      float t = clamp(baseUv.x * 0.45 + 0.5 + (normIndex - 0.5) * 0.15, 0.0, 1.0);
      vec3 lineCol = getLineColor(t, b);

      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        time,
        x_movement,
        bendDelta
      ) * 0.45;
    }
  }

  if (enableMiddle) {
    mat2 rot = rotate(middleWavePosition.z * logDist);
    vec2 ruv = baseUv * rot;

    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float normIndex = fi / max(float(middleLineCount - 1), 1.0);
      float t = clamp(baseUv.x * 0.45 + 0.5 + (normIndex - 0.5) * 0.15, 0.0, 1.0);
      vec3 lineCol = getLineColor(t, b);

      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        time,
        x_movement,
        bendDelta
      ) * 1.15;
    }
  }

  if (enableTop) {
    mat2 rot = rotate(topWavePosition.z * logDist);
    vec2 ruv = baseUv * rot;
    ruv.x *= -1.0;

    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float normIndex = fi / max(float(topLineCount - 1), 1.0);
      float t = clamp(baseUv.x * 0.45 + 0.5 + (normIndex - 0.5) * 0.15, 0.0, 1.0);
      vec3 lineCol = getLineColor(t, b);

      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        time,
        x_movement,
        bendDelta
      ) * 0.35;
    }
  }

  if (lightMode) {
    vec3 energy = max(col, vec3(0.0));
    float peak = max(energy.r, max(energy.g, energy.b));
    float coverage = smoothstep(0.018, 0.5, peak);
    vec3 chroma = clamp(energy / max(peak, 0.0001), 0.0, 1.0);
    chroma = pow(chroma, vec3(1.35));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    vec3 ink = mix(chroma, clamp(chroma * 0.82, 0.0, 1.0), smoothstep(0.5, 1.0, coverage));
    fragColor = vec4(mix(vec3(1.0), ink, coverage * 0.94), 1.0);
  } else if (isTransparent) {
    vec3 finalRgb = col * lineIntensity;
    float peak = max(finalRgb.r, max(finalRgb.g, finalRgb.b));
    float alpha = smoothstep(0.0, 0.85, peak);
    fragColor = vec4(finalRgb, alpha);
  } else {
    fragColor = vec4(backgroundColor + col * lineIntensity, 1.0);
  }
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

function hexToVec3(hex) {
  if (!hex || hex === 'transparent' || hex === 'none') {
    return new Vector3(0, 0, 0);
  }

  let value = hex.trim();

  if (value.startsWith('#')) {
    value = value.slice(1);
  }

  let r = 0;
  let g = 0;
  let b = 0;

  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16) || 0;
    g = parseInt(value[1] + value[1], 16) || 0;
    b = parseInt(value[2] + value[2], 16) || 0;
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16) || 0;
    g = parseInt(value.slice(2, 4), 16) || 0;
    b = parseInt(value.slice(4, 6), 16) || 0;
  }

  return new Vector3(r / 255, g / 255, b / 255);
}

const DEFAULT_ENABLED_WAVES = ['top', 'middle', 'bottom'];
const DEFAULT_LINE_COUNT = [6];
const DEFAULT_LINE_DISTANCE = [5];
const DEFAULT_BOTTOM_WAVE_POSITION = { x: 2.0, y: -0.7, rotate: -1 };

export default function FloatingLines({
  linesGradient,
  gradientStart,
  gradientMid,
  gradientEnd,
  enabledWaves = DEFAULT_ENABLED_WAVES,
  lineCount = DEFAULT_LINE_COUNT,
  lineDistance = DEFAULT_LINE_DISTANCE,
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = DEFAULT_BOTTOM_WAVE_POSITION,
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'normal',
  backgroundColor = '#08080a',
  lineIntensity = 1.0,
  bloomSize = 1.2,
  lightMode = false,
  paused = false
}) {
  const containerRef = useRef(null);
  const targetMouseRef = useRef(new Vector2(-1000, -1000));
  const currentMouseRef = useRef(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef(0);
  const currentInfluenceRef = useRef(0);
  const targetParallaxRef = useRef(new Vector2(0, 0));
  const currentParallaxRef = useRef(new Vector2(0, 0));

  const pausedRef = useRef(paused);
  const loopControlRef = useRef({ start: () => { }, stop: () => { } });

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      loopControlRef.current.stop();
    } else {
      loopControlRef.current.start();
    }
  }, [paused]);

  const effectiveGradient =
    linesGradient ||
    (gradientStart ? [gradientStart, gradientMid, gradientEnd].filter(Boolean) : undefined);

  const getLineCount = waveType => {
    if (typeof lineCount === 'number') return lineCount;
    if (!enabledWaves.includes(waveType)) return 0;
    const index = enabledWaves.indexOf(waveType);
    return lineCount[index] ?? 6;
  };

  const getLineDistance = waveType => {
    if (typeof lineDistance === 'number') return lineDistance;
    if (!enabledWaves.includes(waveType)) return 0.1;
    const index = enabledWaves.indexOf(waveType);
    return lineDistance[index] ?? 0.1;
  };

  const topLineCount = enabledWaves.includes('top') ? getLineCount('top') : 0;
  const middleLineCount = enabledWaves.includes('middle') ? getLineCount('middle') : 0;
  const bottomLineCount = enabledWaves.includes('bottom') ? getLineCount('bottom') : 0;

  const topLineDistance = enabledWaves.includes('top') ? getLineDistance('top') * 0.01 : 0.01;
  const middleLineDistance = enabledWaves.includes('middle') ? getLineDistance('middle') * 0.01 : 0.01;
  const bottomLineDistance = enabledWaves.includes('bottom') ? getLineDistance('bottom') * 0.01 : 0.01;

  const gradientKey = effectiveGradient ? effectiveGradient.join(',') : '';
  const wavesKey = Array.isArray(enabledWaves) ? enabledWaves.join(',') : '';
  const lineCountKey = Array.isArray(lineCount) ? lineCount.join(',') : lineCount;
  const lineDistKey = Array.isArray(lineDistance) ? lineDistance.join(',') : lineDistance;
  const topWaveKey = topWavePosition ? `${topWavePosition.x},${topWavePosition.y},${topWavePosition.rotate}` : '';
  const midWaveKey = middleWavePosition ? `${middleWavePosition.x},${middleWavePosition.y},${middleWavePosition.rotate}` : '';
  const botWaveKey = bottomWavePosition ? `${bottomWavePosition.x},${bottomWavePosition.y},${bottomWavePosition.rotate}` : '';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;

    const isTransparent = backgroundColor === 'transparent' || backgroundColor === 'none';

    const scene = new Scene();

    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({
      antialias: false,
      alpha: isTransparent,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    if (isTransparent) {
      renderer.setClearColor(0x000000, 0);
    }

    container.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },
      lineIntensity: { value: lineIntensity },
      bloomSize: { value: bloomSize },

      enableTop: { value: enabledWaves.includes('top') },
      enableMiddle: { value: enabledWaves.includes('middle') },
      enableBottom: { value: enabledWaves.includes('bottom') },

      topLineCount: { value: topLineCount },
      middleLineCount: { value: middleLineCount },
      bottomLineCount: { value: bottomLineCount },

      topLineDistance: { value: topLineDistance },
      middleLineDistance: { value: middleLineDistance },
      bottomLineDistance: { value: bottomLineDistance },

      topWavePosition: {
        value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4)
      },
      middleWavePosition: {
        value: new Vector3(
          middleWavePosition?.x ?? 5.0,
          middleWavePosition?.y ?? 0.0,
          middleWavePosition?.rotate ?? 0.2
        )
      },
      bottomWavePosition: {
        value: new Vector3(
          bottomWavePosition?.x ?? 2.0,
          bottomWavePosition?.y ?? -0.7,
          bottomWavePosition?.rotate ?? 0.4
        )
      },

      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },

      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },

      lineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1))
      },
      lineGradientCount: { value: 0 },
      backgroundColor: { value: hexToVec3(backgroundColor) },
      isTransparent: { value: isTransparent },
      lightMode: { value: lightMode }
    };

    if (effectiveGradient && effectiveGradient.length > 0) {
      const stops = effectiveGradient.slice(0, MAX_GRADIENT_STOPS);
      uniforms.lineGradientCount.value = stops.length;

      stops.forEach((hex, i) => {
        const color = hexToVec3(hex);
        uniforms.lineGradient.value[i].set(color.x, color.y, color.z);
      });
    }

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: isTransparent
    });

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();

    let lastW = 0;
    let lastH = 0;
    const setSize = () => {
      if (!active) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      if (Math.abs(width - lastW) < 2 && Math.abs(height - lastH) < 2) return;
      lastW = width;
      lastH = height;

      renderer.setSize(width, height, false);

      const canvasWidth = renderer.domElement.width;
      const canvasHeight = renderer.domElement.height;
      uniforms.iResolution.value.set(canvasWidth, canvasHeight, 1);
      renderer.render(scene, camera);
    };

    setSize();

    let resizeRaf = 0;
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
          if (!active) return;
          if (resizeRaf) cancelAnimationFrame(resizeRaf);
          resizeRaf = requestAnimationFrame(() => {
            setSize();
            if (isVisible && !pausedRef.current) startLoop();
          });
        })
        : null;

    if (ro) ro.observe(container);

    const handlePointerMove = event => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dpr = renderer.getPixelRatio();

      targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr);
      targetInfluenceRef.current = 1.0;

      if (parallax) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (x - centerX) / rect.width;
        const offsetY = -(y - centerY) / rect.height;
        targetParallaxRef.current.set(offsetX * parallaxStrength, offsetY * parallaxStrength);
      }
    };

    const handlePointerLeave = () => {
      targetInfluenceRef.current = 0.0;
    };

    if (interactive) {
      renderer.domElement.addEventListener('pointermove', handlePointerMove);
      renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    }

    let isVisible = true;
    let raf = 0;

    const tick = () => {
      if (!active || !isVisible || pausedRef.current) {
        raf = 0;
        return;
      }

      uniforms.iTime.value = clock.getElapsedTime();

      if (interactive) {
        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
        uniforms.iMouse.value.copy(currentMouseRef.current);

        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
        uniforms.bendInfluence.value = currentInfluenceRef.current;
      }

      if (parallax) {
        currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
        uniforms.parallaxOffset.value.copy(currentParallaxRef.current);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!raf && active && isVisible && !pausedRef.current) {
        raf = requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    loopControlRef.current = {
      start: startLoop,
      stop: stopLoop
    };

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
          ([entry]) => {
            if (!active) return;
            isVisible = entry.isIntersecting;
            if (isVisible) {
              startLoop();
            } else {
              stopLoop();
            }
          },
          { threshold: 0.001 }
        )
        : null;

    if (io) io.observe(container);

    renderer.render(scene, camera);
    startLoop();

    return () => {
      active = false;
      loopControlRef.current = { start: () => { }, stop: () => { } };

      stopLoop();

      if (io) io.disconnect();

      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      if (ro) ro.disconnect();

      if (interactive) {
        renderer.domElement.removeEventListener('pointermove', handlePointerMove);
        renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [
    gradientKey,
    wavesKey,
    lineCountKey,
    lineDistKey,
    topWaveKey,
    midWaveKey,
    botWaveKey,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength,
    backgroundColor,
    lineIntensity,
    bloomSize,
    lightMode
  ]);

  return (
    <div
      ref={containerRef}
      className="floating-lines-container"
      style={{
        mixBlendMode: lightMode ? 'normal' : mixBlendMode
      }}
    />
  );
}