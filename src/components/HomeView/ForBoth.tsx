import { useLanguage } from "../../i18n/LanguageContext";

const cards = [
  {
    num: "01",
    title: { uk: "Релевантні вакансії", en: "Relevant jobs" },
    desc: {
      uk: "Фільтри за стеком, зарплатою, форматом роботи",
      en: "Filters by stack, salary, and work format",
    },
  },
  {
    num: "02",
    title: { uk: "Прозорий статус", en: "Clear status" },
    desc: {
      uk: "Бачте, що відбувається з заявкою — без здогадок",
      en: "See what happens with each application, no guessing",
    },
  },
  {
    num: "03",
    title: { uk: "Прямий контакт", en: "Direct contact" },
    desc: {
      uk: "Чат з рекрутером без ботів та посередників",
      en: "Chat with recruiters without bots or middlemen",
    },
  },
  {
    num: "04",
    title: { uk: "Одне резюме", en: "One resume" },
    desc: {
      uk: "Будуйте профіль один раз, подавайтесь скрізь",
      en: "Build your profile once and apply everywhere",
    },
  },
];

export default function ForBoth() {
  const { isEnglish } = useLanguage();
  const lang = isEnglish ? "en" : "uk";

  return (
    <section className="w-full ">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-[56px] py-14 md:py-[80px]">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-[56px]">
          <div className="font-inter text-[20px] font-[600] text-[#ffd23f] leading-[18px] mb-[16px]">
            {isEnglish ? "For everyone" : "Для всіх"}
          </div>
          <h2 className="font-manrope text-3xl md:text-[34px] font-[700] text-[#f0f4fa] leading-tight md:leading-[51px] m-0 mb-[8px]">
            {isEnglish
              ? "Built for both sides"
              : "Побудовано для обох сторін"}
          </h2>
          <p className="font-inter text-[15px] font-[400] text-[#a8b6ce] leading-[22px] m-0">
            {isEnglish
              ? "Candidates search. Employers hire."
              : "Кандидати шукають. Роботодавці наймають."}
          </p>
        </div>

        {/* 4 cards in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {cards.map((c, i) => (
            <div
              key={i}
              className="bg-[#0f1d35] border border-[#223b5e] rounded-[10px] p-[23px]"
            >
              <div className="font-manrope text-[28px] font-[300] text-[#ffd23f] leading-[42px] mb-[16px]">
                {c.num}
              </div>
              <div className="font-inter text-[14px] font-[600] text-[#f0f4fa] leading-[21px] mb-[8px]">
                {c.title[lang]}
              </div>
              <div className="font-inter text-[12px] font-[400] text-[#6b7d9d] leading-[18px]">
                {c.desc[lang]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
