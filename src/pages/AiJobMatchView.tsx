import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  FileText,
  Lightbulb,
  Loader2,
  MapPin,
  Sparkles,
  Target,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  ApiError,
  getStoredAccessToken,
  getStoredResumeId,
  hiredInApi,
  storeResumeId,
  type ResumeRead,
  type VacancyRecommendation,
} from "../services/hiredInApi";

type MatchCard = {
  vacancyId: string;
  company: string;
  logo: string;
  title: string;
  salary: string;
  location: string;
  format: string;
  level: string;
  score: number;
  reasons: string[];
  advice: string[];
  tags: string[];
};

const defaultStatus =
  "Обери CV і запусти підбір вакансій.";

export default function AiJobMatchView() {
  const initialResumeId = getStoredResumeId() ?? "";
  const [selectedResumeId, setSelectedResumeId] = useState(initialResumeId);
  const [resumes, setResumes] = useState<ResumeRead[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [matches, setMatches] = useState<MatchCard[]>([]);
  const [resumeAdvice, setResumeAdvice] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState(defaultStatus);
  const [isLiveResult, setIsLiveResult] = useState(false);

  const hasToken = Boolean(getStoredAccessToken());
  const bestScore = useMemo(
    () => Math.max(...matches.map((match) => match.score), 0),
    [matches],
  );

  useEffect(() => {
    if (!hasToken) return;
    void loadResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasToken]);

  async function loadResumes() {
    try {
      const nextResumes = await hiredInApi.getMyResumes();
      setResumes(nextResumes);

      if (!selectedResumeId && nextResumes[0]?.id) {
        setSelectedResumeId(nextResumes[0].id);
        storeResumeId(nextResumes[0].id);
      }

      setStatusMessage(
        nextResumes.length
          ? "CV завантажено. Можна запускати AI-підбір."
          : "У тебе ще немає CV. Створи резюме в конструкторі, потім повернись сюди.",
      );
    } catch {
      setStatusMessage(
        "Не вдалося завантажити список CV. Спробуй оновити сторінку.",
      );
    }
  }

  async function runMatching() {
    const resumeId = selectedResumeId.trim();

    if (!hasToken) {
      setMatches([]);
      setResumeAdvice([]);
      setIsLiveResult(false);
      setStatusMessage("Для AI-підбору потрібно увійти в акаунт кандидата.");
      return;
    }

    if (!resumeId) {
      setMatches([]);
      setResumeAdvice([]);
      setIsLiveResult(false);
      setStatusMessage("Спочатку обери CV.");
      return;
    }

    setIsRunning(true);
    setStatusMessage("AI аналізує CV та порівнює його з вакансіями...");
    storeResumeId(resumeId);

    try {
      const recommendations = await hiredInApi.getRecommendedVacancies(resumeId);
      const mapped = recommendations.map(mapRecommendationToCard);

      const [enriched, tips] = await Promise.all([
        enrichMatchesWithExplanations(resumeId, mapped),
        hiredInApi.getResumeImprovementTips(resumeId).catch(() => ""),
      ]);

      setMatches(enriched);
      setResumeAdvice(splitAiText(tips, []));
      setIsLiveResult(true);
      setStatusMessage(
        enriched.length
          ? "AI-підбір виконано. Рекомендації готові."
          : "Для цього CV поки немає рекомендованих вакансій.",
      );
    } catch (error) {
      setMatches([]);
      setResumeAdvice([]);
      setIsLiveResult(false);

      if (error instanceof ApiError && error.status === 401) {
        setStatusMessage("Сесія закінчилась або немає доступу. Увійди в акаунт кандидата ще раз.");
      } else {
        setStatusMessage("Не вдалося отримати рекомендації. Спробуй пізніше.");
      }
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#081426] text-white">
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-[80px] lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-300">
                  <Sparkles className="h-4 w-4" />
                  AI-підбір вакансій
                </div>
                <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Підібрати вакансії під моє CV
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#A8B6CD] sm:text-base">
                  Система бере резюме кандидата, рахує відповідність до вакансій,
                  пояснює збіги та дає поради, що покращити перед відгуком.
                </p>
              </div>

              <button
                type="button"
                onClick={runMatching}
                disabled={isRunning}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(59,130,246,0.9)] transition-colors hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#1B3153] sm:w-auto"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <WandSparkles className="h-4 w-4" />
                )}
                {isRunning ? "AI аналізує..." : "Запустити підбір"}
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-[#1E3151] bg-[#0A1628] px-4 py-3 text-sm leading-6 text-[#A8B6CD]">
              <span className={isLiveResult ? "text-emerald-400" : "text-[#F5C84C]"}>
                {isLiveResult ? "Готово" : "Очікує запуск"}
              </span>
              <span className="text-[#53647E]"> · </span>
              {statusMessage}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric icon={Target} label="Найкращий збіг" value={`${bestScore}%`} tone="text-emerald-400" />
              <Metric icon={BriefcaseBusiness} label="Знайдено вакансій" value={`${matches.length}`} />
              <Metric icon={FileText} label="CV" value={getSelectedResumeLabel(resumes, selectedResumeId)} />
            </div>
          </section>

          <aside className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/15 text-blue-300">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-white">CV для аналізу</h2>
                <p className="text-xs text-[#7F90AA]">
                  {hasToken ? "Обери резюме для підбору" : "Потрібен вхід кандидата"}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#8EA0BA]">
                  Моє CV
                </span>
                <select
                  value={selectedResumeId}
                  onChange={(event) => {
                    setSelectedResumeId(event.target.value);
                    if (event.target.value) storeResumeId(event.target.value);
                  }}
                  className="h-11 w-full rounded-xl border border-[#1E3151] bg-[#081426] px-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="">Не вибрано</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title || resume.desiredPosition || resume.id}
                    </option>
                  ))}
                </select>
              </label>

              {!hasToken && (
                <Link
                  to="/candidateLogin"
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#3B82F6] text-sm font-bold text-white hover:bg-[#2563EB]"
                >
                  Увійти кандидатом
                </Link>
              )}

              <Link
                to="/resume-builder"
                className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-blue-500/30 text-sm font-bold text-blue-300 hover:bg-blue-500/10"
              >
                Створити CV
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white">
                  Рекомендовані вакансії
                </h2>
              </div>
              <Link
                to="/vacanciesList"
                className="inline-flex h-10 items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                Відкрити всі вакансії
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {isRunning && (
              <div className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-400" />
                <p className="mt-4 text-sm font-semibold text-[#D7E1EF]">
                  AI порівнює CV з вимогами вакансій...
                </p>
              </div>
            )}

            {!isRunning && matches.length === 0 && (
              <div className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 text-center text-sm leading-6 text-[#A8B6CD]">
                Рекомендацій поки немає. Обери CV і натисни “Запустити підбір”.
              </div>
            )}

            {!isRunning &&
              matches.map((match) => (
                <article
                  key={match.vacancyId}
                  className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 transition-colors hover:border-blue-500/60 sm:p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-blue-600 text-2xl font-black text-white">
                      {match.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h3 className="text-xl font-extrabold text-white">
                            {match.title}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#A8B6CD]">
                            <span className="font-semibold text-white">{match.company}</span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {match.location}
                            </span>
                            <span>{match.format}</span>
                            <span>{match.level}</span>
                          </div>
                        </div>
                        <div className="shrink-0 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center">
                          <p className="text-2xl font-black text-emerald-400">
                            {match.score}%
                          </p>
                          <p className="text-xs text-[#8EA0BA]">збіг</p>
                        </div>
                      </div>

                      <div className="mt-4 inline-flex rounded-lg bg-[#F5C84C]/10 px-3 py-2 text-sm font-extrabold text-[#F5C84C]">
                        {match.salary}
                      </div>

                      <div className="mt-5 grid gap-4 xl:grid-cols-2">
                        <InfoBox icon={Bot} title="Чому підходить" items={match.reasons} />
                        <InfoBox icon={Lightbulb} title="Що підтягнути" items={match.advice} />
                      </div>

                      {match.tags.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {match.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-[#1E3151] px-2.5 py-1.5 text-xs font-medium text-[#8EA0BA]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <Link
                          to={`/vacancy/${match.vacancyId}`}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-bold text-white hover:bg-[#2563EB]"
                        >
                          Переглянути вакансію
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </section>

          <aside className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-white">
              <Lightbulb className="h-5 w-5 text-[#F5C84C]" />
              AI-поради щодо CV
            </h2>
            <div className="mt-5 space-y-3">
              {resumeAdvice.length === 0 && (
                <div className="rounded-xl border border-[#1E3151] bg-[#0A1628] p-4 text-sm leading-6 text-[#8EA0BA]">
                  Поради з'являться після аналізу CV.
                </div>
              )}
              {resumeAdvice.map((advice, index) => (
                <div
                  key={`${advice}-${index}`}
                  className="rounded-xl border border-[#1E3151] bg-[#0A1628] p-4"
                >
                  <span className="text-xs font-bold text-blue-400">
                    Порада {index + 1}
                  </span>
                  <p className="mt-2 text-sm leading-6 text-[#B8C4D6]">
                    {advice}
                  </p>
                </div>
              ))}
            </div>
            <Link
              to="/candidateCabinet"
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1E3151] text-sm font-bold text-[#D7E1EF] hover:bg-blue-500/10"
            >
              Відкрити кабінет
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

async function enrichMatchesWithExplanations(resumeId: string, matches: MatchCard[]) {
  return Promise.all(
    matches.map(async (match) => {
      try {
        const explanation = await hiredInApi.explainVacancyRecommendation(
          resumeId,
          match.vacancyId,
        );
        const reasons = splitAiText(explanation, match.reasons);
        return { ...match, reasons };
      } catch {
        return match;
      }
    }),
  );
}

function mapRecommendationToCard(recommendation: VacancyRecommendation): MatchCard {
  const company = recommendation.companyName ?? "Компанія";
  const matchedSkills = recommendation.matchedSkills ?? [];
  const missingSkills = recommendation.missingSkills ?? [];

  return {
    vacancyId: recommendation.vacancyId,
    company,
    logo: company.slice(0, 1).toUpperCase(),
    title: recommendation.title ?? "Вакансія",
    salary: formatSalary(recommendation.salaryMin, recommendation.salaryMax),
    location: recommendation.city ?? "Локація не вказана",
    format: formatApiValue(recommendation.workFormat, "Формат не вказано"),
    level: formatApiValue(recommendation.experienceLevel, "Рівень не вказано"),
    score: normalizeScore(recommendation.matchScore),
    reasons: [
      matchedSkills.length
        ? `Збігаються навички: ${matchedSkills.join(", ")}.`
        : "Backend визначив релевантність за даними CV та вакансії.",
      recommendation.employmentType
        ? `Тип зайнятості: ${formatApiValue(recommendation.employmentType, "не вказано")}.`
        : "Тип зайнятості треба уточнити в описі вакансії.",
    ],
    advice: [
      missingSkills.length
        ? `Варто підтягнути або підкреслити: ${missingSkills.join(", ")}.`
        : "Критичних прогалин за навичками не знайдено.",
    ],
    tags: matchedSkills.length ? matchedSkills : missingSkills,
  };
}

function splitAiText(text: string, fallback: string[]) {
  const parts = text
    .split(/\r?\n|•|- /)
    .map((item) => item.trim())
    .filter(Boolean);

  return parts.length ? parts.slice(0, 5) : fallback;
}

function formatSalary(min?: number | null, max?: number | null) {
  if (min && max) return `${formatMoney(min)} - ${formatMoney(max)} грн`;
  if (min) return `від ${formatMoney(min)} грн`;
  if (max) return `до ${formatMoney(max)} грн`;
  return "Зарплата не вказана";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(value);
}

function formatApiValue(value: string | number | null | undefined, fallback: string) {
  if (value == null || value === "") return fallback;
  return String(value);
}

function normalizeScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getSelectedResumeLabel(resumes: ResumeRead[], selectedResumeId: string) {
  if (!selectedResumeId) return "Не обрано";

  const resume = resumes.find((item) => item.id === selectedResumeId);
  return resume?.title || resume?.desiredPosition || "Обрано";
}

function InfoBox({
  icon: Icon,
  title,
  items,
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl bg-[#0A1628] p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
        <Icon className="h-4 w-4 text-blue-400" />
        {title}
      </p>
      <ul className="space-y-2 text-sm leading-6 text-[#B8C4D6]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone = "text-white",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-xl border border-[#1E3151] bg-[#0A1628] p-4">
      <Icon className="h-5 w-5 text-blue-400" />
      <p className={`mt-3 text-2xl font-black ${tone}`}>{value}</p>
      <p className="mt-1 text-xs text-[#8EA0BA]">{label}</p>
    </div>
  );
}
