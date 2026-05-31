type EducationCardProps = {
  logo: string;
  logoClassName: string;
  title: string;
  subtitle: string;
  years: string;
};

export default function EducationCard({
  logo,
  logoClassName,
  title,
  subtitle,
  years,
}: EducationCardProps) {
  return (
    <article className="rounded-xl border border-[#1E3151] bg-[#0F1D36] p-5">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${logoClassName}`}
        >
          {logo}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-[#8FA1BB]">{subtitle}</p>
        </div>
        <p className="shrink-0 text-xs text-[#6B7D99]">{years}</p>
      </div>
    </article>
  );
}
