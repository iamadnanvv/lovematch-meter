import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Heart, Sparkles, RefreshCw, ArrowRight, MessageSquare } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface TruthOrDareProps {
  player1Name: string;
  player2Name: string;
  weakAreas?: string[];
  onComplete: () => void;
}

type ChallengeType = 'truth' | 'dare';

interface Challenge {
  type: ChallengeType;
  text: string;
  category: string;
  spiceLevel: 1 | 2 | 3;
}

const TRUTHS: Challenge[] = [
  { type: 'truth', text: "What's one thing you've never told me but always wanted to?", category: 'Vulnerability', spiceLevel: 2 },
  { type: 'truth', text: "What's your favorite memory of us that you haven't shared before?", category: 'Connection', spiceLevel: 1 },
  { type: 'truth', text: "What's something about me that first made your heart skip a beat?", category: 'Attraction', spiceLevel: 2 },
  { type: 'truth', text: "Is there a moment you felt I didn't fully understand you?", category: 'Communication', spiceLevel: 2 },
  { type: 'truth', text: "What do you need more of in our relationship right now?", category: 'Needs', spiceLevel: 2 },
  { type: 'truth', text: "What's your secret fantasy date night?", category: 'Romance', spiceLevel: 2 },
  { type: 'truth', text: "When do you feel most loved by me?", category: 'Love Languages', spiceLevel: 1 },
  { type: 'truth', text: "What's one fear you have about our future together?", category: 'Vulnerability', spiceLevel: 3 },
  { type: 'truth', text: "What habit of mine secretly drives you crazy but you've never mentioned?", category: 'Honesty', spiceLevel: 2 },
  { type: 'truth', text: "Describe your perfect kiss with me in detail", category: 'Intimacy', spiceLevel: 3 },
];

const DARES: Challenge[] = [
  { type: 'dare', text: "Give your partner a 2-minute massage while maintaining eye contact", category: 'Touch', spiceLevel: 2 },
  { type: 'dare', text: "Write a love note to your partner right now and read it aloud", category: 'Words', spiceLevel: 1 },
  { type: 'dare', text: "Demonstrate your best kissing technique on your partner's hand", category: 'Playful', spiceLevel: 2 },
  { type: 'dare', text: "Hold your partner close and slow dance for one full song", category: 'Romance', spiceLevel: 1 },
  { type: 'dare', text: "Whisper three things you find irresistible about your partner", category: 'Intimacy', spiceLevel: 2 },
  { type: 'dare', text: "Recreate your first kiss right now", category: 'Nostalgia', spiceLevel: 2 },
  { type: 'dare', text: "Feed your partner something sweet while they're blindfolded", category: 'Sensory', spiceLevel: 2 },
  { type: 'dare', text: "Give your partner a forehead kiss that lasts at least 10 seconds", category: 'Tenderness', spiceLevel: 1 },
  { type: 'dare', text: "Look into your partner's eyes for 60 seconds without speaking", category: 'Connection', spiceLevel: 2 },
  { type: 'dare', text: "Plan out loud a surprise date for next week in 60 seconds", category: 'Planning', spiceLevel: 1 },
];

export function TruthOrDare({ player1Name, player2Name, weakAreas = [], onComplete }: TruthOrDareProps) {
  const haptics = useHapticFeedback();
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<ChallengeType | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [usedChallenges, setUsedChallenges] = useState<Set<string>>(new Set());
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
  const partnerName = currentPlayer === 1 ? player2Name : player1Name;

  const getRandomChallenge = (type: ChallengeType) => {
    const pool = type === 'truth' ? TRUTHS : DARES;
    const available = pool.filter((c) => !usedChallenges.has(c.text));
    
    if (available.length === 0) {
      // Reset pool if exhausted
      setUsedChallenges(new Set());
      return pool[Math.floor(Math.random() * pool.length)];
    }
    
    return available[Math.floor(Math.random() * available.length)];
  };

  const handleTypeSelect = (type: ChallengeType) => {
    haptics.vibrateOnSelect();
    setSelectedType(type);
    const challenge = getRandomChallenge(type);
    setCurrentChallenge(challenge);
    setUsedChallenges((prev) => new Set([...prev, challenge.text]));
  };

  const handleComplete = () => {
    haptics.vibrateOnSuccess();
    setRoundsPlayed(roundsPlayed + 1);
    setSelectedType(null);
    setCurrentChallenge(null);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const handleSkip = () => {
    haptics.vibrateOnTap();
    if (selectedType) {
      const challenge = getRandomChallenge(selectedType);
      setCurrentChallenge(challenge);
      setUsedChallenges((prev) => new Set([...prev, challenge.text]));
    }
  };

  const handleFinish = () => {
    haptics.vibrateOnSuccess();
    onComplete();
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="love-card p-6 md:p-8 max-w-lg w-full"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-primary text-sm font-medium mb-4">
            <Flame className="w-4 h-4" />
            Truth or Dare: Couples Edition
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            {currentPlayerName}'s Turn
          </h2>
          <p className="text-sm text-muted-foreground">
            Round {roundsPlayed + 1} • Deepen your connection
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedType ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <p className="text-center text-muted-foreground mb-6">
                {currentPlayerName}, choose your challenge:
              </p>

              <motion.button
                className="w-full p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center"
                onClick={() => handleTypeSelect('truth')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                <span className="text-xl font-bold block">Truth</span>
                <span className="text-sm opacity-80">Answer honestly</span>
              </motion.button>

              <motion.button
                className="w-full p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white text-center"
                onClick={() => handleTypeSelect('dare')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Flame className="w-8 h-8 mx-auto mb-2" />
                <span className="text-xl font-bold block">Dare</span>
                <span className="text-sm opacity-80">Take the challenge</span>
              </motion.button>

              {roundsPlayed >= 3 && (
                <motion.button
                  className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={handleFinish}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Finish Game
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Challenge card */}
              <div
                className={`p-6 rounded-2xl text-center ${
                  selectedType === 'truth'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[...Array(currentChallenge?.spiceLevel || 1)].map((_, i) => (
                    <Flame key={i} className="w-4 h-4" />
                  ))}
                </div>
                <p className="text-lg font-medium">{currentChallenge?.text}</p>
                <span className="text-xs opacity-70 mt-2 block">{currentChallenge?.category}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <motion.button
                  className="gold-button w-full"
                  onClick={handleComplete}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Done! Next Turn
                  </span>
                </motion.button>

                <motion.button
                  className="love-button-outline w-full"
                  onClick={handleSkip}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Skip & Get Another
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player indicator */}
        <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPlayer === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {player1Name.charAt(0)}
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPlayer === 2 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {player2Name.charAt(0)}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
