import { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, RotateCcw, Sparkles, Download, Image, X, Loader2, Camera } from 'lucide-react';
import { getCompatibilityLevel, questionCategories } from '@/data/questions';
import { LoveMeter } from './LoveMeter';
import { HeartbeatAnimation } from './HeartbeatAnimation';
import { useGenerateResultCard } from '@/hooks/useGenerateResultCard';
import { useCelebrationSounds } from '@/hooks/useCelebrationSounds';
import logoImage from '@/assets/love-triangle-logo.png';
import { CelebrationEffects } from '@/components/results/CelebrationEffects';
import { DonationDialog } from '@/components/results/DonationDialog';
import { ShareCaptionGenerator } from '@/components/results/ShareCaptionGenerator';
import { ValentineLetter } from '@/components/results/ValentineLetter';
import { SurpriseGift } from '@/components/results/SurpriseGift';
import { PlayWithFriend } from '@/components/results/PlayWithFriend';
import { SoundToggle } from '@/components/results/SoundToggle';
import { RelationshipBadge } from '@/components/results/RelationshipBadge';
import { PhotoResultCard } from '@/components/results/PhotoResultCard';
import { EnhancedDonationPopup } from '@/components/EnhancedDonationPopup';

interface ResultsScreenProps {
  player1Name: string;
  player2Name: string;
  matchCount: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  selectedCategories: string[];
  player1Answers?: number[];
}

