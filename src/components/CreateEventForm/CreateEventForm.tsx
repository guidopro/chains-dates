import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, Timestamp, doc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "./CreateEventForm.css";

export function CreateEventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // current logged-in user
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert HTML date input to Firestore Timestamp
      const eventDate = Timestamp.fromDate(new Date(date));

      // turn user into firestore ref for db
      const firestoreRef = doc(db, "user", user.uid);

      await addDoc(collection(db, "events"), {
        title,
        description,
        date: eventDate,
        isFree,
        imageUrl,
        attendees: [],
        createdAt: new Date(),
        createdBy: firestoreRef,
        createdByName: user?.displayName || "unknown",
      });

      toast("Event created successfully!");
      setTitle("");
      setDescription("");
      setDate("");
      setIsFree(true);
      setImageUrl("");
    } catch (error) {
      console.error("Error creating event:", error);
      toast("Error creating event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Create New Event</h2>

      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Event Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="datetime-free-event">
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label className="free-event">
          <span>This event is free</span>
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
          />
        </label>
      </div>
      <input
        type="url"
        placeholder="Image URL (https://...)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Event"}
      </button>
      <ToastContainer />
    </form>
  );
}
