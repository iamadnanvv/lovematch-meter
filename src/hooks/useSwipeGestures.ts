import { useState, useCallback, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  isDragging: boolean;
  dragOffset: number;
}

const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 0.3;

export function useSwipeGestures(handlers: SwipeHandlers) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const stateRef = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    isDragging: false,
    dragOffset: 0,
  });
  const startTimeRef = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    stateRef.current = {
      startX: clientX,
      startY: clientY,
      isDragging: true,
      dragOffset: 0,
    };
    startTimeRef.current = Date.now();
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!stateRef.current.isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - stateRef.current.startX;
    
    stateRef.current.dragOffset = deltaX;
    setDragOffset(deltaX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!stateRef.current.isDragging) return;
    
    const { dragOffset: offset, startX, startY } = stateRef.current;
    const duration = Date.now() - startTimeRef.current;
    const velocity = Math.abs(offset) / duration;
    
    const isSwipe = Math.abs(offset) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD;
    
    if (isSwipe) {
      if (offset < -SWIPE_THRESHOLD && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      } else if (offset > SWIPE_THRESHOLD && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      }
    }
    
    stateRef.current = {
      startX: 0,
      startY: 0,
      isDragging: false,
      dragOffset: 0,
    };
    setIsDragging(false);
    setDragOffset(0);
  }, [handlers]);

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleTouchStart,
    onMouseMove: handleTouchMove,
    onMouseUp: handleTouchEnd,
    onMouseLeave: handleTouchEnd,
  };

  return {
    swipeHandlers,
    dragOffset,
    isDragging,
  };
}
