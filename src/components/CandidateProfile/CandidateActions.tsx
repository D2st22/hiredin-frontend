import { FileText, Heart, MessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  { label: "AI-підбір вакансій", to: "/ai-vacancy-match", icon: Sparkles },
  { label: "Обрані вакансії", to: "/favorite-vacancies", icon: Heart },
  { label: "Мої відгуки", to: "/my-reviews", icon: MessageSquare },
  { label: "Мої заяви", to: "/my-applications", icon: FileText },
];

export default function CandidateActions() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {actions.map(({ label, to, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#1E3151] bg-[#0F1D36] px-4 text-sm font-semibold text-[#D7E1EF] transition-colors hover:border-blue-500/70 hover:bg-blue-500/10"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </div>
  );
}
