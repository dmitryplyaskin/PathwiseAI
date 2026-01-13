import { createTheme } from '@mui/material/styles';

// Светлая, “воздушная” тема без избыточных анимаций и гигантизма
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
    },
    secondary: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#f8fbff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e3a8a',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: '#e2e8f0',
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },

  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Roboto"',
      '"Oxygen"',
      '"Ubuntu"',
      '"Cantarell"',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.1rem',
      fontWeight: 700,
      lineHeight: 1.2,
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h1Gradient: {
      fontSize: '2.1rem',
      fontWeight: 700,
      lineHeight: 1.2,
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h1Solid: {
      fontSize: '2.1rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#1e3a8a',
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#1e3a8a',
    },
    h3: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1e3a8a',
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1e3a8a',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
    caption: {
      fontSize: '0.75rem',
      color: '#94a3b8',
    },
  },

  shape: {
    borderRadius: 10,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  shadows: [
    'none',
    '0 2px 4px rgba(0, 0, 0, 0.05)',
    '0 2px 8px rgba(0, 0, 0, 0.06)',
    '0 4px 16px rgba(0, 0, 0, 0.08)',
    '0 8px 24px rgba(0, 0, 0, 0.12)',
    '0 12px 32px rgba(0, 0, 0, 0.16)',
    '0 16px 40px rgba(0, 0, 0, 0.20)',
    '0 20px 48px rgba(0, 0, 0, 0.24)',
    '0 24px 56px rgba(0, 0, 0, 0.28)',
    '0 28px 64px rgba(0, 0, 0, 0.32)',
    '0 32px 72px rgba(0, 0, 0, 0.36)',
    '0 36px 80px rgba(0, 0, 0, 0.40)',
    '0 40px 88px rgba(0, 0, 0, 0.44)',
    '0 44px 96px rgba(0, 0, 0, 0.48)',
    '0 48px 104px rgba(0, 0, 0, 0.52)',
    '0 52px 112px rgba(0, 0, 0, 0.56)',
    '0 56px 120px rgba(0, 0, 0, 0.60)',
    '0 60px 128px rgba(0, 0, 0, 0.64)',
    '0 64px 136px rgba(0, 0, 0, 0.68)',
    '0 68px 144px rgba(0, 0, 0, 0.72)',
    '0 72px 152px rgba(0, 0, 0, 0.76)',
    '0 76px 160px rgba(0, 0, 0, 0.80)',
    '0 80px 168px rgba(0, 0, 0, 0.84)',
    '0 84px 176px rgba(0, 0, 0, 0.88)',
  ],

  transitions: {
    duration: {
      shortest: 120,
      shorter: 160,
      short: 200,
      standard: 240,
      complex: 280,
      enteringScreen: 180,
      leavingScreen: 160,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },

  components: {
    // Глобальные стили (без глобальных transition, чтобы не анимировать layout)
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #f8fbff 0%, #e8f4fd 100%)',
          minHeight: '100vh',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            transition: 'none !important',
            animation: 'none !important',
          },
          html: {
            scrollBehavior: 'auto !important',
          },
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontSize: '0.9rem',
          fontWeight: 600,
          padding: '8px 16px',
          boxShadow: 'none',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
          },
        },
        sizeLarge: {
          padding: '10px 20px',
          fontSize: '0.95rem',
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.85rem',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.12)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          },
          '&:disabled': {
            color: '#94a3b8 ',
            background: '#e2e8f0',
          },
        },
        outlined: {
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.06)',
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
          border: '1px solid #e2e8f0',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
            borderColor: '#dbeafe',
          },
        },
      },
    },

    // Чипы (замена для тегов)
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontSize: '0.75rem',
          fontWeight: 600,
          height: 24,
          padding: '0 6px',
          border: 'none',
        },
        colorSuccess: {
          backgroundColor: '#10b981',
          color: '#ffffff',
        },
        colorWarning: {
          backgroundColor: '#f59e0b',
          color: '#ffffff',
        },
        colorError: {
          backgroundColor: '#ef4444',
          color: '#ffffff',
        },
        colorInfo: {
          backgroundColor: '#06b6d4',
          color: '#ffffff',
        },
      },
    },

    // Прогресс бар
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#e2e8f0',
        },
        bar: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        },
      },
    },

    // Контейнер
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },

    // Бумага (Paper) для фонов
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
        },
        elevation2: {
          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
        },
        elevation3: {
          boxShadow: '0 10px 28px rgba(15, 23, 42, 0.10)',
        },
      },
    },

    MuiFab: {
      defaultProps: {
        size: 'medium',
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          boxShadow: '0 10px 24px rgba(59, 130, 246, 0.18)',
          '&:hover': {
            boxShadow: '0 14px 30px rgba(59, 130, 246, 0.22)',
          },
        },
        extended: {
          padding: '0 14px',
        },
      },
    },

    // AppBar для заголовка
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          color: '#1e3a8a',
        },
      },
    },
  },
});
