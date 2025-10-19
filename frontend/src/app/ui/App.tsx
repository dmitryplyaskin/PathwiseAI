import { useEffect } from 'react';
import { Providers } from '@app/providers';
import { checkAuthRequested } from '@shared/model/auth';

const AppComponent = () => {
  useEffect(() => {
    // Проверяем авторизацию при старте приложения
    checkAuthRequested();
  }, []);

  return null; // RouterProvider сам рендерит страницы
};

export const App = () => {
  return (
    <Providers>
      <AppComponent />
    </Providers>
  );
};
