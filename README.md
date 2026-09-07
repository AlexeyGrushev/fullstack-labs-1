# Личный финучёт

Учебный проект курса «Fullstack». Приложение для учёта личных доходов и расходов: счета, категории операций и сама история транзакций.

## Пользовательские сценарии

- Посмотреть общую сводку по финансам: суммарный баланс по всем счетам, доходы и расходы, последние операции.
- Просмотреть список операций, добавить новую операцию (счёт, категория, сумма, описание, дата).
- Просмотреть список счетов и добавить новый счёт.
- Просмотреть список категорий доходов/расходов и добавить новую категорию.

## Экраны

1. **Обзор** (`/`) — сводные показатели и таблица последних операций.
2. **Транзакции** (`/transactions`) — таблица всех операций, форма добавления новой операции.
3. **Счета** (`/accounts`) — карточки счетов с балансом, форма добавления счёта.
4. **Категории** (`/categories`) — таблица категорий с типом (доход/расход), форма добавления категории.

Скриншоты экранов: [docs/screenshots](docs/screenshots).

## Стек

- Backend: Python, FastAPI, PostgreSQL, SQLAlchemy.
- Frontend: React, TypeScript, Ant Design, React Router.

## Frontend

Каркас интерфейса на React + TypeScript + Ant Design. На этом этапе данные демонстрационные (см. `frontend/src/mocks`), без подключения к API.

### Запуск frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:5173`.

## Backend

FastAPI-приложение с CRUD по трём сущностям: счета (`accounts`), категории (`categories`) и операции (`transactions`). Данные хранятся в PostgreSQL, доступ — через SQLAlchemy.

### Модель данных

- **Account** (счёт) — `id`, `name`, `currency`, `balance`.
- **Category** (категория) — `id`, `name`, `type` (`income`/`expense`).
- **Transaction** (операция) — `id`, `account_id` → Account, `category_id` → Category, `type`, `amount`, `description`, `occurred_on`.

Одна операция всегда привязана ровно к одному счёту и одной категории (внешние ключи `account_id`, `category_id`). При удалении счёта или категории связанные операции удаляются каскадно.

### Структура backend

```
backend/
  app/
    main.py            — точка входа FastAPI, подключение роутов
    core/config.py     — настройки из переменных окружения
    db/                — подключение к БД и сессии
    models/            — SQLAlchemy-модели
    schemas/           — Pydantic-схемы запросов/ответов
    crud/              — операции с БД
    api/routes/        — маршруты API по сущностям
  create_tables.py     — создание таблиц в БД
  requirements.txt
  .env.example
```

### Настройка окружения

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # и указать свою строку подключения к PostgreSQL
```

### Подготовка БД и создание таблиц

Убедитесь, что в `.env` указан `DATABASE_URL` на существующую базу PostgreSQL, затем выполните:

```bash
python create_tables.py
```

### Запуск backend

```bash
uvicorn app.main:app --reload
```

API будет доступно на `http://localhost:8000`, интерактивная документация — на `http://localhost:8000/docs`.

### Основные эндпоинты

- `GET/POST /accounts`, `GET/PATCH/DELETE /accounts/{id}`
- `GET/POST /categories`, `GET/PATCH/DELETE /categories/{id}`
- `GET/POST /transactions`, `GET/PATCH/DELETE /transactions/{id}`

Некорректные данные возвращают `400`/`422` с описанием ошибки, обращение к несуществующей записи — `404`.
