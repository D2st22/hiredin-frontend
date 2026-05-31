import type { CompanyRead } from "../../services/hiredInApi";

export default function CompanySidebar({ company }: { company?: CompanyRead | null }) {
  const facts = [
    ["Індустрія", company?.industry],
    ["Локація", company?.city],
    ["Сайт", company?.website],
  ].filter(([, value]) => Boolean(value));

  return (
    <div className="w-full flex-shrink-0 lg:w-[320px]">
      <div className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-6">
        <h4 className="mb-5 text-[14px] font-bold uppercase tracking-wider text-[#6B7D99]">
          Швидкі факти
        </h4>
        {facts.length > 0 ? (
          <div className="flex flex-col gap-4 text-[14px]">
            {facts.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-4 border-b border-[#1E3151]/40 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-[#6B7D99]">{label}</span>
                <span className="text-right font-medium text-[#E6ECF5]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-[#8EA0BA]">
            Компанія ще не заповнила додаткові факти.
          </p>
        )}
      </div>
    </div>
  );
}
