import { motion } from 'framer-motion';
import { HeartCrack, Calendar, Bell } from 'lucide-react';
import logoImage from '@/assets/love-triangle-logo.png';

interface ExpiredScreenProps {
  onNotifyMe?: () => void;
}

export function ExpiredScreen({ onNotifyMe }: ExpiredScreenProps) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-muted to-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="love-card p-8 md:p-12 max-w-md w-full text-center"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* Broken Heart Icon */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
            <HeartCrack className="w-12 h-12 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Logo (faded) */}
        <motion.div
          className="mb-4 opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.3 }}
        >
          <img 
            src={logoImage} 
            alt="Love Triangle" 
            className="w-16 h-16 mx-auto grayscale"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Valentine's Has Passed
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          This special experience was available only until Valentine's Day. 
          Your previous results have been cleared to keep the magic exclusive.
        </motion.p>

        {/* Calendar info */}
        <motion.div
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8 p-4 rounded-xl bg-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Calendar className="w-5 h-5" />
          <span>Love Triangle returns next Valentine's season</span>
        </motion.div>

        {/* Notify Button */}
        <motion.button
          className="love-button-outline w-full"
          onClick={onNotifyMe}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Bell className="w-5 h-5" />
            Notify Me Next Year
          </span>
        </motion.button>

        {/* Footer */}
        <motion.p
          className="text-xs text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Made with love by Love Triangle 💕
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
