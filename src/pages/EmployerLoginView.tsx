import { ArrowRight, Eye } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLanguageSwitcher from "../components/AuthLanguageSwitcher";
import { useLanguage } from "../i18n/LanguageContext";
import { hiredInApi } from "../services/hiredInApi";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../services/hiredInTypes";

function getLoginRole(auth: Awaited<ReturnType<typeof hiredInApi.login>>) {
  return Number(
    auth.user?.role ??
      auth.user?.Role ??
      auth.User?.role ??
      auth.User?.Role ??
      auth.role ??
      auth.Role ??
      auth.userRole ??
      auth.UserRole,
  );
}

export default function EmployerLoginView() {
  const navigate = useNavigate();
  const authContext = useAuth();
  const { isEnglish } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const auth = await hiredInApi.login(email, password);
      const role = getLoginRole(auth);

      if (role !== UserRole.Employer && role !== UserRole.Admin) {
        setError(
          isEnglish
            ? "This account is registered as a candidate. Use the candidate sign-in page."
            : "Цей акаунт зареєстрований як кандидат. Увійди через сторінку входу для кандидата.",
        );
        return;
      }

      authContext.login(auth);

      navigate(
        role === UserRole.Admin
          ? "/admin"
          : role === UserRole.Candidate
            ? "/candidateCabinet"
            : "/companyCabinet",
      );
    } catch {
      setError(
        isEnglish
          ? "Could not sign in. Check your work email and password."
          : "Не вдалося увійти. Перевір робочу пошту і пароль.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0A1628]">
      <div className="flex h-full w-full flex-col lg:flex-row">
        <div className="relative flex h-full w-full flex-col justify-between border-r border-[#1E3151]/50 bg-[#0B1524] px-4 py-8 sm:px-8 lg:w-[54%] lg:px-[72px] lg:py-[40px]">
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />

          <div className="relative z-10 flex items-center gap-3">
            <img
              src="https://d3os49tc9jbj3a.cloudfront.net/plugin-assets/ccc446a6-cf3f-4de3-9132-4abe41b229a4/b2a4df90143a-container.svg"
              alt="Kriposnyj logo"
              className="h-8 w-8 rounded-lg object-contain"
            />
            <Link to="/home">
              <span className="text-lg font-semibold text-white">
                Kriposnyj
              </span>
            </Link>
          </div>

          <div className="relative z-10 flex flex-1 flex-col justify-center py-6">
            <div className="max-w-[490px]">
              <h1 className="mb-5 text-[40px] font-bold leading-[1.2] text-white lg:text-[44px]">
                {isEnglish ? "Direct hiring -" : "Найм напряму -"} <br />
                <span className="text-[#F5C84C]">
                  {isEnglish ? "without agencies." : "без HR-агенцій."}
                </span>
              </h1>
              <p className="mb-8 text-[14px] leading-relaxed text-[#A8B6CD] lg:text-[15px]">
                {isEnglish
                  ? "Sign in to manage vacancies, candidates, messages, and your employer page."
                  : "Увійди в кабінет компанії, щоб керувати вакансіями, кандидатами, повідомленнями та сторінкою роботодавця."}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-10 border-t border-[#1E3151]/30 pt-6">
            {[
              ["15 000+", isEnglish ? "Candidates" : "Кандидатів"],
              ["200+", isEnglish ? "Companies" : "Компаній"],
              ["3.5K", isEnglish ? "Jobs" : "Вакансій"],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="mb-0.5 text-[22px] font-bold text-[#E6ECF5]">
                  {value}
                </div>
                <div className="text-[12px] uppercase tracking-wider text-[#6B7D99]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex h-full w-full flex-col bg-[#0A1628] px-4 py-8 sm:px-8 lg:w-[46%] lg:px-[80px] lg:py-[40px]">
          <div className="mb-6 flex justify-end">
            <AuthLanguageSwitcher />
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <div className="mx-auto w-full max-w-[400px]">
              <h2 className="mb-2 text-[32px] font-bold tracking-tight text-[#E6ECF5]">
                {isEnglish ? "Employer account" : "Кабінет роботодавця"}
              </h2>
              <p className="mb-8 text-[14px] text-[#6B7D99]">
                {isEnglish
                  ? "Sign in to continue working with your company."
                  : "Увійди в акаунт, щоб продовжити роботу з компанією."}
              </p>

              <form
                onSubmit={handleSubmit}
                className="mb-6 flex flex-col gap-4"
              >
                <label>
                  <span className="mb-2 block text-[13px] font-medium text-[#A8B6CD]">
                    {isEnglish ? "Work email" : "Робоча пошта"}
                  </span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    type="email"
                    placeholder="hr@company.ua"
                    className="h-12 w-full rounded-xl border border-[#1E3151] bg-[#0F1D36] px-4 text-[14px] text-[#D6DDEB] outline-none transition-colors placeholder:text-[#334155] focus:border-[#3B82F6]"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-[13px] font-medium text-[#A8B6CD]">
                    {isEnglish ? "Password" : "Пароль"}
                  </span>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      type="password"
                      placeholder={
                        isEnglish
                          ? "at least 8 characters"
                          : "мінімум 8 символів"
                      }
                      className="h-12 w-full rounded-xl border border-[#1E3151] bg-[#0F1D36] px-4 pr-11 text-[14px] text-[#D6DDEB] outline-none transition-colors placeholder:text-[#334155] focus:border-[#3B82F6]"
                    />
                    <Eye className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7D99]" />
                  </div>
                </label>

                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#2563EB] disabled:opacity-60"
                >
                  {isSubmitting
                    ? isEnglish
                      ? "Signing in..."
                      : "Входимо..."
                    : isEnglish
                      ? "Sign in"
                      : "Увійти"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="space-y-6 text-center">
                <p className="text-[14px] text-[#6B7D99]">
                  {isEnglish
                    ? "Don't have an account?"
                    : "Ще не маєте акаунта?"}{" "}
                  <Link
                    to="/employerRegistration"
                    className="font-bold text-[#60A5FA] hover:underline"
                  >
                    {isEnglish ? "Create one" : "Створити"}
                  </Link>
                </p>
                <Link
                  to="/candidateLogin"
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-[#6B7D99] transition-colors hover:text-white"
                >
                  {isEnglish ? "I'm a candidate" : "Я кандидат"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
