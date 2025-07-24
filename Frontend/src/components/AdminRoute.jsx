import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    // Primero, nos aseguramos de que el usuario esté logueado.
    // Luego, verificamos si es administrador.
    return (
        <ProtectedRoute>
            {user?.is_admin ? children : <Navigate to="/dashboard" />}
        </ProtectedRoute>
    );
};

export default AdminRoute;
