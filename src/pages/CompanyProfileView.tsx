import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import CompanyHeader from "../components/CompanyView/CompanyHeader";
import CompanyTabs from "../components/CompanyView/CompanyTabs";
import CompanyStats from "../components/CompanyView/CompanyStats";
import CompanyAbout from "../components/CompanyView/CompanyAbout";
import VacancyList from "../components/CompanyView/VacancyList";
import CompanyReviews from "../components/CompanyView/CompanyReviews";
import CompanySidebar from "../components/CompanyView/CompanySidebar";
import CompanyEmployees from "../components/CompanyView/CompanyEmployees";
import Footer from "../components/Footer";
import {
  hiredInApi,
  type CompanyRead,
  type CompanyRatingRead,
  type VacancyRead,
} from "../services/hiredInApi";

export default function CompanyProfileView() {
  const [company, setCompany] = useState<CompanyRead | null>(null);
  const [vacancies, setVacancies] = useState<VacancyRead[]>([]);
  const [reviews, setReviews] = useState<CompanyRatingRead[]>([]);
  const aboutRef = useRef<HTMLDivElement>(null);
  const vacanciesRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const employeesRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (
    elementRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    let ignore = false;
    const companyId = new URLSearchParams(window.location.search).get("companyId");

    Promise.all([
      hiredInApi.getAllCompanies(),
      hiredInApi.getPagedVacancies(0, 100).catch(() => ({ items: [] })),
    ])
      .then(([companies, pagedVacancies]) => {
        if (ignore) return;
        const selectedCompany =
          companies.find((item) => item.id === companyId) ?? companies[0] ?? null;
        setCompany(selectedCompany);
        setVacancies(
          (pagedVacancies.items ?? []).filter(
            (vacancy) => !selectedCompany?.id || vacancy.companyId === selectedCompany.id,
          ),
        );

        if (selectedCompany?.id) {
          hiredInApi
            .getCompanyRatingsByCompanyId(selectedCompany.id)
            .then((items) => {
              if (!ignore) setReviews(items);
            })
            .catch(() => {
              if (!ignore) setReviews([]);
            });
        } else {
          setReviews([]);
        }
      })
      .catch(() => {
        if (!ignore) {
          setCompany(null);
          setVacancies([]);
          setReviews([]);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0A1628] text-white">
      <Header />
      <CompanyHeader
        company={company}
        vacanciesCount={vacancies.length}
        onVacanciesClick={() => scrollToSection(vacanciesRef)}
      />

      <div className="mx-auto mb-8 max-w-[1440px] px-4 sm:px-8 lg:px-[80px]">
        <CompanyStats
          vacanciesCount={vacancies.length}
          rating={formatAverageRating(reviews)}
          employeesCount={0}
        />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px]">
        <CompanyTabs
          vacanciesCount={vacancies.length}
          onAboutClick={() => scrollToSection(aboutRef)}
          onVacanciesClick={() => scrollToSection(vacanciesRef)}
          onReviewsClick={() => scrollToSection(reviewsRef)}
          onEmployeesClick={() => scrollToSection(employeesRef)}
        />
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 pt-12 sm:px-8 lg:flex-row lg:px-[80px]">
        <div ref={aboutRef} className="flex-1 scroll-mt-24">
          <CompanyAbout description={company?.description} />
        </div>
        <CompanySidebar company={company} />
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-4 py-12 sm:px-8 lg:px-[80px]">
        <div ref={vacanciesRef} className="scroll-mt-24">
          <VacancyList vacancies={vacancies} companyId={company?.id} />
        </div>
        <div ref={reviewsRef} className="scroll-mt-24">
          <CompanyReviews reviews={reviews} companyId={company?.id} />
        </div>
        <div ref={employeesRef} className="scroll-mt-24">
          <CompanyEmployees companyId={company?.id} company={company} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function formatAverageRating(reviews: CompanyRatingRead[]) {
  if (!reviews.length) return null;

  const ratings = reviews
    .map((review) => Number(review.rating ?? review.Rating))
    .filter((rating) => Number.isFinite(rating) && rating > 0);

  if (!ratings.length) return null;

  const average =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

  return average.toFixed(1);
}
