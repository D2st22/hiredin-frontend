import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

export default function ResourceCards() {
  const { isEnglish } = useLanguage();

  return (
    <section className="w-full bg-[#0A1628] py-12 md:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            to="/for-candidates"
            className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 transition-colors hover:border-[#2A436D]"
          >
            <div className="pointer-events-none absolute -left-10 -top-10 h-[250px] w-[250px] rounded-full bg-[#F5C84C]/10 blur-[80px]" />

            <div className="relative z-10 flex flex-1 flex-col">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] shadow-[0_0_24px_rgba(245,158,11,0.3)]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  <path d="M8 7h6" />
                  <path d="M8 11h8" />
                </svg>
              </div>

              <h3 className="mb-3 text-[20px] font-bold leading-snug text-[#E6ECF5]">
                {isEnglish ? "How to find a job, step by step" : "Як знайти роботу - покроково"}
              </h3>
              <p className="mb-10 text-[14px] leading-relaxed text-[#A8B6CD]">
                {isEnglish
                  ? "From the first search to a signed offer. Practical guidance for every stage."
                  : "Від першого пошуку до підписаного офера. Практичні поради для кожного етапу."}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <div className="text-[14px] font-semibold text-[#F5C84C] transition-transform group-hover:translate-x-1">
                  {isEnglish ? "Start ->" : "Вперед ->"}
                </div>
                <div className="rounded-md border border-[#F5C84C]/20 bg-[#F5C84C]/10 px-3 py-1">
                  <span className="text-[12px] font-medium text-[#F5C84C]">
                    {isEnglish ? "Guide" : "Гайд"}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/resume-builder"
            className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 transition-colors hover:border-[#2A436D]"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-[250px] w-[250px] rounded-full bg-blue-500/10 blur-[80px]" />

            <div className="relative z-10 flex flex-1 flex-col">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#60A5FA] to-[#2563EB] shadow-[0_0_24px_rgba(37,99,235,0.3)]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>

              <h3 className="mb-3 text-[20px] font-bold leading-snug text-[#E6ECF5]">
                {isEnglish ? "Resume builder" : "Конструктор резюме"}
              </h3>
              <p className="mb-10 text-[14px] leading-relaxed text-[#A8B6CD]">
                {isEnglish
                  ? "Create a CV, add education, work experience, skills, and attach a file for applications."
                  : "Створи CV, додай освіту, досвід, навички та прикріпи файл для заявок."}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <div className="text-[14px] font-semibold text-[#60A5FA] transition-transform group-hover:translate-x-1">
                  {isEnglish ? "Create resume ->" : "Створити резюме ->"}
                </div>
                <div className="rounded-md border border-[#3B82F6]/20 bg-[#3B82F6]/10 px-3 py-1">
                  <span className="text-[12px] font-medium text-[#60A5FA]">
                    {isEnglish ? "API ready" : "Через API"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
