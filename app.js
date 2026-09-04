/**
 * Study Companion - Client Application Engine
 * Minimal, peaceful, productivity-first SSC CGL study system.
 * Persistent Backend (SQLite + FastAPI) + Mobile Push Notifications.
 */

// --- 1. FULL SYLLABUS DEFINITION (From syllabus.txt) ---
// Note: Tasks and schedule strictly contain syllabus chapters and revision. Zero mock tests.
const SYLLABUS_DATA = {
  month1: {
    name: "Month 1 (Sep)",
    title: "Foundation",
    focus: "Build basics, calculation speed, core grammar & daily vocab.",
    subjects: {
      maths: {
        name: "Quantitative Aptitude",
        code: "Maths",
        color: "var(--subject-math)",
        topics: [
          "Number system, divisibility & LCM/HCF",
          "Simplification, approximation & BODMAS",
          "Percentage & fraction equivalents",
          "Ratio & proportion, basic partnership",
          "Average & weighted average",
          "Profit & loss, discount basics",
          "Simple interest concepts"
        ]
      },
      reasoning: {
        name: "General Intelligence & Reasoning",
        code: "Reasoning",
        color: "var(--subject-reasoning)",
        topics: [
          "Analogy & classification (odd one out)",
          "Series (number, alphabet, mixed)",
          "Coding-decoding (basic pattern shifts)",
          "Direction sense & shortest distance",
          "Blood relations (family tree basics)"
        ]
      },
      english: {
        name: "English Language & Comprehension",
        code: "English",
        color: "var(--subject-english)",
        topics: [
          "Parts of speech: Noun, Pronoun, Verb rules",
          "Tenses: Present, Past, Future structures",
          "Subject-Verb Agreement non-negotiables",
          "Articles & basic preposition usage",
          "Daily Vocab: 20-25 words (Synonyms/Antonyms/OWS/Idioms)"
        ]
      },
      gk: {
        name: "General Awareness & History",
        code: "GK/GS",
        color: "var(--subject-gk)",
        topics: [
          "History: Ancient & Medieval India (Harappa, Maurya, Gupta, Sultanate)",
          "Geography: India physical features, river systems & climate",
          "Polity: Constitution preamble, Fundamental Rights & Duties",
          "Current Affairs: Monthly recap (schemes, sports, summits)"
        ]
      }
    }
  },
  month2: {
    name: "Month 2 (Oct)",
    title: "Arithmetic + Adv",
    focus: "Complete arithmetic, start advanced maths lightly, error-spotting & non-verbal.",
    subjects: {
      maths: {
        name: "Quantitative Aptitude",
        code: "Maths",
        color: "var(--subject-math)",
        topics: [
          "Compound interest & SI/CI differences",
          "Time & work, pipes & cisterns",
          "Time, speed & distance; trains, boats & streams",
          "Mixture & alligation techniques",
          "Statistics basics: mean, median, mode & simple DI",
          "Algebra: basic identities & linear equations",
          "Geometry: triangle theorems, lines & angles",
          "Mensuration 2D: perimeter & area of shapes"
        ]
      },
      reasoning: {
        name: "General Intelligence & Reasoning",
        code: "Reasoning",
        color: "var(--subject-reasoning)",
        topics: [
          "Syllogism (Venn diagram technique)",
          "Statements & conclusions / assumptions",
          "Mathematical reasoning & operator substitution",
          "Non-verbal: mirror & water images, embedded figures",
          "Paper folding & cutting patterns"
        ]
      },
      english: {
        name: "English Language & Comprehension",
        code: "English",
        color: "var(--subject-english)",
        topics: [
          "Error spotting: tense & agreement traps",
          "Sentence improvement & basic para jumbles",
          "Fill in the blanks (grammar + vocab based)",
          "Cloze test strategies (contextual clues)",
          "Vocab: 20-25 words daily + weekly review"
        ]
      },
      gk: {
        name: "General Awareness & History",
        code: "GK/GS",
        color: "var(--subject-gk)",
        topics: [
          "History: Modern India (1857-1947, freedom movements, INC sessions)",
          "Geography: Agriculture, mineral resources, transport & industries",
          "Polity: President, PM, Council of Ministers, Parliament, Judiciary",
          "Science: Basic physics (motion, force), chemistry (acids/bases), biology (cell)",
          "Current Affairs: Ongoing monthly capsules"
        ]
      }
    }
  },
  month3: {
    name: "Month 3 (Nov)",
    title: "Advanced + Tier 2",
    focus: "Complete full syllabus once; shift to Tier-2 level problem solving.",
    subjects: {
      maths: {
        name: "Quantitative Aptitude",
        code: "Maths",
        color: "var(--subject-math)",
        topics: [
          "Algebra: quadratic equations, polynomials, inequalities",
          "Geometry: similarity, congruence, circle chords & tangents",
          "Mensuration 3D: cube, cuboid, cylinder, cone, sphere",
          "Trigonometry: ratios, identities, heights & distances",
          "Statistics & probability concepts",
          "DI: tables, bar/line/pie charts, mixed sets"
        ]
      },
      reasoning: {
        name: "General Intelligence & Reasoning",
        code: "Reasoning",
        color: "var(--subject-reasoning)",
        topics: [
          "Puzzles & seating arrangement (linear, circular)",
          "Data sufficiency (numeric & logical)",
          "Logical Venn diagrams & advanced syllogisms",
          "Statement-argument & course of action",
          "Figural series, cube & dice, clocks & calendars"
        ]
      },
      english: {
        name: "English Language & Comprehension",
        code: "English",
        color: "var(--subject-english)",
        topics: [
          "Reading comprehension (long inference-based passages)",
          "Para jumbles (Tier-2 moderate to hard)",
          "Active-passive voice across all tenses",
          "Direct-indirect speech transformations",
          "Advanced idioms, phrases & one-word substitutions"
        ]
      },
      gk: {
        name: "General Awareness & History",
        code: "GK/GS",
        color: "var(--subject-gk)",
        topics: [
          "History: Post-independence events, PM tenures, wars & reforms",
          "Geography: World physical features, straits & climate zones",
          "Polity: Local self-gov, constitutional bodies, landmark amendments",
          "Economy: Inflation, GDP, RBI monetary policy, budget terms",
          "Science & Ecology: Human organ systems, diseases, environment basics"
        ]
      }
    }
  },
  month4: {
    name: "Month 4 (Dec)",
    title: "Revision & Speed",
    focus: "Consolidate, increase calculation speed & chapter-wise PYQs.",
    subjects: {
      maths: {
        name: "Quantitative Aptitude",
        code: "Maths",
        color: "var(--subject-math)",
        topics: [
          "Formula sheet rapid retrieval (Arithmetic + Advanced)",
          "PYQ chapter-wise speed drills (last 5 years)",
          "Weak-chapter remediation (CI, Geometry, DI)"
        ]
      },
      reasoning: {
        name: "General Intelligence & Reasoning",
        code: "Reasoning",
        color: "var(--subject-reasoning)",
        topics: [
          "Daily 1 sectional drill (30-45 min)",
          "High-weight speed drills (25 Qs in 18 minutes)",
          "Error log pattern resolution"
        ]
      },
      english: {
        name: "English Language & Comprehension",
        code: "English",
        color: "var(--subject-english)",
        topics: [
          "Daily: 1 RC + 1 cloze test + 1 error spotting set",
          "Complete rulebook revision (Voice, Narration, Parallelism)",
          "Vocab consolidation: 1000 high-frequency words review"
        ]
      },
      gk: {
        name: "General Awareness & History",
        code: "GK/GS",
        color: "var(--subject-gk)",
        topics: [
          "Static GK rapid flashcards (History, Polity, Geography)",
          "Current Affairs marathon: last 6-9 months capsules",
          "Sectional static GK drills"
        ]
      }
    }
  }
};

