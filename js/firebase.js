// ============================================================
// firebase.js — Initialize Firebase app and export services
// IMPORTANT: Replace the firebaseConfig below with your own
// config from Firebase Console → Project Settings → Your apps
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBImrtxvZ2muAK46jYey8eSWNh6qL6PiBg",
  authDomain: "edutrack-89c61.firebaseapp.com",
  projectId: "edutrack-89c61",
  storageBucket: "edutrack-89c61.firebasestorage.app",
  messagingSenderId: "442636198128",
  appId: "1:442636198128:web:6f241ab5291e558bce2235"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore instances for use across the app
export const auth = getAuth(app);
export const db = getFirestore(app);

// Default grading scale (admins can override this per school)
export const DEFAULT_GRADING_SCALE = [
  { letter: "A", min: 90, max: 100 },
  { letter: "B", min: 80, max: 89 },
  { letter: "C", min: 70, max: 79 },
  { letter: "D", min: 60, max: 69 },
  { letter: "F", min: 0,  max: 59 }
];

// Helper: get letter grade from a score using a grading scale array
export function getLetterGrade(score, gradingScale) {
  const scale = gradingScale || DEFAULT_GRADING_SCALE;
  const match = scale.find(g => score >= g.min && score <= g.max);
  return match ? match.letter : "N/A";
}

// Helper: show a toast notification
export function showToast(message, type = "success") {
  const existing = document.getElementById("toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("toast-visible"), 10);
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Helper: format a Firestore timestamp to readable date
export function formatDate(timestamp) {
  if (!timestamp) return "—";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}