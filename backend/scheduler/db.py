from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME")
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
print(DB_NAME)

def get_interviewee_email(interviewee_id):
    try:
        interviewee = db.interviewee.find_one({"_id": ObjectId(interviewee_id)})
        return interviewee.get("email") if interviewee else None
    except Exception as e:
        print("Invalid ObjectId or query error:", e)
        return None

def add_interviewee(name: str, email: str):
    result = db.interviewee.insert_one({
        "name": name,
        "email": email,
        "status": "pending",
        "created_at": datetime.utcnow()
    })
    return str(result.inserted_id)
