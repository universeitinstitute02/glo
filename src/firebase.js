import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0277968699",
  appId: "1:415254629490:web:fa65667fa6ba2406cd46eb",
  apiKey: "AIzaSyCE1yIGj8k8ieeJ8-Jm2vDVegyfItGdltU",
  authDomain: "gen-lang-client-0277968699.firebaseapp.com",
  messagingSenderId: "415254629490",
  storageBucket: "gen-lang-client-0277968699.firebasestorage.app"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app, "ai-studio-6d598038-b2fd-4001-98c6-dd83db9e4fe5");

export { app, auth, db };
