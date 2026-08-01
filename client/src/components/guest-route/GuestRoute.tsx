import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/loader/Loader";
import { useMe } from "@/features/auth/api/auth.api";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const { user, setUser } = useAuthStore();
  const { isLoading } = useMe({
    enabled: !user,
    onSuccess: (data: any) => setUser(data.data),
  });

  if (isLoading) return <Loader fullScreen />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default GuestRoute;
