# Система контроля доступа к контенту

## Описание

Система контроля доступа обеспечивает изоляцию контента между пользователями с возможностью совместного доступа через флаг `shared`.

## Принципы работы

### Владение контентом

- Каждый курс, юнит и урок привязаны к конкретному пользователю через поле `user`
- Пользователь имеет полный доступ к своему контенту

### Совместный доступ

- Контент может быть открыт для всех пользователей через флаг `shared: true`
- При `shared: false` контент доступен только владельцу

### Проверка доступа

- При обращении к ресурсу проверяется:
  1. Является ли пользователь владельцем
  2. Открыт ли ресурс для совместного доступа (`shared: true`)

## Структура данных

### Course Entity

```typescript
@Entity({ name: 'courses' })
export class Course {
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ type: 'boolean', default: false })
  shared: boolean;
}
```

### Unit Entity

```typescript
@Entity({ name: 'units' })
export class Unit {
  @ManyToOne(() => Course, (course) => course.units)
  course: Course;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ type: 'boolean', default: false })
  shared: boolean;
}
```

### Lesson Entity

```typescript
@Entity({ name: 'lessons' })
export class Lesson {
  @ManyToOne(() => Unit, (unit) => unit.lessons)
  unit: Unit;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ type: 'boolean', default: false })
  shared: boolean;
}
```

## Компоненты системы

### AccessControlService

Сервис для проверки доступа к ресурсам.

**Методы:**

- `checkCourseAccess(courseId: string, userId: string): Promise<boolean>`
- `checkUnitAccess(unitId: string, userId: string): Promise<boolean>`
- `checkLessonAccess(lessonId: string, userId: string): Promise<boolean>`
- `getAccessibleCourses(userId: string): Promise<Course[]>`
- `getAccessibleUnits(userId: string): Promise<Unit[]>`
- `getAccessibleLessons(userId: string): Promise<Lesson[]>`
- `getSharedCourses(): Promise<Course[]>`
- `getSharedUnits(): Promise<Unit[]>`
- `getSharedLessons(): Promise<Lesson[]>`

### AccessDeniedException

Кастомное исключение для случаев отказа в доступе.

```typescript
export class AccessDeniedException extends HttpException {
  constructor(resource: string, resourceId: string) {
    super(
      `Доступ к ${resource} с ID "${resourceId}" запрещен`,
      HttpStatus.FORBIDDEN,
    );
  }
}
```

### CheckAccess Decorator

Декоратор для защиты эндпоинтов с проверкой доступа.

```typescript
export const CheckAccess = (resourceType: 'course' | 'unit' | 'lesson') =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    UseInterceptors(AccessControlInterceptor),
  );
```

### AccessControlInterceptor

Интерсептор для автоматической проверки доступа к ресурсам.

## API Endpoints

### Курсы

- `GET /courses` - получить доступные курсы пользователя
- `GET /courses/shared` - получить общие курсы
- `GET /courses/:id` - получить курс (с проверкой доступа)
- `PATCH /courses/:id` - обновить курс (только владелец)
- `PATCH /courses/:id/shared` - изменить статус общего доступа
- `DELETE /courses/:id` - удалить курс (только владелец)

### Юниты

- `GET /courses/units` - получить доступные юниты пользователя
- `GET /courses/units/shared` - получить общие юниты
- `GET /courses/units/:id` - получить юнит (с проверкой доступа)
- `PATCH /courses/units/:id` - обновить юнит (только владелец)
- `PATCH /courses/units/:id/shared` - изменить статус общего доступа
- `DELETE /courses/units/:id` - удалить юнит (только владелец)

### Уроки

- `GET /courses/lessons/:id` - получить урок (с проверкой доступа)
- `PATCH /courses/lessons/:id` - обновить урок (только владелец)
- `PATCH /courses/lessons/:id/shared` - изменить статус общего доступа
- `DELETE /courses/lessons/:id` - удалить урок (только владелец)

## Авторизация

Все защищенные эндпоинты требуют:

1. JWT токен в заголовке `Authorization: Bearer <token>`
2. Валидный токен с информацией о пользователе
3. Проверку доступа к запрашиваемому ресурсу

## Безопасность

- Проверка доступа выполняется на уровне сервисов
- Контроллеры защищены JWT Guard
- Исключения возвращают корректные HTTP статусы
- Пользователь не может получить доступ к чужому контенту

## Миграция данных

Существующие записи получают:

- `shared: false` по умолчанию
- Связь с пользователем через существующую логику

## Производительность

- Дополнительные запросы для проверки доступа
- Индексы на полях `user` и `shared` для оптимизации
- Кэширование результатов проверки доступа (при необходимости)
