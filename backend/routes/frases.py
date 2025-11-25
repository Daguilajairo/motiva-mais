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

class CurtirRequest(BaseModel):
    usuario: str

# POST: criar frase
@router.post("/frases")
def criar_frase(frase: Frase):
    nova_frase = {
        "texto": frase.texto,
        "hashtags": frase.hashtags,
        "autor": frase.autor,
        "created_at": datetime.utcnow(),
        "curtidas": 0,
        "curtidoPor": []
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
            "curtidoPor": []
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
            "curtidoPor": f.get("curtidoPor", [])
        })
    return {"frases": frases}

# Curtir frase
@router.post("/frases/{frase_id}/curtir")
# MUDANÇA AQUI: Receber o objeto 'request' do tipo CurtirRequest
def curtir_frase(frase_id: str, request: CurtirRequest):
    # MUDANÇA AQUI: Acessar o nome de usuário através do objeto 'request'
    usuario = request.usuario
    
    frase = frases_collection.find_one({"_id": ObjectId(frase_id)})
    if not frase:
        # É uma boa prática retornar uma resposta HTTP de erro, não apenas um dicionário
        # mas mantendo seu padrão:
        return {"msg": "Frase não encontrada"}

    # O resto da lógica permanece o mesmo
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
    
    # Adicione os campos de texto, autor e hashtags para o Feed.jsx ter a frase completa.
    # O seu frontend (Feed.jsx) usa {...f, ...fraseAtualizada}, então só os campos
    # atualizados (curtidas, curtidoPor) são estritamente necessários, mas é bom
    # ter certeza de que o retorno é o que o frontend espera para a atualização.
    return {
        "_id": str(frase_atualizada["_id"]),
        "curtidas": frase_atualizada.get("curtidas", 0),
        "curtidoPor": frase_atualizada.get("curtidoPor", []),
        "texto": frase_atualizada.get("texto"),
        "hashtags": frase_atualizada.get("hashtags"),
        "autor": frase_atualizada.get("autor"),
        "created_at": frase_atualizada.get("created_at").isoformat() # Adicionando campos da frase original
    }