// --- 2. ACTIVE RECALL FLASHCARDS ---
const FLASHCARDS = [
  {
    category: "Maths - Shortcuts",
    q: "What are the common Pythagorean Triplets you must memorize instantly?",
    a: "• (3, 4, 5)\n• (5, 12, 13)\n• (7, 24, 25)\n• (8, 15, 17)\n• (9, 40, 41)\n• (11, 60, 61)\n• (12, 35, 37)\n• (20, 21, 29)",
    hint: "Essential for instant problem solving in Geometry and Mensuration."
  },
  {
    category: "Maths - Percentage Fractions",
    q: "Convert these crucial fractions to percentages: 1/7, 1/8, 1/9, 1/11, 1/12, 1/14, 1/16",
    a: "• 1/7 = 14.28% (14 2/7%)\n• 1/8 = 12.5%\n• 1/9 = 11.11% (11 1/9%)\n• 1/11 = 9.09% (9 1/11%)\n• 1/12 = 8.33%\n• 1/14 = 7.14%\n• 1/16 = 6.25%",
    hint: "Essential for speed in Simplification and Profit & Loss."
  },
  {
    category: "English - Confusing Words",
    q: "Distinguish: 'Appraise' vs 'Apprise' and 'Compliment' vs 'Complement'",
    a: "• Appraise = to evaluate or assess value.\n• Apprise = to inform or notify.\n• Compliment = praise or admiration.\n• Complement = something that completes or enhances.",
    hint: "Frequent SSC CGL Error-spotting and Fill-in-the-blank trap."
  },
  {
    category: "English - Idioms & Phrases",
    q: "Meanings of: 'Bite the bullet', 'Burn the midnight oil', 'Once in a blue moon', 'Face the music'",
    a: "• Bite the bullet = face a difficult situation with courage.\n• Burn the midnight oil = study/work late into the night.\n• Once in a blue moon = very rarely.\n• Face the music = accept the unpleasant consequences of one's actions.",
    hint: "Common idioms tested in CGL Tier 1."
  },
  {
    category: "History - Ancient India",
    q: "List the 4 Buddhist Councils: Venue, King/Patron, and Presiding Monk.",
    a: "1. Rajgriha (483 BC) – King Ajatashatru – Mahakassapa\n2. Vaishali (383 BC) – King Kalashoka – Sabakami\n3. Pataliputra (250 BC) – King Ashoka – Moggaliputta Tissa\n4. Kundalvana, Kashmir (72 AD) – King Kanishka – Vasumitra",
    hint: "High-frequency static GK question in SSC CGL."
  },
  {
    category: "History & Polity",
    q: "Key dates & Articles: Battle of Plassey, Battle of Buxar, Article 32, Article 51A",
    a: "• Battle of Plassey: 1757 (Robert Clive vs Siraj-ud-Daulah)\n• Battle of Buxar: 1764 (Hector Munro vs Mir Qasim, Shuja, Shah Alam II)\n• Article 32: Constitutional Remedies (Heart & Soul of Constitution)\n• Article 51A: Fundamental Duties (added by 42nd Amendment 1976)",
    hint: "Foundational Indian History & Constitution landmarks."
  },
  {
    category: "Reasoning - Positional Alphabet",
    q: "Quick recall: Opposites pairs (AZ, BY...) and E-J-O-T-Y values",
    a: "• E(5), J(10), O(15), T(20), Y(25)\n• Opposites (Sum=27): A-Z, B-Y, C-X, D-W, E-V, F-U, G-T, H-S, I-R, J-Q, K-P, L-O, M-N.\n(Mnemonic: 'UF LOVE BY SHIRT-G AZ PK-MN CX DW')",
    hint: "Enables solving Coding-Decoding and Series within 15 seconds."
  }
];

// --- 3. APPLICATION STATE ---
let AppState = {
  currentMonth: "month1",
  currentStatusFilter: "all",
  currentTaskPriorityFilter: "all",
  activeView: "today",
  activeStudyFocus: {
    subjectKey: "maths",
    subjectName: "Quantitative Aptitude",
    topicName: "Number system, divisibility & LCM/HCF",
    plannedMins: 35
  },
  tasks: [],
  priorUncompletedCount: 0,
  syllabusProgress: {},
  actualMinutes: { maths: 0, reasoning: 0, english: 0, gk: 0 },
  plannedMinutes: 280,
  dailyCheckIn: null,
  streak: 0,
  totalXp: 0,
  notificationSettings: {
    enabled: true,
    daily_task_reminder: true,
    upcoming_session_reminder: true,
    timer_alarm: true,
    missed_task_reminder: true,
    revision_due_reminder: true,
    reminder_time: "07:00"
  }
};

// --- 4. BACKEND API SYNC ---
async function fetchState() {
  try {
    const res = await fetch('/api/state');
    if (res.ok) {
      const data = await res.json();
      AppState.tasks = data.tasks || [];
      AppState.priorUncompletedCount = data.prior_uncompleted_count || 0;
      AppState.syllabusProgress = data.syllabus_progress || {};
      AppState.actualMinutes = data.actual_minutes || { maths: 0, reasoning: 0, english: 0, gk: 0 };
      AppState.plannedMinutes = data.planned_minutes || 280;
      AppState.dailyCheckIn = data.daily_checkin || null;
      AppState.streak = (data.streak !== undefined) ? data.streak : 0;
      AppState.totalXp = (data.total_xp !== undefined) ? data.total_xp : 0;
      AppState.notificationSettings = data.notification_settings || AppState.notificationSettings;

      // Update Prior Uncompleted Tasks Banner
      const priorBanner = document.getElementById("prior-rollover-banner");
      const priorText = document.getElementById("prior-banner-title");
      if (priorBanner) {
        if (AppState.priorUncompletedCount > 0) {
          priorBanner.style.display = "flex";
          if (priorText) priorText.textContent = `${AppState.priorUncompletedCount} Missed Task(s) Available From Prior Days`;
        } else {
          priorBanner.style.display = "none";
        }
      }

      // Cache locally for offline resilience
      localStorage.setItem("agy_cached_state", JSON.stringify(AppState));
      renderAll();
      return;
    }
  } catch (e) {
    console.warn("Backend not reachable, loading cached state:", e);
  }

  // Fallback to local storage
  const cached = localStorage.getItem("agy_cached_state");
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      AppState = Object.assign(AppState, parsed);
    } catch(err) {}
  }
  renderAll();
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(6px)";
    setTimeout(() => toast.remove(), 200);
  }, 2800);
}

