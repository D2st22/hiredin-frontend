import {
  BriefcaseBusiness,
  CalendarClock,
  ChevronDown,
  Filter,
  MapPin,
  MessageSquare,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { hiredInApi, type ApplicationRead } from "../services/hiredInApi";
import {
  ApplicationStatus,
  applicationStatusLabels,
  enumLabel,
  type ApplicationStatusValue,
} from "../services/hiredInTypes";

export default function MyApplicationsView() {
  const [applications, setApplications] = useState<ApplicationRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    hiredInApi
      .getMyApplications()
      .then((data) => {
        if (ignore) return;
        if (data.length) {
          setApplications(data);
          setMessage("");
        } else {
          setApplications([]);
          setMessage("У тебе ще немає заяв.");
        }
      })
      .catch(() => {
        if (!ignore) {
          setApplications([]);
          setMessage("Щоб бачити заяви, треба увійти як кандидат.");
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const counts = useMemo(() => {
    const inReview = applications.filter(
      (item) => Number(item.status) === ApplicationStatus.InReview,
    ).length;
    const accepted = applications.filter(
      (item) => Number(item.status) === ApplicationStatus.Accepted,
    ).length;
    const rejected = applications.filter(
      (item) => Number(item.status) === ApplicationStatus.Rejected,
    ).length;
    return { all: applications.length, inReview, accepted, rejected };
  }, [applications]);

  async function handleWithdraw(applicationId: string) {
    try {
      await hiredInApi.withdrawApplication(applicationId);
      setApplications((current) =>
        current.filter((item) => item.id !== applicationId),
      );
      setMessage("Заяву відкликано.");
    } catch {
      setMessage(
        "Не вдалося відкликати заяву. Можливо, треба увійти як кандидат.",
      );
    }
  }

  const filters = [
    { label: "Усі", count: counts.all, active: true },
    { label: "На розгляді", count: counts.inReview },
    { label: "Прийнято", count: counts.accepted },
    { label: "Відхилено", count: counts.rejected },
  ];

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-8 lg:px-[80px]">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Мої заяви
            </h1>
          </div>
          <Link
            to="/vacanciesList"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-600 sm:w-auto"
          >
            Знайти вакансії →
          </Link>
        </section>

        <section className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
                  filter.active
                    ? "bg-blue-500 text-white"
                    : "text-[#8FA1BB] hover:bg-[#0F1D36] hover:text-white"
                }`}
              >
                {filter.label}
                <span
                  className={filter.active ? "text-blue-100" : "text-[#6B7D99]"}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] xl:w-[560px]"></div>
        </section>

        <section className="mt-6 space-y-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              data={application}
              onWithdraw={() => handleWithdraw(application.id)}
            />
          ))}
        </section>

        {!isLoading && applications.length === 0 && (
          <section className="mt-6 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 text-center text-[#A8B6CD]">
            Коли ти відгукнешся на вакансію, вона з'явиться тут.
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ApplicationCard({
  data,
  onWithdraw,
}: {
  data: ApplicationRead;
  onWithdraw: () => void;
}) {
  const status = enumLabel(
    applicationStatusLabels,
    data.status as ApplicationStatusValue,
    "На розгляді",
  );
  const statusClassName =
    Number(data.status) === ApplicationStatus.Accepted
      ? "bg-emerald-400/10 text-emerald-400"
      : Number(data.status) === ApplicationStatus.Rejected
        ? "bg-red-500/15 text-red-400"
        : "bg-slate-600/50 text-[#D7E1EF]";

  return (
    <article className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 transition-colors hover:border-blue-500/40 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4 sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-xl font-bold text-white sm:h-16 sm:w-16">
            {(data.companyName ?? data.vacancyTitle ?? "K")
              .slice(0, 1)
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-base font-bold text-white sm:text-lg">
                {data.vacancyTitle ?? "Вакансія"}
              </h2>
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusClassName}`}
              >
                {status}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#A8B6CD]">
              <span className="font-medium text-white">
                {data.companyName ?? "Компанія"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#6B7D99]" />
                {data.city ?? "Локація не вказана"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness className="h-3.5 w-3.5 text-[#6B7D99]" />
                Гібрид
              </span>
              <span className="rounded-md bg-amber-300/15 px-2 py-0.5 text-xs font-bold text-amber-300">
                {formatSalary(data.salaryMin, data.salaryMax)}
              </span>
            </div>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-[#6B7D99]">
              <CalendarClock className="h-3.5 w-3.5" />
              {formatDate(data.createdAtUtc)}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0 lg:items-center">
          <button
            type="button"
            onClick={onWithdraw}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold text-red-400 hover:bg-red-500/10"
          >
            <X className="h-4 w-4" />
            Відмовити
          </button>
          <Link
            to={`/candidate-chat?applicationId=${data.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-600"
          >
            Чат
            <MessageSquare className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
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

function formatDate(value?: string | null) {
  if (!value) return "Дата не вказана";
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}
