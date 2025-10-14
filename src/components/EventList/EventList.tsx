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
  isFree?: boolean;
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
          isFree: data.isFree,
        };
      });

      setEvents(eventsData);
    };

    fetchEvents();
  }, []);

  return (
    <div className="event-list-page">
      <h2 className="upcoming-events">Upcoming Events</h2>
      <div className="event-list-cards">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="event-card"
          >
            <div className="img-container">
              <img
                src={
                  event.imageUrl ||
                  "https://placehold.co/600x400/orange/white?text=Event"
                }
                alt=""
                className="event-list-img"
              />
              <div className="top-right">{event.isFree ? "Free" : ""}</div>
            </div>
            <small className="event-date">
              {new Date(event.date).toLocaleString()}
            </small>
            <h3 className="event-title">{event.title}</h3>
            <p>by: {event.createdByName}</p>
            <p>Attendees: {event.attendees.length}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
