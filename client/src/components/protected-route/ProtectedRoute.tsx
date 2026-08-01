import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/loader/Loader";
import { useMe } from "@/features/auth/api/auth.api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuthStore();
  // Always fetch /auth/me on mount — syncs the latest role/data from DB into Zustand.
  // We wait for this to finish before rendering children so that useProjects / useTasks
  // don't fire before the session cookie is confirmed. Without this guard, members see
  // data flash then disappear on refresh because child queries get a 401 mid-flight.
  const { isLoading } = useMe();

  // Show loader while validating session (covers the refresh race condition)
  if (isLoading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
