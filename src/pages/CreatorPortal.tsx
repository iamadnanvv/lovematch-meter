import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Instagram, 
  Share2, 
  Download, 
  CheckCircle2, 
  Star, 
  Sparkles,
  Heart,
  Gift,
  Copy,
  ExternalLink,
  BadgeCheck,
  Users,
  TrendingUp,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "@/assets/love-triangle-logo.png";
import { Footer } from "@/components/Footer";
import { CreatorPortalSkeleton } from "@/components/skeletons/GameSkeleton";
import { useToast } from "@/hooks/use-toast";

const REFERRAL_LINK = "https://lovetriangle.app/?ref=";
const INSTAGRAM_HANDLE = "@thetechcontractor.in";

interface CreatorTier {
  name: string;
  icon: React.ReactNode;
  requirements: string;
  benefits: string[];
  color: string;
}

const creatorTiers: CreatorTier[] = [
  {
    name: "Rising Star",
    icon: <Star className="w-6 h-6" />,
    requirements: "1K+ followers",
    benefits: [
      "Custom referral link",
      "Access to promo materials",
      "Monthly shoutouts"
    ],
    color: "from-blue-400 to-blue-600"
  },
  {
    name: "Love Ambassador",
    icon: <Heart className="w-6 h-6" />,
    requirements: "10K+ followers + verified",
    benefits: [
      "Verified creator badge",
      "Priority feature access",
      "Collaboration opportunities",
      "Custom content support"
    ],
    color: "from-primary to-accent"
  },
  {
    name: "Romance Royalty",
    icon: <Sparkles className="w-6 h-6" />,
    requirements: "50K+ followers + top performer",
    benefits: [
      "Premium creator badge",
      "Revenue sharing program",
      "Exclusive events access",
      "Direct team contact",
      "Co-branded content"
    ],
    color: "from-accent to-yellow-500"
  }
];

const promoIdeas = [
  {
    type: "Reel",
    title: "Take the Test Live",
    description: "Record yourself and your partner taking the Love Triangle quiz together. Capture genuine reactions!",
    tips: ["Use trending audio", "Show real emotions", "End with your score"]
  },
  {
    type: "Story",
    title: "Score Reveal",
    description: "Build suspense with a story series leading up to your compatibility reveal.",
    tips: ["Use countdown stickers", "Add poll for guesses", "Share your shareable card"]
  },
  {
    type: "Post",
    title: "Relationship Tips",
    description: "Share relationship advice based on your Love Triangle insights.",
    tips: ["Carousel format works best", "Include your referral link", "Tag @thetechcontractor.in"]
  }
];

export default function CreatorPortal() {
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Generate a simple referral code (in production, this would come from the backend)
      const code = `creator_${Math.random().toString(36).substring(2, 8)}`;
      setReferralCode(code);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const copyReferralLink = () => {
    const link = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Your referral link has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadLogo = () => {
    const link = document.createElement("a");
    link.href = logoImage;
    link.download = "love-triangle-logo.png";
    link.click();
    toast({
      title: "Download started!",
      description: "Love Triangle logo is being downloaded.",
    });
  };

  if (isLoading) {
    return <CreatorPortalSkeleton />;
  }

  return (
    <>
      <div className="min-h-screen px-4 py-8 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/" className="inline-block mb-4">
              <img src={logoImage} alt="Love Triangle" className="w-16 h-16 mx-auto" />
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-love mb-4">
              Creator Portal
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our community of Instagram creators spreading love! Promote Love Triangle 
              and earn exclusive rewards while helping couples connect.
            </p>
          </motion.div>

          {/* Stats Banner */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="love-card p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Active Creators</div>
            </div>
            <div className="love-card p-6 text-center">
              <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">10M+</div>
              <div className="text-sm text-muted-foreground">Total Reach</div>
            </div>
            <div className="love-card p-6 text-center">
              <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground">Couples Connected</div>
            </div>
          </motion.div>

          {/* Your Referral Link */}
          <motion.div
            className="love-card p-6 md:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-accent" />
              Your Referral Link
            </h2>
            <p className="text-muted-foreground mb-4">
              Share this unique link in your bio, stories, and posts. Track your impact!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-muted rounded-xl px-4 py-3 font-mono text-sm truncate">
                {window.location.origin}/?ref={referralCode}
              </div>
              <motion.button
                className="love-button flex items-center justify-center gap-2"
                onClick={copyReferralLink}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy Link"}
              </motion.button>
            </div>
          </motion.div>

          {/* Creator Tiers */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
              Creator Tiers & Rewards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {creatorTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  className="love-card p-6 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tier.color}`} />
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center text-white mb-4`}>
                    {tier.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tier.requirements}</p>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Verification Badge Section */}
          <motion.div
            className="love-card p-6 md:p-8 mb-8 bg-gradient-to-br from-primary/10 to-accent/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <BadgeCheck className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Get Verified 
                </h2>
                <p className="text-muted-foreground mb-4">
                  Verified creators receive a special badge, higher visibility, and priority access to new features. 
                  Apply once you've reached 10K+ followers and posted at least 3 Love Triangle promotions.
                </p>
                <motion.a
                  href={`https://www.instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-button inline-flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Instagram className="w-5 h-5" />
                  Apply via DM
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Promo Materials */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Promo Materials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="love-card p-6">
                <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Download Assets
                </h3>
                <p className="text-muted-foreground mb-4">
                  Use our official logo and graphics in your content.
                </p>
                <motion.button
                  className="love-button-outline w-full flex items-center justify-center gap-2"
                  onClick={downloadLogo}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-5 h-5" />
                  Download Logo
                </motion.button>
              </div>

              <div className="love-card p-6">
                <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-primary" />
                  Tag Us
                </h3>
                <p className="text-muted-foreground mb-4">
                  Tag us in your posts and stories for a chance to get featured!
                </p>
                <motion.a
                  href={`https://www.instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="love-button w-full flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Instagram className="w-5 h-5" />
                  {INSTAGRAM_HANDLE}
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Content Ideas */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Content Ideas That Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promoIdeas.map((idea, index) => (
                <motion.div
                  key={idea.title}
                  className="love-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                    {idea.type}
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{idea.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{idea.description}</p>
                  <ul className="space-y-1">
                    {idea.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-accent" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="love-card p-8 bg-gradient-to-br from-primary/5 to-accent/5">
              <Gift className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Ready to Spread Love?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start creating content today and help couples discover their compatibility. 
                Don't forget to use your referral link!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <motion.button
                    className="love-button flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart className="w-5 h-5" />
                    Try Love Triangle
                  </motion.button>
                </Link>
                <motion.button
                  className="gold-button flex items-center gap-2"
                  onClick={copyReferralLink}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 className="w-5 h-5" />
                  Share Your Link
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
