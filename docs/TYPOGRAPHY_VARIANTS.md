# Варианты заголовков Typography

## Описание

Добавлена поддержка двух вариантов заголовка h1 в системе типографики MUI:

- `h1Gradient` - заголовок с градиентным текстом
- `h1Solid` - заголовок с однотонным цветом

## Файлы

- `frontend/src/vite-env.d.ts` - расширение типов MUI для новых вариантов
- `frontend/src/shared/config/theme.ts` - стили для вариантов h1 в теме
- `frontend/src/shared/ui/Typography/Typography.tsx` - компонент Typography с поддержкой новых вариантов

## Использование

```tsx
import { Typography } from '@/shared/ui';

// Градиентный заголовок
<Typography variant="h1Gradient">
  Градиентный заголовок
</Typography>

// Однотонный заголовок
<Typography variant="h1Solid">
  Однотонный заголовок
</Typography>
```

## Стили

- `h1Gradient`: градиент от #1e3a8a до #3b82f6
- `h1Solid`: цвет #1e3a8a
- Оба варианта имеют одинаковые размеры: 2.5rem, fontWeight 700, lineHeight 1.2
