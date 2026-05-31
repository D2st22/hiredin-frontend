export default function Values() {
  const values = [
    {
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
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      ),
      title: "Прозорість",
      desc: "Реальні зарплати, чіткі вимоги, жодного прихованого тексту між рядками.",
    },
    {
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
            <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z" />
            <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
          </svg>
        </div>
      ),
      title: "Прямий контакт",
      desc: "Кандидат говорить із рекрутером. Без агенцій, без посередників, без «фільтрів».",
    },
    {
      icon: (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] shadow-[0_0_24px_rgba(245,158,11,0.3)] flex items-center justify-center mb-6">
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
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </div>
      ),
      title: "Український фокус",
      desc: "Побудовано під реалії українського ринку — від мови до локальних вимог.",
    },
    {
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
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          </svg>
        </div>
      ),
      title: "Без комісій",
      desc: "Платформа безкоштовна для кандидатів — завжди. Роботодавці платять лише за результат.",
    },
  ];

  return (
    <section className="w-full">
      <div className="mb-16 text-center">
        <h2 className="text-[36px] md:text-[44px] font-bold text-white mb-4">
          У що ми віримо
        </h2>
        <p className="text-[#A8B6CD] text-[15px] max-w-xl mx-auto">
          Чотири принципи, які визначають, як ми будуємо продукт
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((val, idx) => (
          <div
            key={idx}
            className="bg-[#0F1D36] border border-[#1E3151] rounded-2xl p-8 flex flex-col hover:border-[#2A436D] transition-colors"
          >
            {val.icon}
            <h3 className="text-[18px] font-bold text-[#E6ECF5] mb-3">
              {val.title}
            </h3>
            <p className="text-[14px] text-[#A8B6CD] leading-relaxed">
              {val.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
