import { RouterProvider } from 'react-router';
import { router } from '../config/router';

export const RouterProviderComponent = () => {
  return <RouterProvider router={router} />;
};
