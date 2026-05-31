import {
  BriefcaseBusiness,
  Camera,
  ExternalLink,
  Link as LinkIcon,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  UsersRound,
  Upload,
} from "lucide-react";
import {
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import CompanyEmployees from "../components/CompanyView/CompanyEmployees";
import CompanyReviews from "../components/CompanyView/CompanyReviews";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  hiredInApi,
  type CompanyMemberRead,
  type CompanyRead,
  type VacancyRead,
} from "../services/hiredInApi";

type EditableBlock = "hero" | "about" | "facts" | null;

type CompanyForm = {
  name: string;
  description: string;
  industry: string;
  city: string;
  website: string;
  logoUrl: string;
  status: string | number | null;
};

const companyToForm = (company?: CompanyRead | null): CompanyForm => ({
  name: company?.name ?? "",
  description: company?.description ?? "",
  industry: company?.industry ?? "",
  city: company?.city ?? "",
  website: company?.website ?? "",
  logoUrl: company?.logoUrl ?? "",
  status: company?.status ?? null,
});

export default function CompanyCabinetView() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeBlock, setActiveBlock] = useState<EditableBlock>(null);
  const [company, setCompany] = useState<CompanyRead | null>(null);
  const [companyForm, setCompanyForm] = useState<CompanyForm>(companyToForm());
  const [vacancies, setVacancies] = useState<VacancyRead[]>([]);
  const [members, setMembers] = useState<CompanyMemberRead[]>([]);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const aboutRef = useRef<HTMLElement>(null);
  const vacanciesRef = useRef<HTMLElement>(null);
  const reviewsRef = useRef<HTMLElement>(null);
  const employeesRef = useRef<HTMLDivElement>(null);

  const companyRating = getCompanyRating(company);
  const employeesCount = getEmployeesCount(company, members);

  const scrollToSection = (section: RefObject<Element | null>) => {
    section.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      hiredInApi.getMyCompany().catch(() => null),
      hiredInApi.getMyVacancies().catch(() => []),
      hiredInApi.getCompanyMembers().catch(() => []),
    ]).then(([companyData, vacancyItems, companyMembers]) => {
      if (!isMounted) return;
      setCompany(companyData);
      setCompanyForm(companyToForm(companyData));
      setVacancies(vacancyItems ?? []);
      setMembers(companyMembers ?? []);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateCompanyField = (field: keyof CompanyForm, value: string) => {
    setSaveState("idle");
    setCompanyForm((current) => ({ ...current, [field]: value }));
  };

  const saveCompany = async () => {
    setSaveState("saving");
    try {
      await hiredInApi.updateMyCompany({
        name: companyForm.name,
        description: companyForm.description,
        industry: companyForm.industry,
        city: companyForm.city,
        website: companyForm.website,
        logoUrl: companyForm.logoUrl || null,
        status: companyForm.status,
      });
      setCompany((current) => ({
        id: current?.id ?? company?.id ?? "",
        name: companyForm.name,
        description: companyForm.description,
        industry: companyForm.industry,
        city: companyForm.city,
        website: companyForm.website,
        logoUrl: companyForm.logoUrl,
        status: companyForm.status,
      }));
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  };

  const uploadCompanyLogo = async (file: File) => {
    const companyId = company?.id;
    if (!companyId) {
      setSaveState("error");
      return;
    }

    setIsLogoUploading(true);
    setSaveState("idle");

    try {
      const logoUrl = await hiredInApi.uploadCompanyLogo(companyId, file);
      setCompanyForm((current) => ({ ...current, logoUrl }));
      setCompany((current) => (current ? { ...current, logoUrl } : current));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    } finally {
      setIsLogoUploading(false);
    }
  };

  const closeBlock = async () => {
    if (activeBlock) {
      const saved = await saveCompany();
      if (!saved) return;
    }
    setActiveBlock(null);
  };

  const togglePageEdit = async () => {
    if (isEditing) {
      const saved = await saveCompany();
      if (!saved) return;
      setActiveBlock(null);
      setIsEditing(false);
      return;
    }
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-[#081426] text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8 lg:px-[80px]">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-base font-bold text-[#D7E1EF]">
            Сторінка компанії
          </h1>
          <button
            type="button"
            onClick={togglePageEdit}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-7 text-sm font-bold text-white shadow-[0_16px_32px_-18px_rgba(59,130,246,0.95)] transition-colors hover:bg-[#2563EB]"
          >
            {isEditing ? (
              <Upload className="h-4 w-4" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
            {isEditing ? "Опублікувати зміни" : "Змінити"}
          </button>
        </section>

        {saveState === "saved" && (
          <p className="mt-4 text-sm font-semibold text-emerald-400">
            Зміни компанії збережено.
          </p>
        )}
        {saveState === "error" && (
          <p className="mt-4 text-sm font-semibold text-red-400">
            Не вдалося зберегти компанію. Перевір авторизацію або спробуй ще
            раз.
          </p>
        )}

        <section className="relative mt-10 overflow-hidden rounded-2xl border border-[#1E3151] bg-[#0F1D36]">
          {activeBlock === "hero" ? (
            <>
              <SaveButton onClick={closeBlock} />
              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                  <Logo
                    className="h-24 w-24 text-5xl sm:h-28 sm:w-28"
                    fallback={getInitial(companyForm.name)}
                    logoUrl={companyForm.logoUrl}
                    editable
                    isUploading={isLogoUploading}
                    onLogoChange={uploadCompanyLogo}
                  />
                  <div className="min-w-0 flex-1 pr-0 sm:pr-40">
                    <input
                      value={companyForm.name}
                      onChange={(event) =>
                        updateCompanyField("name", event.target.value)
                      }
                      className="w-full rounded-xl border border-[#1E3151] bg-[#0A1628] px-4 py-3 text-3xl font-extrabold leading-tight text-white outline-none transition-colors focus:border-blue-500 sm:text-4xl"
                      placeholder="Назва компанії"
                    />
                    <textarea
                      value={companyForm.description}
                      onChange={(event) =>
                        updateCompanyField("description", event.target.value)
                      }
                      className="mt-6 min-h-[120px] w-full max-w-5xl resize-y rounded-xl border border-[#1E3151] bg-[#0A1628] p-4 text-base leading-7 text-[#D7E1EF] outline-none transition-colors focus:border-blue-500"
                      placeholder="Короткий опис компанії"
                    />
                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-[#D7E1EF]">
                      <label className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#8EA0BA]" />
                        <input
                          value={companyForm.city}
                          onChange={(event) =>
                            updateCompanyField("city", event.target.value)
                          }
                          className="h-10 rounded-lg border border-[#1E3151] bg-[#0A1628] px-3 text-sm text-white outline-none focus:border-blue-500"
                          placeholder="Київ, Україна"
                        />
                      </label>
                      <label className="inline-flex items-center gap-2 text-[#60A5FA]">
                        <LinkIcon className="h-4 w-4" />
                        <input
                          value={companyForm.website}
                          onChange={(event) =>
                            updateCompanyField("website", event.target.value)
                          }
                          className="h-10 rounded-lg border border-[#1E3151] bg-[#0A1628] px-3 text-sm text-white outline-none focus:border-blue-500"
                          placeholder="company.ua"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {isEditing && (
                <EditBlockButton onClick={() => setActiveBlock("hero")} />
              )}
              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(59,130,246,0.16),transparent_36%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
                  <Logo
                    className="h-24 w-24 text-5xl sm:h-28 sm:w-28"
                    fallback={getInitial(companyForm.name)}
                    logoUrl={companyForm.logoUrl}
                    editable={isEditing}
                    isUploading={isLogoUploading}
                    onLogoChange={uploadCompanyLogo}
                  />
                  <div className="min-w-0 pr-0 sm:pr-40">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                        {companyForm.name || "Компанія"}
                      </h2>
                      <ExternalLink className="h-5 w-5 text-[#7F90AA]" />
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3 text-sm text-[#8EA0BA]">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {companyForm.city || "Локація не вказана"}
                      </span>
                      {companyForm.website && (
                        <span className="inline-flex items-center gap-2 text-[#60A5FA]">
                          <LinkIcon className="h-4 w-4" />
                          {companyForm.website}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <StatCard
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            value={vacancies.length}
            label="відкритих вакансій"
            iconClass="bg-[#14345F] text-[#60A5FA]"
          />

          <StatCard
            icon={<Star className="h-5 w-5" />}
            value={companyRating}
            label="рейтинг від команди"
            iconClass="bg-emerald-400/10 text-emerald-400"
            valueClass="text-emerald-400"
          />

          <StatCard
            icon={<UsersRound className="h-5 w-5" />}
            value={employeesCount}
            label="співробітників"
            iconClass="bg-emerald-400/10 text-emerald-400"
            valueClass="text-emerald-400"
          />
        </section>

        <nav className="mt-8 flex gap-6 overflow-x-auto pb-2 text-sm font-semibold text-[#7F90AA]">
          <button
            onClick={() => scrollToSection(aboutRef)}
            className="shrink-0 text-white"
          >
            Про компанію
          </button>
          <button
            onClick={() => scrollToSection(vacanciesRef)}
            className="shrink-0"
          >
            Вакансії {vacancies.length}
          </button>
          <button
            onClick={() => scrollToSection(reviewsRef)}
            className="shrink-0"
          >
            Відгуки
          </button>
          <button
            onClick={() => scrollToSection(employeesRef)}
            className="shrink-0"
          >
            Співробітники
          </button>
        </nav>

        <section
          ref={aboutRef}
          className="mt-8 grid scroll-mt-24 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
        >
          <article className="relative rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 sm:p-8">
            {activeBlock === "about" ? (
              <>
                <SaveButton onClick={closeBlock} />
                <h2 className="text-xl font-extrabold">Про компанію</h2>
                <textarea
                  value={companyForm.description}
                  onChange={(event) =>
                    updateCompanyField("description", event.target.value)
                  }
                  className="mt-10 min-h-[260px] w-full resize-y rounded-xl border border-[#1E3151] bg-[#0A1628] p-4 text-base leading-8 text-[#D7E1EF] outline-none transition-colors focus:border-blue-500"
                  placeholder="Детально опишіть компанію."
                />
              </>
            ) : (
              <>
                {isEditing && (
                  <EditBlockButton onClick={() => setActiveBlock("about")} />
                )}
                <h2 className="text-xl font-extrabold">Про компанію</h2>
                <p className="mt-8 whitespace-pre-line text-sm leading-7 text-[#D7E1EF] sm:text-base">
                  {companyForm.description || "Опис компанії ще не додано."}
                </p>
              </>
            )}
          </article>

          <aside className="relative rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 sm:p-8 lg:self-start">
            {activeBlock === "facts" ? (
              <>
                <SaveButton onClick={closeBlock} />
                <h2 className="text-lg font-extrabold">Ключові факти</h2>
                <FactsEditor
                  companyForm={companyForm}
                  updateCompanyField={updateCompanyField}
                />
              </>
            ) : (
              <>
                {isEditing && (
                  <EditBlockButton onClick={() => setActiveBlock("facts")} />
                )}
                <h2 className="text-lg font-extrabold">Ключові факти</h2>
                <FactsView companyForm={companyForm} />
              </>
            )}
          </aside>
        </section>

        <section
          ref={vacanciesRef}
          className="mt-10 scroll-mt-24 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-8"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-extrabold">
              Відкриті вакансії · {vacancies.length}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              {vacancies.length > 0 && (
                <Link
                  to="/company-vacancies"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#60A5FA]"
                >
                  Показати всі
                </Link>
              )}
              <Link
                to="/companyVacancies"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#3B82F6] px-4 text-sm font-extrabold text-white transition-colors hover:bg-[#2563EB]"
              >
                <Plus className="h-4 w-4" />
                Додати вакансію
              </Link>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {vacancies.length > 0 ? (
              vacancies.slice(0, 3).map((vacancy) => (
                <Link
                  key={vacancy.id}
                  to={`/company-vacancy-detail?vacancyId=${vacancy.id}`}
                  className="flex flex-col gap-3 rounded-xl bg-[#0A1628] px-4 py-4 transition-colors hover:bg-[#10203A] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-bold text-white">
                      {vacancy.title || "Вакансія"}
                    </h3>
                    <p className="mt-1 text-sm text-[#7F90AA]">
                      {[
                        vacancy.city,
                        vacancy.workFormat,
                        vacancy.employmentType,
                      ]
                        .filter(Boolean)
                        .map(String)
                        .join(" · ") || "Деталі не вказано"}
                    </p>
                  </div>
                  {(vacancy.salaryMin || vacancy.salaryMax) && (
                    <span className="w-fit rounded-lg bg-[#F5C84C]/10 px-3 py-1 text-sm font-extrabold text-[#F5C84C]">
                      {formatSalary(vacancy.salaryMin, vacancy.salaryMax)}
                    </span>
                  )}
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#1E3151] px-5 py-8 text-center text-sm text-[#8EA0BA]">
                Вакансій поки немає.
              </div>
            )}
          </div>
        </section>

        <section ref={reviewsRef} className="mt-10 scroll-mt-24">
          <CompanyReviews isOwnProfile />
        </section>

        <div ref={employeesRef} className="mt-10 scroll-mt-24">
          <CompanyEmployees
            companyId={company?.id}
            company={company}
            members={members}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  iconClass,
  valueClass = "text-white",
}: {
  icon: ReactNode;
  value: string | number;
  label: string;
  iconClass: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6">
      <div
        className={`grid h-10 w-10 place-items-center rounded-lg ${iconClass}`}
      >
        {icon}
      </div>

      <div className={`mt-5 text-4xl font-extrabold ${valueClass}`}>
        {value}
      </div>

      <p className="mt-3 text-sm text-[#7F90AA]">{label}</p>
    </div>
  );
}

function getCompanyRating(company: CompanyRead | null) {
  const source = company as
    | (CompanyRead & {
        rating?: number | string | null;
        averageRating?: number | string | null;
        avgRating?: number | string | null;
      })
    | null;

  const rating =
    source?.averageRating ?? source?.avgRating ?? source?.rating ?? null;

  if (rating == null || rating === "") {
    return "—";
  }

  const numericRating = Number(rating);

  if (Number.isNaN(numericRating)) {
    return String(rating);
  }

  return numericRating.toFixed(1);
}

function getEmployeesCount(
  company: CompanyRead | null,
  members: CompanyMemberRead[],
) {
  const source = company as
    | (CompanyRead & {
        employeesCount?: number | string | null;
        employeeCount?: number | string | null;
        teamSize?: number | string | null;
      })
    | null;

  const count =
    source?.employeesCount ??
    source?.employeeCount ??
    source?.teamSize ??
    members.length;

  const numericCount = Number(count);

  if (Number.isNaN(numericCount)) {
    return count || "—";
  }

  if (numericCount >= 1000) {
    return `+${Math.round(numericCount / 1000)}k`;
  }

  return numericCount;
}

function Logo({
  className = "",
  fallback = "K",
  logoUrl,
  editable = false,
  isUploading = false,
  onLogoChange,
}: {
  className?: string;
  fallback?: string;
  logoUrl?: string | null;
  editable?: boolean;
  isUploading?: boolean;
  onLogoChange?: (file: File) => void;
}) {
  const inputId = useId();

  return (
    <div
      className={`group relative grid place-items-center overflow-hidden rounded-2xl bg-black font-extrabold text-white shadow-[0_18px_34px_-18px_rgba(147,197,253,0.95)] ${className}`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Логотип компанії"
          className="h-full w-full object-cover"
        />
      ) : (
        fallback
      )}
      {editable && (
        <>
          <input
            id={inputId}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            disabled={isUploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onLogoChange?.(file);
              event.target.value = "";
            }}
          />
          <label
            htmlFor={inputId}
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/45 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
            title="Змінити логотип"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
          </label>
        </>
      )}
    </div>
  );
}

function EditBlockButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-4 top-4 z-20 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#1B3155] px-3 text-xs font-bold text-[#60A5FA] transition-colors hover:bg-[#23416F]"
    >
      <Pencil className="h-3.5 w-3.5" />
      Редагувати блок
    </button>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-4 top-4 z-20 inline-flex h-9 min-w-32 items-center justify-center rounded-lg bg-[#1D3152] px-5 text-sm font-medium text-[#60A5FA] transition-colors hover:bg-[#27436D]"
    >
      Зберегти
    </button>
  );
}

function FactsView({ companyForm }: { companyForm: CompanyForm }) {
  const facts = [
    ["Індустрія", companyForm.industry],
    ["Локація", companyForm.city],
    ["Сайт", companyForm.website],
  ].filter(([, value]) => Boolean(value));

  if (!facts.length) {
    return (
      <p className="mt-8 text-sm leading-6 text-[#8EA0BA]">
        Ключові факти ще не заповнено.
      </p>
    );
  }

  return (
    <dl className="mt-6 space-y-5 text-sm">
      {facts.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4">
          <dt className="text-[#7F90AA]">{label}</dt>
          <dd className="text-right font-bold text-white">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function FactsEditor({
  companyForm,
  updateCompanyField,
}: {
  companyForm: CompanyForm;
  updateCompanyField: (field: keyof CompanyForm, value: string) => void;
}) {
  return (
    <div className="mt-6 space-y-4 text-sm">
      <label className="block">
        <span className="text-[#7F90AA]">Індустрія</span>
        <input
          value={companyForm.industry}
          onChange={(event) =>
            updateCompanyField("industry", event.target.value)
          }
          className="mt-2 h-10 w-full rounded-lg border border-[#1E3151] bg-[#0A1628] px-3 text-sm text-white outline-none focus:border-blue-500"
          placeholder="Fintech"
        />
      </label>
      <label className="block">
        <span className="text-[#7F90AA]">Локація</span>
        <input
          value={companyForm.city}
          onChange={(event) => updateCompanyField("city", event.target.value)}
          className="mt-2 h-10 w-full rounded-lg border border-[#1E3151] bg-[#0A1628] px-3 text-sm text-white outline-none focus:border-blue-500"
          placeholder="Київ"
        />
      </label>
      <label className="block">
        <span className="text-[#7F90AA]">Сайт</span>
        <input
          value={companyForm.website}
          onChange={(event) =>
            updateCompanyField("website", event.target.value)
          }
          className="mt-2 h-10 w-full rounded-lg border border-[#1E3151] bg-[#0A1628] px-3 text-sm text-white outline-none focus:border-blue-500"
          placeholder="company.ua"
        />
      </label>
    </div>
  );
}

function getInitial(value: string) {
  return value.trim().slice(0, 1).toUpperCase() || "K";
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
