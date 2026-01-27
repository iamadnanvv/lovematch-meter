import { motion } from 'framer-motion';
import { Heart, Sparkles, MessageSquare, Flag, Flame, Languages, ChevronRight } from 'lucide-react';
import { ValentineCountdown } from './ValentineCountdown';

interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isNew?: boolean;
}

interface GameModeSelectionProps {
  player1Name: string;
  player2Name: string;
  onSelectMode: (mode: string) => void;
  onBack: () => void;
}

const GAME_MODES: GameMode[] = [
  {
    id: 'classic',
    name: 'Classic Quiz',
    description: 'Test your compatibility with 10 fun questions',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-primary to-rose-dark',
  },
  {
    id: 'love-language',
    name: 'Love Language Matcher',
    description: 'Discover how you each give and receive love',
    icon: <Languages className="w-6 h-6" />,
    color: 'from-violet-500 to-purple-600',
    isNew: true,
  },
  {
    id: 'flags',
    name: 'Red & Green Flags',
    description: 'Honest relationship health check',
    icon: <Flag className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500',
    isNew: true,
  },
  {
    id: 'truth-dare',
    name: 'Truth or Dare',
    description: 'Spicy questions to deepen your bond',
    icon: <Flame className="w-6 h-6" />,
    color: 'from-red-500 to-pink-500',
    isNew: true,
  },
];

export function GameModeSelection({ player1Name, player2Name, onSelectMode, onBack }: GameModeSelectionProps) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="love-card p-6 md:p-8 max-w-lg w-full"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* Countdown */}
        <div className="flex justify-center mb-6">
          <ValentineCountdown variant="minimal" />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-light text-primary text-sm font-medium mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            Choose Your Experience
          </motion.div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {player1Name} & {player2Name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Select how you want to explore your connection
          </p>
        </div>

        {/* Game Modes */}
        <div className="space-y-3">
          {GAME_MODES.map((mode, index) => (
            <motion.button
              key={mode.id}
              className="w-full p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-left group"
              onClick={() => onSelectMode(mode.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-white shrink-0`}
                >
                  {mode.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{mode.name}</span>
                    {mode.isNew && (
                      <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{mode.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Back button */}
        <motion.button
          className="w-full mt-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
          onClick={onBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          ← Back to Setup
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
