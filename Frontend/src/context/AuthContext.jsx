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

    // --- Autenticación y Perfil ---
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

    // --- Gestión de Usuarios ---
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
            const response = await apiClient.post('/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al registrar el usuario.' };
        }
    };
    const updateUser = async (userId, formData) => {
        formData.append('_method', 'PUT');
        try {
            const response = await apiClient.post(`/users/${userId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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

    // --- Gestión de Hospitales ---
    const getHospitals = async (params = {}) => {
        try {
            const response = await apiClient.get('/hospitals', { params });
            return { success: true, data: response.data.data || response.data, meta: response.data.meta };
        } catch (error) {
            return { success: false, message: 'Error al obtener los hospitales.' };
        }
    };
    const addHospital = async (hospitalData) => {
        try {
            const response = await apiClient.post('/hospitals', hospitalData);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al añadir el hospital.' };
        }
    };
    const updateHospital = async (hospitalId, hospitalData) => {
        try {
            const response = await apiClient.put(`/hospitals/${hospitalId}`, hospitalData);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al actualizar el hospital.' };
        }
    };
    const deleteHospital = async (hospitalId) => {
        try {
            const response = await apiClient.delete(`/hospitals/${hospitalId}`);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al eliminar el hospital.' };
        }
    };

    // --- Gestión de Ciudades ---
    const getCities = async () => {
        try {
            const response = await apiClient.get('/cities');
            return { success: true, data: response.data.data || response.data };
        } catch (error) {
            return { success: false, message: 'Error al obtener las ciudades.' };
        }
    };

    // --- Gestión de Patologías ---
    const getPathologies = async (params = {}) => {
        try {
            const response = await apiClient.get('/pathologies', { params });
            return { success: true, data: response.data.data, meta: response.data.meta };
        } catch (error) {
            return { success: false, message: 'Error al obtener las patologías.' };
        }
    };
    const addPathology = async (pathologyData) => {
        try {
            const response = await apiClient.post('/pathologies', pathologyData);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al añadir la patología.' };
        }
    };
    const updatePathology = async (pathologyId, pathologyData) => {
        try {
            const response = await apiClient.put(`/pathologies/${pathologyId}`, pathologyData);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al actualizar la patología.' };
        }
    };
    const deletePathology = async (pathologyId) => {
        try {
            const response = await apiClient.delete(`/pathologies/${pathologyId}`);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al eliminar la patología.' };
        }
    };

    // --- Gestión de Especialidades ---
    const getSpecialties = async (params = {}) => {
        try {
            const response = await apiClient.get('/specialties', { params });
            return { success: true, data: response.data.data || response.data, meta: response.data.meta };
        } catch (error) {
            return { success: false, message: 'Error al obtener las especialidades.' };
        }
    };
    const addSpecialty = async (specialtyData) => {
        try {
            const response = await apiClient.post('/specialties', specialtyData);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al añadir la especialidad.' };
        }
    };
    const updateSpecialty = async (specialtyId, specialtyData) => {
        try {
            const response = await apiClient.put(`/specialties/${specialtyId}`, specialtyData);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al actualizar la especialidad.' };
        }
    };
    const deleteSpecialty = async (specialtyId) => {
        try {
            const response = await apiClient.delete(`/specialties/${specialtyId}`);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al eliminar la especialidad.' };
        }
    };

    // --- Gestión de Reposos ---
    const getReposos = async (params = {}) => {
        try {
            const response = await apiClient.get('/reposos', { params });
            // La respuesta paginada de Laravel contiene 'data' para los registros y 'meta' para la paginación.
            return { success: true, data: response.data.data, meta: response.data.meta };
        } catch (error) {
            return { success: false, message: 'Error al obtener los reposos.' };
        }
    };

    const addReposo = async (reposoData) => {
        try {
            const response = await apiClient.post('/reposos', reposoData);
            return { success: true, message: response.data.message };
        } catch (error) {
            // --- FIX: Manejo de errores mejorado ---
            if (error.response && error.response.data) {
                // Si la API devuelve una lista de errores de validación, los unimos.
                if (error.response.data.errors) {
                    const errors = error.response.data.errors;
                    const errorMessages = Object.values(errors).flat().join(' ');
                    return { success: false, message: errorMessages };
                }
                // Si la API devuelve un solo mensaje (como "El usuario no tiene hospital"), lo usamos.
                if (error.response.data.message) {
                    return { success: false, message: error.response.data.message };
                }
            }
            // Fallback para cualquier otro tipo de error.
            return { success: false, message: 'Ocurrió un error inesperado al registrar el reposo.' };
        }
    };

    // --- Nueva función para obtener los pacientes ---
    const getPatients = async () => {
        try {
            const response = await apiClient.get('/patients');
            // Un Resource Collection devuelve { "data": [...] }.
            // Añadimos `response.data.patients` como fallback por si se usa la ruta antigua.
            return { success: true, data: response.data.data || response.data.patients };
        } catch (error) {
            return { success: false, message: 'Error al obtener los pacientes.' };
        }
    };

    // --- Nueva función para buscar ciudadanos ---
    const findCiudadanoByCedula = async (cedula) => {
        try {
            const response = await apiClient.get(`/ciudadanos/find-by-cedula/${cedula}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error al buscar el ciudadano.' };
        }
    };

    const getDashboardData = async () => {
        try {
            // Promise.all nos permite hacer todas las peticiones en paralelo para mayor eficiencia
            const [statsRes, monthlyRes, specialtyRes, recentRes] = await Promise.all([
                apiClient.get('/dashboard/stats'),
                apiClient.get('/dashboard/monthly-reposos'),
                apiClient.get('/dashboard/specialty-distribution'),
                apiClient.get('/dashboard/recent-reposos'),
            ]);

            return {
                success: true,
                data: {
                    stats: statsRes.data,
                    monthlyData: monthlyRes.data,
                    specialtyData: specialtyRes.data,
                    recentReposos: recentRes.data,
                }
            };
        } catch (error) {
            console.error("Error al obtener los datos del dashboard:", error);
            return { success: false, message: 'No se pudieron cargar las estadísticas del dashboard.' };
        }
    };

    const value = useMemo(() => ({
        user, token, isLoggedIn: !!token, loading,
        login, logout, updateProfile,
        getUsers, registerUser, updateUser, deleteUser,
        getHospitals, addHospital, updateHospital, deleteHospital,
        getCities,
        getPathologies, addPathology, updatePathology, deletePathology,
        getSpecialties, addSpecialty, updateSpecialty, deleteSpecialty,
        getReposos, addReposo,
        getPatients,
        findCiudadanoByCedula,
        getDashboardData,
    }), [user, token, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
