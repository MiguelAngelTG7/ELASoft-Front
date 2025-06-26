import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // o simplemente '/api/' si usas proxy
});

export default api;
