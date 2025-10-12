# План работ: Система контроля доступа пользователей к контенту

## Цель

Реализовать систему контроля доступа, где каждый урок, юнит и курс привязаны к конкретному пользователю, с возможностью совместного доступа через флаг `shared`.

## Текущее состояние

### Существующие сущности:

- **Course** (`src/modules/courses/entities/course.entity.ts`) - уже имеет связь с User
- **Unit** (`src/modules/courses/entities/unit.entity.ts`) - связан с Course, но не имеет прямой связи с User
- **Lesson** (`src/modules/courses/entities/lesson.entity.ts`) - связан с Unit, но не имеет прямой связи с User

### Система авторизации:

- JWT токены с информацией о пользователе
- Guards для защиты эндпоинтов
- Декораторы для получения текущего пользователя

## Этапы реализации

### Этап 1: Модификация сущностей

#### 1.1 Добавить поле `shared` в Course

**Файл:** `src/modules/courses/entities/course.entity.ts`

- Добавить `@Column({ type: 'boolean', default: false }) shared: boolean;`
- Обновить импорты при необходимости

#### 1.2 Добавить поле `shared` в Unit

**Файл:** `src/modules/courses/entities/unit.entity.ts`

- Добавить `@Column({ type: 'boolean', default: false }) shared: boolean;`
- Добавить связь с User через Course: `@ManyToOne(() => User, (user) => user.id) user: User;`

#### 1.3 Добавить поле `shared` в Lesson

**Файл:** `src/modules/courses/entities/lesson.entity.ts`

- Добавить `@Column({ type: 'boolean', default: false }) shared: boolean;`
- Добавить связь с User через Unit: `@ManyToOne(() => User, (user) => user.id) user: User;`

### Этап 2: Создание системы проверки доступа

#### 2.1 Создать сервис проверки доступа

**Файл:** `src/shared/services/access-control.service.ts`

```typescript
@Injectable()
export class AccessControlService {
  async checkCourseAccess(courseId: string, userId: string): Promise<boolean>;
  async checkUnitAccess(unitId: string, userId: string): Promise<boolean>;
  async checkLessonAccess(lessonId: string, userId: string): Promise<boolean>;
  async getAccessibleCourses(userId: string): Promise<Course[]>;
  async getAccessibleUnits(userId: string): Promise<Unit[]>;
  async getAccessibleLessons(userId: string): Promise<Lesson[]>;
}
```

#### 2.2 Создать кастомные исключения

**Файл:** `src/shared/exceptions/access-denied.exception.ts`

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

#### 2.3 Создать декоратор для проверки доступа

**Файл:** `src/shared/decorators/check-access.decorator.ts`

```typescript
export const CheckAccess = (resourceType: 'course' | 'unit' | 'lesson') =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    UseInterceptors(AccessControlInterceptor),
  );
```

#### 2.4 Создать интерсептор проверки доступа

**Файл:** `src/shared/interceptors/access-control.interceptor.ts`

```typescript
@Injectable()
export class AccessControlInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    // Логика проверки доступа
    return next.handle();
  }
}
```

### Этап 3: Модификация сервисов

#### 3.1 Обновить CoursesService

**Файл:** `src/modules/courses/services/courses.service.ts`

- Добавить проверку доступа в методы:
  - `findOneCourse(id: string, userId: string)`
  - `updateCourse(id: string, updateCourseDto: UpdateCourseDto, userId: string)`
  - `removeCourse(id: string, userId: string)`
- Добавить методы для получения доступных курсов:
  - `findAccessibleCourses(userId: string)`
  - `findSharedCourses()`

#### 3.2 Обновить UnitsService

**Файл:** `src/modules/courses/services/units.service.ts`

- Добавить проверку доступа в методы:
  - `findOneUnit(id: string, userId: string)`
  - `updateUnit(id: string, updateUnitDto: UpdateUnitDto, userId: string)`
  - `removeUnit(id: string, userId: string)`
- Добавить методы для получения доступных юнитов:
  - `findAccessibleUnits(userId: string)`
  - `findSharedUnits()`

