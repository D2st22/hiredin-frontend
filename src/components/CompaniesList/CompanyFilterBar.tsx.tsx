import { useState } from "react";
import FilterAccordion from "../VacanciesList/FilterAccordion";

export default function CompaniesFilterBar() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [industry, setIndustry] = useState([
    { name: "Стажист", count: "1 136", checked: false },
    { name: "Фінанси", count: "1 960", checked: false },
    { name: "Логістика", count: "6 265", checked: false },
    { name: "IT / Розробка", count: "28 580", checked: true },
    { name: "Медіа", count: "7 967", checked: false },
    { name: "Виробництво", count: "1 687", checked: false },
  ]);

  const [location, setLocation] = useState([
    { name: "Київ", count: "56 357", checked: false },
    { name: "Львів", count: "5 691", checked: false },
    { name: "Харків", count: "2 229", checked: false },
  ]);

  const toggleCheckbox = (list: any[], setList: any, index: number) => {
    const newList = [...list];
    newList[index].checked = !newList[index].checked;
    setList(newList);
  };

  const clearGroup = (list: any[], setList: any) => {
    setList(list.map((item) => ({ ...item, checked: false })));
  };

  return (
    <div className="w-full lg:w-[320px] flex flex-col gap-5 flex-shrink-0">
      {/* Шапка */}
      <div className="bg-[#0F1D36] border border-[#1E3151] rounded-xl p-5 flex items-center justify-between h-14">
        <div className="flex items-center gap-3 text-white text-base font-bold">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A8B6CD"
            strokeWidth="2"
          >
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="2" y1="14" x2="6" y2="14" />
            <line x1="10" y1="8" x2="14" y2="8" />
            <line x1="18" y1="16" x2="22" y2="16" />
          </svg>
          Фільтри
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[#6B7D99] hover:text-white text-sm font-medium transition-colors">
            Скинути
          </button>
          <button
            type="button"
            onClick={() => setIsFiltersOpen((value) => !value)}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#7F90AA] transition-colors hover:bg-[#142440] hover:text-white"
            aria-label={isFiltersOpen ? "Закрити фільтри" : "Відкрити фільтри"}
          >
            <PanelChevron isOpen={isFiltersOpen} />
          </button>
        </div>
      </div>

      {isFiltersOpen && (
        <>
          <FilterAccordion
            title="Індустрія"
            items={industry}
            onToggle={(idx) => toggleCheckbox(industry, setIndustry, idx)}
            onClear={() => clearGroup(industry, setIndustry)}
            showAllLink
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 20V10M18 20V4M6 20v-4" />
              </svg>
            }
          />

          <FilterAccordion
            title="Локація"
            items={location}
            onToggle={(idx) => toggleCheckbox(location, setLocation, idx)}
            onClear={() => clearGroup(location, setLocation)}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
          />
        </>
      )}
    </div>
  );
}

function PanelChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={`transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
