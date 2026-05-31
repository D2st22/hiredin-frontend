import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import {
  type AdminCompanyRatingRead,
  type AdminStatisticsRead,
  type AdminUserRead,
  type CompanyRead,
  hiredInApi,
  type SkillRead,
  type VacancyRead,
} from "../services/hiredInApi";
import {
  CompanyStatus,
  UserRole,
  UserStatus,
  VacancyStatus,
} from "../services/hiredInTypes";

type AdminTab =
  | "overview"
  | "users"
  | "companies"
  | "vacancies"
  | "skills"
  | "ratings";

const tabs: Array<{ id: AdminTab; label: string }> = [
  { id: "overview", label: "Огляд" },
  { id: "users", label: "Користувачі" },
  { id: "companies", label: "Компанії" },
  { id: "vacancies", label: "Вакансії" },
  { id: "skills", label: "Навички" },
  { id: "ratings", label: "Відгуки" },
];

const userStatusOptions = [
  { value: UserStatus.Active, label: "Активний" },
  { value: UserStatus.Blocked, label: "Заблокований" },
  { value: UserStatus.Deleted, label: "Видалений" },
];

const companyStatusOptions = [
  { value: CompanyStatus.Pending, label: "На перевірці" },
  { value: CompanyStatus.Active, label: "Активна" },
  { value: CompanyStatus.Blocked, label: "Заблокована" },
  { value: CompanyStatus.Archived, label: "Архівна" },
];

const companyStatusNumbers: Record<string, number> = {
  pending: CompanyStatus.Pending,
  active: CompanyStatus.Active,
  blocked: CompanyStatus.Blocked,
  archived: CompanyStatus.Archived,
};

const vacancyStatusOptions = [
  { value: VacancyStatus.Draft, label: "Чернетка" },
  { value: VacancyStatus.Published, label: "Опублікована" },
  { value: VacancyStatus.Archived, label: "Архівна" },
  { value: VacancyStatus.Closed, label: "Закрита" },
];

const vacancyStatusNumbers: Record<string, number> = {
  draft: VacancyStatus.Draft,
  published: VacancyStatus.Published,
  archived: VacancyStatus.Archived,
  closed: VacancyStatus.Closed,
};

const userStatusNumbers: Record<string, number> = {
  active: UserStatus.Active,
  blocked: UserStatus.Blocked,
  deleted: UserStatus.Deleted,
};

const roleLabels: Record<number, string> = {
  [UserRole.Candidate]: "Кандидат",
  [UserRole.Employer]: "Роботодавець",
  [UserRole.Admin]: "Адмін",
};

