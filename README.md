# student-revision-appSchool Revision App

A fully functional, responsive web app for school students to revise their coursebooks with PDFs, quizzes, and AI-powered chat assistance.

Features

Must-Have

Upload or select PDFs (NCERT Class XI Physics seeded for testing)

PDF Viewer alongside chat/quiz

Quiz Generator (MCQs, SAQs, LAQs)

Tracks user progress with a mini-dashboard

Nice-to-Have

Chat UI (ChatGPT-inspired)

RAG-based answers with citations from PDFs

YouTube video recommendations based on PDF content

Tech Stack

Frontend

React 19 + Vite

TypeScript

TailwindCSS

Zustand for state management

pdf.js & react-pdf

Radix UI components

Backend

Node.js + Express

MongoDB (Mongoose)

OpenAI API, LlamaIndex, Weaviate

PDF parsing with pdf-parse

Pinecone for vector embeddings

File uploads & storage with Cloudflare R2

Project Structure
/frontend       # React frontend
/backend-node   # Node.js backend

Setup & Run (Local)

1. Clone the repository
git clone <repo_url>
cd <repo_root>

2. Create .env files

Frontend (.env)

VITE_MONGO_URI=<your MongoDB URI>
VITE_OPENAI_API_KEY=<your OpenAI key>
VITE_WEAVIATE_CLUSTER_URL=<your Weaviate URL>
VITE_WEAVIATE_API_KEY=<your Weaviate API key>
VITE_LLAMA_CLOUD_API_KEY=<your Llama Cloud key>
VITE_LLAMA_CLOUD_BASE_URL=<your Llama Cloud base URL>
VITE_CF_ACCOUNT_ID=<Cloudflare account id>
VITE_CF_ACCESS_KEY_ID=<Cloudflare access key id>
VITE_CF_SECRET_ACCESS_KEY=<Cloudflare secret key>
VITE_CF_BUCKET_NAME=<Cloudflare bucket>
VITE_CF_PUBLIC_URL=<Cloudflare public URL>

Backend (.env)

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

Note: Replace credentials with your own if testing locally.



3. Install dependencies

Frontend

cd frontend
npm install

Backend

cd backend-node
npm install

4. Run the apps

Backend

cd backend-node
npm run dev

Frontend

cd frontend
npm run dev

Frontend will run at <http://localhost:5173> by default. Backend at <http://localhost:5000> (or your configured port).

5. Testing

use Password to Login :{
    "email": "<subhas1@mail.com>",
    "password": "12345"
}

Upload PDFs or select seeded PDFs

Open chat for each PDF

Generate quizzes and check dashboard for progress

On small screens, PDF list drawer is available via floating button

Notes

Used LLMs (OpenAI + Llama Cloud) for chat, quiz generation, and RAG-based answers.

Frontend is fully responsive; separate vertical scrolls for PDF list, chat, and PDF viewer.

Some features like YouTube video recommendations UI are present but not fully styled.

Git Commits & Version Control

Commits are verifiable to track project progress step-by-step.

Contribution

This is a submission assignment project; code is owned by the author.
