import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * AI Bubble (v1)
 * Organic morphing sphere that behaves like a liquid/bubble.
 * Uses vertex displacement with Perlin noise.
 */
export default function AIRing() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [, setIsLoading] = useState(true);

    useEffect(() => {
        const currentContainer = containerRef.current;
        if (!currentContainer) return;
        setIsLoading(false);

        let renderer: THREE.WebGLRenderer;
        let scene: THREE.Scene;
        let camera: THREE.PerspectiveCamera;
        let animationFrameId: number;
        let bubble: THREE.Mesh;

        // --- High-Performance Perlin Noise (Simplex-like) ---
        // Simplified noise function for vertex displacement
        const noise = {
            p: new Uint8Array(512),
            init() {
                const permutation = new Uint8Array(256).map((_, i) => i);
                for (let i = 255; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
                }
                for (let i = 0; i < 256; i++) {
                    this.p[i] = permutation[i];
                    this.p[i + 256] = permutation[i];
                }
            },
            fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); },
            lerp(t: number, a: number, b: number) { return a + t * (b - a); },
            grad(hash: number, x: number, y: number, z: number) {
                const h = hash & 15;
                const u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : z;
                return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
            },
            perlin(x: number, y: number, z: number) {
                const X = Math.floor(x) & 255;
                const Y = Math.floor(y) & 255;
                const Z = Math.floor(z) & 255;
                x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
                const u = this.fade(x), v = this.fade(y), w = this.fade(z);
                const A = this.p[X] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z;
                const B = this.p[X + 1] + Y, BA = this.p[B] + Z, BB = this.p[B + 1] + Z;
                return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)),
                    this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))),
                    this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)),
                        this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))));
            }
        };
        noise.init();

        const initScene = () => {
            scene = new THREE.Scene();
            // Fixed aspect for icon
            camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
            camera.position.z = 2.5; // Zoom out slightly to fit bubble without clipping

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            });

            const size = 600; // High resolution buffer
            renderer.setSize(size, size);
            renderer.setPixelRatio(window.devicePixelRatio); // Full retina support

            if (currentContainer) {
                currentContainer.innerHTML = '';
                currentContainer.appendChild(renderer.domElement);
                renderer.domElement.style.width = '100%';
                renderer.domElement.style.height = '100%';
            }

            // --- Bubble Geometry 1 (Purple Base) ---
            // Thinner tube (0.15) for "less big" look
            const geometry = new THREE.TorusGeometry(0.6, 0.15, 64, 128);
            const material = new THREE.MeshPhongMaterial({
                color: 0xd8b4fe, // Light Lavender (switched from Dark Purple)
                emissive: 0x7e22ce, // Lighter glow
                specular: 0xffffff,
                shininess: 100,
                flatShading: false,
            });
            bubble = new THREE.Mesh(geometry, material);
            scene.add(bubble);

            // --- Bubble Geometry 2 (White Layer) ---
            const geometry2 = new THREE.TorusGeometry(0.6, 0.15, 64, 128);
            const material2 = new THREE.MeshPhongMaterial({
                color: 0xffffff, // White
                transparent: true,
                opacity: 0.5, // Stronger white layer ("light white")
                blending: THREE.AdditiveBlending,
                specular: 0xffffff,
                shininess: 100,
                side: THREE.DoubleSide,
            });
            const bubble2 = new THREE.Mesh(geometry2, material2);
            // Scale up slightly to sit on top
            bubble2.scale.set(1.03, 1.03, 1.03);
            scene.add(bubble2);

            // --- Lighting ---
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Brighter ambient
            scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0xffffff, 1.2);
            pointLight.position.set(5, 5, 5);
            scene.add(pointLight);

            const pointLight2 = new THREE.PointLight(0xd8b4fe, 1.0); // Light purple light
            pointLight2.position.set(-5, -5, 2);
            scene.add(pointLight2);

            // Store original positions
            const originalPositions = geometry.attributes.position.array.slice();
            const posAttribute = geometry.attributes.position;
            const vertexCount = posAttribute.count;

            const originalPositions2 = geometry2.attributes.position.array.slice();
            const posAttribute2 = geometry2.attributes.position;

            const animate = (time: number) => {
                animationFrameId = requestAnimationFrame(animate);
                const t = time * 0.0004; // Even slower animation

                // Vertex Displacement Loop (Base Bubble)
                for (let i = 0; i < vertexCount; i++) {
                    const x = originalPositions[i * 3];
                    const y = originalPositions[i * 3 + 1];
                    const z = originalPositions[i * 3 + 2];

                    const n = noise.perlin(x * 1.5 + t, y * 1.5 + t, z * 1.5 + t);
                    posAttribute.setXYZ(i, x + (n * 0.05), y + (n * 0.05), z + (n * 0.05));
                }
                posAttribute.needsUpdate = true;
                geometry.computeVertexNormals();

                // Vertex Displacement Loop (White Layer)
                for (let i = 0; i < vertexCount; i++) {
                    const x = originalPositions2[i * 3];
                    const y = originalPositions2[i * 3 + 1];
                    const z = originalPositions2[i * 3 + 2];

                    // Noise with offset for different wave pattern
                    const n = noise.perlin(x * 2.5 + t + 10, y * 2.5 + t + 10, z * 2.5 + t + 10);
                    // More subtle displacement for the coating
                    posAttribute2.setXYZ(i, x + (n * 0.04), y + (n * 0.04), z + (n * 0.04));
                }
                posAttribute2.needsUpdate = true;
                geometry2.computeVertexNormals();

                // Slow, smooth rotation (Z-axis only, Clockwise)
                // Negative rotation around Z is Clockwise in standard Three.js
                bubble.rotation.z = -t * 0.1;
                bubble2.rotation.z = -t * 0.12;

                // Ensure stability
                bubble.rotation.x = bubble.rotation.y = 0;
                bubble2.rotation.x = bubble2.rotation.y = 0;

                renderer.render(scene, camera);
            };

            animate(0);
        };

        initScene();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (renderer) renderer.dispose();
            if (currentContainer) currentContainer.innerHTML = '';
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden"
            style={{
                background: 'transparent',
                // Optional: slight boost to make it pop
                filter: 'brightness(1.1)',
            }}
        />
    );
}
