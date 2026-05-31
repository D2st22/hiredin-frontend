import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CandidateActions from "../components/CandidateProfile/CandidateActions";
import CandidateApplications from "../components/CandidateProfile/CandidateApplications";
import CandidateCabinetTopbar from "../components/CandidateProfile/CandidateCabinetTopbar";
import CandidateProfileHero from "../components/CandidateProfile/CandidateProfileHero";
import CandidateSection from "../components/CandidateProfile/CandidateSection";
import CandidateSidebar from "../components/CandidateProfile/CandidateSidebar";
import EditBlockButton from "../components/CandidateProfile/EditBlockButton";
import EducationCard from "../components/CandidateProfile/EducationCard";
import ExperienceCard from "../components/CandidateProfile/ExperienceCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  hiredInApi,
  type CandidateProfileRead,
  type ResumeEducationRead,
  type ResumeRead,
  type ResumeSkillRead,
  type ResumeWorkExperienceRead,
} from "../services/hiredInApi";

type EditingBlock =
  | "hero"
  | "about"
  | "experience"
  | "education"
  | "info"
  | "skills"
  | null;

type CandidateProfileForm = {
  city: string;
  about: string;
  openToWork: boolean;
};

const candidateToForm = (
  profile?: CandidateProfileRead | null,
): CandidateProfileForm => ({
  city: profile?.city ?? "",
  about: profile?.about ?? "",
  openToWork: profile?.openToWork ?? true,
});

function getStoredUserName() {
  try {
    const user = JSON.parse(localStorage.getItem("hiredin.user") ?? "null") as {
      fullName?: string | null;
      email?: string | null;
    } | null;

    return user?.fullName || user?.email || "Кандидат";
  } catch {
    return "Кандидат";
  }
}

function hasValue(value: unknown) {
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "boolean") return true;
  return value !== null && value !== undefined;
}

