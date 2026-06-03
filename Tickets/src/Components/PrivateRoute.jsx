import { Navigate, Outlet } from 'react-router';
import { useContext } from 'react';
import AuthContext from '../Context/Auth/AuthContext';

const PrivateRoute = () => {
    const { auth } = useContext(AuthContext);

    return auth?.token ? <Outlet /> : <Navigate to="/login" replace />;
};

export {PrivateRoute};