// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIgNogPf7Ep37zG3WzsYZwVKdyWRlr4GU",
  authDomain: "codeskytz-app.firebaseapp.com",
  projectId: "codeskytz-app",
  storageBucket: "codeskytz-app.firebasestorage.app",
  messagingSenderId: "615250738064",
  appId: "1:615250738064:web:3559c408a1a79bfc639115"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

