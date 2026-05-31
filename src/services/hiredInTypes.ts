export const UserRole = {
  Candidate: 1,
  Employer: 2,
  Admin: 3,
} as const;

export const UserStatus = {
  Active: 1,
  Blocked: 2,
  Deleted: 3,
} as const;

export const ApplicationStatus = {
  Submitted: 1,
  InReview: 2,
  Interview: 3,
  Rejected: 4,
  Accepted: 5,
} as const;

export const VacancyStatus = {
  Draft: 1,
  Published: 2,
  Archived: 3,
  Closed: 4,
} as const;

export const CompanyStatus = {
  Pending: 1,
  Active: 2,
  Blocked: 3,
  Archived: 4,
} as const;

export const CompanyMemberRole = {
  Owner: 1,
  Recruiter: 2,
} as const;

export const ChatStatus = {
  Active: 1,
  Closed: 2,
} as const;

export const NotificationType = {
  NewApplication: 1,
  ApplicationStatusChanged: 2,
  NewMessage: 3,
  VacancyApproved: 4,
  VacancyRejected: 5,
} as const;

export const ResumeVisibility = {
  Public: 1,
  Private: 2,
  OnlyEmployers: 3,
} as const;

export const WorkFormat = {
  Onsite: 1,
  Remote: 2,
  Hybrid: 3,
} as const;

export const EmploymentType = {
  FullTime: 1,
  PartTime: 2,
  Contract: 3,
  Internship: 4,
  Freelance: 5,
} as const;

export const ExperienceLevel = {
  Trainee: 1,
  Junior: 2,
  Middle: 3,
  Senior: 4,
  Lead: 5,
} as const;

export const SkillLevel = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
} as const;

type ValueOf<T> = T[keyof T];

export type UserRoleValue = ValueOf<typeof UserRole>;
export type UserStatusValue = ValueOf<typeof UserStatus>;
export type ApplicationStatusValue = ValueOf<typeof ApplicationStatus>;
export type VacancyStatusValue = ValueOf<typeof VacancyStatus>;
export type CompanyStatusValue = ValueOf<typeof CompanyStatus>;
export type CompanyMemberRoleValue = ValueOf<typeof CompanyMemberRole>;
export type ChatStatusValue = ValueOf<typeof ChatStatus>;
export type NotificationTypeValue = ValueOf<typeof NotificationType>;
export type ResumeVisibilityValue = ValueOf<typeof ResumeVisibility>;
export type WorkFormatValue = ValueOf<typeof WorkFormat>;
export type EmploymentTypeValue = ValueOf<typeof EmploymentType>;
export type ExperienceLevelValue = ValueOf<typeof ExperienceLevel>;
export type SkillLevelValue = ValueOf<typeof SkillLevel>;

export const roleLabels: Record<UserRoleValue, string> = {
  [UserRole.Candidate]: "Кандидат",
  [UserRole.Employer]: "Роботодавець",
  [UserRole.Admin]: "Адміністратор",
};

export const applicationStatusLabels: Record<ApplicationStatusValue, string> = {
  [ApplicationStatus.Submitted]: "Подано",
  [ApplicationStatus.InReview]: "На розгляді",
  [ApplicationStatus.Interview]: "Інтерв'ю",
  [ApplicationStatus.Rejected]: "Відхилено",
  [ApplicationStatus.Accepted]: "Прийнято",
};

export const vacancyStatusLabels: Record<VacancyStatusValue, string> = {
  [VacancyStatus.Draft]: "Чернетка",
  [VacancyStatus.Published]: "Активна",
  [VacancyStatus.Archived]: "Архівна",
  [VacancyStatus.Closed]: "Закрита",
};

export const vacancyStatusApiValues: Record<VacancyStatusValue, string> = {
  [VacancyStatus.Draft]: "draft",
  [VacancyStatus.Published]: "published",
  [VacancyStatus.Archived]: "archived",
  [VacancyStatus.Closed]: "closed",
};

const vacancyStatusNumbers: Record<string, VacancyStatusValue> = {
  draft: VacancyStatus.Draft,
  published: VacancyStatus.Published,
  archived: VacancyStatus.Archived,
  closed: VacancyStatus.Closed,
};

export function getVacancyStatusNumber(
  status: string | number | null | undefined,
) {
  if (typeof status === "number") return status;

  const numericStatus = Number(status);
  if (Number.isFinite(numericStatus) && numericStatus > 0) {
    return numericStatus as VacancyStatusValue;
  }

  return vacancyStatusNumbers[String(status ?? "").toLowerCase()] ?? VacancyStatus.Published;
}

export function getVacancyStatusApiValue(
  status: string | number | null | undefined,
) {
  return vacancyStatusApiValues[getVacancyStatusNumber(status) as VacancyStatusValue] ?? "published";
}

