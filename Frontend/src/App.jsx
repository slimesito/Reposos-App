import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Componentes de Rutas
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Layout y Páginas
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ManageUsersPage from './pages/ManageUsersPage';
import RegisterUserPage from './pages/RegisterUserPage';
import EditUserPage from './pages/EditUserPage';

function App() {
    const { isLoggedIn } = useAuth();

    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />} />
            
            {/* Rutas para usuarios autenticados */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
            
            {/* Rutas protegidas solo para administradores */}
            <Route path="/users" element={<AdminRoute><DashboardLayout><ManageUsersPage /></DashboardLayout></AdminRoute>} />
            <Route path="/users/register" element={<AdminRoute><DashboardLayout><RegisterUserPage /></DashboardLayout></AdminRoute>} />
            <Route path="/users/edit/:userId" element={<AdminRoute><DashboardLayout><EditUserPage /></DashboardLayout></AdminRoute>} />

            {/* Redirección por defecto para cualquier otra ruta */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
    );
}

export default App;
