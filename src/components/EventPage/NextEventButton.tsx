import { useNavigate } from "react-router-dom";
import type { EventFirestore } from "../../types/Event";

interface Props {
  event?: EventFirestore;
  events: EventFirestore[];
}

export default function NextEventButton({ event, events }: Props) {
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
      Next event →
    </button>
  );
}
