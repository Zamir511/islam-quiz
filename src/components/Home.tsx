import type { Stats } from "../types";
import { COURSES, AVAILABLE_COURSES, COMING_SOON_COURSES } from "../data/courses";
import CourseCard from "./CourseCard";

type HomeProps = {
  stats: Stats;
  mistakeIds: string[];
  darkMode: boolean;
  onToggleDark: () => void;
  onSelectCourse: (courseId: string) => void;
  onShowStats: () => void;
};

// Премиальная иконка полумесяца и звезды
function IslamicLogo() {
  return (
    <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a9.97 9.97 0 0 0-7.35 3.25 1 1 0 0 0 .23 1.4 1 1 0 0 0 1.2-.14 8 8 0 1 1 1.7 11.23 1 1 0 0 0-.67 1.25 1 1 0 0 0 1.23.67A10 10 0 1 0 12 2z"/>
    </svg>
  );
}

export default function Home({
  stats,
  mistakeIds,
  darkMode,
  onToggleDark,
  onSelectCourse,
  onShowStats,
}: HomeProps) {
  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0;

  // Calculate progress per course (simple version - based on mistakes)
  const getCourseProgress = (_courseId: string) => {
    // For now, return 0 for all courses
    // Later we can track progress per course in localStorage
    return 0;
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-4xl">
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
                Платформа для обучения
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

        {/* Available Courses */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            📚 Доступные курсы
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {AVAILABLE_COURSES.map((course, i) => (
              <div key={course.id} className={`stagger-${Math.min(i + 2, 5)} animate-fade-in-slide-up`}>
                <CourseCard
                  course={course}
                  progress={getCourseProgress(course.id)}
                  onClick={() => onSelectCourse(course.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        {COMING_SOON_COURSES.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              🚧 Скоро будет
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {COMING_SOON_COURSES.map((course, i) => (
                <div key={course.id} className={`stagger-${Math.min(i + 4, 5)} animate-fade-in-slide-up`}>
                  <CourseCard
                    course={course}
                    progress={0}
                    onClick={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer button */}
        <div className="stagger-5 animate-fade-in-slide-up mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onShowStats}
            className="flex-1 rounded-2xl border border-slate-200/80 bg-white/60 px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            📈 Подробная статистика
          </button>
        </div>

        {/* Total stats */}
        <div className="stagger-5 animate-fade-in-slide-up mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Всего в базе: {COURSES.reduce((sum, c) => sum + c.questionsCount, 0)} вопросов · {AVAILABLE_COURSES.length} курса
        </div>
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
