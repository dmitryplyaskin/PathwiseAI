import type { ComponentType } from 'react';
import { withRouter } from './with-router.tsx';
import { withTheme } from './with-theme.tsx';

export const withProviders = (Component: ComponentType) => {
  return withTheme(withRouter(Component));
};