export function getVacancyStatusLabel(
  status: string | number | null | undefined,
) {
  return vacancyStatusLabels[getVacancyStatusNumber(status) as VacancyStatusValue] ?? "Активна";
}

export const workFormatLabels: Record<WorkFormatValue, string> = {
  [WorkFormat.Onsite]: "Офіс",
  [WorkFormat.Remote]: "Remote",
  [WorkFormat.Hybrid]: "Hybrid",
};

export const workFormatApiValues: Record<WorkFormatValue, string> = {
  [WorkFormat.Onsite]: "onsite",
  [WorkFormat.Remote]: "remote",
  [WorkFormat.Hybrid]: "hybrid",
};

const workFormatNumbers: Record<string, WorkFormatValue> = {
  onsite: WorkFormat.Onsite,
  remote: WorkFormat.Remote,
  hybrid: WorkFormat.Hybrid,
};

export const employmentTypeLabels: Record<EmploymentTypeValue, string> = {
  [EmploymentType.FullTime]: "Повна зайнятість",
  [EmploymentType.PartTime]: "Часткова зайнятість",
  [EmploymentType.Contract]: "Контракт",
  [EmploymentType.Internship]: "Стажування",
  [EmploymentType.Freelance]: "Freelance",
};

export const employmentTypeApiValues: Record<EmploymentTypeValue, string> = {
  [EmploymentType.FullTime]: "fullTime",
  [EmploymentType.PartTime]: "partTime",
  [EmploymentType.Contract]: "contract",
  [EmploymentType.Internship]: "internship",
  [EmploymentType.Freelance]: "freelance",
};

const employmentTypeNumbers: Record<string, EmploymentTypeValue> = {
  fulltime: EmploymentType.FullTime,
  parttime: EmploymentType.PartTime,
  contract: EmploymentType.Contract,
  internship: EmploymentType.Internship,
  freelance: EmploymentType.Freelance,
};

export const experienceLevelLabels: Record<ExperienceLevelValue, string> = {
  [ExperienceLevel.Trainee]: "Trainee",
  [ExperienceLevel.Junior]: "Junior",
  [ExperienceLevel.Middle]: "Middle",
  [ExperienceLevel.Senior]: "Senior",
  [ExperienceLevel.Lead]: "Lead",
};

export const experienceLevelApiValues: Record<ExperienceLevelValue, string> = {
  [ExperienceLevel.Trainee]: "trainee",
  [ExperienceLevel.Junior]: "junior",
  [ExperienceLevel.Middle]: "middle",
  [ExperienceLevel.Senior]: "senior",
  [ExperienceLevel.Lead]: "lead",
};

const experienceLevelNumbers: Record<string, ExperienceLevelValue> = {
  trainee: ExperienceLevel.Trainee,
  junior: ExperienceLevel.Junior,
  middle: ExperienceLevel.Middle,
  senior: ExperienceLevel.Senior,
  lead: ExperienceLevel.Lead,
};

function getEnumNumber<T extends number>(
  value: string | number | null | undefined,
  values: Record<string, T>,
  fallback: T,
) {
  if (typeof value === "number") return value;

  const numericValue = Number(value);
  if (Number.isFinite(numericValue) && numericValue > 0) return numericValue as T;

  return values[String(value ?? "").toLowerCase()] ?? fallback;
}

export function getWorkFormatNumber(value: string | number | null | undefined) {
  return getEnumNumber(value, workFormatNumbers, WorkFormat.Hybrid);
}

export function getWorkFormatApiValue(value: string | number | null | undefined) {
  return workFormatApiValues[getWorkFormatNumber(value) as WorkFormatValue] ?? "hybrid";
}

export function getEmploymentTypeNumber(value: string | number | null | undefined) {
  return getEnumNumber(value, employmentTypeNumbers, EmploymentType.FullTime);
}

export function getEmploymentTypeApiValue(value: string | number | null | undefined) {
  return employmentTypeApiValues[getEmploymentTypeNumber(value) as EmploymentTypeValue] ?? "fullTime";
}

export function getExperienceLevelNumber(value: string | number | null | undefined) {
  return getEnumNumber(value, experienceLevelNumbers, ExperienceLevel.Middle);
}

export function getExperienceLevelApiValue(value: string | number | null | undefined) {
  return experienceLevelApiValues[getExperienceLevelNumber(value) as ExperienceLevelValue] ?? "middle";
}

export function enumLabel<T extends number>(
  labels: Record<T, string>,
  value: T | string | number | null | undefined,
  fallback = "Не вказано",
) {
  if (value == null) return fallback;
  const numeric = typeof value === "string" ? Number(value) : value;
  return labels[numeric as T] ?? String(value);
}
