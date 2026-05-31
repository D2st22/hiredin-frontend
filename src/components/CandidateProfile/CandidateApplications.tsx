import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hiredInApi, type ApplicationRead } from "../../services/hiredInApi";

export default function CandidateApplications() {
  const [applications, setApplications] = useState<ApplicationRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    hiredInApi
      .getMyApplications()
      .then((items) => {
        if (active) setApplications(items ?? []);
      })
      .catch(() => {
        if (active) setApplications([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-white">Мої заявки</h2>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <EmptyState text="Завантажуємо заявки..." />
        ) : applications.length > 0 ? (
          applications.slice(0, 4).map((item) => (
            <article key={item.id} className="rounded-xl bg-[#0A1628] p-5">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">
                  {getInitial(item.companyName || item.vacancyTitle || "З")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-bold text-white">
                      {item.vacancyTitle || "Вакансія"}
                    </h3>
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${getStatusClass(item.status)}`}
                    >
                      {formatStatus(item.status)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#8FA1BB]">
                    {item.companyName && <span>{item.companyName}</span>}
                    {item.city && (
                      <>
                        <span>·</span>
                        <span>{item.city}</span>
                      </>
                    )}
                    {(item.salaryMin || item.salaryMax) && (
                      <span className="rounded bg-amber-300/15 px-2 py-0.5 text-xs font-bold text-amber-300">
                        {formatSalary(item.salaryMin, item.salaryMax)}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm text-[#6B7D99]">
                    {formatDate(item.createdAtUtc)}
                  </p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <EmptyState text="Заявок поки немає." />
        )}
      </div>

      {applications.length > 0 && (
        <Link
          to="/my-applications"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
        >
          Усі заявки
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#1E3151] bg-[#0A1628]/50 px-5 py-8 text-center text-sm text-[#8FA1BB]">
      {text}
    </div>
  );
}

function getInitial(value: string) {
  return value.trim().slice(0, 1).toUpperCase() || "З";
}

function formatStatus(status: string | number | null | undefined) {
  const value = String(status ?? "").toLowerCase();
  if (value === "1" || value.includes("review")) return "На розгляді";
  if (value === "2" || value.includes("accepted")) return "Прийнято";
  if (value === "3" || value.includes("rejected")) return "Відхилено";
  if (value === "4" || value.includes("withdraw")) return "Відкликано";
  return "Подано";
}

function getStatusClass(status: string | number | null | undefined) {
  const label = formatStatus(status);
  if (label === "Прийнято") return "bg-emerald-400/10 text-emerald-400";
  if (label === "Відхилено" || label === "Відкликано") {
    return "bg-red-400/10 text-red-300";
  }
  return "bg-slate-700 text-[#B8C4D6]";
}

function formatSalary(min?: number | null, max?: number | null) {
  if (min && max) return `${formatMoney(min)} - ${formatMoney(max)} грн`;
  if (min) return `від ${formatMoney(min)} грн`;
  if (max) return `до ${formatMoney(max)} грн`;
  return "";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "Дата подання не вказана";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Дата подання не вказана";
  return `Подано ${new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)}`;
}
