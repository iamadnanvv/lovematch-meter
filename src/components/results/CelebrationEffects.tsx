import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

type EffectTier = "hearts" | "confetti" | "gold";

interface CelebrationEffectsProps {
  score: number;
  onTrigger?: (tier: EffectTier) => void;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getTier(score: number): EffectTier | null {
  if (score === 100) return "gold";
  if (score >= 80) return "confetti";
  if (score >= 60) return "hearts";
  return null;
}

export function CelebrationEffects({ score, onTrigger }: CelebrationEffectsProps) {
  const reduceMotion = useReducedMotion();
  const [runKey, setRunKey] = useState(0);
  const [hasFired, setHasFired] = useState(false);
  const tier = getTier(score);
  const haptics = useHapticFeedback();

  useEffect(() => {
    if (!tier || reduceMotion) return;
    setRunKey((k) => k + 1);
    
    // Fire sound callback and haptic feedback once on mount
    if (!hasFired) {
      onTrigger?.(tier);
      haptics.vibrateOnCelebration();
      setHasFired(true);
    }
  }, [tier, reduceMotion, onTrigger, hasFired, haptics]);

  if (!tier || reduceMotion) {
    // Reduced motion fallback: simple text
    if (score >= 60) {
      return (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm text-primary font-medium" aria-live="polite">
          {score === 100 ? "🏆 Perfect Match!" : score >= 80 ? "🎉 Amazing!" : "💕 Great!"}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {tier === "hearts" && <HeartsEffect runKey={runKey} />}
      {tier === "confetti" && <ConfettiEffect runKey={runKey} />}
      {tier === "gold" && <GoldBurstEffect runKey={runKey} />}
    </div>
  );
}

function HeartsEffect({ runKey }: { runKey: number }) {
  const hearts = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: rand(10, 90),
      size: rand(14, 24),
      delay: rand(0, 0.4),
      duration: rand(2, 3),
    }));
  }, [runKey]);

  return (
    <>
      {hearts.map((h) => (
        <motion.div
          key={`${runKey}-heart-${h.id}`}
          className="absolute text-primary"
          style={{ left: `${h.left}%`, top: -30 }}
          initial={{ y: 0, opacity: 0, scale: 0.5 }}
          animate={{ y: 450, opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.8] }}
          transition={{ duration: h.duration, delay: h.delay, ease: "easeOut" }}
        >
          <Heart className="fill-primary" style={{ width: h.size, height: h.size }} />
        </motion.div>
      ))}
    </>
  );
}

function ConfettiEffect({ runKey }: { runKey: number }) {
  const confetti = useMemo(() => {
    const colors = ["bg-primary", "bg-accent", "bg-secondary", "bg-pink-400", "bg-rose-300"];
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: rand(5, 95),
      size: rand(6, 12),
      delay: rand(0, 0.3),
      duration: rand(1.5, 2.5),
      rotate: rand(-200, 200),
      drift: rand(-30, 30),
      color: colors[i % colors.length],
    }));
  }, [runKey]);

  return (
    <>
      {confetti.map((c) => (
        <motion.span
          key={`${runKey}-conf-${c.id}`}
          className={`absolute rounded-sm ${c.color}`}
          style={{ left: `${c.left}%`, top: -20, width: c.size, height: c.size * 0.4 }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: 500,
            x: c.drift,
            rotate: c.rotate,
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: c.duration, delay: c.delay, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

function GoldBurstEffect({ runKey }: { runKey: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const angle = (i / 50) * Math.PI * 2;
      const distance = rand(100, 200);
      return {
        id: i,
        endX: Math.cos(angle) * distance,
        endY: Math.sin(angle) * distance,
        size: rand(8, 16),
        delay: rand(0, 0.15),
        duration: rand(0.8, 1.4),
        isHeart: i % 4 === 0,
      };
    });
  }, [runKey]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Center glow */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-accent/30 blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 2.5], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.2 }}
      />

      {/* Burst particles */}
      {particles.map((p) => (
        <motion.div
          key={`${runKey}-gold-${p.id}`}
          className={p.isHeart ? "text-accent" : "bg-accent rounded-full"}
          style={p.isHeart ? {} : { width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{
            x: p.endX,
            y: p.endY,
            scale: [0, 1.2, 0.8],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
        >
          {p.isHeart && <Heart className="w-5 h-5 fill-accent" />}
        </motion.div>
      ))}

      {/* Trophy flash */}
      <motion.div
        className="absolute text-6xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.5, delay: 0.2 }}
      >
        🏆
      </motion.div>
    </div>
  );
}
