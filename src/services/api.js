import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredToken = () => {
  const tokenFromGlobal = globalThis.__SMARTTASKS_TOKEN__ || global.__SMARTTASKS_TOKEN__ || null;
  return tokenFromGlobal || null;
};

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  } else if (config.headers) {
    delete config.headers.Authorization;
  }
  return config;
});

export const setAuthToken = (token) => {
  const nextToken = token || null;
  globalThis.__SMARTTASKS_TOKEN__ = nextToken;
  if (typeof global !== 'undefined') {
    global.__SMARTTASKS_TOKEN__ = nextToken;
  }
  if (axios.defaults && axios.defaults.headers) {
    axios.defaults.headers.common.Authorization = nextToken ? `Bearer ${nextToken}` : undefined;
  }
};

export default api;
