# Личный финучёт

Учебный проект курса «Fullstack». Приложение для учёта личных доходов и расходов: счета, категории операций и история транзакций, с регистрацией и входом пользователя.

## Пользовательские сценарии

- Зарегистрироваться и войти по email/паролю.
- Посмотреть общую сводку по финансам: суммарный баланс по своим счетам, доходы и расходы, последние операции.
- Просматривать, создавать, редактировать и удалять операции (счёт, категория, сумма, описание, дата), счета и категории.
- Выйти из аккаунта.

Все данные (кроме списка категорий, который общий для всех) видны только тому пользователю, которому принадлежат.

## Экраны

1. **Вход** (`/login`) и **Регистрация** (`/register`) — доступны без авторизации.
2. **Обзор** (`/`) — сводные показатели и таблица последних операций.
3. **Транзакции** (`/transactions`) — таблица операций с фильтром по категории, создание/редактирование/удаление.
4. **Счета** (`/accounts`) — карточки счетов с балансом, создание/редактирование/удаление.
5. **Категории** (`/categories`) — таблица категорий с типом (доход/расход), создание/редактирование/удаление.

Экраны 2–5 доступны только авторизованному пользователю — при отсутствии сессии открывается `/login`.

Скриншоты экранов: [docs/screenshots](docs/screenshots). Скриншоты `dashboard-loading.png`, `dashboard-error.png`, `transactions-empty.png`, `transactions-form-validation.png` — исторические, сняты на этапе лабы 3, когда данные были демонстрационными, а состояния загрузки/ошибки эмулировались вручную; сейчас те же состояния показываются на реальных запросах к API.

## Стек

- Backend: Python, FastAPI, PostgreSQL, SQLAlchemy, PyJWT, bcrypt.
- Frontend: React, TypeScript, Ant Design, React Router.

## Frontend

### Структура frontend (упрощённый Feature-Sliced Design)

```
frontend/src/
  app/            — сборка приложения: App.tsx с роутингом, AuthProvider,
                    ProtectedRoute, AppLayout (сайдбар + шапка с email и кнопкой выхода)
  pages/          — экраны (login, register, dashboard, transactions, accounts, categories):
                    забирают данные и компонуют features/entities/shared
  features/       — пользовательские действия: вход, регистрация, создание/редактирование
                    счёта, категории, операции (форма + валидация + вызов колбэка)
  entities/       — сущности предметной области и обращения к API:
                    session (пользователь, вход/регистрация/выход), account, category, transaction
  shared/         — переиспользуемое и не привязанное к предметной области:
                    ui/AsyncState, ui/FadeIn, lib/useAsyncResource, lib/format,
                    lib/apiClient (обёртка над fetch), lib/authStorage (токены в localStorage)
```

Полное соблюдение FSD не требуется по заданию. `AppLayout` лежит в `app/`, а не в `shared/ui`, так как он завязан на состояние авторизации (`useAuth`) — общий layout уровня приложения, а не безусловно переиспользуемый UI-кусок.

### Авторизация на клиенте

- `shared/lib/authStorage.ts` хранит access и refresh токены в `localStorage`.
- `shared/lib/apiClient.ts` — обёртка над `fetch`: подставляет `Authorization: Bearer <access token>` в каждый запрос; если сервер отвечает `401`, один раз пытается обновить access token через `/auth/refresh` и повторяет запрос; если обновить не удалось — очищает токены.
- `app/AuthProvider.tsx` — React-контекст с текущим пользователем; при загрузке приложения, если есть сохранённый access token, запрашивает `/auth/me`.
- `app/ProtectedRoute.tsx` — оборачивает приватные страницы; без авторизации перенаправляет на `/login`.

### Динамическое поведение экранов

- **Загрузка** — каждый экран со списком получает данные через хук `useAsyncResource`, пока идёт запрос к API показывается `Skeleton`.
- **Ошибка** — реальная ошибка сети или ответа API показывается через `Alert` с кнопкой «Повторить» (`shared/ui/AsyncState`).
- **Отсутствие данных** — пустой список (например, у нового пользователя ещё нет операций, либо выбран фильтр по категории без операций) показывается через `Empty` с понятным текстом.
- **Ошибки форм и доступа** — ошибки валидации (`422`) и отказы в доступе/аутентификации показываются пользователю через `antd message`/`Alert` с текстом от backend.
- **Валидация форм** — формы (`features/*`) используют `antd Form` с явными правилами и показывают ошибку под конкретным полем.
- **Анимация** — появление содержимого экрана после загрузки и открытие модалок сопровождается плавным fade-in (`shared/ui/FadeIn`, CSS-анимация без сторонних библиотек).

