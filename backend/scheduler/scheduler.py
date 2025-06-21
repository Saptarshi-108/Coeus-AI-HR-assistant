import os
from datetime import datetime, timedelta, time
import pytz
from googleapiclient.errors import HttpError

TIMEZONE = os.getenv("TIMEZONE", "Asia/Kolkata")
WORK_START = time(9, 0)
WORK_END = time(19, 0)
INTERVIEW_DURATION = timedelta(hours=1)

def is_working_day(date):
    return date.weekday() < 5

def next_working_time_slot(service, calendar_id, from_time=None):
    tz = pytz.timezone(TIMEZONE)
    if from_time is None:
        from_time = datetime.now(tz)
    from_time = from_time.replace(minute=0, second=0, microsecond=0)

    while True:
        if not is_working_day(from_time):
            from_time += timedelta(days=1)
            from_time = from_time.replace(hour=WORK_START.hour)
            continue

        if from_time.time() < WORK_START:
            from_time = from_time.replace(hour=WORK_START.hour, minute=0)
        elif from_time.time() >= WORK_END:
            from_time += timedelta(days=1)
            from_time = from_time.replace(hour=WORK_START.hour, minute=0)
            continue

        potential_end = from_time + INTERVIEW_DURATION
        if potential_end.time() > WORK_END:
            from_time += timedelta(days=1)
            from_time = from_time.replace(hour=WORK_START.hour, minute=0)
            continue

        iso_start = from_time.isoformat()
        iso_end = potential_end.isoformat()

        events_result = service.events().list(
        calendarId=calendar_id,
        timeMin=iso_start,
        timeMax=iso_end,
        singleEvents=True,
        orderBy='startTime'
        ).execute()


        events = events_result.get('items', [])
        if not events:
            return from_time, potential_end

        last_event_end = max([
            datetime.fromisoformat(ev['end']['dateTime'].replace('Z', '+00:00')).astimezone(tz)
            for ev in events
        ])
        from_time = last_event_end

def create_interview_event(service, calendar_id, start_time, end_time, summary, description, attendees_emails):
    event = {
        'summary': summary,
        'description': description,
        'start': {'dateTime': start_time.isoformat(), 'timeZone': TIMEZONE},
        'end': {'dateTime': end_time.isoformat(), 'timeZone': TIMEZONE},
        'attendees': [{'email': email} for email in attendees_emails],
        'conferenceData': {
            'createRequest': {
                'requestId': 'meet-' + start_time.strftime("%Y%m%d%H%M%S"),
                'conferenceSolutionKey': {'type': 'hangoutsMeet'}
            }
        },
        'reminders': {'useDefault': True}
    }
    created_event = service.events().insert(
        calendarId=calendar_id,
        body=event,
        conferenceDataVersion=1,
        sendUpdates='all'
    ).execute()
    meet_link = created_event.get('hangoutLink')
    return created_event, meet_link