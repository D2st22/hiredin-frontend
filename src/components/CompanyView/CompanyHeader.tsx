interface CompanyHeaderProps {
  onVacanciesClick: () => void;
  isOwnProfile?: boolean;
  vacanciesCount?: number;
  company?: {
    name?: string | null;
    description?: string | null;
    city?: string | null;
    website?: string | null;
    logoUrl?: string | null;
    status?: string | number | null;
  } | null;
}

export default function CompanyHeader({
  onVacanciesClick,
  isOwnProfile = false,
  vacanciesCount = 0,
  company,
}: CompanyHeaderProps) {
  const name = company?.name || "Компанія";
  const city = company?.city || "Локація не вказана";
  const website = company?.website || "";
  const websiteHref = website.startsWith("http")
    ? website
    : `https://${website}`;

  return (
    <section className="w-full bg-[#0A1628] pt-8">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px]">
        <div className="mb-8 flex items-center gap-2 text-[13px] text-[#6B7D99]">
          <span>Компанії</span>
          <span>·</span>
          <span className="text-[#A8B6CD]">{name}</span>
        </div>

        <div className="relative mb-10 overflow-hidden rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 lg:p-10">
          <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] bg-blue-600/10 blur-[100px]" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row">
            <div className="flex flex-1 flex-col items-start gap-6 sm:flex-row">
              <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#1E3151]/50 bg-gradient-to-br from-[#1A1A1A] to-[#333333] shadow-2xl">
                {company?.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={`${name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold tracking-tight text-white">
                    {name.slice(0, 1).toLowerCase()}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-3"></div>

                <h1 className="mb-4 text-[32px] font-bold leading-tight text-white lg:text-[40px]">
                  {name}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-[14px]">
                  <div className="flex items-center gap-2 text-[#E6ECF5]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6B7D99"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {city}
                  </div>
                  {website && (
                    <a
                      href={websiteHref}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#3B82F6] transition-colors hover:text-[#60A5FA]"
                    >
                      {website}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-shrink-0 flex-col gap-4 lg:w-56">
              {isOwnProfile ? (
                <>
                  <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#1E3151] bg-transparent text-sm font-semibold text-[#A8B6CD] transition-colors hover:bg-[#0A1628] hover:text-white">
                    Редагувати профіль
                  </button>
                  <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-[#2563EB]">
                    Створити вакансію
                  </button>
                </>
              ) : (
                <>
                  {vacanciesCount > 0 && (
                    <button
                      onClick={onVacanciesClick}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-[#2563EB]"
                    >
                      <span>Переглянути вакансії</span>
                      <span className="ml-1 font-medium text-white/80">
                        {vacanciesCount}
                      </span>
                    </button>
                  )}
                  <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#1E3151] bg-transparent font-medium text-[#A8B6CD] transition-colors hover:bg-[#0A1628] hover:text-white">
                    Написати в чат
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
