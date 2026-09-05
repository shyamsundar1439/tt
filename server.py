import os
import sys
import uuid
import socket
import subprocess
from datetime import datetime, date, timedelta
from typing import Optional, List
import asyncio
from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import (
    get_db, init_db, ensure_daily_tasks_for_date, reset_to_fresh_state,
    save_push_subscription, get_push_subscriptions, delete_push_subscription
)

app = FastAPI(title="SSC CGL Study Companion API")

@app.get("/health")
def health():
    return {"status": "ok"}
    
# Enable CORS for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure DB initialized on startup
init_db()

# --- PYDANTIC SCHEMAS ---
class TaskCreate(BaseModel):
    title: str
    subject: str
    category: Optional[str] = "maths"
    topic: Optional[str] = ""
    priority: str = "must" # 'must', 'should', 'bonus'
    planned_time: int = 30
    notes: Optional[str] = ""

class TaskUpdate(BaseModel):
    completed: Optional[bool] = None
    actual_time: Optional[int] = None
    notes: Optional[str] = None
    priority: Optional[str] = None

class SyllabusUpdate(BaseModel):
    status: str # 'pending', 'in_progress', 'completed'

class SessionCreate(BaseModel):
    task_id: Optional[str] = None
    subject: str
    topic: str
    duration_minutes: int

class CheckInCreate(BaseModel):
    energy: int
    sleep: int
    goal: str
    focus_topic: str

class ReviewCreate(BaseModel):
    completed_summary: str
    missed_summary: str
    distraction: str
    priority_next_day: str

class NotificationSettingsUpdate(BaseModel):
    enabled: bool
    daily_task_reminder: bool
    upcoming_session_reminder: bool
    missed_task_reminder: bool
    revision_due_reminder: bool
    reminder_time: str
    push_endpoint: Optional[str] = None

class PushKeys(BaseModel):
    p256dh: str
    auth: str

class PushSubscribeRequest(BaseModel):
    endpoint: str
    keys: PushKeys
    user_agent: Optional[str] = ""

class PushSendRequest(BaseModel):
    title: Optional[str] = "🎯 Study Sprint Call"
    body: Optional[str] = "Daily revision is due! Click to open your CGL study plan."
    target_view: Optional[str] = "today"

# --- HELPER FUNCTIONS ---
def update_user_streak(cursor, today_str):
    """Safely increments consistency streak when user studies today."""
    cursor.execute("SELECT streak, last_active_date FROM user_profile WHERE id = 1")
    row = cursor.fetchone()
    if not row:
        return
    current_streak = row["streak"]
    last_date_str = row["last_active_date"]

    if not last_date_str:
        # First active day
        new_streak = 1
    elif last_date_str == today_str:
        # Already active today, maintain
        new_streak = max(1, current_streak)
    else:
        last_date = date.fromisoformat(last_date_str)
        today_date = date.fromisoformat(today_str)
        diff_days = (today_date - last_date).days
        if diff_days == 1:
            # Consecutive day
            new_streak = current_streak + 1
        else:
            # Missed days, restart streak at 1
            new_streak = 1

    cursor.execute("""
    UPDATE user_profile
    SET streak = ?, last_active_date = ?, updated_at = datetime('now')
    WHERE id = 1
    """, (new_streak, today_str))

# --- API ENDPOINTS ---

