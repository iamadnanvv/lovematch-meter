import { motion } from 'framer-motion';
import { Heart, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/love-triangle-logo.png';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="love-card p-8 md:p-12 max-w-lg w-full text-center"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div 
          className="mb-6 float"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <img 
            src={logoImage} 
            alt="Love Triangle" 
            className="w-32 h-32 mx-auto drop-shadow-xl"
          />
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="font-display text-4xl md:text-5xl font-bold text-gradient-love mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Love Triangle
        </motion.h1>

        <motion.p 
          className="text-muted-foreground text-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Test your love compatibility
        </motion.p>

        {/* Features */}
        <motion.div 
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">10 Rounds</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gold-light flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <span className="text-xs text-muted-foreground">For Couples</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Fun Quiz</span>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.button
          className="love-button w-full text-lg"
          onClick={onStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5" />
            Start the Game
          </span>
        </motion.button>

        <motion.p 
          className="text-xs text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Answer together & discover your compatibility!
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
