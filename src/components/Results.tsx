import { useEffect, useState } from "react";
import type { Question, QuizConfig } from "../types";

type Answered = {
  question: Question;
  chosen: number;
  correct: boolean;
  timeLeft: number;
};

type ResultsProps = {
  config: QuizConfig;
  answers: Answered[];
  duration: number;
  onHome: () => void;
  onRetry: () => void;
  onReviewMistakes: () => void;
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

export default function Results({
  config,
  answers,
  duration,
  onHome,
  onRetry,
  onReviewMistakes,
}: ResultsProps) {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const targetPercent = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Плавная накрутка процентов
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (targetPercent === 0) return;
    const durationMs = 1200;
    const steps = 60;
    const stepTime = durationMs / steps;
    const increment = targetPercent / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetPercent) {
        setPercent(targetPercent);
        clearInterval(timer);
      } else {
        setPercent(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetPercent]);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const wrongAnswers = answers.filter((a) => !a.correct);
  const hasMistakes = wrongAnswers.length > 0;

  let title = "Отлично!";
  let message = "Превосходный результат, машаАллах!";
  let emoji = "🎉";
  let gradient = "from-emerald-500 to-teal-600";
  if (targetPercent < 70) {
    title = "Можно лучше";
    message = "Повтори материал и попробуй снова.";
    emoji = "💪";
    gradient = "from-amber-500 to-orange-600";
  }
  if (targetPercent < 40) {
    title = "Не сдавайся";
    message = "Повторение — мать учения. Ты справишься!";
    emoji = "📚";
    gradient = "from-rose-500 to-pink-600";
  }
  if (targetPercent === 100) {
    title = "Идеально!";
    message = "Все ответы верны, баракаЛлаху фик!";
    emoji = "🌟";
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Result card */}
        <div
          className={`stagger-1 animate-fade-in-slide-up relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-2xl ring-1 ring-white/20 sm:p-8 ${gradient}`}
        >
          <div className="absolute -right-8 -top-8 text-[180px] opacity-10 select-none sm:text-[220px]">
            {emoji}
          </div>
          <div className="relative">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider opacity-80">
              {config.mode === "exam"
                ? "Режим экзамена"
                : config.mode === "mistakes"
                ? "Работа над ошибками"
                : "Тренировка"}
            </div>
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{title}</h1>
            <div className="mb-4 flex items-end gap-2">
              <span className="text-6xl font-black leading-none sm:text-7xl">
                {percent}
              </span>
              <span className="pb-2 text-2xl font-bold opacity-80">%</span>
            </div>
            <p className="text-sm opacity-90 sm:text-base">{message}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stagger-2 animate-fade-in-slide-up mt-5 grid grid-cols-3 gap-3">
          <MiniStat label="Правильно" value={`${correct}/${total}`} color="emerald" />
          <MiniStat label="Ошибок" value={total - correct} color="rose" />
          <MiniStat label="Время" value={timeStr} color="slate" />
        </div>

        {/* Actions */}
        <div className="stagger-3 animate-fade-in-slide-up mt-5 space-y-3">
          {hasMistakes && (
            <button
              onClick={onReviewMistakes}
              className="w-full rounded-2xl border border-rose-200/80 bg-rose-50/80 px-5 py-4 text-base font-bold text-rose-700 shadow-sm backdrop-blur-xl transition hover:bg-rose-100 active:scale-[0.99] dark:border-rose-800/40 dark:bg-rose-950/20 dark:text-rose-300 dark:hover:bg-rose-950/40"
            >
              🔁 Повторить ошибки ({wrongAnswers.length})
            </button>
          )}
          <div className="flex gap-3">
            <button
              onClick={onRetry}
              className="flex-1 rounded-2xl border border-slate-200/80 bg-white/60 px-5 py-4 text-base font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white active:scale-[0.99] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
            >
              ↻ Заново
            </button>
            <button
              onClick={onHome}
              className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 ring-1 ring-white/20 transition hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.99]"
            >
              🏠 В меню
            </button>
          </div>
        </div>

        {/* Mistakes list */}
        {hasMistakes && (
          <div className="stagger-4 animate-fade-in-slide-up mt-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Разбор ошибок
            </h2>
            <div className="space-y-3">
              {wrongAnswers.map((a, i) => (
                <div
                  key={a.question.id}
                  className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {a.question.topic}
                    </span>
                    {a.question.type === "negative" && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800/40">
                        НЕ-вопрос
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {i + 1}. <HighlightNE text={a.question.question} />
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400">
                      <span className="mt-0.5 font-bold">✕</span>
                      <span>
                        Ваш ответ:{" "}
                        <span className="font-medium">
                          {a.chosen >= 0 ? a.question.options[a.chosen] : "— (время вышло)"}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                      <span className="mt-0.5 font-bold">✓</span>
                      <span>
                        Верно:{" "}
                        <span className="font-medium">
                          {a.question.options[a.question.correctAnswer]}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "emerald" | "rose" | "slate";
}) {
  const map = {
    emerald: "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
    rose: "bg-rose-50/80 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
    slate: "bg-white/50 text-slate-700 dark:bg-white/[0.02] dark:text-slate-200",
  };
  return (
    <div className={`rounded-2xl p-3 text-center shadow-sm backdrop-blur-xl sm:p-4 ${map[color]}`}>
      <div className="text-xl font-bold sm:text-2xl">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wide opacity-70 sm:text-xs">
        {label}
      </div>
    </div>
  );
}
