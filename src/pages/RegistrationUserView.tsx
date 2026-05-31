import { Link } from "react-router-dom";
import AuthLanguageSwitcher from "../components/AuthLanguageSwitcher";

export default function Registration() {
  return (
    // Фіксуємо висоту рівно на один екран (h-screen) і ховаємо скрол
    <div className="h-screen w-full bg-[#0A1628] flex justify-center overflow-hidden">
      {/* Контейнер 1440px по центру */}
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row h-full">
        {/* ЛІВА ЧАСТИНА */}
        {/* Додано justify-between, щоб Логотип, Текст і Статистика розійшлися по краях і центру */}
        <div className="relative w-full lg:w-[54%] flex flex-col justify-between bg-[#0B1524] border-r border-[#1E3151]/50 px-4 sm:px-8 py-8 lg:px-[72px] lg:py-[40px] h-full">
          {/* Фонове свічення */}
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

          {/* Логотип (притиснутий догори) */}
          {/* Логотип (притиснутий догори) */}
          <div className="relative z-10 flex items-center gap-3">
            <img
              src="https://d3os49tc9jbj3a.cloudfront.net/plugin-assets/ccc446a6-cf3f-4de3-9132-4abe41b229a4/b2a4df90143a-container.svg"
              alt="Kriposnyj logo"
              className="w-8 h-8 rounded-lg object-contain"
            />
            <Link to="/home">
              <span className="text-white font-semibold text-lg hover:text-blue-400 transition-colors">
                Kriposnyj
              </span>
            </Link>
          </div>

          {/* Основний контент (по центру завдяки flex-1 та justify-center) */}
          <div className="relative z-10 flex-1 flex flex-col justify-center py-6">
            <div className="max-w-[490px]">
              <h1 className="text-[40px] lg:text-[44px] font-bold leading-[1.2] text-white mb-5">
                Робота напряму — <br />
                <span className="text-[#F5C84C]">без посередників.</span>
              </h1>

              <p className="text-[#A8B6CD] text-[14px] lg:text-[15px] leading-relaxed mb-8">
                Створи кабінет кандидата, додай резюме за 5 хвилин і отримуй
                пропозиції напряму від українських компаній.
              </p>

              {/* Список переваг */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded flex-shrink-0 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mt-0.5">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 4.5L3.5 7L9 1.5"
                        stroke="#60A5FA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[#E6ECF5] text-sm font-medium mb-1">
                      Прямий контакт з роботодавцем
                    </h4>
                    <p className="text-[#6B7D99] text-xs">
                      Без рекрутингових агенцій та комісій
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded flex-shrink-0 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mt-0.5">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 4.5L3.5 7L9 1.5"
                        stroke="#60A5FA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[#E6ECF5] text-sm font-medium mb-1">
                      Прозорі вимоги і зарплати
                    </h4>
                    <p className="text-[#6B7D99] text-xs">
                      Кожна вакансія — з вилкою в гривнях
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded flex-shrink-0 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mt-0.5">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 4.5L3.5 7L9 1.5"
                        stroke="#60A5FA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[#E6ECF5] text-sm font-medium mb-1">
                      Конструктор резюме на 10 хвилин
                    </h4>
                    <p className="text-[#6B7D99] text-xs">
                      Експорт у PDF, імпорт з LinkedIn
                    </p>
                  </div>
                </div>
              </div>

              {/* Відгук */}
              <div className="flex items-start gap-4 p-4 bg-[#0F1D36]/60 border border-[#1E3151] rounded-[10px] backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex flex-shrink-0 items-center justify-center text-white text-[13px] font-bold">
                  МТ
                </div>
                <div>
                  <p className="text-[#E6ECF5] text-xs leading-relaxed mb-1.5">
                    «Знайшла роботу за 2 тижні. Вакансія — від CTO напряму, без
                    HR-фільтрів.»
                  </p>
                  <p className="text-[#6B7D99] text-xs">
                    Марія Тарнух · Product Designer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Статистика (притиснута донизу) */}
          <div className="relative z-10 flex items-center gap-10">
            <div>
              <div className="text-[#E6ECF5] text-xl font-bold mb-1">
                15 000+
              </div>
              <div className="text-[#6B7D99] text-xs">Кандидатів</div>
            </div>
            <div>
              <div className="text-[#E6ECF5] text-xl font-bold mb-1">200+</div>
              <div className="text-[#6B7D99] text-xs">Компаній</div>
            </div>
            <div>
              <div className="text-[#E6ECF5] text-xl font-bold mb-1">3.5K</div>
              <div className="text-[#6B7D99] text-xs">Вакансій</div>
            </div>
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА */}
        <div className="w-full lg:w-[46%] flex flex-col bg-[#0A1628] px-4 sm:px-8 py-8 lg:px-[80px] lg:py-[40px] h-full">
          {/* Перемикач мови */}
          <div className="flex justify-end">
            <AuthLanguageSwitcher />
          </div>

          {/* Форма */}
          {/* Додано mx-auto до max-w-[400px], щоб форма стала рівно по центру своєї колонки */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-[400px] w-full mx-auto">
              <h2 className="text-[32px] font-bold text-[#E6ECF5] mb-2">
                Кабінет кандидата
              </h2>
              <p className="text-[#6B7D99] text-sm mb-10">
                Заповни 3 поля — резюме додаси після входу
              </p>

              <form className="flex flex-col gap-5 mb-8">
                <div>
                  <label className="block text-[#A8B6CD] text-[13px] font-medium mb-2">
                    Ім'я та прізвище
                  </label>
                  <input
                    type="text"
                    placeholder="Ім'я та прізвище"
                    className="w-full h-11 bg-[#0F1D36] border border-[#1E3151] rounded-lg px-4 text-[#D6DDEB] text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#A8B6CD] text-[13px] font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full h-11 bg-[#0F1D36] border border-[#1E3151] rounded-lg px-4 text-[#D6DDEB] text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#A8B6CD] text-[13px] font-medium mb-2">
                    Пароль
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="мінімум 8 символів"
                      className="w-full h-11 bg-[#0F1D36] border border-[#1E3151] rounded-lg pl-4 pr-10 text-[#D6DDEB] text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-[#4A5568]"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7D99] hover:text-[#A8B6CD] transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full h-12 mt-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  Створити акаунт
                  <svg
                    width="16"
                    height="16"
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
              </form>

              <div className="text-center">
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-[#60A5FA] hover:text-[#93C5FD] text-sm font-medium transition-colors"
                >
                  Я роботодавець
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
                </a>
              </div>
              {/* НОВИЙ БЛОК: Вже маєте акаунт */}
              <div className="text-center mb-8">
                <span className="text-[#6B7D99] text-[13px]">
                  Вже маєте акаунт?{" "}
                </span>
                <a
                  href="#"
                  className="text-[#60A5FA] hover:text-[#93C5FD] text-[13px] font-medium transition-colors"
                >
                  Увійти
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
