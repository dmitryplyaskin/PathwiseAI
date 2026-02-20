# AUTH / SESSION / RBAC Audit (2026-02-20)

## Scope

Документ фиксирует риски авторизации и сессий в backend на дату **2026-02-20**.
Ограничение задачи: не переводить текущую mock-модель auth в production-grade реализацию, чтобы не ломать локальную разработку и существующие аккаунты.

## Что исправлено в рамках этой задачи

- Добавлена JWT-защита для `ChatController` (`@UseGuards(JwtAuthGuard)`).
- Убрано доверие `userId` из входных DTO и маршрутов в ключевых сценариях (courses/lessons/exams/questions/chat).
- User-context теперь определяется сервером через `@CurrentUser()`.
- Для `/users` введена модель:
  - self endpoints: `GET /users/me`, `PATCH /users/me`, `DELETE /users/me`
  - admin endpoints: `GET/POST/PATCH/DELETE /users...` только через `RolesGuard + @Roles(UserRole.ADMIN)`.
- Исправлен риск 500 в `CsrfGuard` при невалидном `referer` (теперь `403`).
- Синхронизирован lifecycle auth-cookie:
  - `maxAge` вычисляется из `JWT_EXPIRES_IN`
  - `logout` очищает cookie с теми же опциями (`path/sameSite/secure`).

## Подтвержденные риски, оставленные намеренно (deferred)

1. Mock-style auth flow
- Часть поведения авторизации по-прежнему ориентирована на локальную разработку.
- Нет production-hardening полного цикла identity proofing.

2. JWT session model без refresh token ротации
- Нет refresh/access-пары с ротацией и серверным revoke-list.
- Компрометация токена действует до истечения `exp`.

3. Отсутствие продвинутой защиты от brute force
- Нет rate limiting / progressive delay / lockout для login endpoint.

4. Нет обязательной верификации email / recovery-hardening
- Полный безопасный lifecycle подтверждения email и восстановления аккаунта не реализован.

5. RBAC ограничен базовым уровнем
- Есть `USER/ADMIN`, но нет fine-grained permissions/политик по доменным ресурсам.

6. CSRF-модель остаётся базовой
- Используется double-submit cookie подход, но без полноценной политики per-session secret rotation.

7. Отсутствует аудит сессий/устройств
- Нет списка активных сессий, selective logout и контроля устройства.

## Что НЕ менялось специально для сохранения совместимости

- Схема таблицы пользователей и текущий password hashing flow не ломались.
- Логин существующих локальных аккаунтов сохранён.
- Не внедрялись breaking изменения auth UX (MFA, mandatory verification, forced password reset).

## Рекомендованный следующий этап (вне текущего ограничения)

1. Ввести refresh tokens + rotation + revoke on logout/password change.
2. Добавить rate-limiting на auth endpoints (IP + user key).
3. Внедрить email verification и безопасный password reset flow.
4. Добавить session management (active sessions, revoke by device).
5. Расширить RBAC до permission-based access control.
