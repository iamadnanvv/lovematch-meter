import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type ConfettiVariant = "primary" | "accent" | "secondary";

interface CelebrationConfettiProps {
  /** Set true to fire the celebration once on mount. */
  active: boolean;
  /** Number of particles. Keep modest to avoid perf issues. */
  particleCount?: number;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function CelebrationConfetti({ active, particleCount = 34 }: CelebrationConfettiProps) {
  const reduceMotion = useReducedMotion();
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) return;
    // re-fire if the parent remounts results, but keep deterministic per mount
    setRunKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const particles = useMemo(() => {
    const colors: ConfettiVariant[] = ["primary", "accent", "secondary"];
    return Array.from({ length: particleCount }).map((_, i) => {
      const fromLeft = rand(12, 88);
      const drift = rand(-18, 18);
      const duration = rand(1.4, 2.4);
      const delay = rand(0, 0.25);
      const size = rand(6, 12);
      const rotate = rand(-180, 180);
      const color = colors[i % colors.length];

      return {
        id: i,
        fromLeft,
        drift,
        duration,
        delay,
        size,
        rotate,
        color,
      };
    });
  }, [particleCount, runKey]);

  if (!active || reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={`${runKey}-${p.id}`}
          className={
            "absolute top-0 rounded-sm opacity-90 " +
            (p.color === "primary"
              ? "bg-primary"
              : p.color === "accent"
                ? "bg-accent"
                : "bg-secondary")
          }
          style={{
            left: `${p.fromLeft}%`,
            width: p.size,
            height: p.size * 0.42,
          }}
          initial={{ y: -20, x: 0, rotate: 0, scale: 0.9, opacity: 0 }}
          animate={{
            y: [0, 420],
            x: [0, p.drift * 10],
            rotate: [0, p.rotate],
            scale: [1, 1],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
