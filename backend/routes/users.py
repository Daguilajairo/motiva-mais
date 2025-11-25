# routes/users.py
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from database import users_collection
from jose import jwt
from datetime import datetime, timedelta
import os
import shutil

router = APIRouter()
SECRET_KEY = "minha_chave_secreta"

# Diretório onde as fotos serão salvas
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Modelo para receber os dados do usuário
class UserCreate(BaseModel):
    nome: str
    senha: str

# Rota de teste
@router.get("/teste-usuario")
def teste_usuario():
    return {"msg": "Rota de usuário funcionando", "usuarios": users_collection.count_documents({})}

# Rota de cadastro
@router.post("/registrar")
def registrar(user: UserCreate):
    result = users_collection.insert_one(user.dict())
    return {"msg": "Usuário criado com sucesso", "id": str(result.inserted_id)}

# Rota de login
@router.post("/login")
def login(user: UserCreate):
    usuario = users_collection.find_one({"nome": user.nome, "senha": user.senha})
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")
    
    payload = {
        "user_id": str(usuario["_id"]),
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")

    return {"msg": "Login realizado com sucesso", "token": token}

# === NOVA ROTA: UPLOAD DE FOTO ===
@router.post("/usuarios/{usuario_nome}/upload-foto")
async def upload_foto(usuario_nome: str, file: UploadFile = File(...)):
    # Verifica se o arquivo é imagem
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo precisa ser uma imagem")
    
    # Gera caminho único
    caminho = os.path.join(UPLOAD_DIR, f"{usuario_nome}_{file.filename}")
    
    # Salva a foto no servidor
    with open(caminho, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Salva o caminho da foto no Mongo
    users_collection.update_one(
        {"nome": usuario_nome},
        {"$set": {"foto": f"/{caminho}"}}
    )
    
    return JSONResponse(content={"msg": "Foto enviada com sucesso", "foto_url": f"/{caminho}"})