@app.get("/api/state")
def get_full_state():
    """Returns complete state for the app, including tasks, syllabus, sessions, and settings."""
    today_str = date.today().isoformat()
    ensure_daily_tasks_for_date(today_str)

    conn = get_db()
    cursor = conn.cursor()

    # 1. Tasks for today
    cursor.execute("""
    SELECT id, title, subject, category, topic, priority, planned_time, actual_time, completed, scheduled_date, notes
    FROM tasks
    WHERE scheduled_date = ?
    ORDER BY CASE priority WHEN 'must' THEN 1 WHEN 'should' THEN 2 ELSE 3 END, created_at ASC
    """, (today_str,))
    tasks = [dict(row) for row in cursor.fetchall()]
    for t in tasks:
        t["completed"] = bool(t["completed"])

    # Check uncompleted tasks from prior dates (available for rollover)
    cursor.execute("""
    SELECT COUNT(*) FROM tasks
    WHERE scheduled_date < ? AND completed = 0
    """, (today_str,))
    prior_uncompleted_count = cursor.fetchone()[0]

    # 2. Syllabus progress
    cursor.execute("SELECT month_key, subject_key, topic_idx, status FROM syllabus_progress")
    syllabus_progress = {}
    for row in cursor.fetchall():
        key = f"{row['month_key']}_{row['subject_key']}_{row['topic_idx']}"
        syllabus_progress[key] = row["status"]

    # 3. Today's actual study minutes from sessions
    cursor.execute("""
    SELECT subject, SUM(duration_minutes) as total_mins
    FROM study_sessions
    WHERE session_date = ?
    GROUP BY subject
    """, (today_str,))
    actual_minutes = {"maths": 0, "reasoning": 0, "english": 0, "gk": 0}
    for row in cursor.fetchall():
        sub = row["subject"].lower()
        if "math" in sub:
            actual_minutes["maths"] += row["total_mins"]
        elif "reason" in sub:
            actual_minutes["reasoning"] += row["total_mins"]
        elif "eng" in sub:
            actual_minutes["english"] += row["total_mins"]
        elif "gk" in sub or "hist" in sub:
            actual_minutes["gk"] += row["total_mins"]

    # Planned minutes from tasks
    planned_minutes = sum(t["planned_time"] for t in tasks) if tasks else 280

    # 4. Checkin today
    cursor.execute("SELECT energy, sleep, goal, focus_topic FROM daily_checkins WHERE checkin_date = ?", (today_str,))
    checkin_row = cursor.fetchone()
    checkin = dict(checkin_row) if checkin_row else None

    # 5. Reviews
    cursor.execute("SELECT review_date, completed_summary, missed_summary, distraction, priority_next_day FROM daily_reviews ORDER BY created_at DESC LIMIT 5")
    reviews = [dict(r) for r in cursor.fetchall()]

    # 6. User profile
    cursor.execute("SELECT streak, total_xp, last_active_date FROM user_profile WHERE id = 1")
    profile_row = cursor.fetchone()
    profile = dict(profile_row) if profile_row else {"streak": 0, "total_xp": 0}

    # 7. Notification settings
    cursor.execute("SELECT enabled, daily_task_reminder, upcoming_session_reminder, missed_task_reminder, revision_due_reminder, reminder_time FROM notification_settings WHERE id = 1")
    notif_row = cursor.fetchone()
    notif_settings = dict(notif_row) if notif_row else {
        "enabled": 1, "daily_task_reminder": 1, "upcoming_session_reminder": 1,
        "missed_task_reminder": 1, "revision_due_reminder": 1, "reminder_time": "07:00"
    }
    for k in ["enabled", "daily_task_reminder", "upcoming_session_reminder", "missed_task_reminder", "revision_due_reminder"]:
        notif_settings[k] = bool(notif_settings[k])

    conn.close()

    return {
        "today": today_str,
        "tasks": tasks,
        "prior_uncompleted_count": prior_uncompleted_count,
        "syllabus_progress": syllabus_progress,
        "actual_minutes": actual_minutes,
        "planned_minutes": planned_minutes,
        "daily_checkin": checkin,
        "reviews": reviews,
        "streak": profile["streak"],
        "total_xp": profile["total_xp"],
        "notification_settings": notif_settings
    }

