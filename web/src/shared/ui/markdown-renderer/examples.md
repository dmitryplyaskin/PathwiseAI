# MarkdownRenderer - Примеры использования

## Базовое использование

```tsx
import { MarkdownRenderer } from '@/shared/ui';

const content = `
# Заголовок
Это обычный текст с **жирным** и *курсивным* форматированием.
`;

<MarkdownRenderer>{content}</MarkdownRenderer>;
```

## С настройками подсветки кода

```tsx
import { MarkdownRenderer } from '@/shared/ui';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeContent = `
# Пример кода

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\`
`;

<MarkdownRenderer
  showLineNumbers={true}
  codeTheme={vscDarkPlus}
  maxCodeHeight="300px"
>
  {codeContent}
</MarkdownRenderer>;
```

## Кастомные стили

```tsx
<MarkdownRenderer
  sx={{
    backgroundColor: 'grey.50',
    p: 3,
    borderRadius: 2,
  }}
>
  {content}
</MarkdownRenderer>
```

## Доступные пропсы

| Проп              | Тип       | По умолчанию | Описание                        |
| ----------------- | --------- | ------------ | ------------------------------- |
| `children`        | `string`  | -            | Markdown контент                |
| `sx`              | `object`  | `{}`         | Дополнительные стили MUI        |
| `codeTheme`       | `any`     | `oneLight`   | Тема подсветки синтаксиса       |
| `codeFontSize`    | `string`  | `'0.875rem'` | Размер шрифта кода              |
| `showLineNumbers` | `boolean` | `false`      | Показывать номера строк         |
| `maxCodeHeight`   | `string`  | `'400px'`    | Максимальная высота блоков кода |

## Поддерживаемые элементы Markdown

- ✅ Заголовки (h1-h6)
- ✅ Параграфы
- ✅ Жирный и курсивный текст
- ✅ Инлайн код и блоки кода с подсветкой синтаксиса
- ✅ Ссылки (открываются в новой вкладке)
- ✅ Списки (упорядоченные и неупорядоченные)
- ✅ Цитаты
- ✅ Таблицы
- ✅ Горизонтальные линии
- ✅ GitHub Flavored Markdown (GFM)

## Интеграция с Material-UI

Компонент полностью интегрирован с системой дизайна Material-UI:

- Использует цвета из темы (`primary.main`, `text.primary`, etc.)
- Поддерживает темную и светлую темы
- Использует компоненты MUI для всех элементов
- Соблюдает spacing и typography из темы
