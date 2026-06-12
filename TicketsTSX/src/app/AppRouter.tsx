import { Navigate, Route, Routes } from 'react-router';
import { type ReactNode } from 'react';
import { useAuth } from '@/Context/Auth/AuthContext';
import { PrivateRoute } from './PrivateRoute';
import LoginScreen from '@/features/Login/indext';
import RegisterFlow from '@/features/Register';
import DashBoardPage from '@/features/DashBoard';
import TicketsScreen from '@/features/Ticket';
import { TicketProvider } from '@/features/Ticket/context/TicketContext';

const PublicRoute = ({ children } : { children: ReactNode }) => {
  const { auth } = useAuth();

  return auth?.token ? <Navigate to="/dashboard" replace /> : children;
};

const AppRouter = () => {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashBoardPage />}/>
            <Route path="/tickets/:id" element={
              <TicketProvider>
                <TicketsScreen />
              </TicketProvider>} />
      </Route>
      <Route
        path="/"
        element={<Navigate to={auth?.token ? '/dashboard' : '/register'} replace />}
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterFlow />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginScreen />
          </PublicRoute>
        }
      />
      <Route path="*" element={<Navigate to={auth?.token ? '/dashboard' : '/register'} replace />} />
    </Routes>
  );

};

export default AppRouter;
