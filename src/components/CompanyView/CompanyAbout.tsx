export default function CompanyAbout({
  description,
}: {
  description?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8">
      <h3 className="mb-6 text-[20px] font-bold text-white">Про компанію</h3>
      <div className="whitespace-pre-line text-[14px] leading-relaxed text-[#A8B6CD]">
        {description || "Опис компанії ще не додано."}
      </div>
    </div>
  );
}
