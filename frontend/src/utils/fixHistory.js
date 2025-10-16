// src/utils/fixHistory.js
import { db } from "../components/firebase.js";
import {collection, getDocs, updateDoc, doc} from "firebase/firestore";

/**
 * One-time script to retroactively fix old history entries
 * so they log like: "Topic → Subtopic → Difficulty → Status (Practice)"
 */
export const fixHistory = async () => {
  try {
    console.log("🔄 Starting history fix...");

    const snap = await getDocs(collection(db, "history"));
    let updatedCount = 0;
    let skippedCount = 0;

    for (const docSnap of snap.docs) {
      const data = docSnap.data();

      // Only adjust "practice" type entries
      if (data.type === "practice") {
        // Safeguard: Skip if already has difficulty + progress
        if (data.difficulty && data.progress) {
          skippedCount++;
          continue;
        }

        const difficulty =
          data.difficulty?.charAt(0).toUpperCase() +
          data.difficulty?.slice(1);

        const formattedTopic = data.topic || "Unknown";
        const formattedSubtopic = data.subtopic || "Unknown";
        const progress = data.progress || "Unattempted";

        const updatePayload = {
          topic: formattedTopic,
          subtopic: formattedSubtopic,
          difficulty: difficulty || "Unknown",
          progress,
          source: "practice",
        };

        await updateDoc(doc(db, "history", docSnap.id), updatePayload);
        updatedCount++;
        console.log(`✅ Updated history ID: ${docSnap.id}`);
      }
    }

    console.log(
      `🎉 Done! Fixed ${updatedCount} practice history entries. Skipped ${skippedCount} already-correct entries.`
    );
  } catch (err) {
    console.error("❌ Error fixing history:", err);
  }
};

// Run manually
// In terminal: node src/utils/runFixHistory.js
