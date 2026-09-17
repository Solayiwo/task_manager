# Task Manager

A small task management application with a React/Vite frontend, an Express API, and a MySQL database.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, Axios
- Backend: Node.js, Express, MySQL2
- Database: MySQL

## Prerequisites

Install the following before running the application:

- Node.js 18 or later with npm
- MySQL 8 or later
- MySQL Workbench

## Clone the Repository

Clone the project from GitHub to your local computer:

```bash
git clone https://github.com/Solayiwo/task_manager.git
cd <repository-name>
```

On Windows, you can run these commands in gitbash, PowerShell, Command Prompt, or the VS Code terminal. After cloning, continue with the database setup, configuration, and dependency installation steps below.

## Project Structure

```text
backend/    Express API and MySQL connection
frontend/   React/Vite application
```

## Database Setup

1. Start the MySQL server.
2. Open MySQL Workbench and connect to your local MySQL server.
3. Open `backend/db/schema.sql` in MySQL Workbench.
4. Execute the complete script using the lightning-bolt button or `Ctrl+Enter`.
5. Refresh the **Schemas** panel. You should see the `task_db` database and its `tasks` table.

The schema creates a database named `task_db` and a `tasks` table. The database user must have permission to create the database and tables, or the database can be created manually first.

## Configuration

Create `backend/.env` with the database connection and API port:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_db
```

Create `frontend/.env` with the backend API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Do not commit real passwords or other secrets. The frontend variable is read by Vite at build time, so restart the frontend dev server after changing it.

## Installation

Install dependencies in both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Running Locally

Run the backend and frontend in separate terminals.

Backend:

```bash
cd backend
npm run dev
```

The API runs at [http://localhost:5000](http://localhost:5000), with task endpoints under `/api/tasks`.

Frontend:

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite, normally [http://localhost:5173](http://localhost:5173).



The backend can be started without nodemon with `npm run start` or `node server.js`.

## Available Task Operations

The application supports:

- Creating, viewing, updating, and deleting tasks
- Searching and filtering by task status
- Sorting by due date or creation date
- Tracking pending, in-progress, and completed tasks

The API validates required titles and descriptions, limits descriptions to 2,000 characters, accepts only the three supported statuses, and requires due dates in `YYYY-MM-DD` format on or after the current date. On update, the due date must also remain on or after both the current date and the task's creation date.

## Error Page Handling

The frontend uses [`NotFound.jsx`](frontend/src/pages/NotFound.jsx) as React Router's route error page. It displays a 404 message when a requested page does not exist or a route cannot be resolved, and provides a **Back to Home** link so the user can return to the task dashboard.

The page is registered as the router's `errorElement` in [`App.jsx`](frontend/src/App.jsx) and is exported through [`pages/index.js`](frontend/src/pages/index.js).

## Data Fetching and CRUD Flow

The frontend communicates with the backend through the `/api/tasks` endpoints:

- **Initial load:** `GET /api/tasks` retrieves all tasks when the dashboard opens.
- **Create:** `POST /api/tasks` creates a task, then the frontend fetches the task list again to show the saved record.
- **View:** The selected task is displayed from the task data already loaded in frontend state, so no additional request is required.
- **Edit:** `PUT /api/tasks/:id` updates the task, updates the selected task, and refreshes the task list from the database.
- **Delete:** `DELETE /api/tasks/:id` removes the task, then refreshes the task list.

Refreshing after create, edit, and delete keeps the dashboard synchronized with the database and ensures the UI displays the server's saved values.

## Assumptions and Notable Decisions

- The application is intended for local development and does not include authentication or user-specific task ownership.
- MySQL is the source of truth; the frontend refreshes task data after create, update, and delete operations.
- Completed tasks are treated as finalized: the UI does not expose edit controls for them, and the API rejects update requests for them. They can still be viewed or deleted.
- The backend normalizes date values to `YYYY-MM-DD` before returning them to the frontend.
- CORS is enabled for local frontend/backend development.


## Troubleshooting

- **Database connection error:** Confirm MySQL is running and that `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` match the local database.
- **Frontend cannot load tasks:** Confirm the backend is running on port 5000 and that `VITE_API_BASE_URL` ends with `/api`.
- **Schema import fails:** Check that the MySQL user has permission to create `task_db`, or create the database manually and rerun the table portion of the schema.
