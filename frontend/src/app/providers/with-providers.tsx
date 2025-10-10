import type { ReactNode } from 'react';
import { RouterProviderComponent } from './with-router.tsx';
import { ThemeProviderComponent } from './with-theme.tsx';
import { InitializedProvider } from './with-initialized.tsx';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <InitializedProvider>
      <ThemeProviderComponent>
        <RouterProviderComponent />
        {children}
      </ThemeProviderComponent>
    </InitializedProvider>
  );
};