// --- 5. TOP STUDY PULSE (ANSWERS THE 5 CORE QUESTIONS) ---
function updateStudyPulse() {
  const currentMonthData = SYLLABUS_DATA[AppState.currentMonth] || SYLLABUS_DATA.month1;

  let nowItem = null;
  let nextItem = null;

  // 1. What to study now?
  for (const [subKey, subData] of Object.entries(currentMonthData.subjects)) {
    subData.topics.forEach((topic, idx) => {
      const key = `${AppState.currentMonth}_${subKey}_${idx}`;
      const status = AppState.syllabusProgress[key] || "pending";
      if (status === "in_progress" && !nowItem) {
        nowItem = { subjectName: subData.name, topicName: topic, subKey, topicIdx: idx };
      }
    });
  }

  if (!nowItem) {
    for (const [subKey, subData] of Object.entries(currentMonthData.subjects)) {
      subData.topics.forEach((topic, idx) => {
        const key = `${AppState.currentMonth}_${subKey}_${idx}`;
        const status = AppState.syllabusProgress[key] || "pending";
        if (status === "pending" && !nowItem) {
          nowItem = { subjectName: subData.name, topicName: topic, subKey, topicIdx: idx };
        }
      });
      if (nowItem) break;
    }
  }

  // 3. What to study next?
  if (nowItem) {
    const subData = currentMonthData.subjects[nowItem.subKey];
    if (subData) {
      for (let i = nowItem.topicIdx + 1; i < subData.topics.length; i++) {
        const key = `${AppState.currentMonth}_${nowItem.subKey}_${i}`;
        const status = AppState.syllabusProgress[key] || "pending";
        if (status === "pending") {
          nextItem = { subjectName: subData.name, topicName: subData.topics[i] };
          break;
        }
      }
    }
  }

  if (!nextItem) {
    for (const [subKey, subData] of Object.entries(currentMonthData.subjects)) {
      if (nowItem && subKey === nowItem.subKey) continue;
      subData.topics.forEach((topic, idx) => {
        const key = `${AppState.currentMonth}_${subKey}_${idx}`;
        const status = AppState.syllabusProgress[key] || "pending";
        if (status === "pending" && !nextItem) {
          nextItem = { subjectName: subData.name, topicName: topic };
        }
      });
      if (nextItem) break;
    }
  }

  // Update DOM
  const nowTitle = document.getElementById("pulse-now-title");
  const nowMeta = document.getElementById("pulse-now-meta");
  const nextTitle = document.getElementById("pulse-next-title");
  const nextMeta = document.getElementById("pulse-next-meta");

  if (nowItem) {
    if (nowTitle) nowTitle.textContent = `${nowItem.subjectName}: ${nowItem.topicName}`;
    if (nowMeta) nowMeta.textContent = "Morning Focus Sprint • 35m planned";
    AppState.activeStudyFocus = {
      subjectKey: nowItem.subKey,
      subjectName: nowItem.subjectName,
      topicName: nowItem.topicName,
      plannedMins: 35
    };
  }

  if (nextItem) {
    if (nextTitle) nextTitle.textContent = `${nextItem.subjectName}: ${nextItem.topicName}`;
    if (nextMeta) nextMeta.textContent = "Next chapter in foundation syllabus";
  }

  // 5. Progress made today
  const totalActual = Object.values(AppState.actualMinutes).reduce((a, b) => a + b, 0);
  const totalPlanned = AppState.plannedMinutes || 280;
  const pct = Math.min(100, Math.round((totalActual / totalPlanned) * 100));
  const tasksDone = AppState.tasks.filter(t => t.completed).length;
  const totalTasks = AppState.tasks.length;

  const todayHours = document.getElementById("pulse-today-hours");
  const todayMeta = document.getElementById("pulse-today-meta");
  if (todayHours) {
    todayHours.innerHTML = `${(totalActual / 60).toFixed(1)} / ${(totalPlanned / 60).toFixed(1)} hrs <span class="pulse-percent">(${pct}%)</span>`;
  }
  if (todayMeta) {
    const streakText = AppState.streak > 0 ? `${AppState.streak}-day consistency` : "Day 1 start";
    todayMeta.textContent = `${tasksDone} of ${totalTasks} tasks completed today • ${streakText}`;
  }

  // Energy check-in status
  const energyBadge = document.getElementById("energy-badge-text");
  if (energyBadge) {
    if (AppState.dailyCheckIn) {
      const e = AppState.dailyCheckIn.energy || 4;
      const s = AppState.dailyCheckIn.sleep || 4;
      let label = "Steady High Focus";
      if (e <= 2 || s <= 2) label = "Restorative Mode Active";
      else if (e >= 5) label = "Peak Focus Day";
      energyBadge.textContent = `Energy: ${e}/5 • Sleep: ${s}/5 • ${label}`;
    } else {
      energyBadge.textContent = `Energy: Tap here for morning check-in & intention (+20 XP)`;
    }
  }

  // Badges
  const todayBadge = document.getElementById("tab-badge-today");
  if (todayBadge) todayBadge.textContent = `${tasksDone}/${totalTasks}`;
}

// --- 6. FOCUS TIMER ENGINE & SCREEN WAKE LOCK ---
let timerInterval = null;
let timerSecondsRemaining = 25 * 60;
let currentTimerDurationMins = 25;
let timerRunning = false;
let currentTimerTask = "Focused Study Session";
let timerTargetSubject = "maths";
let wakeLockSentinel = null;

async function requestScreenWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      const badge = document.getElementById('timer-wake-badge');
      if (badge) badge.style.display = 'inline-flex';
    } catch (err) {
      console.warn('Wake Lock request error:', err);
    }
  }
}

async function releaseScreenWakeLock() {
  if (wakeLockSentinel) {
    try {
      await wakeLockSentinel.release();
    } catch (e) {}
    wakeLockSentinel = null;
  }
  const badge = document.getElementById('timer-wake-badge');
  if (badge) badge.style.display = 'none';
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function setTimerPreset(mins, taskName = null, subject = null) {
  pauseTimer();
  currentTimerDurationMins = mins;
  timerSecondsRemaining = mins * 60;
  if (taskName) currentTimerTask = taskName;
  if (subject) timerTargetSubject = subject;

  const timerDigits = document.getElementById("timer-digits");
  if (timerDigits) timerDigits.textContent = formatTime(timerSecondsRemaining);

  document.querySelectorAll(".preset-chip").forEach(c => {
    c.classList.toggle("active", parseInt(c.dataset.mins, 10) === mins);
  });
}

function toggleTimer() {
  if (timerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  requestScreenWakeLock();

  const btnText = document.getElementById("btn-timer-toggle-text");
  if (btnText) btnText.textContent = "Pause Focus";

  timerInterval = setInterval(() => {
    if (timerSecondsRemaining > 0) {
      timerSecondsRemaining--;
      const timerDigits = document.getElementById("timer-digits");
      if (timerDigits) timerDigits.textContent = formatTime(timerSecondsRemaining);
    } else {
      pauseTimer();
      onTimerFinished();
    }
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  releaseScreenWakeLock();
  const btnText = document.getElementById("btn-timer-toggle-text");
  if (btnText) btnText.textContent = "Start Focus";
}

function resetTimer() {
  pauseTimer();
  setTimerPreset(currentTimerDurationMins || 25);
}

async function onTimerFinished() {
  const loggedMinutes = currentTimerDurationMins || 25;
  releaseScreenWakeLock();

  // Play alarm sound chime & vibrate mobile device
  playAlertChime();
  if ("vibrate" in navigator) {
    try { navigator.vibrate([300, 150, 300, 150, 500]); } catch (e) {}
  }

  const topicName = AppState.activeStudyFocus.topicName || currentTimerTask;

  // Deliver real system notification
  deliverNotification(
    "Focus Session Finished! 🎯",
    `Great job! You completed ${loggedMinutes}m of focused study on ${topicName}. Take a 5-minute break!`,
    "today",
    "ssc-timer-finish"
  );

  try {
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: timerTargetSubject,
        topic: topicName,
        duration_minutes: loggedMinutes
      })
    });
  } catch (e) {
    console.warn("Session logging offline:", e);
  }

  AppState.actualMinutes[timerTargetSubject] = (AppState.actualMinutes[timerTargetSubject] || 0) + loggedMinutes;
  showToast(`Focus session recorded: ${loggedMinutes}m permanently saved (+25 XP)!`);
  fetchState();
}

// --- 7. TASKS ENGINE (STRICTLY SYLLABUS TOPICS, NO MOCKS) ---
function setTaskPriorityFilter(priority) {
  AppState.currentTaskPriorityFilter = priority;
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.priority === priority);
  });
  renderTaskList();
}

