export interface Question {
  id: number;
  question: string;
  options: string[];
  category: 'interests' | 'habits' | 'preferences' | 'dreams' | 'memories';
}

export const questions: Question[] = [
  {
    id: 1,
    question: "What's your ideal weekend together?",
    options: [
      "Netflix & cozy cuddles at home",
      "Adventure trip to somewhere new",
      "Fancy dinner date & dancing",
      "Lazy brunch & farmers market"
    ],
    category: 'preferences'
  },
  {
    id: 2,
    question: "When stressed, what does your partner need most?",
    options: [
      "Space and alone time",
      "Words of encouragement",
      "Physical comfort & hugs",
      "Help solving the problem"
    ],
    category: 'habits'
  },
  {
    id: 3,
    question: "What's the most romantic gesture?",
    options: [
      "Surprise love letters",
      "Cooking their favorite meal",
      "Planning a spontaneous trip",
      "Remembering small details"
    ],
    category: 'preferences'
  },
  {
    id: 4,
    question: "Your dream vacation together would be...",
    options: [
      "Beach paradise & sunset cocktails",
      "European city exploration",
      "Mountain cabin retreat",
      "Tropical jungle adventure"
    ],
    category: 'dreams'
  },
  {
    id: 5,
    question: "How do you prefer to say 'I love you'?",
    options: [
      "Through actions & deeds",
      "With words & compliments",
      "By giving thoughtful gifts",
      "Through quality time together"
    ],
    category: 'preferences'
  },
  {
    id: 6,
    question: "What annoys you most in a partner?",
    options: [
      "Being constantly late",
      "Not listening properly",
      "Messy habits",
      "Phone addiction"
    ],
    category: 'habits'
  },
  {
    id: 7,
    question: "Your partner's best quality is...",
    options: [
      "Their sense of humor",
      "Their kindness & empathy",
      "Their ambition & drive",
      "Their loyalty & support"
    ],
    category: 'preferences'
  },
  {
    id: 8,
    question: "What's your ideal movie night pick?",
    options: [
      "Romantic comedy",
      "Action & thriller",
      "Horror & suspense",
      "Documentary or indie film"
    ],
    category: 'interests'
  },
  {
    id: 9,
    question: "In 10 years, you see yourselves...",
    options: [
      "In a cozy home with pets",
      "Traveling the world together",
      "Building a family",
      "Running a business together"
    ],
    category: 'dreams'
  },
  {
    id: 10,
    question: "The perfect anniversary gift is...",
    options: [
      "An experience to share",
      "Something personalized & meaningful",
      "A surprise party with loved ones",
      "Recreating your first date"
    ],
    category: 'memories'
  }
];

export const compatibilityMessages = {
  perfect: {
    title: "Soulmates! 💕",
    message: "You two are incredibly in sync! Your connection is rare and beautiful. You understand each other on a deep level.",
    emoji: "💑"
  },
  great: {
    title: "Love Birds! 🥰",
    message: "You have amazing compatibility! Your differences complement each other perfectly, creating a balanced relationship.",
    emoji: "💞"
  },
  good: {
    title: "Growing Together 💗",
    message: "You're on a beautiful journey of understanding each other. Keep communicating and you'll only get stronger!",
    emoji: "💕"
  },
  developing: {
    title: "Opposites Attract! 💫",
    message: "You bring different perspectives to the relationship, which can spark exciting conversations and growth!",
    emoji: "✨"
  }
};

export function getCompatibilityLevel(score: number) {
  if (score >= 80) return compatibilityMessages.perfect;
  if (score >= 60) return compatibilityMessages.great;
  if (score >= 40) return compatibilityMessages.good;
  return compatibilityMessages.developing;
}
