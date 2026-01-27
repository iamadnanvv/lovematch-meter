import { motion } from 'framer-motion';
import { Heart, Sparkles, Users, Clock, Shield } from 'lucide-react';
import logoImage from '@/assets/love-triangle-logo.png';
import { ValentineCountdown } from './ValentineCountdown';
import { useValentineScarcity } from '@/hooks/useValentineScarcity';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { isUrgent, isCritical } = useValentineScarcity();

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="love-card p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Urgency banner */}
        {(isUrgent || isCritical) && (
          <motion.div
            className={`absolute top-0 left-0 right-0 py-2 text-center text-sm font-medium ${
              isCritical ? 'bg-destructive text-destructive-foreground' : 'bg-amber-500 text-white'
            }`}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
          >
            {isCritical ? '⚡ FINAL HOURS!' : '🔥 Limited Time!'}
          </motion.div>
        )}

        {/* Logo */}
        <motion.div 
          className={`mb-6 float ${isUrgent || isCritical ? 'mt-8' : ''}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <img 
            src={logoImage} 
            alt="Love Triangle" 
            className="w-32 h-32 mx-auto drop-shadow-xl"
          />
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="font-display text-4xl md:text-5xl font-bold text-gradient-love mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Love Triangle
        </motion.h1>

        <motion.p 
          className="text-muted-foreground text-lg mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Test your love compatibility
        </motion.p>

        {/* Valentine Countdown */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
        >
          <ValentineCountdown variant="badge" />
        </motion.div>

        {/* Features */}
        <motion.div 
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">4 Modes</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gold-light flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <span className="text-xs text-muted-foreground">For Couples</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Exclusive</span>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.button
          className="love-button w-full text-lg"
          onClick={onStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5" />
            Start the Experience
          </span>
        </motion.button>

        <motion.p 
          className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Shield className="w-3 h-3" />
          Private & intimate experience for couples only
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
