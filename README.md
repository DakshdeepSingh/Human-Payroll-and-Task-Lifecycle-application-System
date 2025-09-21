# Human Payroll and Task Lifecycle Application System

This is a Node.js and Express-based web application for managing employee payroll, attendance, leave requests, tasks, and support requests. It features admin and employee dashboards, authentication, and session management.

## Admin Login Credentials

**Admin Email:** admin@hrsuite.com  
**Admin Password:** password@12

## Features
- Leave request and approval system
- Task assignment and tracking
- Payroll management
- Attendance tracking
- Support request submission
- EJS templating for views
- Session-based authentication

## Project Structure
```
index.js
package.json
config/
controllers/
middlewares/
models/
uploads/
views/
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm
- MongoDB (local or cloud)

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd Human-Payroll-and-Task-Lifecycle-application-System
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure your MongoDB connection in `middlewares/dB.js` and set any required environment variables.

### Running Locally
```sh
node index.js
```
The server will start at `http://localhost:8000`.

### Deployment
For deployment on platforms like Vercel, you may need to adapt the code to use serverless functions. Vercel does not support long-running servers (`app.listen`).

## Environment Variables
- `NODE_ENV`: Set to `production` for secure cookies
- MongoDB connection string (see `middlewares/dB.js`)
