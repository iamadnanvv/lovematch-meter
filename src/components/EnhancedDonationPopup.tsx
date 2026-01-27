import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HeartHandshake, Sparkles, X, Gift, Crown, Star } from 'lucide-react';
import { useSupporters } from '@/hooks/useSupporters';

interface EnhancedDonationPopupProps {
  player1Name: string;
  player2Name: string;
  score: number;
  isOpen: boolean;
  onClose: () => void;
  onDonate: () => void;
  variant?: 'reveal' | 'download' | 'share';
}

const DONATION_MESSAGES = {
  reveal: {
    title: "Before You See Your Full Results...",
    subtitle: "This moment belongs to you two",
    message: "The truth about your connection is just one step away. Couples who support Love Triangle are saying: 'We believe in us.'",
    cta: "Unlock Full Results",
    skipText: "Show me anyway",
  },
  download: {
    title: "Your Love Story Deserves This",
    subtitle: "Create a keepsake of this moment",
    message: "You've discovered something beautiful about your relationship. Supporting Love Triangle helps other couples find their own magic.",
    cta: "Support & Download",
    skipText: "Maybe later",
  },
  share: {
    title: "Share Your Love Story",
    subtitle: "Let the world see your connection",
    message: "Before you share this special moment, consider supporting the experience that brought you closer together.",
    cta: "Support & Share",
    skipText: "Just share",
  },
};

export function EnhancedDonationPopup({
  player1Name,
  player2Name,
  score,
  isOpen,
  onClose,
  onDonate,
  variant = 'reveal',
}: EnhancedDonationPopupProps) {
  const { count, loading, recordSupporter } = useSupporters();
  const [showThankYou, setShowThankYou] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);

  const config = DONATION_MESSAGES[variant];

  const handleDonateClick = async () => {
    await recordSupporter();
    setShowThankYou(true);
    setTimeout(() => {
      window.open('https://razorpay.me/@adnan4402', '_blank', 'noopener,noreferrer');
      onDonate();
    }, 500);
  };

  const handleSkip = () => {
    setDismissCount(prev => prev + 1);
    if (dismissCount >= 1) {
      onClose();
    }
  };

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setShowThankYou(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="love-card p-6 md:p-8 max-w-md w-full relative overflow-hidden"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />

            {/* Close button (harder to see) */}
            <button
              onClick={handleSkip}
              className="absolute top-3 right-3 p-1.5 text-muted-foreground/30 hover:text-muted-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  {variant === 'reveal' ? (
                    <Crown className="w-10 h-10 text-white" />
                  ) : variant === 'download' ? (
                    <Gift className="w-10 h-10 text-white" />
                  ) : (
                    <Heart className="w-10 h-10 text-white fill-white" />
                  )}
                </div>
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Star className="w-6 h-6 text-accent fill-accent" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="font-display text-2xl font-bold text-center text-foreground mb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {config.title}
            </motion.h2>

            <motion.p
              className="text-center text-primary font-medium mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {config.subtitle}
            </motion.p>

            {/* Personalized message */}
            <motion.div
              className="bg-rose-light rounded-xl p-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-foreground">
                <span className="font-bold">{player1Name}</span> &{' '}
                <span className="font-bold">{player2Name}</span>,
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {config.message}
              </p>
            </motion.div>

            {/* Score highlight */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-3xl font-bold text-gradient-love">{score}%</span>
              <span className="text-muted-foreground ml-2">compatible</span>
            </motion.div>

            {/* Supporters count */}
            <motion.div
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>
                  <strong className="text-foreground">{count.toLocaleString()}</strong> couples
                  have invested in their love
                </span>
              )}
            </motion.div>

            {/* Thank you message */}
            <AnimatePresence>
              {showThankYou && (
                <motion.div
                  className="absolute inset-0 bg-background/95 flex items-center justify-center flex-col p-6 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <Heart className="w-16 h-16 text-primary fill-primary mb-4" />
                  </motion.div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    Thank You! 💕
                  </h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Your support keeps love alive for couples everywhere
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="space-y-3">
              <motion.button
                className="gold-button w-full"
                onClick={handleDonateClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <HeartHandshake className="w-5 h-5" />
                  {config.cta}
                </span>
              </motion.button>

              {/* Skip button (less prominent, requires 2 clicks) */}
              <motion.button
                className="w-full text-sm text-muted-foreground/70 hover:text-muted-foreground py-2"
                onClick={handleSkip}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {dismissCount === 0 ? config.skipText : 'Are you sure? Click again to skip'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
