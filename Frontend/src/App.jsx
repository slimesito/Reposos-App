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
import ManageUsersPage from './pages/users/ManageUsersPage';
import RegisterUserPage from './pages/users/RegisterUserPage';
import EditUserPage from './pages/users/EditUserPage';

// Páginas de Hospitales
import ManageHospitalsPage from './pages/hospitals/ManageHospitalsPage';
import AddHospitalPage from './pages/hospitals/AddHospitalPage';
import EditHospitalPage from './pages/hospitals/EditHospitalPage';

// Páginas de Patologías
import ManagePathologiesPage from './pages/pathologies/ManagePathologiesPage';
import AddPathologyPage from './pages/pathologies/AddPathologyPage';
import EditPathologyPage from './pages/pathologies/EditPathologyPage';

// Páginas de Especialidades
import ManageSpecialtiesPage from './pages/specialties/ManageSpecialtiesPage';
import AddSpecialtyPage from './pages/specialties/AddSpecialtyPage';
import EditSpecialtyPage from './pages/specialties/EditSpecialtyPage';

// Páginas de Reposos
import ManageRepososPage from './pages/reposos/ManageRepososPage';
import RegisterReposoPage from './pages/reposos/RegisterReposoPage';

// Páginas de Pacientes
import ManagePatientsPage from './pages/ManagePatientsPage';

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

            {/* --- Rutas para Especialidades (Protegidas por AdminRoute) --- */}
            <Route path="/specialties" element={<AdminRoute><DashboardLayout><ManageSpecialtiesPage /></DashboardLayout></AdminRoute>} />
            <Route path="/specialties/add" element={<AdminRoute><DashboardLayout><AddSpecialtyPage /></DashboardLayout></AdminRoute>} />
            <Route path="/specialties/edit/:specialtyId" element={<AdminRoute><DashboardLayout><EditSpecialtyPage /></DashboardLayout></AdminRoute>} />

            {/* --- Ruta para Pacientes (Protegida para cualquier usuario logueado) --- */}
            <Route path="/pacientes" element={<AdminRoute><DashboardLayout><ManagePatientsPage /></DashboardLayout></AdminRoute>} />

            {/* --- Rutas para Reposos (Protegidas) --- */}
            <Route path="/reposos" element={<ProtectedRoute><DashboardLayout><ManageRepososPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/reposos/register" element={<ProtectedRoute><DashboardLayout><RegisterReposoPage /></DashboardLayout></ProtectedRoute>} />

            {/* Redirección por defecto para cualquier otra ruta */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
    );
}

export default App;
