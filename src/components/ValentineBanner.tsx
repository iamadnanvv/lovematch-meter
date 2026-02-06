import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ValentineBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if it's February
    const now = new Date();
    const isFebruary = now.getMonth() === 1; // 0-indexed, so 1 = February
    
    // Check if user has dismissed the banner this session
    const dismissed = sessionStorage.getItem('valentine-banner-dismissed');
    
    if (isFebruary && !dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('valentine-banner-dismissed', 'true');
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative bg-gradient-to-r from-primary/90 via-rose-dark/90 to-primary/90 text-primary-foreground py-3 px-4"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-sm">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart className="w-5 h-5 fill-current" />
            </motion.div>
            
            <span className="font-medium">
              💕 Valentine's Special is here!
            </span>
            
            <Link
              to="/valentine"
              className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Ask Your Valentine
            </Link>
            
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
            >
              <Heart className="w-5 h-5 fill-current" />
            </motion.div>
            
            <button
              onClick={handleDismiss}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
