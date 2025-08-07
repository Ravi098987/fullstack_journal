# 🎯 Diary & Music Web App

A full-stack web application that combines diary management with music streaming to create a personalized self-care experience.

---

## 📁 Project Structure

project/
├── server/ # Backend API (Node.js + Express)
│ ├── middleware/ # Middleware for auth and other logic
│ │ ├── auth.cjs
│ ├── models/ # Mongoose schemas
│ │ ├── DiaryEntry.cjs
│ │ ├── User.cjs
│ ├── routes/ # Express route handlers
│ │ ├── auth.cjs
│ │ ├── diary.cjs
│ │ ├── music.cjs
│ │ └── index.cjs # Entry point (server)
├── src/ # Frontend (Vite + React)
│ └── ... # Your React components/pages
├── .env # Environment variables
├── .env.example # Sample env file
├── index.html # Frontend entry HTML
├── package.json # Project dependencies
├── tailwind.config.js # Tailwind CSS config
├── vite.config.ts # Vite config (TypeScript)

yaml

---

## 🚀 Features

- ✅ JWT-based Authentication
- 📓 Create, view, and manage personal diary entries
- 🎶 Stream music to enhance journaling experience
- 🌐 CORS enabled for frontend-backend integration
- 🧾 MongoDB for database (Atlas or Local)

---

## 🧪 Tech Stack

| Frontend      | Backend          | Database     | Styling       |
|---------------|------------------|--------------|----------------|
| React + Vite  | Node.js + Express| MongoDB      | Tailwind CSS   |

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/project-bolt.git
cd project-bolt

2. Install Dependencies

npm install          # for backend
cd src && npm install  # for frontend if separate package.json exists

3. Setup Environment Variables

Create a .env file in the root with the following variables:

env

PORT=5000
MONGODB_URI=your-mongodb-uri
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key
(Refer to .env.example)

4. Run the App

# From root directory

# Start the backend
cd server
node index.cjs

# In another terminal, start the frontend
cd src
npm run dev
🔗 API Endpoints

Auth

POST    /api/auth/register
POST    /api/auth/login
GET     /api/auth/profile

Diary

GET     /api/diary/
POST    /api/diary/create
PUT     /api/diary/update/:id
DELETE  /api/diary/delete/:id

Music

sql

GET     /api/music/search?query=your_song
