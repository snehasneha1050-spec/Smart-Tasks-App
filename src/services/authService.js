import api, { setAuthToken } from './api';

export const signup = async ({ name, email, password }) => {
  const response = await api.post('/auth/signup', { name, email, password });
  if (response.data?.token) {
    setAuthToken(response.data.token);
  }
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data?.token) {
    setAuthToken(response.data.token);
  }
  return response.data;
};

export const logout = () => {
  setAuthToken(null);
};
