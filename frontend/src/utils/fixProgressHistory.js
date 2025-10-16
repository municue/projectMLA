// src/utils/fixProgressHistory.js
import { db } from "../components/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

async function fixProgressHistory(userEmail) {
  try {
    console.log(`🔄 Fixing progress history for ${userEmail}...`);

    const snap = await getDocs(collection(db, "history"));
    let updatedCount = 0;

    for (const docSnap of snap.docs) {
      const data = docSnap.data();

      // Identify wrong entries → source looks like "topics" but actually is progress
      if (data.userEmail === userEmail && !data.topic && !data.subtopic && data.source === "topics") {
        await updateDoc(doc(db, "history", docSnap.id), {
          type: "progress-view",
          source: "progress",
        });
        updatedCount++;
      }
    }

    console.log(`✅ Fixed ${updatedCount} progress history entries.`);
  } catch (err) {
    console.error("❌ Error fixing progress history:", err);
  }
}

// Example usage
fixProgressHistory("akinlademuheebah026@gmail.com"); // change this to your test user email
