export interface Question {
  id: number;
  question: string;
  options: string[];
  category: 'interests' | 'habits' | 'preferences' | 'dreams' | 'memories' | 'spicy' | 'deep' | 'future';
}

export interface QuestionCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  isLocked?: boolean;
  questions: Question[];
}

// Classic Questions
const classicQuestions: Question[] = [
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

// Spicy Questions 🔥
const spicyQuestions: Question[] = [
  {
    id: 11,
    question: "What first attracted you to your partner?",
    options: [
      "Their eyes & smile",
      "Their confidence & charisma",
      "Their sense of humor",
      "Their mysterious vibe"
    ],
    category: 'spicy'
  },
  {
    id: 12,
    question: "Where would you love a spontaneous kiss?",
    options: [
      "Under the rain",
      "On a rooftop at sunset",
      "In a crowded room",
      "At a surprise moment"
    ],
    category: 'spicy'
  },
  {
    id: 13,
    question: "Your partner looks hottest when...",
    options: [
      "Just woke up, messy hair",
      "All dressed up for a date",
      "Focused & working hard",
      "Being playful & silly"
    ],
    category: 'spicy'
  },
  {
    id: 14,
    question: "The best time for romance is...",
    options: [
      "Morning, fresh & energized",
      "Afternoon, spontaneous",
      "Evening, after a date",
      "Late night, cozy & intimate"
    ],
    category: 'spicy'
  },
  {
    id: 15,
    question: "What's your love language in the bedroom?",
    options: [
      "Words of affirmation",
      "Quality time & attention",
      "Physical touch & closeness",
      "Acts of service & care"
    ],
    category: 'spicy'
  },
  {
    id: 16,
    question: "A romantic getaway would be...",
    options: [
      "A luxury hotel with room service",
      "A private cabin in nature",
      "A spontaneous road trip",
      "An exotic beach resort"
    ],
    category: 'spicy'
  },
  {
    id: 17,
    question: "The most attractive trait in a partner?",
    options: [
      "Confidence without arrogance",
      "Vulnerability & openness",
      "Passion & intensity",
      "Playfulness & flirtation"
    ],
    category: 'spicy'
  },
  {
    id: 18,
    question: "Your ideal date night includes...",
    options: [
      "Candlelit dinner at home",
      "Dancing the night away",
      "Stargazing & wine",
      "Cooking together & music"
    ],
    category: 'spicy'
  },
  {
    id: 19,
    question: "What makes your heart race?",
    options: [
      "A whispered compliment",
      "An unexpected touch",
      "Deep eye contact",
      "A knowing smile"
    ],
    category: 'spicy'
  },
  {
    id: 20,
    question: "Fantasy date location?",
    options: [
      "Paris, city of love",
      "A private yacht",
      "A penthouse with city views",
      "A secret garden"
    ],
    category: 'spicy'
  }
];

// Deep Conversations 💭
const deepQuestions: Question[] = [
  {
    id: 21,
    question: "What's your biggest fear about relationships?",
    options: [
      "Growing apart over time",
      "Not being fully understood",
      "Losing independence",
      "Being taken for granted"
    ],
    category: 'deep'
  },
  {
    id: 22,
    question: "What does unconditional love mean to you?",
    options: [
      "Accepting flaws completely",
      "Always being there",
      "Supporting their dreams",
      "Forgiving without grudges"
    ],
    category: 'deep'
  },
  {
    id: 23,
    question: "What life lesson shaped who you are?",
    options: [
      "Heartbreak made me stronger",
      "Family taught me values",
      "Failure taught me resilience",
      "Travel opened my mind"
    ],
    category: 'deep'
  },
  {
    id: 24,
    question: "How do you handle disagreements?",
    options: [
      "Need time to cool off",
      "Want to talk it out immediately",
      "Seek to understand first",
      "Look for compromise quickly"
    ],
    category: 'deep'
  },
  {
    id: 25,
    question: "What's most important in a lasting relationship?",
    options: [
      "Trust & honesty",
      "Communication & openness",
      "Shared values & goals",
      "Passion & attraction"
    ],
    category: 'deep'
  },
  {
    id: 26,
    question: "How do you show love when words fail?",
    options: [
      "Through presence & silence",
      "With small thoughtful actions",
      "By creating special moments",
      "Through physical closeness"
    ],
    category: 'deep'
  },
  {
    id: 27,
    question: "What childhood experience affects your relationships?",
    options: [
      "How my parents loved each other",
      "Feeling truly seen & heard",
      "Learning to be independent",
      "Experiencing loss or change"
    ],
    category: 'deep'
  },
  {
    id: 28,
    question: "What makes you feel truly connected?",
    options: [
      "Deep conversations at night",
      "Shared silence that's comfortable",
      "Laughing until it hurts",
      "Being vulnerable together"
    ],
    category: 'deep'
  },
  {
    id: 29,
    question: "What would you sacrifice for love?",
    options: [
      "Career opportunities",
      "Living in my dream city",
      "Some friendships",
      "Personal comfort & habits"
    ],
    category: 'deep'
  },
  {
    id: 30,
    question: "What does 'home' feel like with someone?",
    options: [
      "Safety & peace",
      "Excitement & adventure",
      "Growth & challenge",
      "Warmth & belonging"
    ],
    category: 'deep'
  }
];

// Future Dreams 🌟
const futureQuestions: Question[] = [
  {
    id: 31,
    question: "Your ideal living situation in 5 years?",
    options: [
      "City apartment with a view",
      "Cozy suburban home",
      "Country house with land",
      "Traveling, no fixed home"
    ],
    category: 'future'
  },
  {
    id: 32,
    question: "How do you envision your retirement together?",
    options: [
      "Traveling the world slowly",
      "Surrounded by grandkids",
      "Pursuing creative passions",
      "Building a legacy together"
    ],
    category: 'future'
  },
  {
    id: 33,
    question: "What's a goal you want to achieve together?",
    options: [
      "Start a business or project",
      "Travel to every continent",
      "Build a dream home",
      "Make a difference in the world"
    ],
    category: 'future'
  },
  {
    id: 34,
    question: "How do you want to handle finances?",
    options: [
      "Everything shared equally",
      "Maintain some independence",
      "One person manages it",
      "Hire someone to help"
    ],
    category: 'future'
  },
  {
    id: 35,
    question: "What tradition would you create?",
    options: [
      "Annual adventure trip",
      "Weekly date night ritual",
      "Holiday hosting at your home",
      "Yearly reflection & goal setting"
    ],
    category: 'future'
  },
  {
    id: 36,
    question: "Thoughts on having pets?",
    options: [
      "The more, the merrier!",
      "One or two is perfect",
      "Maybe someday",
      "Prefer no pets"
    ],
    category: 'future'
  },
  {
    id: 37,
    question: "How important is career vs. family?",
    options: [
      "Family always comes first",
      "Career drives our dreams",
      "Balance is everything",
      "They fuel each other"
    ],
    category: 'future'
  },
  {
    id: 38,
    question: "Where do you see yourselves aging?",
    options: [
      "Near family & community",
      "Somewhere warm & peaceful",
      "In a vibrant city",
      "Wherever adventure takes us"
    ],
    category: 'future'
  },
  {
    id: 39,
    question: "What legacy do you want to leave?",
    options: [
      "A loving family",
      "Creative or business achievements",
      "Positive community impact",
      "Adventures & memories"
    ],
    category: 'future'
  },
  {
    id: 40,
    question: "The key to growing old together?",
    options: [
      "Never stop dating each other",
      "Always communicate openly",
      "Keep having new adventures",
      "Support each other's growth"
    ],
    category: 'future'
  }
];

export const questionCategories: QuestionCategory[] = [
  {
    id: 'classic',
    name: 'Classic Love',
    emoji: '💕',
    description: 'Fun questions about your daily life together',
    questions: classicQuestions
  },
  {
    id: 'spicy',
    name: 'Spicy Questions',
    emoji: '🔥',
    description: 'Turn up the heat with romantic questions',
    questions: spicyQuestions
  },
  {
    id: 'deep',
    name: 'Deep Conversations',
    emoji: '💭',
    description: 'Explore your emotional connection',
    questions: deepQuestions
  },
  {
    id: 'future',
    name: 'Future Dreams',
    emoji: '🌟',
    description: 'Discover your shared vision',
    questions: futureQuestions
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
