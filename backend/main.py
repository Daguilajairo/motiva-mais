from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import users, frases
import os

app = FastAPI()

# ===== Configuração CORS =====
origins = ["*"]  # Para testes, permite qualquer origem
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Pastas de arquivos estáticos =====
STATIC_DIRS = ["uploads", "img"]
for directory in STATIC_DIRS:
    os.makedirs(directory, exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/img", StaticFiles(directory="img"), name="img")

# ===== Rotas =====
app.include_router(users.router, prefix="")
app.include_router(frases.router)

@app.get("/")
def home():
    return {"msg": "API Motiva+ rodando"}
