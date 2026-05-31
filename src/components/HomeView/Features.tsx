import { useLanguage } from "../../i18n/LanguageContext";

const features = [
  {
    // Фіолетовий градієнт зі свіченням
    icon: (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#6366F1] shadow-[0_0_24px_rgba(168,85,247,0.3)] flex items-center justify-center mb-6">
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
          <path d="M5 3v4M3 5h4" />
        </svg>
      </div>
    ),
    title: { uk: "Розумний підбір", en: "Smart matching" },
    desc: {
      uk: "Бачте відсоток співпадіння ваших навичок з вимогами вакансії ще до того, як подаєтесь.",
      en: "See how well your skills match a job before you apply.",
    },
  },
  {
    // Синій градієнт зі свіченням
    icon: (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#60A5FA] to-[#2563EB] shadow-[0_0_24px_rgba(37,99,235,0.3)] flex items-center justify-center mb-6">
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
          <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z" />
          <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
        </svg>
      </div>
    ),
    title: { uk: "Прямий чат", en: "Direct chat" },
    desc: {
      uk: "Спілкуйтесь з рекрутером напряму — без «ми вам зателефонуємо» та сторонніх посередників.",
      en: "Talk to recruiters directly, without middlemen or vague follow-ups.",
    },
  },
  {
    // Смарагдовий градієнт зі свіченням
    icon: (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#34D399] to-[#059669] shadow-[0_0_24px_rgba(5,150,105,0.3)] flex items-center justify-center mb-6">
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
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <path d="M9 16l2 2 4-4" />
        </svg>
      </div>
    ),
    title: { uk: "Чесні сторінки компаній", en: "Transparent company pages" },
    desc: {
      uk: "Культура, команда, реальні відгуки — все, що важливо знати до першого інтерв'ю.",
      en: "Culture, team, and real reviews before your first interview.",
    },
  },
];

export default function Features() {
  const { isEnglish } = useLanguage();
  const lang = isEnglish ? "en" : "uk";

  return (
    <section className="w-full bg-[#0A1628] py-14 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
        {/* Заголовки */}
        <div className="text-center mb-16">
          <div className="text-[#F5C84C] text-[15px] font-semibold tracking-wide mb-4">
            {isEnglish ? "Features" : "Можливості"}
          </div>
          <h2 className="text-[36px] md:text-[44px] font-bold text-white leading-tight">
            {isEnglish
              ? "Simple. Fast. No middlemen."
              : "Просто. Швидко. Без посередників."}
          </h2>
        </div>

        {/* 3 картки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-[#0F1D36] border border-[#1E3151] rounded-2xl p-8 flex flex-col hover:border-[#2A436D] transition-colors"
            >
              {/* Іконка */}
              {f.icon}

              {/* Текст */}
              <h3 className="text-[18px] font-bold text-[#E6ECF5] mb-3">
                {f.title[lang]}
              </h3>
              <p className="text-[14px] text-[#A8B6CD] leading-relaxed">
                {f.desc[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