function renderTaskList() {
  const container = document.getElementById("tasks-container");
  if (!container) return;

  const currentFilter = AppState.currentTaskPriorityFilter || "all";
  const filtered = AppState.tasks.filter(t => {
    if (currentFilter === "all") return true;
    return t.priority === currentFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem;">No tasks under this priority.</div>`;
    return;
  }

  container.innerHTML = filtered.map(t => `
    <div class="task-card ${t.completed ? 'is-done' : ''}">
      <div class="task-check-circle ${t.completed ? 'completed' : ''}" onclick="toggleTaskCompletion('${t.id}')" title="Mark Complete">
        ${t.completed ? '✓' : ''}
      </div>
      <div class="task-body">
        <div class="task-header-row">
          <span class="task-title" onclick="toggleTaskCompletion('${t.id}')">${t.title}</span>
          <span class="task-priority-tag ${t.priority}">${t.priority}</span>
        </div>
        <div class="task-meta-row">
          <span>${t.subject}</span>
          <span>•</span>
          <span>${t.planned_time}m planned</span>
          ${t.actual_time > 0 ? `<span>•</span><span style="color: var(--status-completed); font-weight: 600;">${t.actual_time}m logged</span>` : ''}
          ${t.notes ? `<span>•</span><span>${t.notes}</span>` : ''}
        </div>
      </div>
      <div class="task-actions-group">
        ${!t.completed ? `
          <button class="btn-task-icon" onclick="rescheduleTask('${t.id}')" title="Rollover to tomorrow (Zero guilt!)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </button>
        ` : ''}
        <button class="btn-task-icon" onclick="deleteTask('${t.id}')" title="Delete Task">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `).join("");
}

async function toggleTaskCompletion(taskId) {
  try {
    const res = await fetch(`/api/tasks/${taskId}/toggle`, { method: 'PUT' });
    if (res.ok) {
      const data = await res.json();
      showToast(data.completed ? "Task completed! Actual study time recorded." : "Task marked pending.");
      fetchState();
      return;
    }
  } catch (e) {
    console.warn("Offline toggle:", e);
  }

  const task = AppState.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    renderTaskList();
  }
}

async function rescheduleTask(taskId) {
  try {
    const res = await fetch(`/api/tasks/${taskId}/rollover`, { method: 'POST' });
    if (res.ok) {
      showToast("Missed task rolled over to tomorrow's priority buffer.");
      fetchState();
      return;
    }
  } catch (e) {
    console.warn("Offline rollover:", e);
  }
}

async function deleteTask(taskId) {
  if (confirm("Remove this study task?")) {
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      fetchState();
    } catch (e) {
      AppState.tasks = AppState.tasks.filter(t => t.id !== taskId);
      renderTaskList();
    }
  }
}

function openAddTaskModal() {
  const modal = document.getElementById("add-task-modal");
  if (modal) modal.classList.add("open");
}

function closeAddTaskModal() {
  const modal = document.getElementById("add-task-modal");
  if (modal) modal.classList.remove("open");
}

async function submitNewTask() {
  const title = document.getElementById("new-task-title").value.trim();
  const subject = document.getElementById("new-task-subject").value;
  const priority = document.getElementById("new-task-priority").value;
  const time = parseInt(document.getElementById("new-task-time").value, 10) || 30;
  const notes = document.getElementById("new-task-notes").value.trim();

  if (!title) {
    alert("Please enter a task description.");
    return;
  }

  const categoryMap = { "Maths": "maths", "Reasoning": "reasoning", "English": "english", "GK/History": "gk" };

  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        subject: subject,
        category: categoryMap[subject] || "maths",
        priority: priority,
        planned_time: time,
        notes: notes
      })
    });
    if (res.ok) {
      closeAddTaskModal();
      showToast(`Added: ${title}`);
      fetchState();
      return;
    }
  } catch (e) {
    console.warn("Offline task add:", e);
  }

  closeAddTaskModal();
}

// --- 8. SYLLABUS PROGRESSION ENGINE ---
function setPhaseMonth(monthKey) {
  AppState.currentMonth = monthKey;
  renderSyllabusHierarchy();
}

function filterSyllabus(status) {
  AppState.currentStatusFilter = status;
  renderSyllabusHierarchy();
}

function getTopicStatus(monthKey, subKey, idx) {
  const key = `${monthKey}_${subKey}_${idx}`;
  return AppState.syllabusProgress[key] || "pending";
}

