import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, SoftShadows } from '@react-three/drei';
import * as THREE from 'three';

// --- Advanced Origami Paper Boat ---
const OrigamiBoat = () => {
    const boatGroup = useRef<THREE.Group>(null);

    // Create custom geometry for a classic folded paper boat
    const geometry = useMemo(() => {
        const geom = new THREE.BufferGeometry();

        // Define vertices for the classic origami shape
        const vertices = new Float32Array([
            // Main Central Sail (Triangle)
            0, 2.5, 0,      // Top point
            -0.8, 0, 0.2,   // Bottom left base
            0.8, 0, -0.2,   // Bottom right base

            // Front Hull Left Side
            -2.5, 0.5, 0,   // Front tip
            -0.8, 0, 0.2,   // Center left
            0, -0.5, 0.5,   // Bottom center fold

            // Front Hull Right Side
            -2.5, 0.5, 0,   // Front tip
            0, -0.5, -0.5,  // Bottom center fold
            0.8, 0, -0.2,   // Center right

            // Back Hull Left Side
            2.5, 0.8, 0,    // Back tip
            0, -0.5, 0.5,   // Bottom center fold
            -0.8, 0, 0.2,   // Center left

            // Back Hull Right Side
            2.5, 0.8, 0,    // Back tip
            0.8, 0, -0.2,   // Center right
            0, -0.5, -0.5,  // Bottom center fold

            // Inner folded flap (Left)
            -2.5, 0.5, 0,
            0, 0.2, 0,
            -0.8, 0, 0.2,

            // Inner folded flap (Right)
            2.5, 0.8, 0,
            0.8, 0, -0.2,
            0, 0.2, 0,

            // Small secondary sail
            0, 1.5, 0.1,
            0.5, 0, 0.3,
            0, 0, 0,
        ]);

        geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geom.computeVertexNormals();
        return geom;
    }, []);

    useFrame((state) => {
        if (boatGroup.current) {
            const t = state.clock.elapsedTime;
            // Gentle rhythmic rocking matching the ocean waves
            boatGroup.current.rotation.z = Math.sin(t * 1.5) * 0.08;
            boatGroup.current.rotation.x = Math.sin(t * 2.1) * 0.05;
        }
    });

    return (
        <group ref={boatGroup} scale={1.2} position={[4, 0.2, 0]} rotation={[0, -0.5, 0]}>
            <mesh geometry={geometry} castShadow receiveShadow>
                {/* Dark, premium matte paper material */}
                <meshStandardMaterial
                    color="#2a2a2e"
                    roughness={0.8}
                    metalness={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>
            {/* Inner shadow/darkness blocker to make it look solid */}
            <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[4, 1.2]} />
                <meshBasicMaterial color="#000000" />
            </mesh>
        </group>
    );
};

// --- Glassy Ocean Waves ---
const GlassOcean = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const geomRef = useRef<THREE.PlaneGeometry>(null);

    // Animate vertices in useFrame for realistic ripples
    useFrame((state) => {
        if (!geomRef.current) return;
        const pos = geomRef.current.attributes.position;
        const time = state.clock.elapsedTime * 0.8;

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);

            // Complex wave math combining multiple sine waves
            const wave1 = Math.sin(x * 0.2 + time) * 0.3;
            const wave2 = Math.sin(y * 0.3 + time * 0.8) * 0.2;
            const wave3 = Math.sin((x + y) * 0.5 - time * 1.2) * 0.15;

            pos.setZ(i, wave1 + wave2 + wave3);
        }
        pos.needsUpdate = true;
        geomRef.current.computeVertexNormals();
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry ref={geomRef} args={[100, 100, 128, 128]} />
            {/* Advanced Physical Material for dark glass/water look */}
            <meshPhysicalMaterial
                color="#0a0a0f"
                roughness={0.15}
                metalness={0.1}
                transmission={0} // Opaque dark water base for the reference image's deep look
                ior={1.33}
                reflectivity={1.0}
                clearcoat={0.8}
                clearcoatRoughness={0.1}
            />
        </mesh>
    );
};

// --- Interactive Cursor Light ---
const InteractiveLighting = () => {
    const lightRef = useRef<THREE.SpotLight>(null);
    const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());
    const { scene } = useThree();

    useMemo(() => {
        scene.add(targetRef.current);
    }, [scene]);

    useFrame((state) => {
        if (lightRef.current) {
            // Smoothly track mouse in 3D space
            // Mouse coordinates are normalized -1 to 1
            const targetX = state.pointer.x * 20;
            const targetZ = -state.pointer.y * 10;

            // Lerp light position for smoothness
            lightRef.current.position.lerp(new THREE.Vector3(targetX, 12, targetZ + 5), 0.05);
            // Light looks straight down
            targetRef.current.position.set(targetX, 0, targetZ);
            lightRef.current.target = targetRef.current;
        }
    });

    return (
        <>
            <ambientLight intensity={0.2} color="#ffffff" />
            <spotLight
                ref={lightRef}
                color="#eaddff" // Soft purple/white glow
                intensity={800}
                angle={0.6}
                penumbra={0.8}
                distance={40}
                castShadow
                shadow-bias={-0.0001}
                shadow-mapSize={[2048, 2048]}
            />
            {/* Fill light from the left to define the text area slightly */}
            <directionalLight position={[-10, 5, 0]} intensity={0.5} color="#454555" />
        </>
    )
};

const Hero3DBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 bg-[#030305] overflow-hidden pointer-events-auto">
            <Canvas shadows camera={{ position: [0, 4, 15], fov: 40 }}>
                <color attach="background" args={['#030305']} />
                <fog attach="fog" args={['#030305', 10, 40]} />

                <SoftShadows size={15} samples={16} focus={0.5} />
                <InteractiveLighting />

                <Float
                    speed={1.5}
                    rotationIntensity={0.1}
                    floatIntensity={0.8}
                    floatingRange={[-0.3, 0.3]}
                >
                    <OrigamiBoat />
                </Float>

                <GlassOcean />
            </Canvas>
        </div>
    );
};

export default Hero3DBackground;