#### 3.3 Обновить LessonsService

**Файл:** `src/modules/courses/services/lessons.service.ts`

- Добавить проверку доступа в методы:
  - `findOneLesson(id: string, userId: string)`
  - `updateLesson(id: string, updateLessonDto: UpdateLessonDto, userId: string)`
  - `removeLesson(id: string, userId: string)`
- Добавить методы для получения доступных уроков:
  - `findAccessibleLessons(userId: string)`
  - `findSharedLessons()`

### Этап 4: Модификация контроллеров

#### 4.1 Обновить CoursesController

**Файл:** `src/modules/courses/controllers/courses.controller.ts`

- Добавить `@UseGuards(JwtAuthGuard)` ко всем защищенным эндпоинтам
- Добавить `@CurrentUser() user: User` параметр в методы
- Передавать `userId` в сервисы
- Добавить новые эндпоинты:
  - `GET /courses/accessible` - получить доступные курсы
  - `GET /courses/shared` - получить общие курсы
  - `PATCH /courses/:id/shared` - изменить статус общего доступа

#### 4.2 Обновить UnitsController (если существует)

- Аналогично CoursesController

#### 4.3 Обновить LessonsController (если существует)

- Аналогично CoursesController

### Этап 5: Обновление DTO

#### 5.1 Обновить CreateCourseDto

**Файл:** `src/modules/courses/dto/create-course.dto.ts`

- Добавить `shared?: boolean;`

#### 5.2 Обновить UpdateCourseDto

**Файл:** `src/modules/courses/dto/update-course.dto.ts`

- Добавить `shared?: boolean;`

#### 5.3 Создать аналогичные DTO для Unit и Lesson

- `CreateUnitDto` с полем `shared`
- `UpdateUnitDto` с полем `shared`
- `CreateLessonDto` с полем `shared`
- `UpdateLessonDto` с полем `shared`

### Этап 6: Обновление модулей

#### 6.1 Обновить CoursesModule

**Файл:** `src/modules/courses/courses.module.ts`

- Импортировать `AccessControlService` из `SharedModule`
- Добавить в `providers` если необходимо

#### 6.2 Обновить SharedModule

**Файл:** `src/shared/shared.module.ts`

- Добавить `AccessControlService` в `providers`
- Экспортировать `AccessControlService`

### Этап 7: Тестирование

#### 7.1 Создать тесты для AccessControlService

**Файл:** `src/shared/services/access-control.service.spec.ts`

#### 7.2 Создать тесты для контроллеров

- Проверить корректность работы с авторизацией
- Проверить возврат ошибок при отсутствии доступа

#### 7.3 Создать e2e тесты

**Файл:** `test/access-control.e2e-spec.ts`

- Тестирование полного flow авторизации и проверки доступа

### Этап 8: Документация

#### 8.1 Обновить API документацию

- Описать новые эндпоинты
- Описать систему контроля доступа

#### 8.2 Создать документацию по использованию

**Файл:** `docs/ACCESS_CONTROL.md`

- Описать принципы работы системы
- Примеры использования

## Порядок выполнения

1. **Этап 1** - Модификация сущностей (Course, Unit, Lesson)
2. **Этап 2** - Создание системы проверки доступа
3. **Этап 3** - Модификация сервисов
4. **Этап 4** - Модификация контроллеров
5. **Этап 5** - Обновление DTO
6. **Этап 6** - Обновление модулей
7. **Этап 7** - Тестирование
8. **Этап 8** - Документация

## Риски и ограничения

1. **Миграция данных** - существующие записи получат `shared: false` по умолчанию
2. **Производительность** - дополнительные запросы для проверки доступа
3. **Совместимость** - необходимо обновить фронтенд для работы с новой системой

## Критерии готовности

- [ ] Все сущности имеют поле `shared`
- [ ] Система проверки доступа работает корректно
- [ ] Все эндпоинты защищены авторизацией
- [ ] Тесты покрывают основную функциональность
- [ ] Документация обновлена
- [ ] Фронтенд совместим с новой системой
