import type { Stats } from "../types";

type StatsProps = {
  stats: Stats;
  mistakeCount: number;
  onBack: () => void;
  onReset: () => void;
};

export default function Stats({ stats, mistakeCount, onBack, onReset }: StatsProps) {
  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 0;

  const recent = [...stats.attempts].slice(-10).reverse();

  return (
    <div className="min-h-screen w-full px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/60 text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
            aria-label="Назад"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            📈 Статистика
          </h1>
        </div>

        {/* Big stats */}
        <div className="stagger-1 animate-fade-in-slide-up grid grid-cols-2 gap-3 sm:grid-cols-4">
          <BigStat label="Попыток" value={stats.totalAttempts} />
          <BigStat label="Вопросов" value={stats.totalAnswered} />
          <BigStat label="Точность" value={`${accuracy}%`} />
          <BigStat
            label="Лучший экзамен"
            value={stats.bestExamScore !== null ? `${stats.bestExamScore}%` : "—"}
          />
        </div>

        {/* Mistakes alert */}
        <div className="stagger-2 animate-fade-in-slide-up mt-5 rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Ошибок в базе
            </h2>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800/40">
              {mistakeCount}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Вопросы, в которых вы ошибались. Используйте режим «Работа над ошибками», чтобы их повторить.
          </p>
        </div>

        {/* Recent attempts */}
        <div className="stagger-3 animate-fade-in-slide-up mt-6">
          <h2 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">
            Последние попытки
          </h2>
          {recent.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/30 p-8 text-center text-sm text-slate-500 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.01] dark:text-slate-400">
              Пока нет завершённых попыток
            </div>
          ) : (
            <div className="space-y-2.5">
              {recent.map((a) => {
                const d = new Date(a.date);
                const modeLabel =
                  a.mode === "exam" ? "Экзамен" : a.mode === "mistakes" ? "Ошибки" : "Тренировка";
                const color =
                  a.percent >= 70
                    ? "bg-emerald-500 shadow-emerald-500/20"
                    : a.percent >= 40
                    ? "bg-amber-500 shadow-amber-500/20"
                    : "bg-rose-500 shadow-rose-500/20";

                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white/60 p-3 shadow-sm backdrop-blur-xl transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
                  >
                    <div className={`h-10 w-1.5 rounded-full shadow-sm ${color}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {a.percent}%
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          ({a.correct}/{a.total})
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                          {modeLabel}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        {d.toLocaleDateString("ru-RU")} ·{" "}
                        {d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="text-right text-xs font-medium text-slate-500 dark:text-slate-400">
                      {Math.floor(a.duration / 60)}:
                      {(a.duration % 60).toString().padStart(2, "0")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reset button */}
        <div className="stagger-4 animate-fade-in-slide-up mt-8 flex justify-center">
          <button
            onClick={() => {
              if (confirm("Сбросить всю статистику и список ошибок?")) onReset();
            }}
            className="text-xs font-semibold text-rose-500 transition hover:text-rose-600 dark:text-rose-400"
          >
            🗑 Сбросить статистику
          </button>
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-3 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
      <div className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        {value}
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}
