# Student Revision App

A fully functional, responsive web app for school students to **revise coursebooks** using PDFs, quizzes, and **AI-powered chat assistance**.

---

## 🚀 Features

### Must-Have

- 📂 Upload or select PDFs (seeded with NCERT Class XI Physics for testing)  
- 📝 PDF viewer with side-by-side **chat & quiz generation**  
- ❓ Quiz generator (MCQs, SAQs, LAQs)  
- 📊 User progress tracking via a mini-dashboard  

### Nice-to-Have

- 💬 Chat UI inspired by ChatGPT  
- 🔍 **RAG-based answers** with citations from PDFs  
- 🎥 YouTube video recommendations based on PDF content  

---

## 🛠️ Tech Stack

**Frontend**

- React 19 + Vite  
- TypeScript, TailwindCSS  
- Zustand (state management)  
- pdf.js & react-pdf  
- Radix UI components  

**Backend**

- Node.js + Express  
- MongoDB (Mongoose)  
- OpenAI API, LlamaIndex, Weaviate  
- PDF parsing via `pdf-parse`  
- Pinecone for vector embeddings  
- Cloudflare R2 for file uploads & storage  

---

## 📂 Project Structure

```
/frontend       # React frontend
/backend-node   # Node.js backend
```

---

## ⚙️ Setup & Run (Local)

### 1. Clone the repo

```bash
git clone <repo_url>
cd <repo_root>
```

### 2. Add `.env` files  

**Frontend `.env`**  

```env

VITE_API_BASE_URL=<Backend Api public URL>
```

**Backend `.env`**  

```env
MONGO_URI=<your MongoDB URI>
OPENAI_API_KEY=<your OpenAI key>
WEAVIATE_CLUSTER_URL=<your Weaviate URL>
WEAVIATE_API_KEY=<your Weaviate API key>
LLAMA_CLOUD_API_KEY=<your Llama Cloud key>
LLAMA_CLOUD_BASE_URL=<your Llama Cloud base URL>
CF_ACCOUNT_ID=<Cloudflare account id>
CF_ACCESS_KEY_ID=<Cloudflare access key id>
CF_SECRET_ACCESS_KEY=<Cloudflare secret key>
CF_BUCKET_NAME=<Cloudflare bucket>
CF_PUBLIC_URL=<Cloudflare public URL>
```

---

### 3. Install dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend-node
npm install
```

---

### 4. Run the apps

```bash
# Backend (default: http://localhost:5000)
cd backend-node
npm run dev

# Frontend (default: http://localhost:5173)
cd frontend
npm run dev
```

---

### 5. Testing

Login with seeded credentials:  

```json
{
  "email": "subhas1@mail.com",
  "password": "12345"
}
```

- Upload or pick seeded PDFs  
- Use chat & quiz for each PDF  
- Check dashboard for progress  
- On small screens, use floating button to access PDF list drawer  

---

## 🤖 Why LLMs?

We used **LLM tools (OpenAI + Llama Cloud)** for:  

- Generating **context-aware quizzes** from PDFs  
- Powering **AI chat assistance**  
- Building **RAG-based answers** with citations  
- Experimenting with AI-driven recommendations (e.g., YouTube videos)  

These tools make the app **more interactive, personalized, and useful for students**, turning static PDFs into a dynamic learning experience.  

---

## 📝 Notes

- Frontend is **fully responsive** (separate vertical scrolls for PDF list, chat, PDF viewer).  
- Some features (e.g., YouTube recommendations UI) are present but **not fully styled**.  
- Commits are structured to show step-by-step progress.  

---

## 🤝 Contribution

This is a submission project, code ownership belongs to the author.  
