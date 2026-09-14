import { useEffect, useRef, useState } from "react";

interface TrailPoint {
  x: number;
  y: number;
}

const MAX_TRAIL = 22;

export function SparkleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const trailRef = useRef<TrailPoint[]>([]);
  const posRef = useRef<TrailPoint | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isTouch) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      posRef.current = null;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const pos = posRef.current;
      const trail = trailRef.current;

      if (pos) {
        trail.push({ x: pos.x, y: pos.y });
      } else if (trail.length) {
        trail.shift();
      }
      while (trail.length > MAX_TRAIL) trail.shift();

      // Trail: older points are dimmer and smaller.
      for (let i = 0; i < trail.length; i++) {
        const t = (i + 1) / trail.length;
        const p = trail[i];
        if (!p) continue;
        const alpha = t * t * 0.55;
        const radius = 0.6 + t * 1.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 230, 255, ${alpha})`;
        ctx.fill();
      }

      // Head: a bright, steady star at the cursor tip.
      if (pos) {
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 12);
        glow.addColorStop(0, "rgba(255, 255, 255, 0.85)");
        glow.addColorStop(0.4, "rgba(205, 195, 255, 0.35)");
        glow.addColorStop(1, "rgba(180, 200, 255, 0)");
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 1.9, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  );
}
