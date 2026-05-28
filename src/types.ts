export type QuestionType = "single" | "negative";
export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

export type QuizMode = "training" | "exam" | "mistakes";

export type QuizConfig = {
  mode: QuizMode;
  questionsCount: number;
  timePerQuestion: number; // seconds, 0 = без таймера
  shuffle: boolean;
};

export type AttemptRecord = {
  id: string;
  date: number;
  mode: QuizMode;
  total: number;
  correct: number;
  percent: number;
  duration: number; // seconds
};

export type Stats = {
  totalAttempts: number;
  totalAnswered: number;
  totalCorrect: number;
  bestExamScore: number | null;
  attempts: AttemptRecord[];
};
