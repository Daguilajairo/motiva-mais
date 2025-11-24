from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <- importar middleware
from routes import users
from routes import frases

app = FastAPI()

# === CONFIGURAÇÃO CORS ===
origins = [
    "http://localhost:5173",           # se estiver testando localmente (Vite padrão)
    "http://127.0.0.1:5173",           # se estiver testando localmente
    "https://motiva-mais.vercel.app"   # seu frontend online
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # quem pode acessar
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, PUT, DELETE...
    allow_headers=["*"],         # todos os headers
)
# ============================

app.include_router(users.router)
app.include_router(frases.router)

@app.get("/")
def home():
    return {"msg": "API Motiva+ rodando"}
