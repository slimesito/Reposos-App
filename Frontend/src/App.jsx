import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage'; // 1. Importa la nueva página

function App() {
    const { isLoggedIn } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />} />
            
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <DashboardPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                } 
            />
            
            {/* 2. Ruta añadida para la página de perfil */}
            <Route 
                path="/profile" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <ProfilePage />
                        </DashboardLayout>
                    </ProtectedRoute>
                } 
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
    );
}

export default App;
