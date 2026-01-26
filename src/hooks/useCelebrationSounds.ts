import { useCallback, useRef, useState, useEffect } from 'react';

// Free sound effect URLs (royalty-free from Pixabay)
const SOUND_EFFECTS = {
  hearts: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749bf83.mp3', // Soft chime
  confetti: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b5f6f.mp3', // Party pop
  gold: 'https://cdn.pixabay.com/audio/2021/08/04/audio_c8c8a73467.mp3', // Victory fanfare
};

type CelebrationTier = 'hearts' | 'confetti' | 'gold';

export function useCelebrationSounds() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    // Persist mute preference
    const stored = localStorage.getItem('love-triangle-sfx-muted');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('love-triangle-sfx-muted', String(isMuted));
  }, [isMuted]);

  const playSound = useCallback((tier: CelebrationTier) => {
    if (isMuted) return;

    try {
      // Stop any currently playing sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(SOUND_EFFECTS[tier]);
      audio.volume = 0.5;
      audioRef.current = audio;
      
      audio.play().catch((err) => {
        console.log('Sound playback requires user interaction:', err);
      });
    } catch (err) {
      console.log('Failed to play celebration sound:', err);
    }
  }, [isMuted]);

  const playCelebration = useCallback((score: number) => {
    if (score === 100) {
      playSound('gold');
    } else if (score >= 80) {
      playSound('confetti');
    } else if (score >= 60) {
      playSound('hearts');
    }
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
    playCelebration,
    cleanup,
  };
}
