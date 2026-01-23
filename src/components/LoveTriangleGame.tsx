import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from './WelcomeScreen';
import { PlayerSetup } from './PlayerSetup';
import { QuestionCard } from './QuestionCard';
import { ResultsScreen } from './ResultsScreen';
import { FloatingHearts } from './FloatingHearts';
import { questions } from '@/data/questions';

type GameState = 'welcome' | 'setup' | 'playing' | 'results';

interface PlayerAnswers {
  player1: (number | null)[];
  player2: (number | null)[];
}

export function LoveTriangleGame() {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PlayerAnswers>({
    player1: Array(questions.length).fill(null),
    player2: Array(questions.length).fill(null)
  });

  const handleStartGame = () => {
    setGameState('setup');
  };

  const handleSetupComplete = (p1: string, p2: string) => {
    setPlayer1Name(p1);
    setPlayer2Name(p2);
    setGameState('playing');
  };

  const handlePlayer1Answer = (answerIndex: number) => {
    setAnswers(prev => {
      const newP1 = [...prev.player1];
      newP1[currentQuestionIndex] = answerIndex;
      return { ...prev, player1: newP1 };
    });
  };

  const handlePlayer2Answer = (answerIndex: number) => {
    setAnswers(prev => {
      const newP2 = [...prev.player2];
      newP2[currentQuestionIndex] = answerIndex;
      return { ...prev, player2: newP2 };
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('results');
    }
  };

  const calculateMatchCount = () => {
    return answers.player1.reduce((count, p1Answer, index) => {
      return p1Answer === answers.player2[index] ? count + 1 : count;
    }, 0);
  };

  const getCurrentMatchCount = () => {
    return answers.player1.slice(0, currentQuestionIndex + 1).reduce((count, p1Answer, index) => {
      return p1Answer === answers.player2[index] && p1Answer !== null ? count + 1 : count;
    }, 0);
  };

  const handlePlayAgain = () => {
    setGameState('welcome');
    setPlayer1Name('');
    setPlayer2Name('');
    setCurrentQuestionIndex(0);
    setAnswers({
      player1: Array(questions.length).fill(null),
      player2: Array(questions.length).fill(null)
    });
  };

  return (
    <div className="relative">
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        {gameState === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={handleStartGame} />
        )}
        
        {gameState === 'setup' && (
          <PlayerSetup 
            key="setup" 
            onComplete={handleSetupComplete}
            onBack={() => setGameState('welcome')}
          />
        )}
        
        {gameState === 'playing' && (
          <QuestionCard
            key={`question-${currentQuestionIndex}`}
            question={questions[currentQuestionIndex]}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            matchCount={getCurrentMatchCount()}
            player1Name={player1Name}
            player2Name={player2Name}
            player1Answer={answers.player1[currentQuestionIndex]}
            player2Answer={answers.player2[currentQuestionIndex]}
            onPlayer1Answer={handlePlayer1Answer}
            onPlayer2Answer={handlePlayer2Answer}
            onNext={handleNextQuestion}
          />
        )}
        
        {gameState === 'results' && (
          <ResultsScreen
            key="results"
            player1Name={player1Name}
            player2Name={player2Name}
            matchCount={calculateMatchCount()}
            totalQuestions={questions.length}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
