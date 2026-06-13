import { useEffect, useMemo, useRef, useState } from "react";
import type { Difficulty, Question, QuestionType, QuizConfig } from "../types";
import { QUESTIONS } from "../data/questions";

type QuizProps = {
  questions?: Question[]; // Опционально - если не переданы, используем QUESTIONS по умолчанию
  config: QuizConfig;
  mistakeIds: string[];
  onFinish: (result: {
    answered: { question: Question; chosen: number; correct: boolean; timeLeft: number }[];
    duration: number;
  }) => void;
  onExit: () => void;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/40",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800/40",
  hard: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800/40",
};

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный",
};

const TYPE_LABEL: Record<QuestionType, { text: string; style: string }> = {
  single: {
    text: "Один ответ",
    style: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
  },
  negative: {
    text: "❗ НЕ-вопрос",
    style: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800/40",
  },
  multiple: {
    text: "✅ Несколько ответов",
    style: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800/40",
  },
};

function HighlightNE({ text }: { text: string }) {
  const parts = text.split(/(\bНЕ\b)/g);
  return (
    <>
      {parts.map((p, i) =>
        p === "НЕ" ? (
          <span
            key={i}
            className="rounded bg-rose-100 px-1.5 py-0.5 font-extrabold text-rose-600 dark:bg-rose-950/80 dark:text-rose-300"
          >
            НЕ
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function Quiz({ questions: courseQuestions, config, mistakeIds, onFinish, onExit }: QuizProps) {
  // Используем переданные вопросы или QUESTIONS по умолчанию
  const allQuestions = courseQuestions || QUESTIONS;
  
  const questions = useMemo(() => {
    let pool: Question[];
    if (config.mode === "mistakes") {
      pool = allQuestions.filter((q) => mistakeIds.includes(q.id));
    } else {
      pool = [...allQuestions];
    }
    return config.shuffle
      ? shuffle(pool).slice(0, config.questionsCount)
      : pool.slice(0, config.questionsCount);
  }, [config, mistakeIds, allQuestions]);

  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | number[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timePerQuestion);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>(questions);
  
  // Ключ для запуска анимации появления новой карточки вопроса
  const [cardKey, setCardKey] = useState(0);

  const startedAt = useRef<number>(Date.now());
  const answersRef = useRef<
    { question: Question; chosen: number; correct: boolean; timeLeft: number }[]
  >([]);

  // Сброс при смене вопроса
  useEffect(() => {
    setChosen(null);
    setRevealed(false);
    setTimeLeft(config.timePerQuestion);
    setCardKey((k) => k + 1);
  }, [index, config.timePerQuestion]);

  // Таймер
  useEffect(() => {
    if (config.timePerQuestion <= 0) return;
    if (revealed) return;
    if (timeLeft <= 0) {
      handleReveal(-1);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, revealed, config.timePerQuestion]);

  const current = shuffledQuestions[index];
  const total = shuffledQuestions.length;

  if (!current) return null;

  function handleSelect(i: number) {
    if (revealed) return;
    
    // Если вопрос с множественными ответами
    if (Array.isArray(current.correctAnswer)) {
      setChosen(prev => {
        const arr = Array.isArray(prev) ? prev : [];
        return arr.includes(i) ? arr.filter(x => x !== i) : [...arr, i];
      });
    } else {
      setChosen(i);
    }
  }

  function handleReveal(forceChosen?: number) {
    if (revealed) return;
    const pick = forceChosen !== undefined ? forceChosen : chosen;
    if (pick === null) return;
    setRevealed(true);
    
    // Поддержка множественных ответов
    const correct = Array.isArray(current.correctAnswer) 
      ? Array.isArray(pick) && current.correctAnswer.every(a => pick.includes(a)) && pick.length === current.correctAnswer.length
      : pick === current.correctAnswer;
    
    answersRef.current.push({
      question: current,
      chosen: Array.isArray(pick) ? pick[0] : pick,
      correct,
      timeLeft,
    });
  }

  function handleNext() {
    if (index + 1 >= total) {
      onFinish({
        answered: answersRef.current,
        duration: Math.round((Date.now() - startedAt.current) / 1000),
      });
    } else {
      setIndex((i) => i + 1);
    }
  }

  function handleReshuffle() {
    if (!confirm("Перемешать вопросы? Прогресс текущей сессии будет потерян.")) return;
    answersRef.current = [];
    setShuffledQuestions(shuffle(questions));
    setIndex(0);
    startedAt.current = Date.now();
  }

  const progress = ((index + (revealed ? 1 : 0)) / total) * 100;
  const timerMax = config.timePerQuestion || 1;
  const timerPct = config.timePerQuestion > 0 ? (timeLeft / timerMax) * 100 : 0;

  // Определяем, верный ли был ответ, чтобы включить нужную анимацию карточки
  const isCorrectAnswer = revealed && chosen === current.correctAnswer;
  const isWrongAnswer = revealed && chosen !== null && chosen !== current.correctAnswer;

  let cardAnimationClass = "animate-fade-in-slide-up";
  if (revealed) {
    if (isCorrectAnswer) cardAnimationClass = "animate-pulse-emerald";
    if (isWrongAnswer) cardAnimationClass = "animate-shake";
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Top bar */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            onClick={onExit}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/60 text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
            aria-label="Выйти"
          >
            ✕
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/6 dark:text-emerald-300 dark:border dark:border-emerald-800/40">
              {index + 1} / {total}
            </span>
            {config.mode === "exam" && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800/40">
                Экзамен
              </span>
            )}
            {config.mode === "mistakes" && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800/40">
                Ошибки
              </span>
            )}
          </div>
          <button
            onClick={handleReshuffle}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/60 px-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
            title="Перемешать"
          >
            🔀
            <span className="hidden sm:inline">Перемешать</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Timer */}
        {config.timePerQuestion > 0 && (
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400">⏱ Осталось</span>
              <span
                className={
                  timeLeft <= 5
                    ? "text-rose-500 animate-pulse"
                    : "text-slate-700 dark:text-slate-200"
                }
              >
                {timeLeft}с
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  timeLeft <= 5
                    ? "bg-rose-500 shadow-lg shadow-rose-500/50"
                    : timeLeft <= timerMax * 0.3
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Question card */}
        <div
          key={cardKey}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur-xl transition-all duration-300 sm:p-7 ${
            current.type === "negative"
              ? "border-rose-200 bg-gradient-to-br from-rose-50/90 to-white/90 dark:border-rose-800/40 dark:from-rose-950/20 dark:to-white/[0.04]"
              : "border-slate-200/80 bg-white/70 dark:border-white/10 dark:bg-white/[0.04]"
          } shadow-slate-200/20 dark:shadow-black/40 ${cardAnimationClass}`}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-white/10 dark:text-slate-300">
              {current.topic}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                DIFFICULTY_STYLES[current.difficulty]
              }`}
            >
              {DIFFICULTY_LABEL[current.difficulty]}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                TYPE_LABEL[current.type].style
              }`}
            >
              {TYPE_LABEL[current.type].text}
            </span>
          </div>
          <h2 className="text-lg font-bold leading-snug text-slate-900 dark:text-white sm:text-xl">
            <HighlightNE text={current.question} />
          </h2>

          {/* Подсказка для множественного выбора */}
          {Array.isArray(current.correctAnswer) && !revealed && (
            <div className="mb-3 rounded-xl bg-amber-50/80 p-3 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              ⚠️ Выберите все правильные варианты (несколько ответов)
            </div>
          )}

          {/* Options */}
          <div className="mt-6 space-y-3">
            {current.options.map((opt, i) => {
              const isSelected = Array.isArray(chosen) ? chosen.includes(i) : chosen === i;
              const isCorrect = Array.isArray(current.correctAnswer) 
                ? current.correctAnswer.includes(i)
                : i === current.correctAnswer;
              
              let classes =
                "w-full text-left rounded-2xl border-2 px-4 py-3.5 transition-all duration-200 font-medium ";
              
              if (!revealed) {
                classes += isSelected
                  ? "border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-md dark:bg-emerald-950/40 dark:text-emerald-100 scale-[1.01]"
                  : "border-slate-200/80 bg-white/50 text-slate-800 hover:border-slate-300 hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-100 dark:hover:border-white/20 dark:hover:bg-white/[0.06] hover:scale-[1.005]";
              } else {
                if (isCorrect) {
                  classes +=
                    "border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-lg shadow-emerald-500/10 dark:bg-emerald-950/50 dark:text-emerald-100 scale-[1.01]";
                } else if (isSelected && !isCorrect) {
                  classes +=
                    "border-rose-500 bg-rose-50/90 text-rose-900 shadow-lg shadow-rose-500/10 dark:bg-rose-950/50 dark:text-rose-100 scale-[0.99]";
                } else {
                  classes +=
                    "border-slate-200/40 bg-white/30 text-slate-400 dark:border-white/5 dark:bg-white/[0.01] dark:text-slate-600";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={revealed}
                  className={classes}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${
                        revealed && isCorrect
                          ? "bg-emerald-500 text-white"
                          : revealed && isSelected && !isCorrect
                          ? "bg-rose-500 text-white"
                          : isSelected && !revealed
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                      }`}
                    >
                      {revealed && isCorrect
                        ? "✓"
                        : revealed && isSelected && !isCorrect
                        ? "✕"
                        : String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm sm:text-base">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {revealed && timeLeft === 0 && chosen === -1 && (
            <div className="animate-scale-in mt-4 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 text-sm text-amber-900 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-200">
              ⏰ Время вышло!
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          {!revealed ? (
            <button
              onClick={() => handleReveal()}
              disabled={chosen === null}
              className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 ring-1 ring-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Проверить
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="animate-scale-in flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 ring-1 ring-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              {index + 1 >= total ? "Завершить" : "Дальше →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
