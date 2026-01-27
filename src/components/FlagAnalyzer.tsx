import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, ArrowRight, Shield, Heart, Flag, Sparkles } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface FlagAnalyzerProps {
  player1Name: string;
  player2Name: string;
  onComplete: (results: FlagResults) => void;
}

interface FlagResults {
  redFlags: FlagItem[];
  greenFlags: FlagItem[];
  blindSpots: string[];
  strengths: string[];
  overallHealth: number;
}

interface FlagItem {
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionItem?: string;
}

const SCENARIOS = [
  {
    id: 1,
    scenario: "When we disagree about something important...",
    options: [
      { text: "We discuss calmly until we find a solution", flag: 'green', category: 'Communication', severity: 'high' as const },
      { text: "One of us usually gives in to avoid conflict", flag: 'yellow', category: 'Conflict Avoidance', severity: 'medium' as const },
      { text: "We need time apart before talking again", flag: 'neutral', category: 'Processing Style', severity: 'low' as const },
      { text: "It often escalates into raised voices", flag: 'red', category: 'Conflict Management', severity: 'high' as const },
    ],
  },
  {
    id: 2,
    scenario: "When my partner spends time with friends without me...",
    options: [
      { text: "I'm happy they have their own social life", flag: 'green', category: 'Independence', severity: 'high' as const },
      { text: "I feel a little left out but understand", flag: 'neutral', category: 'Attachment', severity: 'low' as const },
      { text: "I need constant updates about where they are", flag: 'red', category: 'Trust Issues', severity: 'medium' as const },
      { text: "I struggle with jealousy sometimes", flag: 'yellow', category: 'Jealousy', severity: 'medium' as const },
    ],
  },
  {
    id: 3,
    scenario: "When one of us makes a mistake...",
    options: [
      { text: "We apologize sincerely and move forward", flag: 'green', category: 'Accountability', severity: 'high' as const },
      { text: "Old issues tend to get brought up", flag: 'red', category: 'Resentment', severity: 'medium' as const },
      { text: "We forgive but it takes time", flag: 'neutral', category: 'Processing', severity: 'low' as const },
      { text: "Someone usually shuts down or withdraws", flag: 'yellow', category: 'Emotional Avoidance', severity: 'medium' as const },
    ],
  },
  {
    id: 4,
    scenario: "Our communication style is best described as...",
    options: [
      { text: "Open, honest, and regular check-ins", flag: 'green', category: 'Communication', severity: 'high' as const },
      { text: "We assume each other knows how we feel", flag: 'yellow', category: 'Assumption', severity: 'medium' as const },
      { text: "Important topics are hard to bring up", flag: 'red', category: 'Avoidance', severity: 'medium' as const },
      { text: "Good but could improve in some areas", flag: 'neutral', category: 'Communication', severity: 'low' as const },
    ],
  },
  {
    id: 5,
    scenario: "When it comes to our future together...",
    options: [
      { text: "We've discussed and aligned on major life goals", flag: 'green', category: 'Life Planning', severity: 'high' as const },
      { text: "We avoid serious future discussions", flag: 'red', category: 'Commitment', severity: 'high' as const },
      { text: "We have different timelines but are working on it", flag: 'yellow', category: 'Alignment', severity: 'medium' as const },
      { text: "One person drives most future planning", flag: 'neutral', category: 'Balance', severity: 'low' as const },
    ],
  },
  {
    id: 6,
    scenario: "Regarding personal boundaries...",
    options: [
      { text: "We respect each other's boundaries completely", flag: 'green', category: 'Boundaries', severity: 'high' as const },
      { text: "Boundaries are sometimes pushed or tested", flag: 'yellow', category: 'Boundaries', severity: 'medium' as const },
      { text: "One person's needs often take priority", flag: 'red', category: 'Power Imbalance', severity: 'high' as const },
      { text: "We're still learning what our boundaries are", flag: 'neutral', category: 'Growth', severity: 'low' as const },
    ],
  },
];

