import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ESCAPE_PHRASES = [
  "Are you sure?",
  "Think again 😅",
  "Pleaseee 🥺",
  "Pretty please? 💕",
  "Reconsider? 🙏",
  "One more chance?",
  "Really? 😢",
  "Nooo 😭",
  "Try again! 💖",
  "C'mon! 🥹"
];

interface EscapingNoButtonProps {
  onEscape?: () => void;
  onPlaySound?: () => void;
}

export function EscapingNoButton({ onEscape, onPlaySound }: EscapingNoButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [escapeCount, setEscapeCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRandomPosition = useCallback(() => {
    if (!containerRef.current || !buttonRef.current) return { x: 0, y: 0 };
    
    const container = containerRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate safe bounds (keep button visible)
    const maxX = Math.min(viewportWidth - button.width - 20, 200);
    const maxY = Math.min(viewportHeight - button.height - 100, 150);
    const minX = Math.max(-200, -(viewportWidth / 2) + button.width);
    const minY = Math.max(-100, -50);
    
    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;
    
    return { x, y };
  }, []);

  const handleEscape = useCallback(() => {
    const newPos = getRandomPosition();
    setPosition(newPos);
    
    // Shrink slightly with each escape (minimum 0.6)
    setScale(prev => Math.max(0.6, prev - 0.05));
    
    // Cycle through phrases
    setPhraseIndex(prev => (prev + 1) % ESCAPE_PHRASES.length);
    setEscapeCount(prev => prev + 1);
    
    // Play bounce sound
    onPlaySound?.();
    onEscape?.();
  }, [getRandomPosition, onEscape, onPlaySound]);

  // Handle both hover and touch
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    handleEscape();
  }, [handleEscape]);

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        animate={{ 
          x: position.x, 
          y: position.y,
          scale: scale
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
      >
        <Button
          ref={buttonRef}
          variant="outline"
          size="lg"
          className="px-8 py-6 text-lg font-semibold border-2 border-primary/30 text-muted-foreground hover:border-primary/50 hover:bg-rose-light/50 transition-all duration-200"
          onMouseEnter={handleInteraction}
          onTouchStart={handleInteraction}
          onClick={(e) => {
            e.preventDefault();
            handleEscape();
          }}
        >
          {escapeCount === 0 ? "No 💔" : ESCAPE_PHRASES[phraseIndex]}
        </Button>
      </motion.div>
    </div>
  );
}
