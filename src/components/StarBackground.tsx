import { useEffect, useRef } from "react";

interface Star {
  x: number; // base position
  y: number;
  size: number;
  baseOpacity: number; // fixed random transparency per star
  vibrateSpeed: number; // slow oscillation speed
  vibrateAmp: number; // tiny oscillation amplitude in px
  phase: number; // random phase so stars don't move in sync
  parallax: number; // how much this star shifts with the scroll (depth)
  twinkleSpeed: number; // how fast the star dims and brightens
  twinklePhase: number; // random phase for twinkle
}

function createStars(width: number, height: number): Star[] {
  const count = Math.min(width, height) < 640 ? 110 : 220;
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    // Random depth bucket: far stars barely move on scroll, near stars move more
    const depth = Math.random();
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.4 + 0.5,
      baseOpacity: Math.random() * 0.75 + 0.15, // random transparency per star
      vibrateSpeed: Math.random() * 0.6 + 0.15, // slow vibration, wider speed range
      vibrateAmp: Math.random() * 2.5 + 1.0, // wider drift range so stars wander more
      phase: Math.random() * Math.PI * 2,
      parallax: depth * 0.8 + 0.1, // stronger scroll parallax depth
      twinkleSpeed: Math.random() * 0.5 + 0.2, // slow fade-in/fade-out cycle
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
  const scrollRef = useRef(0);

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
      starsRef.current = createStars(width, height);
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = (time: number) => {
      const { width, height } = dimsRef.current;
      ctx.clearRect(0, 0, width, height);

      const now = time / 1000;
      for (const star of starsRef.current) {
        // Really slow vibration around the base position
        const vx = prefersReducedMotion ? 0 : Math.sin(now * star.vibrateSpeed + star.phase) * star.vibrateAmp;
        const vy = prefersReducedMotion ? 0 : Math.cos(now * star.vibrateSpeed * 0.8 + star.phase) * star.vibrateAmp;

        // Scroll parallax: stars drift with the view by depth
        let y = star.y + vy - scrollRef.current * star.parallax;
        // Wrap so stars stay on screen while scrolling
        y = ((y % height) + height) % height;

        // Twinkle: opacity dims and brightens between 80% and 100%
        const twinkle = prefersReducedMotion
          ? 1
          : 0.8 + 0.2 * Math.sin(now * star.twinkleSpeed + star.twinklePhase);
        const opacity = Math.max(0, Math.min(1, star.baseOpacity * twinkle));




        ctx.beginPath();
        ctx.arc(star.x + vx, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
