export function formatEventTime(startISO: string, endISO: string): string {
  const startDate = new Date(startISO);
  const endDate = new Date(endISO);

  const datePart = startDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const startTime = startDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = endDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart} • ${startTime} → ${endTime}`;
}
