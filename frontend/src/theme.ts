import type { ThemeConfig } from 'antd';

export const customTheme: ThemeConfig = {
  token: {
    // Основные цвета в светло бело-голубых тонах
    colorPrimary: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#06b6d4',

    // Цвета фона
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f8fbff',
    colorBgElevated: '#ffffff',

    // Границы и радиусы
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,

    // Шрифты
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 20,

    // Тени
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.06)',

    // Отступы
    padding: 16,
    paddingLG: 24,
    paddingXL: 32,

    // Анимации
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  components: {
    Layout: {
      bodyBg: 'linear-gradient(135deg, #f8fbff 0%, #e8f4fd 100%)',
      headerBg: 'transparent',
      headerPadding: '24px 0',
    },

    Button: {
      borderRadiusLG: 28,
      paddingContentHorizontalLG: 32,
      fontWeightStrong: 600,
      primaryShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
    },

    Card: {
      borderRadiusLG: 16,
      paddingLG: 24,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    },

    Progress: {
      remainingColor: '#e2e8f0',
    },

    Tag: {
      borderRadiusSM: 12,
      paddingSM: 8,
      fontSizeSM: 12,
    },

    Typography: {
      titleMarginBottom: 0,
      titleMarginTop: 0,
    },
  },

  algorithm: [], // Используем светлую тему
};
