export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  settings?: Record<string, unknown>;
}

export interface AuthResponse {
  user: User;
}
