import { useEffect, useState, useCallback } from 'react';

interface ProtectionConfig {
  disableRightClick?: boolean;
  disableDevToolsShortcuts?: boolean;
  detectDevTools?: boolean;
  showLockScreen?: boolean;
}

export function useDevToolsProtection(config: ProtectionConfig = {}) {
  const {
    disableRightClick = true,
    disableDevToolsShortcuts = true,
    detectDevTools = true,
    showLockScreen = true,
  } = config;

  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Console warning
  useEffect(() => {
    const warningStyle = 'color: #ff6b8a; font-size: 24px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);';
    console.log('%c🔒 Love Triangle Security', warningStyle);
    console.log('%cThis is a protected experience. Tampering with this application violates our terms of service and may result in your session being invalidated.', 'color: #888; font-size: 14px;');
    console.log('%c💕 If you\'re curious about how we built this, reach out to us instead!', 'color: #d4a574; font-size: 12px;');
  }, []);

  // Disable right-click
  useEffect(() => {
    if (!disableRightClick) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [disableRightClick]);

  // Disable DevTools shortcuts
  useEffect(() => {
    if (!disableDevToolsShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I / Cmd+Option+I (Inspector)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C / Cmd+Option+C (Element picker)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U / Cmd+U (View source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [disableDevToolsShortcuts]);

  // Detect DevTools via window size delta
  useEffect(() => {
    if (!detectDevTools) return;

    const threshold = 160;
    let wasOpen = false;

    const checkDevTools = () => {
      const widthDelta = window.outerWidth - window.innerWidth;
      const heightDelta = window.outerHeight - window.innerHeight;
      
      const isOpen = widthDelta > threshold || heightDelta > threshold;
      
      if (isOpen !== wasOpen) {
        wasOpen = isOpen;
        setIsDevToolsOpen(isOpen);
        
        if (isOpen && showLockScreen) {
          setIsLocked(true);
        }
      }
    };

    const interval = setInterval(checkDevTools, 500);
    window.addEventListener('resize', checkDevTools);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkDevTools);
    };
  }, [detectDevTools, showLockScreen]);

  const unlock = useCallback(() => {
    if (!isDevToolsOpen) {
      setIsLocked(false);
    }
  }, [isDevToolsOpen]);

  return {
    isDevToolsOpen,
    isLocked,
    unlock,
  };
}
