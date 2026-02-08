import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Edit3, Palette, Share2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EscapingNoButton } from '@/components/valentine/EscapingNoButton';
import { ValentineSuccess } from '@/components/valentine/ValentineSuccess';
import { BackgroundThemes, ThemeSelector, ThemeType } from '@/components/valentine/BackgroundThemes';
import { PhotoUpload } from '@/components/valentine/PhotoUpload';
import { useValentineSounds } from '@/hooks/useValentineSounds';
import { SoundToggle } from '@/components/results/SoundToggle';

type ValentineState = 'step1' | 'step2' | 'step3' | 'asking' | 'success';

const STEP_TITLES = {
  step1: 'Name & Details',
  step2: 'Choose Theme',
  step3: 'Share Link',
};

export default function ValentineProposal() {
  const [searchParams] = useSearchParams();
  
  // Check if URL has pre-filled names (skip to asking state)
  const urlFrom = searchParams.get('from') || '';
  const urlTo = searchParams.get('to') || '';
  const hasUrlParams = !!(urlFrom || urlTo);
  
  const [state, setState] = useState<ValentineState>(hasUrlParams ? 'asking' : 'step1');
  const [yesScale, setYesScale] = useState(1);
  const [senderName, setSenderName] = useState(urlFrom);
  const [recipientName, setRecipientName] = useState(urlTo);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('hearts');
  const [couplePhoto, setCouplePhoto] = useState<string | null>(null);

  const { isMuted, toggleMute, playYesSound, playNoEscapeSound, cleanup } = useValentineSounds();

  // Update names from URL params on mount
  useEffect(() => {
    if (urlFrom) setSenderName(urlFrom);
    if (urlTo) setRecipientName(urlTo);
  }, [urlFrom, urlTo]);

  // Cleanup sounds on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const handleNext = () => {
    if (state === 'step1') setState('step2');
    else if (state === 'step2') setState('step3');
    else if (state === 'step3') setState('asking');
  };

  const handleBack = () => {
    if (state === 'step2') setState('step1');
    else if (state === 'step3') setState('step2');
  };

  const handleYes = () => {
    playYesSound();
    setState('success');
  };

  const handleNoEscape = () => {
    setYesScale(prev => Math.min(1.5, prev + 0.1));
  };

  const handlePlayAgain = () => {
    setState('step1');
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

  const getCurrentStep = () => {
    if (state === 'step1') return 1;
    if (state === 'step2') return 2;
    if (state === 'step3') return 3;
    return 0;
  };

  const renderStepIndicator = () => {
    const currentStep = getCurrentStep();
    if (currentStep === 0) return null;

    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : step < currentStep
                  ? 'bg-primary/30 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: step === currentStep ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {step}
            </motion.div>
            {step < 3 && (
              <div className={`w-8 h-0.5 mx-1 ${step < currentStep ? 'bg-primary/30' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-love relative overflow-hidden">
      <BackgroundThemes theme={selectedTheme} />
      
      {/* Sound toggle */}
      <div className="fixed top-4 right-4 z-50">
        <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
      </div>
      
      <AnimatePresence mode="wait">
        {/* Step 1: Name & Details */}
        {state === 'step1' && (
          <motion.div
            key="step1"
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="love-card p-6 md:p-10 max-w-lg w-full text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {renderStepIndicator()}

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
                Name & Details
              </motion.h1>

              <motion.p
                className="text-muted-foreground text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Add your names and a special photo 💕
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

              {/* Next button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={handleNext}
                  className="love-button w-full text-base"
                >
                  Next: Choose Theme
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Choose Theme */}
        {state === 'step2' && (
          <motion.div
            key="step2"
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="love-card p-6 md:p-10 max-w-lg w-full text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {renderStepIndicator()}

              <motion.div
                className="flex justify-center gap-2 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
                <Palette className="w-6 h-6 text-primary" />
                <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
              </motion.div>

              <motion.h1
                className="font-display text-2xl md:text-3xl font-bold text-gradient-love mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Choose Theme
              </motion.h1>

              <motion.p
                className="text-muted-foreground text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Pick the perfect backdrop for your proposal ✨
              </motion.p>

              {/* Theme selector */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ThemeSelector selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
              </motion.div>

              {/* Navigation buttons */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 text-base border-primary/30"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="love-button flex-1 text-base"
                >
                  Next: Share
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Step 3: Share Link */}
        {state === 'step3' && (
          <motion.div
            key="step3"
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="love-card p-6 md:p-10 max-w-lg w-full text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {renderStepIndicator()}

              <motion.div
                className="flex justify-center gap-2 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
                <Share2 className="w-6 h-6 text-primary" />
                <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
              </motion.div>

              <motion.h1
                className="font-display text-2xl md:text-3xl font-bold text-gradient-love mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Share Your Proposal
              </motion.h1>

              <motion.p
                className="text-muted-foreground text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Copy this link and send it to your special someone 💌
              </motion.p>

              {/* Shareable URL */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="p-4 bg-rose-light/50 rounded-xl border border-primary/10">
                  <p className="text-xs text-muted-foreground mb-2">Shareable Link:</p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      readOnly
                      value={getShareableUrl()}
                      className="text-sm bg-background/50"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(getShareableUrl());
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Preview card */}
              <motion.div
                className="p-4 bg-rose-light/30 rounded-xl border border-primary/10 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <p className="text-xs text-muted-foreground mb-2">They'll see:</p>
                {couplePhoto && (
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-primary/30">
                    <img src={couplePhoto} alt="Couple" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="font-display text-lg font-semibold text-gradient-love">
                  "{getQuestionText()}"
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Theme: {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}
                </p>
              </motion.div>

              {/* Navigation buttons */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 text-base border-primary/30"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="love-button flex-1 text-base"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Preview Proposal
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Asking state */}
        {state === 'asking' && (
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
                <EscapingNoButton onEscape={handleNoEscape} onPlaySound={playNoEscapeSound} />
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
        )}

        {/* Success state */}
        {state === 'success' && (
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
