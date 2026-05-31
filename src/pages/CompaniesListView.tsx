import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CompanyCard from "../components/CompaniesList/CompanyCard";
import FilterAccordion from "../components/VacanciesList/FilterAccordion";
import VacanciesSearch, { type VacanciesSearchValues } from "../components/VacanciesList/VacanciesSearch";
import { hiredInApi, type CompanyRead, type VacancyRead } from "../services/hiredInApi";
import { getVacancyStatusNumber, VacancyStatus } from "../services/hiredInTypes";

type FilterItem = {
  name: string;
  checked: boolean;
};

const sortOptions = ["Найбільше вакансій", "За датою додавання", "За алфавітом"];

const emptySearchValues: VacanciesSearchValues = {
  query: "",
  industry: "",
  city: "",
};

export default function CompaniesListView() {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [draftSearchValues, setDraftSearchValues] = useState<VacanciesSearchValues>(emptySearchValues);
  const [appliedSearchValues, setAppliedSearchValues] = useState<VacanciesSearchValues>(emptySearchValues);
  const [companies, setCompanies] = useState<CompanyRead[]>([]);
  const [vacancies, setVacancies] = useState<VacancyRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [industry, setIndustry] = useState<FilterItem[]>([
    { name: "Стажист", checked: false },
    { name: "Фінанси", checked: false },
    { name: "Логістика", checked: false },
    { name: "IT / Розробка", checked: false },
  ]);

  const [location, setLocation] = useState<FilterItem[]>([
    { name: "Київ", checked: false },
    { name: "Львів", checked: false },
  ]);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      hiredInApi.getAllCompanies(),
      hiredInApi.getPagedVacancies(0, 1000).then((result) => result.items ?? []),
    ])
      .then(([data, vacancyItems]) => {
        if (ignore) return;
        setVacancies(vacancyItems);
        if (data.length) {
          setCompanies(data);
          setMessage("");
        } else {
          setCompanies([]);
          setMessage("Компанії ще не додані.");
        }
      })
      .catch(() => {
        if (!ignore) {
          setCompanies([]);
          setMessage("Не вдалося завантажити компанії. Спробуй оновити сторінку.");
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const vacancyCountsByCompany = useMemo(() => {
    return vacancies.reduce<Record<string, number>>((counts, vacancy) => {
      if (getVacancyStatusNumber(vacancy.status) !== VacancyStatus.Published) {
        return counts;
      }

      counts[vacancy.companyId] = (counts[vacancy.companyId] ?? 0) + 1;
      return counts;
    }, {});
  }, [vacancies]);

  const cards = useMemo(
    () =>
      companies.map((company, index) => ({
        id: company.id,
        originalIndex: index,
        logo: company.name.slice(0, 1),
        logoUrl: company.logoUrl,
        logoBg: index % 3 === 0 ? "bg-amber-600" : index % 3 === 1 ? "bg-pink-500" : "bg-emerald-500",
        name: company.name,
        isVerified: Number(company.status) === 2,
        vacanciesCount: vacancyCountsByCompany[company.id] ?? 0,
        industry: company.industry ?? "Індустрія не вказана",
        location: company.city ?? "Україна",
        description: company.description ?? "Компанія ще не додала опис.",
        to: `/companyProfile?companyId=${company.id}`,
      })),
    [companies, vacancyCountsByCompany],
  );

  const selectedIndustries = industry.filter((item) => item.checked).map((item) => item.name);
  const selectedLocations = location.filter((item) => item.checked).map((item) => item.name);

  const filteredCards = useMemo(() => {
    const normalizedIndustries = selectedIndustries.map(normalizeText);
    const normalizedLocations = selectedLocations.map(normalizeText);
    const normalizedQuery = normalizeText(appliedSearchValues.query);
    const normalizedSearchIndustry = normalizeText(appliedSearchValues.industry);
    const normalizedSearchCity = normalizeText(appliedSearchValues.city);

    return cards.filter((company) => {
      const companyIndustry = normalizeText(company.industry);
      const companyLocation = normalizeText(company.location);
      const searchableText = normalizeText(
        `${company.name} ${company.description} ${company.industry} ${company.location}`,
      );

      const matchesIndustry =
        normalizedIndustries.length === 0 ||
        normalizedIndustries.some((filter) => companyIndustry.includes(filter) || filter.includes(companyIndustry));

      const matchesLocation =
        normalizedLocations.length === 0 ||
        normalizedLocations.some((filter) => companyLocation.includes(filter));

      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesSearchIndustry =
        !normalizedSearchIndustry || companyIndustry.includes(normalizedSearchIndustry);
      const matchesSearchCity = !normalizedSearchCity || companyLocation.includes(normalizedSearchCity);

      return matchesIndustry && matchesLocation && matchesQuery && matchesSearchIndustry && matchesSearchCity;
    });
  }, [appliedSearchValues, cards, selectedIndustries, selectedLocations]);

  const sortedCards = useMemo(() => {
    return [...filteredCards].sort((first, second) => {
      if (selectedSort === sortOptions[0]) {
        return second.vacanciesCount - first.vacanciesCount || first.name.localeCompare(second.name, "uk");
      }

      if (selectedSort === sortOptions[2]) {
        return first.name.localeCompare(second.name, "uk");
      }

      return first.originalIndex - second.originalIndex;
    });
  }, [filteredCards, selectedSort]);

  const toggleIndustry = (index: number) => {
    setIndustry((list) =>
      list.map((item, itemIndex) =>
        itemIndex === index ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const toggleLocation = (index: number) => {
    setLocation((list) =>
      list.map((item, itemIndex) =>
        itemIndex === index ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const clearIndustry = () => {
    setIndustry((list) => list.map((item) => ({ ...item, checked: false })));
  };

  const clearLocation = () => {
    setLocation((list) => list.map((item) => ({ ...item, checked: false })));
  };

  const clearAllFilters = () => {
    clearIndustry();
    clearLocation();
    setDraftSearchValues(emptySearchValues);
    setAppliedSearchValues(emptySearchValues);
  };

  return (
    <div className="min-h-screen w-full bg-[#0A1628] text-white">
      <Header />
      <VacanciesSearch
        values={draftSearchValues}
        onChange={setDraftSearchValues}
        onSubmit={() => setAppliedSearchValues(draftSearchValues)}
      />

      <main className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-10 sm:px-8 lg:flex-row lg:px-[80px] lg:py-12">
        <aside className="flex w-full shrink-0 flex-col gap-5 lg:w-[320px]">
          <div className="flex h-14 items-center justify-between rounded-xl border border-[#1E3151] bg-[#0F1D36] p-5">
            <span className="flex items-center gap-2 text-base font-bold text-white">Фільтри</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-sm text-[#6B7D99] transition-colors hover:text-white"
              >
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
                onToggle={toggleIndustry}
                onClear={clearIndustry}
                icon={<FilterIcon />}
              />
              <FilterAccordion
                title="Локація"
                items={location}
                onToggle={toggleLocation}
                onClear={clearLocation}
                icon={<LocationIcon />}
              />
            </>
          )}
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {filteredCards.length.toLocaleString("uk-UA")} перевірених компаній
              </h1>
              <p className="mt-2 text-sm text-[#8FA1BB]">
                {isLoading ? "Завантажуємо компанії..." : message}
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#1E3151] bg-[#0F1D36] px-5 transition-colors hover:bg-[#1E3151]/30 sm:w-auto"
              >
                <span className="text-sm text-[#6B7D99]">Сортувати:</span>
                <span className="flex items-center gap-2 text-sm font-medium text-white">{selectedSort} ▾</span>
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-[#1E3151] bg-[#0F1D36] py-1 shadow-2xl">
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

          <div className="flex flex-col gap-4">
            {sortedCards.map((company) => (
              <CompanyCard key={company.id} data={company} />
            ))}
          </div>

          {!isLoading && filteredCards.length === 0 && (
            <div className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 text-center text-[#A8B6CD]">
              За поточними фільтрами компаній не знайдено.
            </div>
          )}

          <div className="mt-6 flex flex-col items-center rounded-2xl border border-[#1E3151] bg-[#0F1D36]/40 p-8 text-center">
            <p className="mb-4 text-sm text-[#A8B6CD]">
              Показано {filteredCards.length} компаній
            </p>
            <button className="h-12 rounded-xl bg-[#3B82F6] px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/10 transition-colors hover:bg-[#2563EB] sm:px-8">
              Завантажити ще компанії
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
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
