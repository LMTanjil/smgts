# Assignment: Student Management System (CRUD)

## 1. Project Overview

Develop a **Student Management System** using **Next.js, Tailwind CSS, MongoDB, and Mongoose**.

The application should allow users to manage student records through a user-friendly interface and perform all four fundamental CRUD (Create, Read, Update, Delete) operations.

The primary objective of this assignment is to demonstrate your understanding of full-stack web development, database integration, API development, and frontend-backend communication.

## 2. Technology Stack

The project must be developed using the following technologies:

| Technology | Purpose |
|---|---|
| Next.js | Frontend and backend development |
| JavaScript | Application programming language |
| React | Building reusable UI components |
| Tailwind CSS | Styling and responsive design |
| MongoDB | Database management |
| Mongoose | Database schema and model management |
| Next.js API Routes / Route Handlers | Backend API development |

**Important:** Use JavaScript, not TypeScript.

## 3. Student Data Structure

Each student record must contain the following information:

| Field | Data Type | Description |
|---|---|---|
| Name | String | Full name of the student |
| Email | String | Unique email address |
| Phone | String | Student's contact number |
| Department | String | Student's academic department |

### Data Requirements

- All fields are required.
- Email addresses must be unique.
- Email addresses must follow a valid email format.
- Phone numbers must be validated.
- Student information must be stored in MongoDB.
- Each student must have a unique MongoDB-generated ID.

## 4. Core Functional Requirements (CRUD)

The application must implement all four CRUD operations.

### 4.1 Create – Add New Student

- Provide a form to add a new student.
- Collect the student's name, email, phone number, and department.
- Validate all required fields before submission.
- Prevent duplicate email addresses.
- Save student information to MongoDB through an API request.
- Display appropriate success and error messages.

### 4.2 Read – Display Students

- Retrieve all student records from MongoDB through an API.
- Display students in an organized table or card-based layout.
- Show all student information.
- Handle loading, empty, and error states appropriately.
- Automatically reflect newly added or updated records.

### 4.3 Update – Edit Student Information

- Provide an Edit action for each student.
- Allow users to modify existing student information.
- Prepopulate the form with the selected student's current information.
- Validate updated information before submission.
- Save changes to MongoDB through an API request.
- Display appropriate success and error messages.

### 4.4 Delete – Remove Student

- Provide a Delete action for each student.
- Display a confirmation dialog before deleting a record.
- Permanently remove the selected student from MongoDB.
- Update the student list after successful deletion.
- Display appropriate success and error messages.

## 5. API Development Requirements

All CRUD operations must be handled through API endpoints.

Use Next.js Route Handlers or API Routes to implement the backend functionality.

### Suggested API Structure

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Retrieve all students |
| POST | `/api/students` | Create a new student |
| GET | `/api/students/[id]` | Retrieve a specific student |
| PUT | `/api/students/[id]` | Update an existing student |
| DELETE | `/api/students/[id]` | Delete a student |

### API Requirements

- Use appropriate HTTP methods and status codes.
- Validate incoming request data.
- Handle invalid MongoDB IDs.
- Handle database connection errors.
- Prevent duplicate email addresses.
- Return consistent JSON responses.
- Provide meaningful error messages.
- Ensure that API operations interact with MongoDB through Mongoose.

## 6. Database Requirements

- Create a MongoDB database for the application.
- Establish a connection between Next.js and MongoDB using Mongoose.
- Define a Student schema and model.
- Configure appropriate field validation.
- Ensure email uniqueness using a database-level unique index.
- Reuse the database connection where appropriate to avoid unnecessary connections.
- Store database credentials securely using environment variables.

Example environment variable:

`MONGODB_URI=your_mongodb_connection_string`

**Security requirement:** Never expose database credentials or sensitive environment variables in client-side code or commit them to a public Git repository.

## 7. UI/UX and Design Requirements

The application should have a clean, modern, and professional interface.

### Required UI Components

- Application header or navigation bar.
- Student management dashboard.
- Student registration form.
- Student list/table.
- Edit student functionality.
- Delete confirmation dialog.
- Success and error notifications.
- Loading indicators.
- Empty-state messages.

### Design Expectations

- Use Tailwind CSS for all styling.
- Create a clean and consistent visual hierarchy.
- Ensure the application is fully responsive across desktop, tablet, and mobile devices.
- Use appropriate spacing, typography, colors, and visual elements.
- Provide clear interactive feedback for buttons and form submissions.
- Maintain a consistent design across all application states.

## 8. Form Validation and Error Handling

Implement proper validation on both the frontend and backend.

The application should handle the following scenarios:

- Empty or missing required fields.
- Invalid email addresses.
- Duplicate email addresses.
- Invalid phone numbers.
- Invalid student IDs.
- Student records that do not exist.
- MongoDB connection failures.
- Failed API requests.
- Unexpected server errors.

Display user-friendly messages instead of exposing raw technical errors.

## 9. Project Structure and Code Quality

Follow a clean and maintainable project structure.

- Separate frontend components from backend logic.
- Keep database connection logic in a dedicated utility file.
- Maintain a separate Student model.
- Organize API endpoints logically.
- Use reusable React components where appropriate.
- Follow consistent naming conventions.
- Avoid unnecessary code duplication.
- Keep sensitive configuration in environment variables.

## 10. Git & GitHub Repository Management

### 10.1 Repository Setup

