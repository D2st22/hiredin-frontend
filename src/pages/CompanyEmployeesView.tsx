import { MapPin, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  employeeProfilePath,
  mapCompanyToEmployee,
  mapMemberToEmployee,
  type CompanyEmployee,
} from "../components/CompanyView/CompanyEmployees";
import { Link } from "react-router-dom";
import { hiredInApi } from "../services/hiredInApi";

export default function CompanyEmployeesView() {
  const [employees, setEmployees] = useState<CompanyEmployee[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let ignore = false;
    const companyId = new URLSearchParams(window.location.search).get("companyId");

    const request = companyId
      ? hiredInApi
          .getAllCompanies()
          .then((companies) => {
            const company = companies.find((item) => item.id === companyId);
            return company ? [mapCompanyToEmployee(company)] : [];
          })
      : hiredInApi.getCompanyMembers().then((members) => members.map(mapMemberToEmployee));

    request
      .then((items) => {
        if (!ignore) setEmployees(items);
      })
      .catch(() => {
        if (!ignore) setEmployees([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;

    return employees.filter((employee) =>
      [employee.name, employee.role, employee.location, employee.skills]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [employees, search]);

  return (
    <div className="min-h-screen bg-[#081426] text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-8 lg:px-[80px] lg:py-16">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Співробітники компанії
            </h1>
            <p className="mt-3 text-[#8EA0BA]">
              Відкриті профілі команди з'являться тут після додавання компанією.
            </p>
          </div>
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F90AA]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Пошук співробітника"
              className="h-11 w-full rounded-lg border border-[#1E3151] bg-[#0B182C] pl-10 pr-4 text-sm outline-none placeholder:text-[#7F90AA] focus:border-[#3B82F6] sm:w-72"
            />
          </label>
        </section>

        {filteredEmployees.length > 0 ? (
          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredEmployees.map((employee) => (
              <Link
                key={employee.name}
                to={employeeProfilePath(employee)}
                className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-white ${employee.color}`}
                  >
                    {employee.initials}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-extrabold text-white">
                      {employee.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#A8B6CD]">
                      {employee.role}
                    </p>
                  </div>
                </div>
                <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-[#7F90AA]">
                  <MapPin className="h-4 w-4" />
                  {employee.location} · {employee.format}
                </p>
                <p className="mt-4 text-sm text-[#D7E1EF]">
                  {employee.skills}
                </p>
              </Link>
            ))}
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-dashed border-[#1E3151] px-5 py-14 text-center">
            <Users className="mx-auto h-10 w-10 text-[#3B82F6]" />
            <h2 className="mt-4 text-lg font-extrabold">
              Співробітників поки не додано
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#8EA0BA]">
              На цій сторінці буде повний список відкритих профілів команди,
              коли API поверне ці дані.
            </p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
