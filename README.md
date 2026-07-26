# EduConnect

EduConnect is a comprehensive virtual classroom and learning management system (LMS) clone designed to facilitate seamless online education. It provides an interactive environment for teachers and students to manage coursework, collaborate, and practice coding.

## 🚀 Key Features

*   **Virtual Classrooms**: Create and join classes, manage students, and organize educational materials.
*   **Assignments & Submissions**: Assign work, track deadlines, and review student submissions seamlessly.
*   **Integrated Code Playground**: Built-in online code editor (powered by Monaco Editor) with real-time compilation and execution support for **Java**, **Python**, and **C**. Includes custom standard input features!
*   **Task Management**: Kanban-style task manager for students to keep track of their personal assignments and goals.
*   **Communication & Collaboration**: Discussion forums (Posts), instant messaging, and interactive Polls.
*   **Announcements & Calendar**: Keep track of important dates, events, and class-wide announcements.
*   **AI Integrations**: Integrated with OpenAI for intelligent educational features and `pdf-parse` for document reading.
*   **Resource Sharing**: Upload and manage materials, videos, and products.

## 🛠️ Technology Stack

### Frontend (Client)
*   **Framework**: React 18 with Vite
*   **Styling & UI**: Material UI (MUI), Framer Motion, AOS (Animations)
*   **Code Editor**: `@monaco-editor/react`
*   **State & Data**: `axios`, `react-hook-form`, `yup`
*   **Visualizations & Utils**: `recharts`, `react-dnd` (Drag and Drop), `jwt-decode`

### Backend (Server)
*   **Runtime & Framework**: Node.js, Express.js
*   **Database**: MongoDB & Mongoose
*   **Authentication**: JSON Web Tokens (JWT), `bcrypt`
*   **File Uploads**: `multer`
*   **Integrations**: `openai` (AI API), `nodemailer` (Emails), `child_process` (Code execution)

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
*   Node.js installed (v16+ recommended)
*   MongoDB database (Local or MongoDB Atlas)
*   C/C++, Python, and Java Compilers installed on the host machine (if running the Code Playground locally)

## 📦 Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd EduConnect
   ```

2. **Setup the Server**:
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file in the `server` directory and configure the following variables:*
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_key (optional)
   # Add any email/smtp configurations for nodemailer if applicable
   ```
   *Start the backend server:*
   ```bash
   npm run dev 
   # or node index.js / npx nodemon index.js
   ```

3. **Setup the Client**:
   ```bash
   cd ../client
   npm install
   ```
   *Create a `.env` file in the `client` directory:*
   ```env
   VITE_SERVER_ENDPOINT=http://localhost:3000/api
   VITE_TOKEN_KEY=educonnect_auth_token
   ```
   *Start the frontend development server:*
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## 🛡️ License

This project is intended for educational purposes.
