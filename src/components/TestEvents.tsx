import { useState } from "react";
import { createEvent } from "../events";

export function TestEvents() {
  const [status, setStatus] = useState("");

  const handleCreate = async () => {
    const success = await createEvent(
      "Test Event", // title
      "Testing...", // description
      new Date("2025-10-01T17:00:00Z") // date
    );

    if (success) {
      setStatus("✅ Event created!");
    } else {
      setStatus("❌ Permission denied (are you staff?)");
    }
  };

  return (
    <div>
      <h2>Test Event Creation</h2>
      <button onClick={handleCreate}>Create Test Event</button>
      <p>{status}</p>
    </div>
  );
}
