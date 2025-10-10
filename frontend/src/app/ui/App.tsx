import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { withProviders } from '../providers';
import { checkAuthRequested, $appInitialized } from '../../shared/model/auth';
import { AppLoader } from '../../shared/ui';

const AppComponent = () => {
  const appInitialized = useUnit($appInitialized);

  useEffect(() => {
    // Проверяем авторизацию при старте приложения
    checkAuthRequested();
  }, []);

  // Показываем прелоадер до инициализации приложения
  if (!appInitialized) {
    return <AppLoader />;
  }

  return null; // RouterProvider сам рендерит страницы
};

export const App = withProviders(AppComponent);
