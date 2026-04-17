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

[Software Demo Video](https://www.youtube.com/watch?v=04mFmSQ7jFY)

# Development Environment

- **IDE:** Visual Studio Code
- **Runtime:** Node.js
- **Version Control:** Git / GitHub

The project is written in **JavaScript** using **Node.js**. It utilizes built-in
Node modules such as `fs` for file handling, `path` for file paths, and
`readline` for user interaction in the command-line interface.

Additionally, external libraries such as `chalk` (for styling terminal output)
may be used to improve user experience.

# Useful Websites

- [Node.js Documentation](https://nodejs.org/en/docs)
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [W3Schools JavaScript Tutorial](https://www.w3schools.com/js/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/javascript)

# Future Work

- Add teachers planner
- Display charts and visual summaries of best performing students and least performing students
- Build a web-based teachers' lesson plans
- Add more security layer
