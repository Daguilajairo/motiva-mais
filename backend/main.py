from fastapi import FastAPI
from routes import users  # suas rotas de usuário
from routes import frases  # a nova rota de frases

app = FastAPI()

app.include_router(users.router)
app.include_router(frases.router)

@app.get("/")
def home():
    return {"msg": "API Motiva+ rodando"}
