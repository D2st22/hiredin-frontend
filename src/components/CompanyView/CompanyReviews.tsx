import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { CompanyRatingRead } from "../../services/hiredInApi";

interface CompanyReviewsProps {
  isOwnProfile?: boolean;
  reviews?: CompanyRatingRead[];
  companyId?: string | null;
}

export default function CompanyReviews({
  isOwnProfile = false,
  reviews = [],
  companyId,
}: CompanyReviewsProps) {
  const averageRating = getAverageRating(reviews);
  const distribution = getRatingDistribution(reviews);
  const roundedAverage = Math.round(Number(averageRating));

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[22px] font-extrabold leading-tight text-white">
          Відгуки співробітників
        </h2>
        {!isOwnProfile && reviews.length > 0 && (
          <Link
            to={
              companyId
                ? `/company-reviews?companyId=${companyId}`
                : "/company-reviews"
            }
            className="inline-flex items-center gap-2 text-sm font-bold text-[#60A5FA] transition hover:text-[#93C5FD]"
          >
            Всі {reviews.length} відгуків →
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-stretch">
        <aside className="flex min-h-[430px] flex-col rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 lg:h-full">
          <div className="flex items-end gap-2">
            <span className="text-[56px] font-extrabold leading-none text-white">
              {averageRating}
            </span>
            <span className="pb-2 text-sm font-semibold text-[#8EA0BA]">/ 5</span>
          </div>

          <div className="mt-4 flex gap-1 text-[#F5C84C]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${
                  index < roundedAverage ? "fill-current" : ""
                }`}
              />
            ))}
          </div>

          <p className="mt-4 text-sm text-[#7F90AA]">
            На основі {reviews.length} відгуків
          </p>

          <div className="mt-6 space-y-3">
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
                      width: `${reviews.length ? (distribution[rating] / reviews.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-right">{distribution[rating]}</span>
              </div>
            ))}
          </div>
        </aside>

        {reviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.slice(0, 4).map((review) => (
              <article
                key={review.id}
                className="flex min-h-[198px] flex-col justify-between rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6"
              >
                <div>
                  <h3 className="line-clamp-1 text-base font-extrabold text-white">
                    {review.comment ?? review.Comment
                      ? getReviewTitle(review.comment ?? review.Comment)
                      : "Відгук про компанію"}
                  </h3>
                  <p className="mt-6 line-clamp-3 text-sm leading-6 text-[#8EA0BA]">
                    {review.comment ?? review.Comment ?? "Коментар не додано."}
                  </p>
                </div>

                <div className="mt-8 flex items-end justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#3B82F6] text-xs font-extrabold text-white">
                      {initials(review.fullName ?? review.FullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {review.fullName ?? review.FullName ?? "Співробітник"}
                      </p>
                      <p className="truncate text-xs text-[#6B7D99]">
                        {formatDate(review.createdAtUtc ?? review.CreatedAtUtc)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-1 text-[#F5C84C]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < normalizeRating(review.rating ?? review.Rating)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#1E3151] px-5 py-12 text-center">
            <p className="text-sm font-semibold text-[#D7E1EF]">
              Відгуків поки немає
            </p>
          </div>
        )}
      </div>
    </section>
  );
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

function getReviewTitle(comment?: string | null) {
  const text = comment?.trim() ?? "";
  if (!text) return "Відгук про компанію";

  return text.length > 36 ? `${text.slice(0, 36).trim()}...` : text;
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

function formatDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
