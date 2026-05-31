type ExperienceCardProps = {
  logo: string;
  logoClassName: string;
  title: string;
  company: string;
  period: string;
  duration: string;
  description: string;
  isCurrent?: boolean;
};

export default function ExperienceCard({
  logo,
  logoClassName,
  title,
  company,
  period,
  duration,
  description,
  isCurrent = false,
}: ExperienceCardProps) {
  return (
    <article className="rounded-xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-6">
      <div className="flex gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${logoClassName}`}
        >
          {logo}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                <span className="text-[#8FA1BB]">{company}</span>
                {isCurrent && (
                  <span className="text-xs font-medium text-emerald-400">
                    Поточна
                  </span>
                )}
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-[#6B7D99]">{period}</p>
              {duration && (
                <p className="mt-1 text-[11px] text-[#53647E]">{duration}</p>
              )}
            </div>
          </div>
          <p className="mt-5 max-w-[680px] text-sm leading-6 text-[#B8C4D6]">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
