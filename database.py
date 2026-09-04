import sqlite3
import uuid
import os
from datetime import datetime, date, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "study.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    return conn

def init_db():
    """Initializes SQLite database schema safely without duplicate key conflicts."""
    conn = get_db()
    cursor = conn.cursor()

    # 1. Tasks table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        category TEXT NOT NULL,
        topic TEXT,
        priority TEXT NOT NULL, -- 'must', 'should', 'bonus'
        planned_time INTEGER NOT NULL DEFAULT 30,
        actual_time INTEGER NOT NULL DEFAULT 0,
        completed INTEGER NOT NULL DEFAULT 0,
        scheduled_date TEXT NOT NULL,
        completed_at TEXT,
        notes TEXT,
        created_at TEXT NOT NULL
    );
    """)

    # Index on scheduled_date for fast daily queries
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(scheduled_date);")

    # 2. Syllabus progress table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS syllabus_progress (
        month_key TEXT NOT NULL,
        subject_key TEXT NOT NULL,
        topic_idx INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
        updated_at TEXT NOT NULL,
        PRIMARY KEY (month_key, subject_key, topic_idx)
    );
    """)

    # 3. Study sessions (actual focus timer logs)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS study_sessions (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        subject TEXT NOT NULL,
        topic TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        session_date TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sessions_date ON study_sessions(session_date);")

    # 4. Daily energy check-in
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS daily_checkins (
        checkin_date TEXT PRIMARY KEY,
        energy INTEGER NOT NULL DEFAULT 4,
        sleep INTEGER NOT NULL DEFAULT 4,
        goal TEXT,
        focus_topic TEXT,
        created_at TEXT NOT NULL
    );
    """)

    # 5. Evening reviews & reflections
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS daily_reviews (
        review_date TEXT PRIMARY KEY,
        completed_summary TEXT,
        missed_summary TEXT,
        distraction TEXT,
        priority_next_day TEXT,
        created_at TEXT NOT NULL
    );
    """)

    # 6. Notification preferences & settings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notification_settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        enabled INTEGER NOT NULL DEFAULT 1,
        daily_task_reminder INTEGER NOT NULL DEFAULT 1,
        upcoming_session_reminder INTEGER NOT NULL DEFAULT 1,
        missed_task_reminder INTEGER NOT NULL DEFAULT 1,
        revision_due_reminder INTEGER NOT NULL DEFAULT 1,
        reminder_time TEXT NOT NULL DEFAULT '07:00',
        push_endpoint TEXT,
        updated_at TEXT NOT NULL
    );
    """)

    # 7. User profile (streak, XP)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        streak INTEGER NOT NULL DEFAULT 0,
        total_xp INTEGER NOT NULL DEFAULT 0,
        last_active_date TEXT,
        updated_at TEXT NOT NULL
    );
    """)

    # 8. Web Push subscriptions (for cross-device mobile & desktop push)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS push_subscriptions (
        endpoint TEXT PRIMARY KEY,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        user_agent TEXT,
        created_at TEXT NOT NULL,
        last_seen TEXT NOT NULL
    );
    """)

    conn.commit()

    # Seed singleton rows if missing
    cursor.execute("SELECT COUNT(*) FROM user_profile WHERE id = 1")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO user_profile (id, streak, total_xp, last_active_date, updated_at)
        VALUES (1, 0, 0, NULL, datetime('now'))
        """)

    cursor.execute("SELECT COUNT(*) FROM notification_settings WHERE id = 1")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO notification_settings (
            id, enabled, daily_task_reminder, upcoming_session_reminder,
            missed_task_reminder, revision_due_reminder, reminder_time, updated_at
        ) VALUES (1, 1, 1, 1, 1, 1, '07:00', datetime('now'))
        """)

    # Initialize Month 1 syllabus topics if empty
    cursor.execute("SELECT COUNT(*) FROM syllabus_progress WHERE month_key = 'month1'")
    if cursor.fetchone()[0] == 0:
        starter_progress = [
            # Maths
            ("month1", "maths", 0, "in_progress"), # Number system / Divisibility
            ("month1", "maths", 1, "pending"),
            ("month1", "maths", 2, "pending"),
            ("month1", "maths", 3, "pending"),
            ("month1", "maths", 4, "pending"),
            ("month1", "maths", 5, "pending"),
            ("month1", "maths", 6, "pending"),
            # Reasoning
            ("month1", "reasoning", 0, "in_progress"), # Analogy & Classification
            ("month1", "reasoning", 1, "pending"),
            ("month1", "reasoning", 2, "pending"),
            ("month1", "reasoning", 3, "pending"),
            ("month1", "reasoning", 4, "pending"),
            # English
            ("month1", "english", 0, "in_progress"), # Parts of speech
            ("month1", "english", 1, "pending"),
            ("month1", "english", 2, "pending"),
            ("month1", "english", 3, "pending"),
            ("month1", "english", 4, "in_progress"), # Daily Vocab
            # GK
            ("month1", "gk", 0, "in_progress"),     # Ancient & Medieval India
            ("month1", "gk", 1, "pending"),
            ("month1", "gk", 2, "pending"),
            ("month1", "gk", 3, "pending"),
        ]
        now_ts = datetime.now().isoformat()
        cursor.executemany("""
        INSERT OR IGNORE INTO syllabus_progress (month_key, subject_key, topic_idx, status, updated_at)
        VALUES (?, ?, ?, ?, ?)
        """, [(m, s, idx, st, now_ts) for m, s, idx, st in starter_progress])

    conn.commit()
    conn.close()

def ensure_daily_tasks_for_date(target_date_str=None):
    """
    Ensures that active study tasks exist for the given date (default: today).
    If no tasks exist, generates clean, uncompleted daily tasks aligned with Month 1 syllabus.
    Never fails on duplicate primary keys because unique UUIDs are generated each time.
    """
    if not target_date_str:
        target_date_str = date.today().isoformat()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM tasks WHERE scheduled_date = ?", (target_date_str,))
    count = cursor.fetchone()[0]

    if count == 0:
        now_ts = datetime.now().isoformat()
        starter_templates = [
            ("Maths: 40 Calculation & Arithmetic PYQs (BODMAS / Percentage)", "Maths", "maths", "Percentage & Simplification", "must", 75, "Morning Prime Sprint • Pinnacle/Kiran PYQs"),
            ("Reasoning: 35 Analogy, Series & Coding-Decoding Qs", "Reasoning", "reasoning", "Analogy & Series", "must", 50, "Evening Speed Block • Log any missed patterns in error book"),
            ("English: 25 High-Frequency Vocab Words + 10 Idioms", "English", "english", "Daily Vocabulary & Idioms", "must", 20, "Active recall flashcards • Synonyms/Antonyms/OWS"),
            ("History/GK: Ancient India Dynasties & Inscriptions mindmap", "GK/History", "gk", "Ancient India Dynasties", "should", 35, "Lucent static GK • Focus on Maurya & Gupta periods"),
            ("English: 1 Cloze Test Set (10 questions) + Grammar Rules", "English", "english", "Cloze Test & Grammar", "should", 25, "Application drill • Subject-verb agreement & prepositions"),
            ("Speed Math: 15-min Mental Arithmetic (Tables 1-30, Squares up to 50)", "Maths", "maths", "Mental Speed Math", "bonus", 15, "Cognitive warmup • Boost calculation speed")
        ]

        tasks_to_insert = [
            (f"task-{uuid.uuid4().hex[:8]}", title, sub, cat, top, prio, plan_m, 0, 0, target_date_str, None, notes, now_ts)
            for title, sub, cat, top, prio, plan_m, notes in starter_templates
        ]

        cursor.executemany("""
        INSERT INTO tasks (id, title, subject, category, topic, priority, planned_time, actual_time, completed, scheduled_date, completed_at, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, tasks_to_insert)

        conn.commit()

    conn.close()

