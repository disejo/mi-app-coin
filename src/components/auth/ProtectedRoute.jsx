// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, userProfile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        // Si no está autenticado, lo mandamos al login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (!userProfile?.role) {
        // Si está autenticado pero no tiene rol, lo mandamos a seleccionarlo
        return <Navigate to="/select-role" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
        // Si tiene un rol pero no está permitido en esta ruta, lo mandamos al dashboard
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;