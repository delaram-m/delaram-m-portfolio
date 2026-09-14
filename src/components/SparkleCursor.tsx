import { useEffect, useRef, useState } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function SparkleCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const sparksRef = useRef<Spark[]>([]);
  const frameRef = useRef<number>(0);
  const idRef = useRef(0);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isTouch) return;

    let throttle = 0;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (lastPosRef.current) {
        const dx = x - lastPosRef.current.x;
        const dy = y - lastPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        throttle += dist;

        if (throttle > 18) {
          throttle = 0;
          const count = Math.random() > 0.7 ? 2 : 1;
          for (let i = 0; i < count; i++) {
            sparksRef.current.push({
              id: idRef.current++,
              x: x + (Math.random() - 0.5) * 10,
              y: y + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5 - 0.5,
              life: 1,
              maxLife: 1,
              size: Math.random() * 2 + 1,
              hue: Math.random() > 0.5 ? 260 : 220,
            });
          }
        }
      }
      lastPosRef.current = { x, y };
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const animate = () => {
      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.03;
        s.life -= 0.025;
        if (s.life <= 0) {
          sparks.splice(i, 1);
        }
      }
      container.style.setProperty("--spark-count", String(sparks.length));
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      {sparksRef.current.map((spark) => (
        <span
          key={spark.id}
          className="absolute rounded-full"
          style={{
            left: spark.x,
            top: spark.y,
            width: spark.size,
            height: spark.size,
            opacity: spark.life,
            transform: "translate(-50%, -50%)",
            backgroundColor: `hsl(${spark.hue}, 90%, 80%)`,
            boxShadow: `0 0 ${spark.size * 3}px ${spark.size}px hsl(${spark.hue}, 80%, 70%)`,
          }}
        />
      ))}
    </div>
  );
}
