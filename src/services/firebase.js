// src/services/firebase.js
// React Native Firebase uses native modules — no need for initializeApp()
// Just import and use the services directly.

// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDYXjnDG09GbsOdQ9b-QRSjIMmtN4cK0pA",
    authDomain: "asha-care-e9398.firebaseapp.com",
    projectId: "asha-care-e9398",
    storageBucket: "asha-care-e9398.firebasestorage.app",
    messagingSenderId: "558544635510",
    appId: "1:558544635510:web:eb646dc6e3614124154157",
    measurementId: "G-J2FG8RQVFR"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//export const firestore = getFirestore(app);
export const db = getFirestore(app);     // 👈 add this
export const firestore = db;