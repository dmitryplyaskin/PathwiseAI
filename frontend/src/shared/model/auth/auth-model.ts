import { createStore, createEvent, createEffect, sample } from 'effector';
import {
  usersApi,
  type User,
  type LoginRequest,
  type RegisterRequest,
} from '../../api/users';

// Events
export const loginRequested = createEvent<LoginRequest>();
export const registerRequested = createEvent<RegisterRequest>();
export const logoutRequested = createEvent();
export const checkAuthRequested = createEvent();
export const authReset = createEvent();

// Effects
export const loginFx = createEffect(
  async (loginData: LoginRequest): Promise<User> => {
    const response = await usersApi.login(loginData);
    return response.user;
  },
);

export const registerFx = createEffect(
  async (registerData: RegisterRequest): Promise<User> => {
    const response = await usersApi.register(registerData);
    return response.user;
  },
);

export const checkAuthFx = createEffect(async (): Promise<User> => {
  return usersApi.getProfile();
});

export const logoutFx = createEffect(async (): Promise<void> => {
  await usersApi.logout();
});

// Stores
export const $currentUser = createStore<User | null>(null)
  .on(loginFx.doneData, (_, user) => user)
  .on(registerFx.doneData, (_, user) => user)
  .on(checkAuthFx.doneData, (_, user) => user)
  .reset([logoutFx.done, authReset]);

export const $isAuthenticated = createStore(false)
  .on(loginFx.doneData, () => true)
  .on(registerFx.doneData, () => true)
  .on(checkAuthFx.doneData, () => true)
  .on(checkAuthFx.fail, () => false)
  .reset([logoutFx.done, authReset]);

export const $authLoading = createStore(false)
  .on(loginFx.pending, (_, pending) => pending)
  .on(registerFx.pending, (_, pending) => pending)
  .on(checkAuthFx.pending, (_, pending) => pending);

// Отдельные ошибки для разных операций
export const $loginError = createStore<string | null>(null)
  .on(loginFx.failData, (_, error) => error.message)
  .reset([loginFx, authReset]);

export const $registerError = createStore<string | null>(null)
  .on(registerFx.failData, (_, error) => error.message)
  .reset([registerFx, authReset]);

export const $checkAuthError = createStore<string | null>(null)
  .on(checkAuthFx.failData, (_, error) => error.message)
  .reset([checkAuthFx, authReset]);

// Общая ошибка для совместимости (только для логина и регистрации)
export const $authError = createStore<string | null>(null)
  .on(loginFx.failData, (_, error) => error.message)
  .on(registerFx.failData, (_, error) => error.message)
  .reset([loginFx, registerFx, authReset]);

// Connections
sample({
  clock: loginRequested,
  target: loginFx,
});

sample({
  clock: registerRequested,
  target: registerFx,
});

sample({
  clock: logoutRequested,
  target: logoutFx,
});

sample({
  clock: checkAuthRequested,
  target: checkAuthFx,
});
