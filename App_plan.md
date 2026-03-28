# 🐧 PenguinPals — Complete Product Design Outline
### *A Patient-Doctor Wellness Check-In App*

---

## 0. Vision Statement

PenguinPals is a structured, asynchronous wellness check-in platform that lives between appointments. Doctors build personalized question decks during sessions; patients receive gentle, scheduled nudges and answer them in a calm nightly ritual. Doctors review clean, visual summaries at their next check-in. The penguin is the mascot — waddling along with you through the week, never overwhelming, always present.

The core product promise: **no friction for the patient, complete insight for the doctor.**

---

## 1. Brand Identity

### 1.1 Name & Mascot
- **Name:** PenguinPals
- **Mascot:** Pip — a small, round emperor penguin with expressive eyes. Pip has mood states: happy, curious, sleepy, celebratory, concerned. Pip appears in micro-animations throughout the patient experience. Pip is drawn in a flat-vector style with subtle grain texture — not 3D, not cartoon, not emoji. Somewhere between a Muji sticker and a Monocle illustration.


### 1.2 Visual Language
- **Style:** Warm Nordic minimalism meets playful illustration. Think Headspace circa 2018 crossed with a Scandinavian health clinic.
- **NOT:** Clinical white/blue hospital. NOT AI-gradient purple. NOT Material Design flat. NOT bubbly app-game UI.
- **Feeling:** Trustworthy, cozy, slightly whimsical, genuinely premium.

### 1.3 Color Palette

| Token | Hex | Use |
|---|---|---|
| `--midnight` | `#0D1B2A` | Doctor dashboard backgrounds, data-heavy views |
| `--ink` | `#1C2B3A` | Primary text |
| `--fog` | `#F0EDE8` | Patient-facing warm off-white background |
| `--snow` | `#FAFAF7` | Cards, modals |
| `--glacier` | `#5BA3BF` | Primary accent (interactive elements, highlights) |
| `--aurora` | `#E8A87C` | Warm accent (notifications, Pip, CTAs) |
| `--moss` | `#6B8F71` | Positive/green confirmations |
| `--blush` | `#D4788A` | Alert states, high-concern flags |
| `--slate` | `#7A8C96` | Secondary text, disabled states |
| `--ice` | `#DDF0F5` | Subtle tint backgrounds, scale fills |

### 1.4 Typography

| Role | Typeface | Weight | Notes |
|---|---|---|---|
| Display / Hero | **Canela** (or Freight Display) | Light & Regular | Elegant serif for headers, creates warmth |
| UI Labels & Navigation | **DM Mono** | Regular & Medium | Grounded, clinical-but-friendly mono |
| Body Text | **Lora** | Regular & Italic | Humanist serif for readable body content |
| Numbers & Data | **Tabular Figures via DM Mono** | Medium | Doctor dashboard stats and scores |

- All font sizes follow an 8pt grid: 12, 14, 16, 20, 24, 32, 40, 56px
- Line-height: 1.5 for body, 1.1 for display
- Letter-spacing: +0.04em for all-caps labels, +0.02em for DM Mono body

### 1.5 Iconography
- Custom icon set: 2px stroke, rounded caps, no fill. 24×24 grid.
- Key icons: penguin footprint (home), clipboard (deck), bell (notification), chart-line (trends), calendar (schedule), moon (night mode), sun (morning mode), lock (private), checkmark (done), plus-circle (add question).
- Icons always appear with a label on first use; icon-only on repeat.

### 1.6 Motion & Animation Principles
- **Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — slightly springy, never bouncy
- **Duration:** Micro = 120ms, Standard = 240ms, Deliberate = 400ms
- **Pip animations:** SVG-based, frame-by-frame. Pip blinks every 4–7 seconds. Pip does a full body wiggle on task completion. Pip yawns at night check-in time.
- Page transitions: Horizontal slide for linear flows (question to question), vertical reveal for summaries
- Loading states: Pip waddles in place (looped 3-frame walk cycle)
- No layout shifts. No janky scroll. No spinner abuse.

### 1.7 Illustration Style
- Flat vector with a single diagonal light source
- Subtle grain overlay (5% noise texture) on all illustration backgrounds
- Depth achieved through layered transparency (not drop shadows)
- Color-block backgrounds with organic, slightly-wobbly shapes (not perfect circles or rectangles)

---

## 2. Platform Overview

### 2.1 Who Uses What

