// Firebase client initialization (web SDK)
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'

// Using provided Firebase web config
const firebaseConfig = {
  apiKey: "AIzaSyBGuJakT7vW4BeMR5AeYruQ7U3JPQTe-UA",
  authDomain: "davischatspace.firebaseapp.com",
  projectId: "davischatspace",
  storageBucket: "davischatspace.firebasestorage.app",
  messagingSenderId: "709347251686",
  appId: "1:709347251686:web:4e186a0b7f42893622b227",
  measurementId: "G-3ZMQHEMD14"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, ref, uploadString, getDownloadURL }
