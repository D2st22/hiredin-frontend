import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { hiredInApi, type CompanyRead, type VacancyRead } from "../services/hiredInApi";
import {
  EmploymentType,
  ExperienceLevel,
  VacancyStatus,
  WorkFormat,
  employmentTypeLabels,
  experienceLevelLabels,
  getEmploymentTypeApiValue,
  getExperienceLevelApiValue,
  getVacancyStatusApiValue,
  getVacancyStatusLabel,
  getVacancyStatusNumber,
  getWorkFormatApiValue,
  workFormatLabels,
} from "../services/hiredInTypes";

type VacancyCreateForm = {
  title: string;
  description: string;
  city: string;
  salaryMin: string;
  salaryMax: string;
  employmentType: number;
  workFormat: number;
  experienceLevel: number;
};

const emptyCreateForm: VacancyCreateForm = {
  title: "",
  description: "",
  city: "",
  salaryMin: "",
  salaryMax: "",
  employmentType: EmploymentType.FullTime,
  workFormat: WorkFormat.Hybrid,
  experienceLevel: ExperienceLevel.Middle,
};

const employmentTypeOptions = [
  EmploymentType.FullTime,
  EmploymentType.PartTime,
  EmploymentType.Contract,
  EmploymentType.Internship,
  EmploymentType.Freelance,
];

const workFormatOptions = [
  WorkFormat.Onsite,
  WorkFormat.Remote,
  WorkFormat.Hybrid,
];

const experienceLevelOptions = [
  ExperienceLevel.Trainee,
  ExperienceLevel.Junior,
  ExperienceLevel.Middle,
  ExperienceLevel.Senior,
  ExperienceLevel.Lead,
];