| User | Platform | Primary Device |
|---|---|---|
| **Doctor** | Web App (dashboard) | Desktop / iPad |
| **Patient** | Mobile App (iOS + Android) | Smartphone |

### 2.2 Tech Stack Recommendation
- **Frontend (Doctor Web):** Next.js 14 + Tailwind + Framer Motion
- **Frontend (Patient Mobile):** React Native + Expo + Reanimated 3
- **Backend:** Node.js / Fastify, PostgreSQL, Redis for scheduling with Supabase integration down the line
- **Notifications:** Expo Push (mobile) + background job scheduler (BullMQ)
- **Auth:** Clerk (separate doctor/patient tenants)
- **Data Viz (Doctor):** Recharts or Nivo

---

## 3. Core Concepts & Data Model

### 3.1 Key Entities

**Doctor**
- `id`, `name`, `specialty`, `clinic`, `avatar`, `timezone`

**Patient**
- `id`, `name`, `dob`, `doctorId`, `timezone`, `checkInTime` (default: 21:00 local)
- `notificationPreferences` (push, SMS, email)
- `streak` (consecutive days completed)

**Deck**
- `id`, `patientId`, `doctorId`, `createdAt`, `activeFrom`, `activeTo` (tied to appointment window)
- `checkInFrequency`: daily(default) | every_X_days | custom_days_of_week
- `checkInTime`: HH:MM in patient's timezone
- `status`: draft | active | completed | archived

**Question**
- `id`, `deckId`, `order`, `text`, `type`, `config`, `tags`, `isRequired`, `createdFrom` (library | custom)

**QuestionTypes:**
- `yes_no` — binary, two large tap targets
- `scale_5` — 1–5 stars or faces
- `scale_7` — 1–7 numerical slider with labeled anchors
- `scale_10` — 0–10 slider (NRS pain scale standard)
- `vas` — Visual Analogue Scale, continuous 0–100 drag
- `multi_choice` — tap to select one (2–6 options)
- `multi_select` — tap to select all that apply
- `frequency` — Never / Rarely / Sometimes / Often / Always
- `duration` — <15min / 15–30min / 30–60min / 1–2hrs / 2+hrs
- `text_short` — max 140 char open response
- `mood_grid` — 3×3 grid of Pip expressions mapped to moods

**Response**
- `id`, `questionId`, `patientId`, `deckId`, `answeredAt`, `value` (JSON), `skipped`
- `checkInSessionId` (groups all answers from one sitting)

**QuestionLibrary (global)**
- Pre-built templates organized by category
- `id`, `text`, `type`, `config`, `category`, `tags`, `useCount`

### 3.2 Appointment Cycle

```
[Doctor creates/edits Deck during session]
          ↓
[Deck activates same day or at appointment end]
          ↓
[Nightly (or scheduled) notifications fire]
          ↓
[Patient completes check-in on mobile]
          ↓
[Data accumulates in DB with timestamps]
          ↓
[Doctor reviews summary before/during next appointment]
          ↓
[Old deck archived, new deck created]
```

---

## 4. Doctor Dashboard — Web App

### 4.1 Information Architecture

```
/ (login)
/dashboard              ← Home: today's patient activity overview
/patients               ← Patient list
/patients/:id           ← Patient profile
/patients/:id/deck      ← Active deck editor
/patients/:id/history   ← Past decks & responses
/patients/:id/report    ← Visual report for current cycle
/library                ← Question template library
/settings               ← Account, clinic, notification defaults
```

### 4.2 Dashboard Home (`/dashboard`)

**Layout:**
- Left sidebar (240px, fixed): Pip logo top-left, nav items with icon+label, doctor avatar + name at bottom
- Main content: scrollable feed
- Right panel (320px): Quick actions + upcoming appointments

**Sidebar Design:**
- Background: `--midnight`
- Active nav item: `--glacier` left border (4px), text brightens to white
- Hover: subtle ice-tint background (8% opacity)
- Pip logo at top: 40×40, animated — Pip blinks and occasionally tilts head

**Main Feed:**
- Greeting header: "Good morning, Dr. [Last Name]." in Canela Display 40px
- Subline in DM Mono 14px slate: "Tuesday, March 11 · 4 patients checked in last night"
- Horizontal scroll row: **Today's Activity Cards** — one per patient who had a check-in last night
  - Card: 280×160px, snow background, soft shadow
  - Patient initials avatar (40px circle, glacier bg)
  - Patient name + Canela 20px
  - "Completed X/Y questions" with a small progress bar
  - Flag pill if any response triggered an alert threshold
  - Tap card → goes to `/patients/:id/report`
