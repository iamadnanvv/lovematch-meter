import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, User } from 'lucide-react';

interface PlayerSetupProps {
  onComplete: (player1: string, player2: string) => void;
  onBack: () => void;
}

export function PlayerSetup({ onComplete, onBack }: PlayerSetupProps) {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1.trim() && player2.trim()) {
      onComplete(player1.trim(), player2.trim());
    }
  };

  const isValid = player1.trim().length > 0 && player2.trim().length > 0;

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <motion.div 
        className="love-card p-8 md:p-10 max-w-md w-full"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-center mb-8">
          <motion.div 
            className="w-16 h-16 rounded-full bg-rose-light mx-auto mb-4 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </motion.div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Who's Playing?
          </h2>
          <p className="text-muted-foreground">
            Enter both your names to begin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Partner 1
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                placeholder="Enter name..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border bg-background/50 focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                maxLength={20}
              />
            </div>
          </motion.div>

          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Heart className="w-6 h-6 text-primary fill-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Partner 2
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                placeholder="Enter name..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border bg-background/50 focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                maxLength={20}
              />
            </div>
          </motion.div>

          <motion.div
            className="pt-4 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              type="submit"
              className={`love-button w-full ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isValid}
              whileHover={isValid ? { scale: 1.02 } : {}}
              whileTap={isValid ? { scale: 0.98 } : {}}
            >
              <span className="flex items-center justify-center gap-2">
                Continue
                <ArrowRight className="w-5 h-5" />
              </span>
            </motion.button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              Go Back
            </button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
