'use client';

import './QuizGame.css';
import { useQuizStore } from '@/lib/stores/quiz';
import QuestionCard from './QuestionCard';
import TimerBar from './TimerBar';
import FeedbackOverlay from './FeedbackOverlay';

export default function QuizGame() {
  const status = useQuizStore((s) => s.status);
  const currentQuestion = useQuizStore((s) => s.getCurrentQuestion());
  const progress = useQuizStore((s) => s.getProgress());
  const score = useQuizStore((s) => s.score);
  const streak = useQuizStore((s) => s.streak);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const questions = useQuizStore((s) => s.questions);

  if (!currentQuestion) return null;

  const totalQuestions = questions.length;
  const questionNumber = currentIndex + 1;

  return (
    <div className="quiz-game">
      <div className="quiz-game-header">
        <div className="quiz-progress">
          <span className="progress-text">Soal {questionNumber}/{totalQuestions}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <div className="quiz-score">
          <span className="score-value">{score}</span>
          {streak >= 3 && <span className="streak-badge">🔥 {streak}</span>}
        </div>
      </div>

      <TimerBar />
      <QuestionCard question={currentQuestion} />
      {status === 'reviewing' && <FeedbackOverlay />}
    </div>
  );
}