async function setTopicStatus(monthKey, subKey, idx, status) {
  const key = `${monthKey}_${subKey}_${idx}`;
  AppState.syllabusProgress[key] = status;

  try {
    await fetch(`/api/syllabus/${monthKey}/${subKey}/${idx}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch (e) {
    console.warn("Offline syllabus update:", e);
  }

  if (status === "in_progress") {
    const monthData = SYLLABUS_DATA[monthKey];
    const subData = monthData.subjects[subKey];
    AppState.activeStudyFocus = {
      subjectKey: subKey,
      subjectName: subData.name,
      topicName: subData.topics[idx],
      plannedMins: 35
    };
    showToast(`Set as Current Study Focus: ${subData.topics[idx]}`);
    switchView('today');
  } else {
    showToast(status === "completed" ? "Topic completed and saved!" : "Topic status updated.");
    fetchState();
  }
}

function cycleTopicStatus(monthKey, subKey, idx) {
  const current = getTopicStatus(monthKey, subKey, idx);
  let next = "in_progress";
  if (current === "in_progress") next = "completed";
  else if (current === "completed") next = "pending";
  else if (current === "pending") next = "in_progress";

  setTopicStatus(monthKey, subKey, idx, next);
}

function renderSyllabusHierarchy() {
  const monthKey = AppState.currentMonth || "month1";
  const monthData = SYLLABUS_DATA[monthKey] || SYLLABUS_DATA.month1;

  // Update tabs
  document.querySelectorAll(".month-btn").forEach(btn => {
    const isSelected = btn.dataset.month === monthKey;
    btn.classList.toggle("active", isSelected);
    btn.setAttribute("aria-selected", isSelected ? "true" : "false");
  });

  const targetDesc = document.getElementById("phase-target-description");
  if (targetDesc) {
    targetDesc.innerHTML = `<strong>${monthData.name} Target:</strong> ${monthData.focus}`;
  }

  let totalTopics = 0;
  let completedTopics = 0;
  let inProgressTopics = 0;
  let pendingTopics = 0;
  const subjectStats = {};

  for (const [subKey, subData] of Object.entries(monthData.subjects)) {
    let subCompleted = 0;
    let subTotal = subData.topics.length;
    totalTopics += subTotal;

    subData.topics.forEach((topic, idx) => {
      const st = getTopicStatus(monthKey, subKey, idx);
      if (st === "completed") {
        completedTopics++;
        subCompleted++;
      } else if (st === "in_progress") {
        inProgressTopics++;
      } else {
        pendingTopics++;
      }
    });

    subjectStats[subKey] = {
      name: subData.code,
      completed: subCompleted,
      total: subTotal,
      pct: Math.round((subCompleted / subTotal) * 100)
    };
  }

  const overallPct = Math.round((completedTopics / Math.max(totalTopics, 1)) * 100);

  const progressText = document.getElementById("syllabus-progress-text");
  const progressBar = document.getElementById("syllabus-main-progress");
  const tabBadge = document.getElementById("tab-badge-syllabus");

  if (progressText) progressText.textContent = `${completedTopics} of ${totalTopics} topics completed (${overallPct}%)`;
  if (progressBar) progressBar.style.width = `${overallPct}%`;
  if (tabBadge) tabBadge.textContent = `${completedTopics}/${totalTopics}`;

  const subjectPillsContainer = document.getElementById("subject-stat-pills");
  if (subjectPillsContainer) {
    subjectPillsContainer.innerHTML = Object.entries(subjectStats).map(([key, stat]) => `
      <div class="subject-pill">
        <div class="subject-pill-head">
          <span class="subject-pill-name">${stat.name}</span>
          <span class="subject-pill-val">${stat.completed}/${stat.total} (${stat.pct}%)</span>
        </div>
        <div class="subject-pill-bar">
          <div class="subject-pill-fill" style="width: ${stat.pct}%; background: var(--subject-${key});"></div>
        </div>
      </div>
    `).join("");
  }

  // Filter Buttons with counts
  const filterBtns = document.querySelectorAll(".status-filter-btn");
  filterBtns.forEach(btn => {
    const filter = btn.dataset.status;
    btn.classList.toggle("active", filter === AppState.currentStatusFilter);
    if (filter === "all") btn.textContent = `All (${totalTopics})`;
    if (filter === "in_progress") btn.textContent = `Studying Now (${inProgressTopics})`;
    if (filter === "pending") btn.textContent = `Remaining (${pendingTopics})`;
    if (filter === "completed") btn.textContent = `Completed (${completedTopics})`;
  });

  const treeContainer = document.getElementById("syllabus-subjects-container");
  if (!treeContainer) return;

  const currentFilter = AppState.currentStatusFilter || "all";
  let treeHtml = "";

  for (const [subKey, subData] of Object.entries(monthData.subjects)) {
    const filteredTopicIndices = [];
    subData.topics.forEach((topic, idx) => {
      const st = getTopicStatus(monthKey, subKey, idx);
      if (currentFilter === "all" || st === currentFilter) {
        filteredTopicIndices.push(idx);
      }
    });

    if (filteredTopicIndices.length === 0 && currentFilter !== "all") continue;

    const subStat = subjectStats[subKey];

    treeHtml += `
      <div class="subject-group">
        <div class="subject-group-header">
          <div class="subject-title-area">
            <span class="subject-group-title" style="color: ${subData.color};">${subData.name}</span>
            <span class="subject-group-count">${subData.topics.length} topics</span>
          </div>
          <div class="subject-group-progress">
            ${subStat.completed} of ${subStat.total} completed (${subStat.pct}%)
          </div>
        </div>

        <div class="topic-list">
          ${filteredTopicIndices.map(idx => {
            const topic = subData.topics[idx];
            const status = getTopicStatus(monthKey, subKey, idx);
            const isCompleted = status === "completed";
            const isInProgress = status === "in_progress";

            let statusLabel = "Remaining";
            if (isCompleted) statusLabel = "Completed";
            if (isInProgress) statusLabel = "Studying Now";

            return `
              <div class="topic-item ${isCompleted ? 'is-completed' : ''} ${isInProgress ? 'is-active-focus' : ''}">
                <div class="topic-main-info">
                  <button 
                    class="topic-status-toggle ${status}" 
                    onclick="cycleTopicStatus('${monthKey}', '${subKey}', ${idx})" 
                    title="Click to cycle: Pending → Studying Now → Completed">
                    ${isCompleted ? '✓' : ''}
                  </button>
                  <span class="topic-name" onclick="cycleTopicStatus('${monthKey}', '${subKey}', ${idx})">${topic}</span>
                </div>

                <div class="topic-meta-tags">
                  <span 
                    class="topic-status-badge ${status}" 
                    onclick="cycleTopicStatus('${monthKey}', '${subKey}', ${idx})"
                    title="Click to toggle status">
                    ${statusLabel}
                  </span>
                  ${!isCompleted ? `
                    <button class="btn-topic-focus" onclick="setTopicStatus('${monthKey}', '${subKey}', ${idx}, 'in_progress')" title="Focus on this topic">
                      Focus (25m)
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  treeContainer.innerHTML = treeHtml || `<div style="text-align:center; padding: 32px; color: var(--text-muted); font-size: 0.85rem;">No topics match the selected filter.</div>`;
}

// --- 9. PROGRESS VIEW (WEEKLY ANALYTICS & WEAK-TOPIC ANALYSIS) ---
async function loadWeeklyProgress() {
  try {
    const res = await fetch('/api/progress/weekly');
    if (res.ok) {
      const data = await res.json();
      renderProgressView(data);
      return;
    }
  } catch (e) {
    console.warn("Offline weekly progress:", e);
  }
}

function renderProgressView(data) {
  const totalActual = Object.values(AppState.actualMinutes).reduce((a, b) => a + b, 0);
  const tasksDone = AppState.tasks.filter(t => t.completed).length;
  const compRate = Math.round((tasksDone / Math.max(AppState.tasks.length, 1)) * 100);

  const hoursTodayEl = document.getElementById("progress-hours-today");
  const compRateEl = document.getElementById("progress-completion-rate");
  const streakEl = document.getElementById("progress-streak-num");
  const xpEl = document.getElementById("progress-xp-num");

  if (hoursTodayEl) hoursTodayEl.textContent = `${(totalActual / 60).toFixed(1)}h`;
  if (compRateEl) compRateEl.textContent = `${compRate}%`;
  if (streakEl) streakEl.textContent = `${AppState.streak} Days`;
  if (xpEl) xpEl.textContent = `${AppState.totalXp}`;

  // Subject breakdown
  const subList = document.getElementById("progress-subject-list");
  if (subList) {
    const subjects = [
      { key: "maths", name: "Quantitative Aptitude", planned: 90, color: "var(--subject-math)" },
      { key: "reasoning", name: "Reasoning", planned: 60, color: "var(--subject-reasoning)" },
      { key: "english", name: "English", planned: 45, color: "var(--subject-english)" },
      { key: "gk", name: "History / GK", planned: 60, color: "var(--subject-gk)" }
    ];

    subList.innerHTML = subjects.map(s => {
      const act = AppState.actualMinutes[s.key] || 0;
      const subPct = Math.min(100, Math.round((act / s.planned) * 100));
      return `
        <div class="sub-progress-row">
          <div class="sub-progress-meta">
            <span class="sub-name">${s.name}</span>
            <span class="sub-time">${act}m / ${s.planned}m (${subPct}%)</span>
          </div>
          <div class="sub-bar-wrap">
            <div class="sub-bar-fill" style="width: ${subPct}%; background: ${s.color};"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // 7-Day Consistency Chart
  const chartBars = document.getElementById("progress-chart-bars");
  if (chartBars && data.weekly_history) {
    chartBars.innerHTML = data.weekly_history.map(w => `
      <div class="chart-bar-col">
        <div class="bar-val">${w.actualHours}h</div>
        <div class="bar-stick" style="height: ${Math.min(75, Math.round((w.actualHours / 6) * 65))}px;"></div>
        <div class="bar-day">${w.day}</div>
      </div>
    `).join("");
  }

  // Weak Topic Analysis
  const weakContainer = document.getElementById("progress-weak-topics");
  const recContainer = document.getElementById("progress-weak-recommendation");
  if (weakContainer && data.weak_topic_analysis) {
    weakContainer.innerHTML = data.weak_topic_analysis.weak_topics.map(t => `
      <div class="weak-topic-item">
        <span>⚠️</span>
        <span>${t}</span>
      </div>
    `).join("");
    if (recContainer) {
      recContainer.textContent = data.weak_topic_analysis.recommendation;
    }
  }
}

// --- 10. COLLEGE GAP RECOMMENDER ENGINE ---
const COLLEGE_GAP_MATRIX = {
  15: {
    english: {
      title: "15-Min Rapid Vocab & Idioms Sprint",
      desc: "Review 20 high-frequency CGL words + 5 idioms using active recall. Perfect for short class intervals.",
      badge: "Fast Active Recall",
      mins: 15
    },
    history: {
      title: "15-Min Ancient Dynasty Timeline Sprint",
      desc: "Rapidly recall Maurya/Gupta capitals, kings, and inscriptions without looking at notes.",
      badge: "Micro-Retrieval",
      mins: 15
    }
  },
  30: {
    english: {
      title: "30-Min Cloze Test & Grammar Rule Drill",
      desc: "Solve 1 Cloze test passage (10 questions) + review 5 tricky Preposition/Subject-Verb agreement rules.",
      badge: "Focused Practice",
      mins: 30
    },
    history: {
      title: "30-Min Modern India Movements Timeline",
      desc: "Chronologically list INC sessions (1885–1947), Swadeshi, Non-Cooperation, and Civil Disobedience milestones.",
      badge: "High-Yield Notes",
      mins: 30
    }
  },
  45: {
    english: {
      title: "45-Min Reading Comprehension & Voice/Narration",
      desc: "Solve 1 long Tier-2 comprehension passage with tone analysis + 15 voice transformation drills.",
      badge: "Deep College Sprint",
      mins: 45
    },
    history: {
      title: "45-Min Static GK & PYQ Solving",
      desc: "Attempt 30 Lucent/PYQ static GK questions on Medieval battles, Delhi Sultanate administration & Mughal monuments.",
      badge: "Intensive Retrieval",
      mins: 45
    }
  }
};

let currentGapTime = 15;
let currentGapSubject = "english";

function initCollegeGapRecommender() {
  const timeBtns = document.querySelectorAll(".gap-time-btn");
  const subBtns = document.querySelectorAll(".gap-sub-btn");
  const startSprintBtn = document.getElementById("btn-start-gap-sprint");

  timeBtns.forEach(btn => {
    btn.onclick = () => {
      timeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentGapTime = parseInt(btn.dataset.time, 10);
      renderCollegeGapRecommendation();
    };
  });

  subBtns.forEach(btn => {
    btn.onclick = () => {
      subBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentGapSubject = btn.dataset.sub;
      renderCollegeGapRecommendation();
    };
  });

  if (startSprintBtn) {
    startSprintBtn.onclick = () => {
      const rec = COLLEGE_GAP_MATRIX[currentGapTime][currentGapSubject];
      setTimerPreset(rec.mins, `College Gap: ${rec.title}`, currentGapSubject === "english" ? "english" : "gk");
      startTimer();
      showToast(`Started ${rec.mins}m sprint: ${rec.title}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }

  renderCollegeGapRecommendation();
}

function renderCollegeGapRecommendation() {
  const rec = COLLEGE_GAP_MATRIX[currentGapTime][currentGapSubject];
  const titleEl = document.getElementById("gap-rec-title");
  const descEl = document.getElementById("gap-rec-desc");
  const badgeEl = document.getElementById("gap-rec-badge");

  if (titleEl) titleEl.textContent = rec.title;
  if (descEl) descEl.textContent = rec.desc;
  if (badgeEl) badgeEl.textContent = rec.badge;
}

// --- 11. ACTIVE RECALL FLASHCARDS ---
let currentFlashcardIndex = 0;
let flashcardAnswerVisible = false;

function openFlashcardModal() {
  const modal = document.getElementById("flashcard-modal");
  if (modal) modal.classList.add("open");
  renderFlashcardCard();
}

function closeFlashcardModal() {
  const modal = document.getElementById("flashcard-modal");
  if (modal) modal.classList.remove("open");
}

function renderFlashcardCard() {
  const card = FLASHCARDS[currentFlashcardIndex];
  const tagEl = document.getElementById("fc-tag");
  const counterEl = document.getElementById("fc-counter");
  const questionEl = document.getElementById("fc-question");
  const answerEl = document.getElementById("fc-answer");
  const hintEl = document.getElementById("fc-hint");

  if (tagEl) tagEl.textContent = card.category;
  if (counterEl) counterEl.textContent = `${currentFlashcardIndex + 1} / ${FLASHCARDS.length}`;
  if (questionEl) questionEl.textContent = card.q;
  if (answerEl) {
    answerEl.innerText = card.a;
    answerEl.style.display = flashcardAnswerVisible ? "block" : "none";
  }
  if (hintEl) {
    hintEl.textContent = flashcardAnswerVisible ? "Tap card to hide answer" : "Tap anywhere on this card to reveal answer";
  }
}

function toggleFlashcardAnswer() {
  flashcardAnswerVisible = !flashcardAnswerVisible;
  const answerEl = document.getElementById("fc-answer");
  const hintEl = document.getElementById("fc-hint");
  if (answerEl) answerEl.style.display = flashcardAnswerVisible ? "block" : "none";
  if (hintEl) hintEl.textContent = flashcardAnswerVisible ? "Tap card to hide answer" : "Tap anywhere on this card to reveal answer";
}

function nextFlashcard(known = true) {
  flashcardAnswerVisible = false;
  currentFlashcardIndex = (currentFlashcardIndex + 1) % FLASHCARDS.length;
  renderFlashcardCard();
}

// --- 12. MOBILE PUSH NOTIFICATIONS, ALARMS & SOUND ENGINE ---

// Web Audio API Sound Chime (100% offline, zero external dependencies)
function playAlertChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Two-tone bell harmonic chime (D5 -> A5)
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880.00, now + 0.12); // A5

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);
  } catch (e) {
    console.warn("Chime audio error:", e);
  }
}

async function initNotifications() {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log("Service worker active for mobile study alerts:", reg.scope);
    } catch (e) {
      console.warn("Service worker registration error:", e);
    }
  }

  // Update UI with current permission state
  if ('Notification' in window) {
    updateNotificationPermissionUI(Notification.permission);
    if (Notification.permission === 'granted') {
      subscribeToPushManager();
    }
  } else {
    updateNotificationPermissionUI('unsupported');
  }

  // Monitor scheduled alert times (Morning reminder + Study blocks)
  setInterval(checkScheduledAlerts, 25000);
}

function updateNotificationPermissionUI(permission) {
  const badgePill = document.getElementById("notif-badge-pill");
  const permBtn = document.getElementById("btn-request-perm");
  const modalStatus = document.getElementById("modal-notif-perm-status");
  const modalGrantBtn = document.getElementById("modal-btn-grant-perm");

  if (permission === 'granted') {
    if (badgePill) {
      badgePill.textContent = "Active • Allowed";
      badgePill.className = "notif-pill active";
    }
    if (permBtn) {
      permBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Notifications Enabled</span>
      `;
      permBtn.style.background = "var(--status-completed)";
    }
    if (modalStatus) {
      modalStatus.textContent = "Allowed by mobile browser (Active)";
      modalStatus.style.color = "var(--status-completed)";
    }
    if (modalGrantBtn) {
      modalGrantBtn.style.display = "none";
    }
  } else if (permission === 'denied') {
    if (badgePill) {
      badgePill.textContent = "Blocked by Browser";
      badgePill.className = "notif-pill blocked";
    }
    if (permBtn) {
      permBtn.innerHTML = `<span>Permission Blocked</span>`;
      permBtn.style.background = "var(--priority-must)";
    }
    if (modalStatus) {
      modalStatus.textContent = "Blocked in browser permissions (Tap lock icon in address bar to allow)";
      modalStatus.style.color = "var(--priority-must)";
    }
    if (modalGrantBtn) {
      modalGrantBtn.style.display = "inline-block";
      modalGrantBtn.textContent = "Help";
      modalGrantBtn.onclick = () => alert("To allow notifications: Tap the lock icon or tune icon in your mobile browser address bar -> Permissions -> Notifications -> Set to Allow.");
    }
  } else {
    // 'default' / prompt needed
    if (badgePill) {
      badgePill.textContent = "Tap Enable Below";
      badgePill.className = "notif-pill";
    }
    if (permBtn) {
      permBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span>Enable Mobile Notifications</span>
      `;
      permBtn.style.background = "var(--accent)";
    }
    if (modalStatus) {
      modalStatus.textContent = "Not yet granted. Tap Allow to activate alerts.";
      modalStatus.style.color = "var(--text-secondary)";
    }
    if (modalGrantBtn) {
      modalGrantBtn.style.display = "inline-block";
      modalGrantBtn.textContent = "Allow";
    }
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeToPushManager() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.ready;
    const res = await fetch('/api/notifications/vapid-public-key');
    if (!res.ok) return null;
    const { publicKey } = await res.json();
    if (!publicKey) return null;

    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      const convertedKey = urlBase64ToUint8Array(publicKey);
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });
    }

    if (sub) {
      const rawP256dh = sub.getKey ? sub.getKey('p256dh') : null;
      const rawAuth = sub.getKey ? sub.getKey('auth') : null;
      if (rawP256dh && rawAuth) {
        const p256dhStr = btoa(String.fromCharCode.apply(null, new Uint8Array(rawP256dh)));
        const authStr = btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuth)));
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: sub.endpoint,
            keys: {
              p256dh: p256dhStr,
              auth: authStr
            },
            user_agent: navigator.userAgent
          })
        });
        console.log("Web Push device successfully registered with backend.");
      }
      return sub;
    }
  } catch (err) {
    console.warn("Web Push registration error:", err);
  }
  return null;
}

