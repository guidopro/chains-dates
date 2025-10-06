import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";

interface EventFirestore {
  id: string;
  title: string;
  description: string;
  date: string;
  createdBy: string;
  attendees: string[];
}

export default function EventList() {
  const [events, setEvents] = useState<EventFirestore[]>([]);
  const { user } = useAuth(); // current logged-in user

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));

      const eventsData: EventFirestore[] = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          title: data.title,
          description: data.description,
          createdBy: data.createdBy,
          attendees: data.attendees || [],
          date: data.date.toDate().toISOString(),
        };
      });

      setEvents(eventsData);
    };

    fetchEvents();
  }, []);

  const handleAttend = async (eventId: string) => {
    if (!user) return toast("Please log in first");

    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      attendees: arrayUnion(user.uid),
    });

    toast("You’re signed up for the event!");
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Upcoming Events</h2>
      {events.map((event) => (
        <div key={event.id} className="border p-4 rounded shadow">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p>{event.description}</p>
          <p>{new Date(event.date).toLocaleString()}</p>
          <button
            onClick={() => handleAttend(event.id)}
            className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
          >
            Attend
          </button>
          <ToastContainer />
          {/* Step 3 will go here later: Add to Google Calendar button */}
        </div>
      ))}
    </div>
  );
}
