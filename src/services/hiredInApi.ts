const API_BASE_URL =
  import.meta.env.VITE_HIREDIN_API_URL ??
  "https://hiredin-backend-6mp8.onrender.com";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
};

export type VacancyRecommendation = {
  vacancyId: string;
  title?: string | null;
  companyName?: string | null;
  city?: string | null;
  workFormat?: string | number | null;
  employmentType?: string | number | null;
  experienceLevel?: string | number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  matchScore: number;
  matchedSkills?: string[] | null;
  missingSkills?: string[] | null;
};

export type VacancyRead = {
  id: string;
  companyId: string;
  companyName?: string | null;
  title?: string | null;
  description?: string | null;
  city?: string | null;
  workFormat?: string | number | null;
  employmentType?: string | number | null;
  experienceLevel?: string | number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  status?: string | number | null;
};

export type FavouriteVacancyRead = {
  id: string;
  vacancyId: string;
  vacancyName: string;
  companyName: string;
  city?: string | null;
  salary?: number | null;
};

export type ApplicationRead = {
  id: string;
  vacancyId: string;
  resumeId: string;
  coverLetter?: string | null;
  status?: string | number | null;
  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
  vacancyTitle?: string | null;
  resumeTitle?: string | null;
  companyName?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  city?: string | null;
};

export type CompanyRead = {
  id: string;
  name: string;
  description?: string | null;
  industry?: string | null;
  city?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  status?: string | number | null;
};

export type CompanyMemberRead = {
  id: string;
  Id?: string;
  fullName?: string | null;
  FullName?: string | null;
  companyName?: string | null;
  CompanyName?: string | null;
  companyId?: string;
  CompanyId?: string;
  userId?: string;
  UserId?: string;
  role?: string | number | null;
  Role?: string | number | null;
};

export type AdminUserRead = {
  id: string;
  firstName?: string | null;
  FirstName?: string | null;
  lastName?: string | null;
  LastName?: string | null;
  email?: string | null;
  Email?: string | null;
  phoneNumber?: string | null;
  PhoneNumber?: string | null;
  avatarUrl?: string | null;
  AvatarUrl?: string | null;
  userRole?: string | number | null;
  UserRole?: string | number | null;
  userStatus?: string | number | null;
  UserStatus?: string | number | null;
};

export type AdminCompanyRatingRead = {
  id: string;
  companyId: string;
  companyName?: string | null;
  CompanyName?: string | null;
  userId: string;
  fullName?: string | null;
  FullName?: string | null;
  rating: number;
  Rating?: number;
  comment?: string | null;
  Comment?: string | null;
  createdAtUtc?: string | null;
  CreatedAtUtc?: string | null;
};

export type CompanyRatingRead = AdminCompanyRatingRead;

export type AdminStatisticsRead = {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  deletedUsers: number;
  totalCompanies: number;
  pendingCompanies: number;
  activeCompanies: number;
  blockedCompanies: number;
  archivedCompanies: number;
  totalVacancies: number;
  draftVacancies: number;
  publishedVacancies: number;
  archivedVacancies: number;
  closedVacancies: number;
  totalApplications: number;
  totalCompanyRatings: number;
};

export type CandidateProfileRead = {
  id: string;
  city?: string | null;
  about?: string | null;
  openToWork?: boolean | null;
};

export type ResumeRead = {
  id: string;
  candidateProfileId: string;
  title?: string | null;
  desiredPosition?: string | null;
  summary?: string | null;
  employmentType?: string | number | null;
  workFormat?: string | number | null;
  experienceLevel?: string | number | null;
  visibility?: string | number | null;
  isPrimary?: boolean | null;
};

export type ResumeFileRead = {
  id: string;
  resumeId: string;
  fileName: string;
  fileUrl: string;
  sizeBytes?: number | null;
  fileSizeBytes?: number | null;
  updatedAtUtc?: string | null;
  createdAtUtc?: string | null;
};

export type ResumeEducationRead = {
  id: string;
  resumeId: string;
  institutionName: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
};

export type ResumeWorkExperienceRead = {
  resumeId: string;
  companyName: string;
  positionTitle: string;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
};

export type ResumeSkillRead = {
  resumeId: string;
  skillId: string;
  skillName: string;
  level?: string | number | null;
};

export type SkillRead = {
  id: string;
  Id?: string;
  name: string;
  Name?: string;
};

