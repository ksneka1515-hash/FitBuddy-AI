import { User, Plan, PlanResultData, DashboardStats } from '../types';

const TOKEN_KEY = 'pocketsmart_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data as T;
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string, confirmPassword?: string) {
    const res = await request<{ message: string; token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirm_password: confirmPassword }),
    });
    setStoredToken(res.token);
    return res;
  },

  async login(email: string, password: string) {
    const res = await request<{ message: string; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async loginDemo() {
    const res = await request<{ message: string; token: string; user: User }>('/api/auth/demo', {
      method: 'POST',
    });
    setStoredToken(res.token);
    return res;
  },

  async getMe() {
    return request<{ user: User }>('/api/auth/me');
  },

  async updateProfile(name: string) {
    return request<{ message: string; user: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  async changePassword(current_password: string, new_password: string) {
    return request<{ message: string }>('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ current_password, new_password }),
    });
  },

  async logout() {
    try {
      await request<{ message: string }>('/api/auth/logout', { method: 'POST' });
    } finally {
      clearStoredToken();
    }
  },

  // AI & Plans
  async generateAIPlan(payload: { plan_type: string; budget: number; [key: string]: any }) {
    return request<{ success: boolean; plan: PlanResultData }>('/api/ai/generate-plan', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getPlans() {
    return request<{ plans: Plan[]; stats: DashboardStats }>('/api/plans');
  },

  async savePlan(plan: {
    plan_type: string;
    title: string;
    budget: number;
    budget_used: number;
    budget_remaining: number;
    request_data: Record<string, any>;
    result_data: PlanResultData;
  }) {
    return request<{ message: string; plan: Plan }>('/api/plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  },

  async getPlanById(id: string) {
    return request<{ plan: Plan }>(`/api/plans/${id}`);
  },

  async deletePlan(id: string) {
    return request<{ message: string }>(`/api/plans/${id}`, {
      method: 'DELETE',
    });
  },

  // Contact
  async sendContact(name: string, email: string, message: string) {
    return request<{ message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email, message }),
    });
  },
};
