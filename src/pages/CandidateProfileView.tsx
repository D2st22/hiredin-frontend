import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import CandidateProfileHero from "../components/CandidateProfile/CandidateProfileHero";
import CandidateSection from "../components/CandidateProfile/CandidateSection";
import CandidateSidebar from "../components/CandidateProfile/CandidateSidebar";
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

export default function CandidateProfileView() {
  const profileParams = useMemo(() => getCandidateProfileParams(), []);
  const isExternalProfile = Boolean(profileParams.name);
  const [profile, setProfile] = useState<CandidateProfileRead | null>(null);
  const [resumes, setResumes] = useState<ResumeRead[]>([]);
  const [workExperiences, setWorkExperiences] = useState<
    ResumeWorkExperienceRead[]
  >([]);
  const [educations, setEducations] = useState<ResumeEducationRead[]>([]);
  const [skills, setSkills] = useState<ResumeSkillRead[]>([]);
  const avatarUrl = localStorage.getItem("hiredin.avatarUrl");
  const candidateName = profileParams.name || getStoredUserName();

  const primaryResume = useMemo(
    () => resumes.find((resume) => resume.isPrimary) ?? resumes[0] ?? null,
    [resumes],
  );

  useEffect(() => {
    let active = true;

    async function loadCandidate() {
      if (isExternalProfile) {
        setProfile({
          id: "external-candidate",
          city: profileParams.location,
          about: profileParams.skills,
          openToWork: true,
        });
        setResumes([]);
        setWorkExperiences([]);
        setEducations([]);
        setSkills([]);
        return;
      }

      const [profileData, resumeItems] = await Promise.all([
        hiredInApi.getMyCandidateProfile().catch(() => null),
        hiredInApi.getMyResumes().catch(() => []),
      ]);

      if (!active) return;
      setProfile(profileData);
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

      if (!active) return;
      setWorkExperiences(workItems ?? []);
      setEducations(educationItems ?? []);
      setSkills(skillItems ?? []);
    }

    loadCandidate();

    return () => {
      active = false;
    };
  }, [isExternalProfile, profileParams.location, profileParams.skills]);

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-[80px]">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-[#6B7D99]">
          <Link to="/candidateProfile" className="hover:text-[#A8B6CD]">
            Кандидати
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#A8B6CD]">{candidateName}</span>
        </nav>

        <CandidateProfileHero
          avatarUrl={avatarUrl}
          fullName={candidateName}
          position={
            profileParams.role ||
            primaryResume?.desiredPosition ||
            "Посада не вказана"
          }
          city={profile?.city || ""}
          openToWork={profile?.openToWork ?? true}
          experienceLabel={formatExperienceCount(workExperiences.length)}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-12">
            <CandidateSection
              title="Про мене"
              className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 sm:p-8"
            >
              <div className="max-w-[780px] whitespace-pre-line text-sm leading-6 text-[#B8C4D6]">
                {profile?.about || "Опис поки не додано."}
              </div>
            </CandidateSection>

            <CandidateSection title="Досвід роботи">
              <div className="space-y-4">
                {workExperiences.length > 0 ? (
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
                ) : (
                  <EmptyProfileBlock text="Досвід роботи ще не додано." />
                )}
              </div>
            </CandidateSection>

            <CandidateSection title="Освіта">
              <div className="space-y-3">
                {educations.length > 0 ? (
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
                ) : (
                  <EmptyProfileBlock text="Освіту ще не додано." />
                )}
              </div>
            </CandidateSection>
          </div>

          <CandidateSidebar
            city={profile?.city || ""}
            openToWork={profile?.openToWork ?? true}
            skills={skills}
            resumes={resumes}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function getCandidateProfileParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    name: params.get("name") ?? "",
    role: params.get("role") ?? "",
    location: params.get("location") ?? "",
    skills: params.get("skills") ?? "",
  };
}

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
