# ContentCreationModal - Расширяемая архитектура

## Обзор

`ContentCreationModal` - это компонент для создания контента (уроков, курсов) с поддержкой расширяемости. Архитектура позволяет легко добавлять новые типы контента через табы без изменения основного кода.

## Структура

```
content-creation/
├── index.ts                          # Главный экспорт модуля
├── ContentCreationModal.tsx          # Основной компонент
├── CreationLoadingDialog.tsx         # Диалог с прелоадером
├── types.ts                          # Типы и интерфейсы
├── forms/
│   ├── index.ts
│   ├── LessonForm.tsx               # Форма создания урока
│   ├── CourseForm.tsx               # Форма создания курса
│   ├── CommonFormFields.tsx         # Общие поля (тема, описание, сложность)
│   └── complexity-options.ts        # Константы опций сложности
├── hooks/
│   ├── index.ts
│   ├── useContentCreationState.ts   # Общее состояние модали
│   ├── useLessonForm.ts             # Состояние формы урока
│   └── useCourseForm.ts             # Состояние формы курса
└── config/
    ├── index.ts
    └── tabsConfig.ts                # Конфиг табов для расширяемости
```

## Компоненты

### ContentCreationModal

Главный компонент модали. Управляет табами, общим состоянием и отрисовкой нужной формы.

**Пропсы:**

- `open: boolean` - открыта ли модаль
- `onClose: () => void` - callback на закрытие

**Использование:**

```tsx
<ContentCreationModal open={isOpen} onClose={handleClose} />
```

### CreationLoadingDialog

Диалог с прелоадером, отображаемый во время создания контента.

### Формы (LessonForm, CourseForm)

Каждая форма управляет своим состоянием через кастомный хук и отображает UI для конкретного типа контента.

## Хуки

### useContentCreationState

Управляет общим состоянием модали: загрузка пользователя, создание контента, ошибки, навигация и редирект после создания.

### useLessonForm

Состояние формы создания урока:

- `topic` - название урока
- `details` - описание
- `complexity` - сложность объяснения
- `courseId` - ID выбранного курса
- `newCourseName` - название нового курса

### useCourseForm

Состояние формы создания курса:

- `topic` - название курса
- `details` - описание
- `complexity` - сложность объяснения

## Конфиг табов

`tabsConfig.ts` содержит описание всех доступных табов:

```typescript
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
```

## Как добавить новый тип контента

### 1. Добавить тип в `types.ts`

```typescript
export interface NewTypeFormState extends FormContextProps {
  // Специфичные поля нового типа
  specificField: string;
}
```

### 2. Создать хук в `hooks/useNewTypeForm.ts`

```typescript
export const useNewTypeForm = () => {
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [complexity, setComplexity] =
    useState<NewTypeFormState['complexity']>('normal');
  const [specificField, setSpecificField] = useState('');

  // ... остальная логика

  return {
    topic,
    details,
    complexity,
    specificField,
    setTopic,
    setDetails,
    setComplexity,
    setSpecificField,
    handleComplexityChange,
    resetForm,
  };
};
```

### 3. Создать компонент формы в `forms/NewTypeForm.tsx`

```typescript
export const NewTypeForm = ({ isSubmitDisabled, onSubmit, modalOpen }: FormProps) => {
  const form = useNewTypeForm();

  return (
    <Stack spacing={3}>
      <CommonFormFields
        activeTab="newtype"
        topic={form.topic}
        onTopicChange={form.setTopic}
        details={form.details}
        onDetailsChange={form.setDetails}
        complexity={form.complexity}
        onComplexityChange={form.handleComplexityChange}
      />
      {/* Специфичные поля */}
    </Stack>
  );
};
```

### 4. Добавить таб в `config/tabsConfig.ts`

```typescript
export const TABS_CONFIG: TabConfig[] = [
  { id: 'lesson', label: 'Урок' },
  { id: 'course', label: 'Курс' },
  { id: 'newtype', label: 'Новый тип' }, // Новый таб
];
```

### 5. Обновить `ContentCreationModal.tsx`

Добавить импорт хука и формы:

```typescript
import { useNewTypeForm } from './hooks';
import { NewTypeForm } from './forms';
```

Инициализировать хук:

```typescript
const newTypeForm = useNewTypeForm();
```

Добавить условный рендеринг:

```tsx
{
  activeTab === 'newtype' && (
    <NewTypeForm
      isSubmitDisabled={isSubmitDisabled()}
      onSubmit={handleSubmit}
      modalOpen={open}
    />
  );
}
```

Обновить логику `handleSubmit` для нового типа:

```typescript
if (activeTab === 'newtype') {
  createModule({
    // параметры для нового типа
  });
}
```

### 6. Экспортировать новые компоненты

Добавить в соответствующие `index.ts` файлы.

## Типы

### TabType

Тип активного таба. Расширяется при добавлении новых типов контента.

```typescript
type TabType = 'lesson' | 'course';
```

### FormContextProps

Общие свойства всех форм:

- `topic: string`
- `details: string`
- `complexity: ModuleComplexity | ''`

## Импорт

```typescript
import { ContentCreationModal } from '@/features/education-module/ui';
// или для использования конкретных хуков/компонентов
import { useLessonForm, LessonForm } from '@/features/education-module/ui';
```
