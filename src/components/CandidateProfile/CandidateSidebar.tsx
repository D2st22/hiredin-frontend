import { Download, FileText } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  hiredInApi,
  type ResumeRead,
  type ResumeSkillRead,
} from "../../services/hiredInApi";
import EditBlockButton from "./EditBlockButton";

type SidebarBlock = "info" | "skills";

function SaveButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 min-w-[128px] items-center justify-center rounded-lg bg-[#1B3153] px-4 text-sm font-semibold text-blue-300 transition-colors hover:bg-[#25446F]"
    >
      Зберегти
    </button>
  );
}

function SidebarCard({
  title,
  children,
  isEditing = false,
  isBlockEditing = false,
  onEdit,
  onSave,
}: {
  title: string;
  children: ReactNode;
  isEditing?: boolean;
  isBlockEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
}) {
  return (
    <section className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-base font-bold text-white">{title}</h2>
        {isBlockEditing ? (
          <SaveButton onClick={onSave} />
        ) : (
          isEditing && onEdit && <EditBlockButton onClick={onEdit} />
        )}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function CandidateSidebar({
  isEditing = false,
  editingBlock,
  city = "",
  openToWork = true,
  skills = [],
  resumes = [],
  onEditBlock,
  onSaveBlock,
  onProfileFieldChange,
  skillsEditor,
}: {
  isEditing?: boolean;
  editingBlock?: SidebarBlock | null;
  city?: string;
  openToWork?: boolean;
  skills?: ResumeSkillRead[];
  resumes?: ResumeRead[];
  onEditBlock?: (block: SidebarBlock) => void;
  onSaveBlock?: () => void;
  onProfileFieldChange?: (
    field: "city" | "openToWork",
    value: string | boolean,
  ) => void;
  skillsEditor?: ReactNode;
}) {
  const [busyResumeId, setBusyResumeId] = useState<string | null>(null);
  const [resumeFileError, setResumeFileError] = useState<string | null>(null);

  const downloadResumeFile = async (resumeId: string) => {
    setBusyResumeId(resumeId);
    setResumeFileError(null);

    try {
      const fileUrl = await hiredInApi.getResumeFileUrl(resumeId);

      if (fileUrl) {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
      } else {
        setResumeFileError("Для цього CV ще немає завантаженого файлу.");
      }
    } catch {
      setResumeFileError("Для цього CV ще немає завантаженого файлу.");
    } finally {
      setBusyResumeId(null);
    }
  };

  return (
    <aside className="w-full shrink-0 space-y-5 lg:w-[340px]">
      <SidebarCard
        title="Ключова інформація"
        isEditing={isEditing}
        isBlockEditing={editingBlock === "info"}
        onEdit={() => onEditBlock?.("info")}
        onSave={onSaveBlock}
      >
        {editingBlock === "info" ? (
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="text-[#8FA1BB]">Локація</span>
              <input
                value={city}
                onChange={(event) =>
                  onProfileFieldChange?.("city", event.target.value)
                }
                className="mt-2 h-11 w-full rounded-lg border border-[#1E3151] bg-[#0A1628] px-3 text-sm text-white outline-none transition-colors placeholder:text-[#526783] focus:border-blue-500"
                placeholder="Київ"
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-lg border border-[#1E3151] bg-[#0A1628] px-3 py-3 text-sm">
              <span>
                <span className="block font-semibold text-[#D7E1EF]">
                  Відкритий до пропозицій
                </span>
                <span className="mt-1 block text-xs text-[#8FA1BB]">
                  Компанії бачитимуть, що кандидат готовий до спілкування.
                </span>
              </span>
              <input
                type="checkbox"
                checked={openToWork}
                onChange={(event) =>
                  onProfileFieldChange?.("openToWork", event.target.checked)
                }
                className="h-5 w-5 accent-blue-500"
              />
            </label>
          </div>
        ) : (
          <dl className="space-y-5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#8FA1BB]">Статус</dt>
              <dd className="text-right font-semibold text-[#D7E1EF]">
                {openToWork ? "Відкритий до пропозицій" : "Не шукає роботу"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#8FA1BB]">Локація</dt>
              <dd className="text-right font-semibold text-[#D7E1EF]">
                {city || "Не вказано"}
              </dd>
            </div>
          </dl>
        )}
      </SidebarCard>

      <SidebarCard
        title="Навички"
        isEditing={isEditing}
        isBlockEditing={editingBlock === "skills"}
        onEdit={() => onEditBlock?.("skills")}
        onSave={onSaveBlock}
      >
        {editingBlock === "skills" ? (
          skillsEditor
        ) : skills.length > 0 ? (
          <div className="flex flex-wrap gap-x-5 gap-y-4">
            {skills.map((skill) => (
              <span
                key={`${skill.resumeId}-${skill.skillId}-${skill.skillName}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#9EADC4]"
              >
                {skill.skillName}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#8FA1BB]">Навички ще не додано.</p>
        )}
      </SidebarCard>

      <SidebarCard title="Резюме (CV)">
        <div className="space-y-3">
          {resumes.length > 0 ? (
            resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center gap-3 rounded-xl border border-[#1E3151] bg-[#0A1628] p-3 sm:gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {resume.title || resume.desiredPosition || "Моє CV"}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#6B7D99]">
                    {resume.isPrimary ? "Основне резюме" : "Резюме кандидата"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadResumeFile(resume.id)}
                  disabled={busyResumeId === resume.id}
                  aria-label="Завантажити файл CV"
                  title="Завантажити файл CV"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#172842] text-[#D7E1EF] transition-colors hover:bg-[#243856] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#8FA1BB]">CV ще не створено.</p>
          )}

          {resumeFileError && (
            <p className="text-sm font-semibold text-red-400">
              {resumeFileError}
            </p>
          )}

          {isEditing && (
            <Link
              to="/resume-builder"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white transition-colors hover:bg-blue-600"
            >
              Відкрити конструктор CV
            </Link>
          )}
        </div>
      </SidebarCard>
    </aside>
  );
}
