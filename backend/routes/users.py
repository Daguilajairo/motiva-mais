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

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UserCreate(BaseModel):
    nome: str
    senha: str

@router.post("/registrar")
def registrar(user: UserCreate):
    result = users_collection.insert_one(user.dict())
    return {"msg": "Usuário criado com sucesso", "id": str(result.inserted_id)}

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

    # Retorna também a URL da foto caso exista
    foto_url = usuario.get("foto", "/img/icon-avatar.png")

    return {"msg": "Login realizado com sucesso", "token": token, "foto": foto_url}

# === UPLOAD DE FOTO ===
@router.post("/usuarios/{usuario_nome}/upload-foto")
async def upload_foto(usuario_nome: str, file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo precisa ser uma imagem")
    
    caminho = os.path.join(UPLOAD_DIR, f"{usuario_nome}_{file.filename}")
    
    with open(caminho, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    users_collection.update_one(
        {"nome": usuario_nome},
        {"$set": {"foto": f"/{caminho}"}}
    )
    
    return JSONResponse(content={"msg": "Foto enviada com sucesso", "foto_url": f"/{caminho}"})
