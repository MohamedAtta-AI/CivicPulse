const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface Metric {
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: string;
  color: string;
}

export interface SentimentData {
  day: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface Topic {
  text: string;
  count: number;
  sentiment: string;
}

export interface SourceData {
  name: string;
  value: number;
  color: string;
}

export interface Mention {
  id: number;
  author: string;
  platform: string;
  content: string;
  sentiment: string;
  timestamp: string;
  topic: string;
}

export interface Insight {
  icon: string;
  title: string;
  priority: string;
  description: string;
  advice: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `API error: ${response.statusText}`);
  }
  return response.json();
}

async function fetchAPIWithAuth<T>(endpoint: string, token: string, options?: RequestInit): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export const api = {
  // Authentication endpoints
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `Login failed: ${response.statusText}`);
    }
    return response.json();
  },

  register: async (
    email: string,
    username: string,
    password: string,
    fullName?: string
  ): Promise<User> => {
    return fetchAPI<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        username,
        password,
        full_name: fullName || null,
      }),
    });
  },

  getCurrentUser: (token: string): Promise<User> => {
    return fetchAPIWithAuth<User>("/api/auth/me", token);
  },

  // Dashboard endpoints
  getMetrics: (): Promise<Metric[]> => fetchAPI("/api/dashboard/metrics"),
  getSentiment: (): Promise<SentimentData[]> => fetchAPI("/api/dashboard/sentiment"),
  getTopics: (): Promise<Topic[]> => fetchAPI("/api/dashboard/topics"),
  getSources: (): Promise<SourceData[]> => fetchAPI("/api/dashboard/sources"),
  getMentions: (): Promise<Mention[]> => fetchAPI("/api/dashboard/mentions"),
  getInsights: (): Promise<Insight[]> => fetchAPI("/api/dashboard/insights"),

  // Chat endpoints
  sendMessage: async (message: string): Promise<{ response: string }> => {
    return fetchAPI<{ response: string }>("/chat/", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },

  clearChat: async (): Promise<{ message: string }> => {
    return fetchAPI<{ message: string }>("/chat/", {
      method: "DELETE",
    });
  },
};

