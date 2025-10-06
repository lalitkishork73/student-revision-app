from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Backend-Python: Hello World 🌟"}


@app.get("/test")
async def test():
    return {"service": "backend-python", "message": "Hello from Python 👋"}