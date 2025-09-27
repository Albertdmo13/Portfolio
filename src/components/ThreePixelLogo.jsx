import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, Pixelation } from "@react-three/postprocessing";

function Model({ url }) {
    const { scene } = useGLTF(url);
    const ref = useRef();
    const [hovered, setHovered] = useState(false);
    const [boxArgs, setBoxArgs] = useState([1, 1, 1]);
    const [boxCenter, setBoxCenter] = useState([0, 0, 0]);

    // Rotación inicial con ligero tilt en X
    const defaultRotation = new THREE.Vector3(-0.3, 0.0, 0.0);

    useEffect(() => {
        if (ref.current) {
            ref.current.rotation.set(
                defaultRotation.x,
                defaultRotation.y,
                defaultRotation.z
            );

            // Calcular caja envolvente para hover
            const box = new THREE.Box3().setFromObject(ref.current);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            setBoxArgs([size.x * 3, size.y * 3, size.z * 3]);
            setBoxCenter([center.x, center.y, center.z]);
        }
    }, [scene]);

    useFrame(({ mouse, clock }) => {
        if (!ref.current) return;

        if (hovered) {
            // Cuando está hovered, seguir el ratón (X/Y)
            const targetRotation = new THREE.Vector3(
                -mouse.y * 0.2, // rotación en X
                mouse.x * 0.2,  // rotación en Y
                0               // Z bloqueado
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
            ref.current.rotation.z = 0; // mantener Z fijo
        } else {
            // Tiempo animación
            const t = clock.getElapsedTime();

            // Oscilaciones suaves y limitadas
            const idleX = defaultRotation.x + Math.sin(t*2.1) * 0.02; // tilt leve
            const idleY = Math.sin(t * 0.7) * 0.15; // giro limitado izquierda-derecha
            const idleZ = 0; // pequeña oscilación roll

            // Aplicar suavemente
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
            ref.current.rotation.z = THREE.MathUtils.lerp(
                ref.current.rotation.z,
                idleZ,
                0.02
            );
        }
    });

    return (
        <group>
            {/* Modelo */}
            <primitive ref={ref} object={scene} scale={2.5} />

            {/* Caja invisible para hover */}
            <mesh
                position={boxCenter}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry args={boxArgs} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
}

export default function ThreePixelLogo({ url , pixelSize = 6}) {
    return (
        <div
            className="hero-logo"
            style={{
                width: "1400px",
                height: "300px",
                margin: "auto auto",
            }}
        >
            <Canvas
                gl={{ antialias: false }}
                camera={{ position: [0, 0, 15], fov: 20, near: 0.1, far: 100 }}
                onCreated={({ camera }) => {
                    camera.lookAt(0, 0, 0);
                }}
            >
                <Model url={url} />

                <EffectComposer multisampling={0}>
                    <Pixelation granularity={pixelSize} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
