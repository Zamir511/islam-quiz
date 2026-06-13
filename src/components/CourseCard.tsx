import type { Course } from "../data/courses";

type CourseCardProps = {
  course: Course;
  progress: number;
  onClick: () => void;
};

export default function CourseCard({ course, progress, onClick }: CourseCardProps) {
  const isAvailable = course.status === "available";

  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      className={`group relative flex w-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/60 p-5 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-6 ${
        !isAvailable ? "cursor-not-allowed opacity-50" : "hover:scale-[1.02] active:scale-[0.99]"
      }`}
    >
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />

      {/* Icon */}
      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-lg ring-1 ring-white/20 ${course.gradient}`}>
        {course.icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
        {course.title}
      </h3>

      {/* Description */}
      <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
        {course.description}
      </p>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>📝</span>
          <span>{course.questionsCount} вопросов</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>📚</span>
          <span>{course.topics.length} тем</span>
        </div>
      </div>

      {/* Progress bar */}
      {isAvailable && (
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-400">Прогресс</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${course.gradient} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Coming soon badge */}
      {!isAvailable && (
        <div className="absolute right-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-400">
          Скоро
        </div>
      )}

      {/* Arrow */}
      {isAvailable && (
        <div className="absolute bottom-5 right-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 dark:text-slate-500">
          →
        </div>
      )}
    </button>
  );
}
