import { create } from 'zustand';
import type { QuizMode, QuizStatus, Question, Answer } from '@/types/quiz';
import { generateQuestions, calculateScore } from '@/lib/data/quiz-generator';

interface QuizStats {
  highScore: number;
  totalGamesPlayed: number;
  totalCorrectAnswers: number;
  bestStreak: number;
}

function loadStats(): QuizStats {
  try {
    const stored = localStorage.getItem('kulineria-quiz-stats');
    if (stored) return JSON.parse(stored);
  } catch {}
  return { highScore: 0, totalGamesPlayed: 0, totalCorrectAnswers: 0, bestStreak: 0 };
}

function saveStats(stats: QuizStats) {
  try {
    localStorage.setItem('kulineria-quiz-stats', JSON.stringify(stats));
  } catch {}
}

interface QuizStore {
  mode: QuizMode | null;
  status: QuizStatus;
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  score: number;
  streak: number;
  maxStreak: number;
  timeRemaining: number;
  stats: QuizStats;
  countdownValue: number;
  selectedOptionId: string | null;

  startQuiz: (mode: QuizMode) => void;
  answerQuestion: (optionId: string) => void;
  nextQuestion: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
  tick: () => void;
  getCurrentQuestion: () => Question | null;
  getProgress: () => number;
}

let timerId: ReturnType<typeof setInterval> | null = null;
let countdownId: ReturnType<typeof setInterval> | null = null;

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function stopCountdown() {
  if (countdownId !== null) {
    clearInterval(countdownId);
    countdownId = null;
  }
}

function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    useQuizStore.getState().tick();
  }, 1000);
}

export function cleanupQuizTimer() {
  stopTimer();
  stopCountdown();
}

function finishQuizInternal(score: number, maxStreak: number, answers: Answer[]) {
  stopTimer();
  const stats = useQuizStore.getState().stats;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const newStats: QuizStats = {
    highScore: Math.max(stats.highScore, score),
    totalGamesPlayed: stats.totalGamesPlayed + 1,
    totalCorrectAnswers: stats.totalCorrectAnswers + correctCount,
    bestStreak: Math.max(stats.bestStreak, maxStreak),
  };
  saveStats(newStats);
  useQuizStore.setState({ status: 'finished', stats: newStats });
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  mode: null,
  status: 'idle',
  questions: [],
  currentIndex: 0,
  answers: [],
  score: 0,
  streak: 0,
  maxStreak: 0,
  timeRemaining: 15,
  stats: loadStats(),
  countdownValue: 3,
  selectedOptionId: null,

  startQuiz: (mode: QuizMode) => {
    stopCountdown(); // Pastikan tidak ada countdown ganda berjalan
    const questions = generateQuestions(mode, 10);
    set({
      mode,
      status: 'countdown',
      questions,
      currentIndex: 0,
      answers: [],
      score: 0,
      streak: 0,
      maxStreak: 0,
      timeRemaining: questions[0]?.timeLimit ?? 15,
      countdownValue: 3,
      selectedOptionId: null,
    });

    let count = 3;
    countdownId = setInterval(() => {
      count--;
      set({ countdownValue: count });
      if (count <= 0) {
        stopCountdown();
        set({ status: 'playing', countdownValue: 0 });
        startTimer();
      }
    }, 1000);
  },

  answerQuestion: (optionId: string) => {
    const { questions, currentIndex, streak, score, timeRemaining, status } = get();
    if (status !== 'playing') return;
    const question = questions[currentIndex];
    if (!question) return;
    stopTimer();

    const isCorrect = question.correctAnswer === optionId ||
      (Array.isArray(question.correctAnswer) && question.correctAnswer.includes(optionId));

    const pointsEarned = calculateScore(isCorrect, timeRemaining, streak);
    const newStreak = isCorrect ? streak + 1 : 0;
    const newMaxStreak = Math.max(streak, newStreak);
    const newScore = score + pointsEarned;

    const answer: Answer = {
      questionId: question.id,
      selectedOption: optionId,
      isCorrect,
      timeSpent: (question.timeLimit ?? 15) - timeRemaining,
      pointsEarned,
    };

    set({
      answers: [...get().answers, answer],
      score: newScore,
      streak: newStreak,
      maxStreak: newMaxStreak,
      status: 'reviewing',
      selectedOptionId: optionId,
    });
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      finishQuizInternal(get().score, get().maxStreak, get().answers);
    } else {
      set({
        currentIndex: nextIndex,
        timeRemaining: questions[nextIndex].timeLimit ?? 15,
        status: 'playing',
        selectedOptionId: null,
      });
      startTimer();
    }
  },

  finishQuiz: () => {
    finishQuizInternal(get().score, get().maxStreak, get().answers);
  },

  resetQuiz: () => {
    stopTimer();
    set({
      mode: null,
      status: 'idle',
      questions: [],
      currentIndex: 0,
      answers: [],
      score: 0,
      streak: 0,
      maxStreak: 0,
      timeRemaining: 15,
      countdownValue: 3,
      selectedOptionId: null,
    });
  },

  tick: () => {
    const { timeRemaining, status } = get();
    if (status !== 'playing') return;

    const newTime = timeRemaining - 1;
    if (newTime <= 0) {
      stopTimer();
      const { questions, currentIndex } = get();
      const question = questions[currentIndex];
      if (!question) return;

      const answer: Answer = {
        questionId: question.id,
        selectedOption: '',
        isCorrect: false,
        timeSpent: question.timeLimit ?? 15,
        pointsEarned: 0,
      };

      set({
        timeRemaining: 0,
        answers: [...get().answers, answer],
        status: 'reviewing',
        selectedOptionId: null,
      });
    } else {
      set({ timeRemaining: newTime });
    }
  },

  getCurrentQuestion: () => {
    const { questions, currentIndex } = get();
    return questions[currentIndex] ?? null;
  },

  getProgress: () => {
    const { currentIndex, questions, status } = get();
    if (questions.length === 0) return 0;
    if (status === 'finished') return 1;
    return currentIndex / questions.length;
  },
}));
