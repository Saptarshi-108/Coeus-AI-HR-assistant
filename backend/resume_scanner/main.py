from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from tempfile import TemporaryDirectory
import os, zipfile, io, json, pandas as pd
from dotenv import load_dotenv
from gemini_matcher import score_resume
from scorer import parse_gemini_response, rank_resumes
from utils import get_text_from_file
from bias_analyzer import analyze_bias
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/rank/")
async def rank_resumes_api(
    jd_file: UploadFile = File(...),
    resumes: List[UploadFile] = File(...),
    criteria_file: UploadFile = File(...)  # JSON file auto-uploaded by frontend
):
    # ✅ 1. Parse uploaded JSON criteria file
    try:
        criteria_data = await criteria_file.read()
        criteria = json.loads(criteria_data.decode())
        if not isinstance(criteria, dict) or not all(isinstance(v, (int, float)) for v in criteria.values()):
            raise ValueError
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Invalid criteria JSON format."})

    if sum(criteria.values()) == 0:
        return JSONResponse(status_code=400, content={"error": "Total weight cannot be zero."})

    with TemporaryDirectory() as tmpdir:
        # ✅ 2. Process JD file
        jd_path = os.path.join(tmpdir, jd_file.filename)
        with open(jd_path, "wb") as f:
            f.write(await jd_file.read())
        jd_text = get_text_from_file(jd_path)
        if not jd_text:
            return JSONResponse(status_code=400, content={"error": "Failed to extract text from JD."})

        # ✅ 3. Process resumes
        resume_entries = []
        for file in resumes:
            file_path = os.path.join(tmpdir, file.filename)
            with open(file_path, "wb") as f:
                f.write(await file.read())

            if file.filename.endswith(".zip"):
                with zipfile.ZipFile(file_path, 'r') as zip_ref:
                    zip_ref.extractall(tmpdir)
                for root, _, files in os.walk(tmpdir):
                    for fname in files:
                        if fname.lower().endswith((".pdf", ".txt")) and "jd" not in fname.lower():
                            full_path = os.path.join(root, fname)
                            resume_text = get_text_from_file(full_path)
                            resume_entries.append((fname, resume_text))
            elif file.filename.lower().endswith((".pdf", ".txt")) and "jd" not in file.filename.lower():
                resume_text = get_text_from_file(file_path)
                resume_entries.append((file.filename, resume_text))

        if not resume_entries:
            return JSONResponse(status_code=400, content={"error": "No valid resumes found."})

        # ✅ 4. Score and rank resumes
        results = []
        for filename, resume_text in resume_entries:
            raw = score_resume(jd_text, resume_text, criteria)
            parsed = parse_gemini_response(raw)
            parsed["filename"] = filename
            parsed["resume_text"] = resume_text
            results.append(parsed)

        ranked = rank_resumes(results)
        df = pd.DataFrame(ranked)
        df_csv = df.drop(columns=["resume_text"], errors="ignore")

        # ✅ 6. Prepare CSV
        csv_stream = io.StringIO()
        df_csv.to_csv(csv_stream, index=False)
        csv_bytes = csv_stream.getvalue().encode()

        # ✅ 7. Prepare JSON with resume_text
        for item in ranked:
            resume = next((text for text in resume_entries if text[0] == item["filename"]), None)
            if resume:
                item["resume_text"] = resume[1]

        json_bytes = json.dumps(ranked, indent=2).encode("utf-8")

        # ✅ 8. Create in-memory ZIP
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w") as zipf:
            zipf.writestr("ranked_resumes.csv", csv_bytes)
            zipf.writestr("ranked_resumes.json", json_bytes)

        zip_buffer.seek(0)

        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=ranked_output.zip"}
        )
        
@app.post("/bias/")
async def run_bias_analysis(json_file: UploadFile = File(...)):
    try:
        contents = await json_file.read()
        resume_data = json.loads(contents.decode())

        if not isinstance(resume_data, list) or not all("resume_text" in r for r in resume_data):
            return JSONResponse(status_code=400, content={"error": "Invalid JSON format or missing resume_text."})

        bias_report_df, bias_summary = analyze_bias(resume_data)

        return {
            "bias_summary": bias_summary,
            "grouped_stats": bias_report_df.to_dict(orient="records")
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})