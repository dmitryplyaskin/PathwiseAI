import { withProviders } from '../providers';

const AppComponent = () => {
  return null; // RouterProvider сам рендерит страницы
};

export const App = withProviders(AppComponent);
