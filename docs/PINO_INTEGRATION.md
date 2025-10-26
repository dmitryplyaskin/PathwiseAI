# Интеграция Pino Logger

## Описание

В проекте интегрирован структурированный логгер Pino для замены всех `console.log` и других способов дебага. Все логи структурированы, типизированы и записываются в соответствующие места.

## Конфигурация

### Основная конфигурация

Конфигурация logger находится в `src/config/logger.config.ts`:

- **Dev режим**: Использует `pino-pretty` для красивого вывода в консоль с цветами
- **Prod режим**: Выводит логи в stdout в JSON формате
- **Запись ошибок**: Все ошибки автоматически записываются в файл `logs/error.log` независимо от окружения

### Использование в сервисах

Все сервисы используют стандартный `Logger` из `@nestjs/common`, который автоматически интегрируется с Pino через `nestjs-pino`:

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  someMethod() {
    this.logger.log('Информационное сообщение');
    this.logger.warn({ context: 'someContext' }, 'Предупреждение');
    this.logger.error({ err: errorObj, additionalData }, 'Ошибка');
  }
}
```

## Типизация ошибок

Все ошибки типизированы. Используется паттерн:

```typescript
catch (error) {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  this.logger.error({ err: errorObj, context }, 'Error message');
}
```

## Удаленные debug логи

Из кода удалены все debug логи, которые не относятся к ошибкам, предупреждениям и основной информации о работе приложения:

- Удалены `console.log` с полными ответами API
- Удалены `console.log` с парсированными данными
- Удалены `console.log` с debug информацией
- Оставлены только важные логи: ошибки, предупреждения, основная информация о работе

## Файлы логов

- `logs/error.log` - Все ошибки записываются в этот файл
- Логи создаются автоматически при первом запуске приложения

## Измененные файлы

- `src/config/logger.config.ts` - Конфигурация logger
- `src/app.module.ts` - Подключение LoggerModule
- `src/main.ts` - Использование logger в bootstrap
- `src/modules/courses/services/lessons.service.ts` - Замена console.log на logger
- `src/modules/exams/services/exams.service.ts` - Замена console.log на logger
- `src/modules/chat/services/openrouter.service.ts` - Замена console.log на logger
- `src/modules/chat/services/chat.service.ts` - Замена console.log на logger, исправление типизации
- `src/shared/services/user-seed.service.ts` - Замена console.log на logger
