import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, Share2, Loader2, X, Sparkles } from 'lucide-react';

interface RelationshipBadgeProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

function getBadgeTier(score: number) {
  if (score === 100) return { tier: 'Legendary', color: 'from-amber-400 to-amber-600', icon: '👑' };
  if (score >= 80) return { tier: 'Epic', color: 'from-violet-400 to-violet-600', icon: '💎' };
  if (score >= 60) return { tier: 'Rare', color: 'from-blue-400 to-blue-600', icon: '⭐' };
  if (score >= 40) return { tier: 'Uncommon', color: 'from-emerald-400 to-emerald-600', icon: '💚' };
  return { tier: 'Common', color: 'from-slate-400 to-slate-600', icon: '✨' };
}

export function RelationshipBadge({ player1Name, player2Name, score }: RelationshipBadgeProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const badge = getBadgeTier(score);

  const generateBadge = async () => {
    setShowModal(true);
    setIsGenerating(true);
    setError(null);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-badge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          player1Name,
          player2Name,
          score,
          tier: badge.tier,
          icon: badge.icon,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate badge');
      }

      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate badge');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadBadge = async () => {
    if (!generatedImage) return;

    try {
      if (generatedImage.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `love-triangle-badge-${player1Name}-${player2Name}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `love-triangle-badge-${player1Name}-${player2Name}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const shareBadge = async () => {
    if (!generatedImage) return;

    try {
      let blob: Blob;
      if (generatedImage.startsWith('data:')) {
        const response = await fetch(generatedImage);
        blob = await response.blob();
      } else {
        const response = await fetch(generatedImage);
        blob = await response.blob();
      }

      const file = new File([blob], 'love-triangle-badge.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Love Triangle Badge',
          text: `${player1Name} & ${player2Name} earned the ${badge.tier} relationship badge! 💕`,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'My Love Triangle Badge',
          text: `${player1Name} & ${player2Name} earned the ${badge.tier} relationship badge! 💕`,
          url: window.location.href,
        });
      }
    } catch (err) {
      console.log('Share cancelled or failed:', err);
    }
  };

  return (
    <>
      <motion.button
        className="w-full p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-left group hover:border-primary/50 transition-all"
        onClick={generateBadge}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-2xl shadow-lg`}>
            {badge.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">Relationship Badge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {badge.tier} Tier • Tap to create & download
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-accent group-hover:animate-pulse" />
        </div>
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowModal(false);
              setGeneratedImage(null);
              setError(null);
            }}
          >
            <motion.div
              className="love-card p-6 max-w-md w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold text-foreground">
                  Your Relationship Badge
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setGeneratedImage(null);
                    setError(null);
                  }}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-square bg-rose-light rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-3" />
                    <p className="text-muted-foreground">Creating your badge...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment</p>
                  </div>
                ) : error ? (
                  <div className="text-center p-4">
                    <p className="text-destructive mb-2">Failed to generate badge</p>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <button
                      onClick={generateBadge}
                      className="love-button-outline px-4 py-2"
                    >
                      Try Again
                    </button>
                  </div>
                ) : generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="Your Relationship Badge" 
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              {generatedImage && !isGenerating && (
                <div className="flex gap-3">
                  <motion.button
                    className="love-button flex-1"
                    onClick={shareBadge}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Share
                    </span>
                  </motion.button>
                  <motion.button
                    className="gold-button flex-1"
                    onClick={downloadBadge}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
