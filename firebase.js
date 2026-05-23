import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIYXYZda2Jra4afPrnJduoeT5orISxRQ8",
  authDomain: "mentalgame-79caa.firebaseapp.com",
  projectId: "mentalgame-79caa",
  storageBucket: "mentalgame-79caa.firebasestorage.app",
  messagingSenderId: "856032374001",
  appId: "1:856032374001:web:2779516b5a0a8bc4770d50"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

window.auth = auth;
window.db = db;

window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;

window.signInWithEmailAndPassword = signInWithEmailAndPassword;

window.signOut = signOut;

window.onAuthStateChanged = onAuthStateChanged;

window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;