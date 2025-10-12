import { requestCalendarAccess } from "./functions/requestCalendarAccess";
import type { EventData } from "./hooks/useEvent";

interface AddToCalendarProps {
  event: EventData;
}

export function AddToCalendar({ event }: AddToCalendarProps) {
  async function handleAddToCal() {
    try {
      const token = await requestCalendarAccess();
      if (!token) throw new Error("No Google token received");

      const startTime = new Date(event.date).toISOString();
      // console.log(startTime, "start time");

      const endTime = new Date(
        new Date(event.date).getTime() + 2 * 60 * 60 * 1000
      ).toISOString();

      // console.log(endTime, "end time");

      const eventToAdd = {
        summary: event.title,
        location: event.location || "",
        description: event.description,
        start: {
          dateTime: startTime,
          timeZone: "Europe/London",
        },
        end: {
          dateTime: endTime,
          timeZone: "Europe/London",
        },
      };

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventToAdd),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      alert("✅ Event added to your Google Calendar!");
    } catch (err) {
      console.error("Failed to add to calendar:", err);
      alert("Something went wrong adding this event.");
    }
  }

  return <button onClick={handleAddToCal}>Add to Google Calendar</button>;
}
