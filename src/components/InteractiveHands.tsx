import React, { useRef, useEffect, useCallback, useState } from 'react';
import { SmoothCursor } from './ui/smooth-cursor';
import { handPaths } from './HandPaths';

// ─── Particle system constants ───────────────────────────────────────────────
const SPACING = 3;
const DOT_R = 1.2;
const MOUSE_R = 90;
const RETURN_S = 0.055;
const FRICTION = 0.78;

interface Particle {
    hx: number; hy: number;
    x: number; y: number;
    vx: number; vy: number;
    phase: number;
    color: string;
}

const InteractiveHands: React.FC<{ className?: string; fillColor?: string }> = ({
    className = 'absolute inset-0 w-full h-full',
    fillColor = '#1a1a1dff',
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);
    const builtRef = useRef(false);

    const buildParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || builtRef.current) return;



        const W = canvas.width;
        const H = canvas.height;
        if (W === 0 || H === 0) return;

        // Mark immediately to prevent duplicate async calls
        builtRef.current = true;

        const off = document.createElement('canvas');
        off.width = W;
        off.height = H;
        const offCtx = off.getContext('2d', { willReadFrequently: true })!;

        // Compute aspect ratio to draw the image without stretching
        // viewBox from dfd (1).svg is 0 0 1536 1024
        const pathW = 1536;
        const pathH = 1024;
        const imgRatio = pathW / pathH;
        const canvasRatio = W / H;

        let drawW = W;
        let drawH = H;
        let drawX = 0;
        let drawY = 0;

        if (imgRatio > canvasRatio) {
            drawW = W;
            drawH = W / imgRatio;
            drawY = (H - drawH) / 2;
        } else {
            drawH = H;
            drawW = H * imgRatio;
            drawX = (W - drawW) / 2;
        }

        // Draw the paths directly to offscreen context
        offCtx.save();
        offCtx.translate(drawX, drawY);
        offCtx.scale(drawW / pathW, drawH / pathH);

        // Apply the root <g> transform found in the SVG:
        // translate(0, 1024) scale(0.1, -0.1)
        offCtx.translate(0, 1024);
        offCtx.scale(0.1, -0.1);

        offCtx.fillStyle = fillColor; // the color of the paths, sampleable

        handPaths.forEach(pathStr => {
            const p = new Path2D(pathStr);
            offCtx.fill(p);
        });
        offCtx.restore();

        const { data } = offCtx.getImageData(0, 0, W, H);
        const pts: Particle[] = [];

        // We use a slightly tighter spacing and add jitter to remove the "pixelated" grid feeling
        const effSpacing = SPACING * 0.9;

        for (let y = SPACING; y < H; y += effSpacing) {
            for (let x = SPACING; x < W; x += effSpacing) {
                const px = Math.floor(x);
                const py = Math.floor(y);
                const idx = (py * W + px) * 4;
                // Any pixel with meaningful opacity = particle
                if (data[idx + 3] > 64) {
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    const a = (data[idx + 3] / 255).toFixed(2);

                    // Jitter creates organic distribution
                    const jx = x + (Math.random() - 0.5) * SPACING;
                    const jy = y + (Math.random() - 0.5) * SPACING;

                    pts.push({
                        hx: jx, hy: jy,
                        x: jx, y: jy,
                        vx: 0, vy: 0,
                        phase: Math.random() * Math.PI * 2,
                        color: `rgba(${r},${g},${b},${a})`
                    });
                }
            }
        }

        console.log(`[InteractiveHands] Generated ${pts.length} particles from paths. W=${W}, H=${H}`);
        particlesRef.current = pts;
    }, []);

    // Animation loop — reads dimensions from canvasRef each frame
    const animate = useCallback((ctx: CanvasRenderingContext2D) => {
        const c = canvasRef.current;
        if (!c) return;
        const W = c.width;
        const H = c.height;

        ctx.clearRect(0, 0, W, H);

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const r2 = MOUSE_R * MOUSE_R;
        const pts = particlesRef.current;

        for (let i = 0; i < pts.length; i++) {
            const p = pts[i];

            let targetX = p.hx;
            let targetY = p.hy;

            const dx = p.x - mx;
            const dy = p.y - my;
            const d2 = dx * dx + dy * dy;

            if (d2 < r2) {
                const d = Math.sqrt(d2) || 1;
                // Push target position away from mouse to the edge of the radius smoothly
                const pushDist = MOUSE_R - d;
                targetX = p.hx + (dx / d) * pushDist;
                targetY = p.hy + (dy / d) * pushDist;
            }

            p.vx += (targetX - p.x) * RETURN_S;
            p.vy += (targetY - p.y) * RETURN_S;
            p.vx *= FRICTION;
            p.vy *= FRICTION;

            p.x += p.vx;
            p.y += p.vy;

            // Render each particle with its color
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, DOT_R, 0, Math.PI * 2);
            ctx.fill();
        }

        rafRef.current = requestAnimationFrame(() => animate(ctx));
    }, [fillColor]);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const ctx = canvas.getContext('2d')!;

        // Animation loop kickoff
        const tick = () => animate(ctx);

        const resize = () => {
            const rect = container.getBoundingClientRect();
            // Use actual measured size; fall back only if really unmeasured
            const w = Math.round(rect.width) || 800;
            const h = Math.round(rect.height) || 480;
            canvas.width = w;
            canvas.height = h;
            builtRef.current = false;
            particlesRef.current = [];
            buildParticles();
        };

        // Delay first resize by one frame so the flex layout has settled
        rafRef.current = requestAnimationFrame(() => {
            resize();
            rafRef.current = requestAnimationFrame(tick);
        });

        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(rafRef.current);
            resize();
            rafRef.current = requestAnimationFrame(tick);
        });
        observer.observe(container);

        const onMove = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            mouseRef.current.x = (e.clientX - r.left) * (canvas.width / r.width);
            mouseRef.current.y = (e.clientY - r.top) * (canvas.height / r.height);
        };
        const onLeave = () => {
            mouseRef.current.x = -9999;
            mouseRef.current.y = -9999;
        };

        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseleave', onLeave);

        return () => {
            cancelAnimationFrame(rafRef.current);
            observer.disconnect();
            canvas.removeEventListener('mousemove', onMove);
            canvas.removeEventListener('mouseleave', onLeave);
        };
    }, [buildParticles, animate]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && <SmoothCursor />}
            <canvas
                ref={canvasRef}
                className={`w-full h-full ${isHovered ? 'cursor-none' : 'cursor-default'}`}
                style={{ width: '100%', height: '100%', pointerEvents: 'auto', display: 'block' }}
            />
        </div>
    );
};

export default InteractiveHands;