function calculateProfileCompletion({
  profile,
  resume,
  workExperiences,
  educations,
  skills,
}: {
  profile: CandidateProfileForm;
  resume: ResumeRead | null;
  workExperiences: ResumeWorkExperienceRead[];
  educations: ResumeEducationRead[];
  skills: ResumeSkillRead[];
}) {
  const checks = [
    hasValue(profile.city),
    hasValue(profile.about),
    hasValue(profile.openToWork),
    hasValue(resume?.title),
    hasValue(resume?.desiredPosition),
    hasValue(resume?.summary),
    hasValue(resume?.employmentType),
    hasValue(resume?.workFormat),
    hasValue(resume?.experienceLevel),
    workExperiences.length > 0,
    educations.length > 0,
    skills.length > 0,
  ];

  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

export default function CandidateCabinetView() {
  const candidateName = getStoredUserName();
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlock, setEditingBlock] = useState<EditingBlock>(null);
  const [avatarUrl] = useState<string | null>(() =>
    localStorage.getItem("hiredin.avatarUrl"),
  );
  const [profile, setProfile] = useState<CandidateProfileRead | null>(null);
  const [profileForm, setProfileForm] =
    useState<CandidateProfileForm>(candidateToForm());
  const [resumes, setResumes] = useState<ResumeRead[]>([]);
  const [workExperiences, setWorkExperiences] = useState<
    ResumeWorkExperienceRead[]
  >([]);
  const [educations, setEducations] = useState<ResumeEducationRead[]>([]);
  const [skills, setSkills] = useState<ResumeSkillRead[]>([]);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const primaryResume = useMemo(
    () => resumes.find((resume) => resume.isPrimary) ?? resumes[0] ?? null,
    [resumes],
  );

  const completionPercent = useMemo(
    () =>
      calculateProfileCompletion({
        profile: profileForm,
        resume: primaryResume,
        workExperiences,
        educations,
        skills,
      }),
    [educations, primaryResume, profileForm, skills, workExperiences],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadCandidateData() {
      try {
        const [profileData, resumeItems] = await Promise.all([
          hiredInApi.getMyCandidateProfile().catch(() => null),
          hiredInApi.getMyResumes().catch(() => []),
        ]);

        if (!isMounted) return;
        setProfile(profileData);
        setProfileForm(candidateToForm(profileData));
        setResumes(resumeItems ?? []);

        const resume =
          resumeItems.find((item) => item.isPrimary) ?? resumeItems[0];
        if (!resume?.id) {
          setWorkExperiences([]);
          setEducations([]);
          setSkills([]);
          return;
        }

        const [workItems, educationItems, skillItems] = await Promise.all([
          hiredInApi.getResumeWorkExperiences(resume.id).catch(() => []),
          hiredInApi.getResumeEducations(resume.id).catch(() => []),
          hiredInApi.getResumeSkills(resume.id).catch(() => []),
        ]);

        if (!isMounted) return;
        setWorkExperiences(workItems ?? []);
        setEducations(educationItems ?? []);
        setSkills(skillItems ?? []);
      } catch {
        if (!isMounted) return;
        setProfileForm(candidateToForm());
        setResumes([]);
        setWorkExperiences([]);
        setEducations([]);
        setSkills([]);
      }
    }

    loadCandidateData();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateProfileField = (
    field: keyof CandidateProfileForm,
    value: string | boolean,
  ) => {
    setSaveState("idle");
    setProfileForm((current) => ({ ...current, [field]: value }));
  };

  const saveProfile = async () => {
    setSaveState("saving");
    try {
      await hiredInApi.updateMyCandidateProfile({
        city: profileForm.city,
        about: profileForm.about,
        openToWork: profileForm.openToWork,
      });
      setProfile((current) => ({
        id: current?.id ?? profile?.id ?? "",
        city: profileForm.city,
        about: profileForm.about,
        openToWork: profileForm.openToWork,
      }));
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  };

  const saveBlock = async () => {
    if (editingBlock === "about" || editingBlock === "info") {
      const saved = await saveProfile();
      if (!saved) return;
    }
    setEditingBlock(null);
  };

  const publishChanges = async () => {
    const saved = await saveProfile();
    if (!saved) return;
    setIsEditing(false);
    setEditingBlock(null);
  };

  const cancelEditing = () => {
    setProfileForm(candidateToForm(profile));
    setIsEditing(false);
    setEditingBlock(null);
    setSaveState("idle");
  };

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <Header />
      <main
        className={`mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-[80px] ${
          editingBlock ? "pb-28 md:pb-10" : ""
        }`}
      >
        <div className="space-y-8">
          <CandidateCabinetTopbar
            isEditing={isEditing}
            completionPercent={completionPercent}
            onEdit={() => {
              setIsEditing(true);
              setEditingBlock(null);
            }}
            onPublish={publishChanges}
            onCancelEdit={cancelEditing}
          />
          {saveState === "saved" && (
            <p className="-mt-5 text-sm font-semibold text-emerald-400">
              Зміни збережено.
            </p>
          )}
          {saveState === "error" && (
            <p className="-mt-5 text-sm font-semibold text-red-400">
              Не вдалося зберегти зміни. Перевір авторизацію або спробуй ще раз.
            </p>
          )}
          <CandidateProfileHero
            viewer="candidate"
            isEditing={false}
            isBlockEditing={false}
            fullName={candidateName}
            position={primaryResume?.desiredPosition || "Посада не вказана"}
            city={profileForm.city}
            openToWork={profileForm.openToWork}
            avatarUrl={avatarUrl}
            experienceLabel={formatExperienceCount(workExperiences.length)}
          />
          {!isEditing && <CandidateActions />}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-6">
            <CandidateSection
              title="Про мене"
              action={
                editingBlock === "about" ? (
                  <SaveButton onClick={saveBlock} />
                ) : isEditing ? (
                  <EditBlockButton onClick={() => setEditingBlock("about")} />
                ) : undefined
              }
              className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 sm:p-8"
            >
              {editingBlock === "about" ? (
                <textarea
                  value={profileForm.about}
                  onChange={(event) =>
                    updateProfileField("about", event.target.value)
                  }
                  className="min-h-[320px] w-full resize-y rounded-xl border border-[#1E3151] bg-[#0A1628] p-4 text-sm leading-6 text-[#D7E1EF] outline-none transition-colors placeholder:text-[#526783] focus:border-blue-500"
                  placeholder="Розкажи про досвід, контакти, проєкти й очікування."
                />
              ) : (
                <div className="max-w-[780px] whitespace-pre-line text-sm leading-6 text-[#B8C4D6]">
                  {profileForm.about || "Опис поки не додано."}
                </div>
              )}
            </CandidateSection>

            <CandidateSection
              title="Досвід роботи"
              action={isEditing ? <BuilderLink /> : undefined}
              className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 sm:p-8"
            >
              <div className="space-y-4">
                {workExperiences.length === 0 ? (
                  <EmptyProfileBlock text="Досвід роботи ще не додано." />
                ) : (
                  workExperiences.map((item, index) => (
                    <ExperienceCard
                      key={`${item.resumeId}-${item.companyName}-${item.positionTitle}-${index}`}
                      logo={getInitial(item.companyName)}
                      logoClassName="bg-blue-600"
                      title={item.positionTitle || "Посада"}
                      company={item.companyName || "Компанія"}
                      period={formatPeriod(
                        item.startDate,
                        item.endDate,
                        item.isCurrent,
                      )}
                      duration={item.isCurrent ? "Поточна роль" : ""}
                      description={
                        item.description || "Опис досвіду не додано."
                      }
                      isCurrent={item.isCurrent}
                    />
                  ))
                )}
              </div>
            </CandidateSection>

            <CandidateSection
              title="Освіта"
              action={isEditing ? <BuilderLink /> : undefined}
              className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 sm:p-8"
            >
              <div className="space-y-3">
                {educations.length === 0 ? (
                  <EmptyProfileBlock text="Освіту ще не додано." />
                ) : (
                  educations.map((item) => (
                    <EducationCard
                      key={item.id}
                      logo={getInitial(item.institutionName)}
                      logoClassName="bg-violet-600"
                      title={item.institutionName}
                      subtitle={[item.degree, item.fieldOfStudy]
                        .filter(Boolean)
                        .join(" · ")}
                      years={formatPeriod(item.startDate, item.endDate)}
                    />
                  ))
                )}
              </div>
            </CandidateSection>

            {!isEditing && <CandidateApplications />}
          </div>

          <CandidateSidebar
            isEditing={isEditing}
            editingBlock={editingBlock === "info" ? editingBlock : null}
            city={profileForm.city}
            openToWork={profileForm.openToWork}
            skills={skills}
            resumes={resumes}
            onEditBlock={setEditingBlock}
            onSaveBlock={saveBlock}
            onProfileFieldChange={(field, value) =>
              updateProfileField(field, value)
            }
          />
        </div>
      </main>
      {(editingBlock === "about" || editingBlock === "info") && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1E3151] bg-[#0A1628]/95 p-4 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={saveBlock}
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(59,130,246,0.75)]"
          >
            Зберегти блок
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden h-9 min-w-[140px] items-center justify-center rounded-lg bg-[#1B3153] px-4 text-sm font-semibold text-blue-300 transition-colors hover:bg-[#25446F] sm:inline-flex"
    >
      Зберегти
    </button>
  );
}

function BuilderLink() {
  return (
    <Link
      to="/resume-builder"
      className="inline-flex h-10 items-center justify-center rounded-lg border border-blue-500/20 px-4 text-sm font-semibold text-blue-400 transition-colors hover:bg-blue-500/10 hover:text-blue-300"
    >
      Редагувати в конструкторі CV
    </Link>
  );
}

function EmptyProfileBlock({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#1E3151] bg-[#0A1628]/50 px-5 py-6 text-sm text-[#8FA1BB]">
      {text}
    </div>
  );
}

function getInitial(value?: string | null) {
  return value?.trim().slice(0, 1).toUpperCase() || "К";
}

function formatPeriod(
  start?: string | null,
  end?: string | null,
  isCurrent = false,
) {
  const startText = formatYear(start);
  const endText = isCurrent ? "зараз" : formatYear(end);
  if (!startText && !endText) return "Період не вказано";
  return [startText, endText].filter(Boolean).join(" - ");
}

function formatYear(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return String(date.getFullYear());
}

function formatExperienceCount(count: number) {
  if (count <= 0) return "Досвід не вказано";
  if (count === 1) return "1 запис досвіду";
  return `${count} записи досвіду`;
}
