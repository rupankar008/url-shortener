// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRbncdblwTFSGmb6TFRKaLDSIHCX7XUgo",
  authDomain: "linkshortner-b5be4.firebaseapp.com",
  projectId: "linkshortner-b5be4",
  storageBucket: "linkshortner-b5be4.firebasestorage.app",
  messagingSenderId: "649855142962",
  appId: "1:649855142962:web:9e3631b72030889674c02b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);