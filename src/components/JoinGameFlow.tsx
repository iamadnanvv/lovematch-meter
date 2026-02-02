import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useQuizSession } from "@/hooks/useQuizSession";
import { questionCategories, Question } from "@/data/questions";
import { JoinGameSetup } from "./JoinGameSetup";
import { RemoteQuestionCard } from "./RemoteQuestionCard";
import { RemoteResultsScreen } from "./RemoteResultsScreen";
import { GameLoadingSkeleton } from "@/components/skeletons/GameSkeleton";
import logoImage from "@/assets/love-triangle-logo.png";

type JoinState = "loading" | "error" | "setup" | "playing" | "submitting" | "results";

interface JoinGameFlowProps {
  shareCode: string;
  onExit: () => void;
}

export function JoinGameFlow({ shareCode, onExit }: JoinGameFlowProps) {
  const { getSession, joinSession, loading, error } = useQuizSession();
  const [state, setState] = useState<JoinState>("loading");
  const [sessionData, setSessionData] = useState<{
    player1Name: string;
    selectedCategories: string[];
    player1Answers: number[];
  } | null>(null);
  const [player2Name, setPlayer2Name] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch session on mount
  useEffect(() => {
    async function fetchSession() {
      setState("loading");
      const session = await getSession(shareCode);

      if (!session) {
        setErrorMessage("This quiz link is invalid or has expired.");
        setState("error");
        return;
      }

      if (session.status === "completed") {
        setErrorMessage("This quiz has already been completed by another player.");
        setState("error");
        return;
      }

      // Build questions from categories
      const selectedQuestions = questionCategories
        .filter((cat) => session.selected_categories.includes(cat.id))
        .flatMap((cat) => cat.questions);

      if (selectedQuestions.length !== session.player1_answers.length) {
        setErrorMessage("Quiz configuration mismatch. Please ask for a new link.");
        setState("error");
        return;
      }

      setSessionData({
        player1Name: session.player1_name,
        selectedCategories: session.selected_categories,
        player1Answers: session.player1_answers,
      });
      setQuestions(selectedQuestions);
      setAnswers(Array(selectedQuestions.length).fill(null));
      setState("setup");
    }

    fetchSession();
  }, [shareCode, getSession]);

  const handleSetupComplete = useCallback((name: string) => {
    setPlayer2Name(name);
    setState("playing");
  }, []);

  const handleSelectAnswer = useCallback((index: number) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = index;
      return newAnswers;
    });
  }, [currentQuestionIndex]);

  const handleNextQuestion = useCallback(async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Submit answers
      setState("submitting");
      const player2Answers = answers.filter((a): a is number => a !== null);

      const result = await joinSession({
        share_code: shareCode,
        player2_name: player2Name,
        player2_answers: player2Answers,
      });

      if (result) {
        setState("results");
      } else {
        setErrorMessage("Failed to submit your answers. Please try again.");
        setState("error");
      }
    }
  }, [currentQuestionIndex, questions.length, answers, joinSession, shareCode, player2Name]);

  const handlePlayAgain = useCallback(() => {
    // Clear URL parameter and go to main game
    window.history.replaceState({}, "", "/");
    onExit();
  }, [onExit]);

  // Loading state
  if (state === "loading" || state === "submitting") {
    return <GameLoadingSkeleton />;
  }

  // Error state
  if (state === "error") {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="love-card p-8 max-w-md w-full text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Oops!</h2>
          <p className="text-muted-foreground mb-6">{errorMessage || error}</p>
          <motion.button
            className="love-button"
            onClick={handlePlayAgain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start a New Game
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {state === "setup" && sessionData && (
        <JoinGameSetup
          key="setup"
          player1Name={sessionData.player1Name}
          onComplete={handleSetupComplete}
          loading={loading}
        />
      )}

      {state === "playing" && questions.length > 0 && (
        <RemoteQuestionCard
          key={`question-${currentQuestionIndex}`}
          question={questions[currentQuestionIndex]}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          playerName={player2Name}
          selectedAnswer={answers[currentQuestionIndex]}
          onSelectAnswer={handleSelectAnswer}
          onNext={handleNextQuestion}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      )}

      {state === "results" && sessionData && (
        <RemoteResultsScreen
          key="results"
          player1Name={sessionData.player1Name}
          player2Name={player2Name}
          player1Answers={sessionData.player1Answers}
          player2Answers={answers.filter((a): a is number => a !== null)}
          selectedCategories={sessionData.selectedCategories}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </AnimatePresence>
  );
}
