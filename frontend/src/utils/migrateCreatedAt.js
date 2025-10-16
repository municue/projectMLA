// src/utils/migrateCreatedAt.js
import { db } from "../components/firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

async function migrateCreatedAt() {
  console.log("🚀 Starting migration...");

  const snapshot = await getDocs(collection(db, "calculations"));
  let updatedCount = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    let newCreatedAt = null;

    // Case 1: If createdAt is missing but timestamp exists → use it
    if (!data.createdAt && data.timestamp?.toDate) {
      newCreatedAt = data.timestamp;
    }

    // Case 2: If createdAt is missing and no timestamp → fallback
    if (!data.createdAt && !newCreatedAt) {
      newCreatedAt = serverTimestamp();
    }

    // Case 3: If createdAt is a string → convert to Firestore Timestamp
    if (typeof data.createdAt === "string") {
      const parsedDate = new Date(data.createdAt);
      if (!isNaN(parsedDate.getTime())) {
        newCreatedAt = Timestamp.fromDate(parsedDate);
      } else {
        console.warn(
          `⚠️ Invalid string in ${docSnap.id}, using serverTimestamp`
        );
        newCreatedAt = serverTimestamp();
      }
    }

    // Case 4: If createdAt is not a valid Firestore Timestamp
    if (
      data.createdAt &&
      typeof data.createdAt !== "string" &&
      !data.createdAt.toDate
    ) {
      console.warn(
        `⚠️ Non-timestamp createdAt in ${docSnap.id}, forcing serverTimestamp`
      );
      newCreatedAt = serverTimestamp();
    }

    // Only update if necessary
    if (newCreatedAt) {
      console.log(`⚡ Updating ${docSnap.id}`);
      await updateDoc(doc(db, "calculations", docSnap.id), {
        createdAt: newCreatedAt,
      });
      updatedCount++;
    }
  }

  console.log(`✅ Migration complete! Updated ${updatedCount} docs.`);
}

migrateCreatedAt().catch((err) => {
  console.error("❌ Migration failed:", err);
});
