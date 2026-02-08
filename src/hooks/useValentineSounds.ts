import { useCallback, useRef, useState, useEffect } from 'react';

// Royalty-free sound effect URLs from Pixabay
const SOUND_EFFECTS = {
  yes: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749bf83.mp3', // Soft romantic chime
  noEscape: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d1717a8b9c.mp3', // Playful bounce/boing
};

type ValentineSound = 'yes' | 'noEscape';

export function useValentineSounds() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem('valentine-sfx-muted');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('valentine-sfx-muted', String(isMuted));
  }, [isMuted]);

  const playSound = useCallback((sound: ValentineSound) => {
    if (isMuted) return;

    try {
      // Stop any currently playing sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(SOUND_EFFECTS[sound]);
      audio.volume = sound === 'yes' ? 0.6 : 0.4; // Yes is slightly louder
      audioRef.current = audio;
      
      audio.play().catch((err) => {
        console.log('Sound playback requires user interaction:', err);
      });
    } catch (err) {
      console.log('Failed to play valentine sound:', err);
    }
  }, [isMuted]);

  const playYesSound = useCallback(() => {
    playSound('yes');
  }, [playSound]);

  const playNoEscapeSound = useCallback(() => {
    playSound('noEscape');
  }, [playSound]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  return {
    isMuted,
    toggleMute,
    playYesSound,
    playNoEscapeSound,
    cleanup,
  };
}
