import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export function SoundToggle({ isMuted, onToggle }: SoundToggleProps) {
  return (
    <motion.button
      className={`p-2 rounded-full transition-all ${
        isMuted 
          ? 'bg-muted text-muted-foreground' 
          : 'bg-primary/20 text-primary'
      }`}
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
      aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </motion.button>
  );
}
