import { Pencil } from "lucide-react";

export default function EditBlockButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1B3153] px-4 text-sm font-semibold text-blue-300 transition-colors hover:bg-[#25446F] sm:h-8 sm:w-auto sm:rounded-md sm:px-3 sm:text-xs"
    >
      <Pencil className="h-3.5 w-3.5" />
      Редагувати блок
    </button>
  );
}
