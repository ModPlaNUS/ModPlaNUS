import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getDatabase} from "firebase/database";
import firebase from 'firebase/compat/app';
import {getFirestore} from 'firebase/firestore';
import 'firebase/compat/auth'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: "AIzaSyBXA1kSfPRpqDgY8ltyOcMff1ZcXQIoAbg",
  authDomain: "modplanus-1c3ba.firebaseapp.com",
  databaseURL: "https://modplanus-1c3ba-default-rtdb.firebaseio.com",
  projectId: "modplanus-1c3ba",
  storageBucket: "modplanus-1c3ba.appspot.com",
  messagingSenderId: "1480562933",
  appId: "1:1480562933:web:7ec0a122cd19f2302c4dbc",
  measurementId: "G-V1ZM1M3SB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
firebase.initializeApp(firebaseConfig);
export default firebaseConfig;