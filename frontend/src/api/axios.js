import axios from 'axios';

// ✅ USAR VARIABLE DE ENTORNO
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;


// import api from '@/api/axios'; // Gracias a la configuración de alias
