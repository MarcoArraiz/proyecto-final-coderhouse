// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "entrega-react-coderhouse.firebaseapp.com",
  projectId: "entrega-react-coderhouse",
  storageBucket: "entrega-react-coderhouse.appspot.com",
  messagingSenderId: "260733940916",
  appId: "1:260733940916:web:d98ef7f891b81a69f653e1",
  measurementId: "G-59SF3999EB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
