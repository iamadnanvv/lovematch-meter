import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, RotateCcw, Trophy } from 'lucide-react';
import { ShareButton } from './ShareButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface WhosMoreLikelyToProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

const SCENARIOS = [
  "apologize first after a fight",
  "get lost despite having GPS",
  "finish the other's food",
  "fall asleep during movie night",
  "forget an important date",
  "say 'I love you' more often",
  "start a random dance party",
  "cry during a sad movie",
  "hog all the blankets",
  "plan a surprise date",
  "win an argument",
  "burn dinner while cooking",
  "send cute good morning texts",
  "steal the last slice of pizza",
  "make the first move",
  "remember the little things",
  "get obsessed with a new hobby",
  "talk to pets like they're people",
  "sing in the shower",
  "be the big spoon",
];

export function WhosMoreLikelyTo({ player1Name, player2Name, score }: WhosMoreLikelyToProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [player1Votes, setPlayer1Votes] = useState(0);
  const [player2Votes, setPlayer2Votes] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentVote, setCurrentVote] = useState<1 | 2 | null>(null);

  const shuffledScenarios = useMemo(() => {
    return [...SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [isOpen]);

  const currentScenario = shuffledScenarios[currentIndex];
  const isComplete = currentIndex >= shuffledScenarios.length;

  const handleVote = (player: 1 | 2) => {
    setCurrentVote(player);
    setShowResult(true);
    
    if (player === 1) {
      setPlayer1Votes(prev => prev + 1);
    } else {
      setPlayer2Votes(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setCurrentVote(null);
    setCurrentIndex(prev => prev + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setPlayer1Votes(0);
    setPlayer2Votes(0);
    setShowResult(false);
    setCurrentVote(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(handleReset, 300);
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
            <Users className="w-5 h-5" />
            🎯 Who's More Likely To...
          </span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-rose-light border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl text-gradient-love">
            🎯 Who's More Likely To...
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                {/* Progress */}
                <div className="flex justify-center gap-2">
                  {shuffledScenarios.map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-1.5 rounded-full ${
                        i < currentIndex
                          ? 'bg-primary'
                          : i === currentIndex
                            ? 'bg-primary/50'
                            : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {/* Scenario */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Round {currentIndex + 1} of {shuffledScenarios.length}
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    Who's more likely to...
                  </p>
                  <p className="text-lg text-primary mt-2">
                    {currentScenario}?
                  </p>
                </div>

                {/* Voting Buttons or Result */}
                {!showResult ? (
                  <div className="flex gap-3">
                    <motion.button
                      className="love-button flex-1 py-6"
                      onClick={() => handleVote(1)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg">{player1Name}</span>
                    </motion.button>
                    
                    <motion.button
                      className="gold-button flex-1 py-6"
                      onClick={() => handleVote(2)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg">{player2Name}</span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <motion.div
                      className="p-4 rounded-xl bg-primary/10 border border-primary/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <p className="text-2xl mb-2">
                        {currentVote === 1 ? '👆' : '👇'}
                      </p>
                      <p className="font-bold text-primary text-lg">
                        {currentVote === 1 ? player1Name : player2Name}!
                      </p>
                    </motion.div>
                    
                    <motion.button
                      className="love-button w-full"
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {currentIndex < shuffledScenarios.length - 1 ? 'Next Question →' : 'See Results 🎉'}
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <Trophy className="w-16 h-16 mx-auto text-accent" />
                
                <h3 className="text-2xl font-bold text-foreground">
                  Game Complete! 🎉
                </h3>

                {/* Scores */}
                <div className="flex gap-4">
                  <div className={`flex-1 p-4 rounded-xl ${
                    player1Votes >= player2Votes ? 'bg-primary/20 border-2 border-primary' : 'bg-muted'
                  }`}>
                    <p className="font-bold text-foreground">{player1Name}</p>
                    <p className="text-3xl font-bold text-primary">{player1Votes}</p>
                    <p className="text-xs text-muted-foreground">votes</p>
                  </div>
                  
                  <div className={`flex-1 p-4 rounded-xl ${
                    player2Votes > player1Votes ? 'bg-accent/20 border-2 border-accent' : 'bg-muted'
                  }`}>
                    <p className="font-bold text-foreground">{player2Name}</p>
                    <p className="text-3xl font-bold text-accent">{player2Votes}</p>
                    <p className="text-xs text-muted-foreground">votes</p>
                  </div>
                </div>

                {/* Verdict */}
                <p className="text-muted-foreground">
                  {player1Votes === player2Votes
                    ? "It's a tie! You're equally likely to do all the things! 🤝"
                    : player1Votes > player2Votes
                      ? `${player1Name} is more likely to do... everything! 😅`
                      : `${player2Name} takes the crown for most likely! 👑`
                  }
                </p>

                <motion.button
                  className="love-button-outline w-full"
                  onClick={handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
