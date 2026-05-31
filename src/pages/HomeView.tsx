import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/HomeView/Hero";
import FeaturedJobs from "../components/HomeView/FeaturedJobs";
import Features from "../components/HomeView/Features";
import MobileApp from "../components/HomeView/MobileApp";
import ResourceCards from "../components/HomeView/ResourceCards";
import ForBoth from "../components/HomeView/ForBoth";
import Testimonials from "../components/HomeView/Testimonials";
import CTA from "../components/HomeView/CTA";

export default function HomeView() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedJobs />
      <Features />
      <MobileApp />
      <ResourceCards />
      <ForBoth />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
