# ROKY Clips — Test Task

NestJS + PostgreSQL. Webhook для обработки платежей и активации подписок.

## Запуск

```bash
cp .env.example .env
npm install
docker compose up --build
```

В отдельном терминале — миграции:

```bash
npm run migration:run
```

API: http://localhost:3000  
Swagger: http://localhost:3000/api

## Проверка идемпотентности

10 параллельных запросов с одним `payment_id`:

```bash
npm run test:webhook:race
```

Ожидаемый результат: `processed: 1`, `duplicate: 9`.


## Решения

- **Идемпотентность webhook'а** — `UNIQUE` на `payment_id` + обработка `23505` при вставке. `SELECT` перед `INSERT` не защищает от параллельных ретраев; constraint в БД — да.

- **Атомарность** — создание платежа и активация подписки в одной транзакции Postgres, чтобы не было состояния что платёж есть, подписки нет.

- **Модель подписки** — одна строка на пользователя, при повторной оплате продлеваем `expires_at`, а не копим историю.
