import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MessageCircle, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface LoveLanguageMatcherProps {
  player1Name: string;
  player2Name: string;
  onComplete: (results: LoveLanguageResults) => void;
}

interface LoveLanguageResults {
  player1Primary: string;
  player1Secondary: string;
  player2Primary: string;
  player2Secondary: string;
  alignment: number;
  clashes: string[];
  actionItems: string[];
}

const LOVE_LANGUAGES = [
  { id: 'words', name: 'Words of Affirmation', icon: '💬', description: 'Verbal compliments, encouragement, and "I love you"' },
  { id: 'acts', name: 'Acts of Service', icon: '🛠️', description: 'Helping with tasks, doing chores, and thoughtful gestures' },
  { id: 'gifts', name: 'Receiving Gifts', icon: '🎁', description: 'Thoughtful presents, visual symbols of love' },
  { id: 'time', name: 'Quality Time', icon: '⏰', description: 'Undivided attention, meaningful conversations' },
  { id: 'touch', name: 'Physical Touch', icon: '🤗', description: 'Hugs, holding hands, physical closeness' },
];

const QUESTIONS = [
  {
    question: "When you've had a hard day, what helps you feel better?",
    options: [
      { text: "Hearing 'I'm proud of you' or 'You handled that well'", language: 'words' },
      { text: "Having my partner take care of dinner or chores", language: 'acts' },
      { text: "Receiving a small surprise or treat", language: 'gifts' },
      { text: "Sitting together and talking it through", language: 'time' },
      { text: "A long hug or back rub", language: 'touch' },
    ],
  },
  {
    question: "What makes you feel most connected to your partner?",
    options: [
      { text: "When they tell me specifically what they love about me", language: 'words' },
      { text: "When they notice what I need and help without being asked", language: 'acts' },
      { text: "When they remember something I mentioned wanting", language: 'gifts' },
      { text: "When we have dedicated, uninterrupted time together", language: 'time' },
      { text: "When we're physically close, even in small ways", language: 'touch' },
    ],
  },
  {
    question: "What hurts you most in a relationship?",
    options: [
      { text: "Harsh words, criticism, or lack of appreciation", language: 'words' },
      { text: "When my efforts go unnoticed or unreturned", language: 'acts' },
      { text: "Forgotten special occasions or thoughtless gifts", language: 'gifts' },
      { text: "Being distracted, canceled plans, or screen time during conversations", language: 'time' },
      { text: "Physical coldness or being pushed away", language: 'touch' },
    ],
  },
  {
    question: "What's your ideal way to spend a meaningful evening?",
    options: [
      { text: "Deep conversations about our dreams and feelings", language: 'words' },
      { text: "Cooking together or working on a project", language: 'acts' },
      { text: "Exchanging thoughtful presents", language: 'gifts' },
      { text: "An activity together with phones away", language: 'time' },
      { text: "Cuddling on the couch together", language: 'touch' },
    ],
  },
  {
    question: "How do you naturally show love to others?",
    options: [
      { text: "I tell them how much they mean to me", language: 'words' },
      { text: "I do things to make their life easier", language: 'acts' },
      { text: "I find perfect gifts that show I know them", language: 'gifts' },
      { text: "I make time for them no matter how busy I am", language: 'time' },
      { text: "I'm affectionate and love physical closeness", language: 'touch' },
    ],
  },
];

export function LoveLanguageMatcher({ player1Name, player2Name, onComplete }: LoveLanguageMatcherProps) {
  const haptics = useHapticFeedback();
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [player1Answers, setPlayer1Answers] = useState<string[]>([]);
  const [player2Answers, setPlayer2Answers] = useState<string[]>([]);

  const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
  const currentAnswers = currentPlayer === 1 ? player1Answers : player2Answers;

  const handleAnswer = (language: string) => {
    haptics.vibrateOnSelect();
    
    if (currentPlayer === 1) {
      setPlayer1Answers([...player1Answers, language]);
    } else {
      setPlayer2Answers([...player2Answers, language]);
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentPlayer === 1) {
      setCurrentPlayer(2);
      setCurrentQuestion(0);
    } else {
      // Calculate results
      calculateResults();
    }
  };

  const calculateLanguages = (answers: string[]) => {
    const counts: Record<string, number> = {};
    answers.forEach((lang) => {
      counts[lang] = (counts[lang] || 0) + 1;
    });
    
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return {
      primary: sorted[0]?.[0] || 'time',
      secondary: sorted[1]?.[0] || sorted[0]?.[0] || 'words',
    };
  };

  const calculateResults = () => {
    const p1Languages = calculateLanguages(player1Answers);
    const p2Languages = calculateLanguages(player2Answers);

    const p1Lang = LOVE_LANGUAGES.find((l) => l.id === p1Languages.primary)!;
    const p2Lang = LOVE_LANGUAGES.find((l) => l.id === p2Languages.primary)!;

    const clashes: string[] = [];
    const actionItems: string[] = [];

    // Detect misalignment
    if (p1Languages.primary !== p2Languages.primary) {
      clashes.push(
        `${player1Name} feels loved through ${p1Lang.name}, but ${player2Name} naturally expresses love through ${p2Lang.name}`
      );
      actionItems.push(
        `${player2Name}: Try saying specific compliments or writing notes to ${player1Name} - it means more to them than you might realize`
      );
      actionItems.push(
        `${player1Name}: When ${player2Name} ${p2Lang.description.toLowerCase()}, recognize it as their way of saying "I love you"`
      );
    }

    // Calculate alignment score
    let alignment = 50;
    if (p1Languages.primary === p2Languages.primary) alignment += 30;
    if (p1Languages.secondary === p2Languages.secondary) alignment += 20;
    if (p1Languages.primary === p2Languages.secondary || p2Languages.primary === p1Languages.secondary) {
      alignment += 10;
    }

    onComplete({
      player1Primary: p1Languages.primary,
      player1Secondary: p1Languages.secondary,
      player2Primary: p2Languages.primary,
      player2Secondary: p2Languages.secondary,
      alignment: Math.min(alignment, 100),
      clashes,
      actionItems,
    });
  };

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentPlayer - 1) * QUESTIONS.length + currentQuestion + 1) / (QUESTIONS.length * 2);

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
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-light text-primary text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            Love Language Discovery
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            {currentPlayerName}'s Turn
          </h2>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>
        </div>

        {/* Progress */}
        <div className="h-2 bg-rose-light rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPlayer}-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="font-semibold text-foreground mb-4 text-center">
              {question.question}
            </h3>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  className="w-full p-4 rounded-xl text-left text-sm font-medium bg-rose-light hover:bg-primary/20 text-foreground transition-all"
                  onClick={() => handleAnswer(option.language)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
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
