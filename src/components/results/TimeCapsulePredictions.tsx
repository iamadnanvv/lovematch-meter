import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { ShareButton } from './ShareButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TimeCapsulePredictionsProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

const PREDICTIONS_BY_YEAR = {
  '1 Year': [
    "You'll develop a secret language of meaningful eyebrow raises",
    "One of you will become obsessed with a niche hobby. The other will pretend to understand.",
    "You'll have your first 'we're turning into our parents' moment",
    "You'll finish each other's sentences. And pizza.",
    "One of you will convince the other that a questionable furniture purchase was a good idea",
  ],
  '5 Years': [
    "One of you will become obsessed with houseplants. The other will name them all.",
    "You'll develop strong opinions about dishwasher loading techniques",
    "You'll have 'your spot' on the couch. It's sacred. No one else can sit there.",
    "You'll have an inside joke that makes zero sense to anyone else",
    "One of you will become the designated bug remover. For life.",
  ],
  '10 Years': [
    "You'll tell the same 3 stories at every party. Neither will admit they're sick of hearing them.",
    "You'll have perfected the art of communicating with just looks",
    "One of you will say 'we have food at home' unironically",
    "You'll have strong joint opinions about proper thermostat settings",
    "You'll start sentences with 'Remember when we used to...' way too often",
  ],
  '25 Years': [
    "You'll still argue about that one thing from year 2. You know the one.",
    "Your kids/pets will wonder how you two even found each other",
    "You'll have matching comfortable sweaters. And you'll love them.",
    "One of you will still be trying to teach the other to parallel park",
    "You'll have a favorite restaurant where the staff knows your order",
  ],
  '50 Years': [
    "Still arguing about that one restaurant incident from 2024",
    "Your love story will be the stuff of family legend",
    "You'll still hold hands. And still steal each other's fries.",
    "One of you will still hog the blankets. The other will have adapted.",
    "You'll have proved everyone wrong about 'young love'",
  ],
};

const YEAR_EMOJIS: Record<string, string> = {
  '1 Year': '🌱',
  '5 Years': '🌳',
  '10 Years': '🏠',
  '25 Years': '🎊',
  '50 Years': '💎',
};

export function TimeCapsulePredictions({ player1Name, player2Name, score }: TimeCapsulePredictionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeYear, setActiveYear] = useState<string | null>(null);

  const getPrediction = (year: string) => {
    const predictions = PREDICTIONS_BY_YEAR[year as keyof typeof PREDICTIONS_BY_YEAR];
    // Use score to semi-deterministically select prediction
    const index = (score + year.length) % predictions.length;
    return predictions[index];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="love-button-outline w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5" />
            ⏰ Time Capsule Predictions
          </span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-rose-light border-primary/20 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl text-gradient-love">
            ⏰ Your Future Together
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-center text-muted-foreground text-sm">
            Tap each year to reveal your destiny, {player1Name} & {player2Name}!
          </p>

          {/* Timeline */}
          <div className="space-y-3">
            {Object.keys(PREDICTIONS_BY_YEAR).map((year, index) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    activeYear === year
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted/50 border-border hover:border-primary/50'
                  }`}
                  onClick={() => setActiveYear(activeYear === year ? null : year)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{YEAR_EMOJIS[year]}</span>
                      <span className="font-bold text-foreground">{year}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: activeYear === year ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </div>
                  
                  {/* Prediction */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: activeYear === year ? 'auto' : 0,
                      opacity: activeYear === year ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                      {getPrediction(year)}
                    </p>
                  </motion.div>
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-xl bg-gold-light text-center"
          >
            <p className="text-sm font-medium text-foreground">
              💕 {score >= 80 
                ? "Your future looks incredibly bright together!" 
                : score >= 50 
                  ? "Adventure awaits you two!" 
                  : "Every great love story has its challenges!"
              }
            </p>
          </motion.div>

          <p className="text-xs text-center text-muted-foreground/60 italic">
            *Predictions generated by highly advanced relationship algorithms (aka random guessing)*
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
