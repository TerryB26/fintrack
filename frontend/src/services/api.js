const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log('🔑 Token from localStorage:', token ? 'exists' : 'null');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }
    
    return response.json();
  },
};

export const accountsAPI = {
  getAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }
    const data = await response.json();
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.accounts)) return data.accounts;
    if (Array.isArray(data)) return data;
    return [];
  },

  getAccountBalance: async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/balance`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch account balance');
    }
    
    return response.json();
  },
};

export const transactionsAPI = {
  getTransactions: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await fetch(`${API_BASE_URL}/transactions?${params}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return response.json();
  },

  transfer: async (fromAccountId, toAccountId, amount, description) => {
    const response = await fetch(`${API_BASE_URL}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ fromAccountId, toAccountId, amount, description }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Transfer failed');
    }
    
    return response.json();
  },

  exchange: async (fromAccountId, toAccountId, sourceAmount, targetAmount, exchangeRate, description) => {
    const response = await fetch(`${API_BASE_URL}/transactions/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ fromAccountId, toAccountId, sourceAmount, targetAmount, exchangeRate, description }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Exchange failed');
    }
    
    return response.json();
  },
};

export const usersAPI = {
  searchUsers: async (query) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    
    const url = `${API_BASE_URL}/users/search?${params}`;
    
    const response = await fetch(url, {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error('Failed to search users');
    }
    
    const data = await response.json();
    return data;
  },

  getUserAccounts: async (userId) => {
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/accounts`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error('Failed to get user accounts');
    }
    
    const data = await response.json();
    console.log('✅ Get user accounts response:', data);
    return data;
  },
};
