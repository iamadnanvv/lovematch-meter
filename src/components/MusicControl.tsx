import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface MusicControlProps {
  isPlaying: boolean;
  isMuted: boolean;
  onToggle: () => void;
  onToggleMute: () => void;
}

export function MusicControl({ isPlaying, isMuted, onToggle, onToggleMute }: MusicControlProps) {
  return (
    <motion.div 
      className="fixed top-4 right-4 z-50 flex items-center gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        className={`p-3 rounded-full backdrop-blur-sm transition-all ${
          isPlaying 
            ? 'bg-primary/20 text-primary' 
            : 'bg-card/80 text-muted-foreground hover:text-foreground'
        }`}
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        <Music className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
      </motion.button>
      
      {isPlaying && (
        <motion.button
          className="p-3 rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-all"
          onClick={onToggleMute}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
