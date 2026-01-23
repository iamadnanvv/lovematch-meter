import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GenerateCardParams {
  player1Name: string;
  player2Name: string;
  score: number;
  message: string;
  title: string;
}

export function useGenerateResultCard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateCard = useCallback(async (params: GenerateCardParams) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-result-card`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(params),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImageUrl(data.imageUrl);
      return data.imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate result card';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const downloadImage = useCallback(async (imageUrl: string, filename: string = 'love-triangle-result.png') => {
    try {
      // For base64 images
      if (imageUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // For URL images
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      throw new Error('Failed to download image');
    }
  }, []);

  const shareImage = useCallback(async (imageUrl: string, title: string, text: string) => {
    try {
      // Convert base64 to blob for sharing
      let blob: Blob;
      
      if (imageUrl.startsWith('data:')) {
        const response = await fetch(imageUrl);
        blob = await response.blob();
      } else {
        const response = await fetch(imageUrl);
        blob = await response.blob();
      }

      const file = new File([blob], 'love-triangle-result.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title,
          text,
          files: [file],
        });
        return true;
      } else if (navigator.share) {
        // Fallback without file
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Share failed:', err);
      return false;
    }
  }, []);

  return {
    isGenerating,
    generatedImageUrl,
    error,
    generateCard,
    downloadImage,
    shareImage,
    reset: () => {
      setGeneratedImageUrl(null);
      setError(null);
    },
  };
}
