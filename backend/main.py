from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # <- serve arquivos estáticos
from routes import users, frases

app = FastAPI()

# === CONFIGURAÇÃO CORS ===
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://motiva-mais.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ============================

# Serve arquivos da pasta "uploads" como estáticos
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(users.router, prefix="/")
app.include_router(frases.router)

@app.get("/")
def home():
    return {"msg": "API Motiva+ rodando"}
