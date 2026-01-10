import { $appInitialized, checkAuthRequested } from '@shared/model/auth';
import { AppLoader } from '@shared/ui';
import { useUnit } from 'effector-react';
import { useEffect, type ReactNode } from 'react';

interface InitializedProviderProps {
  children: ReactNode;
}

export const InitializedProvider = ({ children }: InitializedProviderProps) => {
  const appInitialized = useUnit($appInitialized);

  useEffect(() => {
    // Проверяем авторизацию ровно один раз при старте приложения.
    // Инициализацию завершаем по done/fail эффекта checkAuthFx (см. $appInitialized).
    checkAuthRequested();
  }, []);

  if (!appInitialized) {
    return <AppLoader />;
  }

  return <>{children}</>;
};