- I will provide a newly created, empty GitHub repository URL before development begins.
- Connect the local project to the provided GitHub repository.
- Initialize Git if it has not already been initialized.
- Configure the repository's remote origin using the provided URL.
- Verify the remote connection before starting development.
- Use the provided repository as the primary source of truth for the project.

**Important:** Do not create a separate repository or replace the provided remote repository.

### 10.2 Stage-Based Development and Commits

Development must follow a structured, stage-based workflow.

After successfully completing each development stage:

1. Review the implemented changes.
2. Run relevant checks, such as linting, builds, or tests.
3. Fix any issues identified during verification.
4. Review the Git changes using `git status` and `git diff`.
5. Stage only the relevant files.
6. Create a Git commit using Conventional Commits.
7. Push the completed stage to the provided GitHub repository.

Do not combine multiple completed development stages into one large commit.

### 10.3 Conventional Commit Messages

All commit messages must follow the Conventional Commits specification.

Use the following format:

`<type>(<scope>): <description>`

Common commit types:

| Type | Purpose | Example |
|---|---|---|
| `feat` | Introduce a new feature | `feat(students): implement student creation` |
| `fix` | Fix a bug | `fix(api): handle duplicate student emails` |
| `refactor` | Improve code without changing functionality | `refactor(database): optimize connection handling` |
| `style` | UI or formatting changes without logic changes | `style(dashboard): improve student table layout` |
| `docs` | Documentation updates | `docs(readme): add installation instructions` |
| `test` | Add or update tests | `test(api): add student endpoint tests` |
| `chore` | Maintenance and configuration | `chore(config): configure eslint` |

Keep commit messages concise, descriptive, and meaningful.

### 10.4 Branch Management and Feature Experimentation

- Use the `main` branch for stable and completed project stages.
- If an experimental feature, optional functionality, or significant implementation change needs to be tested, create a separate branch.
- Use descriptive branch names, such as:
  - `feature/student-search`
  - `feature/department-filter`
  - `experiment/dashboard-ui`
  - `fix/student-validation`
- Never experiment directly on the `main` branch when the changes could affect existing functionality.
- Commit experimental changes separately.
- Test the feature before deciding whether to merge it into the main branch.
- If an experiment is unsuccessful, leave the main branch unaffected.
- Merge successful features into `main` only after verification.

### 10.5 Git Workflow Rules

- Never force-push to the repository.
- Never overwrite or discard existing user changes without permission.
- Never commit `.env`, credentials, API keys, or other sensitive information.
- Ensure `.gitignore` is properly configured.
- Keep the `main` branch in a working and stable state.
- Before pushing, verify the target branch and inspect the pending commits.
- If a Git operation fails, investigate and resolve the issue rather than silently skipping it.

### 10.6 Development Progress Tracking

After completing each stage, provide a brief progress report containing:

- Completed development stage.
- Features and files implemented.
- Tests and verification performed.
- Commit hash and commit message.
- Branch name.
- Push status.
- Any remaining issues or next steps.

**Important:** A stage is considered complete only after its implementation has been verified and its corresponding Git commit has been created. Do not claim a commit or push was successful unless Git confirms it.

## 10.7 Additional Features (Optional)

The following features are not mandatory but can improve the overall quality of the project:

- Search students by name or email.
- Filter students by department.
- Sort students alphabetically.
- Pagination for large student lists.
- Dashboard statistics (total students and department-wise student counts).
- Dark and light mode.
- Improved toast notifications.

Complete all mandatory CRUD functionality before implementing optional features.

## 11. Submission Requirements

Submit the completed project with the following:

1. Complete source code.
2. A working MongoDB database connection.
3. Fully functional CRUD operations.
4. Responsive and user-friendly UI.
5. A `.env.example` file containing the required environment variable names without actual credentials.
6. A `README.md` file containing:
   - Project overview.
   - Technology stack.
   - Installation instructions.
   - Environment variable configuration.
   - Instructions for running the application locally.
   - API endpoint documentation.

The project should run successfully without errors after following the README instructions.

## 12. Evaluation Criteria

The project will be evaluated based on the following criteria:

| Criteria | Evaluation |
|---|---|
| Next.js Implementation | Proper use of Next.js |
| Frontend Design | UI quality and responsiveness |
| Database Integration | Successful MongoDB and Mongoose integration |
| CRUD Functionality | Correct implementation of all four operations |
| API Development | Proper API structure and HTTP methods |
| Validation | Frontend and backend validation |
| Error Handling | Proper handling of errors and edge cases |
| Code Quality | Clean, organized, and maintainable code |
| Documentation | Complete and understandable README |

## 13. AI Assistance

**AI tools are permitted and encouraged throughout the development process.**

You may use AI coding assistants to:

- Understand technical concepts and requirements.
- Generate and improve code.
- Debug errors and troubleshoot issues.
- Review application architecture.
- Improve UI/UX design.
- Optimize code quality and performance.
- Understand API development and database integration.

However, you must understand the code you submit. Be prepared to explain the implementation, database structure, API endpoints, and how each CRUD operation works.

**The objective is not simply to generate an application using AI, but to learn and demonstrate practical full-stack development skills.**

---


## Final Objective

Build a fully functional, responsive, and maintainable **Student Management System** that demonstrates your ability to develop a complete full-stack application using Next.js, Tailwind CSS, MongoDB, and Mongoose.

The application must successfully perform Create, Read, Update, and Delete operations through API endpoints while maintaining proper data validation, error handling, and database management.