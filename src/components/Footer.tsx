import { Heart, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-t border-border py-3 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          This website is developed with <Heart className="w-3 h-3 text-primary fill-primary inline" /> by
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
    </footer>
  );
}
