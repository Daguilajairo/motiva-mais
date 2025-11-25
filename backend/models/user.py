from pydantic import BaseModel

class UserCreate(BaseModel):
    nome_perfil: str
    login: str
    senha: str
