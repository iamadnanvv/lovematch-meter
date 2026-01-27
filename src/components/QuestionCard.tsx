import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Question } from '@/data/questions';
import { LoveMeter } from './LoveMeter';
import { HeartbeatAnimation } from './HeartbeatAnimation';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useState, useCallback } from 'react';

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
  onPrevious?: () => void;
}

const SWIPE_THRESHOLD = 100;
const SWIPE_VELOCITY = 500;

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
  onNext,
  onPrevious
}: QuestionCardProps) {
  const haptics = useHapticFeedback();
  const [direction, setDirection] = useState(0);
  const [dragX, setDragX] = useState(0);
  
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

  const handleNext = useCallback(() => {
    if (isMatch) {
      haptics.vibrateOnSuccess();
    } else {
      haptics.vibrateOnTap();
    }
    setDirection(1);
    onNext();
  }, [isMatch, haptics, onNext]);

  const handlePrevious = useCallback(() => {
    if (onPrevious && currentQuestion > 1) {
      haptics.vibrateOnTap();
      setDirection(-1);
      onPrevious();
    }
  }, [onPrevious, currentQuestion, haptics]);

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;
      
      // Swipe left (next) - only if both answered
      if (bothAnswered && (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY)) {
        handleNext();
      }
      // Swipe right (previous)
      else if (onPrevious && currentQuestion > 1 && (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY)) {
        handlePrevious();
      }
      
      setDragX(0);
    },
    [bothAnswered, handleNext, handlePrevious, currentQuestion, onPrevious]
  );

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
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
        
        {/* Swipe hint on mobile */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground md:hidden">
          {currentQuestion > 1 && onPrevious && (
            <span className="flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" />
              Swipe right for previous
            </span>
          )}
          {bothAnswered && (
            <span className="flex items-center gap-1">
              Swipe left for next
              <ChevronRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </motion.div>

      {/* Question Card with Swipe */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div 
          key={question.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDrag={(e, info) => setDragX(info.offset.x)}
          onDragEnd={handleDragEnd}
          className="love-card p-6 md:p-8 w-full max-w-2xl cursor-grab active:cursor-grabbing touch-pan-y"
          style={{
            rotate: dragX * 0.02,
            x: dragX * 0.3,
          }}
        >
          {/* Swipe indicators */}
          <AnimatePresence>
            {dragX < -30 && bothAnswered && (
              <motion.div
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                Next →
              </motion.div>
            )}
            {dragX > 30 && onPrevious && currentQuestion > 1 && (
              <motion.div
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                ← Back
              </motion.div>
            )}
          </AnimatePresence>

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
                
                <div className="flex items-center justify-center gap-3">
                  {onPrevious && currentQuestion > 1 && (
                    <motion.button
                      className="love-button-outline px-4"
                      onClick={handlePrevious}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                  )}
                  <motion.button
                    className="gold-button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentQuestion === totalQuestions ? 'See Results' : 'Next Question'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
