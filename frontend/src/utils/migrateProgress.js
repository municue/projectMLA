// src/utils/migrateProgress.js
import { db } from "../components/firebase.js";
import {
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

async function migrateAllUsers() {
  console.log("🚀 Starting migration for all users...");

  // Get all users
  const usersSnapshot = await getDocs(collection(db, "users"));
  for (const userDoc of usersSnapshot.docs) {
    const userEmail = userDoc.id;
    console.log(`\n=== Migrating user: ${userEmail} ===`);

    // ✅ Normalize topic progress
    const progressRef = collection(db, "users", userEmail, "progress");
    const progressSnap = await getDocs(progressRef);

    for (const docSnap of progressSnap.docs) {
      const data = docSnap.data();

      const topicRef = doc(db, "users", userEmail, "progress", docSnap.id);
      await setDoc(
        topicRef,
        {
          ...data,
          seconds: data.seconds ?? (data.minutes ?? 0) * 60,
          visits: data.visits ?? 0,
          timestamp: data.timestamp || new Date(),
        },
        { merge: true }
      );

      console.log(`🔄 Normalized topic doc: ${docSnap.id}`);
    }

    // ✅ Rebuild practice summaries by difficulty
    const practiceRef = collection(db, "users", userEmail, "practiceProgress");
    const practiceSnap = await getDocs(practiceRef);

    const summaries = {};

    for (const docSnap of practiceSnap.docs) {
      const data = docSnap.data();
      if (docSnap.id.includes("-summary")) continue; // skip old summaries

      const topic = data.topic || "Unknown";
      const subtopic = data.subtopic || "Unknown";
      const difficulty = data.difficulty || "unspecified";

      const key = `${topic}-${subtopic}-${difficulty}-summary`;
      if (!summaries[key]) {
        summaries[key] = {
          topic,
          subtopic,
          difficulty,
          total: 0,
          done: 0,
        };
      }

      summaries[key].total++;
      if (data.status === "Done") summaries[key].done++;
    }

    for (const [key, val] of Object.entries(summaries)) {
      const summaryRef = doc(db, "users", userEmail, "practiceProgress", key);
      await setDoc(summaryRef, {
        topic: val.topic,
        subtopic: val.subtopic,
        difficulty: val.difficulty,
        totalCount: val.total,
        doneCount: val.done,
        timestamp: new Date(),
      });
      console.log(`📊 Rebuilt summary: ${key}`);
    }
  }

  console.log("🎉 Migration complete for all users!");
}

// Run when called from CLI
migrateAllUsers().catch(console.error);
