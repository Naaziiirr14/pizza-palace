// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjs9iipPc0i4vPfciXgEIt7R-uFaXlpGA",
  authDomain: "pizza-palace-31176.firebaseapp.com",
  projectId: "pizza-palace-31176",
  storageBucket: "pizza-palace-31176.firebasestorage.app",
  messagingSenderId: "1057587146066",
  appId: "1:1057587146066:web:e85be8691aac131e899e8b",
  measurementId: "G-XQ2FDWSCL9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app)