def reset_to_fresh_state():
    """Resets all study data to a clean, fresh state for the real user starting today."""
    conn = get_db()
    cursor = conn.cursor()

    today_str = date.today().isoformat()

    cursor.execute("DELETE FROM tasks;")
    cursor.execute("DELETE FROM study_sessions;")
    cursor.execute("DELETE FROM daily_checkins;")
    cursor.execute("DELETE FROM daily_reviews;")
    cursor.execute("DELETE FROM syllabus_progress;")
    cursor.execute("UPDATE user_profile SET streak = 0, total_xp = 0, last_active_date = NULL, updated_at = datetime('now') WHERE id = 1;")
    cursor.execute("UPDATE notification_settings SET enabled = 1, daily_task_reminder = 1, upcoming_session_reminder = 1, missed_task_reminder = 1, revision_due_reminder = 1, reminder_time = '07:00', updated_at = datetime('now') WHERE id = 1;")

    conn.commit()
    conn.close()

    init_db()
    ensure_daily_tasks_for_date(today_str)
    print("Database reset to clean, production-ready state.")

def save_push_subscription(endpoint: str, p256dh: str, auth: str, user_agent: str = ""):
    """Saves or updates a Web Push subscription."""
    conn = get_db()
    cursor = conn.cursor()
    now_ts = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_agent, created_at, last_seen)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(endpoint) DO UPDATE SET
        p256dh = excluded.p256dh,
        auth = excluded.auth,
        user_agent = excluded.user_agent,
        last_seen = excluded.last_seen
    """, (endpoint, p256dh, auth, user_agent, now_ts, now_ts))
    conn.commit()
    conn.close()

def get_push_subscriptions():
    """Returns all registered push subscriptions as dicts."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT endpoint, p256dh, auth, user_agent FROM push_subscriptions")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "endpoint": r["endpoint"],
            "keys": {
                "p256dh": r["p256dh"],
                "auth": r["auth"]
            },
            "user_agent": r["user_agent"]
        }
        for r in rows
    ]

def delete_push_subscription(endpoint: str):
    """Deletes an invalid or expired push subscription."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM push_subscriptions WHERE endpoint = ?", (endpoint,))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    ensure_daily_tasks_for_date()
    print("Database verified successfully.")
