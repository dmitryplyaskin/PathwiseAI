import { useEffect } from 'react';
import { useStore } from 'effector-react';
import {
  $currentUser,
  $currentUserLoading,
  $currentUserError,
  loadCurrentUser,
} from './users-model';

/**
 * Хук для получения текущего пользователя.
 * Автоматически загружает пользователя при первом использовании.
 *
 * @returns Объект с данными пользователя, статусом загрузки и ошибкой
 */
export const useCurrentUser = () => {
  const user = useStore($currentUser);
  const loading = useStore($currentUserLoading);
  const error = useStore($currentUserError);

  useEffect(() => {
    if (!user && !loading && !error) {
      loadCurrentUser();
    }
  }, [user, loading, error]);

  return {
    user,
    loading,
    error,
    userId: user?.id ?? null,
  };
};
