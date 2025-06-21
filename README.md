# 📚 Bookstore REST API

A minimal RESTful API for managing authors and books using **NestJS**, **TypeORM**, and **PostgreSQL**.

---

## ✨ Features
- CRUD operations for Authors and Books
- Data validation using DTOs (`class-validator`)
- Global error handling
- PostgreSQL or SQLite support
- E2E and unit testing using Jest & Supertest

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-user/bookstore-rest-api.git
cd bookstore-rest-api
pnpm install
```

### 2. Setup Environment

```bash
cp .env.example .env
cp .env.example .env.test
```

Fill in your DB credentials in both files.

---

## 📆 Scripts

| Command                   | Description                      |
|--------------------------|----------------------------------|
| `pnpm start:dev`         | Run in development mode          |
| `pnpm test:e2e`          | Run end-to-end tests             |

---

## 📂 Project Structure

```
src/
  ├── modules/
  │   ├── author/
  │   └── book/
  ├── database/
  └── app.module.ts

test/
  ├── author.e2e-spec.ts
  ├── book.e2e-spec.ts
  └── app.e2e-spec.ts
```

---

## 🔗 API Endpoints

### Authors
- `POST /authors`
- `GET /authors`
- `GET /authors/:id`
- `PATCH /authors/:id`
- `DELETE /authors/:id`

### Books
- `POST /books`
- `GET /books`
- `GET /books/:id`
- `PATCH /books/:id`
- `DELETE /books/:id`

---

## 🔮 Testing

```bash
pnpm test:e2e
```

Make sure `.env.test` is properly configured.

