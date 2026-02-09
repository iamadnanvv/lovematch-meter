import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface JealousyOMeterProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

const CELEBRITIES = [
  { name: "Ryan Gosling", emoji: "🎬" },
  { name: "Beyoncé", emoji: "👑" },
  { name: "Timothée Chalamet", emoji: "🎭" },
  { name: "Zendaya", emoji: "✨" },
  { name: "Chris Hemsworth", emoji: "⚡" },
  { name: "Taylor Swift", emoji: "🎤" },
  { name: "Keanu Reeves", emoji: "🔫" },
  { name: "Margot Robbie", emoji: "💋" },
  { name: "Harry Styles", emoji: "🎸" },
  { name: "Scarlett Johansson", emoji: "🕷️" },
  { name: "Leonardo DiCaprio", emoji: "🚢" },
  { name: "Emma Watson", emoji: "⚡" },
  { name: "Jason Momoa", emoji: "🔱" },
  { name: "Anne Hathaway", emoji: "🎀" },
];

export function JealousyOMeter({ player1Name, player2Name, score }: JealousyOMeterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(0);

  const results = useMemo(() => {
    const celeb = CELEBRITIES[Math.floor(Math.random() * CELEBRITIES.length)];
    // Partner always scores higher (sparking playful jealousy)
    const partnerScore = 65 + Math.floor(Math.random() * 30); // 65-95%
    const userScore = 15 + Math.floor(Math.random() * 35); // 15-50%
    
    return {
      celebrity: celeb,
      player1Score: userScore,
      player2Score: partnerScore,
    };
  }, [key]);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
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
            <Star className="w-5 h-5" />
            😏 Jealousy-O-Meter
          </span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-rose-light border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl text-gradient-love">
            😏 Jealousy-O-Meter
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <motion.p 
            className="text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Celebrity Compatibility Check...
          </motion.p>

          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Celebrity */}
              <motion.div 
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                <span className="text-5xl">{results.celebrity.emoji}</span>
                <p className="text-xl font-bold text-foreground mt-2">
                  {results.celebrity.name}
                </p>
              </motion.div>

              {/* Scores */}
              <div className="space-y-4">
                {/* Player 1 - Lower score */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{player1Name}</span>
                    <span className="text-destructive font-bold">{results.player1Score}%</span>
                  </div>
                  <Progress value={results.player1Score} className="h-3" />
                </motion.div>

                {/* Player 2 - Higher score */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{player2Name}</span>
                    <span className="text-primary font-bold">{results.player2Score}%</span>
                  </div>
                  <Progress value={results.player2Score} className="h-3 [&>div]:bg-primary" />
                </motion.div>
              </div>

              {/* Playful Warning */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="p-4 rounded-xl bg-gold-light border border-accent/30 text-center"
              >
                <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium text-foreground">
                  😱 {player2Name} is <span className="text-primary font-bold">{results.player2Score - results.player1Score}%</span> more compatible with {results.celebrity.name}!
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Better step up your game, {player1Name}! 😤
                </p>
              </motion.div>

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs text-center text-muted-foreground/70 italic"
              >
                * Results are 100% scientifically made up for laughs 💕
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Refresh Button */}
          <motion.button
            className="love-button-outline w-full"
            onClick={handleRefresh}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Another Celebrity
            </span>
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
