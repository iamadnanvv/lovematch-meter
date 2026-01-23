import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { QuestionCategory } from '@/data/questions';

interface CategorySelectionProps {
  categories: QuestionCategory[];
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  onStart: () => void;
  onBack: () => void;
  player1Name: string;
  player2Name: string;
}

export function CategorySelection({
  categories,
  selectedCategories,
  onToggleCategory,
  onStart,
  onBack,
  player1Name,
  player2Name
}: CategorySelectionProps) {
  const isValid = selectedCategories.length > 0;

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <motion.div 
        className="love-card p-6 md:p-8 max-w-lg w-full"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Choose Your Questions
          </h2>
          <p className="text-muted-foreground">
            {player1Name} & {player2Name}, select the categories you want to explore
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedCategories.includes(category.id)
                  ? 'border-primary bg-rose-light'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
              onClick={() => onToggleCategory(category.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedCategories.includes(category.id)
                    ? 'border-primary bg-primary'
                    : 'border-border'
                }`}>
                  {selectedCategories.includes(category.id) && (
                    <Check className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {category.questions.length} questions
              </div>
            </motion.button>
          ))}
        </div>

        <div className="text-center mb-4">
          <span className="text-sm text-muted-foreground">
            {selectedCategories.length} categories selected • {
              selectedCategories.reduce((total, catId) => {
                const cat = categories.find(c => c.id === catId);
                return total + (cat?.questions.length || 0);
              }, 0)
            } questions
          </span>
        </div>

        <div className="space-y-3">
          <motion.button
            className={`love-button w-full ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onStart}
            disabled={!isValid}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
          >
            Start Quiz ({selectedCategories.reduce((total, catId) => {
              const cat = categories.find(c => c.id === catId);
              return total + (cat?.questions.length || 0);
            }, 0)} questions)
          </motion.button>

          <button
            onClick={onBack}
            className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
