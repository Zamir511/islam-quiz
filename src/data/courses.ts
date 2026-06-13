import type { Question } from "../types";
import { QUESTIONS as CHILDREN_QUESTIONS } from "./questions";
import { WOMEN_QUESTIONS } from "./womenQuestions";

export type Course = {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  questionsCount: number;
  topics: string[];
  status: "available" | "coming-soon";
  questions?: Question[];
};

export const COURSES: Course[] = [
  {
    id: "children",
    title: "Воспитание детей в Исламе",
    description: "Подробная лекция о мудром воспитании детей согласно Корану и Сунне. Разбираются вопросы личного примера, наказания, дуа, уважения к детям и многого другого.",
    icon: "📚",
    gradient: "from-emerald-500 to-teal-600",
    questionsCount: 100,
    topics: [
      "Личный пример родителей",
      "Дуа за детей",
      "Уважение к ребёнку",
      "Наказание и поощрение",
      "Разные характеры детей",
      "Воспитание девочек",
      "Отдых и перегрузка",
      "Результаты воспитания"
    ],
    status: "available",
    questions: CHILDREN_QUESTIONS,
  },
  {
    id: "women",
    title: "Как изменил ислам жизнь женщины",
    description: "Лекция о правах и обязанностях женщины в Исламе, о том, как ислам возвысил положение женщины и дал ей права, которых не было в доисламском обществе.",
    icon: "📖",
    gradient: "from-rose-500 to-pink-600",
    questionsCount: 100,
    topics: [
      "Развод и идда",
      "Многожёнство",
      "Наследство",
      "Махр",
      "Закапывание девочек",
      "Согласие на брак",
      "Побои",
      "Знания для женщин",
      "Примеры для верующих"
    ],
    status: "available",
    questions: WOMEN_QUESTIONS,
  },
];

export const AVAILABLE_COURSES = COURSES.filter(c => c.status === "available");
export const COMING_SOON_COURSES = COURSES.filter(c => c.status === "coming-soon");
