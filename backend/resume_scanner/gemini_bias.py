import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variable for Gemini API
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use the Gemini 1.5 Flash model (fast & cost-effective)
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

def infer_attributes(resume_text: str):
    """
    Extracts gender, region, and experience level from resume text using Gemini.
    Returns: (gender, region, experience_level)
    """
    prompt = f"""
You are an HR expert.

Given the following resume, infer the following attributes (based on name, location, experience, education):

Resume:
\"\"\"{resume_text}\"\"\"

Respond **strictly** in this format:
Gender: Male/Female/Other/Unknown  
Region: Continent or Country name (e.g., Asia, Europe, USA)  
Experience Level: Junior/Mid/Senior/Unknown
"""
    try:
        response = model.generate_content(prompt)
        result = response.text.strip()
        gender = extract_field(result, "Gender")
        region = extract_field(result, "Region")
        level = extract_field(result, "Experience Level")
        return gender, region, level
    except Exception as e:
        return "Unknown", "Unknown", "Unknown"

def extract_field(text, key):
    """
    Extracts a specific field like 'Gender' from Gemini response.
    """
    for line in text.splitlines():
        if line.lower().startswith(key.lower()):
            return line.split(":", 1)[-1].strip()
    return "Unknown"

def analyze_with_gemini(df):
    """
    Performs high-level bias analysis using Gemini.
    Input: DataFrame with columns ['filename', 'gender', 'region', 'experience_level', 'final_score']
    Returns: Gemini-generated bias summary (string)
    """
    sample_data = df[["filename", "gender", "region", "experience_level", "final_score"]].to_dict(orient="records")

    prompt = f"""
You are an ethical hiring analyst.

You are given a list of shortlisted candidates with their:
- Gender
- Region
- Experience Level
- Final Score

Here is the data:
{sample_data}

Analyze and answer:
1. Are there any visible gender, regional or experience-level biases?
2. Are average scores skewed for any demographic group?
3. How can the HR team reduce bias in shortlisting?

Respond in bullet points, keep it concise and practical.
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Gemini error: {str(e)}"
