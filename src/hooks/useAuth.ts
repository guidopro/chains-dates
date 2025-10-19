import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Watch for auth changes
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsStaff(false);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      const userRef = doc(db, "users", firebaseUser.uid);

      // 🔥 Listen to Firestore doc changes in real time
      const unsubscribeUser = onSnapshot(userRef, async (snap) => {
        if (!snap.exists()) {
          // create user doc if missing
          await setDoc(userRef, {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            role: "member",
            createdAt: new Date(),
          });
          console.log("✅ New user document created");
          setIsStaff(false);
        } else {
          const data = snap.data();
          const staffStatus = data.role === "staff";
          setIsStaff(staffStatus);
          console.log(`👤 User role updated: ${data.role}`);
        }
        setLoading(false);
      });

      // Clean up the Firestore listener when user signs out or component unmounts
      return () => unsubscribeUser();
    });

    return unsubscribeAuth;
  }, []);

  return { user, isStaff, loading };
}
