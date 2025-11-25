from fastapi import APIRouter, HTTPException, Form, Depends, Header, Request
from database import users_collection
from jose import jwt
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()
SECRET_KEY = "minha_chave_secreta"
BASE_URL = "https://motiva-mais-3.onrender.com"

# ===============================
# Cadastro de usuário
# ===============================
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
        "login": login.lower(),  # garante minúsculas
        "senha": senha,
        "foto": f"{BASE_URL}/img/icon-avatar.png"
    }

    result = users_collection.insert_one(usuario_dict)

    return {
        "msg": "Usuário criado com sucesso",
        "id": str(result.inserted_id),
        "foto": usuario_dict["foto"]
    }

# ===============================
# Login de usuário
# ===============================
@router.post("/login")
def login(
    login: str = Form(...),
    senha: str = Form(...)
):
    usuario = users_collection.find_one({"login": login.lower(), "senha": senha})

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

# ===============================
# Alterar senha
# ===============================
@router.post("/alterar-senha")
async def alterar_senha(
    request: Request,
    authorization: str = Header(...)
):
    # ===== Verifica token JWT =====
    try:
        token = authorization.split(" ")[1]  # Bearer <token>
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        current_user = users_collection.find_one({"_id": ObjectId(payload["user_id"])})
        if not current_user:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    # ===== Recebe dados do frontend =====
    data = await request.json()
    senha_atual = data.get("senha_atual")
    nova_senha = data.get("nova_senha")

    if not senha_atual or not nova_senha:
        raise HTTPException(status_code=400, detail="Preencha todos os campos")

    # ===== Verifica senha atual =====
    if senha_atual != current_user["senha"]:
        raise HTTPException(status_code=400, detail="Senha atual incorreta")

    # ===== Atualiza nova senha no banco =====
    users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"senha": nova_senha}}
    )

    return {"msg": "Senha alterada com sucesso"}
