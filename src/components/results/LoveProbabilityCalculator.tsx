import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface LoveProbabilityCalculatorProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

const STAT_TEMPLATES = [
  { template: "There's a {pct}% chance {name} will forget an anniversary in the next 5 years", emoji: "📅" },
  { template: "{name} has a {pct}% probability of crying during a movie this month", emoji: "🎬" },
  { template: "Combined, you have a {pct}% chance of ordering takeout on Fridays", emoji: "🍕" },
  { template: "{name} will lose the TV remote approximately {num} times this week", emoji: "📺" },
  { template: "There's a {pct}% probability {name} will say 'I told you so' tomorrow", emoji: "😏" },
  { template: "{name} has a {pct}% chance of stealing the blanket tonight", emoji: "🛏️" },
  { template: "You will spend {num} hours this month deciding where to eat", emoji: "🤔" },
  { template: "{name} has a {pct}% probability of finishing the ice cream first", emoji: "🍦" },
  { template: "There's a {pct}% chance one of you will fall asleep during movie night", emoji: "😴" },
  { template: "{name} will 'accidentally' eat the last cookie {num} times this year", emoji: "🍪" },
];

export function LoveProbabilityCalculator({ player1Name, player2Name, score }: LoveProbabilityCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(0);

  const stats = useMemo(() => {
    const selectedStats = [...STAT_TEMPLATES]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map((stat) => {
        const name = Math.random() > 0.5 ? player1Name : player2Name;
        const pct = Math.floor(Math.random() * 40) + 60; // 60-100%
        const num = Math.floor(Math.random() * 10) + 2; // 2-12
        
        let text = stat.template
          .replace('{name}', name)
          .replace('{pct}', String(pct))
          .replace('{num}', String(num));
        
        // Make some percentages hilariously over 100%
        if (Math.random() > 0.7) {
          text = text.replace(/\d+%/, `${100 + Math.floor(Math.random() * 30)}%`);
        }
        
        return {
          text,
          emoji: stat.emoji,
          value: pct,
        };
      });

    return selectedStats;
  }, [player1Name, player2Name, key]);

  const chartData = useMemo(() => [
    { name: 'Love', value: score, color: 'hsl(var(--primary))' },
    { name: 'Chaos', value: Math.floor((100 - score) / 2), color: 'hsl(var(--accent))' },
    { name: 'Mystery', value: 100 - score - Math.floor((100 - score) / 2), color: 'hsl(var(--muted))' },
  ], [score]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="love-button-outline w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Calculator className="w-5 h-5" />
            📊 Love Probability Calculator
          </span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-rose-light border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl text-gradient-love">
            📊 Love Probability Calculator
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-5">
          <p className="text-center text-muted-foreground text-sm italic">
            *Powered by 100% made-up science*
          </p>

          {/* Fake Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-40"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Legend */}
          <div className="flex justify-center gap-4 text-xs">
            {chartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            key={key}
            className="space-y-3"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-muted/50 flex items-start gap-3"
              >
                <span className="text-xl">{stat.emoji}</span>
                <p className="text-sm text-foreground">{stat.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Refresh */}
          <motion.button
            className="love-button-outline w-full"
            onClick={() => setKey(prev => prev + 1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Recalculate Probabilities
            </span>
          </motion.button>

          <p className="text-xs text-center text-muted-foreground/60">
            Disclaimer: These statistics have a 0% correlation with reality
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
