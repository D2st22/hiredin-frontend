// src/components/AboutView/Team.tsx
export default function Team() {
  const team = [
    {
      initials: "К",
      name: "Команда продукту",
      role: "Стратегія та розвиток",
      gradient: "from-[#60A5FA] to-[#2563EB]",
    },
    {
      initials: "І",
      name: "Інженерна команда",
      role: "Платформа та API",
      gradient: "from-[#FCD34D] to-[#F59E0B]",
    },
    {
      initials: "Д",
      name: "Дизайн команда",
      role: "UX та інтерфейси",
      gradient: "from-[#A855F7] to-[#6366F1]",
    },
    {
      initials: "П",
      name: "Підтримка",
      role: "Комунікація з користувачами",
      gradient: "from-[#34D399] to-[#059669]",
    },
  ];

  return (
    <section className="w-full">
      <div className="mb-12">
        <h2 className="text-[36px] md:text-[44px] font-bold text-white mb-4 leading-tight">
          Люди, які це будують
        </h2>
        <p className="text-[#A8B6CD] text-[15px]">
          Маленька команда з великими амбіціями
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member, idx) => (
          <div
            key={idx}
            className="bg-[#0F1D36] border border-[#1E3151] hover:border-[#2A436D] transition-colors rounded-2xl p-5 flex flex-col"
          >
            <div
              className={`mb-6 flex h-56 w-full items-center justify-center rounded-xl bg-gradient-to-br ${member.gradient}`}
            >
              <span className="text-[40px] font-bold text-white tracking-wide shadow-sm">
                {member.initials}
              </span>
            </div>
            <h3 className="text-[18px] font-bold text-[#E6ECF5] mb-1.5">
              {member.name}
            </h3>
            <p className="text-[14px] text-[#A8B6CD]">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
