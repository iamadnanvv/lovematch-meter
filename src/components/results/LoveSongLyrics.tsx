import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Music, RefreshCw, Copy, Check } from 'lucide-react';
import { ShareButton } from './ShareButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface LoveSongLyricsProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

type Genre = 'pop' | 'country' | 'rap' | 'opera';

const LYRICS_TEMPLATES: Record<Genre, string[]> = {
  pop: [
    `🎤 "{name1}, you're the WiFi to my phone
{name2}, you're never truly alone
Our love is like a streaming service
Always buffering, but worth it~"`,
    `🎤 "Every time I see {name1}'s face
My heart beats at a viral pace
{name2}, you're my trending topic
Our love story? Nobody can stop it!"`,
    `🎤 "{name1} and {name2}, sitting in a tree
K-I-S-S-I-N-G (but make it trendy)
First comes love, then comes the 'gram
Couple goals? Yes we am!"`,
  ],
  country: [
    `🤠 "Well, I was driving my pickup down a dusty road
When I saw {name1}, my heart nearly explode
{name2} said 'howdy' under starlit skies
Now we're sippin' sweet tea watchin' fireflies~"`,
    `🤠 "{name1}'s got a heart like a country song
{name2} knew from the start we'd get along
Boots and blue jeans, porch swing dreams
Y'all, this love is exactly what it seems!"`,
    `🤠 "Mama always said I'd find the one
{name1}, you shine brighter than the Tennessee sun
{name2}, grab your hat, we're riding free
Just you, me, and sweet destiny~"`,
  ],
  rap: [
    `🎧 "Yo, {name1} in the building, {name2} on the beat
Our love game strong, we never take defeat
Compatibility score through the roof
Need more evidence? Here's the proof! 💯"`,
    `🎧 "{name1}! (What?) {name2}! (Yeah!)
Together we slay every single day!
Haters gonna hate but we don't play
This love story? We wrote it our way! 🔥"`,
    `🎧 "Started from the first date now we here
{name1} and {name2}, love crystal clear
Squad goals? Nah, couple goals supreme
Living out this real-life dream! 💕"`,
  ],
  opera: [
    `🎭 "O, {name1}! Mine heart doth sing!
{name2}, thou art my everything!
Through tempests and through trials we soar
*dramatic pause* FOREVERMOOOOORE~! 🎶"`,
    `🎭 "In the grand teatro of amore
{name1} and {name2} write the score
*hits impossibly high note*
DESTINYYYYY! *faints dramatically*"`,
    `🎭 "Behold! {name1}! The sun to my moon!
{name2}! We shall reunite soooon!
*orchestra swells* 
OUR LOVE TRANSCENDS ALL TIMEEEE! 
*curtain falls*"`,
  ],
};

const GENRE_INFO: Record<Genre, { label: string; emoji: string }> = {
  pop: { label: 'Pop Ballad', emoji: '🎤' },
  country: { label: 'Country', emoji: '🤠' },
  rap: { label: 'Hip Hop', emoji: '🎧' },
  opera: { label: 'Opera', emoji: '🎭' },
};

export function LoveSongLyrics({ player1Name, player2Name, score }: LoveSongLyricsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [genre, setGenre] = useState<Genre>('pop');
  const [key, setKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const lyrics = useMemo(() => {
    const templates = LYRICS_TEMPLATES[genre];
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template
      .replace(/{name1}/g, player1Name)
      .replace(/{name2}/g, player2Name);
  }, [genre, player1Name, player2Name, key]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(lyrics);
    setCopied(true);
    toast.success('Lyrics copied! Time to record your hit single! 🎤');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="love-button-outline w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Music className="w-5 h-5" />
            🎵 Love Song Lyrics Generator
          </span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-rose-light border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl text-gradient-love">
            🎵 Your Love Song
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-5">
          {/* Genre Selector */}
          <div className="flex justify-center gap-2 flex-wrap">
            {(Object.keys(GENRE_INFO) as Genre[]).map((g) => (
              <motion.button
                key={g}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  genre === g
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
                onClick={() => {
                  setGenre(g);
                  setKey(prev => prev + 1);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {GENRE_INFO[g].emoji} {GENRE_INFO[g].label}
              </motion.button>
            ))}
          </div>

          {/* Lyrics Display */}
          <motion.div
            key={`${genre}-${key}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-gradient-to-br from-gold-light to-rose-light border border-accent/30"
          >
            <p className="text-center whitespace-pre-line text-foreground font-medium leading-relaxed">
              {lyrics}
            </p>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              className="love-button flex-1"
              onClick={handleCopy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Lyrics'}
              </span>
            </motion.button>
            
            <motion.button
              className="love-button-outline flex-1"
              onClick={() => setKey(prev => prev + 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                New Verse
              </span>
            </motion.button>
          </div>

          <ShareButton
            getText={() => `🎵 Our Love Song (${GENRE_INFO[genre].label}):\n\n${lyrics}\n\n💕 Made with Love Triangle!`}
          />

          <p className="text-xs text-center text-muted-foreground italic">
            🎤 Chart-topping hit guaranteed* (*not actually guaranteed)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