export type ChatRead = {
  id: string;
  applicationId: string;
  status?: string | number | null;
  vacancyTitle?: string | null;
  lastMessageText?: string | null;
  lastMessageCreatedAtUtc?: string | null;
  createdAtUtc?: string | null;
  participants?: Array<{
    userId?: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    role?: string | number | null;
  }>;
};

export type MessageRead = {
  id: string;
  chatId: string;
  senderUserId: string;
  senderFullName?: string | null;
  content?: string | null;
  createdAtUtc?: string | null;
};

export type NotificationRead = {
  id: string;
  userId: string;
  type?: string | number | null;
  Type?: string | number | null;
  title?: string | null;
  Title?: string | null;
  text?: string | null;
  Text?: string | null;
  isRead?: boolean;
  IsRead?: boolean;
  createdAtUtc?: string | null;
  CreatedAtUtc?: string | null;
};

export type PaginatedList<T> = {
  items?: T[] | null;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type AuthResponse = {
  accessToken?: string | null;
  AccessToken?: string | null;
  token?: string | null;
  Token?: string | null;
  expiresAt?: string;
  ExpiresAt?: string;
  user?: {
    id?: string;
    ID?: string;
    email?: string | null;
    Email?: string | null;
    fullName?: string | null;
    FullName?: string | null;
    avatarUrl?: string | null;
    AvatarUrl?: string | null;
    role?: string | number;
    Role?: string | number;
    name?: string | null;
    Name?: string | null;
    companyName?: string | null;
    CompanyName?: string | null;
  };
  User?: AuthResponse["user"];
  role?: string | number;
  Role?: string | number;
  userRole?: string | number;
  UserRole?: string | number;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getDefaultApiErrorMessage(status: number) {
  if (status === 400) {
    return "Перевір заповнені поля та спробуй ще раз.";
  }
  if (status === 401) {
    return "Сесія завершилася. Увійди в акаунт ще раз і повтори дію.";
  }
  if (status === 403) {
    return "У цього акаунта немає доступу до цієї дії.";
  }
  if (status === 404) {
    return "Не вдалося знайти потрібні дані. Онови сторінку та спробуй ще раз.";
  }
  if (status === 409) {
    return "Ці дані вже існують або конфліктують з поточними. Перевір форму та спробуй ще раз.";
  }
  if (status >= 500) {
    return "На сервері сталася помилка. Спробуй ще раз трохи пізніше.";
  }

  return "Не вдалося виконати дію. Спробуй ще раз.";
}

function isTechnicalErrorMessage(message: string) {
  return (
    !message.trim() ||
    /API request failed/i.test(message) ||
    /^(Unauthorized|Forbidden|Bad Request|Internal Server Error)$/i.test(
      message.trim(),
    )
  );
}

export function getStoredAccessToken() {
  return (
    localStorage.getItem("hiredin.accessToken") ??
    localStorage.getItem("accessToken") ??
    localStorage.getItem("token")
  );
}

export function getStoredResumeId() {
  return (
    localStorage.getItem("hiredin.resumeId") ?? localStorage.getItem("resumeId")
  );
}

export function getStoredUserId() {
  return localStorage.getItem("hiredin.userId");
}

export function storeResumeId(resumeId: string) {
  localStorage.setItem("hiredin.resumeId", resumeId);
  localStorage.setItem("resumeId", resumeId);
}

function emitAuthUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-update"));
  }
}

