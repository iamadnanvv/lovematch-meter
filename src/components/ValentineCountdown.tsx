import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Heart, AlertTriangle } from 'lucide-react';
import { useValentineScarcity } from '@/hooks/useValentineScarcity';

interface ValentineCountdownProps {
  variant?: 'badge' | 'banner' | 'minimal';
}

export function ValentineCountdown({ variant = 'badge' }: ValentineCountdownProps) {
  const { timeRemaining, isExpired, isUrgent, isCritical, formatCountdown } = useValentineScarcity();

  if (isExpired) return null;

  if (variant === 'minimal') {
    return (
      <motion.div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
          isCritical 
            ? 'bg-destructive/20 text-destructive' 
            : isUrgent 
              ? 'bg-amber-100 text-amber-700' 
              : 'bg-rose-light text-primary'
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Clock className="w-3 h-3" />
        <span>{formatCountdown()}</span>
      </motion.div>
    );
  }

  if (variant === 'banner') {
    return (
      <motion.div
        className={`w-full py-2 px-4 text-center text-sm font-medium ${
          isCritical 
            ? 'bg-destructive text-destructive-foreground' 
            : isUrgent 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
              : 'bg-gradient-to-r from-primary to-rose-dark text-primary-foreground'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-2">
          {isCritical ? (
            <AlertTriangle className="w-4 h-4 animate-pulse" />
          ) : (
            <Heart className="w-4 h-4" />
          )}
          <span>
            {isCritical 
              ? `⚡ FINAL HOURS! Results disappear in ${formatCountdown()}` 
              : isUrgent 
                ? `🔥 Only ${formatCountdown()} left until Valentine's!` 
                : `💕 Valentine special ends in ${formatCountdown()}`
            }
          </span>
        </div>
      </motion.div>
    );
  }

  // Badge variant (default)
  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg ${
        isCritical 
          ? 'bg-destructive text-destructive-foreground animate-pulse' 
          : isUrgent 
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
            : 'bg-gradient-to-r from-primary to-rose-dark text-primary-foreground'
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <Clock className="w-4 h-4" />
      <div className="flex flex-col items-start">
        <span className="text-xs opacity-80">
          {isCritical ? 'FINAL HOURS' : isUrgent ? 'HURRY!' : 'Ends on Valentine\'s'}
        </span>
        <span className="font-bold tabular-nums">{formatCountdown()}</span>
      </div>
    </motion.div>
  );
}
