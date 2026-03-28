import { useCallback, useRef, useState, useEffect } from 'react';

// Royalty-free sound URLs
const FEATURE_SOUNDS = {
  crack: 'https://cdn.pixabay.com/audio/2022/03/10/audio_e63506af30.mp3',       // Cracking / snap
  escalate: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749bf83.mp3',    // Ascending chime
  complete: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b5f6f.mp3',    // Party pop / tada
  vote: 'https://cdn.pixabay.com/audio/2021/08/04/audio_c8c8a73467.mp3',        // Quick ding
};

export type FeatureSoundEffect = keyof typeof FEATURE_SOUNDS;

export function useFeatureSounds() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem('love-triangle-sfx-muted');
    return stored === 'true';
  });

  // Sync with the same key used by celebration sounds
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem('love-triangle-sfx-muted');
      setIsMuted(stored === 'true');
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const play = useCallback((effect: FeatureSoundEffect) => {
    if (isMuted) return;
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(FEATURE_SOUNDS[effect]);
      audio.volume = 0.4;
      audioRef.current = audio;
      audio.play().catch(() => {});
    } catch {
      // silent
    }
  }, [isMuted]);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  return { play, cleanup, isMuted };
}
