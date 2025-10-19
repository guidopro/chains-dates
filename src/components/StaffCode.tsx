import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";

export default function StaffCode() {
  const { user, isStaff } = useAuth();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user) {
      setMessage("You must be logged in to enter a staff code.");
      return;
    }

    const STAFF_CODE = import.meta.env.VITE_STAFF_CODE;

    if (code === STAFF_CODE) {
      try {
        const userRef = doc(db, "users", user.uid);
        console.log("Updating user doc:", user.uid, { role: "staff" });
        await updateDoc(userRef, { role: "staff" });
        setMessage("✅ Staff code accepted! You are now a staff user.");

        // Note: your useAuth hook listens to changes in Firestore via onAuthStateChanged
        // so `isStaff` should update automatically if you refresh or re-read user doc
      } catch (err) {
        console.error(err);
        setMessage("An error occurred. Try again.");
      }
    } else {
      setMessage("❌ Invalid staff code. Try again.");
    }
  };

  return (
    <div>
      {isStaff ? (
        <p>You are a staff user. You can create events.</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter staff code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit Code</button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
