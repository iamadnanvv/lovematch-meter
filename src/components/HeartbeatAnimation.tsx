import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartbeatAnimationProps {
  intensity?: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg';
}

export function HeartbeatAnimation({ intensity = 'medium', size = 'md' }: HeartbeatAnimationProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const animationSpeed = {
    low: 1.5,
    medium: 1.0,
    high: 0.6
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow rings */}
      <motion.div
        className="absolute rounded-full bg-primary/20"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: animationSpeed[intensity] * 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: size === 'lg' ? 120 : size === 'md' ? 80 : 48,
          height: size === 'lg' ? 120 : size === 'md' ? 80 : 48
        }}
      />
      
      <motion.div
        className="absolute rounded-full bg-primary/30"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 0, 0.7]
        }}
        transition={{
          duration: animationSpeed[intensity] * 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.1
        }}
        style={{
          width: size === 'lg' ? 96 : size === 'md' ? 64 : 36,
          height: size === 'lg' ? 96 : size === 'md' ? 64 : 36
        }}
      />
      
      {/* Main heart */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1, 1.1, 1],
        }}
        transition={{
          duration: animationSpeed[intensity],
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Heart 
          className={`${sizeClasses[size]} text-primary fill-primary drop-shadow-xl`}
        />
      </motion.div>
    </div>
  );
}
