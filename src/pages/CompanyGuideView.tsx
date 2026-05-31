import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  FileText,
  LayoutGrid,
  ListChecks,
  MessageSquare,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const steps = [
  {
    icon: Building2,
    title: "Створи сторінку компанії",
    text: "Додай опис, логотип, факти, офіси, формат роботи, кількість співробітників і посилання.",
    tint: "from-[#A855F7] to-[#7C3AED]",
  },
  {
    icon: FileText,
    title: "Опублікуй вакансію",
    text: "Опиши роль, стек, зарплату, формат, вимоги й статус вакансії: активна або закрита.",
    tint: "from-[#60A5FA] to-[#2563EB]",
  },
  {
    icon: UsersRound,
    title: "Переглядай кандидатів",
    text: "Після відгуків бачиш список кандидатів, їхній профіль, навички та резюме.",
    tint: "from-[#34D399] to-[#10B981]",
  },
  {
    icon: MessageSquare,
    title: "Спілкуйся в чаті",
    text: "Домовляйся про інтерв'ю, проси уточнення, приймай або відхиляй заявку.",
    tint: "from-[#FCD34D] to-[#F59E0B]",
  },
];

const features = [
  {
    icon: LayoutGrid,
    title: "Кабінет компанії",
    text: "Режим редагування, налаштування профілю і брендингу.",
  },
  {
    icon: ListChecks,
    title: "Список вакансій",
    text: "Активні, чернетки, закриті - все в одному місці.",
  },
  {
    icon: FileText,
    title: "Детальний опис вакансії",
    text: "Стек, формат, рівень, зарплата і вимоги.",
  },
  {
    icon: UsersRound,
    title: "Список кандидатів",
    text: "Усі, хто відгукнувся на конкретну вакансію.",
  },
  {
    icon: MessageSquare,
    title: "Чат з кандидатами",
    text: "Без email і месенджерів - спілкування на платформі.",
  },
  {
    icon: Star,
    title: "Відгуки і рейтинг",
    text: "Прозора репутація від співробітників і кандидатів.",
  },
];

const process = [
  "Створити вакансію",
  "Кандидат подає заявку",
  "Перегляд профілю",
  "Чат і офер",
];

const avatars = [
  { label: "N", color: "bg-[#8B5CF6]" },
  { label: "R", color: "bg-[#10B981]" },
  { label: "A", color: "bg-[#F59E0B]" },
  { label: "+", color: "bg-[#3B82F6]" },
];

