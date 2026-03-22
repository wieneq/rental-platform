// API 呼叫封裝
const API = {
  baseURL: '',
  
  async request(url, options = {}) {
    try {
      const response = await fetch(this.baseURL + url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || '請求失敗');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // 認證
  auth: {
    register: (data) => API.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    login: (data) => API.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    logout: () => API.request('/api/auth/logout', { method: 'POST' }),
    me: () => API.request('/api/auth/me')
  },
  
  // 器材
  equipment: {
    getAll: (params) => {
      const query = new URLSearchParams(params).toString();
      return API.request(`/api/equipment${query ? '?' + query : ''}`);
    },
    getById: (id) => API.request(`/api/equipment/${id}`),
    create: (data) => API.request('/api/equipment', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => API.request(`/api/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => API.request(`/api/equipment/${id}`, { method: 'DELETE' })
  },
  
  // 預約
  bookings: {
    getAll: (params) => {
      const query = new URLSearchParams(params).toString();
      return API.request(`/api/bookings${query ? '?' + query : ''}`);
    },
    checkAvailability: (data) => API.request('/api/bookings/check-availability', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    create: (data) => API.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateStatus: (id, status) => API.request(`/api/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  },
  
  // 租約
  contracts: {
    getAll: () => API.request('/api/contracts'),
    getById: (id) => API.request(`/api/contracts/${id}`),
    sign: (data) => API.request('/api/contracts/sign', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    download: (id) => `/api/contracts/${id}/download`
  },
  
  // 押金
  deposits: {
    getAll: () => API.request('/api/deposits'),
    refund: (id) => API.request(`/api/deposits/${id}/refund`, { method: 'PUT' }),
    deduct: (id, data) => API.request(`/api/deposits/${id}/deduct`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  
  // 報修
  repairs: {
    getAll: () => API.request('/api/repairs'),
    create: (data) => API.request('/api/repairs', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateStatus: (id, data) => API.request(`/api/repairs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }
};

// 工具函數
const Utils = {
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    toast.style.zIndex = '9999';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  },
  
  formatDate(date) {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  formatCurrency(amount) {
    return `NT$ ${amount.toLocaleString()}`;
  }
};

// 檢查登入狀態
async function checkAuth() {
  try {
    const user = await API.auth.me();
    return user;
  } catch (error) {
    return null;
  }
}

// 需要登入的頁面重新導向（展示版：自動登入）
async function requireAuth() {
  let user = await checkAuth();
  if (!user) {
    // 自動以租用者身份登入（展示版）
    try {
      const result = await API.auth.login({ 
        username: 'guest', 
        password: 'guest', 
        role: 'renter' 
      });
      user = result.user;
      localStorage.setItem('user', JSON.stringify(user));
      Utils.showToast('已自動登入為訪客', 'info');
    } catch (error) {
      window.location.href = '/login.html';
      return null;
    }
  }
  return user;
}
