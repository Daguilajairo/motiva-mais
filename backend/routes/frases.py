from fastapi import APIRouter, Body
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
        "curtidas": 0,
        "curtidoPor": [],
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
            "curtidoPor": [],
            "salvos": []
        }
    }

# GET: listar frases
@router.get("/frases")
def listar_frases():
    frases_cursor = frases_collection.find().sort("created_at", -1)
    frases = []
    for f in frases_cursor:
        frases.append({
            "_id": str(f["_id"]),
            "texto": f["texto"],
            "hashtags": f["hashtags"],
            "autor": f["autor"],
            "created_at": f["created_at"].isoformat(),
            "curtidas": f.get("curtidas", 0),
            "curtidoPor": f.get("curtidoPor", []),
            "salvos": f.get("salvos", [])
        })
    return {"frases": frases}

# Curtir frase
@router.post("/frases/{frase_id}/curtir")
def curtir_frase(frase_id: str, usuario: str = Body(...)):
    frase = frases_collection.find_one({"_id": ObjectId(frase_id)})
    if not frase:
        return {"msg": "Frase não encontrada"}

    if usuario in frase.get("curtidoPor", []):
        frases_collection.update_one(
            {"_id": ObjectId(frase_id)},
            {"$pull": {"curtidoPor": usuario}, "$inc": {"curtidas": -1}}
        )
    else:
        frases_collection.update_one(
            {"_id": ObjectId(frase_id)},
            {"$push": {"curtidoPor": usuario}, "$inc": {"curtidas": 1}}
        )

    frase_atualizada = frases_collection.find_one({"_id": ObjectId(frase_id)})
    return {
        "_id": str(frase_atualizada["_id"]),
        "curtidas": frase_atualizada.get("curtidas", 0),
        "curtidoPor": frase_atualizada.get("curtidoPor", [])
    }

# Salvar frase
@router.post("/frases/{frase_id}/salvar")
def salvar_frase(frase_id: str, usuario: str = Body(...)):
    frase = frases_collection.find_one({"_id": ObjectId(frase_id)})
    if not frase:
        return {"msg": "Frase não encontrada"}

    if usuario in frase.get("salvos", []):
        frases_collection.update_one(
            {"_id": ObjectId(frase_id)},
            {"$pull": {"salvos": usuario}}
        )
    else:
        frases_collection.update_one(
            {"_id": ObjectId(frase_id)},
            {"$push": {"salvos": usuario}}
        )

    frase_atualizada = frases_collection.find_one({"_id": ObjectId(frase_id)})
    return {
        "_id": str(frase_atualizada["_id"]),
        "salvos": frase_atualizada.get("salvos", [])
    }

# GET: listar frases salvas de um usuário
@router.get("/salvos/{usuario}")
def listar_frases_salvas(usuario: str):
    frases_cursor = frases_collection.find({"salvos": usuario}).sort("created_at", -1)
    frases = []
    for f in frases_cursor:
        frases.append({
            "_id": str(f["_id"]),
            "texto": f["texto"],
            "hashtags": f["hashtags"],
            "autor": f["autor"],
            "created_at": f["created_at"].isoformat(),
            "curtidas": f.get("curtidas", 0),
            "curtidoPor": f.get("curtidoPor", []),
            "salvos": f.get("salvos", [])
        })
    return {"frases": frases}
