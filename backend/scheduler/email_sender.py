import base64
from email.mime.text import MIMEText
from googleapiclient.errors import HttpError

def create_message(sender, to, subject, message_text):
    message = MIMEText(message_text, "plain")
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw}

def send_email(service, user_id, message):
    try:
        message_sent = service.users().messages().send(userId=user_id, body=message).execute()
        return message_sent
    except HttpError as error:
        print(f"An error occurred: {error}")
        return None
