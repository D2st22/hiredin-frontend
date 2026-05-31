import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  ApiError,
  getStoredAccessToken,
  hiredInApi,
  storeResumeId,
  type SkillRead,
} from "../services/hiredInApi";
import {
  EmploymentType,
  ExperienceLevel,
  ResumeVisibility,
  SkillLevel,
  WorkFormat,
} from "../services/hiredInTypes";

type ResumeForm = {
  title: string;
  desiredPosition: string;
  summary: string;
  employmentType: number;
  workFormat: number;
  experienceLevel: number;
  visibility: number;
  isPrimary: boolean;
};

type WorkExperienceForm = {
  key: string;
  companyName: string;
  positionTitle: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
};

type EducationForm = {
  key: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
};

type SkillForm = {
  key: string;
  skillId: string;
  level: number;
};

const defaultForm: ResumeForm = {
  title: "",
  desiredPosition: "",
  summary: "",
  employmentType: EmploymentType.FullTime,
  workFormat: WorkFormat.Remote,
  experienceLevel: ExperienceLevel.Middle,
  visibility: ResumeVisibility.OnlyEmployers,
  isPrimary: true,
};

const employmentOptions = [
  { value: EmploymentType.FullTime, label: "Повна зайнятість" },
  { value: EmploymentType.PartTime, label: "Часткова зайнятість" },
  { value: EmploymentType.Contract, label: "Контракт" },
  { value: EmploymentType.Internship, label: "Стажування" },
  { value: EmploymentType.Freelance, label: "Freelance" },
];

const workFormatOptions = [
  { value: WorkFormat.Onsite, label: "Офіс" },
  { value: WorkFormat.Remote, label: "Remote" },
  { value: WorkFormat.Hybrid, label: "Hybrid" },
];

const experienceOptions = [
  { value: ExperienceLevel.Trainee, label: "Trainee" },
  { value: ExperienceLevel.Junior, label: "Junior" },
  { value: ExperienceLevel.Middle, label: "Middle" },
  { value: ExperienceLevel.Senior, label: "Senior" },
  { value: ExperienceLevel.Lead, label: "Lead" },
];

const visibilityOptions = [
  { value: ResumeVisibility.Public, label: "Публічне" },
  { value: ResumeVisibility.Private, label: "Приватне" },
  { value: ResumeVisibility.OnlyEmployers, label: "Тільки роботодавцям" },
];

const skillLevelOptions = [
  { value: SkillLevel.Beginner, label: "Початковий" },
  { value: SkillLevel.Intermediate, label: "Середній" },
  { value: SkillLevel.Advanced, label: "Просунутий" },
  { value: SkillLevel.Expert, label: "Експерт" },
];

function extractResumeId(response: unknown): string | null {
  if (!response) return null;

  const normalize = (value: string) =>
    value
      .trim()
      .replaceAll('"', "")
      .replaceAll("{", "")
      .replaceAll("}", "")
      .trim();

  if (typeof response === "string") {
    const value = normalize(response);
    return isGuid(value) ? value : null;
  }

  if (typeof response === "object") {
    const record = response as Record<string, unknown>;
    const id =
      record.id ??
      record.resumeId ??
      record.Id ??
      record.ResumeId ??
      record.value ??
      record.Value;
    if (typeof id === "string") {
      const value = normalize(id);
      return isGuid(value) ? value : null;
    }
  }

  return null;
}

function getResumeSaveErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return "Перевір поля резюме. Дати мають бути реальними, а обов'язкові поля заповненими.";
    }
    if (error.status === 401) {
      return "Сесія завершилася. Увійди в акаунт кандидата ще раз і збережи CV повторно.";
    }
    if (error.status === 403) {
      return "Зберігати CV може лише акаунт кандидата. Перевір, що ти увійшов саме як кандидат.";
    }
    if (error.status >= 500) {
      return "Зараз не вдалося зберегти CV через помилку сервера. Спробуй ще раз трохи пізніше.";
    }

    return error.message;
  }

  return "Не вдалося зберегти CV. Перевір дані та спробуй ще раз.";
}

