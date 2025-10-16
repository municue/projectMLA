// src/utils/cleanupCalculations.js

import { db } from "../components/firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteField,
} from "firebase/firestore";

async function cleanupCalculations() {
  console.log("🧹 Starting cleanup...");

  const snapshot = await getDocs(collection(db, "calculations"));
  let cleanedCount = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    // Only clean if "timestamp" field exists
    if (data.timestamp) {
      console.log(`⚡ Cleaning doc: ${docSnap.id}`);
      await updateDoc(doc(db, "calculations", docSnap.id), {
        timestamp: deleteField(), // remove timestamp
      });
      cleanedCount++;
    }
  }

  console.log(`✅ Cleanup complete! Removed 'timestamp' from ${cleanedCount} docs.`);
}

cleanupCalculations().catch((err) => {
  console.error("❌ Cleanup failed:", err);
});
