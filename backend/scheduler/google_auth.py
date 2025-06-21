import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

SCOPES = os.getenv("GOOGLE_API_SCOPES", "").split()
CLIENT_SECRET_FILE = os.getenv("GOOGLE_API_CLIENT_SECRET_FILE", "credentials.json")
TOKEN_PATH = "token.json"

def get_credentials():
    creds = None

    # Load existing token if available
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)

    # If no valid credentials, initiate OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CLIENT_SECRET_FILE):
                raise FileNotFoundError(f"Missing client secret file: {CLIENT_SECRET_FILE}")
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        # Save the new token
        with open(TOKEN_PATH, 'w') as token_file:
            token_file.write(creds.to_json())

    return creds

def get_calendar_service():
    creds = get_credentials()
    return build("calendar", "v3", credentials=creds)

def get_gmail_service():
    creds = get_credentials()
    return build("gmail", "v1", credentials=creds)
