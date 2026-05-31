import { BriefcaseBusiness, Star, UsersRound } from "lucide-react";
import type { ReactNode } from "react";

type StatTone = "blue" | "green" | "violet";

export default function CompanyStats({
  vacanciesCount = 0,
  rating,
  employeesCount = 0,
}: {
  vacanciesCount?: number;
  rating?: string | number | null;
  employeesCount?: number;
}) {
  const stats: Array<{
    icon: ReactNode;
    value: string | number;
    label: string;
    tone: StatTone;
  }> = [
    {
      icon: <BriefcaseBusiness className="h-5 w-5" />,
      value: vacanciesCount,
      label: "відкритих вакансій",
      tone: "blue",
    },
    {
      icon: <Star className="h-5 w-5" />,
      value: rating ?? "—",
      label: "рейтинг від команди",
      tone: "green",
    },
    {
      icon: <UsersRound className="h-5 w-5" />,
      value: employeesCount,
      label: "співробітники",
      tone: "violet",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className="flex h-36 flex-col justify-between rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${iconToneClass(
              item.tone,
            )}`}
          >
            {item.icon}
          </div>
          <div>
            <div
              className={`mb-1 text-[32px] font-bold leading-none ${valueToneClass(
                item.tone,
              )}`}
            >
              {item.value}
            </div>
            <div className="text-[13px] text-[#6B7D99]">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function iconToneClass(tone: StatTone) {
  if (tone === "green") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }
  if (tone === "violet") {
    return "border-violet-500/20 bg-violet-500/10 text-violet-300";
  }

  return "border-blue-500/20 bg-blue-500/10 text-[#60A5FA]";
}

function valueToneClass(tone: StatTone) {
  if (tone === "green") return "text-emerald-400";
  if (tone === "violet") return "text-violet-300";

  return "text-white";
}
