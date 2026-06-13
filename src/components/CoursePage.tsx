import type { Course } from "../data/courses";

type CoursePageProps = {
  course: Course;
  progress: number;
  onStartQuiz: () => void;
  onBack: () => void;
};

export default function CoursePage({ course, progress, onStartQuiz, onBack }: CoursePageProps) {
  const isAvailable = course.status === "available";

  return (
    <div className="min-h-screen w-full px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/60 text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
            aria-label="Назад"
          >
            ←
          </button>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-lg ring-1 ring-white/20 sm:h-14 sm:w-14 ${course.gradient}">
            {course.icon}
          </div>
        </div>

        {/* Title Card */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-2xl ring-1 ring-white/20 sm:p-8 ${course.gradient}`}>
          <div className="absolute -right-8 -top-8 text-[180px] opacity-10 select-none sm:text-[220px]">
            {course.icon}
          </div>
          <div className="relative">
            <h1 className="mb-3 text-2xl font-bold sm:text-3xl">{course.title}</h1>
            <p className="text-sm opacity-90 sm:text-base">{course.description}</p>
          </div>
        </div>

        {/* Stats */}
        {isAvailable && (
          <div className="stagger-1 animate-fade-in-slide-up mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-3 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <div className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{course.questionsCount}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Вопросов</div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-3 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <div className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{course.topics.length}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Тем</div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-3 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 sm:text-2xl">{progress}%</div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Прогресс</div>
            </div>
          </div>
        )}

        {/* Topics List */}
        {isAvailable && course.topics.length > 0 && (
          <div className="stagger-2 animate-fade-in-slide-up mt-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              📚 Темы в лекции
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {course.topics.map((topic, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200/80 bg-white/60 px-4 py-3 text-sm shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-200">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="stagger-3 animate-fade-in-slide-up mt-6 space-y-3">
          {isAvailable ? (
            <>
              <button
                onClick={onStartQuiz}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 text-base font-bold text-white shadow-lg shadow-emerald-500/25 ring-1 ring-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] sm:text-lg"
              >
                🎯 Начать тест
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onStartQuiz}
                  className="rounded-2xl border border-amber-200/80 bg-amber-50/80 px-5 py-4 text-sm font-bold text-amber-700 shadow-sm backdrop-blur-xl transition hover:bg-amber-100 active:scale-[0.99] dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-300 dark:hover:bg-amber-950/40"
                >
                  📜 Экзамен
                </button>
                <button
                  onClick={onStartQuiz}
                  className="rounded-2xl border border-rose-200/80 bg-rose-50/80 px-5 py-4 text-sm font-bold text-rose-700 shadow-sm backdrop-blur-xl transition hover:bg-rose-100 active:scale-[0.99] dark:border-rose-800/40 dark:bg-rose-950/20 dark:text-rose-300 dark:hover:bg-rose-950/40"
                >
                  🔁 Ошибки
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/30 p-8 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.01]">
              <div className="text-4xl">🚧</div>
              <h3 className="mt-3 text-lg font-bold text-slate-700 dark:text-slate-200">В разработке</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Эта тема скоро будет доступна. Заходите позже!
              </p>
            </div>
          )}
        </div>

        {/* Coming soon info */}
        {!isAvailable && (
          <div className="stagger-4 animate-fade-in-slide-up mt-6 rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <h3 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200"> Что будет в этой теме?</h3>
            <ul className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
              <li>• Права женщин в доисламском обществе</li>
              <li>• Как ислам возвысил положение женщины</li>
              <li>• Права и обязанности в семье</li>
              <li>• Право на образование и имущество</li>
              <li>• Примеры женщин из времени Пророка ﷺ</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
