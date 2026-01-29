// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtdrVfOnz2bO7J6YWJ_l-fPYz7cPsyjqQ",
  authDomain: "profile-3f806.firebaseapp.com",
  projectId: "profile-3f806",
  storageBucket: "profile-3f806.firebasestorage.app",
  messagingSenderId: "720481446432",
  appId: "1:720481446432:web:4107abc3320cb684776a45",
  measurementId: "G-G4WLGQ79NW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);