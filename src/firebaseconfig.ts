// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQYOTz_xjxBonRuZRMOT1iDNwqO4PnO2E",
  authDomain: "safeviewbd.firebaseapp.com",
  databaseURL: "https://safeviewbd-default-rtdb.firebaseio.com",
  projectId: "safeviewbd",
  storageBucket: "safeviewbd.appspot.com",
  messagingSenderId: "580518193239",
  appId: "1:580518193239:web:f3ed67777400f538e5db12",
  measurementId: "G-PGC4ZEG177"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);