export function FlagAnalyzer({ player1Name, player2Name, onComplete }: FlagAnalyzerProps) {
  const haptics = useHapticFeedback();
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [player1Answers, setPlayer1Answers] = useState<typeof SCENARIOS[0]['options'][0][]>([]);
  const [player2Answers, setPlayer2Answers] = useState<typeof SCENARIOS[0]['options'][0][]>([]);

  const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;

  const handleAnswer = (option: typeof SCENARIOS[0]['options'][0]) => {
    haptics.vibrateOnSelect();

    if (currentPlayer === 1) {
      setPlayer1Answers([...player1Answers, option]);
    } else {
      setPlayer2Answers([...player2Answers, option]);
    }

    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else if (currentPlayer === 1) {
      setCurrentPlayer(2);
      setCurrentScenario(0);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const allAnswers = [...player1Answers, ...player2Answers];
    
    const redFlags: FlagItem[] = [];
    const greenFlags: FlagItem[] = [];
    const blindSpots: string[] = [];
    const strengths: string[] = [];

    allAnswers.forEach((answer) => {
      if (answer.flag === 'red') {
        redFlags.push({
          category: answer.category,
          description: answer.text,
          severity: answer.severity,
          actionItem: `Address ${answer.category.toLowerCase()} patterns through open conversation`,
        });
      } else if (answer.flag === 'green') {
        greenFlags.push({
          category: answer.category,
          description: answer.text,
          severity: answer.severity,
        });
        strengths.push(answer.category);
      }
    });

    // Find disagreements (blind spots)
    SCENARIOS.forEach((scenario, index) => {
      const p1 = player1Answers[index];
      const p2 = player2Answers[index];
      if (p1?.flag !== p2?.flag && (p1?.flag === 'red' || p2?.flag === 'red')) {
        blindSpots.push(
          `${player1Name} and ${player2Name} see "${scenario.scenario}" differently - this needs discussion`
        );
      }
    });

    // Calculate health score
    const redCount = redFlags.length;
    const greenCount = greenFlags.length;
    const totalAnswers = allAnswers.length;
    
    let health = 70; // Base score
    health += (greenCount / totalAnswers) * 30;
    health -= (redCount / totalAnswers) * 40;
    health = Math.max(20, Math.min(100, health));

    onComplete({
      redFlags,
      greenFlags,
      blindSpots,
      strengths: [...new Set(strengths)],
      overallHealth: Math.round(health),
    });
  };

  const scenario = SCENARIOS[currentScenario];
  const progress = ((currentPlayer - 1) * SCENARIOS.length + currentScenario + 1) / (SCENARIOS.length * 2);

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
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
            <Flag className="w-4 h-4" />
            Relationship Health Check
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            {currentPlayerName}'s Perspective
          </h2>
          <p className="text-sm text-muted-foreground">
            Scenario {currentScenario + 1} of {SCENARIOS.length}
          </p>
        </div>

        {/* Progress */}
        <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Scenario */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPlayer}-${currentScenario}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="font-semibold text-foreground mb-4 text-center">
              {scenario.scenario}
            </h3>

            <div className="space-y-3">
              {scenario.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                    option.flag === 'green'
                      ? 'bg-green-50 hover:bg-green-100 text-foreground'
                      : option.flag === 'red'
                        ? 'bg-red-50 hover:bg-red-100 text-foreground'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                  onClick={() => handleAnswer(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        option.flag === 'green'
                          ? 'bg-green-500 text-white'
                          : option.flag === 'red'
                            ? 'bg-red-500 text-white'
                            : 'bg-muted-foreground/20'
                      }`}
                    >
                      {option.flag === 'green' ? (
                        <Check className="w-3 h-3" />
                      ) : option.flag === 'red' ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                      )}
                    </div>
                    <span>{option.text}</span>
                  </div>
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
