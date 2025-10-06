#!/bin/bash
cd frontend && npm run dev &
cd backend-node && npm run dev &
cd backend-python && .\venv\Scripts\activate && uvicorn app.main:app --reload --port 8000 &
wait
