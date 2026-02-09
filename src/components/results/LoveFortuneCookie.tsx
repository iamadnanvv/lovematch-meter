import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface LoveFortuneCookieProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

const HIGH_SCORE_FORTUNES = [
  "Your love will survive 47 IKEA furniture assemblies together. That's basically a miracle.",
  "In 10 years, you'll finish each other's sentences. And snacks. Mostly snacks.",
  "The stars predict you'll develop a secret language of meaningful eyebrow raises.",
  "Your combined Netflix queue will achieve perfect harmony. This is rare.",
  "You will adopt a houseplant together. It will thrive. Unlike most.",
  "One day you'll share the last slice of pizza without arguing. True love.",
  "Your love story will become a legend at family gatherings for generations.",
];

const MEDIUM_SCORE_FORTUNES = [
  "In 3 months, you will argue about pizza toppings. The one who likes pineapple is right.",
  "Warning: One of you will steal all the blankets tonight. The other will seek revenge.",
  "You'll spend 47 hours this year deciding where to eat. Worth it.",
  "One of you will become the designated spider-remover. Choose wisely.",
  "Your thermostat wars will become legendary. May the coldest win.",
  "You'll develop a shared hatred for the same celebrities. Bonding!",
  "Someone will load the dishwasher wrong. Therapy may be needed.",
];

const LOW_SCORE_FORTUNES = [
  "Your relationship will be tested when you discover they pronounce 'GIF' wrong.",
  "Prepare for the great debate: toilet paper - over or under?",
  "One of you thinks pineapple belongs on pizza. This explains everything.",
  "You'll survive, but the battle over shower temperature will be eternal.",
  "Your different sleep schedules will create an elaborate pillow wall system.",
  "Movie night negotiations will require a formal treaty by year 2.",
  "The cereal-before-milk debate looms in your future. Brace yourselves.",
];

export function LoveFortuneCookie({ player1Name, player2Name, score }: LoveFortuneCookieProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCracked, setIsCracked] = useState(false);
  const [fortune, setFortune] = useState('');

  const getFortunes = () => {
    if (score >= 80) return HIGH_SCORE_FORTUNES;
    if (score >= 50) return MEDIUM_SCORE_FORTUNES;
    return LOW_SCORE_FORTUNES;
  };

  const handleCrack = () => {
    const fortunes = getFortunes();
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    setFortune(randomFortune);
    setIsCracked(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsCracked(false);
      setFortune('');
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? setIsOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <motion.button
          className="love-button-outline w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Cookie className="w-5 h-5" />
            🥠 Love Fortune Cookie
          </span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-rose-light border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl text-gradient-love">
            🥠 Love Fortune Cookie
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 text-center">
          <AnimatePresence mode="wait">
            {!isCracked ? (
              <motion.div
                key="cookie"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 20 }}
                className="space-y-6"
              >
                <motion.div
                  className="text-8xl mx-auto cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCrack}
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  🥠
                </motion.div>
                <p className="text-muted-foreground">
                  Tap the cookie to reveal your love fortune!
                </p>
                <p className="text-sm text-muted-foreground/70">
                  {player1Name} & {player2Name}'s destiny awaits...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="fortune"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <motion.div
                  className="flex justify-center gap-4 text-5xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.span
                    animate={{ rotate: -30, x: -10 }}
                    transition={{ delay: 0.1 }}
                  >
                    🥠
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    ✨
                  </motion.span>
                  <motion.span
                    animate={{ rotate: 30, x: 10 }}
                    transition={{ delay: 0.1 }}
                  >
                    🥠
                  </motion.span>
                </motion.div>

                <motion.div
                  className="p-6 rounded-xl bg-gold-light border border-accent/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Sparkles className="w-6 h-6 mx-auto mb-3 text-accent" />
                  <p className="text-lg font-medium text-foreground italic leading-relaxed">
                    "{fortune}"
                  </p>
                </motion.div>

                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Lucky numbers: {Math.floor(Math.random() * 50) + 1}, {Math.floor(Math.random() * 50) + 1}, {score}
                </motion.p>

                <motion.button
                  className="love-button-outline px-6 py-2"
                  onClick={() => {
                    setIsCracked(false);
                    setFortune('');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  🥠 Crack Another Cookie
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
