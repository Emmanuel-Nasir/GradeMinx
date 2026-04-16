// ============================================================
// auth.js — Authentication helpers used across pages
// Handles: login, signup, logout, session guard
// ============================================================

import { auth, db, showToast } from './firebase.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, query, where, getDocs, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Login ──────────────────────────────────────────────────
// Returns { user, userData, schoolId } or throws
export async function loginUser(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCred.user.uid;

  // Find which school this user belongs to
  // We query all schools' user subcollections via a collectionGroup query
  // But simpler: we store schoolId in a top-level users collection too
  const userData = await getUserData(uid);
  if (!userData) throw new Error("User record not found. Contact your admin.");

  // Save session info
  localStorage.setItem('et-uid', uid);
  localStorage.setItem('et-schoolId', userData.schoolId);
  localStorage.setItem('et-role', userData.role);
  localStorage.setItem('et-name', userData.name);

  return { uid, userData, schoolId: userData.schoolId };
}

// ── Get User Data from Firestore ───────────────────────────
// Looks up user across schools by checking /schools/{schoolId}/users/{uid}
// Uses a stored schoolId in localStorage for speed (set on first login)
export async function getUserData(uid) {
  // Try stored schoolId first (fast path)
  const storedSchoolId = localStorage.getItem('et-schoolId');
  if (storedSchoolId) {
    const userDoc = await getDoc(doc(db, 'schools', storedSchoolId, 'users', uid));
    if (userDoc.exists()) return { id: uid, ...userDoc.data() };
  }

  // Fallback: search all schools (slower, only on first login edge case)
  // In production you'd use a separate /users collection or Firebase custom claims
  const schoolsSnap = await getDocs(collection(db, 'schools'));
  for (const schoolDoc of schoolsSnap.docs) {
    const userRef = doc(db, 'schools', schoolDoc.id, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      localStorage.setItem('et-schoolId', schoolDoc.id);
      return { id: uid, ...userSnap.data() };
    }
  }
  return null;
}

// ── Logout ─────────────────────────────────────────────────
export async function logoutUser() {
  await signOut(auth);
  localStorage.removeItem('et-uid');
  localStorage.removeItem('et-schoolId');
  localStorage.removeItem('et-role');
  localStorage.removeItem('et-name');
  window.location.href = 'login.html';
}

// ── Session Guard ──────────────────────────────────────────
// Use on protected pages — redirects to login if not authenticated
// Usage: await requireAuth('admin') — pass required role or null for any
export function requireAuth(requiredRole = null) {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (!user) {
        window.location.href = 'login.html';
        return reject(new Error('Not authenticated'));
      }

      const userData = await getUserData(user.uid);
      if (!userData) {
        window.location.href = 'login.html';
        return reject(new Error('No user data'));
      }

      if (requiredRole && userData.role !== requiredRole) {
        // Wrong role — redirect to appropriate dashboard
        const dest = userData.role === 'admin' ? 'admin.html' : 'teacher.html';
        window.location.href = dest;
        return reject(new Error('Insufficient permissions'));
      }

      resolve({ user, userData, schoolId: userData.schoolId });
    });
  });
}

// ── Get Current Session ────────────────────────────────────
// Returns cached session data without Firestore call
export function getSession() {
  return {
    uid:      localStorage.getItem('et-uid'),
    schoolId: localStorage.getItem('et-schoolId'),
    role:     localStorage.getItem('et-role'),
    name:     localStorage.getItem('et-name')
  };
}