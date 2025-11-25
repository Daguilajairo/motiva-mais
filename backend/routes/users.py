from fastapi import APIRouter, HTTPException, Form
from database import users_collection
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()
SECRET_KEY = "minha_chave_secreta"
BASE_URL = "https://motiva-mais-3.onrender.com"

# Cadastro
@router.post("/registrar")
async def registrar(
    nome_perfil: str = Form(...),
    login: str = Form(...),
    senha: str = Form(...)
):
    if users_collection.find_one({"login": login}):
        raise HTTPException(status_code=400, detail="Login já existe")

    usuario_dict = {
        "nome_perfil": nome_perfil,
        "login": login,
        "senha": senha,
        "foto": f"{BASE_URL}/img/icon-avatar.png"
    }

    result = users_collection.insert_one(usuario_dict)

    return {
        "msg": "Usuário criado com sucesso",
        "id": str(result.inserted_id),
        "foto": usuario_dict["foto"]
    }


# Login
@router.post("/login")
def login(
    login: str = Form(...),
    senha: str = Form(...)
):
    usuario = users_collection.find_one({"login": login, "senha": senha})

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

    return {
        "msg": "Login realizado com sucesso",
        "token": token,
        "foto": foto_url,
        "nome_perfil": usuario.get("nome_perfil")
    }
