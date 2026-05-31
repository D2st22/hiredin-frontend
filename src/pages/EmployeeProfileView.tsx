import { BriefcaseBusiness, MapPin, UserRound } from "lucide-react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function EmployeeProfileView() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name")?.trim();
  const role = searchParams.get("role")?.trim() || "Співробітник компанії";
  const location = searchParams.get("location")?.trim() || "Компанія";
  const format = searchParams.get("format")?.trim() || "Офіційний представник";
  const skills =
    searchParams.get("skills")?.trim() ||
    "Профіль співробітника буде доповнено після розширення API.";
  const initials = searchParams.get("initials")?.trim() || getInitials(name);

  if (!name) {
    return <Navigate to="/companiesList" replace />;
  }

  return (
    <div className="min-h-screen bg-[#081426] text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1120px] px-4 py-10 sm:px-8 lg:px-[80px] lg:py-16">
        <Link
          to="/companiesList"
          className="text-sm font-semibold text-[#60A5FA] hover:text-[#93C5FD]"
        >
          Назад до компаній
        </Link>

        <section className="mt-8 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-extrabold text-white">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold uppercase text-[#F5C84C]">
                Відкритий профіль
              </p>
              <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                {name}
              </h1>
              <p className="mt-2 text-lg font-semibold text-[#D7E1EF]">
                {role}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#A8B6CD]">
                <span className="inline-flex items-center gap-2 rounded-lg border border-[#1E3151] px-3 py-2">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-[#1E3151] px-3 py-2">
                  <BriefcaseBusiness className="h-4 w-4" />
                  {format}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-[#3B82F6]" />
            <h2 className="text-xl font-extrabold">Про співробітника</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#D7E1EF]">
            {skills}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function getInitials(value?: string | null) {
  return (
    value
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "OK"
  );
}
