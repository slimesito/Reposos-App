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

// Páginas de Usuarios
import ManageUsersPage from './pages/ManageUsersPage';
import RegisterUserPage from './pages/RegisterUserPage';
import EditUserPage from './pages/EditUserPage';

// Páginas de Hospitales
import ManageHospitalsPage from './pages/ManageHospitalsPage';
import AddHospitalPage from './pages/AddHospitalPage';
import EditHospitalPage from './pages/EditHospitalPage';

// --- FIX: Se añaden las importaciones que faltaban para las páginas de Patologías ---
import ManagePathologiesPage from './pages/ManagePathologiesPage';
import AddPathologyPage from './pages/AddPathologyPage';
import EditPathologyPage from './pages/EditPathologyPage';

function App() {
    const { isLoggedIn } = useAuth();

    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />} />
            
            {/* Rutas para usuarios autenticados */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
            
            {/* Rutas protegidas solo para administradores (Usuarios) */}
            <Route path="/users" element={<AdminRoute><DashboardLayout><ManageUsersPage /></DashboardLayout></AdminRoute>} />
            <Route path="/users/register" element={<AdminRoute><DashboardLayout><RegisterUserPage /></DashboardLayout></AdminRoute>} />
            <Route path="/users/edit/:userId" element={<AdminRoute><DashboardLayout><EditUserPage /></DashboardLayout></AdminRoute>} />

            {/* Rutas protegidas solo para administradores (Hospitales) */}
            <Route path="/hospitals" element={<AdminRoute><DashboardLayout><ManageHospitalsPage /></DashboardLayout></AdminRoute>} />
            <Route path="/hospitals/add" element={<AdminRoute><DashboardLayout><AddHospitalPage /></DashboardLayout></AdminRoute>} />
            <Route path="/hospitals/edit/:hospitalId" element={<AdminRoute><DashboardLayout><EditHospitalPage /></DashboardLayout></AdminRoute>} />
            
            {/* --- Rutas para Patologías (Protegidas por AdminRoute) --- */}
            <Route path="/pathologies" element={<AdminRoute><DashboardLayout><ManagePathologiesPage /></DashboardLayout></AdminRoute>} />
            <Route path="/pathologies/add" element={<AdminRoute><DashboardLayout><AddPathologyPage /></DashboardLayout></AdminRoute>} />
            <Route path="/pathologies/edit/:pathologyId" element={<AdminRoute><DashboardLayout><EditPathologyPage /></DashboardLayout></AdminRoute>} />

            {/* Redirección por defecto para cualquier otra ruta */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
    );
}

export default App;
