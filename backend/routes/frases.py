from fastapi import APIRouter
from pydantic import BaseModel
from database import frases_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter()

# Schema de frase
class Frase(BaseModel):
    texto: str
    hashtags: list[str] = []
    autor: str

# POST: criar frase
@router.post("/frases")
def criar_frase(frase: Frase):
    nova_frase = {
        "texto": frase.texto,
        "hashtags": frase.hashtags,
        "autor": frase.autor,
        "created_at": datetime.utcnow()
    }
    resultado = frases_collection.insert_one(nova_frase)
    return {
    "msg": "Frase criada com sucesso",
    "frase": {
        "_id": str(resultado.inserted_id),
        "texto": frase.texto,
        "hashtags": frase.hashtags,
        "autor": frase.autor,
        "created_at": datetime.utcnow().isoformat()
    }
}

# GET: listar frases
@router.get("/frases")
def listar_frases():
    frases_cursor = frases_collection.find().sort("created_at", -1)  # mais recentes primeiro
    frases = []
    for f in frases_cursor:
        frases.append({
            "_id": str(f["_id"]),
            "texto": f["texto"],
            "hashtags": f["hashtags"],
            "autor": f["autor"],
            "created_at": f["created_at"].isoformat()
        })
    return {"frases": frases}
