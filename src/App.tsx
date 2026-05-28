import { useEffect, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { AttemptRecord, Question, QuizConfig, Stats } from "./types";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import StatsView from "./components/Stats";

type Screen =
  | { name: "home" }
  | { name: "quiz"; config: QuizConfig }
  | {
      name: "results";
      config: QuizConfig;
      answers: { question: Question; chosen: number; correct: boolean; timeLeft: number }[];
      duration: number;
    }
  | { name: "stats" };

export default function App() {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("islam-quiz:dark", true);
  const [stats, setStats] = useLocalStorage<Stats>("islam-quiz:stats", {
    totalAttempts: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    bestExamScore: null,
    attempts: [],
  });
  const [mistakeIds, setMistakeIds] = useLocalStorage<string[]>("islam-quiz:mistakes", []);
  const [screen, setScreen] = useLocalStorage<Screen>("islam-quiz:screen", { name: "home" });

  // Для сброса анимации при смене экрана
  const [screenKey, setScreenKey] = useState(0);

  useEffect(() => {
    setScreenKey((k) => k + 1);
  }, [screen.name]);

  // Применяем тёмную тему к html
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  function handleFinish(result: {
    answered: { question: Question; chosen: number; correct: boolean; timeLeft: number }[];
    duration: number;
  }) {
    const config = (screen as { name: "quiz"; config: QuizConfig }).config;
    const correctCount = result.answered.filter((a) => a.correct).length;
    const percent =
      result.answered.length > 0
        ? Math.round((correctCount / result.answered.length) * 100)
        : 0;

    const record: AttemptRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: Date.now(),
      mode: config.mode,
      total: result.answered.length,
      correct: correctCount,
      percent,
      duration: result.duration,
    };

    setMistakeIds((prev) => {
      const next = new Set(prev);
      result.answered.forEach((a) => {
        if (a.correct) {
          next.delete(a.question.id);
        } else {
          next.add(a.question.id);
        }
      });
      return Array.from(next);
    });

    setStats((s) => ({
      totalAttempts: s.totalAttempts + 1,
      totalAnswered: s.totalAnswered + result.answered.length,
      totalCorrect: s.totalCorrect + correctCount,
      bestExamScore:
        config.mode === "exam"
          ? Math.max(s.bestExamScore ?? 0, percent)
          : s.bestExamScore,
      attempts: [...s.attempts, record],
    }));

    setScreen({
      name: "results",
      config,
      answers: result.answered,
      duration: result.duration,
    });
  }

  function renderScreen() {
    if (screen.name === "quiz") {
      return (
        <Quiz
          config={screen.config}
          mistakeIds={mistakeIds}
          onFinish={handleFinish}
          onExit={() => setScreen({ name: "home" })}
        />
      );
    }
    if (screen.name === "results") {
      return (
        <Results
          config={screen.config}
          answers={screen.answers}
          duration={screen.duration}
          onHome={() => setScreen({ name: "home" })}
          onRetry={() => setScreen({ name: "quiz", config: screen.config })}
          onReviewMistakes={() => {
            const wrongIds = screen.answers
              .filter((a) => !a.correct)
              .map((a) => a.question.id);
            if (wrongIds.length === 0) return;
            setScreen({
              name: "quiz",
              config: {
                mode: "mistakes",
                questionsCount: wrongIds.length,
                timePerQuestion: 0,
                shuffle: true,
              },
            });
          }}
        />
      );
    }
    if (screen.name === "stats") {
      return (
        <StatsView
          stats={stats}
          mistakeCount={mistakeIds.length}
          onBack={() => setScreen({ name: "home" })}
          onReset={() => {
            setStats({
              totalAttempts: 0,
              totalAnswered: 0,
              totalCorrect: 0,
              bestExamScore: null,
              attempts: [],
            });
            setMistakeIds([]);
          }}
        />
      );
    }
    return (
      <Home
        stats={stats}
        mistakeIds={mistakeIds}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        onStart={(config) => setScreen({ name: "quiz", config })}
        onShowStats={() => setScreen({ name: "stats" })}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 text-slate-900 transition-colors duration-500 dark:from-[#050b09] dark:via-[#09130f] dark:to-[#050b09] dark:text-slate-100">
      {/* Исламский полупрозрачный паттерн */}
      <div className="islamic-pattern pointer-events-none absolute inset-0" />

      {/* Атмосферные фоновые сферы (Ambient Lights) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-emerald-400/15 blur-[120px] dark:bg-emerald-600/10" />
        <div className="animate-float-medium absolute -right-32 top-1/4 h-[600px] w-[600px] rounded-full bg-teal-400/15 blur-[140px] dark:bg-teal-600/10" />
        <div className="animate-float-slow absolute bottom-[-10%] left-1/4 h-[450px] w-[450px] rounded-full bg-amber-400/10 blur-[100px] dark:bg-amber-600/5" />
      </div>

      {/* Обертка с плавной анимацией при смене экранов */}
      <div key={screenKey} className="animate-fade-in-slide-up relative z-10">
        {renderScreen()}
      </div>
    </div>
  );
}
