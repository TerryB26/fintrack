const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
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
    // If data.data exists and is an array, return it, else return data (array)
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
