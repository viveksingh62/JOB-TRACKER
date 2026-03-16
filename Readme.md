# HireIQ — AI-Powered Job Application Tracker

A full-stack web application that analyzes your resume against job descriptions using AI, scores your match, identifies missing keywords, and tracks all your job applications in one place.

**Live Demo:** [hireiq-ai.vercel.app](https://hireiq-ai.vercel.app)  
**Backend API:** [hireiq-backend.onrender.com](https://hireiq-backend.onrender.com)

---

## Features

- **AI Resume Matching** — Upload your resume PDF and paste a job description to get an instant match score powered by Groq AI
- **Keyword Analysis** — See exactly which keywords you have and which ones are missing from your resume
- **Smart Suggestions** — Get actionable tips to improve your resume for each specific job
- **Application Dashboard** — Track all your applications with status updates (Applied, Interview, Rejected, Offer)
- **Resume Caching** — Same resume parsed only once, results cached in MongoDB for faster repeat analysis
- **Rate Limiting** — Per-IP and global rate limiting to protect API usage
- **Drag & Drop Upload** — Clean PDF upload with drag and drop support
- **Animated UI** — Smooth micro-animations on all interactions using Framer Motion

---

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS v4
- Framer Motion (animations)
- React Router DOM (routing)
- Axios (API calls)
- React Circular Progressbar
- React Dropzone

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Groq AI API (llama-3.3-70b-versatile)
- pdf2json (PDF text extraction)
- Multer (file uploads)
- express-rate-limit

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
MONGODB_URI=your_mongodb_atlas_uri
GROQ_API_KEY=your_groq_api_key
PORT=8080
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
```

Create a `.env` file in the frontend folder:

```
VITE_API_URL=http://localhost:8080/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`

---

## Project Structure

```
job-tracker/
├── backend/
│   ├── models/
│   │   └── Application.js       # MongoDB schema
│   ├── routes/
│   │   ├── analyze.js           # POST /api/analyze
│   │   └── applications.js      # GET/PATCH/DELETE /api/applications
│   ├── services/
│   │   ├── pdfParser.js         # Extract text from PDF
│   │   └── groq.js              # Groq AI analysis
│   ├── middleware/
│   │   └── rateLimiter.js       # Rate limiting
│   └── index.js                 # Express server entry
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Landing.jsx       # Landing page
        │   ├── Analyze.jsx       # Resume analyzer
        │   └── Dashboard.jsx     # Applications dashboard
        ├── components/
        │   └── Sidebar.jsx       # Sidebar navigation
        └── services/
            └── api.js            # Axios API calls
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Upload resume PDF + job description, returns AI analysis |
| GET | `/api/applications` | Get all saved applications |
| PATCH | `/api/applications/:id` | Update application status |
| DELETE | `/api/applications/:id` | Delete an application |

---

## How It Works

1. User uploads their resume PDF and pastes a job description
2. Backend extracts text from the PDF using pdf2json
3. Both texts are sent to Groq AI (Llama 3.3 70B) with a structured prompt
4. AI returns a match score (0-100), matched keywords, missing keywords, and suggestions
5. Results are saved to MongoDB and displayed on the dashboard
6. User can update application status as they progress through the hiring process

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GROQ_API_KEY` | Groq API key from console.groq.com |
| `PORT` | Server port (default 8080) |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## Author

**Vivek Singh**  
B.E. Computer Science (AI/ML) — Lokmanya Tilak College of Engineering, Mumbai  
[LinkedIn](https://linkedin.com/in/viveksingh66p) · [GitHub](https://github.com/viveksingh62)