async function sendServerPushTest() {
  showToast("Triggering real Web Push from cloud server...");
  try {
    const res = await fetch('/api/notifications/send-webpush-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: "🎯 SSC CGL Study Sprint Call",
        body: "Daily revision is due! Click to open your CGL study plan.",
        target_view: "today"
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`🚀 Web Push dispatched to ${data.sent} device(s)! Check phone lock screen.`);
    } else {
      showToast(`⚠️ ${data.message || "Push test incomplete."}`);
    }
  } catch (e) {
    showToast("❌ Could not connect to Push server.");
  }
}

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showToast("Notifications not supported in this browser.");
    return;
  }

  try {
    const perm = await Notification.requestPermission();
    updateNotificationPermissionUI(perm);
    if (perm === 'granted') {
      showToast("✅ Notifications enabled!");
      subscribeToPushManager();
      deliverNotification(
        "Study Notifications Active 🎯",
        "You will receive daily syllabus reminders and focus timer alerts on this device.",
        "today",
        "ssc-welcome"
      );
    } else if (perm === 'denied') {
      showToast("❌ Notifications blocked in browser permissions.");
    }
  } catch (err) {
    console.warn("Notification permission error:", err);
  }
}

function openNotificationModal() {
  const modal = document.getElementById("notification-modal");
  if (modal) modal.classList.add("open");

  if ('Notification' in window) {
    updateNotificationPermissionUI(Notification.permission);
  }

  // Load preferences into inputs
  const s = AppState.notificationSettings;
  const master = document.getElementById("notif-master-enable");
  const daily = document.getElementById("notif-opt-daily");
  const upcoming = document.getElementById("notif-opt-upcoming");
  const timerAlarm = document.getElementById("notif-opt-timer");
  const missed = document.getElementById("notif-opt-missed");
  const revision = document.getElementById("notif-opt-revision");
  const timeInput = document.getElementById("notif-time-input");

  if (master) master.checked = s.enabled;
  if (daily) daily.checked = s.daily_task_reminder;
  if (upcoming) upcoming.checked = s.upcoming_session_reminder;
  if (timerAlarm) timerAlarm.checked = s.timer_alarm !== false;
  if (missed) missed.checked = s.missed_task_reminder;
  if (revision) revision.checked = s.revision_due_reminder;
  if (timeInput) timeInput.value = s.reminder_time || "07:00";

  handleMasterNotifToggle();
}

