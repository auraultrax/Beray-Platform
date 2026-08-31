import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Beray sistemi Firebase bağlantısı
const firebaseConfig = {
  apiKey: "AIzaSyBBPmjL_OSdBWsUkeS5ZS9-YnVPqyhdko",
  authDomain: "sistem-16411.firebaseapp.com",
  projectId: "sistem-16411",
  storageBucket: "sistem-16411.firebasestorage.app",
  messagingSenderId: "1036642820709",
  appId: "1:1036642820709:web:dfa1cd766ff6956580dc8c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp
};
