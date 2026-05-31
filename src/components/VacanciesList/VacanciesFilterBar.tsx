import { useRef, useState } from "react";
import FilterAccordion from "./FilterAccordion";

export type VacancyFilterItem = {
  label: string;
  checked: boolean;
};

export type VacancyFilters = {
  levels: VacancyFilterItem[];
  contracts: VacancyFilterItem[];
  formats: VacancyFilterItem[];
  minSalary: number;
  maxSalary: number;
  onlySpecifiedSalary: boolean;
};

type VacanciesFilterBarProps = {
  filters: VacancyFilters;
  onToggleLevel: (index: number) => void;
  onToggleContract: (index: number) => void;
  onToggleFormat: (index: number) => void;
  onClearLevels: () => void;
  onClearContracts: () => void;
  onClearFormats: () => void;
  onSalaryChange: (minSalary: number, maxSalary: number) => void;
  onOnlySpecifiedSalaryChange: () => void;
  onClearAll: () => void;
};

const minAllowed = 20000;
const maxAllowed = 150000;
const minSalaryGap = 5000;

export default function VacanciesFilterBar({
  filters,
  onToggleLevel,
  onToggleContract,
  onToggleFormat,
  onClearLevels,
  onClearContracts,
  onClearFormats,
  onSalaryChange,
  onOnlySpecifiedSalaryChange,
  onClearAll,
}: VacanciesFilterBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [isSalaryOpen, setIsSalaryOpen] = useState(true);
  const [activeSalaryThumb, setActiveSalaryThumb] = useState<
    "min" | "max" | null
  >(null);
  const salarySliderRef = useRef<HTMLDivElement | null>(null);

  const minPercent =
    ((filters.minSalary - minAllowed) / (maxAllowed - minAllowed)) * 100;
  const maxPercent =
    ((filters.maxSalary - minAllowed) / (maxAllowed - minAllowed)) * 100;

  function getSalaryFromPointer(clientX: number) {
    if (!salarySliderRef.current) return filters.minSalary;

    const rect = salarySliderRef.current.getBoundingClientRect();
    const percent = Math.min(
      Math.max((clientX - rect.left) / rect.width, 0),
      1,
    );
    const rawValue = minAllowed + percent * (maxAllowed - minAllowed);

    return Math.round(rawValue / 1000) * 1000;
  }

  function updateSalaryByThumb(thumb: "min" | "max", value: number) {
    if (thumb === "min") {
      const nextMin = Math.min(value, filters.maxSalary - minSalaryGap);
      onSalaryChange(Math.max(minAllowed, nextMin), filters.maxSalary);
      return;
    }

    const nextMax = Math.max(value, filters.minSalary + minSalaryGap);
    onSalaryChange(filters.minSalary, Math.min(maxAllowed, nextMax));
  }

  function handleSalaryPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const value = getSalaryFromPointer(event.clientX);

    const distanceToMin = Math.abs(value - filters.minSalary);
    const distanceToMax = Math.abs(value - filters.maxSalary);
    const thumb = distanceToMin <= distanceToMax ? "min" : "max";

    setActiveSalaryThumb(thumb);
    updateSalaryByThumb(thumb, value);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleSalaryPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!activeSalaryThumb) return;

    const value = getSalaryFromPointer(event.clientX);
    updateSalaryByThumb(activeSalaryThumb, value);
  }

  function handleSalaryPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    setActiveSalaryThumb(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="flex w-full flex-shrink-0 flex-col gap-5 lg:w-[320px]">
      <div className="flex h-14 items-center justify-between rounded-xl border border-[#1E3151] bg-[#0F1D36] p-5">
        <div className="flex items-center gap-3 text-base font-bold text-white">
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
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-medium text-[#6B7D99] transition-colors hover:text-white"
          >
            Скинути
          </button>

          <button
            type="button"
            onClick={() => setIsFiltersOpen((value) => !value)}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#7F90AA] transition-colors hover:bg-[#142440] hover:text-white"
            aria-label={isFiltersOpen ? "Закрити фільтри" : "Відкрити фільтри"}
          >
            <ChevronIcon isOpen={isFiltersOpen} />
          </button>
        </div>
      </div>

      {isFiltersOpen && (
        <>
          <FilterAccordion
            title="Рівень посади"
            items={filters.levels.map((item) => ({
              name: item.label,
              checked: item.checked,
            }))}
            onToggle={onToggleLevel}
            onClear={onClearLevels}
            showAllLink
            icon={<FilterIcon />}
          />

          <FilterAccordion
            title="Тип зайнятості"
            items={filters.contracts.map((item) => ({
              name: item.label,
              checked: item.checked,
            }))}
            onToggle={onToggleContract}
            onClear={onClearContracts}
            icon={<DocumentIcon />}
          />

          <div className="overflow-hidden rounded-xl border border-[#1E3151] bg-[#0F1D36] shadow-sm">
            <div
              onClick={() => setIsSalaryOpen(!isSalaryOpen)}
              className="flex cursor-pointer select-none items-center justify-between border-b border-[#1E3151]/30 p-5 transition-colors hover:bg-[#1E3151]/10"
            >
              <div className="flex items-center gap-3 text-sm font-bold text-white">
                <span className="text-[#FCD34D]">
                  <CardIcon />
                </span>
                Зарплата
              </div>

              <ChevronIcon isOpen={isSalaryOpen} />
            </div>

            {isSalaryOpen && (
              <div className="flex flex-col gap-5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-10 items-center justify-center rounded-lg border border-[#F5C84C]/20 bg-[#F5C84C]/10 px-4">
                    <span className="text-sm font-bold text-[#F5C84C]">
                      {formatSalary(filters.minSalary)} -{" "}
                      {formatSalary(filters.maxSalary)} грн
                    </span>
                  </div>

                  <span className="text-xs text-[#6B7D99]">грн / міс</span>
                </div>

                <div
                  ref={salarySliderRef}
                  onPointerDown={handleSalaryPointerDown}
                  onPointerMove={handleSalaryPointerMove}
                  onPointerUp={handleSalaryPointerUp}
                  onPointerCancel={handleSalaryPointerUp}
                  className="relative mt-3 mb-2 h-6 w-full cursor-pointer touch-none"
                >
                  <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-[#1E3151]" />

                  <div
                    className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#3B82F6]"
                    style={{
                      left: `${minPercent}%`,
                      right: `${100 - maxPercent}%`,
                    }}
                  />

                  <button
                    type="button"
                    aria-label="Мінімальна зарплата"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      setActiveSalaryThumb("min");
                      salarySliderRef.current?.setPointerCapture(
                        event.pointerId,
                      );
                    }}
                    className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-[3px] border-[#3B82F6] bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                    style={{ left: `calc(${minPercent}% - 8px)` }}
                  />

                  <button
                    type="button"
                    aria-label="Максимальна зарплата"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      setActiveSalaryThumb("max");
                      salarySliderRef.current?.setPointerCapture(
                        event.pointerId,
                      );
                    }}
                    className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-[3px] border-[#3B82F6] bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                    style={{ left: `calc(${maxPercent}% - 8px)` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-[#55657E]">
                  <span>20k</span>
                  <span>150k+</span>
                </div>

                <label className="group flex cursor-pointer items-center justify-between border-t border-[#1E3151]/20 pt-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onlySpecifiedSalary}
                      onChange={onOnlySpecifiedSalaryChange}
                      className="hidden"
                    />

                    <div className="flex w-6 items-center justify-start">
                      {filters.onlySpecifiedSalary && <CheckIcon />}
                    </div>

                    <span
                      className={`text-sm ${
                        filters.onlySpecifiedSalary
                          ? "font-bold text-white"
                          : "text-[#A8B6CD] transition-colors group-hover:text-white"
                      }`}
                    >
                      Тільки з вказаною ЗП
                    </span>
                  </div>
                </label>
              </div>
            )}
          </div>

          <FilterAccordion
            title="Формат роботи"
            items={filters.formats.map((item) => ({
              name: item.label,
              checked: item.checked,
            }))}
            onToggle={onToggleFormat}
            onClear={onClearFormats}
            icon={<FormatIcon />}
          />
        </>
      )}
    </div>
  );
}

function formatSalary(value: number) {
  return value.toLocaleString("uk-UA").replace(/,/g, " ");
}

function FilterIcon() {
  return (
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
  );
}

function DocumentIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function FormatIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6B7D99"
      strokeWidth="2.5"
      className={`transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className="text-white"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
