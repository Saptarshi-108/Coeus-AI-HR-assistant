import json
import re

def parse_gemini_response(response_text):
    try:
        cleaned = re.sub(r"```json|```", "", response_text).strip()
        return json.loads(cleaned)
    except Exception as e:
        return {"error": f"Could not parse Gemini response: {e}", "raw": response_text}

def rank_resumes(results):
    return sorted(results, key=lambda x: x.get("final_score", 0), reverse=True)