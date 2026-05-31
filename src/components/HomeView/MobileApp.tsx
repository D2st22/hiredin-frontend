import { useLanguage } from "../../i18n/LanguageContext";

const bullets = [
  {
    iconClass:
      "bg-gradient-to-br from-[#A855F7] to-[#6366F1] shadow-[0_0_24px_rgba(168,85,247,0.3)]",
    icon: (
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
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M10 18h4" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
      </svg>
    ),
    title: { uk: "Без встановлення", en: "No installation" },
    desc: {
      uk: "Відкрий сайт у браузері телефона і користуйся всіма ключовими функціями одразу.",
      en: "Open the site in your phone browser and use all key features right away.",
    },
  },
  {
    iconClass:
      "bg-gradient-to-br from-[#60A5FA] to-[#2563EB] shadow-[0_0_24px_rgba(37,99,235,0.3)]",
    icon: (
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
        <path d="M4 7h16" />
        <path d="M4 12h10" />
        <path d="M4 17h7" />
        <path d="m17 14 3 3-3 3" />
      </svg>
    ),
    title: { uk: "Зручно з малого екрана", en: "Comfortable on small screens" },
    desc: {
      uk: "Вакансії, заявки, профіль і чат адаптовані під дотик та вертикальний перегляд.",
      en: "Jobs, applications, profiles, and chats are adapted for touch and vertical browsing.",
    },
  },
  {
    iconClass:
      "bg-gradient-to-br from-[#34D399] to-[#059669] shadow-[0_0_24px_rgba(5,150,105,0.3)]",
    icon: (
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
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
    title: { uk: "Одна версія для всіх", en: "One version for everyone" },
    desc: {
      uk: "Дані синхронні на телефоні й комп'ютері, бо це той самий сайт, а не окремий застосунок.",
      en: "Your data stays in sync on phone and desktop because it is the same site, not a separate app.",
    },
  },
];

function ResponsivePreview() {
  const { isEnglish } = useLanguage();
  const desktopCards = [
    {
      co: "mb",
      bg: "bg-black",
      role: "Senior Frontend",
      match: "94%",
      matchColor: "text-[#FFD23F]",
      salary: isEnglish ? "150k" : "150к",
    },
    {
      co: "R",
      bg: "bg-[#E31E24]",
      role: "Product Designer",
      match: "87%",
      matchColor: "text-[#7AB4FF]",
      salary: isEnglish ? "95k" : "95к",
    },
    {
      co: "N",
      bg: "bg-[#0077C8]",
      role: "Backend .NET",
      match: "81%",
      matchColor: "text-[#7AB4FF]",
      salary: isEnglish ? "120k" : "120к",
    },
  ];

  const tabletCards = [
    {
      co: "mb",
      bg: "bg-black",
      match: "94%",
      matchColor: "text-[#FFD23F]",
      salary: isEnglish ? "150k" : "150к",
    },
    {
      co: "R",
      bg: "bg-[#E31E24]",
      match: "87%",
      matchColor: "text-[#7AB4FF]",
      salary: isEnglish ? "95k" : "95к",
    },
    {
      co: "N",
      bg: "bg-[#0077C8]",
      match: "81%",
      matchColor: "text-[#7AB4FF]",
      salary: isEnglish ? "120k" : "120к",
    },
    {
      co: "A",
      bg: "bg-[#10B981]",
      match: "76%",
      matchColor: "text-[#7AB4FF]",
      salary: isEnglish ? "110k" : "110к",
    },
  ];

  const phoneCards = [
    {
      co: "mb",
      bg: "bg-black",
      match: "94%",
      matchColor: "text-[#FFD23F]",
      role: "Senior Frontend",
      salary: isEnglish ? "150k UAH" : "150к грн",
    },
    {
      co: "R",
      bg: "bg-[#E31E24]",
      match: "87%",
      matchColor: "text-[#7AB4FF]",
      role: "Product Designer",
      salary: isEnglish ? "95k UAH" : "95к грн",
    },
    {
      co: "N",
      bg: "bg-[#0077C8]",
      match: "81%",
      matchColor: "text-[#7AB4FF]",
      role: "Backend .NET",
      salary: isEnglish ? "120k UAH" : "120к грн",
    },
  ];

  return (
    <div className="relative h-[520px] w-full max-w-[650px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,125,246,0.15)_0%,transparent_65%)] pointer-events-none" />

      <div className="absolute top-[20px] left-0 w-[470px] h-[300px] bg-[#0F1D35] border-[8px] border-[#0A1628] rounded-[14px] shadow-[-20px_30px_70px_rgba(0,0,0,0.45),0_0_0_1px_rgba(96,165,250,0.28),inset_0_0_0_1px_rgba(255,255,255,0.04)] ring-1 ring-[#2A436D]/70 overflow-hidden -rotate-[3deg]">
        <div className="h-[22px] bg-[#0A1628] border-b border-[#223B5E] flex items-center px-[10px] gap-[6px]">
          <span className="w-[7px] h-[7px] bg-[#FF5F57] rounded-full" />
          <span className="w-[7px] h-[7px] bg-[#FEBC2E] rounded-full" />
          <span className="w-[7px] h-[7px] bg-[#28C840] rounded-full" />
          <div className="flex-1 mx-3 h-[12px] bg-[#152844] border border-[#223B5E] rounded-[3px] flex items-center px-2 text-[8px] text-[#6B7D9D]">
            kriposnyj.ua/{isEnglish ? "jobs" : "vakansii"}
          </div>
        </div>

        <div className="px-[14px] py-[8px] flex items-center justify-between border-b border-[#152844]">
          <div className="flex items-center gap-[5px]">
            <div className="w-[14px] h-[14px] bg-[#2E7DF6] rounded-[3px] flex items-center justify-center">
              <span className="text-[#FFD23F] text-[8px] font-bold">U</span>
            </div>
            <span className="text-[8px] font-bold text-[#F0F4FA]">
              Kriposnyj
            </span>
          </div>
          <div className="flex items-center gap-3 text-[7px] text-[#A8B6CE]">
              <span>{isEnglish ? "Jobs" : "Вакансії"}</span>
              <span>{isEnglish ? "Companies" : "Компанії"}</span>
              <span>{isEnglish ? "About" : "Про нас"}</span>
          </div>
          <div className="px-2 py-[3px] bg-[#2E7DF6] rounded-[3px] text-[7px] text-white font-medium">
            {isEnglish ? "Start" : "Розпочати"}
          </div>
        </div>

        <div className="px-[14px] py-[7px] flex gap-[5px] border-b border-[#152844]">
          {[
            "Frontend",
            isEnglish ? "Kyiv" : "Київ",
            isEnglish ? "Remote" : "Віддалено",
            isEnglish ? "150k+" : "150к+",
          ].map((item) => (
            <div
              key={item}
              className="px-[6px] py-[2px] bg-[#152844] border border-[#223B5E] rounded-[3px] text-[7px] text-[#A8B6CE]"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="px-[14px] py-[10px] grid grid-cols-3 gap-[8px]">
          {desktopCards.map((card) => (
            <div
              key={card.co}
              className="bg-[#152844] border border-[#223B5E] rounded-[5px] p-[7px]"
            >
              <div className="flex items-center justify-between mb-[6px]">
                <div
                  className={`w-[14px] h-[14px] ${card.bg} text-white rounded-[3px] flex items-center justify-center text-[7px] font-bold`}
                >
                  {card.co}
                </div>
                <span className={`text-[7px] ${card.matchColor} font-bold`}>
                  {card.match}
                </span>
              </div>
              <div className="text-[7px] text-[#F0F4FA] font-semibold leading-tight mb-[2px]">
                {card.role}
              </div>
              <div className="text-[6px] text-[#6B7D9D]">
                {card.salary} {isEnglish ? "UAH" : "грн"}
              </div>
            </div>
          ))}
        </div>

        <div className="px-[14px] flex justify-end gap-[3px]">
          {["1", "2", "3"].map((page, index) => (
            <div
              key={page}
              className={`w-[10px] h-[10px] rounded-[2px] text-[6px] flex items-center justify-center ${
                index === 0
                  ? "bg-[#2E7DF6] text-white font-bold"
                  : "bg-[#152844] border border-[#223B5E] text-[#A8B6CE]"
              }`}
            >
              {page}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[10px] left-[110px] w-[200px] h-[280px] bg-[#0F1D35] border-[6px] border-[#0A1628] rounded-[18px] shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(96,165,250,0.3),inset_0_0_0_1px_rgba(255,255,255,0.05)] ring-1 ring-[#2A436D]/70 overflow-hidden rotate-[4deg] z-[2]">
        <div className="h-[14px] bg-[#0A1628] flex items-center justify-between px-[8px]">
          <span className="text-[6px] text-[#A8B6CE]">9:41</span>
          <div className="flex gap-[2px] items-center">
            <span className="w-[6px] h-[3px] bg-[#A8B6CE] rounded-[1px]" />
            <span className="w-[8px] h-[4px] bg-[#A8B6CE] rounded-[1px]" />
          </div>
        </div>

        <div className="px-[10px] py-[7px] flex items-center justify-between border-b border-[#152844]">
          <div className="flex items-center gap-[4px]">
            <div className="w-[12px] h-[12px] bg-[#2E7DF6] rounded-[2px] flex items-center justify-center">
              <span className="text-[#FFD23F] text-[7px] font-bold">U</span>
            </div>
            <span className="text-[7px] font-bold text-[#F0F4FA]">
              Kriposnyj
            </span>
          </div>
          <div className="text-[7px] text-[#A8B6CE]">≡</div>
        </div>

        <div className="px-[10px] py-[6px]">
          <div className="bg-[#152844] border border-[#223B5E] rounded-[4px] px-[6px] py-[3px] text-[6px] text-[#6B7D9D]">
            {isEnglish ? "Search jobs..." : "Пошук вакансій..."}
          </div>
        </div>

        <div className="px-[10px] grid grid-cols-2 gap-[5px]">
          {tabletCards.map((card) => (
            <div
              key={card.co}
              className="bg-[#152844] border border-[#223B5E] rounded-[4px] p-[5px]"
            >
              <div className="flex items-center justify-between mb-[4px]">
                <div
                  className={`w-[12px] h-[12px] ${card.bg} text-white rounded-[2px] flex items-center justify-center text-[6px] font-bold`}
                >
                  {card.co}
                </div>
                <span className={`text-[6px] ${card.matchColor} font-bold`}>
                  {card.match}
                </span>
              </div>
              <div className="text-[6px] text-[#F0F4FA] font-semibold mb-[2px]">
                Senior Dev
              </div>
              <div className="text-[5px] text-[#6B7D9D]">
                {card.salary} {isEnglish ? "UAH · Kyiv" : "грн · Київ"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[30px] right-[10px] w-[150px] h-[300px] bg-[#0F1D35] border-[5px] border-[#0A1628] rounded-[22px] shadow-[20px_25px_50px_rgba(46,125,246,0.22),0_0_0_1px_rgba(96,165,250,0.35),inset_0_0_0_1px_rgba(255,255,255,0.06)] ring-1 ring-[#2A436D]/80 overflow-hidden -rotate-[6deg] z-[3]">
        <div className="h-[12px] bg-[#0A1628] flex items-center justify-center">
          <div className="w-[40px] h-[4px] bg-[#0A1628] rounded-[2px]" />
        </div>
        <div className="flex items-center justify-between px-[8px] py-[3px]">
          <span className="text-[6px] text-[#A8B6CE]">9:41</span>
          <div className="flex gap-[2px]">
            <span className="w-[5px] h-[3px] bg-[#A8B6CE] rounded-[1px]" />
            <span className="w-[7px] h-[3px] bg-[#A8B6CE] rounded-[1px]" />
          </div>
        </div>

        <div className="px-[8px] py-[5px] flex items-center justify-between border-b border-[#152844]">
          <div className="flex items-center gap-[3px]">
            <div className="w-[10px] h-[10px] bg-[#2E7DF6] rounded-[2px] flex items-center justify-center">
              <span className="text-[#FFD23F] text-[6px] font-bold">U</span>
            </div>
            <span className="text-[6px] font-bold text-[#F0F4FA]">
              Kriposnyj
            </span>
          </div>
          <span className="text-[7px] text-[#A8B6CE] leading-none">≡</span>
        </div>

        <div className="px-[8px] py-[6px] flex flex-col gap-[5px]">
          {phoneCards.map((card) => (
            <div
              key={card.co}
              className="bg-[#152844] border border-[#223B5E] rounded-[5px] p-[5px]"
            >
              <div className="flex items-center justify-between mb-[3px]">
                <div
                  className={`w-[12px] h-[12px] ${card.bg} text-white rounded-[2px] flex items-center justify-center text-[6px] font-bold`}
                >
                  {card.co}
                </div>
                <span className={`text-[6px] ${card.matchColor} font-bold`}>
                  {card.match}
                </span>
              </div>
              <div className="text-[6px] text-[#F0F4FA] font-semibold leading-tight mb-[1px]">
                {card.role}
              </div>
              <div className="text-[5px] text-[#6B7D9D]">{card.salary}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-[#0A1628] border-t border-[#152844] flex justify-around py-[4px]">
          <span className="text-[7px] text-[#2E7DF6]">●</span>
          <span className="text-[7px] text-[#6B7D9D]">○</span>
          <span className="text-[7px] text-[#6B7D9D]">○</span>
          <span className="text-[7px] text-[#6B7D9D]">○</span>
        </div>
      </div>

      <div className="absolute top-[170px] left-[400px] flex items-center gap-[3px] z-[4]">
        <div className="w-[14px] h-[1px] bg-[#FFD23F] opacity-50" />
        <div className="text-[#FFD23F] text-[10px] opacity-70">↔</div>
      </div>
    </div>
  );
}

export default function MobileApp() {
  const { isEnglish } = useLanguage();
  const lang = isEnglish ? "en" : "uk";

  return (
    <section className="w-full bg-[#0A1628]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-14 px-4 py-14 sm:px-8 md:py-24 lg:flex-row lg:gap-16 lg:px-[80px]">
        <div className="flex w-full flex-shrink-0 flex-col lg:w-[500px]">
          <div className="mb-4 text-[15px] font-semibold tracking-wide text-[#F5C84C]">
            {isEnglish ? "Mobile website version" : "Мобільна версія сайту"}
          </div>

          <h2 className="mb-6 text-[36px] font-bold leading-tight text-white md:text-[44px]">
            {isEnglish
              ? "Work opens comfortably from your phone"
              : "Робота зручно відкривається з телефона"}
          </h2>

          <p className="mb-10 text-[15px] leading-relaxed text-[#A8B6CD]">
            {isEnglish
              ? "Kriposnyj does not require a separate app. Open the site in a mobile browser, browse jobs, reply to recruiters, and manage your profile in the same adapted version."
              : "Kriposnyj не потребує окремого застосунку. Відкривай сайт у мобільному браузері, переглядай вакансії, відповідай рекрутерам і керуй профілем у тій самій адаптованій версії."}
          </p>

          <div className="flex flex-col gap-8">
            {bullets.map((item) => (
              <div key={item.title.uk} className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
                >
                  {item.icon}
                </div>
                <div>
                  <h4 className="mb-1.5 text-[15px] font-bold text-[#E6ECF5]">
                    {item.title[lang]}
                  </h4>
                  <p className="text-[14px] leading-snug text-[#A8B6CD]">
                    {item.desc[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-1 items-center justify-center lg:justify-end">
          <ResponsivePreview />
        </div>
      </div>
    </section>
  );
}
