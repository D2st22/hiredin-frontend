import { useLanguage } from "../i18n/LanguageContext";

export default function AuthLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-lg border border-[#1E3151] bg-[#0F1D36]/30 px-2.5 py-1.5 text-xs font-medium">
      <button
        type="button"
        onClick={() => setLanguage("uk")}
        className={`transition-colors ${
          language === "uk" ? "text-[#F5C84C]" : "text-slate-500 hover:text-slate-300"
        }`}
      >
        UA
      </button>
      <span className="mx-1.5 text-slate-600">/</span>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`transition-colors ${
          language === "en" ? "text-[#F5C84C]" : "text-slate-500 hover:text-slate-300"
        }`}
      >
        EN
      </button>
    </div>
  );
}
