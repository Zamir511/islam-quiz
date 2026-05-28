import type { QuizConfig, QuizMode, Stats } from "../types";
import { QUESTIONS } from "../data/questions";

type HomeProps = {
  stats: Stats;
  mistakeIds: string[];
  darkMode: boolean;
  onToggleDark: () => void;
  onStart: (config: QuizConfig) => void;
  onShowStats: () => void;
};

// Премиальная иконка полумесяца и звезды
function IslamicLogo() {
  return (
    <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a9.97 9.97 0 0 0-7.35 3.25 1 1 0 0 0 .23 1.4 1 1 0 0 0 1.2-.14 8 8 0 1 1 1.7 11.23 1 1 0 0 0-.67 1.25 1 1 0 0 0 1.23.67A10 10 0 1 0 12 2zm7 8l-1.8 1.2 1.2 1.8-1.8-1.2-1.2 1.8 1.2-1.8-1.8-1.2 1.8-.1 1.2-1.8 1.2 1.8 1.8.1z" />
    </svg>
  );
}

export default function Home({
  stats,
  mistakeIds,
  darkMode,
  onToggleDark,
  onStart,
  onShowStats,
}: HomeProps) {
  const hasMistakes = mistakeIds.length > 0;

  const handleStart = (mode: QuizMode) => {
    if (mode === "mistakes") {
      onStart({
        mode: "mistakes",
        questionsCount: mistakeIds.length,
        timePerQuestion: 0,
        shuffle: true,
      });
    } else if (mode === "exam") {
      onStart({
        mode: "exam",
        questionsCount: Math.min(30, QUESTIONS.length),
        timePerQuestion: 45,
        shuffle: true,
      });
    } else {
      onStart({
        mode: "training",
        questionsCount: Math.min(15, QUESTIONS.length),
        timePerQuestion: 0,
        shuffle: true,
      });
    }
  };

  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 0;

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20 ring-1 ring-white/20">
              <IslamicLogo />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Ислам-Тренажёр
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Подготовка к тесту
              </p>
            </div>
          </div>
          <button
            onClick={onToggleDark}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white/60 text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
            aria-label="Переключить тему"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Stats summary */}
        <div className="stagger-1 animate-fade-in-slide-up mb-6 grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard label="Попыток" value={stats.totalAttempts} emoji="📊" />
          <StatCard label="Точность" value={`${accuracy}%`} emoji="🎯" />
          <StatCard label="Ошибок" value={mistakeIds.length} emoji="📝" />
        </div>

        {/* Modes */}
        <div className="space-y-3.5">
          <div className="stagger-2 animate-fade-in-slide-up">
            <ModeCard
              onClick={() => handleStart("training")}
              title="Тренировка"
              description="Случайные вопросы без таймера. Свободный темп."
              icon="🧠"
              gradient="from-emerald-500 to-teal-600"
              badge={`${Math.min(15, QUESTIONS.length)} вопр.`}
              glowColor="group-hover:shadow-emerald-500/10"
            />
          </div>
          <div className="stagger-3 animate-fade-in-slide-up">
            <ModeCard
              onClick={() => handleStart("exam")}
              title="Режим экзамена"
              description="Ограничение по времени. Как на настоящем тесте."
              icon="📜"
              gradient="from-amber-500 to-orange-600"
              badge={`${Math.min(30, QUESTIONS.length)} вопр. · 45с`}
              glowColor="group-hover:shadow-amber-500/10"
            />
          </div>
          <div className="stagger-4 animate-fade-in-slide-up">
            <ModeCard
              onClick={() => handleStart("mistakes")}
              title="Работа над ошибками"
              description="Повторение вопросов, в которых были ошибки."
              icon="🔁"
              gradient="from-rose-500 to-pink-600"
              badge={`${mistakeIds.length} вопр.`}
              disabled={!hasMistakes}
              glowColor="group-hover:shadow-rose-500/10"
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="stagger-5 animate-fade-in-slide-up mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onShowStats}
            className="flex-1 rounded-2xl border border-slate-200/80 bg-white/60 px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            📈 Подробная статистика
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          Всего в базе: {QUESTIONS.length} вопросов
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  emoji,
}: {
  label: string;
  value: number | string;
  emoji: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-3 shadow-sm backdrop-blur-xl transition dark:border-white/10 dark:bg-white/[0.04] sm:p-4">
      <div className="mb-1 text-lg">{emoji}</div>
      <div className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        {value}
      </div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}

function ModeCard({
  onClick,
  title,
  description,
  icon,
  gradient,
  badge,
  disabled,
  glowColor,
}: {
  onClick: () => void;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  badge: string;
  disabled?: boolean;
  glowColor: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/60 p-4 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 dark:hover:bg-white/[0.08] sm:p-5 ${glowColor}`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl shadow-lg ring-1 ring-white/20 sm:h-14 sm:w-14 ${gradient}`}
      >
        <span className="drop-shadow">{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            {title}
          </h3>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
            {badge}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
          {description}
        </p>
      </div>
      <div className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1 dark:text-slate-500">
        →
      </div>
    </button>
  );
}