export function storeAuthResponse(auth: AuthResponse) {
  const accessToken =
    auth.accessToken ?? auth.AccessToken ?? auth.token ?? auth.Token;
  const user = auth.user ?? auth.User;

  if (accessToken) {
    localStorage.setItem("hiredin.accessToken", accessToken);
  }

  if (user) {
    const userId = user.id ?? user.ID;
    const role = user.role ?? user.Role ?? auth.role ?? auth.Role ?? auth.userRole ?? auth.UserRole;
    const avatarUrl = user.avatarUrl ?? user.AvatarUrl;

    if (userId) localStorage.setItem("hiredin.userId", userId);
    if (role != null) localStorage.setItem("hiredin.userRole", String(role));
    if (avatarUrl) localStorage.setItem("hiredin.avatarUrl", avatarUrl);
    localStorage.setItem("hiredin.user", JSON.stringify(user));
  }

  emitAuthUpdate();
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const token =
    options.token === undefined ? getStoredAccessToken() : options.token;

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (
    options.body !== undefined &&
    !headers.has("Content-Type") &&
    !isFormData
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body === undefined
        ? undefined
        : isFormData
          ? (options.body as BodyInit)
          : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    let parsedMessage = message;

    try {
      const problem = JSON.parse(message) as {
        detail?: string;
        title?: string;
        errors?: Record<string, string[]>;
      };
      parsedMessage =
        problem.detail ??
        problem.title ??
        Object.values(problem.errors ?? {})
          .flat()
          .join(" ");
    } catch {
      parsedMessage = message;
    }

    throw new ApiError(
      response.status,
      isTechnicalErrorMessage(parsedMessage)
        ? getDefaultApiErrorMessage(response.status)
        : parsedMessage,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return (await response.text()) as T;
  }

  return (await response.json()) as T;
}

export const hiredInApi = {
  login(email: string, password: string) {
    return request<AuthResponse>("/api/Auth/Login", {
      method: "POST",
      body: { email, password },
    });
  },

  registerCandidate(body: unknown) {
    return request<AuthResponse>("/api/Auth/RegisterCandidate", {
      method: "POST",
      body,
    });
  },

  registerEmployer(body: unknown) {
    return request<AuthResponse>("/api/Auth/RegisterEmployer", {
      method: "POST",
      body,
    });
  },

  me() {
    return request("/api/Auth/Me");
  },

  getMyCandidateProfile() {
    return request<CandidateProfileRead>(
      "/api/CandidateProfile/GetMyCandidateProfile",
    );
  },

  getAllCandidateProfiles() {
    return request<CandidateProfileRead[]>(
      "/api/CandidateProfile/GetAllCandidateProfiles",
    );
  },

  updateMyCandidateProfile(body: unknown) {
    return request<void>("/api/CandidateProfile/UpdateMyCandidateProfile", {
      method: "PUT",
      body,
    });
  },

  getMyCompany() {
    return request<CompanyRead>("/api/Company/GetMyCompany");
  },

  getAllCompanies() {
    return request<CompanyRead[]>("/api/Company/GetAllCompanies", {
      token: null,
    });
  },

  createCompany(body: unknown) {
    return request<void>("/api/Company/CreateCompany", {
      method: "POST",
      body,
    });
  },

  updateMyCompany(body: unknown) {
    return request<void>("/api/Company/UpdateMyCompany", {
      method: "PUT",
      body,
    });
  },

  getCompanyMembers() {
    return request<CompanyMemberRead[]>("/api/CompanyMember/GetCompanyMembers");
  },

  getRecommendedVacancies(resumeId: string) {
    return request<VacancyRecommendation[]>(
      `/api/Recommendation/GetRecommendedVacancies/${resumeId}`,
    );
  },

  explainVacancyRecommendation(resumeId: string, vacancyId: string) {
    const params = new URLSearchParams({ resumeId, vacancyId });
    return request<string>(
      `/api/Ai/ExplainVacancyRecommendation?${params.toString()}`,
    );
  },

  getResumeImprovementTips(resumeId: string) {
    return request<string>(`/api/Ai/GetResumeImprovementTips/${resumeId}`);
  },

  createResume(body: unknown) {
    return request<unknown>("/api/Resume/CreateResume", {
      method: "POST",
      body,
    });
  },

  getMyResumes() {
    return request<ResumeRead[]>("/api/Resume/GetMyResumes");
  },

  createResumeEducation(body: unknown) {
    return request<string>("/api/ResumeEducation/Create", {
      method: "POST",
      body,
    });
  },

  getResumeEducations(resumeId: string) {
    return request<ResumeEducationRead[]>(
      `/api/ResumeEducation/GetByResumeId/by-resume/${resumeId}`,
    );
  },

  updateResumeEducation(educationId: string, body: unknown) {
    return request<void>(`/api/ResumeEducation/${educationId}`, {
      method: "PATCH",
      body,
    });
  },

  deleteResumeEducation(educationId: string) {
    return request<void>(`/api/ResumeEducation/${educationId}`, {
      method: "DELETE",
    });
  },

  createResumeWorkExperience(body: unknown) {
    return request<ResumeWorkExperienceRead>("/api/resumeworkexperience", {
      method: "POST",
      body,
    });
  },

  getResumeWorkExperiences(resumeId: string) {
    return request<ResumeWorkExperienceRead[]>(
      `/api/resumeworkexperience/by-resume/${resumeId}`,
    );
  },

  updateResumeWorkExperience(body: unknown) {
    return request<void>("/api/resumeworkexperience", {
      method: "PATCH",
      body,
    });
  },

  deleteResumeWorkExperience(body: unknown) {
    return request<void>("/api/resumeworkexperience", {
      method: "DELETE",
      body,
    });
  },

  getSkills() {
    return request<SkillRead[]>("/api/skill");
  },

  createSkill(body: unknown) {
    return request<SkillRead>("/api/skill", {
      method: "POST",
      body,
    });
  },

  deleteSkill(skillId: string) {
    return request<void>(`/api/skill/${skillId}`, {
      method: "DELETE",
    });
  },

  createResumeSkill(body: unknown) {
    return request<ResumeSkillRead>("/api/resumeskill", {
      method: "POST",
      body,
    });
  },

  getResumeSkills(resumeId: string) {
    return request<ResumeSkillRead[]>(`/api/resumeskill/by-resume/${resumeId}`);
  },

  updateResumeSkill(resumeId: string, skillId: string, body: unknown) {
    return request<void>(`/api/resumeskill/${resumeId}/${skillId}`, {
      method: "PATCH",
      body,
    });
  },

  deleteResumeSkill(resumeId: string, skillId: string) {
    return request<void>(`/api/resumeskill/${resumeId}/${skillId}`, {
      method: "DELETE",
    });
  },

  uploadResumeFile(resumeId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return request<string>(
      `/api/ResumeFileUpload/UploadResumeFile/${resumeId}`,
      {
        method: "POST",
        body: formData,
      },
    );
  },

  getResumeFileUrl(resumeId: string) {
    return request<string>(
      `/api/ResumeFileUpload/GetResumeFileUrl/${resumeId}`,
    );
  },

  getResumeFileByResumeId(resumeId: string) {
    return request<ResumeFileRead>(`/api/resumefile/by-resume/${resumeId}`);
  },

  deleteResumeFile(resumeId: string) {
    return request<void>(`/api/ResumeFileUpload/DeleteResumeFile/${resumeId}`, {
      method: "DELETE",
    });
  },

  uploadMyAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return request<string>("/api/UserFile/UploadMyAvatar", {
      method: "POST",
      body: formData,
    });
  },

  deleteMyAvatar() {
    return request<void>("/api/UserFile/DeleteMyAvatar", {
      method: "DELETE",
    });
  },

  uploadCompanyLogo(companyId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return request<string>(`/api/CompanyFile/UploadCompanyLogo/${companyId}`, {
      method: "POST",
      body: formData,
    });
  },

  deleteCompanyLogo() {
    return request<void>("/api/CompanyFile/DeleteCompanyLogo", {
      method: "DELETE",
    });
  },

  getPagedVacancies(page = 0, pageSize = 10) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    return request<PaginatedList<VacancyRead>>(
      `/api/Vacancy/GetPaged/paged?${params.toString()}`,
      { token: null },
    );
  },

  getPublicVacancyById(vacancyId: string) {
    return request<VacancyRead>(
      `/api/Vacancy/GetPublicVacanciesById/${vacancyId}`,
      {
        token: null,
      },
    );
  },

  getMyVacancies() {
    return request<VacancyRead[]>("/api/Vacancy/GetMy/my");
  },

  getEmployerVacancyById(vacancyId: string) {
    return request<VacancyRead>(`/api/Vacancy/GetById/${vacancyId}`);
  },

  createVacancy(body: unknown) {
    return request<string>("/api/Vacancy/Create", {
      method: "POST",
      body,
    });
  },

  updateVacancy(vacancyId: string, body: unknown) {
    return request<void>(`/api/Vacancy/Update/${vacancyId}`, {
      method: "PUT",
      body,
    });
  },

  addFavouriteVacancy(vacancyId: string) {
    return request<void>("/api/FavouriteVacancy/CreateFavouriteVacancy", {
      method: "POST",
      body: { vacancyId },
    });
  },

  getFavouriteVacancies(page = 1, pageSize = 20) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    return request<PaginatedList<FavouriteVacancyRead>>(
      `/api/FavouriteVacancy/GetPagedFavouriteVacancies/paged?${params.toString()}`,
    );
  },

  deleteFavouriteVacancy(id: string) {
    return request<void>(`/api/FavouriteVacancy/DeleteFavouriteVacancy/${id}`, {
      method: "DELETE",
      body: id,
    });
  },

  archiveVacancy(vacancyId: string) {
    return request<void>(`/api/Vacancy/ArchiveVacancy/${vacancyId}/archive`, {
      method: "PATCH",
    });
  },

  unarchiveVacancy(vacancyId: string) {
    return request<void>(
      `/api/Vacancy/UnarchiveVacancy/${vacancyId}/unarchive`,
      {
        method: "PATCH",
      },
    );
  },

  createApplication(vacancyId: string, resumeId: string, coverLetter = "") {
    return request<void>("/api/Application/CreateApplication", {
      method: "POST",
      body: { vacancyId, resumeId, coverLetter },
    });
  },

  getMyApplications() {
    return request<ApplicationRead[]>("/api/Application/GetMyApplications");
  },

  withdrawApplication(applicationId: string) {
    return request<void>(
      `/api/Application/WithdrawApplication/${applicationId}/withdraw`,
      {
        method: "PATCH",
      },
    );
  },

  getApplicationsByVacancyId(vacancyId: string) {
    return request<ApplicationRead[]>(
      `/api/Application/GetApplicationsByVacancyId/${vacancyId}/vacancy`,
    );
  },

  updateApplicationStatus(applicationId: string, status: number) {
    return request<void>(
      `/api/Application/UpdateApplicationStatus/${applicationId}/status`,
      {
        method: "PATCH",
        body: { status },
      },
    );
  },

  getMyChats() {
    return request<ChatRead[]>("/api/Chat/GetMyChats");
  },

  createChat(applicationId: string) {
    return request<string>("/api/Chat/CreateChat", {
      method: "POST",
      body: { applicationId },
    });
  },

  getChatById(chatId: string) {
    return request<ChatRead>(`/api/Chat/GetChatById/${chatId}`);
  },

  getMessagesByChatId(chatId: string) {
    return request<MessageRead[]>(
      `/api/Chat/GetMessagesByChatId/${chatId}/messages`,
    );
  },

  getMyNotifications() {
    return request<NotificationRead[]>("/api/Notification/GetMyNotifications");
  },

  markNotificationAsRead(notificationId: string) {
    return request<void>(
      `/api/Notification/MarkNotificationAsRead/${notificationId}`,
      { method: "PATCH" },
    );
  },

  markAllNotificationsAsRead() {
    return request<void>("/api/Notification/MarkAllNotificationsAsRead", {
      method: "PATCH",
    });
  },

  deleteNotification(notificationId: string) {
    return request<void>(
      `/api/Notification/DeleteNotification/${notificationId}`,
      { method: "DELETE" },
    );
  },

  getAdminStatistics() {
    return request<AdminStatisticsRead>("/api/admin/statistics");
  },

  getAdminUsers() {
    return request<AdminUserRead[]>("/api/admin/users");
  },

  updateAdminUserStatus(userId: string, status: number) {
    return request<void>(`/api/admin/users/${userId}/status`, {
      method: "PATCH",
      body: { status },
    });
  },

  deleteAdminUser(userId: string) {
    return request<void>(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });
  },

  getAdminCompanies() {
    return request<CompanyRead[]>("/api/admin/companies");
  },

  updateAdminCompanyStatus(companyId: string, status: number) {
    return request<void>(`/api/admin/companies/${companyId}/status`, {
      method: "PATCH",
      body: { status },
    });
  },

  deleteAdminCompany(companyId: string) {
    return request<void>(`/api/admin/companies/${companyId}`, {
      method: "DELETE",
    });
  },

  getAdminVacancies() {
    return request<VacancyRead[]>("/api/admin/vacancies");
  },

  updateAdminVacancyStatus(vacancyId: string, status: number) {
    return request<void>(`/api/admin/vacancies/${vacancyId}/status`, {
      method: "PATCH",
      body: { status },
    });
  },

  deleteAdminVacancy(vacancyId: string) {
    return request<void>(`/api/admin/vacancies/${vacancyId}`, {
      method: "DELETE",
    });
  },

  getAdminCompanyRatings() {
    return request<AdminCompanyRatingRead[]>("/api/admin/company-ratings");
  },

  getCompanyRatingsByCompanyId(companyId: string) {
    return request<CompanyRatingRead[]>(
      `/api/CompanyRating/GetCompanyRatingsByCompanyId/by-company/${companyId}`,
      { token: null },
    );
  },

  deleteAdminCompanyRating(ratingId: string) {
    return request<void>(`/api/admin/company-ratings/${ratingId}`, {
      method: "DELETE",
    });
  },
};
