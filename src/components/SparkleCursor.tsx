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
  const [sparks, setSparks] = useState<Spark[]>([]);
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
          const newSparks: Spark[] = [];
          for (let i = 0; i < count; i++) {
            const hueRoll = Math.random();
            const hue = hueRoll > 0.6 ? 260 : hueRoll > 0.3 ? 280 : 220;
            newSparks.push({
              id: idRef.current++,
              x: x + (Math.random() - 0.5) * 10,
              y: y + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5 - 0.5,
              life: 1,
              maxLife: 1,
              size: Math.random() * 2 + 1,
              hue,
            });
          }
          setSparks((prev) => [...prev, ...newSparks]);
        }
      }
      lastPosRef.current = { x, y };
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const animate = () => {
      setSparks((prev) => {
        const next = [];
        for (const s of prev) {
          const updated = {
            ...s,
            x: s.x + s.vx,
            y: s.y + s.vy,
            vy: s.vy + 0.03,
            life: s.life - 0.025,
          };
          if (updated.life > 0) {
            next.push(updated);
          }
        }
        return next;
      });
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
      {sparks.map((spark) => (
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
