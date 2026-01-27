import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Loader2, Download, Share2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PhotoResultCardProps {
  player1Name: string;
  player2Name: string;
  score: number;
  verdict: string;
}

const VERDICTS: Record<string, { label: string; color: string }> = {
  'power-couple': { label: 'Power Couple 💪', color: 'from-amber-500 to-yellow-500' },
  'soulmates': { label: 'Soulmates 💕', color: 'from-pink-500 to-rose-500' },
  'great-match': { label: 'Great Match ✨', color: 'from-violet-500 to-purple-500' },
  'growing': { label: 'Growing Together 🌱', color: 'from-green-500 to-emerald-500' },
  'work-in-progress': { label: 'Work in Progress 💭', color: 'from-blue-500 to-cyan-500' },
};

function getVerdict(score: number): string {
  if (score >= 90) return 'power-couple';
  if (score >= 80) return 'soulmates';
  if (score >= 60) return 'great-match';
  if (score >= 40) return 'growing';
  return 'work-in-progress';
}

export function PhotoResultCard({ player1Name, player2Name, score, verdict }: PhotoResultCardProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verdictInfo = VERDICTS[getVerdict(score)];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
        setGeneratedCard(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateCard = async () => {
    if (!photo) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await supabase.functions.invoke('generate-photo-card', {
        body: {
          photo,
          player1Name,
          player2Name,
          score,
          verdict: verdictInfo.label,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.imageUrl) {
        setGeneratedCard(response.data.imageUrl);
      } else {
        throw new Error('No image returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate card');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedCard) return;

    try {
      const response = await fetch(generatedCard);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `love-triangle-${player1Name}-${player2Name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleShare = async () => {
    if (!generatedCard) return;

    try {
      const response = await fetch(generatedCard);
      const blob = await response.blob();
      const file = new File([blob], 'love-triangle-result.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Love Triangle Results',
          text: `${player1Name} & ${player2Name} scored ${score}% on Love Triangle! 💕`,
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Photo Upload Area */}
      {!generatedCard && (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!photo ? (
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-4 bg-rose-light/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Upload Your Couple Photo</p>
                <p className="text-sm text-muted-foreground">Add a photo to create your personalized result card</p>
              </div>
            </motion.button>
          ) : (
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <img src={photo} alt="Couple photo" className="w-full h-full object-cover" />
              
              {/* Overlay preview */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <div className={`inline-flex self-start items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${verdictInfo.color} text-white text-sm font-bold mb-2`}>
                  {verdictInfo.label}
                </div>
                <div className="text-white">
                  <p className="text-3xl font-bold">{score}%</p>
                  <p className="text-lg opacity-90">{player1Name} & {player2Name}</p>
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => {
                  setPhoto(null);
                  setError(null);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Generated Card */}
      <AnimatePresence>
        {generatedCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden"
          >
            <img src={generatedCard} alt="Generated result card" className="w-full h-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {/* Actions */}
      {photo && !generatedCard && (
        <motion.button
          onClick={handleGenerateCard}
          disabled={isGenerating}
          className="gold-button w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Shareable Card
            </span>
          )}
        </motion.button>
      )}

      {generatedCard && (
        <div className="flex gap-3">
          <motion.button
            onClick={handleShare}
            className="love-button flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Share
            </span>
          </motion.button>
          <motion.button
            onClick={handleDownload}
            className="gold-button flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
