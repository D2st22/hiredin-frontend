import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
const CDN =
  "https://d3os49tc9jbj3a.cloudfront.net/plugin-assets/ccc446a6-cf3f-4de3-9132-4abe41b229a4/";

export default function CTA() {
  const { isEnglish } = useLanguage();

  return (
    <section className="w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-[56px] py-12 md:py-[56px]">
        <div
          className="relative overflow-hidden border border-[#223b5e] rounded-[20px] px-5 py-10 sm:px-[49px] sm:py-[61px]"
          style={{
            background: "linear-gradient(to right, #0f1d35 0%, #152844 100%)",
          }}
        >
          {/* Glows */}
          <div
            className="absolute w-[340px] h-[340px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(46,125,246,0.18) 0%, transparent 70%)",
              top: "-59px",
              left: "414px",
            }}
          />
          <div
            className="absolute w-[320px] h-[320px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,210,63,0.08) 0%, transparent 70%)",
              top: "151px",
              right: "-100px",
            }}
          />

          <div className="relative text-center">
            {/* Logo icon */}
            <div className="flex justify-center mb-[24px]">
              <img
                src={`${CDN}b2a4df90143a-container.svg`}
                alt="icon"
                className="w-[56px] h-[56px] rounded-[14px] object-contain"
              />
            </div>

            {/* Heading */}
            <h2 className="font-manrope text-3xl md:text-[38px] font-[700] text-[#f0f4fa] leading-tight md:leading-[43px] m-0 mb-[16px]">
              {isEnglish
                ? "Your next job is one click away"
                : "Ваша наступна робота — за один клік"}
            </h2>

            {/* Sub */}
            <p className="font-inter text-[16px] font-[400] text-[#a8b6ce] leading-[24px] m-0 mb-[40px]">
              {isEnglish
                ? "Sign up in 60 seconds. No commissions or hidden fees."
                : "Реєстрація за 60 секунд. Без комісій та прихованих платежів."}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-[16px]">
              <button className="bg-[#2e7df6] rounded-[8px] px-[28px] py-[15px] flex items-center justify-center gap-[10px] shadow-[0px_10px_30px_0px_rgba(46,125,246,0.35)]">
                <Link to="/vacanciesList" className="w-full text-center">
                  <span className="font-inter text-[15px] font-[500] text-[#ffffff] leading-[22px]">
                    {isEnglish ? "Find a job →" : "Шукати роботу →"}
                  </span>
                </Link>
              </button>
              <button className="border border-[#2e4a75] rounded-[8px] px-[28px] py-[15px]">
                <span className="font-inter text-[15px] font-[500] text-[#e4e7f0] leading-[22px]">
                  {isEnglish ? "I'm an employer" : "Я роботодавець"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
