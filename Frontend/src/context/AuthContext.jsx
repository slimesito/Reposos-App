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
                    console.error("Error al parsear el usuario guardado:", e);
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
        data.append('_method', 'PUT');
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
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const { user: updatedUser } = response.data;
            localStorage.setItem('authUser', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al actualizar el perfil.' };
        }
    };

    const getUsers = async (params = {}) => {
        try {
            const response = await apiClient.get('/users', { params });
            return { success: true, data: response.data.data, meta: response.data.meta };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al obtener los usuarios.' };
        }
    };

    const registerUser = async (formData) => {
        try {
            const response = await apiClient.post('/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al registrar el usuario.' };
        }
    };

    const updateUser = async (userId, formData) => {
        formData.append('_method', 'PUT');
        try {
            const response = await apiClient.post(`/users/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al actualizar el usuario.' };
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await apiClient.delete(`/users/${userId}`);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al eliminar el usuario.' };
        }
    };

    const getSpecialties = async () => {
        try {
            const response = await apiClient.get('/specialties');
            // FIX: Extraemos el arreglo del objeto 'data' o usamos la respuesta directamente.
            return { success: true, data: response.data.data || response.data };
        } catch (error) {
            return { success: false, message: 'Error al obtener las especialidades.' };
        }
    };

    const getHospitals = async () => {
        try {
            const response = await apiClient.get('/hospitals');
            // FIX: Hacemos lo mismo para los hospitales.
            return { success: true, data: response.data.data || response.data };
        } catch (error) {
            return { success: false, message: 'Error al obtener los hospitales.' };
        }
    };

    const value = useMemo(() => ({
        user,
        token,
        isLoggedIn: !!token,
        loading,
        login,
        logout,
        updateProfile,
        getUsers,
        registerUser,
        updateUser,
        deleteUser,
        getSpecialties,
        getHospitals,
    }), [user, token, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
