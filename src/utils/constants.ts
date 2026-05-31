// src/utils/constants.ts
import {
  Eye,
  MessageSquare,
  MapPin,
  Percent,
  type LucideIcon,
} from "lucide-react";

export type Principle = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export const PRINCIPLES: Principle[] = [
  {
    icon: Eye,
    title: "Прозорість",
    body: "Реальні зарплати, чіткі вимоги, жодного прихованого тексту між рядками.",
  },
  {
    icon: MessageSquare,
    title: "Прямий контакт",
    body: "Перший зв'язок з рекрутером. Без агенцій, без посередників, без «фільтрів».",
  },
  {
    icon: MapPin,
    title: "Український фокус",
    body: "Платформа відкрита для всіх українського ринку — від мови до локальних вимог.",
  },
  {
    icon: Percent,
    title: "Без комісій",
    body: "Найбільший прямий маркетплейс для кандидатів — завжди. Роботодавці платять лише за результат.",
  },
];

export type Milestone = {
  index: string;
  year: string;
  title: string;
  body: string;
  current?: boolean;
};

export const MILESTONES: Milestone[] = [
  {
    index: "01",
    year: "2023",
    title: "Ідея",
    body: "Команда ІТ-спеціалістів бачить, як агенції «здирають» українських працівників.",
  },
  {
    index: "02",
    year: "2024",
    title: "MVP",
    body: "Перший запуск ATS для невеликих українських компаній.",
  },
  {
    index: "03",
    year: "2025",
    title: "Публічний запуск",
    body: "Побудовано під реалії українського ринку — від мови до локальних вимог.",
  },
  {
    index: "04",
    year: "2026",
    title: "15 000+ вакансій",
    body: "Найбільший прямий маркетплейс праці в Україні.",
    current: true,
  },
];

export type TeamMember = {
  initials: string;
  name: string;
  role: string;
  gradient: string;
};

export const TEAM: TeamMember[] = [
  {
    initials: "ОК",
    name: "Олександр Коваленко",
    role: "CEO · Засновник",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
  },
  {
    initials: "МТ",
    name: "Марія Ткачук",
    role: "CTO",
    gradient: "linear-gradient(135deg, #f5c84c 0%, #d97706 100%)",
  },
  {
    initials: "ОБ",
    name: "Ольга Бондаренко",
    role: "Head of Product",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)",
  },
  {
    initials: "ВК",
    name: "Володимир Кремінь",
    role: "Lead Designer",
    gradient: "linear-gradient(135deg, #e11d48 0%, #f5c84c 100%)",
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "15 000+", label: "активних вакансій" },
  { value: "200+", label: "компаній-партнерів" },
  { value: "3.5к", label: "кандидатів" },
  { value: "87 %", label: "успішних наймів" },
];

export type FooterColumn = { title: string; items: string[] };

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Кандидатам",
    items: [
      "Вакансії",
      "Як знайти роботу",
      "Конструктор резюме",
      "Топ компаній",
    ],
  },
  {
    title: "Роботодавцям",
    items: [
      "Розмістити вакансію",
      "Пошук кандидатів",
      "Брендинг компанії",
      "Для бізнесу",
    ],
  },
  {
    title: "Компанія",
    items: ["Про нас", "Блог", "Кар'єра у нас", "Контакти"],
  },
  {
    title: "Правила",
    items: [
      "Приватність",
      "Умови використання",
      "Політика cookies",
      "Безпека даних",
    ],
  },
];

export const HERO_CHIPS: string[] = [
  "Засновано у 2023",
  "Київ · Львів · Віддалено",
  "Команда з 24 людей",
];

export const MISSION_BULLETS: string[] = [
  "Реальні зарплати, не «до 3000$»",
  "Прямий чат з рекрутером",
  "Нуль комісій з кандидата",
];