export function ResultsScreen({
  player1Name,
  player2Name,
  matchCount,
  totalQuestions,
  onPlayAgain,
  selectedCategories,
  player1Answers = []
}: ResultsScreenProps) {
  const score = Math.round((matchCount / totalQuestions) * 100);
  const compatibility = getCompatibilityLevel(score)
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPhotoCard, setShowPhotoCard] = useState(false);
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const [donationVariant, setDonationVariant] = useState<'reveal' | 'download' | 'share'>('reveal');
  const celebrationSounds = useCelebrationSounds();
  
  const { 
    isGenerating, 
    generatedImageUrl, 
    error, 
    generateCard, 
    downloadImage, 
    shareImage,
    reset 
  } = useGenerateResultCard();

  // Cleanup sounds on unmount
  useEffect(() => {
    return () => celebrationSounds.cleanup();
  }, [celebrationSounds]);

  const handleCelebrationTrigger = useCallback(() => {
    celebrationSounds.playCelebration(score);
  }, [celebrationSounds, score]);

  const categoryNames = selectedCategories
    .map(id => questionCategories.find(c => c.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  const donationLink = useMemo(() => 'https://razorpay.me/@adnan4402', []);

  const handleShare = async () => {
    const shareText = `💕 ${player1Name} & ${player2Name} scored ${score}% on Love Triangle! ${compatibility.emoji}\n\n${compatibility.title} - ${compatibility.message}\n\nCategories: ${categoryNames}\n\nPlay now: `;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Love Triangle Results',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText + window.location.href);
      alert('Results copied to clipboard!');
    }
  };

  const handleGenerateCard = async () => {
    setShowImageModal(true);
    try {
      await generateCard({
        player1Name,
        player2Name,
        score,
        message: compatibility.message,
        title: compatibility.title
      });
    } catch (err) {
      console.error('Failed to generate card:', err);
    }
  };

  const handleDownload = async () => {
    if (generatedImageUrl) {
      await downloadImage(generatedImageUrl, `love-triangle-${player1Name}-${player2Name}.png`);
    }
  };

  const handleShareImage = async () => {
    if (generatedImageUrl) {
      const shared = await shareImage(
        generatedImageUrl,
        'Love Triangle Results',
        `${player1Name} & ${player2Name} scored ${score}% on Love Triangle! 💕`
      );
      if (!shared) {
        // Fallback: download instead
        await handleDownload();
      }
    }
  };

  return (
    <>
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="love-card p-8 md:p-10 max-w-lg w-full text-center overflow-hidden relative"
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Sound Toggle */}
          <div className="absolute top-4 right-4 z-10">
            <SoundToggle isMuted={celebrationSounds.isMuted} onToggle={celebrationSounds.toggleMute} />
          </div>

          {/* Celebration overlay (reduced-motion safe) */}
          <CelebrationEffects score={score} onTrigger={handleCelebrationTrigger} />

          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
          
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-4"
          >
            <img src={logoImage} alt="Love Triangle" className="w-20 h-20 mx-auto" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-love mb-2">
              {compatibility.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              {player1Name} & {player2Name}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Categories: {categoryNames}
            </p>
          </motion.div>

          {/* Score Circle */}
          <motion.div
            className="relative mx-auto mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <div className="w-40 h-40 mx-auto relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="hsl(var(--rose-light))"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={440}
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * score) / 100 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <HeartbeatAnimation intensity="high" size="sm" />
                <motion.span 
                  className="text-3xl font-bold text-foreground mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {score}%
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  <Heart 
                    className={`w-6 h-6 ${
                      i < Math.ceil(score / 20) 
                        ? 'text-primary fill-primary' 
                        : 'text-rose-light'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {compatibility.message}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="p-4 rounded-xl bg-rose-light">
              <div className="text-2xl font-bold text-primary">{matchCount}</div>
              <div className="text-sm text-muted-foreground">Matching Answers</div>
            </div>
            <div className="p-4 rounded-xl bg-gold-light">
              <div className="text-2xl font-bold text-accent">{totalQuestions - matchCount}</div>
              <div className="text-sm text-muted-foreground">Different Views</div>
            </div>
          </motion.div>

          {/* Share Caption Generator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <ShareCaptionGenerator
              player1Name={player1Name}
              player2Name={player2Name}
              score={score}
              categoryNames={categoryNames}
            />
          </motion.div>

          {/* Actions */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {/* Surprise Gift */}
            <SurpriseGift player1Name={player1Name} player2Name={player2Name} score={score} />

            {/* Photo Result Card */}
            <motion.button
              className="w-full p-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold"
              onClick={() => setShowPhotoCard(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" />
                Create Photo Result Card
              </span>
            </motion.button>

            {/* Relationship Badge */}
            <RelationshipBadge player1Name={player1Name} player2Name={player2Name} score={score} />

            {/* Generate Image Card Button */}
            <motion.button
              className="gold-button w-full"
              onClick={handleGenerateCard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <Image className="w-5 h-5" />
                Create AI Shareable Card
              </span>
            </motion.button>

            {/* Valentine Letter */}
            <ValentineLetter player1Name={player1Name} player2Name={player2Name} score={score} />

            {/* Play with Friend */}
            <PlayWithFriend
              player1Name={player1Name}
              selectedCategories={selectedCategories}
              player1Answers={player1Answers}
            />

            {/* Donation */}
            <DonationDialog href={donationLink} player1Name={player1Name} player2Name={player2Name} />

            <div className="flex gap-3">
              <motion.button
                className="love-button flex-1"
                onClick={handleShare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </span>
              </motion.button>
              
              <motion.button
                className="love-button-outline flex-1"
                onClick={onPlayAgain}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Branding */}
          <motion.div
            className="mt-8 pt-6 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Made with love by</span>
              <span className="font-bold text-gradient-love">Love Triangle</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Image Generation Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowImageModal(false);
              reset();
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
                  Your Shareable Card
                </h3>
                <button
                  onClick={() => {
                    setShowImageModal(false);
                    reset();
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
                    <p className="text-muted-foreground">Creating your card...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment</p>
                  </div>
                ) : error ? (
                  <div className="text-center p-4">
                    <p className="text-destructive mb-2">Failed to generate image</p>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <button
                      onClick={handleGenerateCard}
                      className="love-button-outline px-4 py-2"
                    >
                      Try Again
                    </button>
                  </div>
                ) : generatedImageUrl ? (
                  <img 
                    src={generatedImageUrl} 
                    alt="Your Love Triangle Result" 
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              {generatedImageUrl && !isGenerating && (
                <div className="flex gap-3">
                  <motion.button
                    className="love-button flex-1"
                    onClick={handleShareImage}
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
                    onClick={handleDownload}
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

      {/* Photo Card Modal */}
      <AnimatePresence>
        {showPhotoCard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPhotoCard(false)}
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
                  Photo Result Card
                </h3>
                <button
                  onClick={() => setShowPhotoCard(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <PhotoResultCard
                player1Name={player1Name}
                player2Name={player2Name}
                score={score}
                verdict={compatibility.title}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Donation Popup */}
      <EnhancedDonationPopup
        player1Name={player1Name}
        player2Name={player2Name}
        score={score}
        isOpen={showDonationPopup}
        onClose={() => setShowDonationPopup(false)}
        onDonate={() => setShowDonationPopup(false)}
        variant={donationVariant}
      />
    </>
  );
}
