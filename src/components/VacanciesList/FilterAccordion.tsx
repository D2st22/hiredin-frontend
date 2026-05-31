import { useRef, useState } from "react";

interface FilterItem {
  name: string;
  checked: boolean;
}

interface FilterAccordionProps {
  title: string;
  icon: React.ReactNode;
  items: FilterItem[];
  onToggle: (index: number) => void;
  onClear: () => void;
  showAllLink?: boolean;
}

export default function FilterAccordion({
  title,
  icon,
  items,
  onToggle,
  onClear,
  showAllLink,
}: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const selectedCount = items.filter((item) => item.checked).length;

  return (
    <div className="overflow-hidden rounded-xl border border-[#1E3151] bg-[#0F1D36] shadow-sm">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[60px] cursor-pointer select-none items-center justify-between px-5 transition-colors hover:bg-[#1E3151]/10"
      >
        <div className="flex items-center gap-3">
          <div className="text-[#FCD34D]">{icon}</div>
          <span className="text-sm font-bold text-white">{title}</span>

          {selectedCount > 0 && (
            <div className="ml-2 flex items-center gap-2">
              <span className="text-sm font-bold text-[#3B82F6]">
                {selectedCount}
              </span>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onClear();
                }}
                className="rounded-full bg-[#3B82F6]/10 p-1 text-[#3B82F6] transition-all hover:bg-[#3B82F6]/30 hover:text-white"
                aria-label="Очистити фільтр"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6B7D99"
          strokeWidth="2.5"
          className={`transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="flex flex-col gap-4 p-5 pt-0">
          {items.map((item, index) => (
            <label
              key={item.name}
              className="group flex cursor-pointer items-center justify-between"
            >
              <div className="flex items-center">
                <div className="flex w-6 items-center justify-start">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => onToggle(index)}
                    className="hidden"
                  />
                  {item.checked && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${item.checked ? "font-bold text-white" : "text-[#A8B6CD] transition-colors group-hover:text-white"}`}>
                  {item.name}
                </span>
              </div>
            </label>
          ))}
          {showAllLink && (
            <button className="mt-1 text-left text-sm font-semibold text-[#3B82F6] transition-colors hover:text-[#60A5FA]">
              Показати всі
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
