import { Upload, X } from "lucide-react";

export default function CvUploadModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#020817]/80 px-4 py-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-upload-title"
        className="w-full max-w-[520px] rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="cv-upload-title" className="text-base font-bold text-white">
              Завантажити резюме
            </h2>
            <p className="mt-2 text-sm leading-5 text-[#A8B6CD]">
              PDF, DOC або DOCX до 10 MB. Резюме буде надіслано разом із
              заявкою.
            </p>
          </div>
          <button
            type="button"
            aria-label="Закрити"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#8FA1BB] hover:bg-[#172842] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-7 flex items-center justify-between text-xs font-semibold text-[#A8B6CD]">
          <span>Мої резюме</span>
          <span>Файлів ще немає</span>
        </div>

        <div className="mt-3 rounded-xl border border-dashed border-[#1E3151] bg-[#0A1628] px-4 py-5 text-sm text-[#8FA1BB]">
          Завантажені файли з'являться тут після успішного додавання.
        </div>

        <label className="mt-5 flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#1E3151] bg-[#0A1628] px-5 py-8 text-center transition-colors hover:border-blue-500/70 hover:bg-blue-500/5">
          <input type="file" className="sr-only" accept=".pdf,.doc,.docx" />
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#172842] text-[#A8B6CD]">
            <Upload className="h-5 w-5" />
          </span>
          <span className="mt-4 text-sm font-semibold text-[#D7E1EF]">
            Перетягніть файл сюди
          </span>
          <span className="mt-1 text-xs text-blue-400">
            оберіть з комп'ютера
          </span>
        </label>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold text-[#A8B6CD] hover:bg-[#172842] hover:text-white"
          >
            Скасувати
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-500 px-5 text-sm font-bold text-white hover:bg-blue-600"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}
