import { createTheme } from '@mui/material/styles';

// Создаем светло бело-голубую тему с закруглениями и плавными анимациями
export const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
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
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#1e3a8a',
    },
    h4: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1e3a8a',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
    caption: {
      fontSize: '0.85rem',
      color: '#94a3b8',
    },
  },

  shape: {
    borderRadius: 12,
  },

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
    '0 88px 184px rgba(0, 0, 0, 0.92)',
  ],

  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },

  components: {
    // Глобальные стили для плавных анимаций
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        body: {
          background: 'linear-gradient(135deg, #f8fbff 0%, #e8f4fd 100%)',
          minHeight: '100vh',
        },
      },
    },

    // Кнопки с красивыми градиентами и анимациями
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          padding: '12px 32px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 32px rgba(59, 130, 246, 0.4)',
          },
        },
        sizeLarge: {
          padding: '16px 40px',
          fontSize: '1.1rem',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          },
        },
      },
    },

    // Карточки с красивыми тенями и закруглениями
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },

    // Чипы (замена для тегов)
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '0.75rem',
          fontWeight: 600,
          height: 'auto',
          padding: '6px 12px',
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
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },

    // Бумага (Paper) для фонов
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
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
