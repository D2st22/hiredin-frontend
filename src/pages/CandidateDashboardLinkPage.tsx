import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

type CandidateDashboardLinkPageProps = {
  title: string;
  description: string;
};

export default function CandidateDashboardLinkPage({
  title,
  description,
}: CandidateDashboardLinkPageProps) {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <Header />
      <main className="mx-auto flex min-h-[520px] w-full max-w-[1440px] items-center px-5 py-12 md:py-16 sm:px-4 sm:px-8 lg:px-[80px]">
        <section className="w-full rounded-2xl border border-[#1E3151] bg-[#0F1D36] p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">
            Кабінет кандидата
          </p>
          <h1 className="mt-4 text-3xl font-bold text-white">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#A8B6CD]">
            {description}
          </p>
          <Link
            to="/candidateProfile"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-blue-500 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-600"
          >
            Повернутися до профілю
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
