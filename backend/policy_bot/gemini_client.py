import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise ValueError("GOOGLE_API_KEY missing")

genai.configure(api_key=API_KEY)

def get_embedding(text: str, is_query: bool = False):
    task_type = "retrieval_query" if is_query else "retrieval_document"
    response = genai.embed_content(
        model="models/embedding-001",
        content=text,
        task_type=task_type
    )
    return response['embedding']

def generate_answer(prompt: str):
    model = genai.GenerativeModel('models/gemini-1.5-flash-latest')
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(temperature=0.4)
    )
    return response.text.strip()
