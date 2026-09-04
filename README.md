# 🎯 SSC CGL Study Companion (Production-Ready)

A dedicated, syllabus-driven daily study companion built for SSC CGL aspirants. Designed with mobile-first PWA capabilities, real Web Push notifications, an interactive Pomodoro timer with screen wake lock, live ticking clock with automatic day rollover, and SQLite WAL persistence.

---

## ✨ Core Features

### 1. 📱 Mobile PWA & True Web Push Notifications
- **Web Push API (VAPID)**: Delivers lock-screen notifications directly to Android Chrome and iOS Safari (PWA) even when the browser is closed or your device is asleep.
- **Service Worker (`sw.js`)**: Caches assets for offline resilience and handles background notification events.
- **Audio Chime & Vibration**: Multi-frequency chime via Web Audio API and vibration patterns (`navigator.vibrate`) for timer completion and study block alerts.
- **Screen Wake Lock**: Keeps your phone display awake during active focus sessions.

### 2. ⏰ Live Clock & Midnight Rollover
- **Real-Time Display**: Live day badge (`Friday`), full calendar date (`September 4, 2026`), and 12-hour ticking clock (`AM/PM`) with pulsating status indicator.
- **Device Wake & Midnight Rollover**: Listens to `visibilitychange` and 1-second ticks to automatically rollover tasks when a new day arrives without needing a manual page reload.

### 3. 📚 Syllabus & Foundation Tracking
- Aligned strictly with CGL Month 1 Foundation (Maths, Reasoning, English Vocab & Grammar, Lucent Static GK).
- Dynamic streak calculation and XP based strictly on real study sessions (no fake demo stats).
- Unfinished prior tasks carry over to the current day with a single tap.

---

## 🚀 Quick Deployment Guide

You can deploy this repository directly to free cloud platforms. Because modern mobile browsers require HTTPS for Service Workers and Push Notifications, cloud platforms provide free, trusted SSL certificates automatically!

### Option 1: Deploy to Render (Recommended — Free & 1-Click)

1. Go to [Render.com](https://render.com) and sign in with your GitHub account (`shyamsundar1439`).
2. Click **New +** → **Web Service**.
3. Select your repository: **`shyamsundar1439/tt`**.
4. Configure the service settings (or Render will automatically detect `render.yaml`):
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
5. Click **Create Web Service**.
6. Render will build and deploy your app with a public HTTPS URL (e.g., `https://cgl-companion.onrender.com`).
7. Open that URL on your phone, tap **Enable Mobile Notifications**, and add to your home screen!

---

### Option 2: Deploy to Railway / Fly.io / Koyeb

1. Link your GitHub repository `shyamsundar1439/tt`.
2. The included `Procfile` and `Dockerfile` are automatically recognized.
3. The platform provisions a secure `https://...` domain with trusted SSL certificates.

---

### Option 3: Run via Docker

```bash
# Build the Docker image
docker build -t ssc-study-companion .

# Run the container
docker run -d -p 8000:8000 --name study-app ssc-study-companion
```
Access at `http://localhost:8000`.

---

### Option 4: Run Locally on Your Computer & Mobile Phone

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run for local computer use:
python3 server.py

# 3. Or run for mobile phone access on your home Wi-Fi (with HTTPS for notifications):
python3 server.py --ssl
```
Open the LAN IP printed in your terminal (e.g., `https://192.168.1.184:8000`) on your mobile browser.

---

## ⚙️ Environment Variables (Optional)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Listening port injected by cloud hosts | `8000` |
| `VAPID_PUBLIC_KEY` | Optional custom VAPID public key | Auto-generated on startup |
| `VAPID_PRIVATE_KEY` | Optional custom VAPID private key | Auto-generated on startup |

---

## 📂 Project Structure

```
├── server.py              # FastAPI backend API & background push scheduler
├── database.py            # SQLite schema, WAL mode, daily task generation
├── push_service.py        # Web Push (VAPID) engine and FCM dispatch
├── app.js                 # Dynamic UI, live clock, timers, and push subscription
├── sw.js                  # Service Worker (offline cache, push event handler)
├── index.html             # Mobile-first responsive interface
├── styles.css             # Theme-aware CSS (dark/light)
├── manifest.json          # PWA installation manifest
├── requirements.txt       # Python dependencies
├── Procfile               # Cloud PaaS entrypoint
├── render.yaml            # Render deployment blueprint
├── Dockerfile             # Container configuration
└── syllabus.txt           # 3-Month SSC CGL Syllabus Master
```
