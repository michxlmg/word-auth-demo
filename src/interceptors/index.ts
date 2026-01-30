
import axios from 'axios';
import { API_URL } from '../config';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('TOKEN_AUTH');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: any) => {
    // Standardize error message
    const message = error.response?.data?.message || error.response?.data?.description || "Error de conexión";

    if (error.response?.status === 401) {
      console.warn("Unauthorized access - removing token");
      localStorage.removeItem('TOKEN_AUTH');
    }

    return Promise.reject(new Error(message));
  }
);
