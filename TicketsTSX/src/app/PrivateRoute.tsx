import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/Context/Auth/AuthContext';

const PrivateRoute = () => {
    const { auth } = useAuth();

    return auth?.token ? <Outlet /> : <Navigate to="/login" replace />;
};

export {PrivateRoute};