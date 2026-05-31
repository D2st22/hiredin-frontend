export default function Hero() {
  return (
    <section className="relative w-full pt-20 md:pt-40 bg-[#0a1628] flex flex-col items-center text-center overflow-hidden">
      {/* ЦЕНТРАЛЬНЕ СЯЙВО  */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(37, 99, 235, 0.12) 0%, rgba(10, 22, 40, 0) 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl px-6">
        {/* Заголовок */}
        <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-8 md:mb-10 tracking-tight">
          Робота в Україні — <br />
          прямо, чесно, <br />
          без посередників
        </h1>

        {/* Опис */}
        <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg leading-relaxed mb-10 md:mb-16">
          Kriposnyj.ua — це ATS-платформа, створена українцями для українців. Ми
          з’єднуємо кандидатів з роботодавцями напряму — без агенцій, прихованих
          комісій і «сірих» зарплат.
        </p>

        {/* Мета-інфо */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-500/40 rounded-full" />
            <span>Заснована у 2023</span>
          </div>
          <div className="hidden md:block w-px h-3 bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-500/40 rounded-full" />
            <span>Київ · Львів · Віддалено</span>
          </div>
          <div className="hidden md:block w-px h-3 bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-500/40 rounded-full" />
            <span>Команда з 24 людей</span>
          </div>
        </div>
      </div>
    </section>
  );
}
