import { Navigate, Route, Routes } from 'react-router';
import { useContext } from 'react';
import { PrivateRoute } from './PrivateRoute';
import AuthContext from '../Context/Auth/AuthContext';
import HandleRegister from '../Pages/Register/HandleRegister';
import LoginPage from '../Pages/Login/LoginPage';
import DashBoardPage from '../Pages/DashBoard/DashBoardPage';
import TicketsPage from '../Pages/Tickets/TicketsPage';

const PublicRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  return auth?.token ? <Navigate to="/dashboard" replace /> : children;
};

const HandleRoutes = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashBoardPage />} />
        <Route path="/tickets/:id" element={<TicketsPage />} />
      </Route>
      <Route
        path="/"
        element={<Navigate to={auth?.token ? '/dashboard' : '/register'} replace />}
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <HandleRegister />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="*" element={<Navigate to={auth?.token ? '/dashboard' : '/register'} replace />} />
    </Routes>
  );
};

export default HandleRoutes;
