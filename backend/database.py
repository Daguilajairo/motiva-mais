from pymongo import MongoClient

MONGO_URI = "mongodb+srv://motiva_user:11010495@motiva0.javxud3.mongodb.net/?appName=motiva0"

client = MongoClient(MONGO_URI)
db = client.motiva
users_collection = db.users
frases_collection = db.frases  # nova coleção para frases
