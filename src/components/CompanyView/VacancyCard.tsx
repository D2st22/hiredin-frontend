import { Link } from "react-router-dom";

interface VacancyProps {
  vacancy: {
    category: string;
    time: string;
    title: string;
    location: string;
    format: string;
    tags: string[];
    salary: string;
  };
  isOwnProfile?: boolean; // Додаємо рольовий поділ для картки
}

export default function VacancyCard({
  vacancy,
  isOwnProfile = false,
}: VacancyProps) {
  return (
    <div className="bg-[#0F1D36] border border-[#1E3151] hover:border-[#2A436D] transition-colors rounded-2xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6 cursor-pointer group">
      {/* ЛІВА ЧАСТИНА: Контент вакансії */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="text-[12px] text-[#6B7D99]">
          {vacancy.category} <span className="mx-1.5">·</span> {vacancy.time}
        </div>

        <h4 className="text-[18px] font-bold text-white group-hover:text-[#3B82F6] transition-colors">
          {vacancy.title}
        </h4>

        <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#6B7D99]">
          <span className="text-[#A8B6CD]">
            {vacancy.location} · {vacancy.format}
          </span>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            {vacancy.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#1E3151]/50 text-[#A8B6CD] px-2 py-0.5 rounded text-[12px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ПРАВА ЧАСТИНА: Залежить від ролі (Власник чи Гість) */}
      <div className="flex items-center gap-4 sm:self-center self-end">
        {/* Відображення зарплати (для всіх однакове) */}
        <div className="bg-[#F5C84C]/10 border border-[#F5C84C]/20 text-[#F5C84C] text-[13px] font-bold px-4 py-2 rounded-xl whitespace-nowrap">
          {vacancy.salary}
        </div>

        {isOwnProfile ? (
          /* КНОПКИ ДЛЯ ВЛАСНИКА (Додаються всередину картки праворуч) */
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="p-2 bg-[#1E3151]/60 hover:bg-[#3B82F6]/20 border border-[#1E3151] hover:border-[#3B82F6] text-[#A8B6CD] hover:text-white rounded-xl transition-all"
              title="Редагувати"
            >
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
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </button>

            <button
              className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500 text-red-400 rounded-xl transition-all"
              title="Видалити"
            >
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
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        ) : (
          /* КНОПКА ДЛЯ КАНДИДАТА / ГОСТЯ */
          <Link
            to="/jobDescription"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
          >
            Відгукнутися
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
