import { useEffect } from 'react';
import { withProviders } from '../providers';
import { checkAuthRequested } from '../../shared/model/auth';

const AppComponent = () => {
  useEffect(() => {
    // Проверяем авторизацию при старте приложения
    checkAuthRequested();
  }, []);

  return null; // RouterProvider сам рендерит страницы
};

export const App = withProviders(AppComponent);