- Section: **Upcoming Appointments** — timeline list, next 48 hours
- Section: **Patients with No Response (3+ days)** — shown in blush-tinted cards

**Right Panel:**
- "Start New Deck" CTA button (aurora-filled, full-width)
- Mini calendar (current week, appointment dots)
- Notification log (last 5 system events)

### 4.3 Patient Profile (`/patients/:id`)

**Header Section:**
- Full-bleed banner: organic blob shape in `--ice` color, patient name in Canela 32px
- Stats row: "Streak: 12 days 🐧", "Avg completion: 87%", "Next appt: Mar 18"
- Tabs: Overview | Active Deck | History | Reports

**Overview Tab:**
- Recent trend sparklines for each active scale question (7-day)
- Last completed check-in timestamp
- "Flags" panel: any answer that crossed a defined threshold

### 4.4 Deck Editor (`/patients/:id/deck`)

**Philosophy:** This is where doctors spend the most time. It must be fast, keyboard-friendly, and satisfying.

**Layout:**
- Top bar: Deck name (editable inline), status badge, "Activate Deck" CTA, "Save Draft" ghost button
- Left column (60%): Question list (drag-to-reorder)
- Right column (40%): Question detail editor panel + Library drawer

**Question List:**
- Each question is a card: 64px tall, drag handle on left, question text, type badge, required toggle, delete icon
- Active/selected question has `--glacier` left border accent
- Drag-and-drop reorder: questions animate smoothly with layout transitions
- "+ Add Question" row at bottom: Opens right panel to Library or Custom

**Question Detail Panel (right):**
- Question text input (large, multiline)
- Type selector: horizontal chip row (yes/no, scale, mood, etc.)
- Type-specific config (anchor labels for scales, options for multi-choice)
- "Flag if answer is..." — threshold setting (e.g., flag if pain score ≥ 7)
- Tags (free-form, e.g., "sleep", "pain", "mood")
- Required toggle

**Library Drawer:**
Slides in from right (400px overlay panel) when "Add from Library" is clicked.
- Search bar at top
- Category filters: Pain | Sleep | Mood | Medication | Anxiety | Activity | Social | Appetite | Custom
- Question cards: show question text, type chip, use count
- "Add to Deck" button on hover
- Doctor can also "Star" library questions for personal quick-access

