import pandas as pd
from gemini_bias import infer_attributes, analyze_with_gemini

def analyze_bias(resume_data: list[dict]):
    """
    Accepts a list of resumes (each with at least resume_text and final_score).
    Infers bias-related attributes, builds grouped stats, and returns:
    - bias_report_df: a DataFrame grouped by gender, region, experience level
    - bias_summary: Gemini's text summary of the potential bias
    """

    inferred_data = []

    for entry in resume_data:
        resume_text = entry.get("resume_text", "")
        final_score = entry.get("final_score", 0)

        # Skip invalid data
        if not resume_text:
            continue

        gender, region, level = infer_attributes(resume_text)

        inferred_data.append({
            "filename": entry.get("filename", "unknown"),
            "final_score": final_score,
            "gender": gender,
            "region": region,
            "experience_level": level
        })

    # Convert to DataFrame
    df = pd.DataFrame(inferred_data)
    df["final_score"] = pd.to_numeric(df["final_score"], errors="coerce")
    if df.empty:
        raise ValueError("No valid resumes or resume_text found.")

    # Group bias report
    stats = df.groupby(['gender', 'region', 'experience_level']).agg({
        'final_score': ['mean', 'count']
    }).reset_index()

    stats.columns = ['gender', 'region', 'experience_level', 'avg_score', 'resume_count']

    # Generate bias summary using Gemini
    bias_summary = analyze_with_gemini(df)

    return stats, bias_summary
