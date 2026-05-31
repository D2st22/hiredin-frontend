import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { UserRole } from "../../services/hiredInTypes";

export default function Hero() {
  const navigate = useNavigate();
  const { isEnglish } = useLanguage();
  const [aiAccessMessage, setAiAccessMessage] = useState("");

  function handleAiAssistantClick() {
    const token =
      localStorage.getItem("hiredin.accessToken") ??
      localStorage.getItem("accessToken") ??
      localStorage.getItem("token");
    const role = Number(localStorage.getItem("hiredin.userRole"));

    if (!token) {
      navigate("/candidateRegistration");
      return;
    }

    if (role === UserRole.Employer) {
      setAiAccessMessage(
        isEnglish
          ? "This feature is available only to candidates. Company accounts cannot use AI job matching."
          : "Ви не можете користуватися цією функцією, бо ви компанія.",
      );
      return;
    }

    navigate("/ai-vacancy-match");
  }

  return (
    <section className="relative w-full bg-[#0A1628] overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Фонові свічення */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* ЛІВА КОЛОНКА */}
        <div className="flex-1 flex flex-col items-start w-full">
          {/* Заголовок */}
          <h1 className="text-4xl sm:text-[48px] lg:text-[64px] font-bold text-white leading-[1.1] mb-6">
            {isEnglish ? "Jobs in Ukraine —" : "Робота в Україні —"} <br />
            <span className="text-[#F5C84C]">
              {isEnglish ? "without middlemen" : "без посередників"}
            </span>
          </h1>

          {/* Опис */}
          <p className="text-[#A8B6CD] text-[16px] lg:text-[18px] leading-relaxed mb-10 max-w-[540px]">
            {isEnglish
              ? "Find jobs directly from Ukrainian companies. Honest salaries, clear requirements, and direct contact with employers."
              : "Знайдіть роботу напряму від українських компаній. Чесні зарплати, прозорі вимоги, прямий контакт з роботодавцем."}
          </p>

          {/* Кнопки (КЛІКАБЕЛЬНІ) */}
          <div className="flex w-full flex-col sm:w-auto sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4 mb-10 md:mb-14">
            <Link
              to="/vacanciesList"
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[15px] font-semibold rounded-xl px-7 py-3.5 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(59,130,246,0.25)] transition-all"
            >
              {isEnglish ? "Find a job" : "Шукати роботу"}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/for-companies"
              className="bg-transparent border border-[#1E3151] hover:bg-[#0F1D36] text-white text-[15px] font-medium rounded-xl px-7 py-3.5 transition-all"
            >
              {isEnglish ? "I'm an employer" : "Я роботодавець"}
            </Link>
          </div>

          {/* Статистика (без ліній, як на скриншоті) */}
          <div className="grid grid-cols-3 gap-4 md:gap-16 pt-8 border-t border-[#1E3151]/50 w-full max-w-[540px]">
            <div>
              <div className="text-[28px] font-bold text-white mb-1">
                15 000+
              </div>
              <div className="text-[#6B7D99] text-[13px]">
                {isEnglish ? "Candidates" : "Кандидатів"}
              </div>
            </div>
            <div>
              <div className="text-[28px] font-bold text-white mb-1">200+</div>
              <div className="text-[#6B7D99] text-[13px]">
                {isEnglish ? "Companies" : "Компаній"}
              </div>
            </div>
            <div>
              <div className="text-[28px] font-bold text-white mb-1">3.5K</div>
              <div className="text-[#6B7D99] text-[13px]">
                {isEnglish ? "Jobs" : "Вакансій"}
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА */}
        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[520px] bg-gradient-to-br from-[#111F38] to-[#0A1628] border border-[#1E3151] rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)]">
            {/* Вміст картки */}
            <div className="p-5 sm:p-8">
              {/* Шапка картки */}
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#A855F7] to-[#6366F1] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
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
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#F5C84C] text-[13px] font-semibold tracking-wide">
                      {isEnglish
                        ? "New · AI Assistant"
                        : "Новинка · AI-Assistant"}
                    </span>
                    <span className="text-[#6B7D99] text-[13px]">
                      {isEnglish ? "for candidates" : "для кандидатів"}
                    </span>
                  </div>
                </div>
                {/* Декоративна іконка */}
                <button
                  type="button"
                  onClick={handleAiAssistantClick}
                  aria-label={
                    isEnglish
                      ? "Open AI job matching"
                      : "Відкрити AI-підбір вакансій"
                  }
                  className="w-8 h-8 bg-[#0F1D36] border border-[#1E3151] rounded-lg flex items-center justify-center text-[#6B7D99] transition hover:border-blue-400/60 hover:text-blue-300"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </button>
              </div>

              {aiAccessMessage && (
                <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm leading-5 text-amber-200">
                  {aiAccessMessage}
                </div>
              )}

              {/* Заголовок */}
              <h3 className="text-2xl sm:text-[26px] font-bold text-white leading-snug mb-8">
                {isEnglish ? "Jobs looking for" : "Вакансії, що шукають"} <br />
                {isEnglish ? "someone like you" : "саме тебе"}
              </h3>

              {/* Список фіч */}
              <div className="flex flex-col gap-4 mb-8">
                {[
                  isEnglish
                    ? "Matching based on your CV, without manual filters"
                    : "Підбір на основі твого CV — без ручних фільтрів",
                  isEnglish
                    ? "Explains why the job fits"
                    : "Пояснює, чому вакансія підходить",
                  isEnglish
                    ? "Suggests what to improve in your resume"
                    : "Підказує, що покращити в резюме",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    <span className="text-[#A8B6CD] text-[14px]">{text}</span>
                  </div>
                ))}
              </div>

              {/* Плашка з результатом */}
              <div className="bg-[#0A1628] border border-[#1E3151] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#1A1A1A] rounded flex items-center justify-center text-white text-[11px] font-bold">
                    m
                  </div>
                  <span className="text-[#A8B6CD] text-[13px]">
                    Senior Frontend, monobank · {isEnglish ? "Kyiv" : "Київ"}
                  </span>
                </div>
                <span className="text-[#34D399] font-bold text-[13px]">
                  94%
                </span>
              </div>
            </div>

            {/* Футер картки з клікабельним посиланням */}
            <div className="bg-[#050B14]/40 border-t border-[#1E3151] px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[#6B7D99] text-[12px]">
                {isEnglish
                  ? "Analyzes 12,000+ jobs · < 5 sec"
                  : "Аналізує 12 000+ вакансій · < 5 сек"}
              </span>

              {/* КЛІКАБЕЛЬНЕ ПОСИЛАННЯ */}
              <Link
                to="/for-candidates#ai-guide"
                className="flex items-center gap-1.5 text-[#60A5FA] hover:text-[#93C5FD] transition-colors text-[13px] font-medium"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                {isEnglish ? "Learn more" : "Дізнатися більше"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
