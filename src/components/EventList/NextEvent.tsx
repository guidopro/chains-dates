import { Link } from "react-router-dom";
import { formatEventTime } from "../../utils/formatEventTime";
import type { EventFirestore } from "../../types/Event";
import { useEffect, useState } from "react";
import "./NextEvent.css";

export default function NextEvent({
  nextEvent,
}: {
  nextEvent: EventFirestore;
}) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const eventTime = new Date(nextEvent.start).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = eventTime - now;

      setTimeLeft(difference);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

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
        <div className="countdown">
          <div className="countdown-unit">
            <span>{days}</span>
            <small>Days</small>
          </div>

          <div className="countdown-unit">
            <span>{hours}</span>
            <small>Hours</small>
          </div>

          <div className="countdown-unit">
            <span>{minutes}</span>
            <small>Minutes</small>
          </div>

          <div className="countdown-unit">
            <span>{seconds}</span>
            <small>Seconds</small>
          </div>
        </div>
      </div>
    </>
  );
}
