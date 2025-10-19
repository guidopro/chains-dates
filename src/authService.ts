import { auth, db, provider, createUserProfile } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create Firestore user profile if it doesn't exist
    await createUserProfile(user);

    return user;
  } catch (err) {
    console.error("Google sign-in error:", err);
    return null;
  }
};

// ------------------ Email/Password Sign-Up ------------------
export const signUpEmail = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Create Firestore user document
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    email: user.email,
    name,
    role: "member", // default
  });

  return user;
};

// ------------------ Email/Password Sign-In ------------------
export const signInEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// ------------------ Promote User to Staff ------------------
export const promoteToStaff = async (
  userUid: string,
  enteredCode: string
): Promise<boolean> => {
  const STAFF_CODE = import.meta.env.VITE_STAFF_CODE;

  if (enteredCode === STAFF_CODE) {
    const userRef = doc(db, "users", userUid);
    await updateDoc(userRef, { role: "staff" });
    return true;
  }

  return false; // code was wrong
};
