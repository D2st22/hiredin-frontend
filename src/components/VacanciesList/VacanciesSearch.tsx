import { useState } from "react";

export type VacanciesSearchValues = {
  query: string;
  industry: string;
  city: string;
};

type VacanciesSearchProps = {
  values?: VacanciesSearchValues;
  onChange?: (values: VacanciesSearchValues) => void;
  onSubmit?: () => void;
};

const emptyValues: VacanciesSearchValues = {
  query: "",
  industry: "",
  city: "",
};

export default function VacanciesSearch({ values, onChange, onSubmit }: VacanciesSearchProps) {
  const [internalValues, setInternalValues] = useState(emptyValues);
  const currentValues = values ?? internalValues;

  const updateValue = (field: keyof VacanciesSearchValues, value: string) => {
    const nextValues = { ...currentValues, [field]: value };
    if (!values) {
      setInternalValues(nextValues);
    }
    onChange?.(nextValues);
  };

  return (
    <div className="w-full border-b border-[#1E3151]/50 bg-[#0A1628]">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-[80px]">
        <form
          className="flex flex-col items-center gap-3 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-3 shadow-2xl lg:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.();
          }}
        >
          <div className="grid w-full grid-cols-1 gap-3 px-3 md:grid-cols-3 lg:flex-1">
            <SearchField
              label="Посада, компанія, ключове слово"
              value={currentValues.query}
              onChange={(value) => updateValue("query", value)}
              placeholder="Введіть запит..."
              withIcon
            />
            <SearchField
              label="Індустрія"
              value={currentValues.industry}
              onChange={(value) => updateValue("industry", value)}
              placeholder="Будь-яка"
              bordered
            />
            <SearchField
              label="Місто"
              value={currentValues.city}
              onChange={(value) => updateValue("city", value)}
              placeholder="Будь-яке"
              bordered
            />
          </div>

          <button
            type="submit"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-[#2563EB] lg:w-40"
          >
            <SearchIcon />
            <span>Знайти</span>
          </button>
        </form>
      </div>
    </div>
  );
}

function SearchField({
  label,
  value,
  onChange,
  placeholder,
  bordered,
  withIcon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  bordered?: boolean;
  withIcon?: boolean;
}) {
  return (
    <div className={`${bordered ? "border-t border-[#1E3151]/50 pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-2" : "py-2"}`}>
      <div className="mb-2 flex items-center gap-2">
        {withIcon && <SearchIcon muted />}
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7D99]">
          {label}
        </label>
      </div>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-base font-medium text-white placeholder:text-[#334155] focus:outline-none"
      />
    </div>
  );
}

function SearchIcon({ muted }: { muted?: boolean }) {
  return (
    <svg
      width={muted ? "14" : "18"}
      height={muted ? "14" : "18"}
      viewBox="0 0 24 24"
      fill="none"
      stroke={muted ? "#6B7D99" : "currentColor"}
      strokeWidth={muted ? "3" : "2.5"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
