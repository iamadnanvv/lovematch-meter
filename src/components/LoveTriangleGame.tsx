import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from './WelcomeScreen';
import { PlayerSetup } from './PlayerSetup';
import { CategorySelection } from './CategorySelection';
import { QuestionCard } from './QuestionCard';
import { ResultsScreen } from './ResultsScreen';
import { FloatingHearts } from './FloatingHearts';
import { MusicControl } from './MusicControl';
import { ValentineCountdown } from './ValentineCountdown';
import { GameModeSelection } from './GameModeSelection';
import { LoveLanguageMatcher } from './LoveLanguageMatcher';
import { FlagAnalyzer } from './FlagAnalyzer';
import { TruthOrDare } from './TruthOrDare';
import { InstallPrompt } from './InstallPrompt';
import { questionCategories, Question } from '@/data/questions';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { useDevToolsProtection } from '@/hooks/useDevToolsProtection';
import { useValentineScarcity } from '@/hooks/useValentineScarcity';
import { LockScreen } from './LockScreen';
import { ExpiredScreen } from './ExpiredScreen';

type GameState = 'welcome' | 'setup' | 'mode-select' | 'categories' | 'playing' | 'results' | 'love-language' | 'love-language-results' | 'flags' | 'flags-results' | 'truth-dare';

interface PlayerAnswers {
  player1: (number | null)[];
  player2: (number | null)[];
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

interface FlagResults {
  redFlags: any[];
  greenFlags: any[];
  blindSpots: string[];
  strengths: string[];
  overallHealth: number;
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
  const [loveLanguageResults, setLoveLanguageResults] = useState<LoveLanguageResults | null>(null);
  const [flagResults, setFlagResults] = useState<FlagResults | null>(null);
  
  const music = useBackgroundMusic();
  const { isLocked, unlock } = useDevToolsProtection();
  const { isExpired } = useValentineScarcity();

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
    music.play('low');
    setGameState('setup');
  };

  const handleSetupComplete = (p1: string, p2: string) => {
    setPlayer1Name(p1);
    setPlayer2Name(p2);
    setGameState('mode-select');
  };

  const handleSelectMode = (mode: string) => {
    switch (mode) {
      case 'classic':
        setGameState('categories');
        break;
      case 'love-language':
        setGameState('love-language');
        break;
      case 'flags':
        setGameState('flags');
        break;
      case 'truth-dare':
        setGameState('truth-dare');
        break;
      default:
        setGameState('categories');
    }
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

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
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
    setLoveLanguageResults(null);
    setFlagResults(null);
    music.pause();
  };

  const handleLoveLanguageComplete = (results: LoveLanguageResults) => {
    setLoveLanguageResults(results);
    setGameState('love-language-results');
  };

  const handleFlagComplete = (results: FlagResults) => {
    setFlagResults(results);
    setGameState('flags-results');
  };

  // Show expired screen if Valentine's Day has passed
  if (isExpired) {
    return <ExpiredScreen onNotifyMe={() => alert('Thanks! We\'ll notify you next year.')} />;
  }

  // Show lock screen if DevTools detected
  if (isLocked) {
    return <LockScreen onClose={unlock} />;
  }

  return (
    <div className="relative">
      <FloatingHearts />
      
      {/* Valentine Countdown Banner */}
      {gameState !== 'welcome' && (
        <div className="fixed top-0 left-0 right-0 z-40">
          <ValentineCountdown variant="banner" />
        </div>
      )}
      
      {/* Music Control - show after welcome */}
      {gameState !== 'welcome' && (
        <MusicControl
          isPlaying={music.isPlaying}
          isMuted={music.isMuted}
          onToggle={music.toggle}
          onToggleMute={music.toggleMute}
        />
      )}

      {/* Install Prompt */}
      <InstallPrompt variant="banner" />
      
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

        {gameState === 'mode-select' && (
          <GameModeSelection
            key="mode-select"
            player1Name={player1Name}
            player2Name={player2Name}
            onSelectMode={handleSelectMode}
            onBack={() => setGameState('setup')}
          />
        )}

        {gameState === 'categories' && (
          <CategorySelection
            key="categories"
            categories={questionCategories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            onStart={handleStartQuiz}
            onBack={() => setGameState('mode-select')}
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
            onPrevious={handlePreviousQuestion}
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
            player1Answers={answers.player1.filter((a): a is number => a !== null)}
          />
        )}

        {gameState === 'love-language' && (
          <LoveLanguageMatcher
            key="love-language"
            player1Name={player1Name}
            player2Name={player2Name}
            onComplete={handleLoveLanguageComplete}
          />
        )}

        {gameState === 'love-language-results' && loveLanguageResults && (
          <ResultsScreen
            key="love-language-results"
            player1Name={player1Name}
            player2Name={player2Name}
            matchCount={Math.round((loveLanguageResults.alignment / 100) * 5)}
            totalQuestions={5}
            onPlayAgain={handlePlayAgain}
            selectedCategories={['love-language']}
            player1Answers={[]}
          />
        )}

        {gameState === 'flags' && (
          <FlagAnalyzer
            key="flags"
            player1Name={player1Name}
            player2Name={player2Name}
            onComplete={handleFlagComplete}
          />
        )}

        {gameState === 'flags-results' && flagResults && (
          <ResultsScreen
            key="flags-results"
            player1Name={player1Name}
            player2Name={player2Name}
            matchCount={Math.round((flagResults.overallHealth / 100) * 10)}
            totalQuestions={10}
            onPlayAgain={handlePlayAgain}
            selectedCategories={['flags']}
            player1Answers={[]}
          />
        )}

        {gameState === 'truth-dare' && (
          <TruthOrDare
            key="truth-dare"
            player1Name={player1Name}
            player2Name={player2Name}
            onComplete={handlePlayAgain}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
