import axios from 'axios';

// Cria uma instância do Axios com a URL base do seu backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export default api;