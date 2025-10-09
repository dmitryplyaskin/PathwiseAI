import { useUnit } from 'effector-react';
import {
  $currentUser,
  $authLoading,
  $checkAuthError,
} from '../auth/auth-model';

/**
 * Хук для получения текущего пользователя.
 * Использует данные из auth-model.
 *
 * @returns Объект с данными пользователя, статусом загрузки и ошибкой
 */
export const useCurrentUser = () => {
  const [user, loading, error] = useUnit([
    $currentUser,
    $authLoading,
    $checkAuthError,
  ]);

  return {
    user,
    loading,
    error,
    userId: user?.id ?? null,
  };
};
