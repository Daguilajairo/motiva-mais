# routes/users.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import users_collection
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()  # <---- isso estava faltando

SECRET_KEY = "minha_chave_secreta"

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
    return {"msg": "Login realizado com sucesso", "token": token}
