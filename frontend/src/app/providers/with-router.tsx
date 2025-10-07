import type { ComponentType } from 'react';
import { RouterProvider } from 'react-router';
import { router } from '../config/router';

export const withRouter = (Component: ComponentType) => {
  return () => <RouterProvider router={router} />;
};
