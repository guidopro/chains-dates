import { useState, useEffect } from "react";
import { auth, provider, logout, createUserProfile } from "../firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

export async function handleGoogleSignIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    // The signed-in user info.
    const user = result.user;
    console.log("Signed in user:", user);

    // Create user profile in Firestore if it doesn't exist
    await createUserProfile(user);

    return user;
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    let errorCode = "unknown";

    if (typeof error === "object" && error !== null) {
      // Error message
      if ("message" in error && typeof (error as any).message === "string") {
        errorMessage = (error as any).message;
      }
      // Error code
      if ("code" in error && typeof (error as any).code === "string") {
        errorCode = (error as any).code;
      }
    }

    console.error("Google sign-in error:", errorCode, errorMessage);
    // ... (display error message to user)
    return null;
  }
}

export function Login() {
  const [user, setUser] = useState<User | null>(null);

  // Watch for login state changes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <p>Welcome {user.displayName}</p>
          <button onClick={logout}>Log out</button>
        </>
      ) : (
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      )}
    </div>
  );
}
