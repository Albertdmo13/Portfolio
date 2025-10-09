import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, Pixelation } from "@react-three/postprocessing";

function Model({ url, onBoxComputed }) {
  const { scene } = useGLTF(url);
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const defaultRotation = new THREE.Vector3(-0.3, 0.0, 0.0);

  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.set(defaultRotation.x, defaultRotation.y, defaultRotation.z);
      const box = new THREE.Box3().setFromObject(ref.current);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      onBoxComputed && onBoxComputed({ box, size, center });
    }
  }, [scene]);

  useFrame(({ mouse, clock }) => {
    if (!ref.current) return;
    if (hovered) {
      const targetRotation = new THREE.Vector3(-mouse.y * 0.2, mouse.x * 0.2, 0);
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotation.x, 0.075);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotation.y, 0.075);
    } else {
      const t = clock.getElapsedTime();
      const idleX = defaultRotation.x + Math.sin(t * 2.1) * 0.02;
      const idleY = Math.sin(t * 0.7) * 0.15;
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, idleX, 0.02);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, idleY, 0.02);
      ref.current.rotation.z = 0;
    }
  });

  return (
    <group>
      <primitive ref={ref} object={scene} scale={2.5} />
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

function Sparks({ sparkFrames, pixelSize }) {
  const textures = useTexture(sparkFrames);
  const [sparks, setSparks] = useState([]);

  // Force nearest-neighbor filtering and prevent any smoothing
  useEffect(() => {
    textures.forEach(tex => {
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.generateMipmaps = false;
      tex.anisotropy = 0;
      tex.encoding = THREE.sRGBEncoding;
      tex.needsUpdate = true;
    });
  }, [textures]);

  // Spawn sparks randomly near the logo
  useEffect(() => {
    const spawnSpark = () => {
      const id = Math.random().toString(36).substring(2);
      const x = (Math.random() - 0.5) * 3.0;
      const y = (Math.random() - 0.5) + 0.2;
      setSparks(s => [...s, { id, x, y, frameIndex: 0, lifetime: 0 }]);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.015) spawnSpark();
    }, 10);

    return () => clearInterval(interval);
  }, []);

  // Animate through spark frames
  useFrame((_, delta) => {
    setSparks(sparks =>
      sparks
        .map(s => {
          const frameDuration = 0.033; // 30 FPS
          const newLifetime = s.lifetime + delta;
          const newFrameIndex = Math.floor(newLifetime / frameDuration);
          return { ...s, frameIndex: newFrameIndex, lifetime: newLifetime };
        })
        .filter(s => s.frameIndex < sparkFrames.length)
    );
  });

  return (
    <>
      {sparks.map(spark => {
        const texture = textures[spark.frameIndex];
        return (
          <sprite
            key={spark.id}
            position={[spark.x * 7, spark.y * 3, 0]}
            scale={[pixelSize/45, pixelSize/45, pixelSize/45]} // exact scale factor
            renderOrder={999}
            layers={1}
          >
            <spriteMaterial
              map={texture}
              transparent
              depthTest={false}
              depthWrite={false}
              sizeAttenuation={false}
            />
          </sprite>
        );
      })}
    </>
  );
}

export default function ThreePixelLogo({ url, pixelSize = 6, sparkFrames = [] }) {
  const cameraRef = useRef();

  return (
    <div
      className="hero-logo"
      style={{ width: "1400px", height: "300px", margin: "auto auto" }}
    >
      <Canvas
        gl={{ antialias: false }}
        camera={{ position: [0, 0, 15], fov: 20 }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0);
          camera.layers.enable(0);
          camera.layers.enable(1);
          gl.autoClear = false;
          gl.pixelRatio = 1; // IMPORTANT: disables browser’s scaling blur
          gl.setPixelRatio(1);
          gl.outputEncoding = THREE.sRGBEncoding;
        }}
      >

        {/* Main 3D layer */}
        <group layers={0}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 3, 5]} intensity={1.5} />
          <Model url={url} onBoxComputed={() => {}} />
        </group>

        {/* Postprocessing */}
        <EffectComposer multisampling={0}>
          <Pixelation granularity={pixelSize} />
        </EffectComposer>

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
