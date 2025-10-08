import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // checks if user doc exists
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Create a user doc with default role
          await setDoc(userRef, {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            role: "member",
            createdAt: new Date(),
          });
          console.log("✅ New user document created");

          // not staff if just created
          setIsStaff(false);
        } else {
          const data = userSnap.data();
          // check role
          const staffStatus = data.role === "staff";
          setIsStaff(staffStatus);
          console.log(`👤 User role: ${data.role}`);
        }

        setUser(firebaseUser);
      } else {
        setUser(null);
        setIsStaff(false);
      }
      setLoading(false);
    });

    return unsubscribe; // cleanup listener
  }, []);

  return { user, isStaff, loading };
}
