import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';
import { ShareButton } from './ShareButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PetNameGeneratorProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

const PREFIXES = [
  'Snuggle', 'Cuddle', 'Sugar', 'Honey', 'Sweet', 'Fluffy', 'Lovey', 'Cutie',
  'Smoochie', 'Precious', 'Darling', 'Twinkle', 'Sparkle', 'Bubbly', 'Cozy',
  'Squishy', 'Fuzzy', 'Giggly', 'Cuddly', 'Snuggly', 'Lovely', 'Huggy',
];

const MIDDLES = [
  'Muffin', 'Bunny', 'Pumpkin', 'Cakes', 'Bear', 'Bug', 'Dumpling', 'Nugget',
  'Pie', 'Cookie', 'Biscuit', 'Waffle', 'Pancake', 'Cupcake', 'Brownie',
  'Pudding', 'Button', 'Peach', 'Plum', 'Cherry', 'Berry', 'Sprinkle',
];

const SUFFIXES = [
  'Supreme', 'Deluxe', 'Wonder', 'Fantastic', 'Extraordinaire', 'Spectacular',
  'Amazing', 'Magnificent', 'McSmoochface', 'Von Cuddleton', 'The Great',
  'Wafflebottom', 'Snugglepants', 'Buttercup', 'Sunshine', 'Moonbeam',
  'Stardust', 'Rainbow', 'Sparklepuff', 'Fluffernutter', 'Lovebug', 'Sweetcheeks',
];

const SILLY_ADDITIONS = [
  'III', 'Jr.', 'Esq.', 'PhD in Hugs', 'M.D. (Master of Devotion)',
  'CEO of Cuddles', 'Duke/Duchess of Snuggles', 'Lord/Lady of Love',
];

export function PetNameGenerator({ player1Name, player2Name, score }: PetNameGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [key, setKey] = useState(0);

  const petNames = useMemo(() => {
    const generateName = (level: number) => {
      const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
      const middle = MIDDLES[Math.floor(Math.random() * MIDDLES.length)];
      const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
      const silly = SILLY_ADDITIONS[Math.floor(Math.random() * SILLY_ADDITIONS.length)];

      if (level === 1) return `${prefix} ${middle}`;
      if (level === 2) return `${prefix} ${middle} ${suffix}`;
      if (level === 3) return `${prefix} ${middle} ${suffix} ${silly}`;
      return `The Most Honorable ${prefix} ${middle} ${suffix} ${silly}`;
    };

    return {
      player1: generateName(intensity),
      player2: generateName(intensity),
    };
  }, [intensity, key]);

  const handleEscalate = () => {
    if (intensity < 4) {
      setIntensity(prev => prev + 1);
      setKey(prev => prev + 1);
    } else {
      setIntensity(1);
      setKey(prev => prev + 1);
    }
  };

  const getIntensityLabel = () => {
    switch (intensity) {
      case 1: return { label: 'Sweet', emoji: '😊' };
      case 2: return { label: 'Extra', emoji: '🥰' };
      case 3: return { label: 'Maximum', emoji: '😍' };
      case 4: return { label: 'ABSURD', emoji: '🤯' };
      default: return { label: 'Sweet', emoji: '😊' };
    }
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
            <Heart className="w-5 h-5" />
            💝 Pet Name Generator
          </span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-rose-light border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl text-gradient-love">
            💝 Pet Name Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Intensity Level */}
          <motion.div 
            className="text-center"
            key={intensity}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <p className="text-sm text-muted-foreground mb-1">Ridiculousness Level:</p>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4].map((level) => (
                <motion.div
                  key={level}
                  className={`w-8 h-2 rounded-full ${
                    level <= intensity ? 'bg-primary' : 'bg-muted'
                  }`}
                  animate={level <= intensity ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
            <p className="text-lg font-bold text-primary">
              {getIntensityLabel().emoji} {getIntensityLabel().label}
            </p>
          </motion.div>

          {/* Pet Names */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${intensity}-${key}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Player 1's Pet Name for Player 2 */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                <p className="text-xs text-muted-foreground mb-1">
                  {player1Name} calls {player2Name}:
                </p>
                <p className="text-lg font-bold text-primary flex items-center gap-2 justify-center">
                  <Sparkles className="w-4 h-4" />
                  {petNames.player2}
                  <Sparkles className="w-4 h-4" />
                </p>
              </div>

              {/* Player 2's Pet Name for Player 1 */}
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                <p className="text-xs text-muted-foreground mb-1">
                  {player2Name} calls {player1Name}:
                </p>
                <p className="text-lg font-bold text-accent flex items-center gap-2 justify-center">
                  <Sparkles className="w-4 h-4" />
                  {petNames.player1}
                  <Sparkles className="w-4 h-4" />
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              className="love-button flex-1"
              onClick={handleEscalate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                {intensity < 4 ? '⬆️ Make it Sillier' : '🔄 Start Over'}
              </span>
            </motion.button>
            
            <motion.button
              className="love-button-outline flex-1"
              onClick={() => setKey(prev => prev + 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                New Names
              </span>
            </motion.button>
          </div>

          <p className="text-xs text-center text-muted-foreground italic">
            Warning: Using these names in public may cause extreme second-hand embarrassment 💕
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
