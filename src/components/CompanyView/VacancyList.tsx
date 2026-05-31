import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { VacancyRead } from "../../services/hiredInApi";

export default function VacancyList({
  vacancies = [],
  companyId,
}: {
  vacancies?: VacancyRead[];
  companyId?: string | null;
}) {
  const allVacanciesLink = companyId
    ? `/vacanciesList?companyId=${companyId}`
    : "/vacanciesList";

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-[20px] font-bold text-white">
          Відкриті вакансії · {vacancies.length}
        </h3>
        {vacancies.length > 0 && (
          <Link
            to={allVacanciesLink}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#60A5FA] hover:text-[#93C5FD]"
          >
            Показати всі
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {vacancies.length > 0 ? (
        <div className="flex flex-col gap-4">
          {vacancies.slice(0, 3).map((vacancy) => (
            <Link
              key={vacancy.id}
              to={
                companyId
                  ? `/vacancy/${vacancy.id}?companyId=${companyId}`
                  : `/vacancy/${vacancy.id}`
              }
              className="flex flex-col justify-between gap-6 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 transition-colors hover:border-[#2A436D] sm:flex-row sm:items-center"
            >
              <div className="flex flex-col gap-2">
                <div className="text-[12px] text-[#6B7D99]">
                  {formatMeta(vacancy)}
                </div>
                <h4 className="text-[18px] font-bold text-white transition-colors group-hover:text-[#3B82F6]">
                  {vacancy.title || "Вакансія"}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#6B7D99]">
                  {vacancy.city && <span className="text-[#A8B6CD]">{vacancy.city}</span>}
                  {vacancy.workFormat != null && (
                    <>
                      <span>·</span>
                      <span>{String(vacancy.workFormat)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                {(vacancy.salaryMin || vacancy.salaryMax) && (
                  <div className="whitespace-nowrap rounded-xl border border-[#F5C84C]/20 bg-[#F5C84C]/10 px-4 py-2 text-[13px] font-bold text-[#F5C84C]">
                    {formatSalary(vacancy.salaryMin, vacancy.salaryMax)}
                  </div>
                )}
                <span className="inline-flex items-center gap-1 rounded-xl bg-[#3B82F6] px-4 py-2 text-[13px] font-semibold text-white">
                  Відгукнутися
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#1E3151] px-5 py-8 text-center text-sm text-[#8EA0BA]">
          Вакансій поки немає.
        </div>
      )}
    </div>
  );
}

function formatMeta(vacancy: VacancyRead) {
  return [vacancy.experienceLevel, vacancy.employmentType].filter(Boolean).join(" · ") || "Вакансія";
}

function formatSalary(min?: number | null, max?: number | null) {
  if (min && max) return `${formatMoney(min)} - ${formatMoney(max)} грн`;
  if (min) return `від ${formatMoney(min)} грн`;
  if (max) return `до ${formatMoney(max)} грн`;
  return "";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}
