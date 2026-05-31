import {
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  FileText,
  MessageSquare,
  Search,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const routeSteps = [
  {
    icon: UserRound,
    title: "Створи profile",
    text: "Базова інфа, бажаний work format, готовність до пропозицій і короткий опис про себе.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: FileText,
    title: "Resume",
    text: "Конструктор або готовий PDF. AI розуміє освіту, досвід, skills і ключові технології.",
    color: "from-blue-500 to-sky-500",
  },
  {
    icon: Search,
    title: "Шукай і подавай",
    text: "Фільтруй jobs або відкрий AI-рекомендації з поясненням, чому вакансія підходить.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: MessageSquare,
    title: "Інтерв'ю і офер",
    text: "Спілкуйся з компанією в чаті, відстежуй pipeline, отримуй фідбек і офер.",
    color: "from-amber-400 to-orange-500",
  },
];

const insideFeatures = [
  {
    icon: BriefcaseBusiness,
    title: "Мої заявки - pipeline",
    text: "Усі заявки в одному списку з реальним статусом: переглянуто, інтерв'ю, офер, відмова. Без email-переписок.",
    color: "from-violet-500 to-purple-500",
    wide: true,
  },
  {
    icon: MessageSquare,
    title: "Чат з компаніями",
    text: "Уточнюй роль, домовляйся про інтерв'ю, отримуй фідбек - все в одному чаті. SignalR realtime, історія зберігається.",
    color: "from-emerald-500 to-teal-500",
    wide: true,
  },
  {
    icon: Bookmark,
    title: "Обрані jobs",
    text: "Зберігай вакансії, повертайся пізніше, порівнюй умови і не губи цікаві пропозиції.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Конструктор resume",
    text: "Версії під різні ролі, експорт PDF, готові шаблони і акуратна структура.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Bell,
    title: "Нотифікації",
    text: "Зміна статусу одразу. Ти знаєш, що відбулося із заявкою, без email-затримок.",
    color: "from-violet-500 to-fuchsia-500",
  },
];

const aiSteps = [
  {
    icon: UserRound,
    title: "Заповни profile",
    text: "У кабінеті вкажи city, бажаний work format, готовність до пропозицій і короткий опис про себе.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: FileText,
    title: "Створи або подай resume",
    text: "Додай experience, education і skills у конструкторі CV або завантаж готовий файл.",
    color: "from-blue-500 to-sky-500",
  },
  {
    icon: Sparkles,
    title: "Відкрий AI-matching",
    text: "Система проаналізує resume та порівняє його з доступними jobs.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Target,
    title: "Переглянь рекомендації",
    text: "Обери вакансію з найкращим match, поясненням і списком missing skills.",
    color: "from-amber-400 to-orange-500",
  },
];

const stories = [
  {
    quote:
      "AI-підбір показав 5 вакансій, які я ніколи б сам не знайшов. Офер за 11 днів.",
    name: "Андрій К.",
    role: "Frontend Engineer · Monobank",
    color: "bg-violet-500",
  },
  {
    quote:
      "Конструктор resume зекономив мені тиждень. Три версії під різні ролі - і кожна виглядає чисто.",
    name: "Марія Л.",
    role: "Product Designer · Genesis",
    color: "bg-blue-500",
  },
  {
    quote:
      "Один кабінет замість Excel-таблиці з 30 вакансіями. Видно, де я в pipeline, без email-стресу.",
    name: "Олег П.",
    role: "QA Engineer · SoftServe",
    color: "bg-emerald-500",
  },
];

const jobs = [
  {
    title: "Senior Frontend Engineer",
    company: "Monobank · Київ / remote · $3-5k",
    tags: ["React", "TypeScript", "Next.js"],
    score: "92% match",
    accent: "text-emerald-400",
  },
  {
    title: "Product Designer (UI/UX)",
    company: "Genesis · Київ · $2.5-4k",
    tags: ["Figma", "Prototype", "Design System"],
    score: "81% match",
    accent: "text-amber-300",
  },
  {
    title: "Full-stack Developer",
    company: "SoftServe · remote · $4-6k",
    tags: ["Node.js", "PostgreSQL", "React"],
    score: "76% match",
    accent: "text-blue-300",
  },
];

export default function CandidateGuideView() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    document.querySelector(location.hash)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-[#071323] text-white">
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-8 lg:px-[72px] lg:py-16">
        <section className="grid items-center gap-10 lg:grid-cols-[0.92fr_0.88fr]">
          <div className="max-w-[620px]">
            <h1 className="mt-7 max-w-[620px] text-4xl font-bold leading-[1.1] text-white sm:text-[48px] lg:text-[64px]">
              Знайди роботу, що збігається з тобою на{" "}
              <span className="text-[#F5C84C]">87%+</span>
            </h1>

            <p className="mt-6 max-w-[540px] text-[16px] leading-relaxed text-[#A8B6CD] lg:text-[18px]">
              Завантаж resume один раз - Kriposnyj щодня знаходить jobs, які
              підходять твоїм skills, формату і досвіду. З поясненням
              match-score і списком пробілів, які варто прокачати.
            </p>

            <div className="mt-8 flex max-w-[540px] flex-col gap-3 rounded-xl border border-[#1E3151] bg-[#10213A] p-3 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-2 text-sm text-[#C8D3E3]">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />

                <span className="truncate">
                  Frontend, React, Київ або remote
                </span>
              </div>

              <Link
                to="/vacanciesList"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#3B82F6] px-5 text-[15px] font-semibold text-white transition hover:bg-[#2563EB]"
              >
                Шукати
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#64748B]">
              <span>Популярне:</span>
              <span>React Developer</span>
              <span>QA Manual</span>
              <span>UI/UX Designer</span>
              <span>Product Manager</span>
            </div>
          </div>

          <MatchPreview />
        </section>

        <div className="my-16 flex items-center gap-6 text-center text-xs text-[#52647E]">
          <span className="h-px flex-1 bg-[#1E3151]" />
        </div>

        <section>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#F6B72A]">
                Маршрут кандидата
              </p>
              <h2 className="mt-4 max-w-[520px] text-3xl font-black leading-tight sm:text-4xl">
                Від profile до офера за 4 кроки
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {routeSteps.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} />
            ))}
          </div>
        </section>

        <section className="mt-20">
          <p className="text-xs font-black uppercase tracking-wide text-[#F6B72A]">
            Кабінет кандидата
          </p>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            Що ти отримаєш всередині
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {insideFeatures.map((item) => (
              <FeatureCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section
          id="ai-guide"
          className="mt-20 scroll-mt-24 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 shadow-[0_30px_100px_rgba(59,130,246,0.08)] sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/15 px-3 py-1.5 text-xs font-bold text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />
                AI-підбір вакансій
              </span>
              <h2 className="mt-6 max-w-[980px] text-3xl font-black leading-tight sm:text-4xl">
                Як AI допомагає кандидату знайти{" "}
                <span className="text-[#F6B72A]">релевантну вакансію</span>
              </h2>
              <p className="mt-4 max-w-[900px] text-sm leading-7 text-[#8EA0BA]">
                Це не окрема магічна кнопка "знайди мені work", а короткий
                маршрут: ти даєш системі нормальні дані про себе, AI порівнює їх
                з jobs, а потім показує, куди варто дивитися першим.
              </p>
            </div>
            <Link
              to="/ai-vacancy-match"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-bold text-white transition hover:bg-[#2563EB]"
            >
              Спробувати AI-підбір
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {aiSteps.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} compact />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[#1E3151] bg-[#091526] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-black">
                Що треба підготувати перед AI-підбором
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#8EA0BA]">
                Мінімум: resume, 5-8 skills, бажана роль і work format. Чим
                повніший profile, тим точніші рекомендації та пояснення match.
              </p>
            </div>
            <Link
              to="/resume-builder"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-bold text-white transition hover:bg-[#2563EB]"
            >
              Заповнити CV
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#F6B72A]">
                Історії кандидатів
              </p>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Знайшли роботу через Kriposnyj
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {stories.map((story) => (
              <article
                key={story.name}
                className="rounded-xl border border-[#1E3151] bg-[#0F1D36] p-6"
              >
                <p className="text-sm font-semibold leading-6 text-[#D7E1EF]">
                  "{story.quote}"
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-lg ${story.color} text-sm font-black`}
                  >
                    {story.name.slice(0, 1)}
                  </div>

                  <div>
                    <p className="font-bold">{story.name}</p>
                    <p className="text-xs text-[#8EA0BA]">{story.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function MatchPreview() {
  return (
    <div className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 shadow-[0_30px_100px_rgba(59,130,246,0.12)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-black">Підібрано для тебе</p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {jobs.map((job) => (
          <article
            key={job.title}
            className="rounded-xl border border-[#1E3151] bg-[#091526] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-black">{job.title}</h3>
                <p className="mt-1 text-xs text-[#8EA0BA]">{job.company}</p>
              </div>
              <span
                className={`rounded-lg bg-white/5 px-3 py-1 text-xs font-black ${job.accent}`}
              >
                {job.score}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[#142642] px-2 py-1 text-xs text-[#8EA0BA]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-[#8EA0BA]">
        <span>+ ще 24 вакансії за критеріями</span>
        <Link to="/ai-vacancy-match" className="font-bold text-blue-400">
          Переглянути всі →
        </Link>
      </div>
    </div>
  );
}

function StepCard({
  step,
  index,
  compact = false,
}: {
  step: {
    icon: LucideIcon;
    title: string;
    text: string;
    color: string;
  };
  index: number;
  compact?: boolean;
}) {
  const Icon = step.icon;

  return (
    <article
      className={`rounded-xl border border-[#1E3151] bg-[#0F1D36] ${compact ? "p-5" : "p-6"}`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br ${step.color}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-sm font-black text-[#31415E]">0{index + 1}</span>
      </div>
      <h3 className="mt-6 font-black">{step.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#8EA0BA]">{step.text}</p>
    </article>
  );
}

function FeatureCard({
  item,
}: {
  item: {
    icon: LucideIcon;
    title: string;
    text: string;
    color: string;
    wide?: boolean;
  };
}) {
  const Icon = item.icon;

  return (
    <article
      className={`rounded-xl border border-[#1E3151] bg-[#0F1D36] p-6 ${
        item.wide ? "lg:col-span-3" : "lg:col-span-2"
      }`}
    >
      <div
        className={`grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br ${item.color}`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="mt-5 font-black">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#8EA0BA]">{item.text}</p>
    </article>
  );
}
