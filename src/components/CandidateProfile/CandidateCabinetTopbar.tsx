import { Pencil, Upload } from "lucide-react";

type CandidateCabinetTopbarProps = {
  isEditing: boolean;
  completionPercent: number;
  onEdit: () => void;
  onPublish: () => void;
  onCancelEdit: () => void;
};

export default function CandidateCabinetTopbar({
  isEditing,
  completionPercent,
  onEdit,
  onPublish,
  onCancelEdit,
}: CandidateCabinetTopbarProps) {
  const safeCompletion = Math.max(
    0,
    Math.min(100, Math.round(completionPercent)),
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 bg-[#0F1D36] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <h1 className="text-sm font-bold text-white">Особистий кабінет</h1>

        {isEditing ? (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onPublish}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(59,130,246,0.75)] transition-colors hover:bg-blue-600 sm:h-10 sm:w-auto"
            >
              <Upload className="h-4 w-4" />
              Опублікувати зміни
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#1E3151] px-5 text-sm font-semibold text-[#D7E1EF] transition-colors hover:bg-[#172842] hover:text-white sm:h-10 sm:w-auto"
            >
              Вийти
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(59,130,246,0.75)] transition-colors hover:bg-blue-600 sm:h-10 sm:w-auto"
          >
            <Pencil className="h-4 w-4" />
            Змінити
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 px-5 sm:flex-row sm:items-center sm:px-8">
        <div className="flex shrink-0 items-center gap-4 text-sm font-semibold text-[#A8B6CD]">
          <span>Профіль заповнений на</span>
          <span className="text-emerald-400">{safeCompletion}%</span>
        </div>
        <div
          className="h-1.5 w-full max-w-[700px] overflow-hidden rounded-full bg-[#1E3151]"
          aria-label={`Профіль заповнений на ${safeCompletion}%`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all"
            style={{ width: `${safeCompletion}%` }}
          />
        </div>
      </div>
    </section>
  );
}
