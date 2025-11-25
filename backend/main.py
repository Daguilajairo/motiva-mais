from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import shutil

from routes import users
from routes import frases

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

app.include_router(users.router, prefix="/")
app.include_router(frases.router)

@app.get("/")
def home():
    return {"msg": "API Motiva+ rodando"}

# === UPLOAD DE FOTO ===
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/usuarios/{usuario_nome}/upload-foto")
async def upload_foto(usuario_nome: str, file: UploadFile = File(...)):
    # Verifica se é imagem
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo precisa ser uma imagem")
    
    # Gera caminho único
    caminho = os.path.join(UPLOAD_DIR, f"{usuario_nome}_{file.filename}")
    
    # Salva no servidor
    with open(caminho, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Retorna o caminho para salvar no Mongo
    return JSONResponse(content={"foto_url": f"/{caminho}"})
