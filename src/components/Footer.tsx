import { Heart, Instagram, Users, HeartHandshake, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-t border-border py-3 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left side - Credits */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-primary fill-primary inline" /> by
            </span>
            <a
              href="https://www.instagram.com/thetechcontractor.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Instagram className="w-4 h-4" />
              Muhammed Adnan
            </a>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <Link
              to="/valentine"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Valentine</span>
            </Link>
            <Link
              to="/creators"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Creators</span>
            </Link>
            <a
              href="https://razorpay.me/@adnan4402"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors"
            >
              <HeartHandshake className="w-4 h-4" />
              <span className="hidden sm:inline">Support</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
