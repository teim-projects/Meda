import axios from 'axios';

const energyAxios = axios.create({
  baseURL: 'http://localhost:8000/api/energy',
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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
    
    const response = await energyAxios.post(`/upload/${energyType}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
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
    return response.data;
  },
};

export default energyApi;
