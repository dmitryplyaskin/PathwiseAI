import { apiClient } from '../config';
import {
  type User,
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
} from './types';

export const usersApi = {
  // Авторизация
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', loginData);
  },

  // Регистрация
  register: async (registerData: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', registerData);
  },

  // Получение профиля (проверка авторизации)
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/profile');
  },

  // Выход
  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },
};
