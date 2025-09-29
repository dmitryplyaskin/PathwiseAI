import { createStore, createEvent, createEffect, sample } from 'effector';
import { usersApi, type User } from '../../api/users';

// Events
export const loadCurrentUser = createEvent();
export const resetUser = createEvent();

// Effects
export const loadUserByUsernameFx = createEffect(
  async (username: string): Promise<User> => {
    return usersApi.getUserByUsername(username);
  },
);

// Stores
export const $currentUser = createStore<User | null>(null)
  .on(loadUserByUsernameFx.doneData, (_, user) => user)
  .reset(resetUser);

export const $currentUserLoading = createStore(false).on(
  loadUserByUsernameFx.pending,
  (_, pending) => pending,
);

export const $currentUserError = createStore<string | null>(null)
  .on(loadUserByUsernameFx.failData, (_, error) => error.message)
  .reset([loadUserByUsernameFx, resetUser]);

// Connections
sample({
  clock: loadCurrentUser,
  fn: () => 'testuser', // TODO: Заменить на реальную логику получения текущего пользователя
  target: loadUserByUsernameFx,
});
