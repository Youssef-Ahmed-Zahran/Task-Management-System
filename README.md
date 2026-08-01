# Task Management System

A full-stack task management application built for the Full Stack Node.js Technical Assessment.

## Tech Stack

### Backend (`/api`)

- **Node.js** + **Express** (v5) + **TypeScript**
- **PostgreSQL** (Neon cloud) + **Prisma** ORM
- **JWT** (HttpOnly cookies) + **bcrypt**
- **Zod** validation
- **Vitest** + **Supertest** integration tests

### Frontend (`/client`)

- **React 19** + **Vite** + **TypeScript**
- **React Router v7** (file-based routing with lazy loading + Suspense)
- **TanStack Query** (server state)
- **Zustand** (client/auth state with persistence)
- **Axios** (with cookie credentials + 401 interceptor)
- **React-Hook-Form** + **Zod** (form validation)
- **Tailwind CSS v4**
- **Lucide React** (icons)

## Architecture

Both sides follow a **feature-based architecture**:

```
api/src/
├── config/          # Typed env loader
├── lib/             # Prisma singleton
├── middlewares/     # authenticate, authorize, validate, errorHandler
├── modules/
│   ├── auth/        # register, login, logout, getMe
│   ├── users/       # list & get users
│   ├── projects/    # CRUD + member management
│   └── tasks/       # CRUD + filters + audit log
├── utils/           # ApiError, ApiResponse
├── app.ts           # Express app (no listen — for testing)
├── server.ts        # Entry point (starts listener)
└── tests/           # Integration tests

client/src/
├── components/
│   ├── error-boundary/    # Global ErrorBoundary (class component)
│   ├── layout/            # AppLayout (sidebar) + AuthLayout
│   ├── loader/            # Suspense fallback spinner
│   ├── not-found/         # 404 page
│   └── protected-route/   # Auth guard
├── config/          # Axios instance
├── features/
│   ├── auth/        # api, hooks, schema, pages (Login/Register)
│   ├── dashboard/   # Overview stats
│   ├── projects/    # CRUD, member management, card UI
│   └── tasks/       # Kanban board, filters, task cards
├── router/          # createBrowserRouter with lazy routes
├── store/           # Zustand authStore
└── utils/           # cn, formatDate
```

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)

### 1. API Setup

```bash
cd api
# Copy the example env file and fill in DATABASE_URL and JWT_SECRET
cp .env.example .env
# Note: A sample .env.example is also provided in the root directory for reference.

npm install
npm run db:migrate     # Run Prisma migrations
npm run db:seed        # Seed admin + member users
npm run dev            # Start on :8080
```

### 2. Client Setup

```bash
cd client
npm install
npm run dev            # Start on :5173
```

## Environment Variables

A sample environment file is provided in the root directory as `.env.example` (and inside `api/.env.example`). Do NOT commit real secrets to version control.

### API (`api/.env`)

| Variable         | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string                             |
| `NODE_ENV`       | `development` \| `production` \| `test`                  |
| `PORT`           | API port (default: 8080)                                 |
| `JWT_SECRET`     | Secret for signing JWTs (min 16 chars)                   |
| `JWT_EXPIRES_IN` | Token expiry (default: `7d`)                             |
| `CLIENT_URL`     | Frontend URL for CORS (default: `http://localhost:5173`) |

## Test Credentials

After running `npm run db:seed`:

| Role   | Email             | Password      |
| ------ | ----------------- | ------------- |
| Admin  | `admin@task.dev`  | `Admin1234!`  |
| Member | `member@task.dev` | `Member1234!` |

## Running Tests

```bash
cd api
npm test
```

Covers 16 test cases across:

- Auth: register, duplicate, invalid email, wrong password, login+cookie, get me, get me unauthenticated
- Projects: create, list
- Tasks: create, list, filter by status, update status, delete, 404 after delete, unauthorized

## API Documentation & Postman Collection

A complete Postman collection is included in the root directory: `postman_collection.json`. You can import this directly into Postman to test all endpoints.

### Auth

| Method | Path                 | Auth | Description        |
| ------ | -------------------- | ---- | ------------------ |
| POST   | `/api/auth/register` | —    | Create account     |
| POST   | `/api/auth/login`    | —    | Login + set cookie |
| POST   | `/api/auth/logout`   | —    | Clear cookie       |
| GET    | `/api/auth/me`       | ✅   | Get current user   |

### Projects

| Method | Path                                | Auth     | Description              |
| ------ | ----------------------------------- | -------- | ------------------------ |
| GET    | `/api/projects`                     | ✅       | List accessible projects |
| POST   | `/api/projects`                     | ✅       | Create project           |
| GET    | `/api/projects/:id`                 | ✅       | Get project              |
| PUT    | `/api/projects/:id`                 | ✅ Owner | Update project           |
| DELETE | `/api/projects/:id`                 | ✅ Owner | Delete project           |
| POST   | `/api/projects/:id/members`         | ✅ Owner | Add member               |
| DELETE | `/api/projects/:id/members/:userId` | ✅ Owner | Remove member            |

### Tasks

| Method | Path                            | Query Params                                 | Description                |
| ------ | ------------------------------- | -------------------------------------------- | -------------------------- |
| GET    | `/api/projects/:pId/tasks`      | `status`, `priority`, `assigneeId`, `search` | List tasks with filters    |
| POST   | `/api/projects/:pId/tasks`      | —                                            | Create task                |
| GET    | `/api/projects/:pId/tasks/:tId` | —                                            | Get task + audit log       |
| PUT    | `/api/projects/:pId/tasks/:tId` | —                                            | Update task (audit logged) |
| DELETE | `/api/projects/:pId/tasks/:tId` | —                                            | Delete task                |

### Users

| Method | Path             | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/api/users`     | List all users |
| GET    | `/api/users/:id` | Get user by ID |

## Features

- 🔐 **JWT Auth** via HttpOnly cookies (secure, no XSS risk)
- 👥 **Roles**: Admin (seeded) + Member (self-registered)
- 📋 **Kanban Board**: Tasks in To Do / In Progress / Done columns
- 🔍 **Filters**: by status, priority, assignee, text search
- 👤 **Member Search**: Real-time scrolling member search by name or email
- 📝 **Audit Log**: every status or assignee change is logged
- ⚡ **Lazy Loading**: all pages are code-split via React.lazy + Suspense
- 🛡 **Error Boundary**: catches runtime errors with friendly fallback
- 📱 **Responsive**: mobile-friendly sidebar + grid layouts