function closeNotificationModal() {
  const modal = document.getElementById("notification-modal");
  if (modal) modal.classList.remove("open");
}

function handleMasterNotifToggle() {
  const master = document.getElementById("notif-master-enable");
  const subgroup = document.getElementById("notif-subgroup");
  if (subgroup && master) {
    subgroup.style.opacity = master.checked ? "1" : "0.4";
    subgroup.style.pointerEvents = master.checked ? "auto" : "none";
  }
}

async function saveNotificationSettings() {
  const master = document.getElementById("notif-master-enable").checked;
  const daily = document.getElementById("notif-opt-daily").checked;
  const upcoming = document.getElementById("notif-opt-upcoming").checked;
  const timerAlarm = document.getElementById("notif-opt-timer") ? document.getElementById("notif-opt-timer").checked : true;
  const missed = document.getElementById("notif-opt-missed").checked;
  const revision = document.getElementById("notif-opt-revision").checked;
  const timeVal = document.getElementById("notif-time-input").value || "07:00";

  if (master && "Notification" in window && Notification.permission !== "granted") {
    await requestNotificationPermission();
  }

  const payload = {
    enabled: master,
    daily_task_reminder: daily,
    upcoming_session_reminder: upcoming,
    timer_alarm: timerAlarm,
    missed_task_reminder: missed,
    revision_due_reminder: revision,
    reminder_time: timeVal
  };

  AppState.notificationSettings = payload;

  try {
    await fetch('/api/notifications/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn("Offline notif settings save:", e);
  }

  closeNotificationModal();
  showToast("Notification preferences saved.");
  updateNotificationStatusText();
}

function updateNotificationStatusText() {
  const textEl = document.getElementById("notif-quick-status-text");
  const indicator = document.getElementById("notif-indicator");
  const s = AppState.notificationSettings;

  if (textEl) {
    textEl.textContent = s.enabled
      ? `Notifications: Active • Daily reminder at ${s.reminder_time}`
      : "Notifications: Disabled";
  }
  if (indicator) {
    indicator.classList.toggle("active", s.enabled);
  }
}

// Scheduled study blocks and morning reminder monitor
function checkScheduledAlerts() {
  if (!AppState.notificationSettings.enabled) return;

  const now = new Date();
  const todayDateStr = now.toISOString().slice(0, 10);
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

  const s = AppState.notificationSettings;

  // 1. Daily morning reminder at user's configured time
  if (s.daily_task_reminder && currentTimeStr === (s.reminder_time || "07:00")) {
    const key = `ssc_alert_daily_${todayDateStr}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "1");
      triggerDueTaskNotification();
    }
  }

  // 2. Study Block Reminders (Aligned with Scientific Routine)
  if (s.upcoming_session_reminder) {
    // 05:15 AM - Morning Prime Block
    if (currentTimeStr === "05:15") {
      const key = `ssc_alert_block_morning_${todayDateStr}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        deliverNotification("🌅 Morning Prime Block (5:15 AM)", "Time for your 40m Quant focus sprint! Build high calculation momentum.", "today", "block-morning");
      }
    }

    // 18:30 PM - Evening High-Engagement Logic
    if (currentTimeStr === "18:30") {
      const key = `ssc_alert_block_evening_${todayDateStr}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        deliverNotification("🧩 Evening Logic Block (6:30 PM)", "35-40 timed Reasoning questions. High dopamine speed drill!", "today", "block-evening");
      }
    }

    // 19:45 PM - Interleaved GK & English Practice
    if (currentTimeStr === "19:45") {
      const key = `ssc_alert_block_gk_${todayDateStr}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        deliverNotification("📚 Interleaved GK & English (7:45 PM)", "30m GK rotation + 30m English Cloze/Grammar rule drill.", "today", "block-gk");
      }
    }

    // 20:45 PM - Wind-Down & Rollover Review
    if (currentTimeStr === "20:45") {
      const key = `ssc_alert_block_winddown_${todayDateStr}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        deliverNotification("🌙 60-Second Wind-Down (8:45 PM)", "Review today's mistake notes and roll forward any pending items with zero guilt!", "review", "block-winddown");
      }
    }
  }
}

async function triggerDueTaskNotification() {
  try {
    const res = await fetch('/api/notifications/due');
    if (res.ok) {
      const data = await res.json();
      if (data.has_notification) {
        deliverNotification(data.title, data.body, data.target_view, "daily-due");
      }
    }
  } catch (e) {}
}

async function testNotification() {
  // If permission not granted, request it first
  if ("Notification" in window && Notification.permission !== "granted") {
    await requestNotificationPermission();
  }

  try {
    const res = await fetch('/api/notifications/test', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      deliverNotification(data.title, data.body, data.target_view, data.tag || "ssc-test");
      return;
    }
  } catch (e) {}

  deliverNotification(
    "Study Alert: Quantitative Aptitude",
    "Maths — 40 Calculation & Arithmetic PYQs scheduled for today.",
    "today",
    "ssc-test"
  );
}

async function deliverNotification(title, body, targetView = "today", tag = "ssc-study-alert") {
  // 1. Audible Chime & Mobile Device Vibration
  playAlertChime();
  if ("vibrate" in navigator) {
    try {
      navigator.vibrate([200, 100, 200, 100, 300]);
    } catch (e) {}
  }

  let delivered = false;

  // 2. Service Worker showNotification (Works reliably on Android Chrome & PWAs)
  if ("serviceWorker" in navigator && "Notification" in window && Notification.permission === "granted") {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body: body,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          vibrate: [200, 100, 200, 100, 300],
          tag: tag,
          renotify: true,
          requireInteraction: false,
          data: { target_view: targetView },
          actions: [{ action: "open", title: "Open Study App" }]
        });
        delivered = true;
      }
    } catch (swErr) {
      console.warn("SW showNotification error:", swErr);
    }

    // 3. Service Worker postMessage fallback
    if (!delivered && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'NOTIFICATION_TRIGGER',
        title: title,
        body: body,
        target_view: targetView,
        tag: tag
      });
      delivered = true;
    }

    // 4. Desktop window Notification fallback
    if (!delivered) {
      try {
        new Notification(title, {
          body: body,
          icon: "/icon-192.png",
          tag: tag
        });
        delivered = true;
      } catch (winErr) {
        console.warn("Window Notification fallback error:", winErr);
      }
    }
  }

  // 5. In-App visual Toast feedback
  showToast(`🔔 ${title}: ${body}`);
}

async function rolloverAllPriorTasks() {
  try {
    const res = await fetch('/api/tasks/rollover-all-prior', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      showToast(`Rolled over ${data.count} task(s) into today's priority buffer.`);
      fetchState();
    }
  } catch (e) {
    console.warn("Rollover error:", e);
  }
}

