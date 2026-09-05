import { useMemo, useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import type { BreadcrumbItem } from './types';
import { coursesApi } from '@shared/api';

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

// Кэш для хранения названий сущностей
const entityNameCache = new Map<string, string>();

// Функция для получения названия по ID
const getEntityName = (type: string, id: string): string => {
  const cacheKey = `${type}:${id}`;
  return entityNameCache.get(cacheKey) || '';
};

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const location = useLocation();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  // Загружаем данные для сущностей из URL
  useEffect(() => {
    const loadEntityNames = async () => {
      const pathSegments = location.pathname.split('/').filter(Boolean);

      // Определяем, какие ID нам нужны
      const idsToLoad: Array<{ type: string; id: string }> = [];

      // Проверяем все сегменты пути на наличие ID
      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const prevSegment = pathSegments[i - 1];

        // Если это ID курса
        if (prevSegment === 'courses' && segment !== 'courses') {
          const cacheKey = `course:${segment}`;
          if (!entityNameCache.has(cacheKey)) {
            idsToLoad.push({ type: 'course', id: segment });
          }
        }

        // Если это ID урока (может быть после 'lessons' или после 'courses/:id')
        if (prevSegment === 'lessons' && segment !== 'lessons') {
          const cacheKey = `lesson:${segment}`;
          if (!entityNameCache.has(cacheKey)) {
            idsToLoad.push({ type: 'lesson', id: segment });
          }
        }

        // Если это ID юнита
        if (prevSegment === 'units' && segment !== 'units') {
          const cacheKey = `unit:${segment}`;
          if (!entityNameCache.has(cacheKey)) {
            idsToLoad.push({ type: 'unit', id: segment });
          }
        }
      }

      if (idsToLoad.length === 0) return;

      setIsLoading(true);

      try {
        // Загружаем данные параллельно
        await Promise.all(
          idsToLoad.map(async ({ type, id }) => {
            try {
              if (type === 'course') {
                const course = await coursesApi.getCourseDetail(id);
                entityNameCache.set(`course:${id}`, course.title);
              } else if (type === 'lesson') {
                const lesson = await coursesApi.getLessonDetail(id);
                entityNameCache.set(`lesson:${id}`, lesson.title);
                // Также кэшируем данные о курсе и юните из урока
                if (lesson.unit) {
                  entityNameCache.set(
                    `unit:${lesson.unit.id}`,
                    lesson.unit.title,
                  );
                  if (lesson.unit.course) {
                    entityNameCache.set(
                      `course:${lesson.unit.course.id}`,
                      lesson.unit.course.title,
                    );
                  }
                }
              } else if (type === 'unit') {
                // Для юнита нужно получить данные из курса
                // Но у нас нет прямого API для получения юнита по ID
                // Пока оставляем как есть
              }
            } catch (error) {
              console.error(`Failed to load ${type} ${id}:`, error);
            }
          }),
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadEntityNames();
  }, [location.pathname]);

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
      const prevSegment = pathSegments[i - 1];
      currentPath += `/${segment}`;

      let label: string;
      let path: string | undefined = currentPath;

      // Определяем тип сущности по контексту пути
      if (prevSegment === 'courses' && params.id === segment) {
        // Это ID курса
        const cachedName = getEntityName('course', segment);
        label = cachedName || `Курс ${segment}`;
      } else if (prevSegment === 'units' && params.unitId === segment) {
        // Это ID юнита
        const cachedName = getEntityName('unit', segment);
        label = cachedName || `Раздел ${segment}`;
      } else if (prevSegment === 'lessons' && params.lessonId === segment) {
        // Это ID урока
        const cachedName = getEntityName('lesson', segment);
        label = cachedName || `Урок ${segment}`;
      } else if (segment === 'courses') {
        // Это страница списка курсов
        label = 'Курсы';
      } else if (segment === 'units') {
        // Это страница списка юнитов - пропускаем
        continue;
      } else if (segment === 'lessons') {
        // Это страница списка уроков - пропускаем
        continue;
      } else {
        // Для остальных сегментов проверяем словарь или оставляем как есть
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
  }, [location.pathname, params, isLoading]);
};
