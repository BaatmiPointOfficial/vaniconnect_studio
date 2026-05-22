import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🌟 1. IMPORT FIRESTORE

const firebaseConfig = {

    apiKey: "AIzaSyC5_FPA55fRrvWZKzhl5Rg1oI85Vtq1mvc",
  authDomain: "vanniconnect-studio.firebaseapp.com",
  projectId: "vanniconnect-studio",
  storageBucket: "vanniconnect-studio.firebasestorage.app",
  messagingSenderId: "43952554755",
  appId: "1:43952554755:web:52bbb4a0e70c04f164df36"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app); // 🌟 2. EXPORT THE DATABASE (db)