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

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Rota de cadastro com foto opcional
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
        usuario_dict["foto"] = f"/{caminho}"
    else:
        usuario_dict["foto"] = "/img/icon-avatar.png"

    result = users_collection.insert_one(usuario_dict)

    return {"msg": "Usuário criado com sucesso", "id": str(result.inserted_id), "foto": usuario_dict["foto"]}

# Rota de login
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

    foto_url = usuario.get("foto", "/img/icon-avatar.png")

    return {"msg": "Login realizado com sucesso", "token": token, "foto": foto_url}