**Schedule Configuration (collapsible section below question list):**
- Check-in Frequency: Daily / Every 2 days / Every 3 days / Select days (M/T/W/T/F/S/S toggle chips)
- Check-in Time: Time picker (patient's local time) — default 21:00
- Active Period: From [date] to [date] — auto-fills appointment window
- Notification Message: customizable push text (character count shown)
- Reminder: Send a follow-up reminder if not completed by [time, default +90 min]

### 4.5 Report View (`/patients/:id/report`)

**This is the doctor's payoff screen. Data visualization that tells a story.**

**Layout:**
- Full-page, print-friendly (CSS @media print supported)
- Timeline scrubber at top: week dots, click to filter view

**Visualization Types by Question Type:**

| Question Type | Visualization |
|---|---|
| `scale_5 / scale_7 / scale_10` | Line chart with reference bands, mean line, trend arrow |
| `vas` | Area chart, raw dots + smooth interpolation |
| `yes_no` | Calendar heatmap (green/red per day) |
| `frequency` | Stacked bar chart per day |
| `mood_grid` | Mood scatter timeline (Pip faces on a timeline) |
| `multi_choice` | Donut chart + frequency table |
| `multi_select` | Tag cloud with size = frequency |
| `text_short` | Chronological list with date stamps, no viz |
| `duration` | Horizontal stacked bar chart |

**Summary Panel:**
- Auto-generated written summary (rule-based, not AI): "Sleep quality averaged 4.2/7 over 14 days, trending upward. Pain score peaked on Mar 3 (8/10). Mood was reported as anxious on 5 of 14 days."
- graphs showing answer choice over time
- Alert log: list of any flagged responses with timestamps

**Print/Export:**
- "Export PDF" button generates a clean 2-column report layout, black-and-white optimized

---

## 5. Patient Mobile App

### 5.1 Information Architecture

```
/ (onboarding / login)
/home                   ← Main tab: streak, next check-in countdown, Pip
/check-in               ← Active check-in flow
/history                ← Past check-ins (read-only)
/settings               ← Notification time, preferences, account
```

### 5.2 Visual Tone (Patient-Facing)

The patient app is **warmer, softer, and more emotionally supportive** than the doctor dashboard. This is someone's nightly ritual. It must feel like opening a cozy, familiar app — not a medical form.

- Background: `--fog` (#F0EDE8) — warm parchment, never clinical white
- All cards on `--snow`
- Pip appears throughout as a companion, not decoration
- Generous white space, large touch targets (min 56px)
- Fonts larger: body 16px minimum, question text 20px
- Rounded corners: 20px on cards, 28px on primary buttons

### 5.3 Onboarding (First Launch)

**Screen 1 — Welcome:**
- Full-screen `--fog` background with a large illustrated scene: Pip sitting on an ice floe under stars
- "Meet Pip." in Canela 48px, centered
- "Your nightly check-in buddy." in Lora 18px
- Single CTA: "Get Started" (aurora-filled pill button, full-width)

**Screen 2 — How It Works:**
- 3-panel swipeable carousel
  - Panel 1: Pip with clipboard → "Your doctor creates a short set of questions just for you."
  - Panel 2: Pip with moon/stars → "Every night, Pip reminds you to check in. It takes under 3 minutes."
  - Panel 3: Pip with magnifying glass → "Your doctor sees your responses and can better support you."
- Progress dots at bottom, skip link top-right

**Screen 3 — Notification Permission:**
- Pip holding a tiny bell illustration
- "Can Pip remind you?" headline
- Subtext: "We'll send you a gentle nudge at your check-in time. That's all."
- "Allow Notifications" (aurora CTA)
- "Not right now" (ghost button, smaller)

**Screen 4 — Set Check-In Time:**
- "When do you want to check in?" headline
- Time wheel picker (native, styled to match)
- Default: 9:00 PM
- "Most people choose between 8pm and 10pm" — friendly subtext in slate
- Pip doing a sleepy yawn animation

**Screen 5 — Confirm Code / Connect to Doctor:**
- "Enter your pairing code." headline (code given by doctor's office)
- 6-digit code input (large, DM Mono, auto-advance per digit)
- Pip with binoculars peering curiously

### 5.4 Home Screen

**Structure:** Single scrollable screen, no bottom tabs until user is fully set up.

**Pip Hero Area (top 40% of screen):**
- `--fog` background with a day/night illustrated sky (changes based on time of day)
- Pip centered, animated: evening Pip has tiny moon on cap; morning Pip has tiny sun
- "Tonight's check-in is ready" or "Next check-in in 4h 32m" in Canela 22px
- Streak badge below Pip: "🐧 12-day streak" (glacier pill, DM Mono)

**Check-In CTA:**
- Large rounded rectangle button (aurora fill): "Start Check-In"
- Appears when check-in window is open (e.g., from 8pm until midnight)
- Outside window: button is ghost style, "Available tonight at 9:00 PM"

**Recent Activity strip:**
- Compact cards for the last 5 check-ins: date, "X/Y answered", completion ring
- "See all" link → history screen

**Motivational Micro-copy:**
- Rotates daily, contextual, written in warm second-person voice
- Examples: "You've checked in 6 days in a row. Pip is proud." / "Welcome back. Your doctor will see this Thursday." / "Short night? All questions are optional unless marked required."

### 5.5 Check-In Flow

**Entry:**
- When user taps "Start Check-In", a **full-screen modal** rises from bottom (sheet animation)
- Header: "Check-In · [Day], [Date]" in DM Mono 13px slate
- Progress bar at top: thin line, glacier fill, animates forward with each question
- Pip sits in the top-right corner, small, reacting to answers (happy on positive answers, gently concerned on high pain scores, neutral otherwise)
- "Done in ~2 min" duration estimate in slate

**Question Display:**

Each question takes the full screen. No scrolling mid-question.

- Question number indicator: "2 of 8" DM Mono, top-left
- Question text: Canela 24px, centered, max 2 lines. If longer, Lora 18px
- Answer component (see below): always below question text, vertically centered
- "Next →" button at bottom: glacier fill, full-width, 56px tall
- "← Back" ghost link top-left (returns to previous question)
- "Skip" link bottom-center, only on non-required questions (14px, slate color)

**Answer Components by Type:**

**`yes_no`:**
- Two full-width stacked cards (120px each), large rounded corners
- Left/top: "Yes" with a gentle checkmark Pip, `--moss` tint on select
- Right/bottom: "No" with a head-shake Pip, `--blush` tint on select
- Tap selects immediately and glows; double-tap or "Next" advances

**`scale_5` (Star / Face Scale):**
- 5 large circular tap targets in a row
- Option A (default): Pip face variants (😴 😕 😐 🙂 😄 as hand-drawn Pip moods)
- Option B: Star fill (1–5), aurora color fill on select
- Selected option bounces with spring animation
- Anchor labels: "Not at all" / "Extremely" below first/last

**`scale_7`:**
- Horizontal segmented control: 7 numbered circles (32px each)
- Tapping a number fills glacier from left to that point (like a liquid fill)
- Anchors: doctor-defined labels below 1 and 7
- Selected circle: `--glacier` fill, white number, slight scale-up

**`scale_10` (NRS — Numeric Rating Scale):**
- Large centered number display (56px, Canela) updates as user swipes
- Below: a wide segmented bar (0–10), color gradient from moss (0) to blush (10)
- Draggable thumb with haptic feedback
- Anchors: "No pain" / "Worst pain imaginable" (or doctor-defined)

**`vas` (Visual Analogue Scale):**
- Continuous horizontal track (full-width)
- No numbers visible — pure intuitive drag
- Left label and right label (doctor-defined)
- Position saved as 0–100 integer
- Track fills glacier from left as user drags

**`multi_choice`:**
- Vertical list of option pills (56px each, full-width)
- Tap selects one (glacier border + light glacier bg fill)
- Options have rounded corners (12px), Lora 17px text
- Deselect by tapping again

**`multi_select`:**
- Same as multi_choice but multiple selections allowed
- Selected options show a small glacier checkmark circle on right
- "Select all that apply" subtext below question in slate

**`frequency`:**
- 5 vertical pill options: Never / Rarely / Sometimes / Often / Always
- Color-coded fill intensity on select: white → light glacier → full glacier

**`duration`:**
- 5 options as pill chips in 2-row wrap layout
- `< 15 min` / `15–30 min` / `30–60 min` / `1–2 hrs` / `More than 2 hrs`

**`mood_grid`:**
- 3×3 grid of Pip face illustrations (9 moods):
  - Row 1: Joyful, Calm, Hopeful
  - Row 2: Tired, Neutral, Restless
  - Row 3: Sad, Anxious, Irritable
- Each cell: 80×80px rounded square, Pip face + label below
- Selected: border glacier 2px, cell background ice tint, slight lift animation

**`text_short`:**
- Large multiline text input (auto-grows)
- Character counter bottom-right (DM Mono, slate)
- Keyboard pushes content up gracefully
- Pip sits patiently in corner, not reacting (neutral pose)

**Completion Screen:**
- Pip does a full wiggle-and-clap animation (3-second loop, then settles)
- "All done for tonight." — Canela 36px
- Subtext: "Pip will see you tomorrow night." or "Your doctor will review this before your appointment on [date]."
- Streak badge update: if streak increased, banner drops from top: "🐧 13-day streak! You're on a roll."
- Single button: "Back to Home" (glacier fill)
- Optional: soft confetti burst (6 colors from palette) on first completion

### 5.6 History Screen

- Scrollable list of past check-in sessions grouped by week
- Each session: date pill, question count, completion percentage, a small mood indicator (last mood_grid answer if exists)
- Tap any session: read-only view of all answers in that session
- Read-only answers are rendered in a simplified, non-interactive version of the same components

### 5.7 Notifications

**Push Notification (nightly):**
- Title: "Pip is waiting! 🐧"
- Body: Doctor-customized or default: "Your nightly check-in is ready. 2 minutes, then you're done."
- Tapping opens app directly to check-in flow (deep link)
- Icon: Pip with clipboard

**Reminder (if not completed by +90 min):**
- Title: "One last nudge from Pip 🐧"
- Body: "Check-in closes at midnight. Quick tap and you're done!"

**Streak Celebration (morning after 7/14/30 day milestones):**
- Title: "🎉 7-day streak!"
- Body: "Pip is doing a happy dance. See you tonight."

**Doctor Message (optional feature):**
- Title: "A note from Dr. [Name]"
- Body: Freeform short message (max 160 chars) — non-clinical acknowledgement (e.g., "Great work this week. See you Thursday.")

---

## 6. Question Library (Pre-Built Templates)

All questions are available in the doctor's library. Organized by category with tags.

### 6.1 Pain

| # | Question | Type | Anchors / Options |
|---|---|---|---|
| P1 | How would you rate your pain right now? | scale_10 | 0 = No pain / 10 = Worst imaginable |
| P2 | How much did pain interfere with daily activities today? | scale_10 | 0 = Not at all / 10 = Completely |
| P3 | Where did you experience pain today? | multi_select | Head / Neck / Chest / Back / Abdomen / Arms / Legs / Joints |
| P4 | Did you take pain medication today? | yes_no | — |
| P5 | How would you describe your pain today? | multi_select | Sharp / Dull / Burning / Aching / Stabbing / Throbbing |
| P6 | How long did your worst pain last today? | duration | — |

### 6.2 Sleep

| # | Question | Type | Anchors / Options |
|---|---|---|---|
| S1 | How many hours did you sleep last night? | multi_choice | Less than 4h / 4–6h / 6–8h / More than 8h |
| S2 | How would you rate your sleep quality? | scale_7 | 1 = Very poor / 7 = Excellent |
| S3 | Did you have trouble falling asleep? | yes_no | — |
| S4 | Did you wake up during the night? | yes_no | — |
| S5 | How rested do you feel today? | scale_5 | (Pip faces: exhausted → fully rested) |
| S6 | Did you take any sleep aids last night? | yes_no | — |

### 6.3 Mood & Mental Health

| # | Question | Type | Anchors / Options |
|---|---|---|---|
| M1 | How would you describe your mood today? | mood_grid | — |
| M2 | How anxious have you felt today? | scale_10 | 0 = Not at all / 10 = Extremely |
| M3 | How hopeful do you feel about your health? | scale_7 | 1 = Not at all / 7 = Very hopeful |
| M4 | Did you feel overwhelmed today? | yes_no | — |
| M5 | How connected did you feel to others today? | scale_5 | (isolated → very connected) |
| M6 | How motivated were you today? | scale_5 | (Pip faces) |
| M7 | Did you experience any panic or anxiety attacks? | yes_no | — |
| M8 | How often did you feel sad today? | frequency | Never–Always |

### 6.4 Medication & Treatment

| # | Question | Type | Anchors / Options |
|---|---|---|---|
| T1 | Did you take your medication as prescribed today? | yes_no | — |
| T2 | Did you experience any side effects today? | yes_no | — |
| T3 | If yes, how severe were the side effects? | scale_5 | 1 = Mild / 5 = Severe |
| T4 | Did you skip a dose? | yes_no | — |
| T5 | Rate your confidence in your current treatment plan. | scale_7 | 1 = Not confident / 7 = Very confident |

### 6.5 Physical Activity

| # | Question | Type | Anchors / Options |
|---|---|---|---|
| A1 | Did you exercise today? | yes_no | — |
| A2 | If yes, for how long? | duration | — |
| A3 | How physically active were you today overall? | scale_5 | (Pip: in bed → very active) |
| A4 | Did physical activity increase or decrease your symptoms? | multi_choice | Increased / Decreased / No change / Didn't exercise |

### 6.6 Appetite & Nutrition

| # | Question | Type | Anchors / Options |
|---|---|---|---|
| N1 | How was your appetite today? | scale_5 | 1 = No appetite / 5 = Very good |
| N2 | Did you eat three meals today? | yes_no | — |
| N3 | Did you experience nausea today? | yes_no | — |
| N4 | How much water did you drink today? | multi_choice | Less than 1L / 1–2L / 2–3L / More than 3L |

### 6.7 Social & Support

| # | Question | Type | Anchors / Options |
|---|---|---|---|
| SO1 | Did you speak with a friend or family member today? | yes_no | — |
| SO2 | How supported do you feel right now? | scale_7 | 1 = Very unsupported / 7 = Very supported |
| SO3 | Did you feel lonely today? | frequency | Never–Always |

### 6.8 Fatigue

| # | Question | Type | Anchors / Options |
|---|---|---|---|
| F1 | How fatigued do you feel right now? | scale_10 | 0 = No fatigue / 10 = Completely exhausted |
| F2 | Did fatigue limit your activities today? | yes_no | — |
| F3 | At what point in the day did you feel most tired? | multi_choice | Morning / Midday / Afternoon / Evening / Throughout |

### 6.9 Cognitive & Focus

| # | Question | Type | Anchors / Options |
|---|---|---|---|
| C1 | How well were you able to concentrate today? | scale_7 | 1 = Very poorly / 7 = Excellent |
| C2 | Did you experience brain fog or memory issues today? | yes_no | — |
| C3 | How clear-headed do you feel right now? | scale_5 | (Pip faces) |

### 6.10 Open / Custom

| # | Question | Type |
|---|---|---|
| O1 | Is there anything you'd like your doctor to know about today? | text_short |
| O2 | Did anything notable happen today that affected how you feel? | text_short |
| O3 | Overall, how was today compared to yesterday? | scale_5 (worse–much better) |

---

## 7. Alerting & Flagging System

### 7.1 Doctor-Configured Thresholds
- Per question, doctor can set: "Flag if value is ≥ X" or "Flag if answer is Y"
- Examples: "Flag if pain score ≥ 8", "Flag if 'Did you skip a dose?' = Yes", "Flag if anxiety ≥ 7 three days in a row"
- Consecutive-days rule: flag can trigger only after N repeated threshold crossings

### 7.2 Flag Display
- In doctor dashboard home: red `--blush` pill on patient card
- In report: flagged data points shown with a small ⚑ marker on charts
- In patient list: flag icon next to patient name in sidebar

### 7.3 Doctor Notification
- Email digest: daily at 8 AM, lists any flagged responses from previous night
- Optional: immediate push to doctor app (future feature)

---

## 8. Accessibility

- All tap targets minimum 44×44pt (Apple HIG), 48×48dp (Material)
- Color contrast minimum 4.5:1 for all text
- All interactive elements have accessible labels
- VoiceOver / TalkBack compatible question flow
- Dynamic type support on iOS (Lora scales gracefully)
- All charts in doctor dashboard have data table fallback
- Check-in flow has optional "Simple Mode": larger text, higher contrast, no animations

---

## 9. Privacy & Data

- PHI handled in compliance with HIPAA (US) / PIPEDA (CA) / GDPR (EU)
- End-to-end encryption for stored response data
- Patient cannot see doctor's clinical notes or flagging thresholds
- Doctor can only see their own patients' data
- Data retention: configurable per clinic (default 7 years per HIPAA)
- Patient can export their own data as CSV from settings
- No third-party analytics SDKs in patient app (privacy-first)

---

## 10. Future Features (V2+)

| Feature | Description |
|---|---|
| **Medication Reminders** | Pip reminds patient to take meds, separate from check-in |
| **Wearable Integration** | Pull HRV, sleep, activity from Apple Health / Fitbit to auto-answer some questions |
| **Caregiver View** | Read-only access for a trusted family member, with patient consent |
| **Voice Check-In** | Patient speaks answers, transcribed by on-device speech recognition |
| **Smart Deck Suggestions** | Based on patient history, suggest question additions (rule-based, not LLM) |
| **Multi-language support** | UI and question library in Spanish, French, Mandarin, Portuguese |
| **Group Decks** | Same deck sent to a cohort of patients (clinical trial use case) |
| **Clinic Admin Dashboard** | Multi-doctor practice management, aggregate compliance reporting |
| **Doctor Mobile App** | Lightweight companion for reviewing urgent flags on mobile |
| **EHR Integration** | Export reports in HL7/FHIR format, direct push to Epic / Cerner |

---

## 11. Key UX Principles Summary

1. **The check-in is a ritual, not a form.** Every design decision must reinforce that this is a meaningful, low-friction nightly habit.
2. **Pip earns trust.** The mascot must never feel gimmicky. Pip's animations are earned, not decorative.
3. **Doctors see signal, not noise.** The report view is the product for doctors. Every chart must reduce cognitive load.
4. **Default to calm.** Colors, motion, and copy should never induce anxiety. Medical context demands extra warmth.
5. **Speed is a feature.** Check-in should never take more than 3 minutes. Deck building should take under 5.
6. **No dark patterns.** Notifications are honest, dismissible, and configurable. Streaks are positive, never punitive.
7. **Playful ≠ unserious.** The visual language respects the medical relationship while making compliance delightful.

---

*Document version: 1.0 | Last updated: March 2026 | PenguinPals Product Team*