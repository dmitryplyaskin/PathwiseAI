import { RouterProvider } from 'react-router';
import { router } from '../config/router';
import type { ComponentType } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const withRouter = (_: ComponentType) => {
  return () => <RouterProvider router={router} />;
};
