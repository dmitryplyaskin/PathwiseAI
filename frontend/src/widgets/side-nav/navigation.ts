import type { ElementType } from 'react';
import {
  HomeOutlined,
  MenuBookOutlined,
  HistoryOutlined,
  FactCheckOutlined,
} from '@mui/icons-material';

export const DRAWER_WIDTH = 256;
export const DRAWER_COLLAPSED_WIDTH = 76;
export const SIDEBAR_COLLAPSED_STORAGE_KEY = 'pathwise.sidebar.collapsed.v1';

export type NavigationItem = {
  label: string;
  to: string;
  icon: ElementType;
  nested?: boolean;
};

export const NAVIGATION: NavigationItem[] = [
  { label: 'Главная', to: '/', icon: HomeOutlined },
  { label: 'Мои курсы', to: '/courses', icon: MenuBookOutlined, nested: true },
  { label: 'Повторение', to: '/review', icon: HistoryOutlined },
  { label: 'История тестов', to: '/test-history', icon: FactCheckOutlined },
];

export const matchesNavigation = (pathname: string, item: NavigationItem) =>
  pathname === item.to ||
  Boolean(item.nested && pathname.startsWith(`${item.to}/`));
