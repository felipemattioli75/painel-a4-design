// src/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiuFQriY5F8t-uI7DBfOqjLXwCummLn20",
  authDomain: "painel-a4-design.firebaseapp.com",
  projectId: "painel-a4-design",
  storageBucket: "painel-a4-design.appspot.com",
  messagingSenderId: "24296551886",
  appId: "1:24296551886:web:ea75027d8c0fcdcf13a79f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
