import admin from "firebase-admin";
import { events } from "../data/events.seed.js";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function seedEvents() {
  console.log("🌱 Starting Firestore event seeding…");

  const batch = db.batch();
  const createdByRef = db.doc("users/aHlYALYh29MLIxSZwfO9sZTno583");

  events.forEach((event) => {
    const ref = db.collection("events").doc(event.id);

    batch.set(
      ref,
      {
        ...event,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: createdByRef,
        createdByName: "John Doe",
      },
      { merge: true },
    );
  });

  await batch.commit();
  console.log("✅ Events seeded successfully");
}

seedEvents()
  .then(() => process.exit())
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
