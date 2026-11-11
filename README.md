# Student Management System

A full-stack CRUD application for managing student records, built with **Next.js (App Router)**, **React**, **Tailwind CSS**, **MongoDB** and **Mongoose**. Users can register, view, edit and delete students from a responsive dashboard. All data operations go through REST API route handlers.

## Features

- **Create**: register a student with name, email, phone and department
- **Read**: list all students (table on desktop, cards on mobile)
- **Update**: edit a student in the same form, pre-filled with current data
- **Delete**: remove a student after a confirmation dialog
- Validation on both client and server using one shared rule set
- Unique emails enforced by a MongoDB unique index
- Toast notifications, loading skeletons, empty state and error state with retry
- Friendly error messages; raw database errors are never shown to users

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router, Route Handlers) | Frontend and backend |
| React 19 | UI components |
| JavaScript | Language (no TypeScript) |
| Tailwind CSS 4 | Styling and responsive design |
| MongoDB | Database |
| Mongoose 9 | Schema, model and validation |

## Prerequisites

- Node.js 20.9 or newer, and npm
- A MongoDB database: either a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB server

## Installation

```bash
git clone https://github.com/LMTanjil/smgts.git
cd smgts
npm install
```

## Environment Variables

Copy the example file and fill in your connection string:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string, including the database name |

Examples:

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/student_management?retryWrites=true&w=majority

# Local MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/student_management
```

`.env` and `.env.local` are git-ignored; only `.env.example` (no real values) is committed. The variable is read only on the server and is never sent to the browser.

## Running Locally

```bash
npm run dev      # development server at http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## API Documentation

Base path: `/api/students`. All requests and responses use JSON.

Every response has the same shape:

```json
{ "success": true,  "message": "optional", "data": { } }
{ "success": false, "message": "Human-readable error", "errors": { "field": "optional per-field message" } }
```

### Endpoints

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/api/students` | List all students (newest first) | 200 |
| POST | `/api/students` | Create a student | 201 |
| GET | `/api/students/[id]` | Get one student | 200 |
| PUT | `/api/students/[id]` | Update a student (all fields) | 200 |
| DELETE | `/api/students/[id]` | Delete a student | 200 |

### Request body (POST / PUT)

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "phone": "+44 20 7946 0958",
  "department": "Computer Science"
}
```

### Example response: `POST /api/students` (201)

```json
{
  "success": true,
  "message": "Student created successfully.",
  "data": {
    "_id": "6af46cc8c2dd470fcbfc9e5b",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "phone": "+44 20 7946 0958",
    "department": "Computer Science",
    "createdAt": "2026-11-11T13:25:28.605Z",
    "updatedAt": "2026-11-11T13:25:28.605Z"
  }
}
```

### Error responses

| Status | When | Example message |
|---|---|---|
| 400 | Missing or invalid fields | `Please correct the highlighted fields.` (+ `errors` per field) |
| 400 | Body is not valid JSON | `Request body must be a valid JSON object.` |
| 400 | Malformed MongoDB ID | `Invalid student ID.` |
| 404 | ID is valid but no such student | `Student not found.` |
| 409 | Email already in use | `A student with this email already exists.` |
| 503 | Database unreachable | `Unable to connect to the database. Please try again shortly.` |
| 500 | `MONGODB_URI` missing or unexpected error | Generic friendly message (details logged on the server only) |

### Validation rules

| Field | Rules |
|---|---|
| `name` | Required, 2-100 characters |
| `email` | Required, valid format, unique (case-insensitive, stored lowercase) |
| `phone` | Required, digits with optional `+`, spaces, `-`, `.`, `()`; 7-15 digits |
| `department` | Required, up to 100 characters |

The same rules (`lib/validation.js`) run in the browser before submission, in the API route, and in the Mongoose schema.

### Quick test with curl

```bash
curl http://localhost:3000/api/students
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","phone":"+44 20 7946 0958","department":"Computer Science"}'
```

## Project Structure

```
app/
  api/students/route.js        GET (list), POST (create)
  api/students/[id]/route.js   GET, PUT, DELETE by ID
  layout.js, page.js, globals.css
components/
  StudentDashboard.js          Page state: list, edit, delete, toasts
  StudentForm.js, FormField.js Create/edit form with inline errors
  StudentTable.js              Responsive table / card list
  ConfirmDialog.js             Delete confirmation modal
  Header.js, Toasts.js, Spinner.js
lib/
  dbConnect.js                 Cached Mongoose connection (reads MONGODB_URI)
  validation.js                Shared client/server validation rules
  apiResponse.js               JSON response helpers and error mapping
  studentApi.js                Browser fetch wrapper for the API
models/
  Student.js                   Mongoose schema and model
```

## How It Works

- **Connection reuse**: `lib/dbConnect.js` caches the Mongoose connection on `globalThis`, so requests and dev hot reloads reuse one connection instead of opening new ones.
- **Create**: the form validates locally, sends `POST /api/students`, the route re-validates and calls `Student.create()`. A duplicate email triggers MongoDB error `11000`, which is returned as `409`.
- **Read**: the dashboard calls `GET /api/students` on load. New or updated records are merged into the list from the API response.
- **Update**: clicking Edit loads the student into the form. Saving sends `PUT /api/students/[id]`, which runs `findByIdAndUpdate` with schema validators.
- **Delete**: a confirmation dialog opens; on confirm, `DELETE /api/students/[id]` runs `findByIdAndDelete` and the row is removed from the list.
