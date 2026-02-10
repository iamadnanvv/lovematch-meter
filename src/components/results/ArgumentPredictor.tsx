import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Swords, Shield, RefreshCw } from 'lucide-react';
import { ShareButton } from './ShareButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ArgumentPredictorProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

const ARGUMENT_PREDICTIONS = [
  {
    topic: "thermostat settings",
    prediction: "You WILL fight about thermostat settings within 6 months",
    tip: "Pro tip: Buy separate blankets. It's cheaper than therapy.",
    emoji: "🌡️",
  },
  {
    topic: "what to watch on TV",
    prediction: "Your different entertainment preferences predict 3.2 passive-aggressive sighs per streaming session",
    tip: "Solution: Create a 'compromise wheel' and spin it. Blame the wheel, not each other.",
    emoji: "📺",
  },
  {
    topic: "loading the dishwasher",
    prediction: "A major dishwasher-loading methodology conflict is brewing",
    tip: "There's no right way. There's only your way and the wrong way. Accept this.",
    emoji: "🍽️",
  },
  {
    topic: "directions while driving",
    prediction: "GPS vs. 'I know a shortcut' debates will increase by 47% this year",
    tip: "The GPS is always right. Even when it's wrong. Trust the robot.",
    emoji: "🗺️",
  },
  {
    topic: "how to properly fold laundry",
    prediction: "Laundry folding techniques will be questioned approximately 8 times per month",
    tip: "Marie Kondo can't help you here. Just... fold and don't look back.",
    emoji: "👕",
  },
  {
    topic: "spending habits",
    prediction: "'Do you really need that?' will be uttered 23 times in the next quarter",
    tip: "Create a 'no questions asked' fun money fund. Your sanity depends on it.",
    emoji: "💸",
  },
  {
    topic: "social plans and alone time",
    prediction: "The classic 'introvert vs. extrovert' clash is imminent",
    tip: "Schedule 'recharge time' like meetings. Respect the calendar!",
    emoji: "🏠",
  },
  {
    topic: "sleep schedules",
    prediction: "Night owl vs. early bird friction detected with 89% certainty",
    tip: "Invest in a good eye mask. And patience. Lots of patience.",
    emoji: "😴",
  },
];

export function ArgumentPredictor({ player1Name, player2Name, score }: ArgumentPredictorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(0);

  const predictions = useMemo(() => {
    const numPredictions = score >= 80 ? 2 : score >= 50 ? 3 : 4;
    return [...ARGUMENT_PREDICTIONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, numPredictions);
  }, [score, key]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="love-button-outline w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Swords className="w-5 h-5" />
            ⚔️ Romantic Argument Predictor
          </span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-rose-light border-primary/20 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl text-gradient-love">
            ⚔️ Argument Predictor
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-5">
          <p className="text-center text-muted-foreground text-sm">
            Based on your {score}% compatibility, here are your predicted battles:
          </p>

          {/* Predictions */}
          <motion.div
            key={key}
            className="space-y-4"
          >
            {predictions.map((pred, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="rounded-xl border border-border overflow-hidden"
              >
                {/* Header */}
                <div className="p-3 bg-destructive/10 flex items-center gap-3">
                  <span className="text-2xl">{pred.emoji}</span>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Topic of Conflict
                    </p>
                    <p className="font-bold text-foreground capitalize">
                      {pred.topic}
                    </p>
                  </div>
                </div>
                
                {/* Prediction */}
                <div className="p-3 bg-background">
                  <p className="text-sm text-foreground mb-3">
                    📢 {pred.prediction}
                  </p>
                  
                  {/* Survival Tip */}
                  <div className="p-2 rounded-lg bg-primary/10 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-primary">Survival Tip:</span> {pred.tip}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-xl bg-gold-light text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {score >= 80 ? (
                <>🏆 Only {predictions.length} predicted arguments? That's impressive!</>
              ) : score >= 50 ? (
                <>💪 {predictions.length} arguments to navigate. You've got this!</>
              ) : (
                <>😅 {predictions.length} battles ahead. Stock up on apology chocolates!</>
              )}
            </p>
          </motion.div>

          {/* Refresh */}
          <motion.button
            className="love-button-outline w-full"
            onClick={() => setKey(prev => prev + 1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Predict More Arguments
            </span>
          </motion.button>

          <p className="text-xs text-center text-muted-foreground/60 italic">
            Remember: The couple that argues together, stays together... mostly 💕
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
