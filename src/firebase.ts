// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqwefVkseaEhv73lN8tG6VZb7og2eO6cw",
  authDomain: "chains-and-dates.firebaseapp.com",
  projectId: "chains-and-dates",
  storageBucket: "chains-and-dates.firebasestorage.app",
  messagingSenderId: "591985845947",
  appId: "1:591985845947:web:19d58dad0e6bfdb2f86b9e",
  measurementId: "G-FYLWWGWKGL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
export const logout = () => signOut(auth);
export { app };
