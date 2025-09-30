import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";

// Create an event
export const createEvent = async (
  title: string,
  description: string,
  date: Date
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const docRef = await addDoc(collection(db, "events"), {
      title,
      description,
      date, // stored as timestamp in Firestore
      attendees: [], // empty at creation
      createdBy: doc(db, "users", user.uid), // reference to user document
      createdAt: serverTimestamp(),
    });

    console.log("Event created with ID:", docRef.id);
    return true;
  } catch (err) {
    console.error("Error creating event:", err);
    return false;
  }
};
