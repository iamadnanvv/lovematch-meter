import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Heart, Star, Crown, Gem } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SurpriseGiftProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

type GiftType = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  badge: string;
};

function getGift(score: number): GiftType {
  if (score === 100) {
    return {
      icon: <Crown className="w-16 h-16 text-yellow-500" />,
      title: "Perfect Match Crown 👑",
      description: "You've achieved the rarest gift! A perfect score means your hearts beat in complete harmony. You are officially Love Triangle royalty!",
      color: "from-yellow-400/20 to-amber-500/20",
      badge: "Legendary",
    };
  }
  if (score >= 90) {
    return {
      icon: <Gem className="w-16 h-16 text-purple-500" />,
      title: "Diamond Hearts 💎",
      description: "Your connection is as rare and precious as a diamond. You've unlocked the Diamond Hearts badge—a symbol of unbreakable love!",
      color: "from-purple-400/20 to-pink-500/20",
      badge: "Epic",
    };
  }
  if (score >= 80) {
    return {
      icon: <Star className="w-16 h-16 text-accent" />,
      title: "Golden Star ⭐",
      description: "You shine bright together! The Golden Star recognizes couples whose compatibility lights up any room.",
      color: "from-amber-400/20 to-yellow-500/20",
      badge: "Rare",
    };
  }
  if (score >= 60) {
    return {
      icon: <Heart className="w-16 h-16 text-primary fill-primary" />,
      title: "Love Heart ❤️",
      description: "Your love is growing stronger! The Love Heart badge celebrates your beautiful connection and potential.",
      color: "from-rose-400/20 to-pink-500/20",
      badge: "Special",
    };
  }
  return {
    icon: <Sparkles className="w-16 h-16 text-blue-400" />,
    title: "Spark of Adventure ✨",
    description: "Every great love story starts somewhere! Your Spark of Adventure badge marks the beginning of discovering each other.",
    color: "from-blue-400/20 to-cyan-500/20",
    badge: "Unique",
  };
}

export function SurpriseGift({ player1Name, player2Name, score }: SurpriseGiftProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const gift = getGift(score);

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsRevealed(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="gold-button w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" />
            Open Your Surprise Gift
          </span>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-w-sm overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-display text-center">
            🎁 Surprise Gift for {player1Name} & {player2Name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="gift-box"
                className="cursor-pointer"
                onClick={() => setIsRevealed(true)}
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
              >
                <div className="relative">
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-xl"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Gift className="w-16 h-16 text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-1 rounded-full font-medium"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Tap to open!
                  </motion.div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Tap the gift to reveal your surprise!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                className="text-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <motion.div
                  className={`w-36 h-36 rounded-full bg-gradient-to-br ${gift.color} flex items-center justify-center mx-auto mb-4 border-2 border-white/30`}
                  initial={{ rotate: -180 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  {gift.icon}
                </motion.div>

                <motion.span
                  className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-accent/20 text-accent rounded-full mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {gift.badge}
                </motion.span>

                <motion.h3
                  className="font-display text-xl font-bold text-foreground mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {gift.title}
                </motion.h3>

                <motion.p
                  className="text-sm text-muted-foreground leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {gift.description}
                </motion.p>

                <motion.div
                  className="mt-4 text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Share your badge on Instagram! 📸
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
