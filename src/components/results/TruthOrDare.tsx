import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Heart, MessageCircle, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface TruthOrDareProps {
  player1Name: string;
  player2Name: string;
  score: number;
  weakCategories?: string[];
}

type ChallengeType = 'truth' | 'dare';

interface Challenge {
  type: ChallengeType;
  text: string;
  intensity: 'mild' | 'medium' | 'spicy';
  category: 'communication' | 'intimacy' | 'vulnerability' | 'adventure';
}

// Dynamic challenges based on compatibility gaps
const generateChallenges = (player1: string, player2: string, score: number): Challenge[] => {
  const isLowScore = score < 50;
  const isMediumScore = score >= 50 && score < 75;
  
  const baseChallenges: Challenge[] = [
    // Communication focused (for gaps)
    {
      type: 'truth',
      text: `${player1}, what's one thing you wish ${player2} understood better about you?`,
      intensity: 'medium',
      category: 'communication'
    },
    {
      type: 'truth',
      text: `${player2}, describe a moment when you felt truly seen by ${player1}.`,
      intensity: 'medium',
      category: 'vulnerability'
    },
    {
      type: 'dare',
      text: `Look into each other's eyes for 60 seconds without speaking. Then share what you felt.`,
      intensity: 'medium',
      category: 'intimacy'
    },
    {
      type: 'truth',
      text: `What's a fear about this relationship you've never spoken aloud?`,
      intensity: 'spicy',
      category: 'vulnerability'
    },
    {
      type: 'dare',
      text: `${player1}, give ${player2} the kind of compliment you think they need to hear most right now.`,
      intensity: 'mild',
      category: 'communication'
    },
    {
      type: 'truth',
      text: `${player2}, what's one pattern in your arguments you wish you could break?`,
      intensity: 'medium',
      category: 'communication'
    },
    {
      type: 'dare',
      text: `Write down 3 things you love about each other. Exchange papers and read aloud.`,
      intensity: 'mild',
      category: 'intimacy'
    },
    {
      type: 'truth',
      text: `What's a compromise you've made that still bothers you sometimes?`,
      intensity: 'spicy',
      category: 'vulnerability'
    },
    {
      type: 'dare',
      text: `Slow dance together for one full song—no phones, no distractions.`,
      intensity: 'mild',
      category: 'intimacy'
    },
    {
      type: 'truth',
      text: `${player1}, what do you think is ${player2}'s biggest worry about your future together?`,
      intensity: 'spicy',
      category: 'vulnerability'
    },
    // Adventure challenges
    {
      type: 'dare',
      text: `Plan a surprise date for next week. You have 2 minutes to outline it now.`,
      intensity: 'mild',
      category: 'adventure'
    },
    {
      type: 'truth',
      text: `What's something new you'd love to try together but have been afraid to suggest?`,
      intensity: 'medium',
      category: 'adventure'
    },
    {
      type: 'dare',
      text: `Send each other a romantic text as if you just started dating.`,
      intensity: 'medium',
      category: 'intimacy'
    },
    {
      type: 'truth',
      text: `When did you last feel disconnected from ${player2}? What brought you back together?`,
      intensity: 'spicy',
      category: 'communication'
    },
    {
      type: 'dare',
      text: `${player2}, recreate the first time you told ${player1} something important about yourself.`,
      intensity: 'medium',
      category: 'vulnerability'
    },
  ];

  // Add more intense challenges for lower scores
  if (isLowScore) {
    baseChallenges.push(
      {
        type: 'truth',
        text: `What's the biggest misunderstanding between you two that hasn't been fully resolved?`,
        intensity: 'spicy',
        category: 'communication'
      },
      {
        type: 'dare',
        text: `Each of you apologize for one specific thing—without defending yourself.`,
        intensity: 'spicy',
        category: 'vulnerability'
      },
      {
        type: 'truth',
        text: `${player1}, what does ${player2} do that makes you feel most loved? Have you told them?`,
        intensity: 'medium',
        category: 'communication'
      }
    );
  }

  // Add growth challenges for medium scores
  if (isMediumScore) {
    baseChallenges.push(
      {
        type: 'dare',
        text: `Create a "relationship goal" together for the next month. Write it down.`,
        intensity: 'mild',
        category: 'adventure'
      },
      {
        type: 'truth',
        text: `What's one thing your partner does perfectly that you've never properly thanked them for?`,
        intensity: 'mild',
        category: 'communication'
      }
    );
  }

  return baseChallenges;
};

