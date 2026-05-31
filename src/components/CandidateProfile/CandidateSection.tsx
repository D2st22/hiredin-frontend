import type { ReactNode } from "react";

export default function CandidateSection({
  title,
  children,
  className = "",
  action,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {action && <div className="w-full sm:w-auto">{action}</div>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
