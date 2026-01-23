import { useEffect, useRef, useState, useCallback } from 'react';

// Romantic ambient music URLs (royalty-free)
const MUSIC_TRACKS = {
  low: 'https://cdn.pixabay.com/audio/2024/11/14/audio_fcfb30f51f.mp3', // Soft romantic
  medium: 'https://cdn.pixabay.com/audio/2024/02/15/audio_be4e1f3ed4.mp3', // Romantic piano
  high: 'https://cdn.pixabay.com/audio/2022/10/18/audio_af87e96031.mp3', // Uplifting romantic
};

type MusicIntensity = 'low' | 'medium' | 'high';

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIntensity, setCurrentIntensity] = useState<MusicIntensity>('low');
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback(async (intensity: MusicIntensity = 'low') => {
    if (!audioRef.current) return;
    
    try {
      // Only change track if intensity changed
      if (intensity !== currentIntensity || !isPlaying) {
        audioRef.current.src = MUSIC_TRACKS[intensity];
        setCurrentIntensity(intensity);
      }
      
      audioRef.current.volume = isMuted ? 0 : volume;
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.log('Audio playback requires user interaction');
    }
  }, [currentIntensity, isPlaying, volume, isMuted]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play(currentIntensity);
    }
  }, [isPlaying, pause, play, currentIntensity]);

  const updateIntensity = useCallback((matchRate: number) => {
    let newIntensity: MusicIntensity;
    if (matchRate >= 0.6) {
      newIntensity = 'high';
    } else if (matchRate >= 0.3) {
      newIntensity = 'medium';
    } else {
      newIntensity = 'low';
    }
    
    if (newIntensity !== currentIntensity && isPlaying) {
      play(newIntensity);
    }
  }, [currentIntensity, isPlaying, play]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.volume = newMuted ? 0 : volume;
      setIsMuted(newMuted);
    }
  }, [isMuted, volume]);

  const setVolumeLevel = useCallback((newVolume: number) => {
    if (audioRef.current) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      audioRef.current.volume = isMuted ? 0 : clampedVolume;
      setVolume(clampedVolume);
    }
  }, [isMuted]);

  return {
    isPlaying,
    isMuted,
    volume,
    currentIntensity,
    play,
    pause,
    toggle,
    toggleMute,
    setVolume: setVolumeLevel,
    updateIntensity,
  };
}
