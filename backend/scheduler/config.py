from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_API_SCOPES = os.getenv("GOOGLE_API_SCOPES", "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send").split()
GOOGLE_API_CLIENT_SECRET_FILE = os.getenv("GOOGLE_API_CLIENT_SECRET_FILE")
CALENDAR_ID = os.getenv("CALENDAR_ID")
EMAIL_SENDER = os.getenv("EMAIL_SENDER")