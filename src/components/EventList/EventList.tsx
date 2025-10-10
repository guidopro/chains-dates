import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";

import "./EventList.css";

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

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Upcoming Events</h2>
      <div className="event-list">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="event-card"
          >
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <p className="event-date">
              {new Date(event.date).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
