import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import ToggleViewButton from "./ToggleViewButton";

import "./EventList.css";
import WelcomeUser from "../WelcomeUser";
import { formatEventTime } from "../../utils/formatEventTime";

interface EventFirestore {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  createdAt: string;
  createdByName: string;
  attendees: string[];
  imageUrl: string;
  isFree: boolean;
}

export default function EventList() {
  const [events, setEvents] = useState<EventFirestore[]>([]);
  const [toggleView, setToggleView] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchEvents = async () => {
      const now = new Date(); // current time

      // Create a Firestore query:
      const eventsRef = collection(db, "events");
      const q = query(
        eventsRef,
        where("start", ">=", now), // only upcoming events
        orderBy("start", "asc") // earliest first
      );

      const querySnapshot = await getDocs(q);

      const eventsData: EventFirestore[] = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          title: data.title,
          description: data.description,
          createdAt: data.createdAt,
          createdByName: data.createdByName,
          attendees: data.attendees || [],
          start: data.start.toDate().toISOString(),
          end: data.end.toDate().toISOString(),
          imageUrl: data.imageUrl,
          isFree: data.isFree,
        };
      });

      setEvents(eventsData);
    };

    fetchEvents();

    if (isMobile) setToggleView(true); // true = card view
    // listener for screen resize
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  return (
    <div className="event-list-page">
      <div className="welcome">
        <WelcomeUser />
      </div>
      <h2 className="upcoming-events">Upcoming Events</h2>
      {isMobile ? null : (
        <ToggleViewButton
          toggleView={toggleView}
          setToggleView={setToggleView}
        />
      )}
      {toggleView ? <CardView /> : <ListView />}
    </div>
  );

  function CardView() {
    return (
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
            <small className="event-date">{formatEventTime(event.start)}</small>
            <h3 className="event-title">{event.title}</h3>
            <p>by: {event.createdByName}</p>
            <p>Attendees: {event.attendees.length}</p>
          </Link>
        ))}
      </div>
    );
  }

  function ListView() {
    return (
      <div className="list-view">
        {events.map((event) => {
          return (
            <Link key={event.id} to={`/events/${event.id}`} className="row">
              <div className="col-2">
                <img
                  src={
                    event.imageUrl ||
                    "https://placehold.co/600x400/orange/white?text=Event"
                  }
                  alt=""
                  className="event-list-img"
                />
              </div>
              <div className="col-10">
                <small className="event-date">
                  {formatEventTime(event.start)}
                </small>
                <h3 className="event-title">{event.title}</h3>
                <p>by: {event.createdByName}</p>
                <p>Attendees: {event.attendees.length}</p>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
}
