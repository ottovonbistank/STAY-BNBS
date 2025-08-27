// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBg6Mm9qTYxAQOa5DU0bhYlPlU8XbcWz0",
  authDomain: "stay-bnbs.firebaseapp.com",
  projectId: "stay-bnbs",
  storageBucket: "stay-bnbs.firebasestorage.app",
  messagingSenderId: "854068112859",
  appId: "1:854068112859:web:c144e99ba0551b69c50bfe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Auth and export it
export const auth = getAuth(app);