export default function AdminDashboardView() {
  const { isAuthenticated, role } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [statistics, setStatistics] = useState<AdminStatisticsRead | null>(
    null,
  );
  const [users, setUsers] = useState<AdminUserRead[]>([]);
  const [companies, setCompanies] = useState<CompanyRead[]>([]);
  const [vacancies, setVacancies] = useState<VacancyRead[]>([]);
  const [skills, setSkills] = useState<SkillRead[]>([]);
  const [ratings, setRatings] = useState<AdminCompanyRatingRead[]>([]);
  const [skillName, setSkillName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated || role !== UserRole.Admin) return;

    let ignore = false;
    setIsLoading(true);
    setMessage("");

    Promise.all([
      hiredInApi.getAdminStatistics(),
      hiredInApi.getAdminUsers(),
      hiredInApi.getAdminCompanies(),
      hiredInApi.getAdminVacancies(),
      hiredInApi.getSkills(),
      hiredInApi.getAdminCompanyRatings(),
    ])
      .then(([statsData, userData, companyData, vacancyData, skillData, ratingData]) => {
        if (ignore) return;
        setStatistics(statsData);
        setUsers(userData);
        setCompanies(companyData);
        setVacancies(vacancyData);
        setSkills(skillData);
        setRatings(ratingData);
      })
      .catch((error) => {
        if (!ignore) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Не вдалося завантажити адмін-панель.",
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, role]);

  const statCards = useMemo(() => {
    if (!statistics) return [];

    return [
      {
        label: "Користувачі",
        value: statistics.totalUsers,
        detail: `${statistics.activeUsers} активних`,
      },
      {
        label: "Компанії",
        value: statistics.totalCompanies,
        detail: `${statistics.pendingCompanies} на перевірці`,
      },
      {
        label: "Вакансії",
        value: statistics.totalVacancies,
        detail: `${statistics.publishedVacancies} опублікованих`,
      },
      {
        label: "Відгуки",
        value: statistics.totalCompanyRatings,
        detail: `${statistics.totalApplications} заявок`,
      },
    ];
  }, [statistics]);

  if (!isAuthenticated) {
    return <Navigate to="/candidateLogin" replace />;
  }

  if (role !== UserRole.Admin) {
    return <Navigate to="/home" replace />;
  }

  async function updateUserStatus(userId: string, status: number) {
    await runAction("Статус користувача оновлено.", async () => {
      await hiredInApi.updateAdminUserStatus(userId, status);
      setUsers((current) =>
        current.map((user) =>
          user.id === userId
            ? { ...user, userStatus: status, UserStatus: status }
            : user,
        ),
      );
    });
  }

  async function deleteUser(userId: string) {
    if (!confirm("Видалити цього користувача?")) return;

    await runAction("Користувача видалено.", async () => {
      await hiredInApi.deleteAdminUser(userId);
      setUsers((current) => current.filter((user) => user.id !== userId));
    });
  }

  async function updateCompanyStatus(companyId: string, status: number) {
    await runAction("Статус компанії оновлено.", async () => {
      await hiredInApi.updateAdminCompanyStatus(companyId, status);
      setCompanies((current) =>
        current.map((company) =>
          company.id === companyId ? { ...company, status } : company,
        ),
      );
    });
  }

  async function deleteCompany(companyId: string) {
    if (!confirm("Видалити цю компанію?")) return;

    await runAction("Компанію видалено.", async () => {
      await hiredInApi.deleteAdminCompany(companyId);
      setCompanies((current) =>
        current.filter((company) => company.id !== companyId),
      );
    });
  }

  async function updateVacancyStatus(vacancyId: string, status: number) {
    await runAction("Статус вакансії оновлено.", async () => {
      await hiredInApi.updateAdminVacancyStatus(vacancyId, status);
      setVacancies((current) =>
        current.map((vacancy) =>
          vacancy.id === vacancyId ? { ...vacancy, status } : vacancy,
        ),
      );
    });
  }

  async function deleteVacancy(vacancyId: string) {
    if (!confirm("Видалити цю вакансію?")) return;

    await runAction("Вакансію видалено.", async () => {
      await hiredInApi.deleteAdminVacancy(vacancyId);
      setVacancies((current) =>
        current.filter((vacancy) => vacancy.id !== vacancyId),
      );
    });
  }

  async function createSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = skillName.trim();
    if (!name) {
      setActionMessage("Введи назву навички.");
      return;
    }

    await runAction("Навичку створено.", async () => {
      const createdSkill = await hiredInApi.createSkill({ name });
      setSkills((current) => {
        const createdId = createdSkill.id ?? createdSkill.Id;
        if (createdId && current.some((skill) => (skill.id ?? skill.Id) === createdId)) {
          return current;
        }

        return [...current, createdSkill].sort((left, right) =>
          getSkillName(left).localeCompare(getSkillName(right), "uk"),
        );
      });
      setSkillName("");
    });
  }

  async function deleteSkill(skillId: string) {
    if (!confirm("Видалити цю навичку?")) return;

    await runAction("Навичку видалено.", async () => {
      await hiredInApi.deleteSkill(skillId);
      setSkills((current) =>
        current.filter((skill) => (skill.id ?? skill.Id) !== skillId),
      );
    });
  }

  async function deleteRating(ratingId: string) {
    if (!confirm("Видалити цей відгук?")) return;

    await runAction("Відгук видалено.", async () => {
      await hiredInApi.deleteAdminCompanyRating(ratingId);
      setRatings((current) =>
        current.filter((rating) => rating.id !== ratingId),
      );
    });
  }

  async function runAction(
    successMessage: string,
    action: () => Promise<void>,
  ) {
    setActionMessage("");

    try {
      await action();
      setActionMessage(successMessage);
      const stats = await hiredInApi.getAdminStatistics().catch(() => null);
      if (stats) setStatistics(stats);
    } catch (error) {
      setActionMessage(
        error instanceof Error ? error.message : "Не вдалося виконати дію.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <Header />
      <main className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 sm:px-8 lg:px-[80px]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-[#F5C84C]">
              Адміністрування
            </p>
            <h1 className="mt-2 text-3xl font-bold">Панель керування</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#8FA1BB]">
              Керування користувачами, компаніями, вакансіями та відгуками.
            </p>
          </div>
        </div>

        {message && <Notice tone="error" text={message} />}
        {actionMessage && <Notice tone="info" text={actionMessage} />}

        <div className="grid gap-4 md:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-[#1E3151] bg-[#0F1D36] p-5"
            >
              <p className="text-sm text-[#8FA1BB]">{card.label}</p>
              <p className="mt-2 text-3xl font-bold">
                {card.value.toLocaleString("uk-UA")}
              </p>
              <p className="mt-1 text-sm text-[#F5C84C]">{card.detail}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[#1E3151] pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`h-10 rounded-lg px-4 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-[#3B82F6] text-white"
                  : "bg-[#0F1D36] text-[#A8B6CD] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-[#1E3151] bg-[#0F1D36] p-6 text-[#A8B6CD]">
            Завантажуємо дані...
          </div>
        ) : (
          <>
            {activeTab === "overview" && <Overview statistics={statistics} />}
            {activeTab === "users" && (
              <UsersTable
                users={users}
                onStatusChange={updateUserStatus}
                onDelete={deleteUser}
              />
            )}
            {activeTab === "companies" && (
              <CompaniesTable
                companies={companies}
                onStatusChange={updateCompanyStatus}
                onDelete={deleteCompany}
              />
            )}
            {activeTab === "vacancies" && (
              <VacanciesTable
                vacancies={vacancies}
                onStatusChange={updateVacancyStatus}
                onDelete={deleteVacancy}
              />
            )}
            {activeTab === "skills" && (
              <SkillsPanel
                skills={skills}
                skillName={skillName}
                onSkillNameChange={setSkillName}
                onCreateSkill={createSkill}
                onDeleteSkill={deleteSkill}
              />
            )}
            {activeTab === "ratings" && (
              <RatingsTable ratings={ratings} onDelete={deleteRating} />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Overview({ statistics }: { statistics: AdminStatisticsRead | null }) {
  if (!statistics) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <MetricGroup
        title="Користувачі"
        items={[
          ["Активні", statistics.activeUsers],
          ["Заблоковані", statistics.blockedUsers],
          ["Видалені", statistics.deletedUsers],
        ]}
      />
      <MetricGroup
        title="Компанії"
        items={[
          ["На перевірці", statistics.pendingCompanies],
          ["Активні", statistics.activeCompanies],
          ["Заблоковані", statistics.blockedCompanies],
          ["Архівні", statistics.archivedCompanies],
        ]}
      />
      <MetricGroup
        title="Вакансії"
        items={[
          ["Чернетки", statistics.draftVacancies],
          ["Опубліковані", statistics.publishedVacancies],
          ["Архівні", statistics.archivedVacancies],
          ["Закриті", statistics.closedVacancies],
        ]}
      />
    </div>
  );
}

function UsersTable({
  users,
  onStatusChange,
  onDelete,
}: {
  users: AdminUserRead[];
  onStatusChange: (id: string, status: number) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <AdminTable
      emptyText="Користувачів не знайдено."
      headers={["Користувач", "Роль", "Статус", "Дія"]}
      rows={users.map((user) => {
        const role = numberValue(user.userRole ?? user.UserRole);
        const status = statusNumber(
          user.userStatus ?? user.UserStatus,
          userStatusNumbers,
          UserStatus.Active,
        );
        const name =
          `${user.firstName ?? user.FirstName ?? ""} ${user.lastName ?? user.LastName ?? ""}`.trim();

        return [
          <CellTitle
            key="user"
            title={name || user.email || user.Email || "Користувач"}
            subtitle={
              user.email ??
              user.Email ??
              user.phoneNumber ??
              user.PhoneNumber ??
              ""
            }
          />,
          roleLabels[role] ?? "Роль не вказана",
          <StatusSelect
            key="status"
            value={status}
            options={userStatusOptions}
            onChange={(nextStatus) => onStatusChange(user.id, nextStatus)}
          />,
          <DangerButton
            key="delete"
            onClick={() => onDelete(user.id)}
            label="Видалити"
          />,
        ];
      })}
    />
  );
}

function CompaniesTable({
  companies,
  onStatusChange,
  onDelete,
}: {
  companies: CompanyRead[];
  onStatusChange: (id: string, status: number) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <AdminTable
      emptyText="Компаній не знайдено."
      headers={["Компанія", "Індустрія", "Статус", "Дія"]}
      rows={companies.map((company) => [
        <CellTitle
          key="company"
          title={company.name}
          subtitle={company.city ?? company.website ?? ""}
        />,
        company.industry ?? "Не вказано",
        <StatusSelect
          key="status"
          value={statusNumber(
            company.status,
            companyStatusNumbers,
            CompanyStatus.Pending,
          )}
          options={companyStatusOptions}
          onChange={(status) => onStatusChange(company.id, status)}
        />,
        <DangerButton
          key="delete"
          onClick={() => onDelete(company.id)}
          label="Видалити"
        />,
      ])}
    />
  );
}

function VacanciesTable({
  vacancies,
  onStatusChange,
  onDelete,
}: {
  vacancies: VacancyRead[];
  onStatusChange: (id: string, status: number) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <AdminTable
      emptyText="Вакансій не знайдено."
      headers={["Вакансія", "Компанія", "Статус", "Дія"]}
      rows={vacancies.map((vacancy) => [
        <CellTitle
          key="vacancy"
          title={vacancy.title ?? "Вакансія"}
          subtitle={formatSalary(vacancy)}
        />,
        vacancy.companyName ?? vacancy.city ?? "Не вказано",
        <StatusSelect
          key="status"
          value={statusNumber(
            vacancy.status,
            vacancyStatusNumbers,
            VacancyStatus.Published,
          )}
          options={vacancyStatusOptions}
          onChange={(status) => onStatusChange(vacancy.id, status)}
        />,
        <DangerButton
          key="delete"
          onClick={() => onDelete(vacancy.id)}
          label="Видалити"
        />,
      ])}
    />
  );
}

function SkillsPanel({
  skills,
  skillName,
  onSkillNameChange,
  onCreateSkill,
  onDeleteSkill,
}: {
  skills: SkillRead[];
  skillName: string;
  onSkillNameChange: (value: string) => void;
  onCreateSkill: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteSkill: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <form
        onSubmit={onCreateSkill}
        className="flex flex-col gap-3 rounded-xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:flex-row"
      >
        <input
          value={skillName}
          onChange={(event) => onSkillNameChange(event.target.value)}
          placeholder="Назва навички"
          className="h-11 flex-1 rounded-lg border border-[#1E3151] bg-[#0A1628] px-4 text-sm font-semibold text-white outline-none placeholder:text-[#8FA1BB] focus:border-[#3B82F6]"
        />
        <button
          type="submit"
          className="h-11 rounded-lg bg-[#3B82F6] px-5 text-sm font-bold text-white transition-colors hover:bg-[#2563EB]"
        >
          Створити
        </button>
      </form>

      <AdminTable
        emptyText="Навичок не знайдено."
        headers={["Навичка", "Дія"]}
        rows={skills.map((skill) => {
          const skillId = skill.id ?? skill.Id;

          return [
            <CellTitle key="skill" title={getSkillName(skill)} />,
            <DangerButton
              key="delete"
              onClick={() => {
                if (skillId) onDeleteSkill(skillId);
              }}
              label="Видалити"
            />,
          ];
        })}
      />
    </div>
  );
}

function RatingsTable({
  ratings,
  onDelete,
}: {
  ratings: AdminCompanyRatingRead[];
  onDelete: (id: string) => void;
}) {
  return (
    <AdminTable
      emptyText="Відгуків не знайдено."
      headers={["Компанія", "Автор", "Оцінка", "Дія"]}
      rows={ratings.map((rating) => [
        <CellTitle
          key="company"
          title={rating.companyName ?? rating.CompanyName ?? "Компанія"}
          subtitle={formatDate(rating.createdAtUtc ?? rating.CreatedAtUtc)}
        />,
        <CellTitle
          key="author"
          title={rating.fullName ?? rating.FullName ?? "Автор"}
          subtitle={rating.comment ?? rating.Comment ?? ""}
        />,
        `${rating.rating ?? rating.Rating ?? 0}/5`,
        <DangerButton
          key="delete"
          onClick={() => onDelete(rating.id)}
          label="Видалити"
        />,
      ])}
    />
  );
}

function AdminTable({
  headers,
  rows,
  emptyText,
}: {
  headers: string[];
  rows: Array<Array<ReactNode>>;
  emptyText: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#1E3151] bg-[#0F1D36]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#0A1628] text-xs uppercase text-[#8FA1BB]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-5 py-4 font-bold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-[#1E3151]">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-5 py-4 align-middle text-[#D7E1EF]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-5 py-8 text-center text-[#8FA1BB]"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricGroup({
  title,
  items,
}: {
  title: string;
  items: Array<[string, number]>;
}) {
  return (
    <div className="rounded-xl border border-[#1E3151] bg-[#0F1D36] p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-[#1E3151]/70 pb-2 last:border-0"
          >
            <span className="text-sm text-[#8FA1BB]">{label}</span>
            <span className="font-bold">{value.toLocaleString("uk-UA")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusSelect({
  value,
  options,
  onChange,
}: {
  value: number;
  options: Array<{ value: number; label: string }>;
  onChange: (value: number) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-10 rounded-lg border border-[#1E3151] bg-[#0A1628] px-3 text-sm font-semibold text-white outline-none focus:border-[#3B82F6]"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function CellTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string | null;
}) {
  return (
    <div>
      <p className="font-bold text-white">{title}</p>
      {subtitle && (
        <p className="mt-1 max-w-xl truncate text-xs text-[#8FA1BB]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function DangerButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-9 rounded-lg border border-red-500/30 bg-red-500/10 px-3 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20"
    >
      {label}
    </button>
  );
}

function Notice({ tone, text }: { tone: "info" | "error"; text: string }) {
  const classes =
    tone === "error"
      ? "border-red-500/30 bg-red-500/10 text-red-100"
      : "border-blue-500/30 bg-blue-500/10 text-blue-100";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${classes}`}>
      {text}
    </div>
  );
}

function numberValue(value: string | number | null | undefined) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function statusNumber(
  value: string | number | null | undefined,
  labels: Record<string, number>,
  fallback: number,
) {
  if (typeof value === "number") return value;

  const numericValue = Number(value);
  if (Number.isFinite(numericValue) && numericValue > 0) return numericValue;

  return labels[String(value ?? "").toLowerCase()] ?? fallback;
}

function getSkillName(skill: SkillRead) {
  return skill.name ?? skill.Name ?? "Навичка";
}

function formatSalary(vacancy: VacancyRead) {
  const min = vacancy.salaryMin;
  const max = vacancy.salaryMax;
  const formatter = new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: 0,
  });

  if (min && max)
    return `${formatter.format(min)} - ${formatter.format(max)} грн`;
  if (min) return `від ${formatter.format(min)} грн`;
  if (max) return `до ${formatter.format(max)} грн`;
  return vacancy.city ?? "Зарплата не вказана";
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
