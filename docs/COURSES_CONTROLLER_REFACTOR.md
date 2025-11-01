# Рефакторинг контроллеров модуля курсов

## Обзор

В рамках задачи по оптимизации модуля курсов, `CoursesController` был разделен на три отдельных контроллера.
Причиной разделения стала перегруженность основного контроллера, который содержал логику для курсов, модулей (юнитов) и уроков.

## Изменения

### Новые контроллеры

1. **CoursesController** (`src/modules/courses/controllers/courses.controller.ts`)
   - Отвечает только за операции с курсами.
   - Эндпоинты (prefix: `/courses`):
     - `POST /` - Создание курса
     - `GET /` - Получение списка курсов
     - `GET /list` - Получение списка курсов для дропдауна
     - `GET /shared` - Получение общих курсов
     - `GET /:id` - Получение деталей курса
     - `GET /:id/lessons` - Получение уроков курса (оставлено здесь как саб-ресурс)
     - `PATCH /:id` - Обновление курса
     - `PATCH /:id/shared` - Изменение видимости курса
     - `DELETE /:id` - Удаление курса
     - `POST /outlines` - Создание структуры курса (Аутлайн)

2. **UnitsController** (`src/modules/courses/controllers/units.controller.ts`)
   - Отвечает за операции с модулями (юнитами).
   - Эндпоинты (prefix: `/units`):
     - `POST /` - Создание юнита (ранее `POST /courses/units`)
     - `GET /` - Получение списка юнитов (ранее `GET /courses/units`)
     - `GET /shared` - Получение общих юнитов (ранее `GET /courses/units/shared`)
     - `GET /:id` - Получение юнита (ранее `GET /courses/units/:id`)
     - `PATCH /:id` - Обновление юнита (ранее `PATCH /courses/units/:id`)
     - `PATCH /:id/shared` - Изменение видимости юнита (ранее `PATCH /courses/units/:id/shared`)
     - `DELETE /:id` - Удаление юнита (ранее `DELETE /courses/units/:id`)

3. **LessonsController** (`src/modules/courses/controllers/lessons.controller.ts`)
   - Отвечает за операции с уроками.
   - Эндпоинты (prefix: `/lessons`):
     - `GET /` - Получение всех уроков (ранее `GET /courses/lessons`)
     - `GET /for-review/:userId` - Уроки на проверке (ранее `GET /courses/lessons/for-review/:userId`)
     - `GET /:id` - Получение урока (ранее `GET /courses/lessons/:id`)
     - `POST /` - Создание урока (ранее `POST /courses/lessons`)
     - `PATCH /:id` - Обновление урока (ранее `PATCH /courses/lessons/:id`)
     - `PATCH /:id/shared` - Изменение видимости урока (ранее `PATCH /courses/lessons/:id/shared`)
     - `DELETE /:id` - Удаление урока (ранее `DELETE /courses/lessons/:id`)
     - `POST /modules` - Создание модуля/урока (ранее `POST /courses/modules`)
     - `POST /:id/ask` - AI вопросы по уроку (ранее `POST /courses/lessons/:id/ask`)
     - `GET /:id/threads` - Ветки чата (ранее `GET /courses/lessons/:id/threads`)
     - `GET /:id/threads/:threadId` - Сообщения ветки (ранее `GET /courses/lessons/:id/threads/:threadId`)
     - `DELETE /:id/threads/:threadId` - Удаление ветки (ранее `DELETE /courses/lessons/:id/threads/:threadId`)
     - `POST /:id/regenerate/:messageId` - Регенерация ответа (ранее `POST /courses/lessons/:id/regenerate/:messageId`)

### Frontend

API клиенты на фронтенде были обновлены для соответствия новым маршрутам:
- `frontend/src/shared/api/lessons/api.ts`
- `frontend/src/shared/api/courses/api.ts`

## Преимущества

- **Чистота кода**: Каждый контроллер отвечает за свою сущность.
- **RESTful**: Маршруты стали более логичными (например, `/lessons/:id` вместо `/courses/lessons/:id` для прямого доступа).
- **Поддержка**: Легче находить и модифицировать методы.

