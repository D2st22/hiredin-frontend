export default function JoinCTA() {
  return (
    <section className="w-full">
      <div className="relative overflow-hidden rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 md:p-16 lg:p-20 text-center">
        {/* Фонове свічення */}
        <div className="absolute left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#3B82F6]/10 blur-[120px] pointer-events-none sm:w-[600px]" />

        <div className="relative z-10 mx-auto max-w-2xl">
          {/* Логотип */}
          <div className="mx-auto mb-8 flex items-center justify-center">
            <img
              alt="icon"
              className="w-[56px] h-[56px] rounded-[14px] object-contain shadow-[0_0_24px_rgba(59,130,246,0.2)]"
              src="https://d3os49tc9jbj3a.cloudfront.net/plugin-assets/ccc446a6-cf3f-4de3-9132-4abe41b229a4/b2a4df90143a-container.svg"
            />
          </div>

          {/* Заголовок та текст */}
          <h2 className="mb-4 text-[36px] md:text-[44px] font-bold text-white leading-tight">
            Приєднуйтесь до Kriposnyj
          </h2>
          <p className="mb-10 text-[15px] text-[#A8B6CD] leading-relaxed">
            Реєстрація за 60 секунд. Без комісій, без посередників, з{" "}
            <br className="hidden sm:block" /> реальними пропозиціями.
          </p>

          {/* Кнопки */}
          <div className="mb-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 sm:px-8 text-[15px] font-semibold text-white hover:bg-[#2563EB] transition-colors shadow-[0_0_24px_rgba(59,130,246,0.25)]">
              Шукати роботу
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
            </button>
            <button className="flex h-12 items-center justify-center rounded-xl border border-[#1E3151] bg-transparent px-4 sm:px-8 text-[15px] font-medium text-white hover:bg-[#0A1628] transition-colors">
              Я роботодавець
            </button>
          </div>

          {/* Переваги */}
          <div className="flex flex-wrap justify-center gap-6 text-[13px] text-[#6B7D99]">
            <span className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Безкоштовно для кандидатів
            </span>
            <span className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Без прихованих комісій
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
