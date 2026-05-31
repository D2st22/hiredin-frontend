export default function Mission() {
  return (
    <section className="w-full mx-auto bg-[#0E1A2E] border border-[#1E2B47] rounded-[24px] p-5 sm:p-8 lg:p-[64px] flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden">
      {/* ЛІВА ЧАСТИНА */}
      <div className="max-w-[540px]">
        <span className="inline-block text-[#F5C84C] text-[18px] font-medium mb-4">
          Наша місія
        </span>

        <h2 className="text-white text-3xl md:text-[40px] font-bold leading-[1.2] mb-6">
          Зробити український ринок
          <br />
          праці прозорим і<br />
          доступним.
        </h2>

        <p className="text-[#8B94A7] text-[15px] leading-[1.6] mb-10">
          Ми віримо, що кандидати заслуговують знати реальну зарплату, а<br />
          роботодавці — говорити з людьми напряму. Наша платформа
          <br />
          прибирає зайві ланки між вами і наступною роботою.
        </p>

        <ul className="flex flex-col gap-4">
          <li className="flex items-start gap-4">
            <div className="w-[22px] h-[22px] rounded-full bg-[#1E2B47] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 4.5L3.5 6.5L8.5 1.5"
                  stroke="#8B94A7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[#CBD2DD] text-[15px]">
              Реальні зарплати, не «до 3000$»
            </span>
          </li>
          <li className="flex items-start gap-4">
            <div className="w-[22px] h-[22px] rounded-full bg-[#1E2B47] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 4.5L3.5 6.5L8.5 1.5"
                  stroke="#8B94A7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[#CBD2DD] text-[15px]">
              Прямий чат з рекрутером
            </span>
          </li>
          <li className="flex items-start gap-4">
            <div className="w-[22px] h-[22px] rounded-full bg-[#1E2B47] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                width="10"
                height="8"
                viewBox="0 0 0 10 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 4.5L3.5 6.5L8.5 1.5"
                  stroke="#8B94A7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[#CBD2DD] text-[15px]">
              Нуль комісій з кандидатів
            </span>
          </li>
        </ul>
      </div>

      {/* ПРАВА ЧАСТИНА*/}
      <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[384px] lg:h-[384px] flex items-center justify-center flex-shrink-0">
        {/* Зовнішнє суцільне коло */}
        <div className="absolute h-[220px] w-[220px] sm:h-[280px] sm:w-[280px] lg:w-[320px] lg:h-[320px] rounded-full border border-[#2A364A]" />

        {/* Внутрішнє пунктирне коло */}
        <div className="absolute h-[170px] w-[170px] sm:h-[220px] sm:w-[220px] lg:w-[240px] lg:h-[240px] rounded-full border border-[#2A364A] border-dashed" />

        {/* Центральне жовте коло */}
        <div className="absolute h-[130px] w-[130px] sm:h-[170px] sm:w-[170px] lg:w-[192px] lg:h-[192px] bg-[#F5C84C] rounded-full" />

        {/* 4 великі крапки на зовнішньому колі */}
        <div className="absolute top-[30px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#3B82F6] rounded-full border-2 border-[#0E1A2E]" />
        <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#F5C84C] rounded-full border-2 border-[#0E1A2E]" />
        <div className="absolute left-[30px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#4A5568] rounded-full border-2 border-[#0E1A2E]" />
        <div className="absolute right-[30px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#F5C84C] rounded-full border-2 border-[#0E1A2E]" />

        {/* 4 малі сірі крапки на зовнішньому колі */}
        <div className="absolute top-[76px] left-[76px] w-1 h-1 bg-[#4A5568] rounded-full" />
        <div className="absolute top-[76px] right-[76px] w-1 h-1 bg-[#4A5568] rounded-full" />
        <div className="absolute bottom-[76px] left-[76px] w-1 h-1 bg-[#4A5568] rounded-full" />
        <div className="absolute bottom-[76px] right-[76px] w-1 h-1 bg-[#4A5568] rounded-full" />

        {/* Бейдж UA на пунктирному колі */}
        <div className="absolute bottom-[64px] left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-[12px] border border-[#4A5568] bg-[#0E1A2E] text-[10px] font-medium text-[#F5C84C] tracking-wider">
          UA
        </div>
      </div>
    </section>
  );
}
