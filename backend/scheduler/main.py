from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
import os
from fastapi.middleware.cors import CORSMiddleware

from google_auth import get_calendar_service, get_gmail_service
from scheduler import next_working_time_slot, create_interview_event
from email_sender import create_message, send_email
from db import get_interviewee_email, add_interviewee
from config import GOOGLE_API_SCOPES

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify ["http://localhost:5173"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load from .env
SCOPES = GOOGLE_API_SCOPES
CALENDAR_ID = os.getenv("CALENDAR_ID")
SENDER_EMAIL = os.getenv("EMAIL_SENDER")

# Input models
class InterviewRequest(BaseModel):
    interviewee_id: str
    interviewer_email: str
    summary: str = "Interview Scheduled"
    description: str = "This is your scheduled interview."

class IntervieweeCreateRequest(BaseModel):
    name: str
    email: str

# Endpoint to register a new interviewee
@app.post("/register_interviewee/")
async def register_interviewee(request: IntervieweeCreateRequest):
    try:
        interviewee_id = add_interviewee(request.name, request.email)
        return {
            "message": "Interviewee registered successfully",
            "interviewee_id": interviewee_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering interviewee: {str(e)}")

# Endpoint to schedule interview
@app.post("/schedule_interview/")
async def schedule_interview(request: InterviewRequest):
    try:
        interviewee_email = get_interviewee_email(request.interviewee_id)
        if not interviewee_email:
            raise HTTPException(status_code=404, detail="Interviewee not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid interviewee ID: {str(e)}")

    calendar_service = get_calendar_service()
    gmail_service = get_gmail_service()

    try:
        start_time, end_time = next_working_time_slot(calendar_service, CALENDAR_ID)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding time slot: {str(e)}")

    try:
        event, meet_link = create_interview_event(
            calendar_service,
            CALENDAR_ID,
            start_time,
            end_time,
            request.summary,
            request.description,
            [interviewee_email, request.interviewer_email]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating calendar event: {str(e)}")

    email_text = f"""Hello,

Your interview has been scheduled as follows:

Date: {start_time.strftime('%Y-%m-%d')}
Time: {start_time.strftime('%H:%M %Z')}
Duration: 1 hour
Mode: Online (Google Meet)

Join Meeting: {meet_link}

Regards,
HR Team
"""
    try:
        message = create_message(SENDER_EMAIL, interviewee_email, "Interview Scheduled", email_text)
        sent = send_email(gmail_service, "me", message)
        if not sent:
            raise HTTPException(status_code=500, detail="Failed to send email")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending email: {str(e)}")

    return {
        "message": "Interview scheduled successfully",
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "google_meet_link": meet_link,
        "event_id": event.get("id")
    }
