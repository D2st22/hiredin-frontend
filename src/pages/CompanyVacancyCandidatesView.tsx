import {
  Check,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  MessageSquare,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { hiredInApi, type ApplicationRead, type VacancyRead } from "../services/hiredInApi";
import {
  ApplicationStatus,
  VacancyStatus,
  getVacancyStatusNumber,
} from "../services/hiredInTypes";

export default function CompanyVacancyCandidatesView() {
  const [searchParams] = useSearchParams();
  const vacancyId = searchParams.get("vacancyId");
  const [vacancies, setVacancies] = useState<VacancyRead[]>([]);
  const [applications, setApplications] = useState<ApplicationRead[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

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
      setApplications([]);
      setMessage("Обери вакансію зі списку, щоб переглянути кандидатів.");
      return;
    }

    let ignore = false;

    hiredInApi
      .getApplicationsByVacancyId(vacancyId)
      .then((data) => {
        if (ignore) return;
        setApplications(data);
        setMessage(data.length ? "" : "За цією вакансією ще немає заявок.");
      })
      .catch(() => {
        if (!ignore) {
          setApplications([]);
          setMessage("Щоб бачити кандидатів, треба увійти як роботодавець.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [vacancyId]);

  const selectedVacancy = useMemo(
    () => vacancies.find((vacancy) => vacancy.id === vacancyId) ?? null,
    [vacancies, vacancyId],
  );

  async function handleStatus(applicationId: string, status: number) {
    try {
      await hiredInApi.updateApplicationStatus(applicationId, status);
      setApplications((current) => current.filter((item) => item.id !== applicationId));
      setMessage("Статус кандидата оновлено.");
    } catch {
      setMessage("Не вдалося оновити статус. Перевір роль роботодавця.");
    }
  }

  return (
    <div className="min-h-screen bg-[#081426] text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8 lg:px-[56px]">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[#8EA0BA]">
          <Link to="/companyCabinet" className="hover:text-white">Кабінет роботодавця</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/company-vacancies" className="hover:text-white">Мої вакансії</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#D7E1EF]">Кандидати</span>
        </nav>

        <section className="mt-8 grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-24 xl:self-start">
            <h1 className="text-xl font-extrabold">Мої вакансії</h1>
            <p className="mt-2 text-sm text-[#7F90AA]">
              {vacancies.length ? `${vacancies.length} вакансій` : "Список вакансій порожній"}
            </p>

            <label className="relative mt-4 block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F90AA]" />
              <input
                placeholder="Пошук за назвою..."
                className="h-10 w-full rounded-lg border border-[#1E3151] bg-[#0B182C] pl-10 pr-4 text-sm outline-none placeholder:text-[#7F90AA] focus:border-[#3B82F6]"
              />
            </label>

            <div className="mt-3 space-y-2">
              {vacancies.map((vacancy) => (
                <Link
                  key={vacancy.id}
                  to={`/company-vacancy-candidates?vacancyId=${vacancy.id}`}
                  className={`block rounded-xl border p-4 transition-colors ${
                    vacancy.id === vacancyId ? "border-[#3B82F6] bg-[#0F1D36]" : "border-[#1E3151] bg-[#0F1D36] hover:border-[#2A436D]"
                  }`}
                >
                  <StatusBadge active={getVacancyStatusNumber(vacancy.status) === VacancyStatus.Published} />
                  <h2 className="mt-3 font-bold text-[#3B82F6]">
                    {vacancy.title ?? "Вакансія без назви"}
                  </h2>
                  <span className="mt-2 inline-flex rounded-md bg-[#F5C84C]/10 px-2 py-0.5 text-xs font-extrabold text-[#F5C84C]">
                    {formatSalary(vacancy.salaryMin, vacancy.salaryMax)}
                  </span>
                </Link>
              ))}
            </div>
          </aside>

          <section className="min-w-0">
            <article className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-[#D7E1EF]">
                      {selectedVacancy?.companyName ?? "Компанія"}
                    </span>
                    <StatusBadge active={getVacancyStatusNumber(selectedVacancy?.status) === VacancyStatus.Published} />
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold">
                    {selectedVacancy?.title ?? "Вакансію не обрано"}
                  </h2>
                  <span className="mt-3 inline-flex rounded-lg bg-[#F5C84C]/10 px-4 py-2 text-xl font-extrabold text-[#F5C84C]">
                    {formatSalary(selectedVacancy?.salaryMin, selectedVacancy?.salaryMax)}
                  </span>
                </div>

                <div className="lg:text-right">
                  <p className="text-sm text-[#8EA0BA]">Кандидатів</p>
                  <p className="text-4xl font-extrabold">{applications.length}</p>
                  {message && <p className="text-sm font-bold text-emerald-400">{message}</p>}
                </div>
              </div>
            </article>

            <div className="mt-4 space-y-3">
              {applications.map((application, index) => (
                <CandidateRow
                  key={application.id}
                  application={application}
                  index={index}
                  onAccept={() => handleStatus(application.id, ApplicationStatus.Accepted)}
                  onReject={() => handleStatus(application.id, ApplicationStatus.Rejected)}
                />
              ))}
            </div>

            {applications.length === 0 && (
              <div className="mt-4 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 text-center text-[#A8B6CD]">
                {message || "Кандидатів для цієї вакансії поки немає."}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

function CandidateRow({
  application,
  index,
  onAccept,
  onReject,
}: {
  application: ApplicationRead;
  index: number;
  onAccept: () => void;
  onReject: () => void;
}) {
  const name = application.resumeTitle || `Кандидат ${index + 1}`;
  const colors = ["bg-violet-500", "bg-teal-600", "bg-orange-600", "bg-blue-700", "bg-rose-700"];

  return (
    <article className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-center">
        <div className="flex min-w-0 gap-5">
          <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-white ${colors[index % colors.length]}`}>
            {initials(name)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-lg font-extrabold">{name}</h3>
              <span className="text-sm text-[#8EA0BA]">{application.vacancyTitle ?? "Заявка кандидата"}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#8EA0BA]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {application.city ?? "Україна"}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {application.createdAtUtc ? formatDate(application.createdAtUtc) : "Дата заявки не вказана"}
              </span>
            </div>
            {application.coverLetter && (
              <p className="mt-4 text-sm leading-6 text-[#D7E1EF]">{application.coverLetter}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Link
            to="/candidateProfile"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-[#D7E1EF] hover:bg-[#142440]"
          >
            <ExternalLink className="h-4 w-4" />
            Переглянути профіль
          </Link>
          <Link
            to={`/company-chat?applicationId=${application.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#1E3151] px-4 text-sm font-semibold text-[#D7E1EF] hover:bg-[#142440]"
          >
            <MessageSquare className="h-4 w-4" />
            Чат
          </Link>
          <button onClick={onReject} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-red-400 hover:bg-red-500/10">
            <X className="h-4 w-4" />
            Відмовити
          </button>
          <button onClick={onAccept} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-bold text-white hover:bg-[#2563EB]">
            <Check className="h-4 w-4" />
            Прийняти
          </button>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-extrabold uppercase ${
        active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/15 text-red-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-red-400"}`} />
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
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "short" }).format(new Date(value));
}

function initials(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
