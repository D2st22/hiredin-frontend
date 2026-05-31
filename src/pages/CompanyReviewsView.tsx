import {
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  hiredInApi,
  type CompanyRatingRead,
  type CompanyRead,
} from "../services/hiredInApi";

const REVIEWS_PER_PAGE = 6;
const AVATAR_GRADIENTS = [
  "from-[#60A5FA] to-[#2563EB]",
  "from-[#F472B6] to-[#DB2777]",
  "from-[#34D399] to-[#059669]",
  "from-[#FBBF24] to-[#D97706]",
  "from-[#A78BFA] to-[#7C3AED]",
  "from-[#FB7185] to-[#E11D48]",
];

type RatingFilter = "all" | 1 | 2 | 3 | 4 | 5;
type SortOrder = "newest" | "oldest";

export default function CompanyReviewsView() {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");
  const [companies, setCompanies] = useState<CompanyRead[]>([]);
  const [reviews, setReviews] = useState<CompanyRatingRead[]>([]);
  const [vacanciesCount, setVacanciesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [page, setPage] = useState(1);

  const selectedCompany = useMemo(() => {
    return (
      companies.find((company) => company.id === companyId) ??
      companies[0] ??
      null
    );
  }, [companies, companyId]);

  const averageRating = getAverageRating(reviews);
  const averageRatingNumber = Number(averageRating);
  const distribution = getRatingDistribution(reviews);

  const filteredReviews = useMemo(() => {
    const filtered =
      ratingFilter === "all"
        ? reviews
        : reviews.filter(
            (review) =>
              normalizeRating(review.rating ?? review.Rating) === ratingFilter,
          );

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAtUtc ?? a.CreatedAtUtc ?? 0).getTime();
      const dateB = new Date(b.createdAtUtc ?? b.CreatedAtUtc ?? 0).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [reviews, ratingFilter, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [ratingFilter, sortOrder, selectedCompany?.id]);

  useEffect(() => {
    let active = true;

    hiredInApi
      .getAllCompanies()
      .then((items) => {
        if (active) setCompanies(items ?? []);
      })
      .catch(() => {
        if (active) setCompanies([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCompany?.id) {
      setReviews([]);
      setVacanciesCount(0);
      return;
    }

    let active = true;
    setReviewsLoading(true);

    Promise.all([
      hiredInApi.getCompanyRatingsByCompanyId(selectedCompany.id),
      hiredInApi.getPagedVacancies(0, 100).catch(() => ({ items: [] })),
    ])
      .then(([items, pagedVacancies]) => {
        if (!active) return;
        setReviews(items ?? []);
        setVacanciesCount(
          (pagedVacancies.items ?? []).filter(
            (vacancy) => vacancy.companyId === selectedCompany.id,
          ).length,
        );
      })
      .catch(() => {
        if (!active) {
          setReviews([]);
          setVacanciesCount(0);
        }
      })
      .finally(() => {
        if (active) setReviewsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCompany?.id]);

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-[80px] lg:py-10">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[#7F90AA]">
          <Link to="/companiesList" className="hover:text-white">
            Компанії
          </Link>
          <span>/</span>
          <Link
            to={
              selectedCompany
                ? `/companyProfile?companyId=${selectedCompany.id}`
                : "/companyProfile"
            }
            className="hover:text-white"
          >
            {selectedCompany?.name ?? "Компанія"}
          </Link>
          <span>/</span>
          <span className="text-[#D7E1EF]">Відгуки</span>
        </nav>

        <section className="mt-6 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-5">
              <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#1E3151] bg-black text-2xl font-extrabold text-white sm:h-[72px] sm:w-[72px]">
                {selectedCompany?.logoUrl ? (
                  <img
                    src={selectedCompany.logoUrl}
                    alt={selectedCompany.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitial(selectedCompany?.name)
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {selectedCompany && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#34D399]">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Перевірена компанія
                    </span>
                  )}
                </div>

                <h1 className="truncate text-2xl font-bold text-white sm:text-[28px]">
                  {selectedCompany?.name ??
                    (isLoading ? "Завантаження..." : "Компанія")}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#8EA0BA]">
                  {selectedCompany?.city && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#6B7D99]" />
                      {selectedCompany.city}
                    </span>
                  )}
                  {selectedCompany?.city && selectedCompany?.industry && (
                    <span className="text-[#1E3151]">•</span>
                  )}
                  {selectedCompany?.industry && (
                    <span>{selectedCompany.industry}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-4 sm:flex-row sm:items-center xl:flex-col xl:items-end">
              {!reviewsLoading && reviews.length > 0 && (
                <div className="text-left sm:text-right xl:text-right">
                  <div className="flex items-center gap-2 sm:justify-end"></div>
                </div>
              )}

              <Link
                to={
                  selectedCompany
                    ? `/companyProfile?companyId=${selectedCompany.id}`
                    : "/companyProfile"
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#1E3151] px-4 text-sm font-semibold text-[#D7E1EF] transition-colors hover:bg-[#142440]"
              >
                <ArrowLeft className="h-4 w-4" />
                До профілю
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 lg:self-start">
            <p className="text-sm font-semibold text-[#A8B6CD]">
              Загальний рейтинг
            </p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-[52px] font-extrabold leading-none text-white">
                {reviewsLoading
                  ? "..."
                  : reviews.length
                    ? formatRatingNumber(averageRatingNumber)
                    : "—"}
              </span>
              <span className="pb-2 text-base text-[#7F90AA]">/ 5</span>
            </div>

            <div className="mt-4 flex gap-1 text-[#F5C84C]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    !reviewsLoading &&
                    reviews.length &&
                    index < Math.round(averageRatingNumber)
                      ? "fill-current"
                      : ""
                  }`}
                />
              ))}
            </div>

            <p className="mt-4 text-sm text-[#8EA0BA]">
              {reviewsLoading
                ? "Завантаження відгуків..."
                : reviews.length
                  ? `На основі ${reviews.length} відгуків`
                  : "Відгуків поки немає"}
            </p>

            {reviews.length > 0 && (
              <div className="mt-6 space-y-3 border-t border-[#1E3151] pt-6">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div
                    key={rating}
                    className="grid grid-cols-[16px_14px_minmax(0,1fr)_28px] items-center gap-2 text-xs text-[#8EA0BA]"
                  >
                    <span>{rating}</span>
                    <Star className="h-3 w-3 text-[#F5C84C]" />
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#1E3151]">
                      <div
                        className="h-full rounded-full bg-[#F5C84C]"
                        style={{
                          width: `${(distribution[rating] / reviews.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-right">{distribution[rating]}</span>
                  </div>
                ))}
              </div>
            )}
          </aside>

          <section className="min-w-0">
            <h2 className="text-[22px] font-extrabold text-white">
              Відгуки співробітників
            </h2>

            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-[#6B7D99]" />
                {(
                  [
                    { value: "all" as const, label: `Всі ${reviews.length}` },
                    { value: 5 as const, label: "5 ★" },
                    { value: 4 as const, label: "4 ★" },
                    { value: 3 as const, label: "3 ★" },
                    { value: 2 as const, label: "2 ★" },
                    { value: 1 as const, label: "1 ★" },
                  ] as const
                ).map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setRatingFilter(filter.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                      ratingFilter === filter.value
                        ? "bg-[#3B82F6] text-white"
                        : "border border-[#1E3151] text-[#8EA0BA] hover:text-white"
                    }`}
                  >
                    {filter.value === "all"
                      ? filter.label
                      : `${filter.label} (${distribution[filter.value]})`}
                  </button>
                ))}
              </div>

              <label className="relative inline-flex items-center">
                <select
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(event.target.value as SortOrder)
                  }
                  className="h-10 appearance-none rounded-xl border border-[#1E3151] bg-[#0F1D36] pl-4 pr-10 text-sm font-medium text-[#D7E1EF] outline-none"
                >
                  <option value="newest">Сортувати: Спочатку нові</option>
                  <option value="oldest">Сортувати: Спочатку старі</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#6B7D99]" />
              </label>
            </div>

            {reviewsLoading ? (
              <div className="mt-5 rounded-2xl border border-[#1E3151] bg-[#0F1D36] px-6 py-14 text-center">
                <p className="text-sm text-[#8EA0BA]">
                  Завантаження відгуків...
                </p>
              </div>
            ) : paginatedReviews.length > 0 ? (
              <div className="mt-5 space-y-4">
                {paginatedReviews.map((review, index) => {
                  const rating = normalizeRating(
                    review.rating ?? review.Rating,
                  );
                  const comment = review.comment ?? review.Comment ?? "";

                  return (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-extrabold text-white ${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]}`}
                          >
                            {initials(review.fullName ?? review.FullName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-bold text-white">
                              {shortName(review.fullName ?? review.FullName)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:shrink-0">
                          <span className="text-lg font-bold text-white">
                            {rating.toFixed(1)}
                          </span>
                          <div className="flex gap-0.5 text-[#F5C84C]">
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                              <Star
                                key={starIndex}
                                className={`h-4 w-4 ${
                                  starIndex < rating ? "fill-current" : ""
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <h3 className="mt-5 text-lg font-extrabold text-white">
                        {comment
                          ? getReviewTitle(comment)
                          : "Відгук про компанію"}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#8EA0BA]">
                        {comment || "Коментар не додано."}
                      </p>
                      <p className="mt-5 text-sm text-[#6B7D99]">
                        {formatLongDate(
                          review.createdAtUtc ?? review.CreatedAtUtc,
                        )}
                      </p>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-[#1E3151] bg-[#0F1D36] px-6 py-14 text-center">
                <p className="text-sm font-semibold text-[#D7E1EF]">
                  {ratingFilter === "all"
                    ? "Відгуків поки немає"
                    : "Немає відгуків з таким рейтингом"}
                </p>
              </div>
            )}

            {filteredReviews.length > REVIEWS_PER_PAGE && (
              <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-[#8EA0BA]">
                  Сторінка {currentPage} з {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    disabled={currentPage === 1}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[#1E3151] text-[#8EA0BA] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={`grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-semibold transition-colors ${
                          currentPage === pageNumber
                            ? "bg-[#3B82F6] text-white"
                            : "border border-[#1E3151] text-[#8EA0BA] hover:text-white"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      setPage((value) => Math.min(totalPages, value + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[#1E3151] text-[#8EA0BA] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function getInitial(value?: string | null) {
  return value?.trim().slice(0, 1).toUpperCase() || "K";
}

function getAverageRating(reviews: CompanyRatingRead[]) {
  if (!reviews.length) return "0.0";

  const total = reviews.reduce(
    (sum, review) => sum + normalizeRating(review.rating ?? review.Rating),
    0,
  );

  return (total / reviews.length).toFixed(1);
}

function getRatingDistribution(reviews: CompanyRatingRead[]) {
  return reviews.reduce<Record<number, number>>(
    (distribution, review) => {
      const rating = normalizeRating(review.rating ?? review.Rating);
      distribution[rating] += 1;
      return distribution;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  );
}

function normalizeRating(value?: number | null) {
  return Math.min(5, Math.max(1, Math.round(Number(value) || 0)));
}

function formatRatingNumber(value: number) {
  return new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function getReviewTitle(comment: string) {
  const text = comment.trim();
  if (!text) return "Відгук про компанію";

  const firstSentence = text.split(/(?<=[.!?])\s+/)[0] ?? text;
  return firstSentence.length > 72
    ? `${firstSentence.slice(0, 72).trim()}...`
    : firstSentence;
}

function shortName(value?: string | null) {
  const parts = value?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (!parts.length) return "Співробітник";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function initials(value?: string | null) {
  return (
    value
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "OK"
  );
}

function formatLongDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
