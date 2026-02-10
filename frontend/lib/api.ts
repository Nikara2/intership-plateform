// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API Helper Functions
export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('access_token');

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    console.log('API Request:', {
      endpoint,
      method: config.method || 'GET',
      hasToken: !!token,
      url: `${API_URL}${endpoint}`,
    });

    const response = await fetch(`${API_URL}${endpoint}`, config);

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = { message: 'Invalid JSON response' };
    }

    console.log('API Response:', {
      status: response.status,
      ok: response.ok,
      data
    });

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  },

  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  async post(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async patch(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

// Auth Helper Functions
export const auth = {
  login: (token: string, role: string, email: string) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_email', email);
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
  },

  getToken: () => {
    return localStorage.getItem('access_token');
  },

  getRole: () => {
    return localStorage.getItem('user_role');
  },

  getEmail: () => {
    return localStorage.getItem('user_email');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

// Company API
export const companyAPI = {
  getStats: () => api.get('/companies/me/stats'),
  getProfile: () => api.get('/companies/me'),
  updateProfile: (data: any) => api.patch('/companies/me', data),
  setupProfile: () => api.post('/companies/setup-profile', {}),
};

// Offers API
export const offersAPI = {
  getAll: () => api.get('/offers'),
  getById: (id: string) => api.get(`/offers/${id}`),
  create: (data: any) => api.post('/offers', data),
  update: (id: string, data: any) => api.patch(`/offers/${id}`, data),
  delete: (id: string) => api.delete(`/offers/${id}`),
};

// Applications API
export const applicationsAPI = {
  getAll: (params?: { offer_id?: string; student_id?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.offer_id) queryParams.append('offer_id', params.offer_id);
    if (params?.student_id) queryParams.append('student_id', params.student_id);
    const query = queryParams.toString();
    return api.get(`/applications${query ? '?' + query : ''}`);
  },
  getById: (id: string) => api.get(`/applications/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/applications/${id}/status`, { status }),
};

// Evaluations API
export const evaluationsAPI = {
  getAll: () => api.get('/evaluations'),
  getById: (id: string) => api.get(`/evaluations/${id}`),
  create: (data: { application_id: string; score: number; comment?: string }) =>
    api.post('/evaluations', data),
  update: (id: string, data: { score?: number; comment?: string }) =>
    api.patch(`/evaluations/${id}`, data),
  delete: (id: string) => api.delete(`/evaluations/${id}`),
};
