import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { Question } from '@/data/questions';
import { LoveMeter } from './LoveMeter';
import { HeartbeatAnimation } from './HeartbeatAnimation';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface QuestionCardProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  matchCount: number;
  player1Name: string;
  player2Name: string;
  player1Answer: number | null;
  player2Answer: number | null;
  onPlayer1Answer: (index: number) => void;
  onPlayer2Answer: (index: number) => void;
  onNext: () => void;
}

export function QuestionCard({
  question,
  currentQuestion,
  totalQuestions,
  matchCount,
  player1Name,
  player2Name,
  player1Answer,
  player2Answer,
  onPlayer1Answer,
  onPlayer2Answer,
  onNext
}: QuestionCardProps) {
  const haptics = useHapticFeedback();
  const bothAnswered = player1Answer !== null && player2Answer !== null;
  const isMatch = bothAnswered && player1Answer === player2Answer;

  const getIntensity = (): 'low' | 'medium' | 'high' => {
    const matchRate = matchCount / totalQuestions;
    if (matchRate >= 0.6) return 'high';
    if (matchRate >= 0.3) return 'medium';
    return 'low';
  };

  const handlePlayer1Select = (index: number) => {
    haptics.vibrateOnSelect();
    onPlayer1Answer(index);
  };

  const handlePlayer2Select = (index: number) => {
    haptics.vibrateOnSelect();
    onPlayer2Answer(index);
  };

  const handleNext = () => {
    if (isMatch) {
      haptics.vibrateOnSuccess();
    } else {
      haptics.vibrateOnTap();
    }
    onNext();
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Progress & Love Meter */}
      <motion.div 
        className="w-full max-w-2xl mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <HeartbeatAnimation intensity={getIntensity()} size="sm" />
        </div>
        <LoveMeter score={matchCount} maxScore={totalQuestions} showPercentage={false} />
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={question.id}
          className="love-card p-6 md:p-8 w-full max-w-2xl"
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-light text-primary text-sm font-medium mb-4">
              <MessageCircle className="w-4 h-4" />
              {question.category}
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
              {question.question}
            </h2>
          </div>

          {/* Player Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Player 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    {player1Name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-semibold text-foreground">{player1Name}</span>
                {player1Answer !== null && (
                  <Heart className="w-4 h-4 text-primary fill-primary ml-auto" />
                )}
              </div>
              
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    className={`w-full p-3 rounded-xl text-left text-sm font-medium transition-all ${
                      player1Answer === index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-rose-light hover:bg-primary/20 text-foreground'
                    } ${player2Answer !== null && bothAnswered ? 'pointer-events-none' : ''}`}
                    onClick={() => handlePlayer1Select(index)}
                    whileHover={{ scale: player2Answer !== null && bothAnswered ? 1 : 1.02 }}
                    whileTap={{ scale: player2Answer !== null && bothAnswered ? 1 : 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              <Heart className="w-6 h-6 text-primary/30" />
            </div>

            {/* Player 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-sm font-bold text-accent-foreground">
                    {player2Name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-semibold text-foreground">{player2Name}</span>
                {player2Answer !== null && (
                  <Heart className="w-4 h-4 text-accent fill-accent ml-auto" />
                )}
              </div>
              
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    className={`w-full p-3 rounded-xl text-left text-sm font-medium transition-all ${
                      player2Answer === index
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-gold-light hover:bg-accent/20 text-foreground'
                    } ${player1Answer !== null && bothAnswered ? 'pointer-events-none' : ''}`}
                    onClick={() => handlePlayer2Select(index)}
                    whileHover={{ scale: player1Answer !== null && bothAnswered ? 1 : 1.02 }}
                    whileTap={{ scale: player1Answer !== null && bothAnswered ? 1 : 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Match Result & Next Button */}
          <AnimatePresence>
            {bothAnswered && (
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {isMatch ? (
                  <motion.div 
                    className="mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-100 text-green-700">
                      <Heart className="w-5 h-5 fill-current" />
                      <span className="font-bold">Perfect Match!</span>
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                  </motion.div>
                ) : (
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 text-amber-700">
                      <span className="font-medium">Different perspectives – that's okay!</span>
                    </div>
                  </div>
                )}
                
                <motion.button
                  className="gold-button"
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentQuestion === totalQuestions ? 'See Results' : 'Next Question'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
