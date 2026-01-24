import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from './WelcomeScreen';
import { PlayerSetup } from './PlayerSetup';
import { CategorySelection } from './CategorySelection';
import { QuestionCard } from './QuestionCard';
import { ResultsScreen } from './ResultsScreen';
import { FloatingHearts } from './FloatingHearts';
import { MusicControl } from './MusicControl';
import { questionCategories, Question } from '@/data/questions';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';

type GameState = 'welcome' | 'setup' | 'categories' | 'playing' | 'results';

interface PlayerAnswers {
  player1: (number | null)[];
  player2: (number | null)[];
}

export function LoveTriangleGame() {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['classic']);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<PlayerAnswers>({
    player1: [],
    player2: []
  });
  
  const music = useBackgroundMusic();

  // Get all selected questions
  useEffect(() => {
    const selectedQuestions = questionCategories
      .filter(cat => selectedCategories.includes(cat.id))
      .flatMap(cat => cat.questions);
    setQuestions(selectedQuestions);
    setAnswers({
      player1: Array(selectedQuestions.length).fill(null),
      player2: Array(selectedQuestions.length).fill(null)
    });
  }, [selectedCategories]);

  // Update music intensity based on match rate
  useEffect(() => {
    if (gameState === 'playing' && questions.length > 0) {
      const matchCount = getCurrentMatchCount();
      const matchRate = matchCount / (currentQuestionIndex + 1);
      music.updateIntensity(matchRate);
    }
  }, [currentQuestionIndex, answers, gameState]);

  const handleStartGame = () => {
    // Start ambient music as soon as the user starts the game (user gesture required for autoplay).
    music.play('low');
    setGameState('setup');
  };

  const handleSetupComplete = (p1: string, p2: string) => {
    setPlayer1Name(p1);
    setPlayer2Name(p2);
    setGameState('categories');
  };

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handleStartQuiz = () => {
    setCurrentQuestionIndex(0);
    setGameState('playing');
    music.play('low');
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
      music.pause();
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
    setSelectedCategories(['classic']);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setAnswers({
      player1: [],
      player2: []
    });
    music.pause();
  };

  return (
    <div className="relative">
      <FloatingHearts />
      
      {/* Music Control - show after welcome */}
      {gameState !== 'welcome' && (
        <MusicControl
          isPlaying={music.isPlaying}
          isMuted={music.isMuted}
          onToggle={music.toggle}
          onToggleMute={music.toggleMute}
        />
      )}
      
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

        {gameState === 'categories' && (
          <CategorySelection
            key="categories"
            categories={questionCategories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            onStart={handleStartQuiz}
            onBack={() => setGameState('setup')}
            player1Name={player1Name}
            player2Name={player2Name}
          />
        )}
        
        {gameState === 'playing' && questions.length > 0 && (
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
            selectedCategories={selectedCategories}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
