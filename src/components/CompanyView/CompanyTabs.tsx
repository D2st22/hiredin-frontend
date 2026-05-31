interface CompanyTabsProps {
  vacanciesCount?: number;
  onAboutClick: () => void;
  onVacanciesClick: () => void;
  onReviewsClick: () => void;
  onEmployeesClick: () => void;
}

const tabClass =
  "shrink-0 pb-4 text-[#8EA0BA] transition-colors hover:text-white";

export default function CompanyTabs({
  vacanciesCount = 0,
  onAboutClick,
  onVacanciesClick,
  onReviewsClick,
  onEmployeesClick,
}: CompanyTabsProps) {
  return (
    <div className="flex w-full items-center gap-8 overflow-x-auto border-b border-[#1E3151]/50 text-[15px] font-semibold">
      <button onClick={onAboutClick} className={`${tabClass} text-white`}>
        Про компанію
      </button>
      <button onClick={onVacanciesClick} className={tabClass}>
        Вакансії {vacanciesCount}
      </button>
      <button onClick={onReviewsClick} className={tabClass}>
        Відгуки
      </button>
      <button onClick={onEmployeesClick} className={tabClass}>
        Співробітники
      </button>
    </div>
  );
}
