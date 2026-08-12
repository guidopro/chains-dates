import type { EventFirestore } from "../types/Event";

export function getAdjacentEvents(
  events: EventFirestore[],
  currentEventId: string,
) {
  const currentIndex = events.findIndex((event) => event.id === currentEventId);

  return {
    previousEvent: events[currentIndex - 1] || null,
    nextEvent: events[currentIndex + 1] || null,
  };
}
