import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import VacanciesFilterBar, {
  type VacancyFilters,
} from "../components/VacanciesList/VacanciesFilterBar";
import VacancyCardMain from "../components/VacanciesList/VacancyCardMain";
import VacanciesSearch, {
  type VacanciesSearchValues,
} from "../components/VacanciesList/VacanciesSearch";
import { hiredInApi, type VacancyRead } from "../services/hiredInApi";
import {
  EmploymentType,
  ExperienceLevel,
  WorkFormat,
} from "../services/hiredInTypes";

const salaryDefaults = {
  min: 95000,
  max: 140000,
};

const emptySearchValues: VacanciesSearchValues = {
  query: "",
  industry: "",
  city: "",
};
const PAGE_SIZE = 8;
const sortOptions = ["Для тебе", "За датою", "За зарплатою"];

const defaultFilters: VacancyFilters = {
  levels: [
    { label: "Trainee", checked: false },
    { label: "Junior", checked: false },
    { label: "Middle", checked: false },
    { label: "Senior", checked: false },
    { label: "Lead", checked: false },
  ],
  contracts: [
    { label: "Повна зайнятість", checked: false },
    { label: "Часткова зайнятість", checked: false },
    { label: "Контракт", checked: false },
    { label: "Стажування", checked: false },
    { label: "Freelance", checked: false },
  ],
  formats: [
    { label: "Офіс", checked: false },
    { label: "Hybrid", checked: false },
    { label: "Remote", checked: false },
  ],
  minSalary: salaryDefaults.min,
  maxSalary: salaryDefaults.max,
  onlySpecifiedSalary: false,
};

const levelByLabel: Record<string, number> = {
  Trainee: ExperienceLevel.Trainee,
  Junior: ExperienceLevel.Junior,
  Middle: ExperienceLevel.Middle,
  Senior: ExperienceLevel.Senior,
  Lead: ExperienceLevel.Lead,
};

const contractByLabel: Record<string, number> = {
  "Повна зайнятість": EmploymentType.FullTime,
  "Часткова зайнятість": EmploymentType.PartTime,
  Контракт: EmploymentType.Contract,
  Стажування: EmploymentType.Internship,
  Freelance: EmploymentType.Freelance,
};

const formatByLabel: Record<string, number> = {
  Офіс: WorkFormat.Onsite,
  Remote: WorkFormat.Remote,
  Hybrid: WorkFormat.Hybrid,
};

type ActiveFilterChip = {
  label: string;
  group: "levels" | "contracts" | "formats" | "salary" | "specifiedSalary";
};

