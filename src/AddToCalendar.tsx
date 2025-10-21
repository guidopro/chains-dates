import { requestCalendarAccess } from "./functions/requestCalendarAccess";
import type { EventData } from "./hooks/useEvent";
import { ToastContainer, toast } from "react-toastify";
import { downloadICSFile } from "./utils/downloadICSFile";

interface AddToCalendarProps {
  event: EventData;
}

export function AddToCalendar({ event }: AddToCalendarProps) {
  async function handleAddToCal() {
    try {
      const token = await requestCalendarAccess();
      if (!token) throw new Error("No Google token received");

      const eventToAdd = {
        summary: event.title,
        location: "CPX5+7V Manchester",
        description: event.description,
        start: {
          dateTime: event.start,
          timeZone: "Europe/London",
        },
        end: {
          dateTime: event.end,
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

      toast("✅ Event added to your Google Calendar!");
    } catch (err) {
      console.error("Failed to add to calendar:", err);
      toast("Something went wrong adding this event.");
    }
  }

  function handleDownloadICS() {
    try {
      downloadICSFile(event);
      toast("📅 .ics file downloaded!");
    } catch (err) {
      console.error("Failed to create .ics file:", err);
      toast("Could not generate calendar file.");
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button onClick={handleAddToCal} style={{ width: "100%" }}>
          Add to Google Calendar
        </button>
        <button onClick={handleDownloadICS} style={{ width: "100%" }}>
          Download .ics
        </button>
      </div>
      <ToastContainer />
    </>
  );
}
