# SkillPath AI - Backend Server

Agentic AI Career & Study Mentor Platform - Backend API

## Tech Stack
- Node.js + Express.js
- TypeScript
- MongoDB (Mongoose)
- Better Auth (Authentication + Google OAuth)
- Groq SDK (llama-3.3-70b-versatile)

## Features
- AI Chat Assistant with conversation history
- AI Smart Recommendation Engine
- Role-based access control (Student, Mentor, Admin)
- Resource management (CRUD)
- User management (Admin)

## Environment Variables
Create a `.env` file with:
PORT=5000
MONGODB_URI=your_mongodb_uri
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=your_backend_url
CLIENT_URL=your_frontend_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GROQ_API_KEY=your_groq_api_key
## Getting Started
```bash
npm install
npm run dev
```

## API Endpoints
- `/api/auth/*` - Authentication (Better Auth)
- `/api/chat` - AI Chat Assistant
- `/api/resources` - Resource management + AI Recommendations
- `/api/users` - User management (Admin only)