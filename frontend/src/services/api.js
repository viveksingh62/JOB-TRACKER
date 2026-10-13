import axios from 'axios';

const API = axios.create({
  baseURL:  import.meta.env.VITE_API_URL ||'http://localhost:8080/api',
  timeout: 60000,
});

export const analyzeResume = async (formData) => {
  const response = await API.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const login = async (credentials) => (await API.post('/auth/login', credentials)).data;
export const register = async (credentials) => (await API.post('/auth/register', credentials)).data;
export const logout = async () => (await API.post('/auth/logout')).data;
export const getCurrentUser = async () => (await API.get('/auth/me')).data;

export const getApplications = async () => {
  const response = await API.get('/applications');
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await API.patch(`/applications/${id}`, { status });
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await API.delete(`/applications/${id}`);
  return response.data;
};

export default API;
