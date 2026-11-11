# Student Management System

A small full-stack student management application built with Next.js, Tailwind CSS, MongoDB, and Mongoose. The app allows users to create, read, update, and delete student records through a responsive dashboard.

## Features

- Add new students with validation
- View all students in a table layout
- Edit student information
- Delete students with confirmation
- Duplicate email prevention
- MongoDB integration with Mongoose
- Responsive UI for desktop and mobile screens

## Tech Stack

- Next.js
- React
- JavaScript
- Tailwind CSS
- MongoDB
- Mongoose

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env.local` file in the project root and set your MongoDB connection string:
   ```bash
   MONGODB_URI=mongodb://127.0.0.1:27017/smgts
   ```

   A sample configuration is also available in `.env.example`.

3. Start MongoDB locally or point `MONGODB_URI` to an existing MongoDB instance.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string for the application |

## API Endpoints

- `GET /api/students` - Get all students
- `POST /api/students` - Create a student
- `GET /api/students/[id]` - Get a single student
- `PUT /api/students/[id]` - Update a student
- `DELETE /api/students/[id]` - Delete a student

## Validation Rules

- All fields are required
- Email format must be valid
- Email addresses must be unique
- Phone format must be valid
- Invalid or unknown student IDs are rejected gracefully

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- The project intentionally uses JavaScript rather than TypeScript.
- Sensitive credentials should never be committed to Git.
- For production deployments, store environment variables in a secure secret manager or hosting settings.
