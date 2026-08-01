import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "@/components/error-boundary/ErrorBoundary";
import Loader from "@/components/loader/Loader";
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import GuestRoute from "@/components/guest-route/GuestRoute";
import NotFound from "@/components/not-found/NotFound";

// Eagerly loaded pages (needed initially or small bundle size)
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

// Lazy load large pages not needed on initial render
const ProjectsPage = lazy(
  () => import("@/features/projects/pages/ProjectsPage"),
);
const ProjectDetailPage = lazy(
  () => import("@/features/projects/pages/ProjectDetailPage"),
);

// Suspense wrapper with ErrorBoundary for each lazy route
const LazyRoute = ({ element }: { element: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<Loader fullScreen />}>{element}</Suspense>
  </ErrorBoundary>
);

const router = createBrowserRouter([
  // Auth routes
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },

  // Protected app routes
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/projects",
        element: <LazyRoute element={<ProjectsPage />} />,
      },
      {
        path: "/projects/:id",
        element: <LazyRoute element={<ProjectDetailPage />} />,
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
