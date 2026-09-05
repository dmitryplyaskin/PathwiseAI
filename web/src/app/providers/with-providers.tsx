import { RouterProviderComponent } from './with-router.tsx';
import { ThemeProviderComponent } from './with-theme.tsx';
import { InitializedProvider } from './with-initialized.tsx';

export const Providers = () => {
  return (
    <InitializedProvider>
      <ThemeProviderComponent>
        <RouterProviderComponent />
      </ThemeProviderComponent>
    </InitializedProvider>
  );
};
