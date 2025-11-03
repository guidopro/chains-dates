// import "./YourEvents.css";
import "../EventList/EventList.css";

import { useEffect, useState } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import { formatEventTime } from "../../utils/formatEventTime";
import { Link } from "react-router-dom";

// ---------- Types ----------
interface EventFirestore {
  id: string;
  title: string;
  start: string;
  end: string;
  createdByName: string;
  attendees: string[];
  imageUrl: string;
}

interface UserFirestore {
  joinedEvents?: {
    [eventId: string]: {
      date: string;
    };
  };
}

const YourEvents = () => {
  const { user } = useAuth();
  const [pastEvents, setPastEvents] = useState<EventFirestore[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventFirestore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserEvents = async () => {
      try {
        setLoading(true);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        const userData = userSnap.data() as UserFirestore;
        const joinedEvents = userData.joinedEvents || {};

        // Separate event IDs into upcoming/past
        const today = new Date();
        const upcomingIds: EventFirestore[] = [];
        const pastIds: EventFirestore[] = [];

        const eventIds = Object.keys(joinedEvents);
        if (eventIds.length === 0) {
          setUpcomingEvents([]);
          setPastEvents([]);
          setLoading(false);
          return;
        }

        // Fetch all events by their IDs
        for (const id of eventIds) {
          const eventRef = doc(db, "events", id);
          const eventSnap = await getDoc(eventRef);

          if (eventSnap.exists()) {
            const data = eventSnap.data() as Omit<
              EventFirestore,
              "id" | "start"
            > & {
              start: Timestamp;
            };

            const event: EventFirestore = {
              id,
              ...data,
              start: data.start.toDate().toISOString(),
            };
            console.log(event);

            const eventDate = new Date(joinedEvents[id].date);
            console.log(eventDate);

            if (eventDate > today) {
              upcomingIds.push(event);
            } else {
              pastIds.push(event);
            }
          }
        }

        upcomingIds.sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );
        pastIds.sort(
          (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
        );

        setUpcomingEvents(upcomingIds);
        setPastEvents(pastIds);
      } catch (error) {
        console.error("Error fetching user events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user]);

  if (!user) return <p>Please log in to view your events.</p>;
  if (loading) return <p>Loading your events...</p>;

  return (
    <div className="event-list-page">
      <h2>Your Upcoming Events</h2>
      {upcomingEvents.length === 0 ? (
        <p>You have no upcoming events.</p>
      ) : (
        <div className="event-list-cards">
          {upcomingEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="event-card"
            >
              <div className="img-container">
                <img
                  className="event-list-img"
                  src={event.imageUrl}
                  alt={event.title}
                />
              </div>
              <h3>{event.title}</h3>
              <p>{formatEventTime(event.start)}</p>
            </Link>
          ))}
        </div>
      )}

      <h2>Past Events</h2>
      {pastEvents.length === 0 ? (
        <p>You haven’t attended any past events yet.</p>
      ) : (
        <div className="event-list-cards">
          {pastEvents.map((event) => (
            <Link
              to={`/events/${event.id}`}
              key={event.id}
              className="event-card"
            >
              <div className="img-container">
                <img className="" src={event.imageUrl} alt={event.title} />
              </div>
              <h3>{event.title}</h3>
              <p>{formatEventTime(event.start)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourEvents;
