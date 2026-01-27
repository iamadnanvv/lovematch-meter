import { motion } from 'framer-motion';
import { Shield, Heart, Lock } from 'lucide-react';
import logoImage from '@/assets/love-triangle-logo.png';

interface LockScreenProps {
  onClose?: () => void;
}

export function LockScreen({ onClose }: LockScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-primary"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="love-card p-8 md:p-12 max-w-md w-full text-center relative z-10"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Shield Icon */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        {/* Logo */}
        <motion.img
          src={logoImage}
          alt="Love Triangle"
          className="w-16 h-16 mx-auto mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />

        {/* Title */}
        <motion.h1
          className="font-display text-2xl font-bold text-foreground mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Protected Experience
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Developer tools have been detected. To preserve the integrity of your 
          Love Triangle experience, please close developer tools to continue.
        </motion.p>

        {/* Lock indicator */}
        <motion.div
          className="flex items-center justify-center gap-2 text-sm text-primary mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Lock className="w-4 h-4 animate-pulse" />
          <span>Session temporarily locked</span>
        </motion.div>

        {/* Close button (only works if DevTools closed) */}
        {onClose && (
          <motion.button
            className="love-button-outline"
            onClick={onClose}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" />
              Continue Experience
            </span>
          </motion.button>
        )}

        {/* Footer */}
        <motion.p
          className="text-xs text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          This protection ensures a fair experience for all couples 💕
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
