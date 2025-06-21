from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from db import uploads
import os, tempfile, shutil, uuid
from document_loader import load_policy_text, split_text
from gemini_client import get_embedding
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "storage"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload-policy")
async def upload_policy(company_name: str, file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    token = uuid.uuid4().hex[:8]  # e.g., "c8d0e2a1"

    folder = os.path.join(UPLOAD_FOLDER, company_name.replace(" ", "_").lower())
    os.makedirs(folder, exist_ok=True)
    pdf_path = os.path.join(folder, file.filename)

    with open(pdf_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Extract & embed
    full_text = load_policy_text(pdf_path)
    chunks = split_text(full_text)
    embeddings = [get_embedding(chunk) for chunk in chunks]

    uploads.insert_one({
        "company_name": company_name,
        "token": token,
        "pdf_path": pdf_path,
        "chunks": chunks,
        # Optional: you can store embeddings here if you want persistence
    })

    return {"message": "Uploaded successfully", "token": token}

@app.post("/validate-token")
async def validate_token(request: Request):
    body = await request.json()
    token = body.get("token")

    record = uploads.find_one({"token": token})
    if not record:
        return {"valid": False}

    return {
        "valid": True,
        "company_name": record["company_name"],
        "token": token,
    }
    
from pydantic import BaseModel
from gemini_client import generate_answer

class ChatRequest(BaseModel):
    question: str
    token: str

@app.post("/chat")
def chat_with_policy(req: ChatRequest):
    policy = uploads.find_one({"token": req.token})
    if not policy:
        raise HTTPException(status_code=404, detail="Invalid token")

    question_emb = np.array([get_embedding(req.question)]).astype("float32")
    chunk_embeddings = [get_embedding(c) for c in policy["chunks"]]

    from vector_store import VectorStore
    vector_store = VectorStore(dim=len(chunk_embeddings[0]))
    vector_store.add(np.array(chunk_embeddings).astype("float32"), policy["chunks"])

    relevant_chunks = vector_store.search(question_emb, top_k=3)
    context = "\n\n".join(relevant_chunks)

    prompt = f"""
You are a smart HR assistant. Use the following policy excerpts to answer:

Policy Content:
{context}

Question:
{req.question}
"""

    answer = generate_answer(prompt)
    return {"answer": answer}