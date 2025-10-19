import { useState, useEffect } from "react";
import { auth, logout } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { signInWithGoogle, signInEmail, signUpEmail } from "../authService";

// export async function handleGoogleSignIn() {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     // The signed-in user info.
//     const user = result.user;
//     console.log("Signed in user:", user);

//     // Create user profile in Firestore if it doesn't exist
//     await createUserProfile(user);

//     return user;
//   } catch (error) {
//     let errorMessage = "An unexpected error occurred.";
//     let errorCode = "unknown";

//     if (typeof error === "object" && error !== null) {
//       // Error message
//       if ("message" in error && typeof (error as any).message === "string") {
//         errorMessage = (error as any).message;
//       }
//       // Error code
//       if ("code" in error && typeof (error as any).code === "string") {
//         errorCode = (error as any).code;
//       }
//     }

//     console.error("Google sign-in error:", errorCode, errorMessage);
//     // ... (display error message to user)
//     return null;
//   }
// }

export function Login() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // for email signup
  const [error, setError] = useState("");

  // Watch for login state changes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleEmailSignUp = async () => {
    try {
      if (!name) throw new Error("Please enter your name");
      await signUpEmail(email, password, name);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInEmail(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome {user.displayName || name}</p>
          <button onClick={logout}>Log out</button>
        </>
      ) : (
        <>
          <button onClick={signInWithGoogle}>Sign in with Google</button>
          <hr />
          <h4>Email Login / Sign-Up</h4>
          <input
            type="text"
            placeholder="Name (for signup)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button onClick={handleEmailSignIn}>Sign In</button>
            <button onClick={handleEmailSignUp}>Sign Up</button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
}