### Запуск frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:5173`. Backend должен быть запущен на `http://localhost:8000` (адрес захардкожен в `shared/lib/apiClient.ts`).

## Backend

FastAPI-приложение с аутентификацией и CRUD по трём сущностям: счета (`accounts`), категории (`categories`) и операции (`transactions`). Данные хранятся в PostgreSQL, доступ — через SQLAlchemy.

### Модель данных

- **User** (пользователь) — `id`, `email`, `hashed_password`, `created_at`.
- **RefreshToken** (refresh-сессия) — `id`, `jti`, `user_id` → User, `expires_at`, `revoked_at`.
- **Account** (счёт) — `id`, `user_id` → User, `name`, `currency`, `balance`.
- **Category** (категория) — `id`, `name`, `type` (`income`/`expense`) — общий справочник, не привязан к пользователю.
- **Transaction** (операция) — `id`, `user_id` → User, `account_id` → Account, `category_id` → Category, `type`, `amount`, `description`, `occurred_on`.

Счета и операции принадлежат конкретному пользователю (`user_id`) и видны только ему. Категории — общий для всех пользователей справочник: читать их может кто угодно, создавать/изменять — только авторизованный пользователь. При удалении счёта связанные операции удаляются каскадно.

### Аутентификация и авторизация

- Пароли хранятся в БД в виде хешей `bcrypt` (`hashed_password`), в открытом виде — никогда.
- При регистрации/входе выдаётся пара токенов: **access token** (JWT, живёт 15 минут, передаётся в заголовке `Authorization: Bearer ...`) и **refresh token** (JWT с уникальным `jti`, живёт 7 дней, запись о нём хранится в таблице `refresh_tokens`).
- `POST /auth/refresh` выдаёт новый access token по действующему refresh token; отклоняет запрос, если refresh token просрочен, некорректен или отозван (`revoked_at` не пусто).
- `POST /auth/logout` отзывает конкретный refresh token (ставит `revoked_at`) — после этого обновить по нему access token уже нельзя, даже если он ещё не истёк по сроку.
- `GET /auth/me` — защищённый маршрут, возвращает текущего пользователя по access token.
- Приватные маршруты (`/accounts`, `/transactions`) требуют валидный access token и возвращают только записи текущего пользователя; обращение к чужой записи по id даёт `404` (чтобы не подтверждать даже сам факт её существования).
- `/categories` — публичный на чтение (`GET` без токена), изменение требует авторизации, но не привязано к конкретному владельцу.

### Структура backend

```
backend/
  app/
    main.py            — точка входа FastAPI, подключение роутов
    core/
      config.py         — настройки из переменных окружения
      security.py        — хеширование паролей, выпуск и проверка JWT
    db/                — подключение к БД и сессии
    models/            — SQLAlchemy-модели (user, refresh_token, account, category, transaction)
    schemas/           — Pydantic-схемы запросов/ответов
    crud/              — операции с БД
    api/
      deps.py            — зависимость get_current_user (проверка access token)
      routes/             — маршруты API: auth, accounts, categories, transactions
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
cp .env.example .env   # указать свою строку подключения к PostgreSQL и свой JWT_SECRET_KEY
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

API будет доступно на `http://localhost:8000`, интерактивная документация — на `http://localhost:8000/docs` (там же можно авторизоваться кнопкой Authorize, вставив access token, и вызывать защищённые маршруты).

### Основные эндпоинты

- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- `GET/POST /accounts`, `GET/PATCH/DELETE /accounts/{id}` — требуют авторизации
- `GET /categories` — публично; `POST /categories`, `PATCH/DELETE /categories/{id}` — требуют авторизации
- `GET/POST /transactions`, `GET/PATCH/DELETE /transactions/{id}` — требуют авторизации

Некорректные данные возвращают `400`/`422` с описанием ошибки, отсутствие/невалидность токена — `401`, обращение к чужой или несуществующей записи — `404`.
