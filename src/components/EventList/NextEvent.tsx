import { Link } from "react-router-dom";
import { formatEventTime } from "../../utils/formatEventTime";
import type { EventFirestore } from "../../types/Event";

export default function NextEvent({
  nextEvent,
}: {
  nextEvent: EventFirestore;
}) {
  console.log(nextEvent, "next event in component");

  return (
    <>
      <h2>Next Event</h2>
      <div>
        <Link to={`/events/${nextEvent.id}`} className="event-card">
          <div className="img-container">
            <img
              src={
                nextEvent.imageUrl ||
                "https://placehold.co/600x400/orange/white?text=Event"
              }
              alt=""
              className="event-list-img"
            />
            <div className="top-right">{nextEvent.isFree ? "Free" : ""}</div>
          </div>
          <small className="event-date">
            {formatEventTime(nextEvent.start)}
          </small>
          <h3 className="event-title">{nextEvent.title}</h3>
          <p>by: {nextEvent.createdByName}</p>
        </Link>
      </div>
    </>
  );
}
