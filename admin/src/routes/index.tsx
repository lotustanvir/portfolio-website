import { lazy, Suspense, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingScreen from "@/components/common/LoadingScreen";

const LoginPage = lazy(() => import("@/features/auth/LoginPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const ProjectsPage = lazy(() => import("@/features/projects/ProjectsPage"));
const SkillsPage = lazy(() => import("@/features/skills/SkillsPage"));
const ExperiencePage = lazy(() => import("@/features/experience/ExperiencePage"));
const EducationPage = lazy(() => import("@/features/education/EducationPage"));
const CertificatesPage = lazy(() => import("@/features/certificates/CertificatesPage"));
const ResumePage = lazy(() => import("@/features/resume/ResumePage"));
const MessagesPage = lazy(() => import("@/features/messages/MessagesPage"));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage"));
const ProfilePage = lazy(() => import("@/features/profile/ProfilePage"));

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return children;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
}

function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
          <Route path={ROUTES.PROJECT_NEW} element={<ProjectsPage />} />
          <Route path={ROUTES.PROJECT_EDIT(":id")} element={<ProjectsPage />} />
          <Route path={ROUTES.SKILLS} element={<SkillsPage />} />
          <Route path={ROUTES.EXPERIENCE} element={<ExperiencePage />} />
          <Route path={ROUTES.EDUCATION} element={<EducationPage />} />
          <Route path={ROUTES.CERTIFICATES} element={<CertificatesPage />} />
          <Route path={ROUTES.RESUME} element={<ResumePage />} />
          <Route path={ROUTES.MESSAGES} element={<MessagesPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
