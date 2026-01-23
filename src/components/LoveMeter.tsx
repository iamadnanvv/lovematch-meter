import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LoveMeterProps {
  score: number;
  maxScore: number;
  showPercentage?: boolean;
}

export function LoveMeter({ score, maxScore, showPercentage = true }: LoveMeterProps) {
  const percentage = Math.round((score / maxScore) * 100);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">Love Meter</span>
        {showPercentage && (
          <span className="text-sm font-bold text-primary">{percentage}%</span>
        )}
      </div>
      
      <div className="relative h-6 bg-rose-light rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-rose-dark rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        <motion.div
          className="absolute inset-y-0 flex items-center"
          initial={{ left: 0 }}
          animate={{ left: `calc(${percentage}% - 12px)` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Heart 
            className="w-6 h-6 text-primary fill-primary heartbeat drop-shadow-lg" 
          />
        </motion.div>
      </div>
    </div>
  );
}
