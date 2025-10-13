import { useParams } from "react-router-dom";
import { useEvent } from "../../hooks/useEvent";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import { AddToCalendar } from "../../AddToCalendar";

// styling
import "./EventPage.css";

export default function EventPage() {
  const { id } = useParams(); // e.g. /events/:id
  const { event, loading, error } = useEvent(id!);
  const { user } = useAuth(); // current logged-in user

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event found.</p>;

  const handleAttend = async (eventId: string) => {
    if (!user) return toast("Please log in first");

    await updateDoc(doc(db, "events", eventId), {
      attendees: arrayUnion(user.uid),
    });

    toast("You’re signed up for the event!");
  };

  return (
    <div className="event-page">
      <img src={event.imageUrl} alt="" className="event-img" />
      <h3 className="event-title">{event.title}</h3>
      <p>By: {event.createdByName}</p>
      <p className="event-description">{event.description}</p>
      <p className="event-date">{new Date(event.date).toLocaleString()}</p>
      <p>
        <strong>Price:</strong> {event.isFree ? "Free" : "Paid"}
      </p>
      <button onClick={() => handleAttend(id!)} className="attend-button">
        Attend
      </button>
      <ToastContainer />
      <AddToCalendar event={event} />
    </div>
  );
}
