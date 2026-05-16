export type QuizMode =
  | 'tebak-gambar'
  | 'tebak-region'
  | 'tebak-bahan'
  | 'taste-match'
  | 'speed-round';

export type QuizStatus = 'idle' | 'countdown' | 'playing' | 'reviewing' | 'finished';

export interface QuizOption {
  id: string;
  label: string;
  image?: string;
  sublabel?: string;
}

export interface Question {
  id: string;
  mode: QuizMode;
  prompt: string;
  media?: string;
  options: QuizOption[];
  correctAnswer: string | string[];
  timeLimit?: number;
}

export interface Answer {
  questionId: string;
  selectedOption: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  pointsEarned: number;
}

export interface QuizState {
  mode: QuizMode | null;
  status: QuizStatus;
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  score: number;
  streak: number;
  maxStreak: number;
  multiplier: number;
  sessionStartTime: number;
  questionStartTime: number;
  timeRemaining: number;
  isPaused: boolean;
  showFeedback: boolean;
  feedbackType: 'correct' | 'wrong' | null;
}

export interface QuizActions {
  startQuiz: (mode: QuizMode) => void;
  answerQuestion: (optionId: string | string[]) => void;
  nextQuestion: () => void;
  skipQuestion: () => void;
  pauseQuiz: () => void;
  resumeQuiz: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
  tick: () => void;
  getCurrentQuestion: () => Question | null;
  getProgress: () => number;
  getTimeFormatted: () => string;
}
