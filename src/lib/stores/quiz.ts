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

  startQuiz: (mode: QuizMode) => void;
  answerQuestion: (optionId: string) => void;
  nextQuestion: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
  tick: () => void;
  getCountdown: () => number;
  getCurrentQuestion: () => Question | null;
  getProgress: () => number;
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

  startQuiz: (mode: QuizMode) => {
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
    });

    let count = 3;
    const interval = setInterval(() => {
      count--;
      set({ countdownValue: count });
      if (count <= 0) {
        clearInterval(interval);
        set({ status: 'playing', countdownValue: 0 });
        startTimer();
      }
    }, 800);
  },

  answerQuestion: (optionId: string) => {
    const { questions, currentIndex, streak, score, timeRemaining } = get();
    const question = questions[currentIndex];
    if (!question) return;

    const isCorrect = question.correctAnswer === optionId ||
      (Array.isArray(question.correctAnswer) && question.correctAnswer.includes(optionId));

    const pointsEarned = calculateScore(isCorrect, timeRemaining, question.timeLimit ?? 15, streak);
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
    });

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        finishQuizInternal(newScore, newMaxStreak, get().answers);
      } else {
        set({
          currentIndex: nextIndex,
          timeRemaining: questions[nextIndex].timeLimit ?? 15,
          status: 'playing',
        });
        startTimer();
      }
    }, 1200);
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
      });
      startTimer();
    }
  },

  finishQuiz: () => {
    finishQuizInternal(get().score, get().maxStreak, get().answers);
  },

  resetQuiz: () => {
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
    });
  },

  tick: () => {
    const { timeRemaining, status } = get();
    if (status !== 'playing') return;

    const newTime = timeRemaining - 1;
    if (newTime <= 0) {
      set({ timeRemaining: 0, status: 'reviewing' });
      setTimeout(() => {
        const { currentIndex, questions } = get();
        const nextIndex = currentIndex + 1;
        if (nextIndex >= questions.length) {
          finishQuizInternal(get().score, get().maxStreak, get().answers);
        } else {
          set({
            currentIndex: nextIndex,
            timeRemaining: questions[nextIndex].timeLimit ?? 15,
            status: 'playing',
          });
          startTimer();
        }
      }, 1200);
    } else {
      set({ timeRemaining: newTime });
    }
  },

  getCountdown: () => get().countdownValue,
  getCurrentQuestion: () => {
    const { questions, currentIndex } = get();
    return questions[currentIndex] ?? null;
  },
  getProgress: () => {
    const { currentIndex, questions } = get();
    return questions.length > 0 ? (currentIndex + 1) / questions.length : 0;
  },
}));

let timerInterval: ReturnType<typeof setInterval> | null = null;

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    useQuizStore.getState().tick();
  }, 1000);
}

function finishQuizInternal(score: number, maxStreak: number, answers: Answer[]) {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;

  const stats = useQuizStore.getState().stats;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const newStats: QuizStats = {
    highScore: Math.max(stats.highScore, score),
    totalGamesPlayed: stats.totalGamesPlayed + 1,
    totalCorrectAnswers: stats.totalCorrectAnswers + correctCount,
    bestStreak: Math.max(stats.bestStreak, maxStreak),
  };
  saveStats(newStats);

  useQuizStore.setState({
    status: 'finished',
    stats: newStats,
  });
}