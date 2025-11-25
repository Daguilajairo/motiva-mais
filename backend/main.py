from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import users, frases
import os # Importe o módulo os

app = FastAPI()

# ... (Configuração CORS - não muda) ...

# Adicione esta lógica ANTES de app.mount para criar os diretórios se eles não existirem
# A pasta uploads é crucial para uploads de arquivos, mas se for apenas para o exemplo,
# podemos garantir que ela exista.

STATIC_DIRS = ["uploads", "img"]

for directory in STATIC_DIRS:
    # Cria o diretório se ele não existir
    if not os.path.isdir(directory):
        os.makedirs(directory, exist_ok=True) # use exist_ok=True para evitar erros se já existir


# Serve arquivos estáticos (uploads, imagens padrão)
# Agora estas chamadas não falharão mais
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/img", StaticFiles(directory="img"), name="img")

app.include_router(users.router, prefix="/")
app.include_router(frases.router)

@app.get("/")
def home():
    return {"msg": "API Motiva+ rodando"}