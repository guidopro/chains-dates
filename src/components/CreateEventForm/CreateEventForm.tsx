import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "./CreateEventForm.css";

export function CreateEventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      // Upload image if provided
      if (imageFile) {
        const imageRef = ref(
          storage,
          `event-images/${imageFile.name}-${Date.now()}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Convert HTML date input to Firestore Timestamp
      const eventDate = Timestamp.fromDate(new Date(date));

      await addDoc(collection(db, "events"), {
        title,
        description,
        date: eventDate,
        isFree,
        imageUrl,
        attendees: [],
        createdAt: new Date(),
      });

      toast("Event created successfully!");
      setTitle("");
      setDescription("");
      setDate("");
      setIsFree(true);
      setImageFile(null);
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
        // className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Event Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        // className="w-full p-2 border rounded"
      />

      <div className="datetime-free-event">
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          // className="w-full p-2 border rounded"
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
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />

      <button
        type="submit"
        disabled={loading}
        // className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
      <ToastContainer />
    </form>
  );
}
