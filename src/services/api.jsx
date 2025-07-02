import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://elasoft-back.onrender.com/api/",
});

// Agrega token automáticamente si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