export default function ResumeBuilderView() {
  const [form, setForm] = useState<ResumeForm>(defaultForm);
  const [workExperiences, setWorkExperiences] = useState<WorkExperienceForm[]>(
    [],
  );
  const [educations, setEducations] = useState<EducationForm[]>([]);
  const [resumeSkills, setResumeSkills] = useState<SkillForm[]>([]);
  const [availableSkills, setAvailableSkills] = useState<SkillRead[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    hiredInApi
      .getSkills()
      .then((items) => {
        if (active) setAvailableSkills(items ?? []);
      })
      .catch(() => {
        if (active) setAvailableSkills([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateForm = (
    field: keyof ResumeForm,
    value: string | number | boolean,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveResume = async () => {
    setIsSaving(true);
    setMessage("");
    setError("");

    if (!getStoredAccessToken()) {
      setError("Для створення CV потрібно увійти в акаунт кандидата.");
      setIsSaving(false);
      return;
    }

    if (!form.title.trim() || !form.desiredPosition.trim()) {
      setError("Заповни назву CV і бажану посаду.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await hiredInApi.createResume({
        title: form.title.trim(),
        desiredPosition: form.desiredPosition.trim(),
        summary: form.summary.trim() || null,
        employmentType: form.employmentType,
        workFormat: form.workFormat,
        experienceLevel: form.experienceLevel,
        visibility: form.visibility,
        isPrimary: form.isPrimary,
      });

      const resumeId = extractResumeId(response);
      if (!resumeId) {
        throw new Error("Не вдалося отримати Resume ID після створення CV.");
      }

      storeResumeId(resumeId);

      for (const item of workExperiences.filter(
        (entry) => entry.companyName.trim() && entry.positionTitle.trim(),
      )) {
        await hiredInApi.createResumeWorkExperience({
          resumeId,
          companyName: item.companyName.trim(),
          positionTitle: item.positionTitle.trim(),
          startDate: normalizeDate(item.startDate),
          endDate: item.isCurrent ? null : normalizeDate(item.endDate),
          isCurrent: item.isCurrent,
          description: item.description.trim() || null,
        });
      }

      for (const item of educations.filter(
        (entry) => entry.institutionName.trim() && entry.degree.trim(),
      )) {
        await hiredInApi.createResumeEducation({
          resumeId,
          institutionName: item.institutionName.trim(),
          degree: item.degree.trim(),
          fieldOfStudy: item.fieldOfStudy.trim() || null,
          startDate: normalizeDate(item.startDate),
          endDate: normalizeDate(item.endDate),
          description: item.description.trim() || null,
        });
      }

      const uniqueSkills = Array.from(
        new Map(
          resumeSkills
            .filter((item) => item.skillId)
            .map((item) => [item.skillId, item]),
        ).values(),
      );

      for (const item of uniqueSkills) {
        await hiredInApi.createResumeSkill({
          resumeId,
          skillId: item.skillId,
          level: item.level,
        });
      }

      setMessage("CV збережено. Дані з'являться у профілі кандидата.");
      navigate("/candidateCabinet");
    } catch (err) {
      setError(getResumeSaveErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#081426] text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:px-[80px] lg:py-12">
        <section className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                Створи резюме для заявок і AI-підбору
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#A8B6CD] sm:text-base">
                Заповни CV повністю: основну інформацію, досвід, освіту і
                навички. Саме ці дані потім показуються у профілі кандидата.
              </p>
            </div>

            <button
              type="button"
              onClick={saveResume}
              disabled={isSaving}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-bold text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Зберігаємо..." : "Зберегти CV"}
            </button>
          </div>

          {(message || error) && (
            <div
              className={`mt-6 rounded-xl border p-4 text-sm leading-6 ${
                error
                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {error || message}
            </div>
          )}

          <div className="mt-8 grid gap-6">
            <Section title="Основна інформація">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Назва CV"
                  value={form.title}
                  onChange={(value) => updateForm("title", value)}
                  placeholder="Frontend CV"
                />
                <Field
                  label="Бажана посада"
                  value={form.desiredPosition}
                  onChange={(value) => updateForm("desiredPosition", value)}
                  placeholder="Senior Frontend Engineer"
                />
                <SelectField
                  label="Тип зайнятості"
                  value={form.employmentType}
                  options={employmentOptions}
                  onChange={(value) => updateForm("employmentType", value)}
                />
                <SelectField
                  label="Формат роботи"
                  value={form.workFormat}
                  options={workFormatOptions}
                  onChange={(value) => updateForm("workFormat", value)}
                />
                <SelectField
                  label="Рівень"
                  value={form.experienceLevel}
                  options={experienceOptions}
                  onChange={(value) => updateForm("experienceLevel", value)}
                />
                <SelectField
                  label="Видимість"
                  value={form.visibility}
                  options={visibilityOptions}
                  onChange={(value) => updateForm("visibility", value)}
                />
              </div>

              <TextArea
                label="Коротко про себе"
                value={form.summary}
                onChange={(value) => updateForm("summary", value)}
                placeholder="Опиши досвід, сильні сторони та бажаний напрям."
              />

              <label className="mt-4 flex items-center gap-3 text-sm text-[#C8D3E3]">
                <input
                  type="checkbox"
                  checked={form.isPrimary}
                  onChange={(event) =>
                    updateForm("isPrimary", event.target.checked)
                  }
                  className="h-4 w-4 rounded border-[#1E3151] bg-[#081426] accent-blue-500"
                />
                Зробити основним резюме
              </label>
            </Section>

            <Section
              title="Досвід роботи"
              action={
                <AddButton
                  onClick={() =>
                    setWorkExperiences((current) => [
                      ...current,
                      createWorkExperience(),
                    ])
                  }
                >
                  Додати досвід
                </AddButton>
              }
            >
              <div className="space-y-4">
                {workExperiences.map((item) => (
                  <EditorCard
                    key={item.key}
                    onRemove={() =>
                      setWorkExperiences((current) =>
                        current.filter((entry) => entry.key !== item.key),
                      )
                    }
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        label="Компанія"
                        value={item.companyName}
                        onChange={(value) =>
                          updateWorkExperience(
                            item.key,
                            "companyName",
                            value,
                            setWorkExperiences,
                          )
                        }
                        placeholder="Назва компанії"
                      />
                      <Field
                        label="Посада"
                        value={item.positionTitle}
                        onChange={(value) =>
                          updateWorkExperience(
                            item.key,
                            "positionTitle",
                            value,
                            setWorkExperiences,
                          )
                        }
                        placeholder="Frontend Developer"
                      />
                      <Field
                        label="Початок"
                        type="date"
                        value={item.startDate}
                        onChange={(value) =>
                          updateWorkExperience(
                            item.key,
                            "startDate",
                            value,
                            setWorkExperiences,
                          )
                        }
                      />
                      <Field
                        label="Кінець"
                        type="date"
                        value={item.endDate}
                        disabled={item.isCurrent}
                        onChange={(value) =>
                          updateWorkExperience(
                            item.key,
                            "endDate",
                            value,
                            setWorkExperiences,
                          )
                        }
                      />
                    </div>
                    <label className="mt-4 flex items-center gap-3 text-sm text-[#C8D3E3]">
                      <input
                        type="checkbox"
                        checked={item.isCurrent}
                        onChange={(event) =>
                          updateWorkExperience(
                            item.key,
                            "isCurrent",
                            event.target.checked,
                            setWorkExperiences,
                          )
                        }
                        className="h-4 w-4 accent-blue-500"
                      />
                      Працюю тут зараз
                    </label>
                    <TextArea
                      label="Опис"
                      value={item.description}
                      onChange={(value) =>
                        updateWorkExperience(
                          item.key,
                          "description",
                          value,
                          setWorkExperiences,
                        )
                      }
                      placeholder="Коротко опиши задачі, стек і результати."
                    />
                  </EditorCard>
                ))}
                {workExperiences.length === 0 && (
                  <EmptyText>Досвід ще не додано.</EmptyText>
                )}
              </div>
            </Section>

            <Section
              title="Освіта"
              action={
                <AddButton
                  onClick={() =>
                    setEducations((current) => [...current, createEducation()])
                  }
                >
                  Додати освіту
                </AddButton>
              }
            >
              <div className="space-y-4">
                {educations.map((item) => (
                  <EditorCard
                    key={item.key}
                    onRemove={() =>
                      setEducations((current) =>
                        current.filter((entry) => entry.key !== item.key),
                      )
                    }
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        label="Навчальний заклад"
                        value={item.institutionName}
                        onChange={(value) =>
                          updateEducation(
                            item.key,
                            "institutionName",
                            value,
                            setEducations,
                          )
                        }
                        placeholder="Університет"
                      />
                      <Field
                        label="Ступінь"
                        value={item.degree}
                        onChange={(value) =>
                          updateEducation(
                            item.key,
                            "degree",
                            value,
                            setEducations,
                          )
                        }
                        placeholder="Бакалавр"
                      />
                      <Field
                        label="Спеціальність"
                        value={item.fieldOfStudy}
                        onChange={(value) =>
                          updateEducation(
                            item.key,
                            "fieldOfStudy",
                            value,
                            setEducations,
                          )
                        }
                        placeholder="Комп'ютерні науки"
                      />
                      <Field
                        label="Початок"
                        type="date"
                        value={item.startDate}
                        onChange={(value) =>
                          updateEducation(
                            item.key,
                            "startDate",
                            value,
                            setEducations,
                          )
                        }
                      />
                      <Field
                        label="Кінець"
                        type="date"
                        value={item.endDate}
                        onChange={(value) =>
                          updateEducation(
                            item.key,
                            "endDate",
                            value,
                            setEducations,
                          )
                        }
                      />
                    </div>
                    <TextArea
                      label="Опис"
                      value={item.description}
                      onChange={(value) =>
                        updateEducation(
                          item.key,
                          "description",
                          value,
                          setEducations,
                        )
                      }
                      placeholder="Додаткові курси, досягнення або тема дипломної."
                    />
                  </EditorCard>
                ))}
                {educations.length === 0 && (
                  <EmptyText>Освіту ще не додано.</EmptyText>
                )}
              </div>
            </Section>

            <Section
              title="Навички"
              action={
                <AddButton
                  onClick={() =>
                    setResumeSkills((current) => [...current, createSkill()])
                  }
                >
                  Додати навичку
                </AddButton>
              }
            >
              <div className="grid gap-3 md:grid-cols-2">
                {resumeSkills.map((item) => (
                  <div
                    key={item.key}
                    className="grid gap-3 rounded-xl border border-[#1E3151] bg-[#081426] p-4"
                  >
                    <select
                      value={item.skillId}
                      onChange={(event) =>
                        updateSkill(
                          item.key,
                          "skillId",
                          event.target.value,
                          setResumeSkills,
                        )
                      }
                      className="h-11 rounded-lg border border-[#1E3151] bg-[#081426] px-3 text-sm text-white outline-none focus:border-blue-500"
                    >
                      <option value="">Обери навичку</option>
                      {availableSkills.map((skill) => (
                        <option
                          key={skill.id ?? skill.Id}
                          value={skill.id ?? skill.Id}
                        >
                          {skill.name ?? skill.Name}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <select
                        value={item.level}
                        onChange={(event) =>
                          updateSkill(
                            item.key,
                            "level",
                            Number(event.target.value),
                            setResumeSkills,
                          )
                        }
                        className="h-11 min-w-0 flex-1 rounded-lg border border-[#1E3151] bg-[#081426] px-3 text-sm text-white outline-none focus:border-blue-500"
                      >
                        {skillLevelOptions.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setResumeSkills((current) =>
                            current.filter((entry) => entry.key !== item.key),
                          )
                        }
                        aria-label="Видалити навичку"
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-500/40 text-red-300 transition hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {resumeSkills.length === 0 && (
                <EmptyText>Навички ще не додано.</EmptyText>
              )}
              {availableSkills.length === 0 && (
                <p className="mt-4 text-sm text-[#8FA1BB]">
                  Список навичок не завантажився або ще порожній у системі.
                </p>
              )}
            </Section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#1E3151] bg-[#0A1628] p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-3 text-lg font-black">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function EditorCard({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#1E3151] bg-[#0A1628]/70 p-4">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-500/40 px-3 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Видалити
        </button>
      </div>
      {children}
    </div>
  );
}

function AddButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#2F5C95] bg-[#10284A] px-4 text-sm font-semibold text-blue-200 transition hover:bg-[#183965]"
    >
      <Plus className="h-4 w-4" />
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
  disabled = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: "text" | "date";
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[#8EA0BA]">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-xl border border-[#1E3151] bg-[#081426] px-4 text-sm text-white outline-none transition placeholder:text-[#526783] focus:border-blue-500 disabled:opacity-50"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-4 block">
      <span className="text-xs font-semibold text-[#8EA0BA]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="mt-2 w-full rounded-xl border border-[#1E3151] bg-[#081426] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#526783] focus:border-blue-500"
        placeholder={placeholder}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: Array<{ value: number; label: string }>;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[#8EA0BA]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-11 w-full rounded-xl border border-[#1E3151] bg-[#081426] px-4 text-sm text-white outline-none transition focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function EmptyText({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-[#1E3151] bg-[#081426] px-4 py-5 text-sm text-[#8FA1BB]">
      {children}
    </div>
  );
}

function updateWorkExperience(
  key: string,
  field: keyof WorkExperienceForm,
  value: string | boolean,
  setItems: React.Dispatch<React.SetStateAction<WorkExperienceForm[]>>,
) {
  setItems((current) =>
    current.map((item) =>
      item.key === key ? { ...item, [field]: value } : item,
    ),
  );
}

function updateEducation(
  key: string,
  field: keyof EducationForm,
  value: string,
  setItems: React.Dispatch<React.SetStateAction<EducationForm[]>>,
) {
  setItems((current) =>
    current.map((item) =>
      item.key === key ? { ...item, [field]: value } : item,
    ),
  );
}

function updateSkill(
  key: string,
  field: keyof SkillForm,
  value: string | number,
  setItems: React.Dispatch<React.SetStateAction<SkillForm[]>>,
) {
  setItems((current) =>
    current.map((item) =>
      item.key === key ? { ...item, [field]: value } : item,
    ),
  );
}

function createWorkExperience(): WorkExperienceForm {
  return {
    key: createLocalKey(),
    companyName: "",
    positionTitle: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  };
}

function createEducation(): EducationForm {
  return {
    key: createLocalKey(),
    institutionName: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

function createSkill(): SkillForm {
  return {
    key: createLocalKey(),
    skillId: "",
    level: SkillLevel.Intermediate,
  };
}

function createLocalKey() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeDate(value: string) {
  return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : null;
}

function isGuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
