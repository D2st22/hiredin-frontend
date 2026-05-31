import { Link } from "react-router-dom";

interface CompanyCardProps {
  data: {
    logo: string;
    logoUrl?: string | null;
    logoBg: string;
    name: string;
    isVerified: boolean;
    vacanciesCount: number;
    industry: string;
    location: string;
    description: string;
    to?: string;
  };
}

export default function CompanyCard({ data }: CompanyCardProps) {
  return (
    <Link
      to={data.to ?? "/companyProfile"}
      className="block rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 transition-colors hover:border-[#2A436D] sm:p-7"
    >
      <div className="relative">
        <div className="flex flex-col gap-5 pr-0 sm:flex-row sm:items-start sm:gap-6">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white ${data.logoBg}`}
          >
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt={`${data.name} logo`}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              data.logo
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-white">{data.name}</h3>
              {data.isVerified && (
                <span className="flex items-center gap-1 text-xs font-medium text-[#10B981]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Перевірена компанія
                </span>
              )}
            </div>

            <div className="mb-4 flex items-center gap-1.5 text-xs font-bold text-[#FCD34D]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              {data.vacanciesCount} {formatVacanciesLabel(data.vacanciesCount)}
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-[#A8B6CD]">
              <span>{data.industry}</span>
              <span className="text-[#1E3151]">•</span>
              <span>{data.location}</span>
            </div>

            <p className="mb-5 max-w-2xl text-sm leading-relaxed text-slate-500">
              {data.description}
            </p>

            <span className="flex items-center gap-2 text-sm font-semibold text-[#3B82F6] transition-colors hover:text-[#60A5FA]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
              </svg>
              Переглянути компанію
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function formatVacanciesLabel(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "відкрита вакансія";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "відкриті вакансії";
  }

  return "відкритих вакансій";
}
