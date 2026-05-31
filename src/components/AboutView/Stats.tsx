export default function Stats() {
  const stats = [
    {
      value: "15 000",
      suffix: "+",
      label: "активних вакансій",
    },
    {
      value: "200",
      suffix: "+",
      label: "компаній-партнерів",
    },
    {
      value: "3.5",
      suffix: "K",
      label: "кандидатів",
    },
    {
      value: "87",
      suffix: "%",
      label: "успішних наймів",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-800 bg-[#0F1D36] p-8 flex flex-col justify-center"
        >
          <div className="mb-2 flex items-baseline">
            <span className="text-5xl font-bold text-white">{stat.value}</span>
            <span className="ml-1 text-4xl font-bold text-white">
              {stat.suffix}
            </span>
          </div>
          <span className="text-xs text-slate-400">{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
