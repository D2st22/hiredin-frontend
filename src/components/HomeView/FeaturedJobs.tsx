import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { hiredInApi, type VacancyRead } from "../../services/hiredInApi";
import {
  enumLabel,
  getVacancyStatusNumber,
  VacancyStatus,
  workFormatLabels,
  type WorkFormatValue,
} from "../../services/hiredInTypes";

const logoColors = ["#000000", "#1D4ED8", "#16A34A", "#9333EA", "#F97316", "#DB2777"];

function JobCard({ job, index }: { job: VacancyRead; index: number }) {
  const { isEnglish } = useLanguage();
  const companyName = job.companyName?.trim() || (isEnglish ? "Company" : "Компанія");
  const logoText = getInitials(companyName);
  const logoColor = logoColors[index % logoColors.length];

  return (
    <Link
      to={`/vacancy/${job.id}`}
      className="bg-[#0F1D36] border border-[#1E3151] hover:border-[#2A436D] transition-colors rounded-2xl p-6 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: logoColor }}
        >
          <span className="text-[13px] font-bold text-white">{logoText}</span>
        </div>
        <div className="text-[14px] font-semibold text-[#E6ECF5]">
          {companyName}
        </div>
      </div>

      <h3 className="text-[17px] font-bold text-white leading-snug mb-2">
        {job.title?.trim() || (isEnglish ? "Untitled job" : "Вакансія без назви")}
      </h3>

      <div className="text-[13px] text-[#6B7D99] mb-10">
        {job.city?.trim() || (isEnglish ? "Location not specified" : "Локація не вказана")}
        <span className="mx-1">·</span>
        {enumLabel(workFormatLabels, job.workFormat as WorkFormatValue, isEnglish ? "Format not specified" : "Формат не вказано")}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="bg-[#F5C84C]/10 text-[#F5C84C] text-[13px] font-bold px-3 py-1.5 rounded-md">
          {formatSalary(job, isEnglish)}
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B7D99]">
          <span>{isEnglish ? "Open now" : "Активна"}</span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedJobs() {
  const { isEnglish } = useLanguage();
  const [jobs, setJobs] = useState<VacancyRead[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">("loading");

  useEffect(() => {
    let ignore = false;

    async function loadJobs() {
      try {
        const result = await hiredInApi.getPagedVacancies(0, 6);
        if (ignore) return;

        const items = (result.items ?? []).filter(
          (item) => getVacancyStatusNumber(item.status) === VacancyStatus.Published,
        );

        setJobs(items);
        setStatus(items.length ? "ready" : "empty");
      } catch {
        if (!ignore) {
          setJobs([]);
          setStatus("error");
        }
      }
    }

    loadJobs();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="w-full bg-[#0A1628] py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
        {/* Заголовок секції */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-[#F5C84C] text-[13px] font-semibold mb-3">
              {isEnglish ? "Trending jobs" : "Трендові вакансії"}
            </div>
            <h2 className="text-[32px] md:text-[40px] font-bold text-white leading-tight mb-3">
              {isEnglish ? "Hottest openings" : "Найгарячіші вакансії"}
            </h2>
            <p className="text-[#A8B6CD] text-[15px]">
              {isEnglish
                ? "The most searched jobs this week"
                : "Що шукають найчастіше цього тижня"}
            </p>
          </div>

          <Link
            to="/vacanciesList"
            className="flex items-center gap-2 text-[#3B82F6] hover:text-[#60A5FA] text-[15px] font-medium transition-colors pb-1"
          >
            {isEnglish ? "All jobs" : "Всі вакансії"}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {status === "loading" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[210px] animate-pulse rounded-2xl border border-[#1E3151] bg-[#0F1D36]"
              />
            ))}
          </div>
        )}

        {status === "ready" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>
        )}

        {status === "empty" && (
          <EmptyState
            text={
              isEnglish
                ? "There are no published jobs yet."
                : "Поки немає опублікованих вакансій."
            }
          />
        )}

        {status === "error" && (
          <EmptyState
            text={
              isEnglish
                ? "Could not load jobs. Please try again later."
                : "Не вдалося завантажити вакансії. Спробуй оновити сторінку."
            }
          />
        )}
      </div>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] px-6 py-12 text-center text-[#A8B6CD]">
      {text}
    </div>
  );
}

function getInitials(value: string) {
  const words = value
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return value.slice(0, 2).toUpperCase();
}

function formatSalary(job: VacancyRead, isEnglish: boolean) {
  const min = job.salaryMin;
  const max = job.salaryMax;

  if (min != null && max != null) {
    return `${formatMoney(min)} — ${formatMoney(max)} грн`;
  }

  if (min != null) return `${isEnglish ? "from" : "від"} ${formatMoney(min)} грн`;
  if (max != null) return `${isEnglish ? "up to" : "до"} ${formatMoney(max)} грн`;

  return isEnglish ? "Salary not specified" : "ЗП не вказана";
}

function formatMoney(value: number) {
  return value.toLocaleString("uk-UA");
}
