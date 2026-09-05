import type { TabType } from '../types';

export interface TabConfig {
  id: TabType;
  label: string;
}

export const TABS_CONFIG: TabConfig[] = [
  {
    id: 'lesson',
    label: 'Урок',
  },
  {
    id: 'course',
    label: 'Курс',
  },
];
