import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const energyAxios = axios.create({
  baseURL: `${API_BASE_URL}/api/energy`,
});

// Helper function to get token from storage
const getToken = () => {
  const tokenKeys = ['token', 'access_token', 'jwt', 'accessToken', 'jwtToken'];
  for (const key of tokenKeys) {
    const token = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (token) return token;
  }
  return null;
};

// Request Interceptor: Automatically attaches the JWT token
energyAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles 401 Unauthorized by attempting to refresh token
energyAxios.interceptors.response.use(
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

            return energyAxios(originalRequest);
          }
        } catch (refreshErr) {
          console.error('Token refresh failed:', refreshErr);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      } else {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Recursively normalizes district names and numerical strings in any API response
 * replacing Aurangabad, Osmanabad, Ahmednagar with their official new names.
 */
export const normalizeApiResponse = (data) => {
  if (!data) return data;
  if (typeof data === 'string') {
    let s = data;
    // Replace legacy district names
    s = s.replace(/\b(ahmednagar|ahemadnagar|ahmadnagar|ahilya\s*nagar)\b/gi, 'Ahilyanagar');
    s = s.replace(/\b(aurangabad|chhatrapati\s*sambhaji\s*nagar|sambhaji\s*nagar)\b/gi, 'Chhatrapati Sambhajinagar');
    s = s.replace(/\b(osmanabad|usmanabad)\b/gi, 'Dharashiv');
    return s;
  }
  if (Array.isArray(data)) {
    return data.map(item => normalizeApiResponse(item));
  }
  if (typeof data === 'object') {
    const normalized = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'district' && typeof value === 'string') {
        const vLower = value.toLowerCase().trim();
        if (vLower.includes('ahmednagar') || vLower.includes('ahemadnagar') || vLower.includes('ahmadnagar') || vLower.includes('ahilya')) {
          normalized[key] = 'Ahilyanagar';
        } else if (vLower.includes('aurangabad') || vLower.includes('sambhajinagar')) {
          normalized[key] = 'Chhatrapati Sambhajinagar';
        } else if (vLower.includes('osmanabad') || vLower.includes('usmanabad') || vLower.includes('dharashiv')) {
          normalized[key] = 'Dharashiv';
        } else {
          normalized[key] = normalizeApiResponse(value);
        }
      } else {
        normalized[key] = normalizeApiResponse(value);
      }
    }
    return normalized;
  }
  return data;
};

export const energyApi = {
  /**
   * Triggers the download of the blank Excel template.
   */
  downloadTemplate: async (energyType) => {
    const response = await energyAxios.get(`/template/${energyType}/`, {
      responseType: 'blob', // Necessary for file downloads
    });
    return response;
  },

  /**
   * Uploads a completed Excel template to the backend.
   */
  uploadExcel: async (energyType, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Do not set explicit 'Content-Type': 'multipart/form-data' header;
    // let Axios and the browser generate the header automatically along with the boundary string.
    const response = await energyAxios.post(`/upload/${energyType}/`, formData);
    return normalizeApiResponse(response.data);
  },

  /**
   * Triggers the download of the filled Excel dataset.
   */
  downloadFilledData: async (energyType) => {
    const response = await energyAxios.get(`/export/${energyType}/`, {
      responseType: 'blob', // Necessary for file downloads
    });
    return response;
  },

  /**
   * Fetches stored database records for the selected energy type.
   */
  getData: async (energyType) => {
    const response = await energyAxios.get(`/data/${energyType}/`);
    return normalizeApiResponse(response.data);
  },

  /**
   * Fetches aggregated analytics for the selected energy type.
   */
  getAnalytics: async (energyType) => {
    const response = await energyAxios.get(`/analytics/${energyType}/`);
    return normalizeApiResponse(response.data);
  },
};

export default energyApi;