export default function CompanyGuideView() {
  return (
    <div className="min-h-screen bg-[#081426] text-white">
      <Header />

      <main className="bg-[#081426]">
        <section className="relative overflow-hidden border-b border-[#1E3151]/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_29%_19%,rgba(59,130,246,0.15),transparent_32%),radial-gradient(circle_at_75%_22%,rgba(59,130,246,0.2),transparent_28%)]" />
          <div className="relative mx-auto grid min-h-[760px] max-w-[1440px] items-center px-4 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-[80px] lg:py-24">
            <div>
              <h1 className="mt-8 max-w-[620px] text-4xl sm:text-[48px] lg:text-[64px] font-bold text-white leading-[1.1]">
                Як компанії користуватися{" "}
                <span className="text-[#F5B82E]">Kriposnyj</span>
              </h1>

              <p className="mt-8 max-w-[610px] text-[#A8B6CD] text-[16px] lg:text-[18px] leading-relaxed">
                Оформіть публічний профіль, публікуйте вакансії, переглядайте
                кандидатів, керуйте статусами заявок і ведіть комунікацію - без
                окремих таблиць і хаосу в повідомленнях.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/employerRegistration"
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-[#3B82F6] px-7 text-[15px] font-semibold text-white shadow-[0_18px_38px_-18px_rgba(59,130,246,0.95)] transition hover:bg-[#2563EB]"
                >
                  <ArrowRight className="h-5 w-5" />
                  Зареєструвати компанію
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-5">
                <div className="flex -space-x-2">
                  {avatars.map((avatar) => (
                    <span
                      key={avatar.label}
                      className={`grid h-9 w-9 place-items-center rounded-lg border-2 border-[#081426] text-sm font-bold text-white ${avatar.color}`}
                    >
                      {avatar.label}
                    </span>
                  ))}
                </div>
                <p className="text-[#A8B6CD] text-[16px]">
                  <span className="font-bold text-white">200+ компаній</span>{" "}
                  уже з нами
                </p>
              </div>
            </div>

            <EmployerDashboardPreview />
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:px-[80px] lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_0.45fr] lg:items-end">
            <div>
              <p className="text-[#F5C84C] text-[13px] font-semibold tracking-wide">
                Основний маршрут компанії
              </p>
              <h2 className="mt-4 max-w-[640px] text-3xl sm:text-[40px] lg:text-[48px] font-bold text-white leading-[1.1]">
                4 кроки від реєстрації до першого найму
              </h2>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map(({ icon: Icon, title, text, tint }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${tint} text-white shadow-[0_14px_30px_-18px_rgba(59,130,246,0.95)]`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-bold text-[#F5C84C]/30">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-[#A8B6CD] text-[14px] leading-relaxed">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-6 px-4 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_0.78fr] lg:px-[80px]">
          <div className="rounded-3xl border border-[#1E3151] bg-[#0F1D36] p-7 sm:p-10">
            <p className="text-[#F5C84C] text-[13px] font-semibold tracking-wide">
              Функціонал для компанії
            </p>
            <h2 className="mt-4 text-2xl sm:text-[32px] font-bold text-white leading-snug">
              Усе для роботодавця в одному кабінеті
            </h2>
            <p className="mt-4 max-w-xl text-[#6B7D99] text-[13px] leading-relaxed">
              Шість основних поверхонь, які покривають весь шлях від публікації
              вакансії до офера.
            </p>

            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{title}</h3>
                    <p className="mt-1 text-[#6B7D99] text-[13px] leading-relaxed">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-[#1E3151]/70 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-2 text-emerald-400">
                <Check className="h-4 w-4" />
                Усе включено - без прихованих платежів
              </span>
            </div>
          </div>

          <HiringProcessCard />
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8 lg:px-[80px]">
          <div className="rounded-3xl border border-[#1E3151] bg-[radial-gradient(circle_at_70%_0%,rgba(139,92,246,0.28),transparent_34%),linear-gradient(135deg,#0F1D36_0%,#101D37_62%,#211C46_100%)] px-6 py-14 text-center sm:px-10 sm:py-20">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#60A5FA] to-[#2563EB] text-white shadow-[0_18px_42px_-18px_rgba(59,130,246,0.95)]">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="mx-auto mt-8 max-w-2xl text-3xl sm:text-[40px] lg:text-[48px] font-bold text-white leading-[1.1]">
              Готові розпочати найм{" "}
              <span className="text-[#F5B82E]">без посередників?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#A8B6CD]">
              Зареєструйте компанію за 5 хвилин і опублікуйте першу вакансію вже
              сьогодні. Жодних агенцій. Жодних прихованих комісій.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/employerRegistration"
                className="inline-flex h-13 items-center justify-center gap-3 rounded-xl bg-[#3B82F6] px-8 py-4 text-sm font-bold text-white shadow-[0_18px_38px_-18px_rgba(59,130,246,0.95)] transition hover:bg-[#2563EB]"
              >
                <ArrowRight className="h-4 w-4" />
                Зареєструвати компанію
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[#6B7D99] text-[12px]">
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Перша вакансія безкоштовно
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Без агенцій і комісій
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Реєстрація за 5 хвилин
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function EmployerDashboardPreview() {
  return (
    <div className="w-full max-w-[700px] rounded-[28px] border border-[#234067] bg-[#071224]/95 p-4 shadow-[0_38px_100px_-38px_rgba(59,130,246,0.95)] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#60A5FA] to-[#2563EB] text-white">
            <TrendingUp className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-black text-white">
              Що бачить роботодавець
            </h2>

            <p className="mt-1 text-[13px] text-[#8EA0BA]">
              Кабінет компанії · Сьогодні
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <DashboardStat
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          iconClass="from-[#A855F7] to-[#7C3AED]"
          value="24"
          label="вакансії"
          note="+3 цього тижня"
        />

        <DashboardStat
          icon={<UsersRound className="h-5 w-5" />}
          iconClass="from-[#60A5FA] to-[#2563EB]"
          value="142"
          label="кандидати"
          note="+18 нових"
        />

        <DashboardStat
          icon={<Star className="h-5 w-5" />}
          iconClass="from-[#FCD34D] to-[#F59E0B]"
          value="4.6"
          label="рейтинг"
          subValue="з 5.0"
        />

        <DashboardStat
          icon={<MessageSquare className="h-5 w-5" />}
          iconClass="from-[#34D399] to-[#10B981]"
          value="+8"
          label="нові відгуки"
          note="сьогодні"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-white">
              Активність вакансій
            </h3>

            <p className="mt-1 text-[12px] text-[#8EA0BA]">останні 7 днів</p>
          </div>

          <span className="text-sm font-black text-emerald-400">↗ +24%</span>
        </div>

        <div className="mt-6 flex h-16 items-end gap-2">
          {[34, 52, 42, 66, 84, 60, 76].map((height, index) => (
            <div
              key={index}
              className={`flex-1 rounded-t-md ${
                index === 4
                  ? "bg-gradient-to-t from-[#F5B82E] to-[#FCD34D]"
                  : "bg-gradient-to-t from-[#3B82F6] to-[#60A5FA]"
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardStat({
  icon,
  iconClass,
  value,
  label,
  note,
  subValue,
}: {
  icon: ReactNode;
  iconClass: string;
  value: string;
  label: string;
  note?: string;
  subValue?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-4">
      <div
        className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${iconClass} text-white`}
      >
        {icon}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <p className="text-3xl font-black leading-none text-white">{value}</p>

        {subValue && <p className="text-sm text-[#8EA0BA]">{subValue}</p>}
      </div>

      <p className="mt-2 text-[13px] text-[#A8B6CD]">{label}</p>

      {note && (
        <p className="mt-2 text-[12px] font-black text-emerald-400">{note}</p>
      )}
    </div>
  );
}

function HiringProcessCard() {
  return (
    <aside className="rounded-3xl border border-[#1E3151] bg-[radial-gradient(circle_at_90%_0%,rgba(139,92,246,0.32),transparent_36%),#0F1D36] p-7 sm:p-10">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-white">
        <Send className="h-7 w-7" />
      </div>
      <h2 className="mt-6 text-3xl font-black tracking-[-0.03em] text-white">
        Як працює найм
      </h2>
      <p className="mt-6 text-[#A8B6CD] text-[14px] leading-relaxed">
        Компанія створює вакансію, кандидат подає заявку, роботодавець
        переглядає профіль і може прийняти, відхилити або перейти в чат для
        інтерв'ю.
      </p>

      <div className="mt-8 space-y-3">
        {process.map((item, index) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-xl bg-[#081426]/70 px-4 py-3 text-[#A8B6CD] text-[14px]"
          >
            <span className="font-black text-[#F5C84C]">0{index + 1}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <Link
        to="/company-vacancies"
        className="mt-8 inline-flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-[#3B82F6] px-5 py-4 text-sm font-bold text-white shadow-[0_18px_38px_-18px_rgba(59,130,246,0.95)] transition hover:bg-[#2563EB]"
      >
        <ArrowRight className="h-4 w-4" />
        Мої вакансії
      </Link>
    </aside>
  );
}
