import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

// Dedicated Authenticated Axios Instance for MEDA Integration
const medaAxios = axios.create({
  baseURL: `${API_BASE_URL}/api/meda`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get token from various possible storage keys
const getToken = () => {
  // Try multiple possible token keys
  const tokenKeys = ['token', 'access_token', 'jwt', 'accessToken', 'jwtToken'];
  
  for (const key of tokenKeys) {
    const token = localStorage.getItem(key);
    if (token) {
      return token;
    }
  }
  
  // Also try sessionStorage
  for (const key of tokenKeys) {
    const token = sessionStorage.getItem(key);
    if (token) {
      return token;
    }
  }
  
  return null;
};

// Request Interceptor: Automatically attaches the Django Superuser JWT token
medaAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.warn('No token found in storage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catches 401 and attempts token refresh
medaAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh') || sessionStorage.getItem('refresh');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/api/accounts/token/refresh/`, {
            refresh: refreshToken,
          });

          if (res.data && res.data.access) {
            const newAccess = res.data.access;
            localStorage.setItem('token', newAccess);
            if (res.data.refresh) {
              localStorage.setItem('refresh', res.data.refresh);
            }

            if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
              originalRequest.headers.set('Authorization', `Bearer ${newAccess}`);
            } else {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            }

            return medaAxios(originalRequest);
          }
        } catch (refreshErr) {
          console.warn('Token refresh failed for medaAxios:', refreshErr);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const medaApi = {
  // Connection & Status endpoints
  connect: async (credentials) => {
    const res = await medaAxios.post('/auth/connect/', credentials);
    return res.data;
  },

  disconnect: async () => {
    const res = await medaAxios.post('/auth/disconnect/', {});
    return res.data;
  },

  getStatus: async () => {
    const res = await medaAxios.get('/auth/status/');
    return res.data;
  },

  // Fetch Data endpoint
  fetchData: async (monthRange) => {
    const res = await medaAxios.post('/fetch/', monthRange);
    return res.data;
  },

  // Sync History endpoints
  getSyncJobs: async (params = {}) => {
    const res = await medaAxios.get('/sync-jobs/', { params });
    return res.data;
  },

  getSyncJobDetail: async (id) => {
    const res = await medaAxios.get(`/sync-jobs/${id}/`);
    return res.data;
  },

  // Request Logs endpoint
  getRequestLogs: async (params = {}) => {
    const res = await medaAxios.get('/request-logs/', { params });
    return res.data;
  },

  // Raw Records endpoint
  getRawRecords: async (params = {}) => {
    const res = await medaAxios.get('/raw-records/', { params });
    return res.data;
  },

  // Normalized Credit Notes endpoint
  getCreditNotes: async (params = {}) => {
    const res = await medaAxios.get('/credit-notes/', { params });
    return res.data;
  },

  // Reparse all raw records without deduplication
  reparseRawRecords: async (options = {}) => {
    const res = await medaAxios.post('/reparse/', options);
    return res.data;
  },
};

// Debug helper - call this from console to check token status
export const debugAuth = () => {
  const token = getToken();
  console.log('Token found:', token ? 'Yes' : 'No');
  if (token) {
    console.log('Token preview:', token.substring(0, 30) + '...');
    console.log('Token length:', token.length);
  }
  
  // Check all localStorage keys
  console.log('All localStorage keys:', Object.keys(localStorage));
  
  return { tokenExists: !!token, token };
};

export default medaApi;