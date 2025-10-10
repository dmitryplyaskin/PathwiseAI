import { $appInitialized } from '../../shared/model/auth';
import { AppLoader } from '../../shared/ui';
import { useUnit } from 'effector-react';
import type { ReactNode } from 'react';

interface InitializedProviderProps {
  children: ReactNode;
}

export const InitializedProvider = ({ children }: InitializedProviderProps) => {
  const appInitialized = useUnit($appInitialized);

  if (!appInitialized) {
    return <AppLoader />;
  }

  return <>{children}</>;
};
