import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  MapPin,
  Send,
  Star,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  getStoredResumeId,
  hiredInApi,
  type CompanyRead,
  type VacancyRead,
} from "../services/hiredInApi";
import {
  employmentTypeLabels,
  experienceLevelLabels,
  getEmploymentTypeNumber,
  getExperienceLevelNumber,
  getWorkFormatNumber,
  getVacancyStatusNumber,
  type EmploymentTypeValue,
  type ExperienceLevelValue,
  type WorkFormatValue,
  VacancyStatus,
  workFormatLabels,
} from "../services/hiredInTypes";

const SIDEBAR_PAGE_SIZE = 8;
const LOGO_GRADIENTS = [
  "from-pink-500 to-violet-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-400 to-orange-500",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-red-600",
  "from-violet-500 to-purple-700",
  "from-lime-500 to-emerald-600",
  "from-fuchsia-500 to-pink-600",
  "from-sky-500 to-cyan-600",
];

export default function JobDescriptionView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const scopedCompanyId = searchParams.get("companyId");
  const isCompanyScoped = Boolean(scopedCompanyId);
  const [vacancy, setVacancy] = useState<VacancyRead | null>(null);
  const [company, setCompany] = useState<CompanyRead | null>(null);
  const [relatedVacancies, setRelatedVacancies] = useState<VacancyRead[]>([]);
  const [companyRating, setCompanyRating] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [message, setMessage] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");
  const [visibleSidebarCount, setVisibleSidebarCount] =
    useState(SIDEBAR_PAGE_SIZE);

  useEffect(() => {
    let ignore = false;

    hiredInApi
      .getPagedVacancies(0, 100)
      .then((result) => {
        if (!ignore) setRelatedVacancies(result.items ?? []);
      })
      .catch(() => {
        if (!ignore) setRelatedVacancies([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!id) {
      setVacancy(null);
      setMessage("Обери вакансію зі списку, щоб переглянути детальний опис.");
      setIsLoading(false);
      return;
    }

    let ignore = false;
    setIsLoading(true);

    hiredInApi
      .getPublicVacancyById(id)
      .then((data) => {
        if (!ignore) {
          setVacancy(data);
          setMessage("");
        }
      })
      .catch(() => {
        if (!ignore) {
          setVacancy(null);
          setMessage(
            "Не вдалося завантажити вакансію. Спробуй повернутися до списку.",
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    setVisibleSidebarCount(SIDEBAR_PAGE_SIZE);
  }, [id, scopedCompanyId]);

  useEffect(() => {
    if (!vacancy?.companyId) {
      setCompany(null);
      return;
    }

    let ignore = false;

    hiredInApi
      .getAllCompanies()
      .then((companies) => {
        if (!ignore) {
          setCompany(
            companies.find((item) => item.id === vacancy.companyId) ?? null,
          );
        }
      })
      .catch(() => {
        if (!ignore) setCompany(null);
      });

    return () => {
      ignore = true;
    };
  }, [vacancy?.companyId]);

  useEffect(() => {
    if (!vacancy?.companyId) {
      setCompanyRating(null);
      return;
    }

    let ignore = false;

    hiredInApi
      .getCompanyRatingsByCompanyId(vacancy.companyId)
      .then((items) => {
        if (ignore) return;
        setCompanyRating(getAverageCompanyRating(items ?? []));
      })
      .catch(() => {
        if (!ignore) setCompanyRating(null);
      });

    return () => {
      ignore = true;
    };
  }, [vacancy?.companyId]);

  const tags = useMemo(() => {
    if (!vacancy) return [];

    return [
      experienceLevelLabels[
        getExperienceLevelNumber(
          vacancy.experienceLevel,
        ) as ExperienceLevelValue
      ],
      employmentTypeLabels[
        getEmploymentTypeNumber(vacancy.employmentType) as EmploymentTypeValue
      ],
      workFormatLabels[
        getWorkFormatNumber(vacancy.workFormat) as WorkFormatValue
      ],
    ].filter(Boolean);
  }, [vacancy]);

  const companyName = company?.name ?? vacancy?.companyName ?? "Компанія";
  const publishedVacancies = useMemo(
    () =>
      relatedVacancies.filter(
        (item) => getVacancyStatusNumber(item.status) === VacancyStatus.Published,
      ),
    [relatedVacancies],
  );
  const companyVacancies = useMemo(
    () =>
      publishedVacancies.filter((item) => item.companyId === vacancy?.companyId),
    [publishedVacancies, vacancy?.companyId],
  );
  const sidebarVacancies = useMemo(() => {
    if (isCompanyScoped && scopedCompanyId) {
      return publishedVacancies.filter(
        (item) => item.companyId === scopedCompanyId,
      );
    }

    return publishedVacancies;
  }, [isCompanyScoped, publishedVacancies, scopedCompanyId]);
  const sidebarItems = useMemo(
    () => (sidebarVacancies.length ? sidebarVacancies : vacancy ? [vacancy] : []),
    [sidebarVacancies, vacancy],
  );
  const visibleSidebarVacancies = sidebarItems.slice(0, visibleSidebarCount);
  const hasMoreSidebarVacancies = visibleSidebarCount < sidebarItems.length;
  const vacanciesListLink =
    isCompanyScoped && scopedCompanyId
      ? `/vacanciesList?companyId=${scopedCompanyId}`
      : "/vacanciesList";
  const getVacancyLink = (vacancyId: string) =>
    isCompanyScoped && scopedCompanyId
      ? `/vacancy/${vacancyId}?companyId=${scopedCompanyId}`
      : `/vacancy/${vacancyId}`;
  const descriptionBlocks = splitDescription(vacancy?.description);

  async function handleApply() {
    setApplicationMessage("");
    const resumeId = getStoredResumeId();

    if (!resumeId || !vacancy) {
      setApplicationMessage("Для відгуку потрібен вхід кандидата і резюме.");
      return;
    }

    try {
      await hiredInApi.createApplication(vacancy.id, resumeId);
      setApplicationMessage("Відгук надіслано.");
    } catch {
      setApplicationMessage(
        "Не вдалося надіслати відгук. Можливо, треба увійти як кандидат.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-[80px]">
        <Link
          to={vacanciesListLink}
          className="inline-flex items-center gap-2 text-sm text-[#8FA1BB] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до вакансій
        </Link>

        {message && (
          <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
            {message}
          </div>
        )}

        {!isLoading && !vacancy && (
          <div className="mt-8 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 text-center text-[#A8B6CD]">
            {message || "Вакансію не знайдено."}
          </div>
        )}

        {vacancy && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <div>
                <p className="text-sm text-[#8FA1BB]">Робота</p>
                <h1 className="text-3xl font-bold">
                  {sidebarVacancies.length.toLocaleString("uk-UA")}
                </h1>
                <p className="text-sm text-[#6B7D99]">
                  {isCompanyScoped ? "вакансій компанії" : "активних вакансій"}
                </p>
              </div>

              <div className="space-y-3">
                {visibleSidebarVacancies.map((item) => (
                    <Link
                      key={item.id}
                      to={getVacancyLink(item.id)}
                      className={`block rounded-xl border p-4 transition-colors ${
                        item.id === vacancy.id
                          ? "border-blue-500 bg-[#0F1D36]"
                          : "border-[#1E3151] bg-[#0F1D36]/70 hover:border-blue-500/50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <CompanyLogo
                          name={item.companyName ?? item.title ?? "K"}
                          seed={item.companyId ?? item.id ?? item.title}
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white">
                            {item.title ?? "Вакансія"}
                          </h3>
                          <Salary min={item.salaryMin} max={item.salaryMax} />
                          <p className="mt-2 text-xs text-[#8FA1BB]">
                            {item.companyName ?? "Компанія"} ·{" "}
                            {item.city ?? "Україна"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>

              {hasMoreSidebarVacancies && (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleSidebarCount(
                      (current) => current + SIDEBAR_PAGE_SIZE,
                    )
                  }
                  className="mx-auto flex w-fit items-center justify-center rounded-lg border border-[#1E3151] px-4 py-2 text-sm font-semibold text-[#3B82F6] transition-colors hover:border-blue-500/60 hover:text-[#60A5FA]"
                >
                  {"\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0438\u0442\u0438 \u0449\u0435"}
                </button>
              )}

              <Link
                to={vacanciesListLink}
                className="mx-auto flex w-fit items-center gap-2 text-sm font-semibold text-[#3B82F6] hover:text-[#60A5FA]"
              >
                Переглянути всі вакансії
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>

            <section className="space-y-6">
              <article className="overflow-hidden rounded-2xl border border-[#1E3151] bg-[#0F1D36]">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
                      <CompanyLogo
                        name={companyName}
                        logoUrl={company?.logoUrl}
                        seed={vacancy.companyId ?? companyName}
                        large
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <Salary
                            min={vacancy.salaryMin}
                            max={vacancy.salaryMax}
                          />
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Перевірена компанія
                          </span>
                        </div>
                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#E9F1FF] sm:text-4xl">
                          {vacancy.title ?? "Вакансія"}
                        </h1>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#A8B6CD]">
                          <span>{companyName}</span>
                          <span className="text-[#2A436D]">·</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-[#6B7D99]" />
                            {vacancy.city ?? "Локація не вказана"}
                          </span>
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-2"
                            >
                              <span className="text-[#2A436D]">·</span>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleApply}
                      className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-600 sm:px-7"
                    >
                      <Send className="h-4 w-4" />
                      Швидкий відгук
                    </button>
                  </div>

                  {applicationMessage && (
                    <div className="mt-5 rounded-xl border border-blue-400/30 bg-blue-400/10 px-4 py-3 text-sm text-blue-100">
                      {applicationMessage}
                    </div>
                  )}
                </div>

                <div className="border-t border-[#1E3151] bg-[#0A1628]/30 p-6 sm:p-8">
                  <ContentSection title="Про роль">
                    {descriptionBlocks.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </ContentSection>
                </div>
              </article>

              <CompanySummaryCard
                company={company}
                companyName={companyName}
                vacancy={vacancy}
                activeVacanciesCount={companyVacancies.length}
                companyRating={companyRating}
                companyVacanciesLink={
                  vacancy.companyId
                    ? `/vacanciesList?companyId=${vacancy.companyId}`
                    : "/vacanciesList"
                }
              />
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function CompanySummaryCard({
  company,
  companyName,
  vacancy,
  activeVacanciesCount,
  companyRating,
  companyVacanciesLink,
}: {
  company: CompanyRead | null;
  companyName: string;
  vacancy: VacancyRead;
  activeVacanciesCount: number;
  companyRating: string | null;
  companyVacanciesLink: string;
}) {
  const meta = [company?.industry, company?.city ?? vacancy.city].filter(
    Boolean,
  );
  const badges = [company?.industry, company?.city, company?.website].filter(
    Boolean,
  );
  const visibleVacanciesCount = activeVacanciesCount || 1;

  return (
    <article className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-2 text-sm font-bold text-[#8FA1BB]">
        <Building2 className="h-4 w-4" />
        Про компанію
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <CompanyLogo
            name={companyName}
            logoUrl={company?.logoUrl}
            seed={company?.id ?? vacancy.companyId ?? companyName}
            large
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold">{companyName}</h2>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Перевірена
              </span>
            </div>
            <p className="mt-1 text-sm text-[#8FA1BB]">
              {meta.join(" · ") || "Локацію компанії не вказано"}
            </p>
          </div>
        </div>

        <Link
          to={
            company?.id
              ? `/companyProfile?companyId=${company.id}`
              : "/companyProfile"
          }
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-600 sm:px-7"
        >
          Сторінка компанії
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-7 max-w-4xl text-base leading-8 text-[#C8D3E3]">
        {company?.description || "Опис компанії ще не додано."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Metric
          icon={BriefcaseBusiness}
          value={String(visibleVacanciesCount)}
          label={
            visibleVacanciesCount === 1
              ? "відкрита вакансія"
              : "відкритих вакансій"
          }
          tone="blue"
        />
        <Metric
          icon={Star}
          value={companyRating ?? "—"}
          label="рейтинг від команди"
          tone="green"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-7 text-sm font-medium text-[#8FA1BB]">
          {badges.length > 0 ? (
            badges.map((item) => <span key={item}>{item}</span>)
          ) : (
            <span>Дані компанії ще заповнюються</span>
          )}
        </div>
        <Link
          to={companyVacanciesLink}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#3B82F6] hover:text-[#60A5FA]"
        >
          Переглянути всі {visibleVacanciesCount} вакансії
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function Metric({
  icon: Icon,
  value,
  label,
  tone = "blue",
}: {
  icon: typeof BriefcaseBusiness;
  value: string;
  label: string;
  tone?: "blue" | "green";
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-500/10 text-emerald-400"
      : "bg-blue-500/10 text-[#60A5FA]";
  const valueClass = tone === "green" ? "text-emerald-400" : "text-white";

  return (
    <div className="rounded-xl bg-[#0A1628] p-5">
      <div
        className={`grid h-9 w-9 place-items-center rounded-lg ${toneClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className={`mt-3 text-2xl font-black ${valueClass}`}>
        {value}{" "}
        <span className="text-sm font-medium text-[#8FA1BB]">{label}</span>
      </p>
    </div>
  );
}

function CompanyLogo({
  name,
  logoUrl,
  seed,
  large = false,
}: {
  name: string;
  logoUrl?: string | null;
  seed?: string | null;
  large?: boolean;
}) {
  const gradient = LOGO_GRADIENTS[getStableIndex(seed ?? name, LOGO_GRADIENTS.length)];

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} font-black text-white ${
        large ? "h-20 w-20 text-4xl" : "h-12 w-12 text-xl"
      }`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="h-full w-full object-cover"
        />
      ) : (
        getLogoInitial(name)
      )}
    </div>
  );
}

function getStableIndex(value: string, modulo: number) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash % modulo;
}

function getLogoInitial(name: string) {
  return name.trim().slice(0, 1).toLowerCase() || "k";
}

function Salary({
  min,
  max,
  large = false,
}: {
  min?: number | null;
  max?: number | null;
  large?: boolean;
}) {
  return (
    <div
      className={`mt-3 inline-flex rounded-lg bg-amber-300/15 font-bold text-amber-300 ${
        large ? "px-4 py-2 text-xl" : "px-2 py-1 text-xs"
      }`}
    >
      {formatSalary(min, max)}
    </div>
  );
}

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10 space-y-4 text-sm leading-7 text-[#D6DDEB] last:mb-0">
      <h2 className="text-base font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

function splitDescription(description?: string | null) {
  if (!description) return ["Опис вакансії ще не додано."];
  return description.split(/\n+/).filter(Boolean);
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

function normalizeRating(value?: number | null) {
  return Math.min(5, Math.max(1, Math.round(Number(value) || 0)));
}

function getAverageCompanyRating(
  reviews: Array<{ rating?: number | null; Rating?: number | null }>,
) {
  if (!reviews.length) return null;

  const total = reviews.reduce(
    (sum, review) => sum + normalizeRating(review.rating ?? review.Rating),
    0,
  );

  return (total / reviews.length).toFixed(1);
}
