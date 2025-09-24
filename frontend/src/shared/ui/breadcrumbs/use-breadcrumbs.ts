import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router';
import type { BreadcrumbItem } from './types';

// Словарь для перевода путей в читаемые названия
const pathLabels: Record<string, string> = {
  '/': 'Главная',
  '/login': 'Вход',
  '/register': 'Регистрация',
  '/profile': 'Профиль',
  '/courses': 'Курсы',
  '/units': 'Разделы',
  '/lessons': 'Уроки',
};

// Функция для получения названия по ID (можно расширить для получения данных из API)
const getEntityName = (type: string, id: string): string => {
  switch (type) {
    case 'course':
      return `Курс ${id}`;
    case 'unit':
      return `Раздел ${id}`;
    case 'lesson':
      return `Урок ${id}`;
    default:
      return id;
  }
};

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const location = useLocation();
  const params = useParams();

  return useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Всегда добавляем главную страницу
    breadcrumbs.push({
      label: 'Главная',
      path: '/',
    });

    // Если мы на главной странице, возвращаем только её
    if (location.pathname === '/') {
      breadcrumbs[0].isActive = true;
      return breadcrumbs;
    }

    let currentPath = '';

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;

      // Проверяем, является ли сегмент параметром (ID)
      const isParam = Object.values(params).includes(segment);

      let label: string;
      let path: string | undefined = currentPath;

      if (isParam) {
        // Определяем тип сущности по предыдущему сегменту
        const prevSegment = pathSegments[i - 1];
        if (prevSegment === 'courses') {
          label = getEntityName('course', segment);
        } else if (prevSegment === 'units') {
          label = getEntityName('unit', segment);
        } else if (prevSegment === 'lessons') {
          label = getEntityName('lesson', segment);
        } else {
          label = segment;
        }
      } else {
        // Используем предопределенные названия
        label = pathLabels[currentPath] || segment;
      }

      // Последний элемент делаем активным (без ссылки)
      const isLast = i === pathSegments.length - 1;
      if (isLast) {
        path = undefined;
      }

      breadcrumbs.push({
        label,
        path,
        isActive: isLast,
      });
    }

    return breadcrumbs;
  }, [location.pathname, params]);
};
