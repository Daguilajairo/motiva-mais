# routes/users.py
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from database import users_collection
from jose import jwt
from datetime import datetime, timedelta
import os
import shutil

router = APIRouter()
SECRET_KEY = "minha_chave_secreta"

# URL base da API (alterar conforme deploy)
BASE_URL = "https://motiva-mais-3.onrender.com"

# Pasta de uploads
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# === Cadastro com foto opcional ===
@router.post("/registrar")
async def registrar(
    nome: str = Form(...),
    senha: str = Form(...),
    file: UploadFile = File(None)  # foto opcional
):
    # Verifica se usuário já existe
    if users_collection.find_one({"nome": nome}):
        raise HTTPException(status_code=400, detail="Usuário já existe")

    usuario_dict = {"nome": nome, "senha": senha}

    # Se enviou arquivo, salva a foto
    if file and file.content_type.startswith("image/"):
        caminho = os.path.join(UPLOAD_DIR, f"{nome}_{file.filename}")
        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        usuario_dict["foto"] = f"{BASE_URL}/{caminho}"
    else:
        # Foto padrão
        usuario_dict["foto"] = f"{BASE_URL}/img/icon-avatar.png"

    result = users_collection.insert_one(usuario_dict)

    return {
        "msg": "Usuário criado com sucesso",
        "id": str(result.inserted_id),
        "foto": usuario_dict["foto"]
    }

# === Login ===
@router.post("/login")
def login(nome: str = Form(...), senha: str = Form(...)):
    usuario = users_collection.find_one({"nome": nome, "senha": senha})
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")

    payload = {
        "user_id": str(usuario["_id"]),
        "exp": datetime.utcnow() + timedelta(hours=1)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")

    foto_url = usuario.get("foto", f"{BASE_URL}/img/icon-avatar.png")

    return {"msg": "Login realizado com sucesso", "token": token, "foto": foto_url}

# === Upload de foto ===
@router.post("/usuarios/{usuario_nome}/upload-foto")
async def upload_foto(usuario_nome: str, file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo precisa ser uma imagem")

    caminho = os.path.join(UPLOAD_DIR, f"{usuario_nome}_{file.filename}")
    with open(caminho, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    foto_url = f"{BASE_URL}/{caminho}"

    users_collection.update_one(
        {"nome": usuario_nome},
        {"$set": {"foto": foto_url}}
    )

    return JSONResponse(content={"msg": "Foto enviada com sucesso", "foto_url": foto_url})
