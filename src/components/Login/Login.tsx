import { useState, useEffect } from "react";
import { auth, logout } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { signInWithGoogle, signInEmail, signUpEmail } from "../../authService";

import "./Login.css";

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
    <div className="login-container">
      {user ? (
        <div className="welcome-section">
          <p className="welcome-text">Welcome {user.displayName || name}</p>
          <button className="logout-button" onClick={logout}>
            Log out
          </button>
        </div>
      ) : (
        <div className="login-section">
          <button className="google-button" onClick={signInWithGoogle}>
            Sign in with Google
          </button>

          <hr className="divider" />

          <h4 className="email-login-title">Email Login / Sign-Up</h4>
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
          <div className="button-group">
            <button className="email-button" onClick={handleEmailSignIn}>
              Sign In
            </button>
            <button className="email-button" onClick={handleEmailSignUp}>
              Sign Up
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
      )}
    </div>
  );
}
