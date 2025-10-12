import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export interface EventData {
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
          const data = eventSnap.data();
          console.log(data, "data in hook");

          const date = data.date.toDate().toISOString();
          const createdAt = data.createdAt.toDate().toISOString();
          const createdBy = data.createdBy.id;

          // setEvent(eventSnap.data() as EventData);
          setEvent({
            title: data.title,
            description: data.description,
            isFree: data.isFree,
            attendees: data?.attendees,
            date: date,
            createdAt: createdAt,
            createdBy: createdBy,
            imageUrl: data?.imageUrl,
          });
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