async function confirmResetAllData() {
  if (confirm("Reset study data to Day 1 fresh state? This will clear all tasks, sessions, streak, and XP.")) {
    try {
      const res = await fetch('/api/reset-data', { method: 'POST' });
      if (res.ok) {
        localStorage.removeItem("agy_cached_state");
        showToast("Reset to clean Day 1 state successfully.");
        closeNotificationModal();
        fetchState();
      }
    } catch (e) {
      console.warn("Reset data error:", e);
    }
  }
}

// --- 13. CHECK-IN & REVIEW MODALS ---
function openCheckInModal() {
  const modal = document.getElementById("checkin-modal");
  if (!modal) return;
  modal.classList.add("open");

  const goalInput = document.getElementById("checkin-goal");
  const topicInput = document.getElementById("checkin-topic");
  if (goalInput) goalInput.value = AppState.dailyCheckIn.goal || "";
  if (topicInput) topicInput.value = AppState.dailyCheckIn.focusTopic || "";

  updateRatingPills("energy", AppState.dailyCheckIn.energy || 4);
  updateRatingPills("sleep", AppState.dailyCheckIn.sleep || 4);
}

function closeCheckInModal() {
  const modal = document.getElementById("checkin-modal");
  if (modal) modal.classList.remove("open");
}

let selectedEnergy = 4;
let selectedSleep = 4;

function setRating(type, val) {
  if (type === "energy") selectedEnergy = val;
  if (type === "sleep") selectedSleep = val;
  updateRatingPills(type, val);
}

function updateRatingPills(type, val) {
  const container = document.getElementById(`rating-${type}`);
  if (!container) return;
  container.querySelectorAll(".scale-pill").forEach(p => {
    p.classList.toggle("selected", parseInt(p.dataset.val, 10) === val);
  });
}

async function saveCheckIn() {
  const goal = document.getElementById("checkin-goal").value.trim() || "Master core syllabus chapters";
  const topic = document.getElementById("checkin-topic").value.trim() || "Ratio & Proportion";

  AppState.dailyCheckIn = { energy: selectedEnergy, sleep: selectedSleep, goal, focusTopic: topic };

  try {
    await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        energy: selectedEnergy,
        sleep: selectedSleep,
        goal,
        focus_topic: topic
      })
    });
  } catch (e) {
    console.warn("Offline checkin save:", e);
  }

  closeCheckInModal();
  showToast("Check-in saved permanently!");
  fetchState();
}

function openReviewModal() {
  const modal = document.getElementById("review-modal");
  if (!modal) return;
  modal.classList.add("open");

  const doneCount = AppState.tasks.filter(t => t.completed).length;
  const compSummary = document.getElementById("review-completed");
  if (compSummary) compSummary.value = `Completed ${doneCount} of ${AppState.tasks.length} syllabus tasks today.`;
}

function closeReviewModal() {
  const modal = document.getElementById("review-modal");
  if (modal) modal.classList.remove("open");
}

async function saveDailyReview() {
  const comp = document.getElementById("review-completed").value;
  const missed = document.getElementById("review-missed").value;
  const distraction = document.getElementById("review-distraction").value;
  const priorityTomorrow = document.getElementById("review-tomorrow-priority").value;

  try {
    await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completed_summary: comp,
        missed_summary: missed,
        distraction: distraction,
        priority_next_day: priorityTomorrow
      })
    });
  } catch (e) {
    console.warn("Offline review save:", e);
  }

  closeReviewModal();
  showToast("Review saved! Consistency streak extended.");
  fetchState();
}

// --- 14. VIEW NAVIGATION ---
function switchView(viewName) {
  AppState.activeView = viewName;

  const views = ["today", "syllabus", "progress", "review"];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.toggle("hidden", v !== viewName);
  });

  document.querySelectorAll(".view-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.view === viewName);
  });

  document.querySelectorAll(".bottom-nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === viewName);
  });

  if (viewName === "progress") {
    loadWeeklyProgress();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- 15. THEME TOGGLE ---
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const target = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", target);
  localStorage.setItem("agy_study_theme", target);
}

function initTheme() {
  const saved = localStorage.getItem("agy_study_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
}

// --- 16. MASTER RENDER ---
function renderAll() {
  updateStudyPulse();
  renderTaskList();
  renderSyllabusHierarchy();
  updateNotificationStatusText();
}

// --- 16.5 LIVE AUTO-UPDATING CLOCK, DATE, DAY & MIDNIGHT ROLLOVER ---
let lastRecordedDateStr = null;

function updateLiveClock() {
  const dateEl = document.getElementById("live-date-header");
  const now = new Date();

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const dayName = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const dateNum = now.getDate();
  const year = now.getFullYear();

  // 12-hour clock with AM/PM and ticking seconds
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;

  if (dateEl) {
    dateEl.innerHTML = `
      <span class="live-day-badge">${dayName}</span>,
      <span>${monthName} ${dateNum}, ${year}</span>
      <span class="live-clock-pill" title="Live system time">
        <span class="live-clock-dot"></span>
        <span>${timeStr}</span>
      </span>
    `;
  }

  // Detect calendar day rollover (e.g. midnight rollover while app is open)
  const todayIsoStr = now.toISOString().slice(0, 10);
  if (lastRecordedDateStr && lastRecordedDateStr !== todayIsoStr) {
    console.log(`Day changed from ${lastRecordedDateStr} to ${todayIsoStr}. Auto-refreshing daily tasks...`);
    lastRecordedDateStr = todayIsoStr;
    fetchState();
  } else if (!lastRecordedDateStr) {
    lastRecordedDateStr = todayIsoStr;
  }
}

// --- 17. INITIALIZATION ON DOM READY ---
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCollegeGapRecommender();
  initNotifications();
  
  // Start live clock with immediate execution and 1-second auto-update
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
  
  fetchState();

  // Re-sync clock and check date immediately when tab becomes visible (phone unlock / app switch)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      updateLiveClock();
      const nowIso = new Date().toISOString().slice(0, 10);
      if (lastRecordedDateStr && lastRecordedDateStr !== nowIso) {
        lastRecordedDateStr = nowIso;
        fetchState();
      }
    }
  });

  // Handle service worker navigation messages
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.action === 'switchView') {
        switchView(event.data.view);
      }
    });
  }
});
