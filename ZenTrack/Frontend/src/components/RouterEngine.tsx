import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/UI/ProtectedRoute";
import PublicRoute from "@/components/UI/PublicRoute";

import Spinner from "@/components/UI/Spinner";

import LoginScreen from "@/features/auth/login/LoginScreen";
import RegisterScreen from "@/features/auth/register/RegisterScreen";
import BoardScreen from "@/features/board/BoardScreen";
import DashboardScreen from "@/features/dashboard/DashboardScreen";


function AppWrapper({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((s) => s.checkSession);
  const isLoading = useAuthStore((s) => s.isLoading);



  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (isLoading) return <Spinner />;

  return <>{children}</>;
}

export default function RouterEngine() {
  return (
    <BrowserRouter>
        <AppWrapper>
          <Routes>
            {/* Public routes — only when NOT authenticated */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
            </Route>

            {/* Protected routes — only when authenticated */}
            <Route element={<ProtectedRoute />}>
              <Route path="/board/:id" element={<BoardScreen />} />
              <Route path="/" element={<DashboardScreen />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppWrapper>
    </BrowserRouter>
  )
}
