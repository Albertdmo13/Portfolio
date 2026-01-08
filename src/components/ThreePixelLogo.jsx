import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import "./ThreePixelLogo.css";
import * as THREE from "three";

// --- REVERTED Model Component ---
// This is now back to the original version, without the 3D outline code.
function Model({ url, onBoxComputed, pixelSize }) {
  const { scene } = useGLTF(url);
  const ref = useRef(); // The ref is back on the primitive
  const [hovered, setHovered] = useState(false);
  const defaultRotation = new THREE.Vector3(-0.3, 0.0, 0.0);

  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.set(
        defaultRotation.x,
        defaultRotation.y,
        defaultRotation.z
      );
      const box = new THREE.Box3().setFromObject(ref.current);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      onBoxComputed && onBoxComputed({ box, size, center });
    }
  }, [scene, onBoxComputed]); // Kept onBoxComputed dependency

  useFrame(({ mouse, clock }) => {
    if (!ref.current) return; // Using the primitive's ref again
    if (hovered) {
      const targetRotation = new THREE.Vector3(
        -mouse.y * 0.2,
        mouse.x * 0.2,
        0
      );
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        targetRotation.x,
        0.075
      );
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        targetRotation.y,
        0.075
      );
    } else {
      const t = clock.getElapsedTime();
      const idleX = defaultRotation.x + Math.sin(t * 2.1) * 0.02;
      const idleY = Math.sin(t * 0.7) * 0.15;
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        idleX,
        0.02
      );
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        idleY,
        0.02
      );
      ref.current.rotation.z = 0;
    }
  });

  return (
    // Back to the original group structure
    <group>
      <primitive ref={ref} object={scene} scale={(2.35 * pixelSize) / 3} />
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

// --- NO CHANGES to Sparks component ---
// --- OPTIMIZED Sparks component ---
function Sparks({ sparkFrames, pixelSize }) {
  const textures = useTexture(sparkFrames);
  // Object pool size
  const POOL_SIZE = 20;
  
  // Refs for the sprite objects in the scene
  const spriteRefs = useRef([]);
  
  // State for the logic (not React state)
  const sparksData = useRef(
    Array.from({ length: POOL_SIZE }, () => ({
      active: false,
      x: 0,
      y: 0,
      lifetime: 0,
      frameIndex: 0,
    }))
  );

  // Force nearest-neighbor filtering
  useEffect(() => {
    textures.forEach((tex) => {
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.generateMipmaps = false;
      tex.anisotropy = 0;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    });
  }, [textures]);

  useFrame((_, delta) => {
    const frameDuration = 0.033; // 30 FPS

    // 1. Spawn new sparks
    if (Math.random() < 0.023) {
      // Find an inactive spark in the pool
      const inactiveIdx = sparksData.current.findIndex(s => !s.active);
      if (inactiveIdx !== -1) {
        const spark = sparksData.current[inactiveIdx];
        spark.active = true;
        spark.x = (Math.random() - 0.5) * 3.0;
        spark.y = Math.random() - 0.5 + 0.2;
        spark.lifetime = 0;
        spark.frameIndex = 0;
        
        // Make visible immediately
        if (spriteRefs.current[inactiveIdx]) {
           spriteRefs.current[inactiveIdx].visible = true;
           spriteRefs.current[inactiveIdx].position.set(
              spark.x * 7 * pixelSize * 0.25,
              spark.y * 3 * pixelSize * 0.25,
              0
           );
        }
      }
    }

    // 2. Update active sparks
    sparksData.current.forEach((spark, i) => {
      if (!spark.active) return;

      spark.lifetime += delta;
      spark.frameIndex = Math.floor(spark.lifetime / frameDuration);

      const sprite = spriteRefs.current[i];
      if (!sprite) return;

      if (spark.frameIndex >= sparkFrames.length) {
        // Deactivate
        spark.active = false;
        sprite.visible = false;
      } else {
        // Update texture
        sprite.material.map = textures[spark.frameIndex];
        // Ensure position is correct (static for now, but good practice)
        sprite.position.set(
            spark.x * 7 * pixelSize * 0.25,
            spark.y * 3 * pixelSize * 0.25,
            0
        );
      }
    });
  });

  return (
    <>
      {Array.from({ length: POOL_SIZE }).map((_, i) => (
        <sprite
          key={i}
          ref={el => spriteRefs.current[i] = el}
          scale={[pixelSize / 45, pixelSize / 45, pixelSize / 45]}
          renderOrder={999}
          visible={false} // Start invisible
        >
          <spriteMaterial
            transparent
            depthTest={false}
            depthWrite={false}
            sizeAttenuation={false}
          />
        </sprite>
      ))}
    </>
  );
}

// --- MODIFIED ThreePixelLogo component ---
export default function ThreePixelLogo({
  url,
  pixelSize = 3,
  sparkFrames = [],
  visible = true,
}) {
  const cameraRef = useRef();

  // This string creates a 1px outline by layering
  // four drop shadows, one for each direction.
  const cssOutline = [
    "drop-shadow(0px 2px 0px #332985)", // Changed color
    "drop-shadow(0px -2px 0px #332985)", // Changed color
    "drop-shadow(2px 0px 0px #332985)", // Changed color
    "drop-shadow(-2px 0px 0px #332985)", // Changed color
  ].join(" ");

  return (
    <div className="pixel-logo-container">
      <Canvas
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: false }}
        camera={{ position: [0, 0, 15], fov: 20 }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0);
          camera.layers.enable(0);
          camera.layers.enable(1);
          gl.autoClear = false;
          gl.pixelRatio = 1; // IMPORTANT: disables browser’s scaling blur
          gl.setPixelRatio(1);
          gl.outputColorSpace = THREE.SRGBColorSpace; // Replaced deprecated outputEncoding
        }}
      >
        {/* Main 3D layer */}
        <group layers={0}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 3, 5]} intensity={1.5} />
          <Model url={url} onBoxComputed={() => {}} pixelSize={pixelSize} />
        </group>

        {/* Postprocessing (Removed due to unresolved dependency error)
        <EffectComposer multisampling={0}>
          <Pixelation granularity={pixelSize} />
        </EffectComposer>
        */}

        {/* Overlay sparks layer */}
        {sparkFrames.length > 0 && (
          <group layers={1}>
            <Sparks sparkFrames={sparkFrames} pixelSize={pixelSize} />
          </group>
        )}
      </Canvas>
    </div>
  );
}
