import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { Question } from "@/data/questions";
import { LoveMeter } from "./LoveMeter";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

interface RemoteQuestionCardProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  playerName: string;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

export function RemoteQuestionCard({
  question,
  currentQuestion,
  totalQuestions,
  playerName,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  isLastQuestion,
}: RemoteQuestionCardProps) {
  const haptics = useHapticFeedback();
  const hasAnswered = selectedAnswer !== null;

  const handleSelectAnswer = (index: number) => {
    if (!hasAnswered) {
      haptics.vibrateOnSelect();
      onSelectAnswer(index);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Progress */}
      <motion.div
        className="w-full max-w-lg mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-foreground">{playerName}</span>
          </div>
        </div>
        <LoveMeter score={currentQuestion - 1} maxScore={totalQuestions} showPercentage={false} />
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          className="love-card p-6 md:p-8 w-full max-w-lg"
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

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                  selectedAnswer === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-rose-light hover:bg-primary/20 text-foreground"
                } ${hasAnswered ? "pointer-events-none" : ""}`}
                onClick={() => handleSelectAnswer(index)}
                whileHover={{ scale: hasAnswered ? 1 : 1.02 }}
                whileTap={{ scale: hasAnswered ? 1 : 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Next Button */}
          <AnimatePresence>
            {hasAnswered && (
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.button
                  className="gold-button"
                  onClick={() => {
                    haptics.vibrateOnTap();
                    onNext();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLastQuestion ? "See Results" : "Next Question"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
