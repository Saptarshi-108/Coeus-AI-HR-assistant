import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Load API key from .env file
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Gemini model setup
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

def score_resume(jd_text: str, resume_text: str, criteria: dict) -> str:
    """
    Evaluate a resume using HR-defined custom criteria and weights via Gemini.
    """

    prompt = f"""
You are an expert AI HR assistant.

Your task is to evaluate the following candidate resume against a job description
based on custom criteria and weights provided by the HR.

🔹 Job Description:
\"\"\"{jd_text}\"\"\"

🔹 Resume:
\"\"\"{resume_text}\"\"\"

🔹 Evaluation Criteria:
Each criterion must be scored out of 100. Use the weight to calculate a weighted average.

Criteria with Weights:
{json.dumps(criteria, indent=2)}

🔸 Respond ONLY in the following JSON format:

  "criterion_1": "score1",
  "criterion_2": "score2",
  (do for all the criteria)
  "final_score": "average of all the scores",
  "summary": "Brief feedback (1–2 lines) about this candidate"
⚠️ Do not include extra text or explanation — only valid JSON output.
"""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return json.dumps({"error": f"Gemini API call failed: {str(e)}"})
