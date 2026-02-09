import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartCrack, Heart, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BreakupSimulatorProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

const BREAKUP_SCENARIOS = [
  {
    cause: "who gets custody of the Netflix password",
    dramatic: "The account will be changed. Trust will be broken. Someone's watchlist will be DELETED.",
  },
  {
    cause: "discovering they pronounce 'GIF' wrong",
    dramatic: "It's 'GIF' not 'JIF'! No, wait... actually... THE DEBATE DESTROYED THEM.",
  },
  {
    cause: "whether to fold or scrunch toilet paper",
    dramatic: "Some differences are too fundamental. This is one of them.",
  },
  {
    cause: "who ate the last slice of pizza",
    dramatic: "It was supposed to be shared. IT. WAS. SUPPOSED. TO. BE. SHARED.",
  },
  {
    cause: "disagreeing on the correct thermostat temperature",
    dramatic: "One wanted 68°F. One wanted 72°F. Neither was willing to compromise. The AC unit filed for divorce.",
  },
  {
    cause: "leaving the toilet seat up (or down)",
    dramatic: "3 AM bathroom trips became too dangerous. Love couldn't survive the splash.",
  },
  {
    cause: "someone spoiling the ending of a TV show",
    dramatic: "They said 'spoiler alert' AFTER the spoiler. The betrayal was absolute.",
  },
  {
    cause: "whether to put pineapple on pizza",
    dramatic: "The culinary schism was unbridgeable. Hawaiian pizza became a forbidden topic.",
  },
  {
    cause: "taking too long to choose a restaurant",
    dramatic: "'I don't care, you pick.' 'No, YOU pick.' They starved. Metaphorically.",
  },
  {
    cause: "someone always being late",
    dramatic: "They were 5 minutes late to their own breakup. Classic.",
  },
  {
    cause: "hogging the phone charger",
    dramatic: "1% battery. No charger in sight. Love died at 0%.",
  },
  {
    cause: "blanket-stealing during winter",
    dramatic: "The great blanket heist of 2024. One got cold. The other got... colder.",
  },
];

export function BreakupSimulator({ player1Name, player2Name, score }: BreakupSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showReassurance, setShowReassurance] = useState(false);
  const [key, setKey] = useState(0);

  const scenario = useMemo(() => {
    return BREAKUP_SCENARIOS[Math.floor(Math.random() * BREAKUP_SCENARIOS.length)];
  }, [key]);

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setShowReassurance(false);
    }
  };

  const handleRefresh = () => {
    setKey(prev => prev + 1);
    setShowReassurance(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="love-button-outline w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <HeartCrack className="w-5 h-5" />
            💔 Dramatic Breakup Simulator
          </span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-rose-light border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl text-gradient-love">
            💔 Dramatic Breakup Simulator
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <AnimatePresence mode="wait">
            {!showReassurance ? (
              <motion.div
                key={`scenario-${key}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 text-center"
              >
                {/* Broken Heart Animation */}
                <motion.div
                  className="flex justify-center items-center gap-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.span
                    className="text-4xl"
                    animate={{ x: [-5, 0], rotate: [-10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    💔
                  </motion.span>
                </motion.div>

                {/* Scenario */}
                <motion.div
                  className="p-5 rounded-xl bg-destructive/10 border border-destructive/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-lg font-medium text-foreground mb-3">
                    <span className="font-bold">{player1Name}</span> & <span className="font-bold">{player2Name}</span> will dramatically break up over...
                  </p>
                  <p className="text-xl font-bold text-destructive">
                    "{scenario.cause}"
                  </p>
                </motion.div>

                {/* Dramatic Description */}
                <motion.p
                  className="text-sm text-muted-foreground italic px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  "{scenario.dramatic}"
                </motion.p>

                {/* CTA */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button
                    className="love-button w-full"
                    onClick={() => setShowReassurance(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5" />
                      Wait... Really?! 😰
                    </span>
                  </motion.button>
                  
                  <motion.button
                    className="love-button-outline w-full"
                    onClick={handleRefresh}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      See Another Scenario
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="reassurance"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                {/* Happy Heart */}
                <motion.div
                  className="text-6xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ duration: 0.6, repeat: 2 }}
                >
                  💕
                </motion.div>

                {/* Reassurance */}
                <motion.div
                  className="p-5 rounded-xl bg-primary/10 border border-primary/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-xl font-bold text-primary mb-2">
                    Just kidding! 🎉
                  </p>
                  <p className="text-foreground">
                    <span className="font-bold">{player1Name}</span> & <span className="font-bold">{player2Name}</span> are perfect for each other!
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your {score}% compatibility proves it 💕
                  </p>
                </motion.div>

                {/* Back Button */}
                <motion.button
                  className="love-button-outline px-6 py-2"
                  onClick={handleRefresh}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  😈 Scare Us Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
