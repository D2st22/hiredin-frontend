import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  MessageSquare,
  Pencil,
} from "lucide-react";
import EditBlockButton from "./EditBlockButton";

type CandidateProfileHeroProps = {
  viewer?: "company" | "candidate";
  isEditing?: boolean;
  isBlockEditing?: boolean;
  fullName?: string;
  position?: string;
  city?: string;
  openToWork?: boolean;
  avatarUrl?: string | null;
  experienceLabel?: string;
  onEditBlock?: () => void;
  onSaveBlock?: () => void;
};

export default function CandidateProfileHero({
  viewer = "company",
  isEditing = false,
  isBlockEditing = false,
  fullName = "Кандидат",
  position = "Посада не вказана",
  city = "",
  openToWork = true,
  avatarUrl,
  experienceLabel = "Досвід не вказано",
  onEditBlock,
  onSaveBlock,
}: CandidateProfileHeroProps) {
  const initials = getInitials(fullName);
  const location = city ? `${city}, Україна` : "Місто не вказано";
  const status = openToWork ? "Відкритий до пропозицій" : "Не шукає роботу";

  if (viewer === "candidate" && isBlockEditing) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-7 lg:p-10">
        <div className="absolute -bottom-20 -left-16 h-60 w-60 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <CandidateAvatar avatarUrl={avatarUrl} initials={initials} />
            <div>
              <h1 className="flex flex-wrap items-center gap-2 text-3xl font-bold text-[#E8EEF8] sm:text-4xl">
                {fullName}
                <Pencil className="h-4 w-4 text-blue-400" />
              </h1>
              <p className="mt-3 flex items-center gap-2 text-lg text-[#A8B6CD]">
                {position}
                <Pencil className="h-4 w-4 text-blue-400" />
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-[#8FA1BB]">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {location}
                  <Pencil className="h-3.5 w-3.5 text-blue-400" />
                </span>
                <span className="inline-flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4" />
                  {status}
                  <Pencil className="h-3.5 w-3.5 text-blue-400" />
                </span>
                <span className="inline-flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4" />
                  {experienceLabel}
                  <Pencil className="h-3.5 w-3.5 text-blue-400" />
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onSaveBlock}
            className="hidden h-10 min-w-[160px] items-center justify-center rounded-lg bg-[#1B3153] px-5 text-sm font-semibold text-blue-300 transition-colors hover:bg-[#25446F] sm:inline-flex"
          >
            Зберегти
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-7 lg:p-10">
      <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-16 h-60 w-60 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <CandidateAvatar avatarUrl={avatarUrl} initials={initials} />
          <div>
            <h1 className="text-3xl font-bold text-[#E8EEF8] sm:text-4xl">
              {fullName}
            </h1>
            <p className="mt-3 text-lg text-[#A8B6CD]">{position}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-[#8FA1BB]">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {location}
              </span>
              {viewer === "candidate" && (
                <span className="inline-flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4" />
                  {status}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4" />
                {experienceLabel}
              </span>
            </div>
          </div>
        </div>

        {viewer === "candidate" && isEditing && (
          <EditBlockButton onClick={onEditBlock} />
        )}

        {viewer === "company" && (
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#1E3151] bg-[#0A1628] px-5 text-sm font-semibold text-[#D7E1EF] transition-colors hover:bg-[#142440]">
              <MessageSquare className="h-4 w-4" />
              Написати
            </button>
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(59,130,246,0.75)] transition-colors hover:bg-blue-600">
              Запросити на інтерв'ю
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function CandidateAvatar({
  avatarUrl,
  initials,
}: {
  avatarUrl?: string | null;
  initials: string;
}) {
  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 shadow-[0_20px_40px_-16px_rgba(59,130,246,0.6)]">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Аватар кандидата"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-4xl font-extrabold text-white">{initials}</span>
        </div>
      )}
    </div>
  );
}

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "К";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
