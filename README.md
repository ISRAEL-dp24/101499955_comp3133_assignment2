# COMP3133 Assignment 2 by
# Israel Osunkoya

**Course:** COMP 3133 – Full Stack Development II  
**Student ID:** 101499955  
**George Brown College**

---

## Overview

A full-stack Employee Management System built with **Angular 21** (frontend) and **Node.js + GraphQL** (backend). Users can sign up, log in, and perform full CRUD operations on employee records, including profile photo upload and search by department or designation.

---

## Tech Stack

| Layer     | Technology                                                     |
|-----------|----------------------------------------------------------------|
| Frontend  | Angular 21, Apollo Angular, Bootstrap 5, Angular Material      |
| Backend   | Node.js, Express, Apollo Server, GraphQL                       |
| Database  | MongoDB Atlas                                                  |
| Auth      | JWT (JSON Web Tokens)                                          |
| Hosting   | Frontend: Vercel · Backend: Render                             |

---

## Features

- **Authentication** – Signup & Login with form validation; JWT session stored via `AuthService`; `AuthGuard` protects all employee routes
- **Employee List** – Tabular view of all employees with avatar/photo, salary formatted via `SalaryPipe`, row hover via `HighlightDirective`
- **Add Employee** – Reactive form with full validation; profile photo upload (JPG/PNG/GIF/WEBP, max 2 MB, stored as base64)
- **View Employee** – Detailed employee card
- **Edit Employee** – Pre-populated form with photo update support
- **Delete Employee** – Confirmation dialog + instant list refresh
- **Search** – Filter employees by department and/or designation via dedicated GraphQL query
- **Logout** – Clears session and redirects to login

---

## Angular Concepts Used

| Concept              | Where                                          |
|----------------------|------------------------------------------------|
| Components           | Login, Signup, EmployeeList, Add, View, Edit   |
| Reactive Forms       | All form screens with validators               |
| Services             | `AuthService`, `GraphqlService`                |
| Dependency Injection | All services injected via constructor          |
| Router & Guards      | `app.routes.ts`, `AuthGuard`                   |
| Pipes                | `SalaryPipe` (formats salary as CAD)           |
| Directives           | `HighlightDirective` (row hover highlight)     |
| Apollo Angular       | GraphQL queries & mutations                    |

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── employee-list/
│   │   ├── add-employee/
│   │   ├── view-employee/
│   │   └── edit-employee/
│   ├── services/
│   │   ├── auth.ts
│   │   └── graphql.ts
│   ├── guards/
│   │   └── auth-guard.ts
│   ├── pipes/
│   │   └── salary.pipe.ts
│   ├── directives/
│   │   └── highlight.directive.ts
│   ├── app.routes.ts
│   └── app.config.ts
└── environments/
    ├── environment.ts        (dev  → localhost:4000)
    └── environment.prod.ts   (prod → Render URL)
```

---

## Getting Started (Local)

### Prerequisites
- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`

### 1. Start the Backend
```bash
cd backend/
npm install
npm start
# GraphQL running at http://localhost:4000/graphql
```

### 2. Start the Frontend
```bash
cd frontend/
npm install
ng serve
# App running at http://localhost:4200
```

---

## Deployment

| Service  | URL                                         |
|----------|---------------------------------------------|
| Backend  | https://comp3133-101499955-backend.onrender.com       |
| Frontend | https://101499955-comp3133-assignment2.vercel.app/        |

---