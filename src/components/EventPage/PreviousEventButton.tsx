import { useNavigate } from "react-router-dom";
import type { EventFirestore } from "../../types/Event";

interface Props {
  event?: EventFirestore;
  events: EventFirestore[];
}

export default function PreviousEventButton({ event, events }: Props) {
  const navigate = useNavigate();

  if (!event) return null;

  return (
    <button
      onClick={() =>
        navigate(`/events/${event.id}`, {
          state: { events },
        })
      }
    >
      ← Previous event
    </button>
  );
}
