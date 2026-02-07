import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EscapingNoButton } from '@/components/valentine/EscapingNoButton';
import { ValentineSuccess } from '@/components/valentine/ValentineSuccess';
import { BackgroundThemes, ThemeSelector, ThemeType } from '@/components/valentine/BackgroundThemes';
import { PhotoUpload } from '@/components/valentine/PhotoUpload';

type ValentineState = 'customize' | 'asking' | 'success';

export default function ValentineProposal() {
  const [searchParams] = useSearchParams();
  
  // Check if URL has pre-filled names
  const urlFrom = searchParams.get('from') || '';
  const urlTo = searchParams.get('to') || '';
  const hasUrlParams = !!(urlFrom || urlTo);
  
  const [state, setState] = useState<ValentineState>(hasUrlParams ? 'asking' : 'customize');
  const [yesScale, setYesScale] = useState(1);
  const [senderName, setSenderName] = useState(urlFrom);
  const [recipientName, setRecipientName] = useState(urlTo);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('hearts');
  const [couplePhoto, setCouplePhoto] = useState<string | null>(null);

  // Update names from URL params on mount
  useEffect(() => {
    if (urlFrom) setSenderName(urlFrom);
    if (urlTo) setRecipientName(urlTo);
  }, [urlFrom, urlTo]);

  const handleStartProposal = () => {
    setState('asking');
  };

  const handleYes = () => {
    setState('success');
  };

  const handleNoEscape = () => {
    setYesScale(prev => Math.min(1.5, prev + 0.1));
  };

  const handlePlayAgain = () => {
    setState('customize');
    setYesScale(1);
  };

  const getQuestionText = () => {
    if (recipientName && senderName) {
      return `${recipientName}, will you be ${senderName}'s Valentine?`;
    } else if (recipientName) {
      return `${recipientName}, will you be my Valentine?`;
    } else if (senderName) {
      return `Will you be ${senderName}'s Valentine?`;
    }
    return "Will you be my Valentine?";
  };

  const getShareableUrl = () => {
    const params = new URLSearchParams();
    if (senderName) params.set('from', senderName);
    if (recipientName) params.set('to', recipientName);
    const queryString = params.toString();
    return `${window.location.origin}/valentine${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-love relative overflow-hidden">
      <BackgroundThemes theme={selectedTheme} />
      
      <AnimatePresence mode="wait">
        {state === 'customize' ? (
          <motion.div
            key="customize"
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="love-card p-6 md:p-10 max-w-lg w-full text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {/* Header */}
              <motion.div
                className="flex justify-center gap-2 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
                <Edit3 className="w-6 h-6 text-primary" />
                <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
              </motion.div>

              <motion.h1
                className="font-display text-2xl md:text-3xl font-bold text-gradient-love mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Personalize Your Proposal
              </motion.h1>

              <motion.p
                className="text-muted-foreground text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Make it extra special 💕
              </motion.p>

              {/* Photo upload */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <PhotoUpload photo={couplePhoto} onPhotoChange={setCouplePhoto} />
              </motion.div>

              {/* Name inputs */}
              <motion.div
                className="space-y-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-left">
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Your name (optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="border-primary/20 focus:border-primary"
                    maxLength={30}
                  />
                </div>
                <div className="text-left">
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Their name (optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter their name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="border-primary/20 focus:border-primary"
                    maxLength={30}
                  />
                </div>
              </motion.div>

              {/* Theme selector */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label className="text-xs font-medium text-foreground mb-3 block">
                  Choose a theme
                </label>
                <ThemeSelector selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
              </motion.div>

              {/* Preview */}
              <motion.div
                className="p-3 bg-rose-light/50 rounded-xl border border-primary/10 mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                <p className="font-display text-base font-semibold text-gradient-love">
                  "{getQuestionText()}"
                </p>
              </motion.div>

              {/* Continue button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={handleStartProposal}
                  className="love-button w-full text-base"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Proposal
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : state === 'asking' ? (
          <motion.div
            key="asking"
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main card */}
            <motion.div
              className="love-card p-8 md:p-12 max-w-lg w-full text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {/* Couple photo if uploaded */}
              {couplePhoto && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-primary/30 shadow-xl">
                    <img
                      src={couplePhoto}
                      alt="Couple"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                  </div>
                  <motion.div
                    className="flex justify-center gap-1 mt-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                  </motion.div>
                </motion.div>
              )}

              {/* Decorative hearts (only if no photo) */}
              {!couplePhoto && (
                <motion.div
                  className="flex justify-center gap-2 mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Heart className="w-6 h-6 text-primary/40 fill-primary/20" />
                  <Heart className="w-8 h-8 text-primary fill-primary/30 heartbeat" />
                  <Heart className="w-6 h-6 text-primary/40 fill-primary/20" />
                </motion.div>
              )}

              {/* Main question */}
              <motion.h1
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-love mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {getQuestionText()}
              </motion.h1>

              <motion.p
                className="text-4xl mb-8"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                💖
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Yes button - grows when No escapes */}
                <motion.div
                  animate={{ scale: yesScale }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    onClick={handleYes}
                    className="love-button px-10 py-6 text-lg font-semibold"
                  >
                    <Heart className="w-5 h-5 mr-2 fill-current" />
                    Yes! 💕
                  </Button>
                </motion.div>

                {/* Escaping No button */}
                <EscapingNoButton onEscape={handleNoEscape} />
              </motion.div>

              {/* Subtle hint */}
              <motion.p
                className="text-xs text-muted-foreground/60 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Psst... the No button is a little shy 😉
              </motion.p>
            </motion.div>

            {/* Share encouragement */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Share this link with someone special
                <Sparkles className="w-4 h-4 text-accent" />
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <ValentineSuccess 
            key="success" 
            onPlayAgain={handlePlayAgain}
            senderName={senderName}
            recipientName={recipientName}
            shareableUrl={getShareableUrl()}
            couplePhoto={couplePhoto}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