export function TruthOrDare({ player1Name, player2Name, score, weakCategories = [] }: TruthOrDareProps) {
  const [open, setOpen] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [selectedType, setSelectedType] = useState<ChallengeType | null>(null);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const haptic = useHapticFeedback();

  const challenges = useMemo(
    () => generateChallenges(player1Name, player2Name, score),
    [player1Name, player2Name, score]
  );

  const getRandomChallenge = useCallback((type: ChallengeType) => {
    const available = challenges
      .map((c, i) => ({ challenge: c, index: i }))
      .filter(({ challenge, index }) => challenge.type === type && !usedIndices.has(index));

    if (available.length === 0) {
      // Reset if all used
      setUsedIndices(new Set());
      return challenges.filter(c => c.type === type)[Math.floor(Math.random() * challenges.filter(c => c.type === type).length)];
    }

    const picked = available[Math.floor(Math.random() * available.length)];
    setUsedIndices(prev => new Set([...prev, picked.index]));
    return picked.challenge;
  }, [challenges, usedIndices]);

  const handleSelect = (type: ChallengeType) => {
    haptic.vibrateOnSelect();
    setSelectedType(type);
    const challenge = getRandomChallenge(type);
    setCurrentChallenge(challenge);
  };

  const handleNext = () => {
    if (selectedType) {
      haptic.vibrateOnTap();
      const challenge = getRandomChallenge(selectedType);
      setCurrentChallenge(challenge);
    }
  };

  const handleReset = () => {
    haptic.vibrateOnTap();
    setSelectedType(null);
    setCurrentChallenge(null);
  };

  const intensityColor = {
    mild: 'text-emerald-500',
    medium: 'text-amber-500',
    spicy: 'text-red-500'
  };

  const intensityBg = {
    mild: 'bg-emerald-500/10',
    medium: 'bg-amber-500/10',
    spicy: 'bg-red-500/10'
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="w-full py-4 px-6 rounded-full font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center gap-3 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Flame className="w-5 h-5" />
          <span>Truth or Dare — Couples Edition</span>
          <Sparkles className="w-4 h-4" />
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2 text-xl">
            <Flame className="w-5 h-5 text-orange-500" />
            Truth or Dare
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!selectedType ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 py-4"
            >
              <p className="text-center text-muted-foreground text-sm">
                Based on your compatibility gaps, we've crafted challenges to deepen your connection.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex flex-col items-center gap-3"
                  onClick={() => handleSelect('truth')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-purple-500" />
                  </div>
                  <span className="font-bold text-lg">Truth</span>
                  <span className="text-xs text-muted-foreground">Reveal your heart</span>
                </motion.button>

                <motion.button
                  className="p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex flex-col items-center gap-3"
                  onClick={() => handleSelect('dare')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Flame className="w-7 h-7 text-orange-500" />
                  </div>
                  <span className="font-bold text-lg">Dare</span>
                  <span className="text-xs text-muted-foreground">Take the leap</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4 py-4"
            >
              {currentChallenge && (
                <>
                  {/* Challenge type badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedType === 'truth' 
                        ? 'bg-purple-500/20 text-purple-500' 
                        : 'bg-orange-500/20 text-orange-500'
                    }`}>
                      {selectedType === 'truth' ? '💬 Truth' : '🔥 Dare'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${intensityBg[currentChallenge.intensity]} ${intensityColor[currentChallenge.intensity]}`}>
                      {currentChallenge.intensity === 'mild' && '🌱 Mild'}
                      {currentChallenge.intensity === 'medium' && '⚡ Medium'}
                      {currentChallenge.intensity === 'spicy' && '🌶️ Spicy'}
                    </span>
                  </div>

                  {/* Challenge card */}
                  <motion.div
                    className="p-6 rounded-xl bg-gradient-to-br from-card to-secondary border border-border min-h-[180px] flex items-center justify-center"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-lg font-medium text-center leading-relaxed">
                      {currentChallenge.text}
                    </p>
                  </motion.div>

                  {/* Category tag */}
                  <div className="flex justify-center">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {currentChallenge.category === 'communication' && <MessageCircle className="w-3 h-3" />}
                      {currentChallenge.category === 'intimacy' && <Heart className="w-3 h-3" />}
                      {currentChallenge.category === 'vulnerability' && <Sparkles className="w-3 h-3" />}
                      {currentChallenge.category === 'adventure' && <Flame className="w-3 h-3" />}
                      {currentChallenge.category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 py-3 px-4 rounded-full bg-secondary text-foreground font-medium flex items-center justify-center gap-2"
                      onClick={handleReset}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Switch
                    </motion.button>
                    <motion.button
                      className="flex-1 py-3 px-4 rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-muted-foreground text-center border-t border-border pt-4">
          💡 These prompts are designed to address compatibility gaps and strengthen your bond.
        </p>
      </DialogContent>
    </Dialog>
  );
}
