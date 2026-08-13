// Centralized API configuration supporting environment variables
// Local development defaults to http://localhost:8000
// Live production uses https://teimsafety.com via VITE_API_BASE_URL environment variable

const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  // Remove trailing slash if present to ensure clean URL concatenation
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
