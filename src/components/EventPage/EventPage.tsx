import { useParams } from "react-router-dom";
import { useEvent } from "../../hooks/useEvent";
import { doc, arrayUnion, arrayRemove, writeBatch, deleteField } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import { AddToCalendar } from "../../AddToCalendar";

// styling
import "./EventPage.css";
import { formatEventTime } from "../../utils/formatEventTime";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import { useEffect, useState } from "react";

export default function EventPage() {
  const { id } = useParams(); // e.g. /events/:id
  const { event, loading, error } = useEvent(id!);
  const { user } = useAuth(); // current logged-in user
  const [attend, setAttend] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (user && event?.attendees) {
      setAttend(event.attendees.includes(user.uid));
    } else {
      setAttend(false);
    }
  }, [user, event]);

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event found.</p>;

  const handleToggleAttend = async () => {
    if (!user) return toast("Please log in first");
    setButtonLoading(true);

    const eventRef = doc(db, "events", id!);
    const userRef = doc(db, "users", user.uid);

    try {
      const batch = writeBatch(db);

      if (attend) {
        // remove user from both docs
        batch.update(eventRef, { attendees: arrayRemove(user.uid) });
        
          // remove event entry from user map
      batch.update(userRef, {
        [`joinedEvents.${id}`]: deleteField(),
      });

      } else {
        // add user to both docs
        batch.update(eventRef, { attendees: arrayUnion(user.uid) });
           // add event entry to user map
      batch.update(userRef, {
        [`joinedEvents.${id}`]: {
          date: event.start, // store event date string
        },
      });
      }

      await batch.commit();
      setAttend(!attend);
      toast(
        attend
          ? "You're no longer attending this event."
          : "You're signed up for this event!"
      );
    } catch (err) {
      console.error(err);
      toast("Something went wrong updating attendance.");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="event-page">
      <div className="event-hero">
        <img
          src={
            event.imageUrl ||
            "https://placehold.co/600x400/orange/white?text=Event"
          }
          alt={event.title}
          className="event-img"
        />
      </div>
      <div className="event-content">
        <div className="event-main">
          <h2 className="event-title">{event.title}</h2>
          <p className="event-date">
            {formatEventTime(event.start, event.end)}
          </p>
          <p className="event-creator">By: {event.createdByName}</p>
          <p>
            <strong>Price:</strong> {event.isFree ? "Free" : "Paid"}
          </p>
          <p className="event-description">{event.description}</p>
        </div>
        <aside className="event-side">
          <WeatherWidget startDate={event.start} endDate={event.end} />
          <button
            onClick={() => handleToggleAttend()}
            disabled={buttonLoading}
            className={`${attend ? "attending-button" : "attend-button"} ${
              buttonLoading ? "disabled" : ""
            }`}
          >
            {buttonLoading ? "Saving..." : attend ? "Attending" : "Attend"}
          </button>
          <AddToCalendar event={event} />
        </aside>
      </div>
    </div>
  );
}