@app.get("/api/tasks")
def get_tasks(scheduled_date: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    target_date = scheduled_date or date.today().isoformat()
    cursor.execute("""
    SELECT id, title, subject, category, topic, priority, planned_time, actual_time, completed, scheduled_date, notes
    FROM tasks
    WHERE scheduled_date = ?
    ORDER BY CASE priority WHEN 'must' THEN 1 WHEN 'should' THEN 2 ELSE 3 END, created_at ASC
    """, (target_date,))
    tasks = [dict(row) for row in cursor.fetchall()]
    for t in tasks:
        t["completed"] = bool(t["completed"])
    conn.close()
    return tasks

@app.post("/api/tasks")
def create_task(t: TaskCreate):
    conn = get_db()
    cursor = conn.cursor()
    task_id = "task-" + uuid.uuid4().hex[:8]
    today_str = date.today().isoformat()
    now_ts = datetime.now().isoformat()

    cursor.execute("""
    INSERT INTO tasks (id, title, subject, category, topic, priority, planned_time, actual_time, completed, scheduled_date, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?)
    """, (task_id, t.title, t.subject, t.category, t.topic, t.priority, t.planned_time, today_str, t.notes, now_ts))
    conn.commit()
    conn.close()
    return {"id": task_id, "status": "created"}

@app.put("/api/tasks/{task_id}/toggle")
def toggle_task(task_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT completed, planned_time, actual_time, category, title, topic FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    new_status = 0 if row["completed"] else 1
    new_actual = row["actual_time"]
    completed_at = datetime.now().isoformat() if new_status == 1 else None
    today_str = date.today().isoformat()

    if new_status == 1:
        if new_actual == 0:
            new_actual = row["planned_time"]
        # Log study session
        sess_id = "sess-" + uuid.uuid4().hex[:8]
        cursor.execute("""
        INSERT INTO study_sessions (id, task_id, subject, topic, duration_minutes, session_date, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (sess_id, task_id, row["category"], row["topic"] or row["title"], new_actual, today_str, completed_at))

        # Award XP
        cursor.execute("UPDATE user_profile SET total_xp = total_xp + 40, updated_at = datetime('now') WHERE id = 1")
        update_user_streak(cursor, today_str)

    cursor.execute("""
    UPDATE tasks
    SET completed = ?, actual_time = ?, completed_at = ?
    WHERE id = ?
    """, (new_status, new_actual, completed_at, task_id))

    conn.commit()
    conn.close()
    return {"id": task_id, "completed": bool(new_status), "actual_time": new_actual}

@app.post("/api/tasks/{task_id}/rollover")
def rollover_task(task_id: str):
    """Carries forward a missed task to tomorrow without guilt/penalty."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, subject, category, topic, planned_time, notes FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    tomorrow_str = (date.today() + timedelta(days=1)).isoformat()
    now_ts = datetime.now().isoformat()
    new_id = "task-" + uuid.uuid4().hex[:8]

    # Insert into tomorrow's tasks
    cursor.execute("""
    INSERT INTO tasks (id, title, subject, category, topic, priority, planned_time, actual_time, completed, scheduled_date, notes, created_at)
    VALUES (?, ?, ?, ?, ?, 'should', ?, 0, 0, ?, ?, ?)
    """, (new_id, row["title"], row["subject"], row["category"], row["topic"], row["planned_time"], tomorrow_str, "(Rolled over from yesterday)", now_ts))

    cursor.execute("UPDATE tasks SET notes = '(Rolled over to tomorrow buffer)' WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return {"message": "Task rolled over to tomorrow successfully.", "new_task_id": new_id}

@app.post("/api/tasks/rollover-all-prior")
def rollover_all_prior_tasks():
    """Brings forward all uncompleted tasks from prior dates into today's buffer."""
    today_str = date.today().isoformat()
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id, title, subject, category, topic, planned_time, scheduled_date
    FROM tasks
    WHERE scheduled_date < ? AND completed = 0
    """, (today_str,))
    prior_tasks = cursor.fetchall()

    now_ts = datetime.now().isoformat()
    count = 0
    for pt in prior_tasks:
        new_id = "task-" + uuid.uuid4().hex[:8]
        cursor.execute("""
        INSERT INTO tasks (id, title, subject, category, topic, priority, planned_time, actual_time, completed, scheduled_date, notes, created_at)
        VALUES (?, ?, ?, ?, ?, 'should', ?, 0, 0, ?, ?, ?)
        """, (new_id, pt["title"], pt["subject"], pt["category"], pt["topic"], pt["planned_time"], today_str, f"(Rolled over from {pt['scheduled_date']})", now_ts))
        cursor.execute("UPDATE tasks SET completed = 1, notes = '(Rolled over to today)' WHERE id = ?", (pt["id"],))
        count += 1

    conn.commit()
    conn.close()
    return {"status": "success", "count": count}

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted"}

@app.put("/api/syllabus/{month_key}/{subject_key}/{topic_idx}")
def update_syllabus_status(month_key: str, subject_key: str, topic_idx: int, update: SyllabusUpdate):
    conn = get_db()
    cursor = conn.cursor()
    now_ts = datetime.now().isoformat()

    cursor.execute("""
    INSERT INTO syllabus_progress (month_key, subject_key, topic_idx, status, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(month_key, subject_key, topic_idx) DO UPDATE SET
        status = excluded.status,
        updated_at = excluded.updated_at
    """, (month_key, subject_key, topic_idx, update.status, now_ts))

    if update.status == "completed":
        cursor.execute("UPDATE user_profile SET total_xp = total_xp + 35, updated_at = datetime('now') WHERE id = 1")

    conn.commit()
    conn.close()
    return {"month": month_key, "subject": subject_key, "topic": topic_idx, "status": update.status}

@app.post("/api/sessions")
def log_study_session(s: SessionCreate):
    conn = get_db()
    cursor = conn.cursor()
    sess_id = "sess-" + uuid.uuid4().hex[:8]
    today_str = date.today().isoformat()
    now_ts = datetime.now().isoformat()

    cursor.execute("""
    INSERT INTO study_sessions (id, task_id, subject, topic, duration_minutes, session_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (sess_id, s.task_id, s.subject, s.topic, s.duration_minutes, today_str, now_ts))

    # Award XP & update streak
    cursor.execute("UPDATE user_profile SET total_xp = total_xp + 25, updated_at = datetime('now') WHERE id = 1")
    update_user_streak(cursor, today_str)

    conn.commit()
    conn.close()
    return {"id": sess_id, "duration": s.duration_minutes, "status": "recorded"}

@app.post("/api/checkin")
def record_checkin(c: CheckInCreate):
    conn = get_db()
    cursor = conn.cursor()
    today_str = date.today().isoformat()
    now_ts = datetime.now().isoformat()

    cursor.execute("""
    INSERT INTO daily_checkins (checkin_date, energy, sleep, goal, focus_topic, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(checkin_date) DO UPDATE SET
        energy = excluded.energy,
        sleep = excluded.sleep,
        goal = excluded.goal,
        focus_topic = excluded.focus_topic
    """, (today_str, c.energy, c.sleep, c.goal, c.focus_topic, now_ts))

    cursor.execute("UPDATE user_profile SET total_xp = total_xp + 20, updated_at = datetime('now') WHERE id = 1")
    conn.commit()
    conn.close()
    return {"status": "saved", "date": today_str}

@app.post("/api/review")
def record_review(r: ReviewCreate):
    conn = get_db()
    cursor = conn.cursor()
    today_str = date.today().isoformat()
    now_ts = datetime.now().isoformat()

    cursor.execute("""
    INSERT INTO daily_reviews (review_date, completed_summary, missed_summary, distraction, priority_next_day, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(review_date) DO UPDATE SET
        completed_summary = excluded.completed_summary,
        missed_summary = excluded.missed_summary,
        distraction = excluded.distraction,
        priority_next_day = excluded.priority_next_day
    """, (today_str, r.completed_summary, r.missed_summary, r.distraction, r.priority_next_day, now_ts))

    # Extend streak if study sessions occurred today
    cursor.execute("SELECT COUNT(*) FROM study_sessions WHERE session_date = ?", (today_str,))
    has_studied = cursor.fetchone()[0] > 0
    if has_studied:
        cursor.execute("UPDATE user_profile SET streak = streak + 1, total_xp = total_xp + 30, last_active_date = ?, updated_at = datetime('now') WHERE id = 1", (today_str,))

    conn.commit()
    conn.close()
    return {"status": "saved", "date": today_str}

@app.get("/api/progress/weekly")
def get_weekly_progress():
    conn = get_db()
    cursor = conn.cursor()

    # Calculate past 7 days study hours
    days_data = []
    days_of_week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    today = date.today()

    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        d_str = d.isoformat()
        day_name = days_of_week[d.weekday()]

        cursor.execute("SELECT COALESCE(SUM(duration_minutes), 0) FROM study_sessions WHERE session_date = ?", (d_str,))
        mins = cursor.fetchone()[0]
        actual_hours = round(mins / 60.0, 1)

        planned_hours = 5.5 if d.weekday() >= 5 else 4.5
        days_data.append({
            "date": d_str,
            "day": day_name,
            "actualHours": actual_hours,
            "plannedHours": planned_hours
        })

    cursor.execute("""
    SELECT subject, COUNT(*) as total_tasks,
           SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as done_tasks
    FROM tasks
    GROUP BY subject
    """)
    subject_performance = []
    weak_topics = []

    for row in cursor.fetchall():
        sub = row["subject"]
        total = row["total_tasks"]
        done = row["done_tasks"]
        rate = round((done / max(total, 1)) * 100)
        subject_performance.append({"subject": sub, "completion_rate": rate})
        if rate < 60:
            weak_topics.append(f"{sub} ({rate}% completion — scheduled for focused retrieval)")

    if not weak_topics:
        weak_topics.append("Static History & GK (Dynasty capitals & inscriptions benefit from evening recall)")

    conn.close()

    return {
        "weekly_history": days_data,
        "subject_performance": subject_performance,
        "weak_topic_analysis": {
            "weak_topics": weak_topics,
            "recommendation": "Maintain morning high-alertness block for Quantitative Aptitude. Use college intervals for flashcard retrieval."
        }
    }

@app.get("/api/notifications/settings")
def get_notification_settings():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT enabled, daily_task_reminder, upcoming_session_reminder, missed_task_reminder, revision_due_reminder, reminder_time FROM notification_settings WHERE id = 1")
    row = cursor.fetchone()
    conn.close()
    if not row:
        return {"enabled": True, "daily_task_reminder": True, "upcoming_session_reminder": True, "missed_task_reminder": True, "revision_due_reminder": True, "reminder_time": "07:00"}

    res = dict(row)
    for k in ["enabled", "daily_task_reminder", "upcoming_session_reminder", "missed_task_reminder", "revision_due_reminder"]:
        res[k] = bool(res[k])
    return res

@app.put("/api/notifications/settings")
def update_notification_settings(s: NotificationSettingsUpdate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE notification_settings
    SET enabled = ?, daily_task_reminder = ?, upcoming_session_reminder = ?,
        missed_task_reminder = ?, revision_due_reminder = ?, reminder_time = ?,
        push_endpoint = ?, updated_at = datetime('now')
    WHERE id = 1
    """, (int(s.enabled), int(s.daily_task_reminder), int(s.upcoming_session_reminder),
          int(s.missed_task_reminder), int(s.revision_due_reminder), s.reminder_time, s.push_endpoint))
    conn.commit()
    conn.close()
    return {"status": "updated"}

@app.get("/api/notifications/due")
def get_due_notifications():
    """Generates the specific topic/task notification for today, matching user's actual tasks."""
    today_str = date.today().isoformat()
    ensure_daily_tasks_for_date(today_str)

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT title, subject, topic, priority, planned_time
    FROM tasks
    WHERE scheduled_date = ? AND completed = 0
    ORDER BY CASE priority WHEN 'must' THEN 1 WHEN 'should' THEN 2 ELSE 3 END, created_at ASC
    LIMIT 1
    """, (today_str,))
    task_row = cursor.fetchone()
    conn.close()

    if task_row:
        sub = task_row["subject"]
        topic = task_row["topic"] or task_row["title"]
        return {
            "has_notification": True,
            "type": "daily_task_reminder",
            "title": f"Study Reminder • {sub}",
            "body": f"{sub} — {topic}: {task_row['planned_time']}m planned for today.",
            "target_view": "today"
        }
    else:
        return {
            "has_notification": True,
            "type": "all_done",
            "title": "SSC CGL Study Companion",
            "body": "All daily core topics completed! Review your error notes tonight.",
            "target_view": "review"
        }

@app.post("/api/notifications/test")
def test_notification():
    """Triggers an immediate sample notification based on user's actual study plan."""
    today_str = date.today().isoformat()
    ensure_daily_tasks_for_date(today_str)

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT title, subject, topic, planned_time
    FROM tasks
    WHERE scheduled_date = ? AND completed = 0
    ORDER BY CASE priority WHEN 'must' THEN 1 WHEN 'should' THEN 2 ELSE 3 END, created_at ASC
    LIMIT 1
    """, (today_str,))
    task_row = cursor.fetchone()
    conn.close()

    if task_row:
        sub = task_row["subject"]
        topic = task_row["topic"] or task_row["title"]
        return {
            "title": f"Study Alert: {sub}",
            "body": f"{sub} — {topic}: scheduled for today ({task_row['planned_time']} mins planned).",
            "tag": "ssc-study-test",
            "target_view": "today"
        }
    return {
        "title": "SSC CGL Study Companion",
        "body": "Study Companion is active! Notifications and focus timer are ready.",
        "tag": "ssc-study-test",
        "target_view": "today"
    }

@app.get("/api/notifications/vapid-public-key")
def get_vapid_key_endpoint():
    """Returns the base64 URL-safe VAPID public key for Web Push."""
    from push_service import get_vapid_public_key
    return {"publicKey": get_vapid_public_key()}

@app.post("/api/notifications/subscribe")
def subscribe_push_endpoint(sub: PushSubscribeRequest):
    """Registers a browser's Web Push subscription."""
    save_push_subscription(
        endpoint=sub.endpoint,
        p256dh=sub.keys.p256dh,
        auth=sub.keys.auth,
        user_agent=sub.user_agent or ""
    )
    return {"status": "subscribed"}

@app.post("/api/notifications/send-webpush-test")
def send_webpush_test_endpoint(payload: PushSendRequest):
    """Dispatches a real Web Push notification from server to all registered devices."""
    from push_service import send_web_push
    subs = get_push_subscriptions()
    if not subs:
        return {
            "success": False,
            "message": "No push subscribers yet. Open the app and tap 'Enable Push Notifications' first!",
            "sent": 0,
            "total_devices": 0
        }

    sent = 0
    failed = 0
    today_str = date.today().isoformat()
    ensure_daily_tasks_for_date(today_str)

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT title, subject, topic, planned_time
    FROM tasks WHERE scheduled_date = ? AND completed = 0
    ORDER BY CASE priority WHEN 'must' THEN 1 WHEN 'should' THEN 2 ELSE 3 END, created_at ASC
    LIMIT 1
    """, (today_str,))
    row = cursor.fetchone()
    conn.close()

    body_text = payload.body
    if row and payload.body == "Daily revision is due! Click to open your CGL study plan.":
        body_text = f"Priority: {row['subject']} • {row['topic'] or row['title']} ({row['planned_time']} mins pending today)."

    push_payload = {
        "title": payload.title,
        "body": body_text,
        "tag": "ssc-study-webpush",
        "target_view": payload.target_view
    }

    for s in subs:
        try:
            send_web_push(s, push_payload)
            sent += 1
        except Exception as e:
            status = getattr(getattr(e, "response", None), "status_code", None)
            if status in [404, 410]:
                delete_push_subscription(s["endpoint"])
            failed += 1

    return {
        "success": True,
        "sent": sent,
        "failed": failed,
        "total_devices": len(subs)
    }

# Track reminders dispatched today to prevent repeated pushes in the same minute
dispatched_reminders_today = set()

async def push_scheduler_loop():
    """Background loop that evaluates scheduled study reminders and dispatches Web Push."""
    while True:
        try:
            await asyncio.sleep(45)
            now = datetime.now()
            today_str = now.strftime("%Y-%m-%d")
            current_hhmm = now.strftime("%H:%M")

            # Check notification settings
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT enabled, daily_task_reminder, reminder_time FROM notification_settings WHERE id = 1")
            settings_row = cursor.fetchone()
            conn.close()

            if not settings_row or not settings_row["enabled"]:
                continue

            reminder_time = settings_row["reminder_time"] or "07:00"
            scheduled_times = {
                reminder_time: ("Morning Study Call", "Daily study targets are active. Start your prime sprint!"),
                "05:15": ("Morning Prime Sprint (05:15)", "Maths arithmetic & speed calculation block starting now."),
                "18:30": ("Evening Focus Block (18:30)", "Time for Reasoning PYQs and speed drills!"),
                "20:45": ("Evening Review & Wind-Down (20:45)", "Review your completed syllabus and log your error book notes.")
            }

            if current_hhmm in scheduled_times:
                dedup_key = f"{today_str}_{current_hhmm}"
                if dedup_key not in dispatched_reminders_today:
                    dispatched_reminders_today.add(dedup_key)
                    title, default_body = scheduled_times[current_hhmm]
                    from push_service import send_web_push
                    subs = get_push_subscriptions()
                    for s in subs:
                        try:
                            send_web_push(s, {
                                "title": title,
                                "body": default_body,
                                "tag": f"scheduled-{current_hhmm}",
                                "target_view": "today"
                            })
                        except Exception as e:
                            status = getattr(getattr(e, "response", None), "status_code", None)
                            if status in [404, 410]:
                                delete_push_subscription(s["endpoint"])
        except asyncio.CancelledError:
            break
        except Exception:
            await asyncio.sleep(10)

@app.on_event("startup")
async def start_background_scheduler():
    asyncio.create_task(push_scheduler_loop())

@app.post("/api/reset-data")
def reset_data_endpoint():
    """Resets study data to fresh state for the real user."""
    reset_to_fresh_state()
    return {"status": "success", "message": "Database reset to clean production state."}

# Mount static files to serve the application directly from FastAPI
app.mount("/", StaticFiles(directory=".", html=True), name="static")

def get_lan_ip():
    """Detect local LAN IP for mobile access."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def ensure_ssl_certs():
    """Generates self-signed SSL certs for HTTPS on mobile LAN if requested."""
    cert_file = "cert.pem"
    key_file = "key.pem"
    if not (os.path.exists(cert_file) and os.path.exists(key_file)):
        print("Generating self-signed SSL certificates for mobile HTTPS access...")
        cmd = [
            "openssl", "req", "-x509", "-newkey", "rsa:2048",
            "-keyout", key_file, "-out", cert_file,
            "-days", "365", "-nodes",
            "-subj", "/CN=SSC-Study-Companion"
        ]
        subprocess.run(cmd, check=True)
        print("SSL certificates (cert.pem, key.pem) generated successfully.")
    return cert_file, key_file

if __name__ == "__main__":
    import uvicorn
    import argparse

    env_port = int(os.environ.get("PORT", 8000))
    parser = argparse.ArgumentParser(description="Run SSC CGL Study Companion Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host IP (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=env_port, help=f"Port (default: {env_port})")
    parser.add_argument("--ssl", action="store_true", help="Enable HTTPS with self-signed certificate")
    args = parser.parse_args()

    lan_ip = get_lan_ip()
    protocol = "https" if args.ssl else "http"

    print("=" * 68)
    print(" 🎯 SSC CGL Study Companion — Server Starting")
    print("=" * 68)
    print(f" 💻 Desktop Browser:  {protocol}://localhost:{args.port}")
    print(f" 📱 Mobile Phone LAN: {protocol}://{lan_ip}:{args.port}")
    if not args.ssl:
        print(" 💡 TIP FOR MOBILE NOTIFICATIONS:")
        print("    Run with '--ssl' for full mobile Service Worker & Push support:")
        print(f"    python3 server.py --ssl")
    print("=" * 68)

    if args.ssl:
        cert_path, key_path = ensure_ssl_certs()
        uvicorn.run(app, host=args.host, port=args.port, ssl_certfile=cert_path, ssl_keyfile=key_path)
    else:
        uvicorn.run(app, host=args.host, port=args.port)

