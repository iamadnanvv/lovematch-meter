import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Heart, Lock, AlertTriangle, Sparkles } from 'lucide-react';

interface ValentineScarcityProps {
  children: React.ReactNode;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Valentine's deadline: February 15, 2025 at midnight
const VALENTINE_DEADLINE = new Date('2025-02-15T23:59:59').getTime();

function calculateTimeLeft(): TimeLeft | null {
  const now = new Date().getTime();
  const difference = VALENTINE_DEADLINE - now;

  if (difference <= 0) {
    return null; // Expired
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}

export function ValentineCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // Set urgent when less than 24 hours
      if (newTimeLeft && newTimeLeft.days === 0) {
        setIsUrgent(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return null;
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center ${
        isUrgent 
          ? 'bg-gradient-to-r from-red-600 to-rose-600' 
          : 'bg-gradient-to-r from-primary to-rose-dark'
      }`}
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-white">
        {isUrgent ? (
          <AlertTriangle className="w-4 h-4 animate-pulse" />
        ) : (
          <Heart className="w-4 h-4" />
        )}
        
        <span className="text-sm font-medium hidden sm:inline">
          {isUrgent ? '⚡ LAST CHANCE!' : '💕 Valentine Special'} — Results expire in:
        </span>
        <span className="text-sm font-medium sm:hidden">
          Expires:
        </span>
        
        <div className="flex items-center gap-1 font-mono font-bold">
          <span className="bg-white/20 px-2 py-0.5 rounded">{formatNumber(timeLeft.days)}d</span>
          <span>:</span>
          <span className="bg-white/20 px-2 py-0.5 rounded">{formatNumber(timeLeft.hours)}h</span>
          <span>:</span>
          <span className="bg-white/20 px-2 py-0.5 rounded">{formatNumber(timeLeft.minutes)}m</span>
          <span className="hidden sm:inline">:</span>
          <span className="bg-white/20 px-2 py-0.5 rounded hidden sm:inline">{formatNumber(timeLeft.seconds)}s</span>
        </div>

        {isUrgent && (
          <Sparkles className="w-4 h-4 animate-pulse" />
        )}
      </div>
    </motion.div>
  );
}

export function ValentineLockScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-background via-rose-light to-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center p-8 max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-rose-light flex items-center justify-center mb-4">
            <Lock className="w-12 h-12 text-primary" />
          </div>
        </motion.div>

        <motion.h1
          className="font-display text-3xl font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Valentine's Has Ended 💔
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          The Love Triangle Valentine Special has concluded. This exclusive experience was only available until February 15, 2025.
        </motion.p>

        <motion.div
          className="p-4 rounded-xl bg-secondary/50 border border-border mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground">
            <Heart className="w-4 h-4 inline mr-2 text-primary" />
            Thank you for being part of our Valentine celebration. Follow us for future experiences!
          </p>
        </motion.div>

        <motion.a
          href="https://instagram.com/mr._.developer"
          target="_blank"
          rel="noopener noreferrer"
          className="love-button inline-flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-5 h-5" />
          Follow for Next Experience
        </motion.a>
      </div>
    </motion.div>
  );
}

export function ValentineScarcity({ children }: ValentineScarcityProps) {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Check if expired
    const checkExpiry = () => {
      const now = new Date().getTime();
      if (now > VALENTINE_DEADLINE) {
        setIsExpired(true);
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isExpired) {
    return <ValentineLockScreen />;
  }

  return (
    <>
      <ValentineCountdown />
      <div className="pt-10">
        {children}
      </div>
    </>
  );
}

// Emotional donation pressure component for results screen
export function EmotionalDonationNudge({ 
  player1Name, 
  player2Name, 
  score,
  onDonate 
}: { 
  player1Name: string; 
  player2Name: string; 
  score: number;
  onDonate: () => void;
}) {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed || !timeLeft) return null;

  const isUrgent = timeLeft.days === 0;

  return (
    <motion.div
      className={`p-4 rounded-xl border ${
        isUrgent 
          ? 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-500/30' 
          : 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${isUrgent ? 'bg-red-500/20' : 'bg-primary/20'}`}>
          {isUrgent ? (
            <Clock className="w-5 h-5 text-red-500" />
          ) : (
            <Heart className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {isUrgent 
              ? `⏰ Only ${timeLeft.hours}h ${timeLeft.minutes}m left!` 
              : `💕 ${player1Name} & ${player2Name}, this moment matters`
            }
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {score >= 70 
              ? "You've found something special. Help us create more connections like yours."
              : "Every relationship deserves to grow. Support Love Triangle and invest in your journey."
            }
          </p>
          <div className="flex gap-2 mt-3">
            <motion.button
              className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-medium"
              onClick={onDonate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Support with ₹49
            </motion.button>
            <button
              className="text-xs px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setDismissed(true)}
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
