import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

interface EventData {
  title: string;
  description: string;
  isFree: boolean;
  attendees?: string[];
  date: string;
  createdAt: string;
  createdBy: string;
  imageUrl?: string;
}

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          setEvent(eventSnap.data() as EventData);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { event, loading, error };
}
