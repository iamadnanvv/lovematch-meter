import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Loader2, Download, Share2, X, Sparkles, Heart, AlertTriangle, Zap, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PhotoScoreCardProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

type Verdict = {
  badge: string;
  color: string;
  icon: React.ReactNode;
  bgClass: string;
};

function getVerdict(score: number): Verdict {
  if (score >= 90) {
    return { badge: 'Power Couple', color: 'text-amber-500', icon: <Crown className="w-5 h-5" />, bgClass: 'from-amber-500/20 to-yellow-500/20' };
  } else if (score >= 75) {
    return { badge: 'Soulmates', color: 'text-primary', icon: <Heart className="w-5 h-5" />, bgClass: 'from-primary/20 to-pink-500/20' };
  } else if (score >= 60) {
    return { badge: 'Growing Strong', color: 'text-emerald-500', icon: <Sparkles className="w-5 h-5" />, bgClass: 'from-emerald-500/20 to-green-500/20' };
  } else if (score >= 40) {
    return { badge: 'Fixable', color: 'text-blue-500', icon: <Zap className="w-5 h-5" />, bgClass: 'from-blue-500/20 to-cyan-500/20' };
  } else {
    return { badge: 'High Risk', color: 'text-orange-500', icon: <AlertTriangle className="w-5 h-5" />, bgClass: 'from-orange-500/20 to-red-500/20' };
  }
}

export function PhotoScoreCard({ player1Name, player2Name, score }: PhotoScoreCardProps) {
  const [open, setOpen] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const verdict = getVerdict(score);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image too large. Please use an image under 10MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPhoto(event.target?.result as string);
        setGeneratedCard(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const generateOverlayCard = useCallback(async () => {
    if (!uploadedPhoto || !canvasRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Create image from uploaded photo
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = uploadedPhoto;
      });

      // Set canvas size (1:1 for Instagram)
      const size = 1080;
      canvas.width = size;
      canvas.height = size;

      // Draw and crop image to square
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

      // Add gradient overlay at bottom
      const gradient = ctx.createLinearGradient(0, size * 0.5, 0, size);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Add top gradient for branding
      const topGradient = ctx.createLinearGradient(0, 0, 0, size * 0.15);
      topGradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      topGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = topGradient;
      ctx.fillRect(0, 0, size, size * 0.15);

      // Draw Love Triangle branding at top
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('Love Triangle', size / 2, 60);

      // Draw score circle
      const circleX = size / 2;
      const circleY = size * 0.65;
      const circleRadius = 100;

      // Circle background with glow
      ctx.shadowColor = 'rgba(236, 72, 153, 0.5)';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(236, 72, 153, 0.9)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner circle
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius - 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fill();

      // Score text
      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 64px "Quicksand", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${score}%`, circleX, circleY);

      // Draw verdict badge
      ctx.font = 'bold 42px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.fillText(verdict.badge, size / 2, size * 0.82);
      ctx.shadowBlur = 0;

      // Draw couple names
      ctx.font = '36px "Quicksand", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(`${player1Name} & ${player2Name}`, size / 2, size * 0.9);

      // Draw decorative hearts
      ctx.font = '32px Arial';
      ctx.fillText('💕', size * 0.15, size * 0.88);
      ctx.fillText('💕', size * 0.85, size * 0.88);

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setGeneratedCard(dataUrl);
    } catch (err) {
      console.error('Error generating card:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate card');
    } finally {
      setIsGenerating(false);
    }
  }, [uploadedPhoto, score, player1Name, player2Name, verdict.badge]);

  const handleDownload = useCallback(() => {
    if (!generatedCard) return;
    
    const link = document.createElement('a');
    link.href = generatedCard;
    link.download = `love-triangle-${player1Name}-${player2Name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedCard, player1Name, player2Name]);

  const handleShare = useCallback(async () => {
    if (!generatedCard) return;

    try {
      const response = await fetch(generatedCard);
      const blob = await response.blob();
      const file = new File([blob], 'love-triangle-result.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Love Triangle Results',
          text: `${player1Name} & ${player2Name} scored ${score}%! ${verdict.badge} 💕`,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'Love Triangle Results',
          text: `${player1Name} & ${player2Name} scored ${score}%! ${verdict.badge} 💕`,
          url: window.location.href,
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Share failed:', err);
      handleDownload();
    }
  }, [generatedCard, player1Name, player2Name, score, verdict.badge, handleDownload]);

  const reset = useCallback(() => {
    setUploadedPhoto(null);
    setGeneratedCard(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          className={`w-full py-4 px-6 rounded-full font-semibold text-foreground border-2 border-primary/30 bg-gradient-to-r ${verdict.bgClass} backdrop-blur-sm flex items-center justify-center gap-3`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Camera className="w-5 h-5 text-primary" />
          <span>Upload Couple Photo</span>
          <span className={`${verdict.color} font-bold`}>{verdict.badge}</span>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Create Your Score Card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* File input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!uploadedPhoto ? (
            <motion.button
              className="w-full aspect-square rounded-xl border-2 border-dashed border-primary/50 bg-rose-light/50 flex flex-col items-center justify-center gap-4 hover:bg-rose-light transition-colors"
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Upload a Couple Photo</p>
                <p className="text-sm text-muted-foreground">JPG, PNG up to 10MB</p>
              </div>
            </motion.button>
          ) : !generatedCard ? (
            <div className="space-y-4">
              {/* Preview uploaded photo */}
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={uploadedPhoto}
                  alt="Uploaded couple photo"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={reset}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Preview overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-bold">
                    {verdict.icon}
                    {verdict.badge}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <motion.button
                className="gold-button w-full"
                onClick={generateOverlayCard}
                disabled={isGenerating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Card...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Score Card
                  </span>
                )}
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Generated card preview */}
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
                <img
                  src={generatedCard}
                  alt="Generated score card"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  className="love-button flex items-center justify-center gap-2"
                  onClick={handleShare}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </motion.button>
                <motion.button
                  className="gold-button flex items-center justify-center gap-2"
                  onClick={handleDownload}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-5 h-5" />
                  Download
                </motion.button>
              </div>

              <button
                onClick={reset}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Upload a different photo
              </button>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            📸 Optimized for Instagram Stories & Posts
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
