import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EscapingNoButton } from '@/components/valentine/EscapingNoButton';
import { ValentineSuccess } from '@/components/valentine/ValentineSuccess';
import { FloatingHearts } from '@/components/FloatingHearts';

type ValentineState = 'asking' | 'success';

export default function ValentineProposal() {
  const [state, setState] = useState<ValentineState>('asking');
  const [yesScale, setYesScale] = useState(1);

  const handleYes = () => {
    setState('success');
  };

  const handleNoEscape = () => {
    // Make the Yes button grow slightly each time No escapes
    setYesScale(prev => Math.min(1.5, prev + 0.1));
  };

  const handlePlayAgain = () => {
    setState('asking');
    setYesScale(1);
  };

  return (
    <div className="min-h-screen bg-love relative overflow-hidden">
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        {state === 'asking' ? (
          <motion.div
            key="asking"
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main card */}
            <motion.div
              className="love-card p-8 md:p-12 max-w-lg w-full text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {/* Decorative hearts */}
              <motion.div
                className="flex justify-center gap-2 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Heart className="w-6 h-6 text-primary/40 fill-primary/20" />
                <Heart className="w-8 h-8 text-primary fill-primary/30 heartbeat" />
                <Heart className="w-6 h-6 text-primary/40 fill-primary/20" />
              </motion.div>

              {/* Main question */}
              <motion.h1
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-love mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Will you be my Valentine?
              </motion.h1>

              <motion.p
                className="text-4xl mb-8"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                💖
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Yes button - grows when No escapes */}
                <motion.div
                  animate={{ scale: yesScale }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    onClick={handleYes}
                    className="love-button px-10 py-6 text-lg font-semibold"
                  >
                    <Heart className="w-5 h-5 mr-2 fill-current" />
                    Yes! 💕
                  </Button>
                </motion.div>

                {/* Escaping No button */}
                <EscapingNoButton onEscape={handleNoEscape} />
              </motion.div>

              {/* Subtle hint */}
              <motion.p
                className="text-xs text-muted-foreground/60 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Psst... the No button is a little shy 😉
              </motion.p>
            </motion.div>

            {/* Share encouragement */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Share this link with someone special
                <Sparkles className="w-4 h-4 text-accent" />
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <ValentineSuccess key="success" onPlayAgain={handlePlayAgain} />
        )}
      </AnimatePresence>
    </div>
  );
}
