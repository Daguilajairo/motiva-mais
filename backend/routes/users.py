from fastapi import APIRouter, HTTPException, Form
from database import users_collection
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()
SECRET_KEY = "minha_chave_secreta"

# URL base da API
BASE_URL = "https://motiva-mais-3.onrender.com"

# === Cadastro ===
@router.post("/registrar")
async def registrar(
    nome: str = Form(...),
    senha: str = Form(...)
):
    if users_collection.find_one({"nome": nome}):
        raise HTTPException(status_code=400, detail="Usuário já existe")

    usuario_dict = {"nome": nome, "senha": senha, "foto": f"{BASE_URL}/img/icon-avatar.png"}
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
