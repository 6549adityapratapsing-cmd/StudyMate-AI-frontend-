/**
 * StudyMate AI Frontend API Client
 * Centralized service for making HTTP requests to the Node/Express backend.
 * Automatically attaches the JWT Bearer token to authenticated requests.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Attach JWT token if present in localStorage
  const token = localStorage.getItem('studymate_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData (don't set Content-Type so browser sets boundary)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`❌ API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export const authAPI = {
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getProfile: () => apiRequest('/auth/profile', { method: 'GET' }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

export const materialsAPI = {
  uploadFile: (formData) => apiRequest('/materials/upload', { method: 'POST', body: formData }),
  uploadText: (payload) => apiRequest('/materials/upload', { method: 'POST', body: JSON.stringify(payload) }),
  list: () => apiRequest('/materials', { method: 'GET' }),
  getById: (id) => apiRequest(`/materials/${id}`, { method: 'GET' }),
  delete: (id) => apiRequest(`/materials/${id}`, { method: 'DELETE' }),
};

export const aiAPI = {
  getQuickSummary: (payload) => apiRequest('/ai/quick-summary', { method: 'POST', body: JSON.stringify(payload) }),
  getDetailedSummary: (payload) => apiRequest('/ai/detailed-summary', { method: 'POST', body: JSON.stringify(payload) }),
  getKeyPoints: (payload) => apiRequest('/ai/key-points', { method: 'POST', body: JSON.stringify(payload) }),
  explainConcept: (payload) => apiRequest('/ai/explain', { method: 'POST', body: JSON.stringify(payload) }),
  getImportantQuestions: (payload) => apiRequest('/ai/important-questions', { method: 'POST', body: JSON.stringify(payload) }),
};

export default apiRequest;
