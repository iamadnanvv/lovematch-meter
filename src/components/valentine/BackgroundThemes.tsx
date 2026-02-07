import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export type ThemeType = 'hearts' | 'roses' | 'stars';

interface BackgroundThemesProps {
  theme: ThemeType;
}

// Hearts theme - floating hearts
function HeartsBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/20"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: '110%',
            rotate: Math.random() * 360
          }}
          animate={{ 
            y: '-10%',
            rotate: Math.random() * 360 + 360
          }}
          transition={{ 
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          style={{ left: `${Math.random() * 100}%` }}
        >
          <Heart 
            className="fill-primary/10" 
            style={{ 
              width: `${16 + Math.random() * 24}px`,
              height: `${16 + Math.random() * 24}px`
            }} 
          />
        </motion.div>
      ))}
    </div>
  );
}

// Roses theme - falling rose petals
function RosesBackground() {
  const petalColors = ['text-rose-300/40', 'text-rose-400/30', 'text-pink-300/40', 'text-red-300/30'];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${petalColors[i % petalColors.length]}`}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: '-10%',
            rotate: Math.random() * 180,
            scale: 0.5 + Math.random() * 0.5
          }}
          animate={{ 
            y: '110%',
            x: `${Math.random() * 100}%`,
            rotate: Math.random() * 360 + 180
          }}
          transition={{ 
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "linear"
          }}
          style={{ left: `${Math.random() * 100}%` }}
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-4 h-4 md:w-6 md:h-6 fill-current"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>
      ))}
      {/* Add rose decorations */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`rose-${i}`}
          className="absolute text-4xl"
          initial={{ opacity: 0.3, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: i * 0.5 }}
          style={{ 
            left: `${10 + (i * 15)}%`, 
            top: i % 2 === 0 ? '5%' : '85%',
          }}
        >
          🌹
        </motion.div>
      ))}
    </div>
  );
}

// Stars theme - twinkling stars
function StarsBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-indigo-950/20 via-transparent to-purple-950/20">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ 
            duration: 1 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
          }}
        >
          <Sparkles 
            className="text-amber-200/60" 
            style={{ 
              width: `${8 + Math.random() * 12}px`,
              height: `${8 + Math.random() * 12}px`
            }}
          />
        </motion.div>
      ))}
      {/* Shooting stars */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{ 
            x: '-10%', 
            y: `${20 + i * 20}%`,
            opacity: 0
          }}
          animate={{ 
            x: '110%',
            y: `${40 + i * 15}%`,
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            delay: 3 + i * 4,
            ease: "easeOut"
          }}
          style={{
            boxShadow: '0 0 10px 2px rgba(255,255,255,0.8), -20px 0 20px 2px rgba(255,255,255,0.4)'
          }}
        />
      ))}
    </div>
  );
}

export function BackgroundThemes({ theme }: BackgroundThemesProps) {
  switch (theme) {
    case 'roses':
      return <RosesBackground />;
    case 'stars':
      return <StarsBackground />;
    case 'hearts':
    default:
      return <HeartsBackground />;
  }
}

// Theme selector component
interface ThemeSelectorProps {
  selectedTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
}

export function ThemeSelector({ selectedTheme, onSelectTheme }: ThemeSelectorProps) {
  const themes: { id: ThemeType; label: string; icon: string }[] = [
    { id: 'hearts', label: 'Hearts', icon: '💕' },
    { id: 'roses', label: 'Roses', icon: '🌹' },
    { id: 'stars', label: 'Stars', icon: '✨' },
  ];

  return (
    <div className="flex justify-center gap-3">
      {themes.map((theme) => (
        <motion.button
          key={theme.id}
          onClick={() => onSelectTheme(theme.id)}
          className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all ${
            selectedTheme === theme.id
              ? 'border-primary bg-primary/10 shadow-md'
              : 'border-border hover:border-primary/50 hover:bg-muted'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">{theme.icon}</span>
          <span className={`text-xs font-medium ${
            selectedTheme === theme.id ? 'text-primary' : 'text-muted-foreground'
          }`}>
            {theme.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
