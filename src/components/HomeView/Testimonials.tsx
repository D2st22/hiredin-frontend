import { useLanguage } from "../../i18n/LanguageContext";

const CDN =
  "https://d3os49tc9jbj3a.cloudfront.net/plugin-assets/ccc446a6-cf3f-4de3-9132-4abe41b229a4/";

const testimonials = [
  {
    avatarColor: "#2e7df6",
    avatarInitials: { uk: "ОМ", en: "OM" },
    name: { uk: "Олена Мороз", en: "Olena Moroz" },
    role: "Frontend Developer",
    quote: {
      uk: "«Знайшла роботу за 2 тижні. Фільтр за стеком — моя улюблена фіча, він реально економить години.»",
      en: "“Found a job in 2 weeks. The stack filter is my favorite feature; it really saves hours.”",
    },
    quoteIcon: `${CDN}0ba4ab6104fd-icon-1521191.svg`,
  },
  {
    avatarColor: "#ffd23f",
    avatarInitials: { uk: "ДК", en: "DK" },
    name: { uk: "Дмитро Коваль", en: "Dmytro Koval" },
    role: "HR Lead, Uklon",
    quote: {
      uk: "«Нарешті ATS, зроблений для українського ринку — і українською. Smart Matching показує топ кандидатів одразу.»",
      en: "“Finally, an ATS made for the Ukrainian market and in Ukrainian. Smart Matching shows top candidates instantly.”",
    },
    quoteIcon: `${CDN}0ba4ab6104fd-icon-1521191.svg`,
  },
  {
    avatarColor: "#0057b7",
    avatarInitials: { uk: "АС", en: "AS" },
    name: { uk: "Анна Сидоренко", en: "Anna Sydorenko" },
    role: "Product Manager",
    quote: {
      uk: "«Мобільна версія зручна — подаюсь на вакансії в дорозі прямо з браузера телефона.»",
      en: "“The mobile version is convenient: I apply on the go right from my phone browser.”",
    },
    quoteIcon: `${CDN}0ba4ab6104fd-icon-1521191.svg`,
  },
];

export default function Testimonials() {
  const { isEnglish } = useLanguage();
  const lang = isEnglish ? "en" : "uk";

  return (
    <section className="w-full  border-t border-[#152844]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-[56px] py-14 md:py-[80px]">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-[56px]">
          <div className="font-inter text-[20px] font-[600] text-[#ffd23f] leading-[18px] mb-[16px]">
            {isEnglish ? "Reviews" : "Відгуки"}
          </div>
          <h2 className="font-manrope text-3xl md:text-[34px] font-[700] text-[#f0f4fa] leading-tight md:leading-[51px] m-0">
            {isEnglish ? "What teams say" : "Що кажуть команди"}
          </h2>
        </div>

        {/* 3 testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#0f1d35] border border-[#223b5e] rounded-[12px] p-[29px] flex flex-col gap-0"
            >
              {/* Stars */}
              <div className="flex items-center gap-[4px] mb-[16px]">
                {Array.from({ length: 5 }).map((_, si) => (
                  <FilledStar key={si} />
                ))}
              </div>

              {/* Quote */}
              <div className="flex gap-[8px] mb-[24px]">
                <img
                  src={t.quoteIcon}
                  alt="quote"
                  className="w-[28px] h-[28px] object-contain flex-shrink-0 mt-[2px]"
                />
                <p className="font-inter text-[14px] font-[400] text-[#e4e7f0] leading-[23px] m-0">
                  {t.quote[lang]}
                </p>
              </div>

              {/* Author */}
              <div className="border-t border-[#223b5e] pt-[19px] flex items-center gap-[12px]">
                <div
                  className="w-[36px] h-[36px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: t.avatarColor }}
                >
                  <span className="font-inter text-[11px] font-[700] text-[#ffffff] leading-[16px]">
                    {t.avatarInitials[lang]}
                  </span>
                </div>
                <div>
                  <div className="font-inter text-[13px] font-[600] text-[#f0f4fa] leading-[19px]">
                    {t.name[lang]}
                  </div>
                  <div className="font-inter text-[12px] font-[400] text-[#6b7d9d] leading-[18px]">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilledStar() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#F5C84C"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 2.5l2.85 5.78 6.38.93-4.62 4.5 1.09 6.36L12 17.07l-5.7 3 1.09-6.36-4.62-4.5 6.38-.93L12 2.5z" />
    </svg>
  );
}
