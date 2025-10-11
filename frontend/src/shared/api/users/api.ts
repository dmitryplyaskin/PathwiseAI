import {
  type User,
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
} from './types';

const API_BASE_URL = 'http://localhost:3000';

export const usersApi = {
  // Авторизация
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Важно для httpOnly cookies
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Ошибка авторизации' }));
      throw new Error(error.message || 'Ошибка авторизации');
    }

    return response.json();
  },

  // Регистрация
  register: async (registerData: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Важно для httpOnly cookies
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Ошибка регистрации' }));
      throw new Error(error.message || 'Ошибка регистрации');
    }

    return response.json();
  },

  // Получение профиля (проверка авторизации)
  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'GET',
      credentials: 'include', // Важно для httpOnly cookies
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Не авторизован');
      }
      throw new Error('Ошибка получения профиля');
    }

    return response.json();
  },

  // Выход
  logout: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Важно для httpOnly cookies
    });

    if (!response.ok) {
      throw new Error('Ошибка выхода из системы');
    }
  },
};
