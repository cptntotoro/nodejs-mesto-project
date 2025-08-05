# Бэкенд Mesto. Каркас API Mesto

Mesto Backend — серверная часть проекта Mesto, предоставляющая API для работы с пользователями и карточками.

## 🛠️ Технологии

| Категория      | Технологии                           |
|----------------|--------------------------------------|
| Бэкенд         | Node.js, TypeScript                  |
| Базы данных    | MongoDB, ODM Mongoose                |
| Инструменты    | Lombok, MapStruct, OpenAPI Generator |

## API роуты

- GET /users — получить всех пользователей
- GET /users/:userId — получить пользователя по идентификатору
- GET /users/me — получить текущего пользователя
- PATCH /users/me — обновить профиль (name, about)
- PATCH /users/me/avatar — обновить аватар
- GET /cards — получить все карточки
- POST /cards — создать карточку
- DELETE /cards/:cardId — удалить карточку по идентификатору (только для автора)
- PUT /cards/:cardId/likes — поставить лайк карточке
- DELETE /cards/:cardId/likes — убирать лайк с карточки

## 📦 Структура проекта
- src/ — исходный код:  
  - controllers/ — контроллеры
  - models/ — схемы
  - routes/ — роуты
  - types/ — TypeScript-типы
  - utils/ — утилиты
  - app.ts — запуск сервера, подключение MongoDB, настройка роутов
- .editorconfig — настройки отступов и кодировки
- .eslintrc — конфигурация ESLint (Airbnb, исключение _id)
- package.json — скрипты start, dev, build, lint, зависимости
- tsconfig.json — настройки TypeScript

## 📥 Установка и запуск

1. Установите зависимости:
```
npm install
```

2. Убедитесь, что MongoDB запущен локально на порту 27017

3. Скомпилируйте проект:
```
npm run build
```

4. Проверьте код на ошибки линтера:
```
npm run lint
```

5. Запустите проект:
```
npm run start
```

Приложение будет доступно по адресу: http://localhost:3000
