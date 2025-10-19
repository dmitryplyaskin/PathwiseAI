# Pre-commit хуки

## Описание

В проекте настроены pre-commit хуки для автоматической проверки качества кода и валидации коммитов перед их созданием.

## Компоненты

### Husky

- **Файл**: `.husky/pre-commit`, `.husky/commit-msg`
- **Назначение**: Управление git хуками
- **Зависимости**: `husky` в devDependencies

### Lint-staged

- **Файл**: `package.json` -> `lint-staged`
- **Назначение**: Проверка только измененных файлов
- **Функции**:
  - ESLint для TypeScript файлов
  - Prettier для форматирования

### Commitlint

- **Файл**: `commitlint.config.js`
- **Назначение**: Валидация сообщений коммитов по Conventional Commits
- **Зависимости**: `@commitlint/cli`, `@commitlint/config-conventional`

## Процесс проверки

### Pre-commit хук

1. Запуск lint-staged для проверки измененных файлов
2. Сборка фронтенда (`yarn build` в папке frontend)
3. Сборка бекенда (`yarn build` в корневой папке)

### Commit-msg хук

1. Валидация сообщения коммита по правилам Conventional Commits
2. Проверка наличия типа коммита (feat, fix, docs, etc.)
3. Проверка формата сообщения

## Формат коммитов

Коммиты должны следовать формату Conventional Commits:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Типы коммитов

- `feat` - новая функциональность
- `fix` - исправление бага
- `docs` - изменения в документации
- `style` - форматирование кода
- `refactor` - рефакторинг
- `perf` - улучшение производительности
- `test` - добавление тестов
- `chore` - обновление задач сборки
- `ci` - изменения в CI/CD
- `build` - изменения в системе сборки
- `revert` - откат предыдущего коммита

### Примеры

```
feat: add user authentication
fix: resolve login validation issue
docs: update API documentation
refactor: simplify course generation logic
```

## Настройка

Хуки автоматически устанавливаются при выполнении `yarn install` благодаря скрипту `prepare` в package.json.

## Отключение хуков

Для временного отключения хуков используйте флаг `--no-verify`:

```bash
git commit -m "message" --no-verify
```

## Устранение проблем

### Ошибки сборки

Если сборка падает, исправьте ошибки в коде перед коммитом.

### Ошибки линтинга

ESLint автоматически исправляет большинство проблем. Для ручного исправления:

```bash
yarn lint
```

### Неверный формат коммита

Используйте правильный формат согласно Conventional Commits или добавьте флаг `--no-verify`.
