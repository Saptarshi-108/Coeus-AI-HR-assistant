from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

# Database: Policy-bot
db = client["Policy-bot"]

# Collection: uploads
uploads = db["uploads"]
