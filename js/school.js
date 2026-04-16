// ============================================================
// school.js — School data helpers
// Used for fetching/updating school info and grading scale
// ============================================================

import { db, DEFAULT_GRADING_SCALE, getLetterGrade } from './firebase.js';
import {
  doc, getDoc, updateDoc, collection, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Get School Data ────────────────────────────────────────
export async function getSchool(schoolId) {
  const snap = await getDoc(doc(db, 'schools', schoolId));
  if (!snap.exists()) throw new Error('School not found.');
  return { id: snap.id, ...snap.data() };
}

// ── Update School Info ─────────────────────────────────────
export async function updateSchool(schoolId, data) {
  await updateDoc(doc(db, 'schools', schoolId), data);
}

// ── Get Grading Scale ──────────────────────────────────────
export async function getGradingScale(schoolId) {
  const school = await getSchool(schoolId);
  return school.gradingScale || DEFAULT_GRADING_SCALE;
}

// ── Update Grading Scale ───────────────────────────────────
export async function updateGradingScale(schoolId, scale) {
  await updateDoc(doc(db, 'schools', schoolId), { gradingScale: scale });
}

// ── Get All Students for a School ─────────────────────────
export async function getStudents(schoolId) {
  const snap = await getDocs(collection(db, 'schools', schoolId, 'students'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Get All Grades for a School ────────────────────────────
export async function getGrades(schoolId) {
  const snap = await getDocs(collection(db, 'schools', schoolId, 'grades'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Get All Users (teachers + admins) ─────────────────────
export async function getUsers(schoolId) {
  const snap = await getDocs(collection(db, 'schools', schoolId, 'users'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Compute Student Report ─────────────────────────────────
// Returns a summary object for a student given grades and scale
export function computeStudentReport(student, grades, gradingScale) {
  const sGrades = grades.filter(g => g.studentId === student.id);
  if (!sGrades.length) return { average: null, letter: '—', grades: [], bySubject: {} };

  const average = sGrades.reduce((a, b) => a + b.score, 0) / sGrades.length;
  const letter = getLetterGrade(average, gradingScale);

  // Group by subject
  const bySubject = {};
  sGrades.forEach(g => {
    if (!bySubject[g.subject]) bySubject[g.subject] = [];
    bySubject[g.subject].push(g.score);
  });

  // Average per subject
  const subjectAverages = Object.entries(bySubject).map(([subject, scores]) => ({
    subject,
    average: scores.reduce((a, b) => a + b, 0) / scores.length,
    count: scores.length,
    letter: getLetterGrade(scores.reduce((a, b) => a + b, 0) / scores.length, gradingScale)
  }));

  return {
    average,
    letter,
    grades: sGrades,
    bySubject,
    subjectAverages,
    highest: Math.max(...sGrades.map(g => g.score)),
    lowest:  Math.min(...sGrades.map(g => g.score)),
    count:   sGrades.length
  };
}