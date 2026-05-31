import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AboutView from "./pages/AboutView";
import AdminDashboardView from "./pages/AdminDashboardView";
import AiJobMatchView from "./pages/AiJobMatchView";
import CandidateCabinetView from "./pages/CandidateCabinetView";
import CandidateChatView from "./pages/CandidateChatView";
import CandidateGuideView from "./pages/CandidateGuideView";
import CandidateLoginView from "./pages/CandidateLoginView";
import CandidateProfileView from "./pages/CandidateProfileView";
import CandidateRegistrationView from "./pages/CandidateRegistrationView";
import CompaniesListView from "./pages/CompaniesListView";
import CompanyCabinetView from "./pages/CompanyCabinetView";
import CompanyChatView from "./pages/CompanyChatView";
import CompanyEmployeesView from "./pages/CompanyEmployeesView";
import CompanyGuideView from "./pages/CompanyGuideView";
import CompanyProfileView from "./pages/CompanyProfileView";
import CompanyReviewsView from "./pages/CompanyReviewsView";
import CompanyVacancyCandidatesView from "./pages/CompanyVacancyCandidatesView";
import CompanyVacancyDetailView from "./pages/CompanyVacancyDetailView";
import CompanyVacanciesView from "./pages/CompanyVacanciesView";
import EmployerLoginView from "./pages/EmployerLoginView";
import EmployerRegistrationView from "./pages/EmployerRegistrationView";
import EmployeeProfileView from "./pages/EmployeeProfileView";
import FavoriteVacanciesView from "./pages/FavoriteVacanciesView";
import HomeView from "./pages/HomeView";
import JobDescriptionView from "./pages/JobDescriptionView";
import MessagesView from "./pages/MessagesView";
import MyApplicationsView from "./pages/MyApplicationsView";
import NotificationsView from "./pages/NotificationsView";
import ResumeBuilderView from "./pages/ResumeBuilderView";
import VacanciesListView from "./pages/VacanciesListView";
import { UserRole } from "./services/hiredInTypes";

function NoAdminProfileRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated && role === UserRole.Admin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/home" element={<HomeView />} />
      <Route path="/about" element={<AboutView />} />
      <Route path="/admin" element={<AdminDashboardView />} />
      <Route path="/adminDashboard" element={<AdminDashboardView />} />
      <Route path="/for-candidates" element={<CandidateGuideView />} />
      <Route path="/for-companies" element={<CompanyGuideView />} />
      <Route
        path="/registrationUser"
        element={<Navigate to="/candidateRegistration" replace />}
      />
      <Route path="/employerLogin" element={<EmployerLoginView />} />
      <Route
        path="/employerRegistration"
        element={<EmployerRegistrationView />}
      />
      <Route path="/candidateLogin" element={<CandidateLoginView />} />
      <Route
        path="/candidateRegistration"
        element={<CandidateRegistrationView />}
      />
      <Route path="/companyProfile" element={<CompanyProfileView />} />
      <Route path="/company-chat" element={<CompanyChatView />} />
      <Route path="/companyChat" element={<CompanyChatView />} />
      <Route path="/company-employees" element={<CompanyEmployeesView />} />
      <Route path="/companyEmployees" element={<CompanyEmployeesView />} />
      <Route
        path="/companyCabinet"
        element={
          <NoAdminProfileRoute>
            <CompanyCabinetView />
          </NoAdminProfileRoute>
        }
      />
      <Route
        path="/employerCompany"
        element={
          <NoAdminProfileRoute>
            <CompanyCabinetView />
          </NoAdminProfileRoute>
        }
      />
      <Route path="/company-vacancies" element={<CompanyVacanciesView />} />
      <Route path="/companyVacancies" element={<CompanyVacanciesView />} />
      <Route
        path="/company-vacancy-detail"
        element={<CompanyVacancyDetailView />}
      />
      <Route
        path="/companyVacancyDetail"
        element={<CompanyVacancyDetailView />}
      />
      <Route
        path="/company-vacancy-candid ates"
        element={<CompanyVacancyCandidatesView />}
      />
      <Route
        path="/companyVacancyCandidates"
        element={<CompanyVacancyCandidatesView />}
      />
      <Route path="/company-reviews" element={<CompanyReviewsView />} />
      <Route path="/my-reviews" element={<CompanyReviewsView />} />
      <Route path="/employee-profile" element={<EmployeeProfileView />} />
      <Route path="/employeeProfile" element={<EmployeeProfileView />} />
      <Route path="/vacanciesList" element={<VacanciesListView />} />
      <Route path="/jobDescription" element={<JobDescriptionView />} />
      <Route path="/vacancy/:id" element={<JobDescriptionView />} />
      <Route path="/candidateProfile" element={<CandidateProfileView />} />
      <Route
        path="/candidateCabinet"
        element={
          <NoAdminProfileRoute>
            <CandidateCabinetView />
          </NoAdminProfileRoute>
        }
      />
      <Route path="/candidate-chat" element={<CandidateChatView />} />
      <Route path="/candidateChat" element={<CandidateChatView />} />
      <Route path="/messages" element={<MessagesView />} />
      <Route path="/повідомлення" element={<MessagesView />} />
      <Route path="/notifications" element={<NotificationsView />} />
      <Route path="/сповіщення" element={<NotificationsView />} />
      <Route path="/ai-vacancy-match" element={<AiJobMatchView />} />
      <Route path="/aiJobMatch" element={<AiJobMatchView />} />
      <Route path="/resume-builder" element={<ResumeBuilderView />} />
      <Route path="/resumeBuilder" element={<ResumeBuilderView />} />
      <Route path="/favorite-vacancies" element={<FavoriteVacanciesView />} />
      <Route path="/my-applications" element={<MyApplicationsView />} />
      <Route path="/companiesList" element={<CompaniesListView />} />
      <Route path="/сompaniesList" element={<CompaniesListView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
