import axios from 'axios';
import { API_URL } from '../config/apiConfig';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Si usas cookies o JWT
});

export default api;


// import api from '@/api/axios'; // Gracias a la configuración de alias