export default function VacanciesListView() {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [vacancies, setVacancies] = useState<VacancyRead[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [filters, setFilters] = useState<VacancyFilters>(() =>
    cloneFilters(defaultFilters),
  );
  const [draftSearchValues, setDraftSearchValues] =
    useState<VacanciesSearchValues>(emptySearchValues);
  const [appliedSearchValues, setAppliedSearchValues] =
    useState<VacanciesSearchValues>(emptySearchValues);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [favoriteVacancyIds, setFavoriteVacancyIds] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    let ignore = false;

    async function loadInitialVacancies() {
      setIsLoading(true);
      setStatusMessage("");

      try {
        const result = companyId
          ? await loadAllVacancies()
          : await hiredInApi.getPagedVacancies(0, PAGE_SIZE);

        if (ignore) return;

        const loadedItems = result.items ?? [];
        const items = companyId
          ? loadedItems.filter((vacancy) => vacancy.companyId === companyId)
          : loadedItems;

        setVacancies(items);
        setTotalCount(companyId ? items.length : result.totalCount || items.length);
        setPageIndex(0);
        setStatusMessage(
          items.length ? "" : "Поки немає опублікованих вакансій.",
        );
      } catch {
        if (!ignore) {
          setVacancies([]);
          setTotalCount(0);
          setPageIndex(0);
          setStatusMessage(
            "Не вдалося завантажити вакансії. Спробуй оновити сторінку.",
          );
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadInitialVacancies();

    return () => {
      ignore = true;
    };
  }, [companyId]);

  useEffect(() => {
    let ignore = false;

    hiredInApi
      .getFavouriteVacancies(1, 100)
      .then((result) => {
        if (ignore) return;
        setFavoriteVacancyIds(
          new Set((result.items ?? []).map((item) => item.vacancyId)),
        );
      })
      .catch(() => {
        if (!ignore) setFavoriteVacancyIds(new Set());
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredVacancies = useMemo(() => {
    const selectedLevels = selectedFilterValues(filters.levels, levelByLabel);
    const selectedContracts = selectedFilterValues(
      filters.contracts,
      contractByLabel,
    );
    const selectedFormats = selectedFilterValues(
      filters.formats,
      formatByLabel,
    );
    const salaryChanged =
      filters.minSalary !== salaryDefaults.min ||
      filters.maxSalary !== salaryDefaults.max;
    const normalizedQuery = normalizeText(appliedSearchValues.query);
    const normalizedIndustry = normalizeText(appliedSearchValues.industry);
    const normalizedCity = normalizeText(appliedSearchValues.city);

    return vacancies.filter((vacancy) => {
      const level = enumNumber(vacancy.experienceLevel);
      const contract = enumNumber(vacancy.employmentType);
      const format = enumNumber(vacancy.workFormat);

      const matchesLevel =
        selectedLevels.length === 0 || selectedLevels.includes(level);
      const matchesContract =
        selectedContracts.length === 0 || selectedContracts.includes(contract);
      const matchesFormat =
        selectedFormats.length === 0 || selectedFormats.includes(format);

      const hasSalary = vacancy.salaryMin != null || vacancy.salaryMax != null;
      const matchesOnlySpecifiedSalary =
        !filters.onlySpecifiedSalary || hasSalary;
      const matchesSalary =
        !salaryChanged ||
        !hasSalary ||
        salaryOverlapsRange(
          vacancy.salaryMin,
          vacancy.salaryMax,
          filters.minSalary,
          filters.maxSalary,
        );
      const searchableText = normalizeText(
        `${vacancy.title ?? ""} ${vacancy.companyName ?? ""} ${vacancy.description ?? ""} ${vacancy.city ?? ""}`,
      );
      const matchesQuery =
        !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesIndustry =
        !normalizedIndustry || searchableText.includes(normalizedIndustry);
      const matchesCity =
        !normalizedCity ||
        normalizeText(vacancy.city ?? "").includes(normalizedCity);

      return (
        matchesLevel &&
        matchesContract &&
        matchesFormat &&
        matchesOnlySpecifiedSalary &&
        matchesSalary &&
        matchesQuery &&
        matchesIndustry &&
        matchesCity
      );
    });
  }, [appliedSearchValues, companyId, filters, vacancies]);

  const filteredCompanyName = useMemo(() => {
    if (!companyId) return null;
    return (
      vacancies.find((vacancy) => vacancy.companyId === companyId)
        ?.companyName ?? null
    );
  }, [companyId, vacancies]);

  const sortedVacancies = useMemo(() => {
    return [...filteredVacancies].sort((first, second) => {
      if (selectedSort === sortOptions[1]) {
        return second.id.localeCompare(first.id);
      }

      if (selectedSort === sortOptions[2]) {
        return vacancySalaryValue(second) - vacancySalaryValue(first);
      }

      return vacancies.indexOf(first) - vacancies.indexOf(second);
    });
  }, [filteredVacancies, selectedSort, vacancies]);

  const cards = useMemo(
    () =>
      sortedVacancies.map((vacancy, index) => ({
        companyLogo: getInitial(vacancy.companyName ?? vacancy.title ?? "K"),
        logoBg:
          index % 3 === 0
            ? "bg-black"
            : index % 3 === 1
              ? "bg-green-600"
              : "bg-blue-600",
        title: vacancy.title ?? "Вакансія",
        salary: formatSalary(vacancy.salaryMin, vacancy.salaryMax),
        company: vacancy.companyName ?? "Компанія",
        location: vacancy.city ?? "Локація не вказана",
        isVerified: true,
        tags: [
          levelLabel(vacancy.experienceLevel),
          contractLabel(vacancy.employmentType),
          formatLabel(vacancy.workFormat),
        ],
        date: "сьогодні",
        isHot: index === 0,
        to: companyId
          ? `/vacancy/${vacancy.id}?companyId=${companyId}`
          : `/vacancy/${vacancy.id}`,
        isFavorite: favoriteVacancyIds.has(vacancy.id),
        onFavorite: () => addToFavorites(vacancy.id),
      })),
    [favoriteVacancyIds, sortedVacancies],
  );
  const hasMoreVacancies = !companyId && vacancies.length < totalCount;
  async function loadMoreVacancies() {
    if (isLoadingMore || companyId) return;

    const nextPage = pageIndex + 1;

    setIsLoadingMore(true);
    setStatusMessage("");

    try {
      const result = await hiredInApi.getPagedVacancies(nextPage, PAGE_SIZE);
      const items = result.items ?? [];

      setVacancies((current) => {
        const existingIds = new Set(current.map((vacancy) => vacancy.id));
        const newItems = items.filter(
          (vacancy) => !existingIds.has(vacancy.id),
        );

        return [...current, ...newItems];
      });

      setTotalCount(result.totalCount || totalCount);
      setPageIndex(nextPage);
    } catch {
      setStatusMessage("Не вдалося завантажити ще вакансії.");
    } finally {
      setIsLoadingMore(false);
    }
  }
  async function addToFavorites(vacancyId: string) {
    if (favoriteVacancyIds.has(vacancyId)) {
      setFavoriteMessage("Вакансія вже в обраних.");
      return;
    }

    setFavoriteMessage("");

    try {
      await hiredInApi.addFavouriteVacancy(vacancyId);
      setFavoriteVacancyIds((current) => new Set(current).add(vacancyId));
      setFavoriteMessage("Вакансію додано в обрані.");
    } catch {
      setFavoriteMessage(
        "Не вдалося додати в обрані. Увійди як кандидат і спробуй ще раз.",
      );
    }
  }

  const activeFilters = useMemo(() => {
    const selected: ActiveFilterChip[] = [
      ...filters.levels
        .filter((item) => item.checked)
        .map((item) => ({ label: item.label, group: "levels" as const })),
      ...filters.contracts
        .filter((item) => item.checked)
        .map((item) => ({ label: item.label, group: "contracts" as const })),
      ...filters.formats
        .filter((item) => item.checked)
        .map((item) => ({ label: item.label, group: "formats" as const })),
    ];

    if (
      filters.minSalary !== salaryDefaults.min ||
      filters.maxSalary !== salaryDefaults.max
    ) {
      selected.push({
        label: `${formatMoney(filters.minSalary)} - ${formatMoney(filters.maxSalary)} грн`,
        group: "salary" as const,
      });
    }

    if (filters.onlySpecifiedSalary) {
      selected.push({
        label: "З вказаною ЗП",
        group: "specifiedSalary" as const,
      });
    }

    return selected;
  }, [filters]);

  const toggleGroupItem = (
    group: "levels" | "contracts" | "formats",
    index: number,
  ) => {
    setFilters((current) => ({
      ...current,
      [group]: current[group].map((item, itemIndex) =>
        itemIndex === index ? { ...item, checked: !item.checked } : item,
      ),
    }));
  };

  const clearGroup = (group: "levels" | "contracts" | "formats") => {
    setFilters((current) => ({
      ...current,
      [group]: current[group].map((item) => ({ ...item, checked: false })),
    }));
  };

  const removeActiveFilter = (filter: ActiveFilterChip) => {
    if (filter.group === "salary") {
      setFilters((current) => ({
        ...current,
        minSalary: salaryDefaults.min,
        maxSalary: salaryDefaults.max,
      }));
      return;
    }

    if (filter.group === "specifiedSalary") {
      setFilters((current) => ({ ...current, onlySpecifiedSalary: false }));
      return;
    }

    const group = filter.group;

    setFilters((current) => ({
      ...current,
      [group]: current[group].map((item) =>
        item.label === filter.label ? { ...item, checked: false } : item,
      ),
    }));
  };

  const clearAllFilters = () => {
    setFilters(cloneFilters(defaultFilters));
    setDraftSearchValues(emptySearchValues);
    setAppliedSearchValues(emptySearchValues);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0A1628] text-white">
      <Header />
      <VacanciesSearch
        values={draftSearchValues}
        onChange={setDraftSearchValues}
        onSubmit={() => setAppliedSearchValues(draftSearchValues)}
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-4 py-8 sm:px-8 lg:flex-row lg:px-[80px]">
        <VacanciesFilterBar
          filters={filters}
          onToggleLevel={(index) => toggleGroupItem("levels", index)}
          onToggleContract={(index) => toggleGroupItem("contracts", index)}
          onToggleFormat={(index) => toggleGroupItem("formats", index)}
          onClearLevels={() => clearGroup("levels")}
          onClearContracts={() => clearGroup("contracts")}
          onClearFormats={() => clearGroup("formats")}
          onSalaryChange={(minSalary, maxSalary) =>
            setFilters((current) => ({ ...current, minSalary, maxSalary }))
          }
          onOnlySpecifiedSalaryChange={() =>
            setFilters((current) => ({
              ...current,
              onlySpecifiedSalary: !current.onlySpecifiedSalary,
            }))
          }
          onClearAll={clearAllFilters}
        />

        <div className="flex flex-1 flex-col">
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-baseline gap-1.5 text-2xl font-bold text-white">
                {cards.length.toLocaleString("uk-UA")}{" "}
                <span className="text-lg font-medium text-[#6B7D99]">
                  вакансій
                </span>
              </h2>
              <p className="mt-1 text-sm text-[#6B7D99]">
                {companyId
                  ? filteredCompanyName
                    ? `Вакансії компанії ${filteredCompanyName}`
                    : "Вакансії обраної компанії"
                  : "Результати з активного списку вакансій"}
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex h-12 items-center gap-2 rounded-xl border border-[#1E3151] bg-[#0F1D36] px-4 transition-colors hover:bg-[#1E3151]/30"
              >
                <span className="text-[#6B7D99]">Сортувати:</span>
                <span className="font-semibold text-white">{selectedSort}</span>
                <span
                  className={`text-[#6B7D99] transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#1E3151] bg-[#0F1D36] py-1 shadow-2xl">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedSort(option);
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                        selectedSort === option
                          ? "bg-[#3B82F6]/10 font-bold text-[#3B82F6]"
                          : "text-[#A8B6CD] hover:bg-[#1E3151]/50 hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {(isLoading || statusMessage) && (
            <div className="mb-4 rounded-xl border border-[#1E3151] bg-[#0F1D36] px-4 py-3 text-sm text-[#A8B6CD]">
              {isLoading ? "Завантажую вакансії..." : statusMessage}
            </div>
          )}

          {favoriteMessage && (
            <div className="mb-4 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
              {favoriteMessage}
            </div>
          )}

          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-semibold text-[#6B7D99]">
              Активні:
            </span>
            {activeFilters.map((filter) => (
              <button
                key={`${filter.group}-${filter.label}`}
                type="button"
                onClick={() => removeActiveFilter(filter)}
                className="flex h-9 items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 text-sm font-medium text-[#3B82F6] transition-colors hover:border-blue-400/40 hover:bg-blue-500/20"
              >
                {filter.label}
                <span>×</span>
              </button>
            ))}
            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-2 text-sm font-medium text-[#6B7D99] transition-colors hover:text-white"
              >
                Очистити все
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {cards.map((item) => (
              <VacancyCardMain
                key={`${item.title}-${item.company}`}
                data={item}
              />
            ))}
          </div>

          {!isLoading && cards.length === 0 && (
            <div className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 text-center text-[#A8B6CD]">
              За поточними фільтрами вакансій не знайдено.
            </div>
          )}

          {cards.length > 0 && (
            <div className="mt-6 flex flex-col items-center rounded-2xl border border-[#1E3151] bg-[#0F1D36]/40 p-8 text-center">
              <p className="mb-4 text-sm text-[#A8B6CD]">
                Показано {vacancies.length.toLocaleString("uk-UA")} із{" "}
                {totalCount.toLocaleString("uk-UA")} вакансій
              </p>

              {hasMoreVacancies ? (
                <button
                  type="button"
                  onClick={loadMoreVacancies}
                  disabled={isLoadingMore}
                  className="h-12 rounded-xl bg-[#3B82F6] px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/10 transition-colors hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60 sm:px-8"
                >
                  {isLoadingMore ? "Завантажую..." : "Завантажити ще"}
                </button>
              ) : (
                <p className="text-sm text-[#6B7D99]">
                  Усі вакансії вже завантажено.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function selectedFilterValues(
  items: { label: string; checked: boolean }[],
  map: Record<string, number>,
) {
  return items
    .filter((item) => item.checked)
    .map((item) => map[item.label])
    .filter((value) => value != null);
}

function cloneFilters(filters: VacancyFilters): VacancyFilters {
  return {
    ...filters,
    levels: filters.levels.map((item) => ({ ...item })),
    contracts: filters.contracts.map((item) => ({ ...item })),
    formats: filters.formats.map((item) => ({ ...item })),
  };
}

async function loadAllVacancies() {
  const firstPage = await hiredInApi.getPagedVacancies(0, PAGE_SIZE);
  const allItems = [...(firstPage.items ?? [])];
  const total = firstPage.totalCount || allItems.length;
  let nextPage = 1;

  while (allItems.length < total) {
    const page = await hiredInApi.getPagedVacancies(nextPage, PAGE_SIZE);
    const items = page.items ?? [];

    if (!items.length) break;

    const existingIds = new Set(allItems.map((vacancy) => vacancy.id));
    allItems.push(...items.filter((vacancy) => !existingIds.has(vacancy.id)));
    nextPage += 1;
  }

  return {
    ...firstPage,
    items: allItems,
    totalCount: total,
  };
}

function enumNumber(value?: string | number | null) {
  if (value == null) return Number.NaN;
  return typeof value === "string" ? Number(value) : value;
}

function salaryOverlapsRange(
  min?: number | null,
  max?: number | null,
  rangeMin = 0,
  rangeMax = 0,
) {
  const vacancyMin = min ?? max ?? 0;
  const vacancyMax = max ?? min ?? Number.MAX_SAFE_INTEGER;
  return vacancyMax >= rangeMin && vacancyMin <= rangeMax;
}

function vacancySalaryValue(vacancy: VacancyRead) {
  return vacancy.salaryMax ?? vacancy.salaryMin ?? 0;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function getInitial(value: string) {
  return value.trim().slice(0, 1).toUpperCase() || "K";
}

function formatSalary(min?: number | null, max?: number | null) {
  if (min && max) return `${formatMoney(min)} - ${formatMoney(max)} грн`;
  if (min) return `від ${formatMoney(min)} грн`;
  if (max) return `до ${formatMoney(max)} грн`;
  return "Зарплата не вказана";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function levelLabel(value?: string | number | null) {
  const labels: Record<number, string> = {
    [ExperienceLevel.Trainee]: "Trainee",
    [ExperienceLevel.Junior]: "Junior",
    [ExperienceLevel.Middle]: "Middle",
    [ExperienceLevel.Senior]: "Senior",
    [ExperienceLevel.Lead]: "Lead",
  };

  return labels[enumNumber(value)] ?? "Рівень не вказано";
}

function contractLabel(value?: string | number | null) {
  const labels: Record<number, string> = {
    [EmploymentType.FullTime]: "Повна зайнятість",
    [EmploymentType.PartTime]: "Часткова зайнятість",
    [EmploymentType.Contract]: "Контракт",
    [EmploymentType.Internship]: "Стажування",
    [EmploymentType.Freelance]: "Freelance",
  };

  return labels[enumNumber(value)] ?? "Тип зайнятості";
}

function formatLabel(value?: string | number | null) {
  const labels: Record<number, string> = {
    [WorkFormat.Onsite]: "Офіс",
    [WorkFormat.Remote]: "Remote",
    [WorkFormat.Hybrid]: "Hybrid",
  };

  return labels[enumNumber(value)] ?? "Формат";
}
