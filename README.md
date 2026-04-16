# EduTrack — School Grade Management System

A multi-school, cloud-powered grade tracking web app built with vanilla JavaScript, HTML, CSS, and **Firebase Firestore + Authentication**.

---

## Features

- 🏫 **Multi-school support** — Each school is fully isolated
- 👑 **Admin dashboard** — Manage teachers, view all students & grades, edit school info
- 👩‍🏫 **Teacher dashboard** — Add students, record grades, view reports
- 📊 **Custom grading scales** — Admins define A/B/C/D/F score ranges
- 📱 **Mobile responsive** — Works on phone, tablet, and desktop
- 🎨 **Theme system** — Light/dark mode + 5 accent colors (saved per device)
- ☁️ **Real-time Firestore** — All data lives in the cloud

---

## Project Structure

```
edutrack/
├── index.html        ← Landing page + school registration
├── login.html        ← Login page
├── signup.html       ← Teacher sign-up page
├── admin.html        ← Admin dashboard
├── teacher.html      ← Teacher dashboard
├── css/
│   └── style.css     ← Global styles + theme system
└── js/
    ├── firebase.js   ← Firebase init + helpers (⚠ add your config here)
    ├── auth.js       ← Login / logout / session guard
    ├── school.js     ← School data helpers
    └── teacher.js    ← (teacher logic is inline in teacher.html)
```

---

## Firebase Setup (Step-by-Step)

### Step 1 — Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **"Add project"** → Name it `EduTrack` → Click **Create**

### Step 2 — Enable Firestore
1. Sidebar → **Build → Firestore Database**
2. Click **"Create database"** → **"Start in test mode"** → Choose a region → **Enable**

### Step 3 — Enable Authentication
1. Sidebar → **Build → Authentication** → **"Get Started"**
2. Under **Sign-in method** → Enable **Email/Password**

### Step 4 — Get Your Config
1. Click the ⚙️ gear icon → **Project Settings** → **General**
2. Scroll to **"Your apps"** → Click **`</>`** (web)
3. Register app name as `EduTrack Web` → Copy the `firebaseConfig` object

### Step 5 — Add Config to Project
Open `js/firebase.js` and replace the placeholder config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 6 — Set Firestore Security Rules
In Firebase Console → **Firestore → Rules** tab, replace the default rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schools/{schoolId} {
      allow read, write: if request.auth != null;
      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null &&
          exists(/databases/$(database)/documents/schools/$(schoolId)/users/$(request.auth.uid));
      }
    }
  }
}
```

Click **Publish**.

### Step 7 — Serve the App

Because Firebase uses ES modules (`import/export`), you need a local server. Options:

**Option A — VS Code Live Server** (easiest)
- Install the "Live Server" extension in VS Code
- Right-click `index.html` → **Open with Live Server**

**Option B — Node.js serve**
```bash
npm install -g serve
serve .
```

**Option C — Python**
```bash
python3 -m http.server 8080
```

Then open: `http://localhost:8080`

---

## How to Use

### Register a School (first time)
1. Open `index.html`
2. Scroll to **"Register Your School"**
3. Fill in school details, set your grading scale, create admin account
4. You're automatically taken to the Admin Dashboard

### Add Teachers (Admin only)
- Go to **Teachers** in the admin sidebar
- Click **"+ Add Teacher"** → Fill in name, email, password
- **OR** share your School Code with the teacher so they can self-register via `signup.html`

### School Code
- Found in **Admin Dashboard → School Info**
- Looks like: `A1B2C3D4`
- Teachers enter this code when signing up via `signup.html`

### Record Grades (Teacher)
1. Go to **Grade Entry**
2. Click **"+ Record Grade"**
3. Select student, enter subject and score
4. Grade letter auto-previews before saving

### View Student Reports (Teacher)
- Go to **Reports** → Select a student
- See overall average, per-subject breakdown, term-by-term grades

---

## Firestore Data Structure

```
/schools/{schoolId}
  name, address, state, country, phone, gradingScale[], createdAt

/schools/{schoolId}/users/{userId}
  name, email, role (admin|teacher), schoolId, createdAt

/schools/{schoolId}/students/{studentId}
  name, studentId, class, createdAt

/schools/{schoolId}/grades/{gradeId}
  studentId, subject, score, term, createdAt
```

---

## Customization

### Change Accent Colors
Users can change colors in the **Appearance** section of any dashboard.
Presets: Blue, Violet, Teal, Rose, Amber.

### Modify Grading Scale
Admins go to **Admin Dashboard → Grading Scale** to set custom score ranges.
Default:
- A: 90–100
- B: 80–89
- C: 70–79
- D: 60–69
- F: 0–59

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Fonts | DM Sans + DM Serif Display (Google Fonts) |
| Hosting | Any static host (Netlify, Vercel, Firebase Hosting) |

---

## Deploy to Firebase Hosting (Optional)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to: . (current folder)
# Single-page app: No
firebase deploy
```

---

## Author

Emmanuel Oluwamayowa Nasir  
CSE 310 — Applied Programming, Module 3: Cloud Databases  
Date: 2026