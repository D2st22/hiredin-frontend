import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface CardProps {
  data: {
    companyLogo: string;
    logoBg: string;
    logoTextColor?: string;
    title: string;
    salary: string;
    company: string;
    location: string;
    isVerified: boolean;
    tags: string[];
    date: string;
    isHot?: boolean;
    to?: string;
    onFavorite?: () => void;
    isFavorite?: boolean;
  };
}

export default function VacancyCardMain({ data }: CardProps) {
  return (
    <article className="group relative rounded-2xl border border-[#1E3151]/60 bg-[#0F1D36] p-5 transition-colors hover:border-[#2A436D] sm:p-7">
      {data.isHot && (
        <span className="absolute right-6 top-0 rounded-b-md bg-[#F5C84C] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0A1628]">
          Hot
        </span>
      )}

      {data.onFavorite && (
        <button
          type="button"
          onClick={data.onFavorite}
          className={`absolute bottom-5 right-5 z-10 grid h-10 w-10 place-items-center rounded-lg border transition-colors sm:bottom-7 sm:right-7 ${
            data.isFavorite
              ? "border-blue-400/40 bg-blue-500/20 text-blue-300"
              : "border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
          }`}
          aria-label={
            data.isFavorite
              ? "Вакансія вже в обраних"
              : "Додати вакансію в обрані"
          }
          aria-pressed={data.isFavorite}
        >
          <Heart
            className="h-4 w-4"
            fill={data.isFavorite ? "currentColor" : "none"}
          />
        </button>
      )}

      <Link
        to={data.to ?? "/jobDescription"}
        className="flex flex-col gap-5 pr-0 sm:flex-row sm:items-start sm:gap-6 sm:pr-14"
      >
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl font-black ${data.logoBg} ${data.logoTextColor || "text-white"}`}
        >
          {data.companyLogo}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="mb-3 text-xl font-bold text-[#3B82F6] transition-colors group-hover:text-[#60A5FA]">
            {data.title}
          </h3>

          <div className="mb-4 inline-block rounded-lg border border-[#F5C84C]/20 bg-[#F5C84C]/10 px-4 py-2 text-sm font-bold text-[#F5C84C]">
            {data.salary}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[#A8B6CD]">
            <span className="font-semibold text-white">{data.company}</span>
            <span className="text-[#1E3151]">•</span>
            <span>{data.location}</span>
            {data.isVerified && (
              <>
                <span className="text-[#1E3151]">•</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-[#10B981]">
                  <VerifiedIcon />
                  Перевірена компанія
                </span>
              </>
            )}
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2.5 text-sm text-[#6B7D99]">
            {data.tags.map((tag, index) => (
              <div
                key={`${tag}-${index}`}
                className="flex items-center gap-2.5"
              >
                <span
                  className={
                    index === 0 || tag === "Remote"
                      ? "font-medium text-white"
                      : ""
                  }
                >
                  {tag}
                </span>
                {index < data.tags.length - 1 && (
                  <span className="text-[#1E3151]">•</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#1E3151]/40 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[#6B7D99]">Опубліковано {data.date}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function VerifiedIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
