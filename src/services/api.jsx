// Interceptor para refrescar el token si expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          (import.meta.env.VITE_API_URL || "https://elasoft-back.onrender.com/api/") + "refresh/",
          { refresh: localStorage.getItem("refresh") }
        );
        localStorage.setItem("access", res.data.access);
        originalRequest.headers["Authorization"] = "Bearer " + res.data.access;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/"; // Redirige al login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
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

// Servicio para obtener profesores por periodo académico
export const getProfesoresPorPeriodo = async (periodoId) => {
  const response = await api.get(`/director/profesores/?periodo_id=${periodoId}`);
  return response.data.profesores;
};

// Servicio para obtener periodos académicos
export const getPeriodosAcademicos = async () => {
  const response = await api.get("/director/periodos/");
  return response.data.periodos; // Ajusta según la respuesta real de tu backend
};

export default api;
