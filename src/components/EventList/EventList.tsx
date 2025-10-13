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
  createdByName: string;
  attendees: string[];
  imageUrl?: string;
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
          createdByName: data.createdByName,
          attendees: data.attendees || [],
          date: data.date.toDate().toISOString(),
          imageUrl: data.imageUrl,
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
            <img
              src={event.imageUrl || null}
              alt=""
              className="event-list-img"
            />
            <p className="event-date">
              {new Date(event.date).toLocaleString()}
            </p>
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <p>By: {event.createdByName}</p>
            <p>Attendees: {event.attendees.length}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
