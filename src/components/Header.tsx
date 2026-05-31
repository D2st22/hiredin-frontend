import { Bell, LogOut, Menu, MessageSquare, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import { hiredInApi } from "../services/hiredInApi";
import { UserRole } from "../services/hiredInTypes";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage, isEnglish } = useLanguage();
  const { isAuthenticated, role, user, avatarUrl, logout } = useAuth();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/home");
  };

  const accountPath =
    role === UserRole.Admin
      ? "/admin"
      : role === UserRole.Employer
        ? "/companyCabinet"
        : "/candidateCabinet";
  const chatPath =
    role === UserRole.Admin
      ? "/admin"
      : "/messages";
  const notificationsPath =
    role === UserRole.Admin ? "/admin" : "/notifications";
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const accountLabel =
    role === UserRole.Admin
      ? isEnglish
        ? "Admin dashboard"
        : "Адмін-панель"
      : role === UserRole.Employer
      ? isEnglish
        ? "Company account"
        : "Кабінет компанії"
      : isEnglish
        ? "Candidate account"
        : "Кабінет кандидата";
  const accountName =
    user?.fullName ??
    user?.FullName ??
    user?.name ??
    user?.Name ??
    user?.email ??
    user?.Email ??
    user?.companyName ??
    user?.CompanyName ??
    (role === UserRole.Admin
      ? isEnglish
        ? "Admin"
        : "Адмін"
      : role === UserRole.Employer
      ? isEnglish
        ? "Employer"
        : "Компанія"
      : isEnglish
        ? "Candidate"
        : "Кандидат");
  const accountInitials = accountName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const navItems = [
    { label: isEnglish ? "Jobs" : "Вакансії", to: "/vacanciesList" },
    { label: isEnglish ? "Companies" : "Компанії", to: "/companiesList" },
    {
      label: isEnglish ? "For candidates" : "Кандидату",
      to: "/for-candidates",
    },
    {
      label: isEnglish ? "For companies" : "Компаніям",
      to: "/for-companies",
    },
    { label: isEnglish ? "About" : "Про нас", to: "/about" },
  ];
  const visibleNavItems =
    isAuthenticated && role === UserRole.Admin
      ? [...navItems, { label: isEnglish ? "Admin" : "Адмін", to: "/admin" }]
      : navItems;

  useEffect(() => {
    if (!isAuthenticated || role === UserRole.Admin) {
      setUnreadNotifications(0);
      return;
    }

    let ignore = false;

    hiredInApi
      .getMyNotifications()
      .then((items) => {
        if (ignore) return;
        setUnreadNotifications(
          (items ?? []).filter((item) => !(item.isRead ?? item.IsRead)).length,
        );
      })
      .catch(() => {
        if (!ignore) setUnreadNotifications(0);
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, role]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E3151]/50 bg-[#0A1628]/95 backdrop-blur">
      <div className="mx-auto flex min-h-[64px] max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-[80px]">
        <Link
          to="/home"
          className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
          onClick={() => setIsOpen(false)}
        >
          <img
            src="https://d3os49tc9jbj3a.cloudfront.net/plugin-assets/ccc446a6-cf3f-4de3-9132-4abe41b229a4/b2a4df90143a-container.svg"
            alt="Kriposnyj logo"
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span className="truncate text-[17px] font-semibold tracking-wide text-white">
            Kriposnyj
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex lg:gap-7">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-[14px] font-medium transition-colors hover:text-white ${
                  isActive ? "text-[#F5C84C]" : "text-[#A8B6CD]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex lg:gap-4">
          <div className="inline-flex items-center rounded-lg border border-[#1E3151] bg-[#0F1D36]/30 px-2.5 py-1.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setLanguage("uk")}
              className={`transition-colors ${
                language === "uk"
                  ? "text-[#F5C84C]"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              UA
            </button>
            <span className="mx-1 text-slate-500">/</span>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`transition-colors ${
                language === "en"
                  ? "text-[#F5C84C]"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              EN
            </button>
          </div>

          {isAuthenticated ? (
            <>
              <Link
                to={chatPath}
                aria-label={isEnglish ? "Messages" : "Повідомлення"}
                title={isEnglish ? "Messages" : "Повідомлення"}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#A8B6CD] transition-colors hover:bg-[#0F1D36] hover:text-white"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>
              <Link
                to={notificationsPath}
                aria-label={isEnglish ? "Notifications" : "Сповіщення"}
                title={isEnglish ? "Notifications" : "Сповіщення"}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#A8B6CD] transition-colors hover:bg-[#0F1D36] hover:text-white"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </Link>
              <Link
                to={accountPath}
                aria-label={accountLabel}
                title={accountName}
                className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-[#7C3AED] text-[12px] font-bold text-white transition-colors hover:bg-[#6D28D9]"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={accountName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  accountInitials || "OK"
                )}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#1E3151] bg-[#0F1D36]/30 px-3 text-[13px] font-semibold text-[#D7E1EF] transition-colors hover:bg-[#172842] hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                {isEnglish ? "Sign out" : "Вийти"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/candidateLogin"
                className="text-[14px] font-medium text-[#A8B6CD] transition-colors hover:text-white"
              >
                {isEnglish ? "Sign in" : "Увійти"}
              </Link>
              <Link
                to="/candidateRegistration"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2563EB]"
              >
                {isEnglish ? "Get started" : "Розпочати"}
                <span aria-hidden>→</span>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#1E3151] text-[#D7E1EF] md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[#1E3151]/50 bg-[#0A1628] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-sm font-semibold hover:bg-[#0F1D36] ${
                    isActive ? "text-[#F5C84C]" : "text-[#D7E1EF]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="col-span-2 inline-flex h-11 items-center justify-center rounded-lg border border-[#1E3151] bg-[#0F1D36]/30 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage("uk")}
                className={`px-3 transition-colors ${
                  language === "uk" ? "text-[#F5C84C]" : "text-slate-500"
                }`}
              >
                UA
              </button>
              <span className="text-slate-500">/</span>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-3 transition-colors ${
                  language === "en" ? "text-[#F5C84C]" : "text-slate-500"
                }`}
              >
                EN
              </button>
            </div>
            {isAuthenticated ? (
              <>
                <Link
                  to={accountPath}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-[#1E3151] bg-[#0F1D36]/30 text-sm font-semibold text-white"
                >
                  {accountLabel}
                </Link>
                <Link
                  to={chatPath}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-[#1E3151] bg-[#0F1D36]/30 text-sm font-semibold text-[#D7E1EF]"
                >
                  {isEnglish ? "Messages" : "Повідомлення"}
                </Link>
                <Link
                  to={notificationsPath}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-[#1E3151] bg-[#0F1D36]/30 text-sm font-semibold text-[#D7E1EF]"
                >
                  {isEnglish ? "Notifications" : "Сповіщення"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="col-span-2 inline-flex h-11 items-center justify-center rounded-lg border border-[#1E3151] bg-[#0F1D36]/30 text-sm font-semibold text-[#D7E1EF] transition-colors hover:text-white"
                >
                  {isEnglish ? "Sign out" : "Вийти"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/candidateLogin"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-[#1E3151] text-sm font-semibold text-[#D7E1EF]"
                >
                  {isEnglish ? "Sign in" : "Увійти"}
                </Link>
                <Link
                  to="/candidateRegistration"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-[#3B82F6] text-sm font-semibold text-white"
                >
                  {isEnglish ? "Get started" : "Розпочати"}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
