import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  layer: number;
  twinklePhase: number;
}

function createStars(width: number, height: number, count: number, layer: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      speed: (Math.random() * 0.3 + 0.05) * (layer === 0 ? 0.3 : layer === 1 ? 0.6 : 1),
      layer,
      twinklePhase: Math.random() * Math.PI * 2,
    });
  }
  return stars;
}

export function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const frameRef = useRef<number>(0);
  const dimsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimsRef.current = { width, height };

      const density = Math.min(width, height) < 640 ? 60 : 120;
      starsRef.current = [
        ...createStars(width, height, density, 0),
        ...createStars(width, height, Math.floor(density * 0.6), 1),
        ...createStars(width, height, Math.floor(density * 0.3), 2),
      ];
    };

    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      const { width, height } = dimsRef.current;

      ctx.clearRect(0, 0, width, height);

      // Subtle nebula gradient wash
      const gradient = ctx.createRadialGradient(width * 0.3, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.8);
      gradient.addColorStop(0, "rgba(76, 29, 149, 0.08)");
      gradient.addColorStop(0.5, "rgba(30, 58, 138, 0.05)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const now = time / 1000;
      for (const star of starsRef.current) {
        if (!prefersReducedMotion) {
          star.x -= star.speed * delta * 10;
          if (star.x < -2) star.x = width + 2;
        }

        const twinkle = Math.sin(now * 1.5 + star.twinklePhase) * 0.15 + 0.85;
        const alpha = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 243, 255, ${alpha})`;
        ctx.fill();

        // Soft glow for larger stars
        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          glow.addColorStop(0, `rgba(167, 139, 250, ${alpha * 0.25})`);
          glow.addColorStop(1, "rgba(167, 139, 250, 0)");
          ctx.fillStyle = glow;
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(30, 27, 75, 0.4) 0%, rgba(2, 6, 23, 1) 60%, rgba(0, 0, 0, 1) 100%)" }}
    />
  );
}
