import {
  ChevronRight,
  Mail,
  Pencil,
  Search,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import {
  hiredInApi,
  type CompanyRead,
  type VacancyRead,
} from "../services/hiredInApi";
import {
  VacancyStatus,
  getEmploymentTypeApiValue,
  getEmploymentTypeNumber,
  getExperienceLevelApiValue,
  getExperienceLevelNumber,
  getVacancyStatusApiValue,
  getVacancyStatusNumber,
  getWorkFormatApiValue,
  getWorkFormatNumber,
} from "../services/hiredInTypes";

type VacancyForm = {
  title: string;
  description: string;
  city: string;
  salaryMin: string;
  salaryMax: string;
  employmentType: number;
  workFormat: number;
  experienceLevel: number;
  status: number;
};

function vacancyToForm(vacancy?: VacancyRead | null): VacancyForm {
  return {
    title: vacancy?.title ?? "",
    description: vacancy?.description ?? "",
    city: vacancy?.city ?? "",
    salaryMin: vacancy?.salaryMin != null ? String(vacancy.salaryMin) : "",
    salaryMax: vacancy?.salaryMax != null ? String(vacancy.salaryMax) : "",
    employmentType: getEmploymentTypeNumber(vacancy?.employmentType),
    workFormat: getWorkFormatNumber(vacancy?.workFormat),
    experienceLevel: getExperienceLevelNumber(vacancy?.experienceLevel),
    status: getVacancyStatusNumber(vacancy?.status),
  };
}

export default function CompanyVacancyDetailView() {
  const [searchParams] = useSearchParams();
  const vacancyId = searchParams.get("vacancyId");
  const [vacancies, setVacancies] = useState<VacancyRead[]>([]);
  const [vacancy, setVacancy] = useState<VacancyRead | null>(null);
  const [vacancyForm, setVacancyForm] = useState<VacancyForm>(vacancyToForm());
  const [company, setCompany] = useState<CompanyRead | null>(null);
  const [isRoleEditing, setIsRoleEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    hiredInApi
      .getMyCompany()
      .then((data) => {
        if (!ignore) setCompany(data);
      })
      .catch(() => {
        if (!ignore) setCompany(null);
      });

    hiredInApi
      .getMyVacancies()
      .then((data) => {
        if (!ignore) setVacancies(data);
      })
      .catch(() => {
        if (!ignore) setVacancies([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!vacancyId) {
      setVacancy(null);
      setMessage("Обери вакансію зі списку, щоб переглянути деталі.");
      return;
    }

    let ignore = false;

    hiredInApi
      .getEmployerVacancyById(vacancyId)
      .then((data) => {
        if (!ignore) {
          setVacancy(data);
          setVacancyForm(vacancyToForm(data));
          setMessage("");
        }
      })
      .catch(() => {
        if (!ignore) {
          setVacancy(null);
          setMessage(
            "Не вдалося завантажити вакансію. Перевір вхід роботодавця.",
          );
        }
      });

    return () => {
      ignore = true;
    };
  }, [vacancyId]);

  const selectedVacancy = useMemo(
    () => vacancy ?? vacancies.find((item) => item.id === vacancyId) ?? null,
    [vacancy, vacancies, vacancyId],
  );
  const isVacancyActive = vacancyForm.status === VacancyStatus.Published;

  function updateVacancyField(
    field: keyof VacancyForm,
    value: string | number,
  ) {
    setMessage("");
    setVacancyForm((current) => ({ ...current, [field]: value }));
  }

  async function saveVacancy() {
    if (!selectedVacancy) return;

    const status = vacancyForm.status;
    const apiStatus = getVacancyStatusApiValue(status);

    try {
      await hiredInApi.updateVacancy(selectedVacancy.id, {
        title: vacancyForm.title,
        description: vacancyForm.description,
        city: vacancyForm.city,
        salaryMin: vacancyForm.salaryMin ? Number(vacancyForm.salaryMin) : null,
        salaryMax: vacancyForm.salaryMax ? Number(vacancyForm.salaryMax) : null,
        employmentType: getEmploymentTypeApiValue(vacancyForm.employmentType),
        workFormat: getWorkFormatApiValue(vacancyForm.workFormat),
        experienceLevel: getExperienceLevelApiValue(vacancyForm.experienceLevel),
        status: apiStatus,
      });
      const updatedVacancy = {
        ...selectedVacancy,
        title: vacancyForm.title,
        description: vacancyForm.description,
        city: vacancyForm.city,
        salaryMin: vacancyForm.salaryMin ? Number(vacancyForm.salaryMin) : null,
        salaryMax: vacancyForm.salaryMax ? Number(vacancyForm.salaryMax) : null,
        employmentType: vacancyForm.employmentType,
        workFormat: vacancyForm.workFormat,
        experienceLevel: vacancyForm.experienceLevel,
        status: apiStatus,
      };
      setVacancy(updatedVacancy);
      setVacancyForm((current) => ({ ...current, status }));
      setVacancies((current) =>
        current.map((item) =>
          item.id === updatedVacancy.id ? updatedVacancy : item,
        ),
      );
      setIsRoleEditing(false);
      setMessage("Зміни вакансії збережено.");
    } catch {
      setMessage("Не вдалося зберегти зміни вакансії.");
    }
  }

  function toggleStatus() {
    if (!selectedVacancy) return;

    const nextStatus = isVacancyActive
      ? VacancyStatus.Archived
      : VacancyStatus.Published;

    setVacancyForm((current) => ({ ...current, status: nextStatus }));
    setMessage(
      "Статус підготовлено. Натисни «Опублікувати зміни», щоб зберегти.",
    );
  }

  return (
    <div className="min-h-screen bg-[#081426] text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8 lg:px-[56px]">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[#8EA0BA]">
          <Link to="/companyCabinet" className="hover:text-white">
            Кабінет роботодавця
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/company-vacancies" className="hover:text-white">
            Мої вакансії
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#D7E1EF]">
            {selectedVacancy?.title ?? "Деталі вакансії"}
          </span>
        </nav>

        <section className="mt-10 grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_280px]">
          <aside className="xl:sticky xl:top-24 xl:self-start">
            <h1 className="text-xl font-extrabold">Мої вакансії</h1>
            <p className="mt-2 text-sm text-[#7F90AA]">
              {vacancies.length
                ? `${vacancies.length} вакансій`
                : "Список вакансій порожній"}
            </p>

            <label className="relative mt-4 block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F90AA]" />
              <input
                placeholder="Пошук за назвою..."
                className="h-10 w-full rounded-lg border border-[#1E3151] bg-[#0B182C] pl-10 pr-4 text-sm outline-none placeholder:text-[#7F90AA] focus:border-[#3B82F6]"
              />
            </label>

            <div className="mt-3 space-y-2">
              {vacancies.map((item) => (
                <Link
                  key={item.id}
                  to={`/company-vacancy-detail?vacancyId=${item.id}`}
                  className={`block rounded-xl border p-4 transition-colors ${
                    item.id === vacancyId
                      ? "border-[#3B82F6] bg-[#0F1D36]"
                      : "border-[#1E3151] bg-[#0F1D36] hover:border-[#2A436D]"
                  }`}
                >
                  <StatusBadge
                    active={
                      getVacancyStatusNumber(item.status) ===
                      VacancyStatus.Published
                    }
                  />
                  <h2 className="mt-3 font-bold text-[#3B82F6]">
                    {item.title ?? "Вакансія без назви"}
                  </h2>
                  <span className="mt-2 inline-flex rounded-md bg-[#F5C84C]/10 px-2 py-0.5 text-xs font-extrabold text-[#F5C84C]">
                    {formatSalary(item.salaryMin, item.salaryMax)}
                  </span>
                  <p className="mt-2 flex items-center gap-2 text-xs text-[#7F90AA]">
                    <Mail className="h-3.5 w-3.5" />
                    {item.city ?? "Локація не вказана"}
                  </p>
                </Link>
              ))}
            </div>
          </aside>

          <section className="min-w-0">
            <article className="overflow-hidden rounded-2xl border border-[#1E3151] bg-[#0F1D36]">
              <div className="flex flex-col gap-3 border-b border-[#1E3151] px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={toggleStatus}
                  disabled={!selectedVacancy}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold ${
                    isVacancyActive
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-emerald-400 hover:bg-emerald-500/10"
                  } disabled:opacity-50`}
                >
                  {isVacancyActive ? (
                    <>
                      <X className="h-4 w-4" />
                      Закрити
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Активувати
                    </>
                  )}
                </button>
                <Link
                  to={
                    selectedVacancy
                      ? `/company-vacancy-candidates?vacancyId=${selectedVacancy.id}`
                      : "/company-vacancy-candidates"
                  }
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1B3155] px-4 text-sm font-semibold text-[#D7E1EF] transition-colors hover:bg-[#23416F]"
                >
                  Переглянути кандидатів
                </Link>
                <button
                  type="button"
                  onClick={saveVacancy}
                  disabled={!selectedVacancy}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-bold text-white hover:bg-[#2563EB] disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  Опублікувати зміни
                </button>
              </div>

              <div className="bg-[#101F38] px-5 py-8 sm:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                  <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-black text-5xl font-extrabold shadow-[0_18px_34px_-18px_rgba(147,197,253,0.95)]">
                    {company?.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitial(
                        selectedVacancy?.companyName ??
                          selectedVacancy?.title ??
                          "K",
                      )
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-[#D7E1EF]">
                        {selectedVacancy?.companyName ?? "Компанія"}
                      </span>
                      <StatusBadge active={isVacancyActive} />
                    </div>
                    <h2 className="mt-5 text-3xl font-extrabold">
                      {vacancyForm.title ||
                        selectedVacancy?.title ||
                        "Вакансію не обрано"}
                    </h2>
                    <span className="mt-3 inline-flex rounded-lg bg-[#F5C84C]/10 px-4 py-2 text-xl font-extrabold text-[#F5C84C]">
                      {formatSalary(
                        vacancyForm.salaryMin
                          ? Number(vacancyForm.salaryMin)
                          : selectedVacancy?.salaryMin,
                        vacancyForm.salaryMax
                          ? Number(vacancyForm.salaryMax)
                          : selectedVacancy?.salaryMax,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {message && (
              <div className="mt-5 rounded-xl border border-[#1E3151] bg-[#0F1D36] px-4 py-3 text-sm text-[#A8B6CD]">
                {message}
              </div>
            )}

            <article className="relative mt-8 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-6">
              {isRoleEditing ? (
                <button
                  type="button"
                  onClick={saveVacancy}
                  className="absolute right-5 top-4 inline-flex h-9 items-center rounded-lg bg-[#1B3155] px-4 text-sm font-medium text-[#60A5FA]"
                >
                  Зберегти
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRoleEditing(true)}
                  className="absolute right-5 top-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[#1B3155] px-4 text-sm font-medium text-[#60A5FA]"
                >
                  <Pencil className="h-4 w-4" />
                  Редагувати блок
                </button>
              )}

              <div className="mt-10 min-h-[520px] rounded-xl bg-[#0A1628] p-5 sm:p-6">
                {isRoleEditing ? (
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-bold text-[#D7E1EF]">
                        Назва вакансії
                      </span>
                      <input
                        value={vacancyForm.title}
                        onChange={(event) =>
                          updateVacancyField("title", event.target.value)
                        }
                        className="mt-2 h-11 w-full rounded-lg border border-[#1E3151] bg-[#071224] px-3 text-sm text-white outline-none focus:border-blue-500"
                      />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <label className="block">
                        <span className="text-sm font-bold text-[#D7E1EF]">
                          Місто
                        </span>
                        <input
                          value={vacancyForm.city}
                          onChange={(event) =>
                            updateVacancyField("city", event.target.value)
                          }
                          className="mt-2 h-11 w-full rounded-lg border border-[#1E3151] bg-[#071224] px-3 text-sm text-white outline-none focus:border-blue-500"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-bold text-[#D7E1EF]">
                          ЗП від
                        </span>
                        <input
                          type="number"
                          value={vacancyForm.salaryMin}
                          onChange={(event) =>
                            updateVacancyField("salaryMin", event.target.value)
                          }
                          className="mt-2 h-11 w-full rounded-lg border border-[#1E3151] bg-[#071224] px-3 text-sm text-white outline-none focus:border-blue-500"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-bold text-[#D7E1EF]">
                          ЗП до
                        </span>
                        <input
                          type="number"
                          value={vacancyForm.salaryMax}
                          onChange={(event) =>
                            updateVacancyField("salaryMax", event.target.value)
                          }
                          className="mt-2 h-11 w-full rounded-lg border border-[#1E3151] bg-[#071224] px-3 text-sm text-white outline-none focus:border-blue-500"
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="font-extrabold text-[#D7E1EF]">
                        Про роль
                      </span>
                      <textarea
                        value={vacancyForm.description}
                        onChange={(event) =>
                          updateVacancyField("description", event.target.value)
                        }
                        className="mt-4 min-h-[360px] w-full resize-y rounded-xl border border-[#1E3151] bg-[#071224] p-4 text-base leading-8 text-[#D7E1EF] outline-none focus:border-blue-500"
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs font-bold uppercase text-[#7F90AA]">
                          Назва вакансії
                        </h3>
                        <p className="mt-2 text-2xl font-extrabold text-white">
                          {vacancyForm.title ||
                            selectedVacancy?.title ||
                            "Назву не вказано"}
                        </p>
                      </div>
                      <dl className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-[#0F1D36] px-4 py-3">
                          <dt className="text-xs font-bold uppercase text-[#7F90AA]">
                            Місто
                          </dt>
                          <dd className="mt-2 text-sm font-bold text-white">
                            {vacancyForm.city ||
                              selectedVacancy?.city ||
                              "Місто не вказано"}
                          </dd>
                        </div>
                        <div className="rounded-xl bg-[#0F1D36] px-4 py-3">
                          <dt className="text-xs font-bold uppercase text-[#7F90AA]">
                            ЗП від
                          </dt>
                          <dd className="mt-2 text-sm font-bold text-[#F5C84C]">
                            {vacancyForm.salaryMin ||
                              selectedVacancy?.salaryMin ||
                              "Не вказано"}
                          </dd>
                        </div>
                        <div className="rounded-xl bg-[#0F1D36] px-4 py-3">
                          <dt className="text-xs font-bold uppercase text-[#7F90AA]">
                            ЗП до
                          </dt>
                          <dd className="mt-2 text-sm font-bold text-[#F5C84C]">
                            {vacancyForm.salaryMax ||
                              selectedVacancy?.salaryMax ||
                              "Не вказано"}
                          </dd>
                        </div>
                      </dl>
                      <div>
                        <h3 className="font-extrabold text-[#D7E1EF]">
                          Про роль
                        </h3>
                        <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-8 text-[#D7E1EF]">
                          {vacancyForm.description ||
                            selectedVacancy?.description ||
                            "Опис вакансії ще не додано."}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </article>
          </section>
        </section>
      </main>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-extrabold uppercase ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/15 text-red-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-red-400"}`}
      />
      {active ? "Активна" : "Закрита"}
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
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function getInitial(value: string) {
  return value.trim().slice(0, 1).toUpperCase() || "K";
}
