import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/AboutView/Hero";
import Mission from "../components/AboutView/Mission";
import Stats from "../components/AboutView/Stats";
import Values from "../components/AboutView/Values";
import Story from "../components/AboutView/Story";
import Team from "../components/AboutView/Team";
import JoinCTA from "../components/AboutView/JoinCTA";

export default function AboutView() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-slate-400">
      <Header />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-16 px-4 pb-20 sm:px-8 md:gap-24 md:pb-32">
        <Hero />
        <Mission />
        <Stats />
        <Values />
        <Story />
        <Team />
        <JoinCTA />
      </main>

      <Footer />
    </div>
  );
}
