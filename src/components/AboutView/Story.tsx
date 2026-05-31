export default function Story() {
  const steps = [
    {
      year: "2023",
      num: "01",
      title: "Ідея",
      desc: "Команда ІТ-спеціалістів бачить, як агенції «з’їдають» українських кандидатів.",
      active: false,
    },
    {
      year: "2024",
      num: "02",
      title: "MVP",
      desc: "Перший запуск ATS для невеликих українських компаній.",
      active: false,
    },
    {
      year: "2025",
      num: "03",
      title: "Публічний запуск",
      desc: "Платформа відкрита для всіх кандидатів і роботодавців України.",
      active: false,
    },
    {
      year: "2026",
      num: "04",
      title: "15 000+ вакансій",
      desc: "Найбільший прямий маркетплейс праці в Україні.",
      active: true,
    },
  ];

  return (
    <section className="relative mx-auto rounded-2xl border border-[#1E3151] bg-[#0F1D36] overflow-hidden p-8 lg:p-14">
      {/* Декоративні свічення */}
      <div className="absolute w-[500px] h-[500px] -left-40 -top-40 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] -right-40 bottom-0 bg-[#F5C84C]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Заголовки */}
      <div className="relative z-10 mb-16 text-center">
        <h4 className="text-[#F5C84C] text-[15px] font-semibold tracking-wide mb-4">
          Наша історія
        </h4>
        <h2 className="text-[36px] md:text-[44px] font-bold text-white leading-tight">
          Від ідеї до платформи
        </h2>
      </div>

      <div className="relative z-10">
        {/* Адаптивна лінія між кроками  */}
        <div className="hidden md:block absolute left-4 right-4 top-4 h-px bg-gradient-to-r from-[#1E3151] via-[#2A436D] to-[#1E3151] z-0" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                {/* Точка кроку */}
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${
                    step.active
                      ? "bg-[#F5C84C] text-[#0A1628] shadow-[0_0_0_6px_rgba(245,200,76,0.15)]"
                      : "bg-[#1E3151] text-white shadow-[0_0_0_4px_#0F1D36]"
                  }
                `}
                >
                  {step.num}
                </div>
                {/* Рік */}
                <span
                  className={`text-[14px] font-bold ${
                    step.active ? "text-[#F5C84C]" : "text-[#6B7D99]"
                  }`}
                >
                  {step.year}
                </span>
              </div>

              {/* Текст */}
              <h3 className="text-[#E6ECF5] text-[18px] font-bold mb-3">
                {step.title}
              </h3>
              <p className="text-[#A8B6CD] text-[14px] leading-relaxed">
                {step.desc}
              </p>

              {/* Бейдж "Сьогодні" */}
              {step.active && (
                <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-[#F5C84C]/10 rounded-full border border-[#F5C84C]/20">
                  <div className="w-1.5 h-1.5 bg-[#F5C84C] rounded-full" />
                  <span className="text-[#F5C84C] text-[10px] font-bold uppercase tracking-wider">
                    Сьогодні
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