export default function CompanyVacanciesView() {
  const [vacancies, setVacancies] = useState<VacancyRead[]>([]);
  const [company, setCompany] = useState<CompanyRead | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<VacancyCreateForm>(emptyCreateForm);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      hiredInApi.getMyCompany().catch(() => null),
      hiredInApi.getMyVacancies(),
    ])
      .then(([companyData, data]) => {
        if (ignore) return;
        setCompany(companyData);
        setVacancies(data);
        setMessage(data.length ? "" : "У компанії ще немає вакансій.");
      })
      .catch(() => {
        if (!ignore) {
          setVacancies([]);
          setMessage("Щоб бачити вакансії компанії, треба увійти як роботодавець.");
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function createVacancy() {
    if (!company?.id) {
      setMessage("Щоб створити вакансію, спочатку треба мати профіль компанії.");
      return;
    }

    setIsCreating(true);
    setMessage("");

    try {
      await hiredInApi.createVacancy({
        companyId: company.id,
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        employmentType: getEmploymentTypeApiValue(createForm.employmentType),
        workFormat: getWorkFormatApiValue(createForm.workFormat),
        city: createForm.city.trim() || null,
        salaryMin: createForm.salaryMin ? Number(createForm.salaryMin) : null,
        salaryMax: createForm.salaryMax ? Number(createForm.salaryMax) : null,
        experienceLevel: getExperienceLevelApiValue(createForm.experienceLevel),
        status: getVacancyStatusApiValue(VacancyStatus.Published),
      });

      const nextVacancies = await hiredInApi.getMyVacancies();
      setVacancies(nextVacancies);
      setCreateForm(emptyCreateForm);
      setIsCreateOpen(false);
      setMessage("Вакансію створено.");
    } catch {
      setMessage("Не вдалося створити вакансію. Перевір поля та авторизацію роботодавця.");
    } finally {
      setIsCreating(false);
    }
  }

  const stats = useMemo(() => {
    const active = vacancies.filter((item) => getVacancyStatusNumber(item.status) === VacancyStatus.Published).length;
    const closed = vacancies.filter((item) => {
      const status = getVacancyStatusNumber(item.status);
      return status === VacancyStatus.Archived || status === VacancyStatus.Closed;
    }).length;
    return [
      { label: "Активні", value: String(active) },
      { label: "Закриті", value: String(closed) },
      { label: "Усього вакансій", value: String(vacancies.length) },
    ];
  }, [vacancies]);

  return (
    <div className="min-h-screen bg-[#081426] text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-8 lg:px-[80px] lg:py-20">
        <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">Мої вакансії</h1>
            <p className="mt-2 text-sm text-[#8EA0BA]">
              {isLoading ? "Завантажуємо вакансії..." : message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-6 text-sm font-bold text-white shadow-[0_18px_30px_-18px_rgba(59,130,246,0.95)] transition-colors hover:bg-[#2563EB]"
          >
            <Plus className="h-4 w-4" />
            Створити вакансію
          </button>
        </section>

        {isCreateOpen && (
          <section className="mt-6 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-extrabold">Нова вакансія</h2>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setCreateForm(emptyCreateForm);
                }}
                className="text-sm font-semibold text-[#8EA0BA] hover:text-white"
              >
                Скасувати
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field
                label="Назва вакансії"
                value={createForm.title}
                onChange={(value) => setCreateForm((current) => ({ ...current, title: value }))}
                placeholder="Frontend Developer"
              />
              <Field
                label="Місто"
                value={createForm.city}
                onChange={(value) => setCreateForm((current) => ({ ...current, city: value }))}
                placeholder="Київ"
              />
              <Field
                label="Зарплата від"
                type="number"
                value={createForm.salaryMin}
                onChange={(value) => setCreateForm((current) => ({ ...current, salaryMin: value }))}
                placeholder="95000"
              />
              <Field
                label="Зарплата до"
                type="number"
                value={createForm.salaryMax}
                onChange={(value) => setCreateForm((current) => ({ ...current, salaryMax: value }))}
                placeholder="140000"
              />
              <SelectField
                label="Тип зайнятості"
                value={createForm.employmentType}
                onChange={(value) => setCreateForm((current) => ({ ...current, employmentType: value }))}
                options={employmentTypeOptions.map((value) => ({
                  value,
                  label: employmentTypeLabels[value],
                }))}
              />
              <SelectField
                label="Формат роботи"
                value={createForm.workFormat}
                onChange={(value) => setCreateForm((current) => ({ ...current, workFormat: value }))}
                options={workFormatOptions.map((value) => ({
                  value,
                  label: workFormatLabels[value],
                }))}
              />
              <SelectField
                label="Рівень досвіду"
                value={createForm.experienceLevel}
                onChange={(value) => setCreateForm((current) => ({ ...current, experienceLevel: value }))}
                options={experienceLevelOptions.map((value) => ({
                  value,
                  label: experienceLevelLabels[value],
                }))}
              />
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-[#8EA0BA]">Опис</span>
              <textarea
                value={createForm.description}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={5}
                className="mt-2 w-full rounded-xl border border-[#1E3151] bg-[#081426] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                placeholder="Опиши роль, команду та очікування."
              />
            </label>

            <button
              type="button"
              disabled={isCreating || !createForm.title.trim() || !createForm.description.trim()}
              onClick={createVacancy}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-[#3B82F6] px-5 text-sm font-bold text-white transition-colors hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? "Створюємо..." : "Створити вакансію"}
            </button>
          </section>
        )}

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-xl border border-[#1E3151] bg-[#0F1D36] p-5">
              <p className="text-sm text-[#7F90AA]">{item.label}</p>
              <span className="mt-2 block text-3xl font-extrabold text-white">{item.value}</span>
            </div>
          ))}
        </section>

        <section className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {["Усі", "Активні", "Закриті"].map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`h-10 rounded-full px-5 text-sm font-semibold ${
                  index === 0 ? "bg-[#3B82F6] text-white" : "text-[#8EA0BA] hover:bg-[#142440] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F90AA]" />
              <input
                type="search"
                placeholder="Пошук за назвою"
                className="h-10 w-full rounded-lg border border-[#1E3151] bg-[#0B182C] pl-10 pr-4 text-sm text-white outline-none placeholder:text-[#7F90AA] focus:border-[#3B82F6] sm:w-56"
              />
            </label>
            <button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-[#8EA0BA] hover:bg-[#142440]">
              <SlidersHorizontal className="h-4 w-4" />
              Фільтри
            </button>
            <button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-[#8EA0BA] hover:bg-[#142440]">
              Сортувати: Нові
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="mt-6 space-y-3">
          {vacancies.map((vacancy) => (
            <VacancyRow key={vacancy.id} vacancy={vacancy} />
          ))}
        </section>

        {!isLoading && vacancies.length === 0 && (
          <section className="mt-6 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 text-center text-[#A8B6CD]">
            {message || "Створи першу вакансію, і вона з'явиться в цьому списку."}
          </section>
        )}

        <section className="mt-8 flex flex-col gap-5 text-sm text-[#8EA0BA] sm:flex-row sm:items-center sm:justify-between">
          <p>Показано {vacancies.length} з {vacancies.length}</p>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Попередня сторінка" className="grid h-9 w-9 place-items-center rounded-lg text-[#7F90AA] hover:bg-[#142440]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-lg bg-[#142440] font-bold text-white">1</button>
            <button type="button" aria-label="Наступна сторінка" className="grid h-9 w-9 place-items-center rounded-lg text-[#7F90AA] hover:bg-[#142440]">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#8EA0BA]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-xl border border-[#1E3151] bg-[#081426] px-4 text-sm text-white outline-none transition placeholder:text-[#526783] focus:border-blue-500"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  options: Array<{ value: number; label: string }>;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#8EA0BA]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-11 w-full rounded-xl border border-[#1E3151] bg-[#081426] px-4 text-sm text-white outline-none transition focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function VacancyRow({ vacancy }: { vacancy: VacancyRead }) {
  const active = getVacancyStatusNumber(vacancy.status) === VacancyStatus.Published;

  return (
    <article className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_160px_250px_24px] lg:items-center">
        <div className="min-w-0">
          <StatusBadge active={active} status={getVacancyStatusLabel(vacancy.status)} />
          <Link
            to={`/company-vacancy-detail?vacancyId=${vacancy.id}`}
            className="mt-4 block text-lg font-extrabold text-white transition-colors hover:text-[#60A5FA]"
          >
            {vacancy.title ?? "Вакансія без назви"}
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#7F90AA]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {vacancy.city ?? "Локація не вказана"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="h-4 w-4" />
              {vacancy.companyName ?? "Компанія"}
            </span>
          </div>
        </div>

        <div className="lg:text-center">
          <span className="inline-flex rounded-lg bg-[#F5C84C]/10 px-3 py-1 text-sm font-extrabold text-[#F5C84C]">
            {formatSalary(vacancy.salaryMin, vacancy.salaryMax)}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch">
          <Link
            to={`/company-vacancy-candidates?vacancyId=${vacancy.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 text-sm font-bold text-white transition-colors hover:bg-[#2563EB]"
          >
            Переглянути кандидатів
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to={`/company-vacancy-detail?vacancyId=${vacancy.id}`}
            className="text-center text-sm font-semibold text-[#60A5FA] hover:text-[#93C5FD]"
          >
            Деталі вакансії
          </Link>
        </div>

        <button type="button" aria-label="Дії вакансії" className="hidden h-9 w-9 place-items-center rounded-lg text-[#7F90AA] hover:bg-[#142440] lg:grid">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}

function StatusBadge({ active, status }: { active: boolean; status: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-extrabold uppercase ${
        active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/15 text-red-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-red-400"}`} />
      {status}
    </span>
  );
}

function formatSalary(min?: number | null, max?: number | null) {
  if (min && max) return `${formatMoney(min)} - ${formatMoney(max)} грн`;
  if (min) return `від ${formatMoney(min)} грн`;
  if (max) return `до ${formatMoney(max)} грн`;
  return "Зарплата не вказана";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(value);
}
