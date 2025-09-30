import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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
export const db = getFirestore(app);

export const provider = new GoogleAuthProvider();
export const logout = () => signOut(auth);
export { app };

// Function to create Firestore user document
export const createUserProfile = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      role: "member", // default role
    });
    console.log("User document created in Firestore");
  }
};
