import type { ComponentType } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '../../shared/config/theme';

export const withTheme = (Component: ComponentType) => {
  return () => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component />
    </ThemeProvider>
  );
};
