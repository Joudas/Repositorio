import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import Spinner from "./Spinner";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.user !== null);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
