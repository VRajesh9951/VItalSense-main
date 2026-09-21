# VitalSense — Intelligent Lab Report Analyzer & Lifestyle Coach

AI-powered health analysis platform (MERN + Gemini). Upload a blood test report (PDF/image), get structured biomarkers, RAG-grounded explanations, lifestyle recommendations, trend charts, and a doctor-ready summary.

## Stack
- **Frontend**: React + Vite, Recharts, lucide-react
- **Backend**: Node.js + Express
- **Database**: MongoDB (local or Atlas)
- **AI**: Google Gemini (`gemini-2.0-flash` for vision/text, `text-embedding-004` for embeddings)
- **Vector Store**: Local cosine-similarity search in MongoDB by default (`VECTOR_MODE=local`), or Pinecone if you add API keys (`VECTOR_MODE=pinecone`)

## 1. Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) — or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Gemini API key](https://aistudio.google.com/apikey) (free tier is fine)

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and paste your key:
```
GEMINI_API_KEY=your_actual_key_here
```

Bootstrap the RAG knowledge base (one-time — embeds `data/medical_knowledge.json` into the vector store):
```bash
npm run bootstrap
```

Start the server:
```bash
npm run dev
```

You should see `VitalSense backend running on http://localhost:5000`.

Sanity check everything is wired up correctly:
```bash
npm run test:backend
```

## 3. Frontend Setup

In a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` calls to the backend on port 5000.

## 4. Using the App

1. Go to **Profile** and fill in your age, gender, dietary preference, and any known conditions — this personalizes AI recommendations.
2. Go to **Upload Report**, drop in a PDF or photo of a blood test.
3. Gemini Vision extracts every biomarker into structured data; abnormal values are flagged automatically.
4. RAG retrieves grounded nutrition/medical context and generates plain-language explanations + lifestyle tips.
5. Upload a second report later to unlock **Health Trends** (line charts per biomarker over time).
6. Use **AI Coach** to ask free-form questions like *"What does low MCHC mean?"*

## 5. Switching to Pinecone later (optional)

1. Create a Pinecone index (dimension `768`, matching `text-embedding-004`).
2. In `backend/.env`, set:
   ```
   VECTOR_MODE=pinecone
   PINECONE_API_KEY=...
   PINECONE_ENVIRONMENT=...
   PINECONE_INDEX=vitalsense-knowledge
   ```
3. `npm install @pinecone-database/pinecone` inside `backend/`.
4. Re-run `npm run bootstrap` to populate Pinecone instead of Mongo.

No other code changes needed — `vectorStore.js` already branches on `VECTOR_MODE`.

## 6. Project Structure

```
backend/
  models/        Mongoose schemas (User, Report, KnowledgeVector)
  services/      geminiService (AI calls), vectorStore (RAG storage), ragService (orchestration)
  routes/        reports, user, chat, trends
  data/          medical_knowledge.json — seed data for RAG
  scripts/       bootstrap.js, testConnection.js
frontend/
  src/components/  Dashboard, UploadReport, Trends, AICoach, UserProfile, Sidebar
  src/api.js       Axios client for backend
```

## 7. Notes / Constraints (from project brief)
- Prototype scope is blood reports / biomarkers only.
- All AI output is wellness guidance, **not** a medical diagnosis or prescription — this is stated in the UI and baked into the AI prompts.
- Reports must be readable PDF/image documents.

## 8. Suggested extensions (if you want to go further for evaluation marks)
- **Email doctor summary**: `nodemailer` is already in `package.json` — add a `POST /api/reports/:id/email` route using `SMTP_*` env vars.
- **Supplement checker**: new RAG category in `medical_knowledge.json` + a route that cross-checks a supplement name against flagged biomarkers.
- **Auth**: swap the single mock `User` document for real login (e.g. JWT + bcrypt) when you're ready to support multiple users.
