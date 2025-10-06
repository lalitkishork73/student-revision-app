dev:
	cd frontend && npm run dev &
	cd backend-node && npm run dev &
	cd backend-python && uvicorn app.main:app --reload --port 8000 &
	wait
