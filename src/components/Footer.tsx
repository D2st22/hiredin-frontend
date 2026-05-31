import { useLanguage } from "../i18n/LanguageContext";

const footerCols = [
  {
    title: { uk: "Кандидатам", en: "Candidates" },
    links: [
      { uk: "Вакансії", en: "Jobs" },
      { uk: "Як знайти роботу", en: "How to find a job" },
      { uk: "Конструктор резюме", en: "Resume builder" },
      { uk: "Топ компаній", en: "Top companies" },
    ],
  },
  {
    title: { uk: "Роботодавцям", en: "Employers" },
    links: [
      { uk: "Розмістити вакансію", en: "Post a job" },
      { uk: "Брендинг компанії", en: "Employer branding" },
      { uk: "Для бізнесу", en: "For business" },
    ],
  },
  {
    title: { uk: "Компанія", en: "Company" },
    links: [
      { uk: "Про нас", en: "About us" },
      { uk: "Блог", en: "Blog" },
      { uk: "Кар'єра у нас", en: "Careers" },
    ],
  },
  {
    title: { uk: "Правове", en: "Legal" },
    links: [
      { uk: "Умови використання", en: "Terms of use" },
      { uk: "Конфіденційність", en: "Privacy" },
      { uk: "Політика cookies", en: "Cookie policy" },
      { uk: "Безпека даних", en: "Data security" },
    ],
  },
];

export default function Footer() {
  const { isEnglish } = useLanguage();
  const lang = isEnglish ? "en" : "uk";

  return (
    <footer className="w-full border-t border-[#1E3151]/50 bg-[#0A1628]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8 md:py-16 lg:px-[80px]">
        <div className="mb-16 flex flex-col items-start gap-16 lg:flex-row lg:gap-[120px]">
          <div className="w-[280px] flex-shrink-0">
            <div className="mb-6 flex items-center gap-3">
              <img
                src="https://d3os49tc9jbj3a.cloudfront.net/plugin-assets/ccc446a6-cf3f-4de3-9132-4abe41b229a4/b2a4df90143a-container.svg"
                alt="Kriposnyj logo"
                className="h-8 w-8 rounded-lg object-contain"
              />
              <span className="text-[18px] font-bold tracking-wide text-white">
                Kriposnyj
              </span>
            </div>

            <p className="mb-8 text-[14px] leading-relaxed text-[#6B7D99]">
              {isEnglish
                ? "Jobs in Ukraine directly from companies. No middlemen."
                : "Робота в Україні - напряму від компаній. Без посередників."}
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4">
            {footerCols.map((col) => (
              <div key={col.title.en}>
                <h3 className="mb-6 text-[14px] font-bold text-white">
                  {col.title[lang]}
                </h3>
                <ul className="flex flex-col gap-4">
                  {col.links.map((link) => (
                    <li key={link.en}>
                      <a
                        href="#"
                        className="text-[14px] text-[#A8B6CD] transition-colors hover:text-white"
                      >
                        {link[lang]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-[#1E3151]/50 pt-8 md:flex-row">
          <span className="text-[13px] text-[#6B7D99]">
            {isEnglish
              ? "© 2026 Kriposnyj. Made in Ukraine."
              : "© 2026 Kriposnyj. Зроблено в Україні."}
          </span>

          <div className="flex items-center gap-6">
            <SocialIcon type="telegram" />
            <SocialIcon type="linkedin" />
            <SocialIcon type="x" />
            <SocialIcon type="instagram" />
            <SocialIcon type="youtube" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  type,
}: {
  type: "telegram" | "linkedin" | "x" | "instagram" | "youtube";
}) {
  const commonProps = {
    width: type === "x" ? 18 : type === "youtube" ? 22 : 20,
    height: type === "x" ? 18 : type === "youtube" ? 22 : 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <a href="#" className="text-[#6B7D99] transition-colors hover:text-white">
      <svg {...commonProps}>
        {type === "telegram" && (
          <>
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </>
        )}
        {type === "linkedin" && (
          <>
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </>
        )}
        {type === "x" && (
          <>
            <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
            <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
          </>
        )}
        {type === "instagram" && (
          <>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </>
        )}
        {type === "youtube" && (
          <>
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
          </>
        )}
      </svg>
    </a>
  );
}
