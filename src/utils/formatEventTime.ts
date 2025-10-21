export function formatEventTime(startISO: string, endISO?: string): string {
  const startDate = new Date(startISO);

  const datePart = startDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const startTime = startDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // only start time provided
  if (!endISO) return `${datePart} • ${startTime} `;

  const endDate = new Date(endISO);
  const endTime = endDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Check if end date is a different day
  const isDifferentDay =
    startDate.getDate() !== endDate.getDate() ||
    startDate.getMonth() !== endDate.getMonth() ||
    startDate.getFullYear() !== endDate.getFullYear();

  if (isDifferentDay) {
    const endDatePart = endDate.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

    // event across multiple days
    return `${datePart} • ${startTime} → ${endDatePart} • ${endTime}`;
  }

  // same day event
  return `${datePart} • ${startTime} → ${endTime}`;
}
