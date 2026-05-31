import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { CompanyMemberRead, CompanyRead } from "../../services/hiredInApi";
import { CompanyMemberRole } from "../../services/hiredInTypes";

export interface CompanyEmployee {
  initials: string;
  name: string;
  role: string;
  location: string;
  format: string;
  skills: string;
  color: string;
}

const memberRoleLabels: Record<number, string> = {
  [CompanyMemberRole.Owner]: "Власник",
  [CompanyMemberRole.Recruiter]: "Рекрутер",
};

export default function CompanyEmployees({
  companyId,
  company,
  members = [],
}: {
  companyId?: string | null;
  company?: CompanyRead | null;
  members?: CompanyMemberRead[];
}) {
  const employees =
    members.length > 0
      ? members.map(mapMemberToEmployee)
      : company
        ? [mapCompanyToEmployee(company)]
        : [];

  return (
    <section className="w-full rounded-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Співробітники</h2>
        </div>
        {employees.length > 0 && (
          <Link
            to={
              companyId
                ? `/company-employees?companyId=${companyId}`
                : "/company-employees"
            }
            className="inline-flex items-center gap-2 text-sm font-bold text-[#60A5FA] hover:text-[#93C5FD]"
          >
            Переглянути всі →
          </Link>
        )}
      </div>

      {employees.length > 0 ? (
        <div className="mt-6 flex flex-col gap-4">
          {employees.slice(0, 3).map((employee) => (
            <Link
              key={employee.name}
              to={employeeProfilePath(employee)}
              className="flex flex-col justify-between gap-5 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 transition-colors hover:border-[#2A436D] hover:bg-[#102440] sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-white ${employee.color}`}
                >
                  {employee.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-white">{employee.name}</h3>
                  <p className="mt-1 text-sm text-[#A8B6CD]">{employee.role}</p>
                  <p className="mt-2 text-sm text-[#7F90AA]">
                    {employee.location} · {employee.format}
                  </p>
                </div>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[#D7E1EF] sm:text-right">
                {employee.skills}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-[#1E3151] px-5 py-8 text-center">
          <Users className="mx-auto h-8 w-8 text-[#3B82F6]" />
          <p className="mt-3 text-sm font-semibold text-[#D7E1EF]">
            Співробітників поки не додано
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#8EA0BA]">
            Коли API поверне відкриті профілі команди, перші співробітники
            з'являться тут.
          </p>
        </div>
      )}
    </section>
  );
}

export function employeeProfilePath(employee: CompanyEmployee) {
  const params = new URLSearchParams({
    name: employee.name,
    role: employee.role,
    location: employee.location,
    format: employee.format,
    skills: employee.skills,
    initials: employee.initials,
  });

  return `/candidateProfile?${params.toString()}`;
}

export function mapMemberToEmployee(
  member: CompanyMemberRead,
): CompanyEmployee {
  const name = getMemberName(member);
  const role = getMemberRole(member);

  return {
    initials: initials(name),
    name,
    role: memberRoleLabels[role] ?? "Співробітник",
    location: member.companyName ?? member.CompanyName ?? "Компанія",
    format: "Команда",
    skills:
      role === CompanyMemberRole.Owner
        ? "Керує профілем компанії та командою."
        : "Працює з вакансіями, кандидатами та комунікацією.",
    color:
      role === CompanyMemberRole.Owner
        ? "bg-gradient-to-br from-blue-500 to-violet-600"
        : "bg-gradient-to-br from-emerald-500 to-blue-600",
  };
}

export function mapCompanyToEmployee(company: CompanyRead): CompanyEmployee {
  const fallbackEmployee = getFallbackCompanyEmployee(company);

  return {
    initials: initials(fallbackEmployee.name),
    name: fallbackEmployee.name,
    role: fallbackEmployee.role,
    location: company.city ?? company.name ?? "Компанія",
    format: "Офіційний представник",
    skills: company.industry
      ? `Працює у сфері ${company.industry}.`
      : "Представляє компанію на платформі.",
    color: "bg-gradient-to-br from-blue-500 to-violet-600",
  };
}

function getFallbackCompanyEmployee(company: CompanyRead) {
  const companyName = company.name?.toLowerCase() ?? "";

  if (companyName.includes("doviratech")) {
    return { name: "Олена Коваль", role: "Власниця компанії" };
  }
  if (companyName.includes("nova digital")) {
    return { name: "Андрій Мельник", role: "Власник компанії" };
  }
  if (companyName.includes("finwave")) {
    return { name: "Наталія Бондар", role: "Власниця компанії" };
  }
  if (companyName.includes("lvivsoft")) {
    return { name: "Дмитро Савчук", role: "Власник компанії" };
  }
  if (companyName.includes("medcore")) {
    return { name: "Ірина Гнатюк", role: "Власниця компанії" };
  }
  if (companyName.includes("agrocloud")) {
    return { name: "Сергій Левченко", role: "Власник компанії" };
  }
  if (companyName.includes("edubridge")) {
    return { name: "Вікторія Романюк", role: "Власниця компанії" };
  }
  if (companyName.includes("retailpulse")) {
    return { name: "Павло Ткаченко", role: "Власник компанії" };
  }

  return { name: "Представник компанії", role: "Співробітник компанії" };
}

function getMemberName(member: CompanyMemberRead) {
  return member.fullName ?? member.FullName ?? "Співробітник";
}

function getMemberRole(member: CompanyMemberRead) {
  const value = member.role ?? member.Role;
  const number = Number(value);

  if (Number.isFinite(number)) return number;

  return String(value ?? "").toLowerCase() === "owner"
    ? CompanyMemberRole.Owner
    : CompanyMemberRole.Recruiter;
}

function initials(value: string) {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "OK"
  );
}
