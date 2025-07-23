import axios from 'axios';

// Creamos una instancia de Axios para centralizar la configuración de la API.
const apiClient = axios.create({
    // Lee la URL base desde las variables de entorno de Vite.
    // Asegúrate de tener un archivo .env en la raíz de tu proyecto con:
    // VITE_API_URL=http://localhost:8000/api
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para añadir el token de autenticación a todas las peticiones
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;
