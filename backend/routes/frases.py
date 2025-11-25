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
        "created_at": datetime.utcnow(),
        "curtidas": 0,        # contador de curtidas
        "salvos": []  
    }
    resultado = frases_collection.insert_one(nova_frase)
    return {
    
    "frase": {
        "_id": str(resultado.inserted_id),
        "texto": frase.texto,
        "hashtags": frase.hashtags,
        "autor": frase.autor,
        "created_at": datetime.utcnow().isoformat(),
        "curtidas": 0,
        "salvos": []
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

# Curtir frase
@router.post("/frases/{frase_id}/curtir")
def curtir_frase(frase_id: str):
    frase = frases_collection.find_one({"_id": ObjectId(frase_id)})
    if not frase:
        return {"msg": "Frase não encontrada"}
    
    frases_collection.update_one(
        {"_id": ObjectId(frase_id)},
        {"$inc": {"curtidas": 1}}
    )
    return {"msg": "Frase curtida com sucesso"}

# Salvar frase
@router.post("/frases/{frase_id}/salvar")
def salvar_frase(frase_id: str, usuario: str):
    frase = frases_collection.find_one({"_id": ObjectId(frase_id)})
    if not frase:
        return {"msg": "Frase não encontrada"}
    
    if usuario in frase.get("salvos", []):
        frases_collection.update_one(
            {"_id": ObjectId(frase_id)},
            {"$pull": {"salvos": usuario}}
        )
        return {"msg": "Frase removida dos salvos"}
    else:
        frases_collection.update_one(
            {"_id": ObjectId(frase_id)},
            {"$push": {"salvos": usuario}}
        )
        return {"msg": "Frase salva com sucesso"}
