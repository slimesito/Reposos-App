import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const storedUser = localStorage.getItem('authUser');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Error parsing stored user:", e);
                    setUser(null);
                }
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('authToken', token);
            localStorage.setItem('authUser', JSON.stringify(user));

            setToken(token);
            setUser(user);
            
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            navigate('/dashboard');
            return { success: true };
        } catch (error) {
            console.error("Error en el login:", error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || 'Error al iniciar sesión.' };
        }
    };

    const logout = () => {
        apiClient.post('/logout').catch(console.error);
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setToken(null);
        setUser(null);
        delete apiClient.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const updateProfile = async (formData) => {
        const data = new FormData();
        data.append('_method', 'PUT'); // Truco para que Laravel maneje PUT con FormData

        if (formData.password) {
            data.append('password', formData.password);
            data.append('password_confirmation', formData.password);
        }
        if (formData.profile_picture) {
            data.append('profile_picture', formData.profile_picture);
        }

        if (!formData.password && !formData.profile_picture) {
            return { success: true, message: 'No hay cambios que guardar.' };
        }

        try {
            const response = await apiClient.post('/user/profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { user: updatedUser } = response.data;
            
            localStorage.setItem('authUser', JSON.stringify(updatedUser));
            setUser(updatedUser);

            return { success: true, message: response.data.message };
        } catch (error) {
            console.error("Error al actualizar el perfil:", error.response?.data);
            const errorMessage = error.response?.data?.message || 'Ocurrió un error al actualizar el perfil.';
            return { success: false, message: errorMessage };
        }
    };

    const value = useMemo(() => ({
        user,
        token,
        isLoggedIn: !!token,
        loading,
        login,
        logout,
        updateProfile // Se exporta la nueva función
    }), [user, token, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
