import { db } from "../components/firebase.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import fs from "fs";

async function backupHistory() {
  console.log("📦 Backing up history collection...");
  const historyRef = collection(db, "history");
  const snap = await getDocs(historyRef);

  const backup = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  fs.writeFileSync("backup-history.json", JSON.stringify(backup, null, 2));
  console.log(
    `✅ Backup complete. Saved ${backup.length} records to backup-history.json`
  );
  return backup;
}

async function migrateAllUsers({ dryRun = true } = {}) {
  console.log(`🔄 Starting migration for all users... (dryRun: ${dryRun})`);

  const backup = await backupHistory();

  // Group history by userEmail
  const userHistoryMap = {};
  backup.forEach((data) => {
    if (!data.userEmail) return;
    if (!userHistoryMap[data.userEmail]) userHistoryMap[data.userEmail] = [];
    userHistoryMap[data.userEmail].push(data);
  });

  for (const [userEmail, history] of Object.entries(userHistoryMap)) {
    console.log(`📊 Preparing migration for ${userEmail}...`);

    const topicStats = {};

    history.forEach((data) => {
      if (data.type === "view-topic" || data.type === "practice") {
        const topic = data.topic || "Unknown";
        const subtopic = data.subtopic || null;
        const key = subtopic ? `${topic}:${subtopic}` : topic;

        if (!topicStats[key]) {
          topicStats[key] = {
            topic,
            subtopic,
            totalCount: 0,
            doneCount: 0,
            minutes: 0,
            visits: 0,
            lastTimestamp: null, // ✅ track most recent timestamp
          };
        }

        topicStats[key].totalCount += 1;
        topicStats[key].visits += 1;
        if (data.progress === "Done") {
          topicStats[key].doneCount += 1;
        }

        // crude estimate: each history entry = 5 minutes
        topicStats[key].minutes += 5;

        // ✅ Keep the most recent timestamp
        if (data.timestamp?.toDate) {
          const ts = data.timestamp.toDate();
          if (
            !topicStats[key].lastTimestamp ||
            ts > topicStats[key].lastTimestamp
          ) {
            topicStats[key].lastTimestamp = ts;
          }
        }
      }
    });

    if (dryRun) {
      console.log(`📝 Preview for ${userEmail}:`);
      console.log("Topic Stats:", topicStats);
      continue;
    }

    // === Write to Firestore ===
    for (const [key, stats] of Object.entries(topicStats)) {
      const ref = doc(db, "users", userEmail, "progress", `topic-${key}`);
      await setDoc(
        ref,
        {
          ...stats,
          timestamp: stats.lastTimestamp || new Date(), // ✅ use original study date if available
        },
        { merge: true }
      );
    }

    console.log(`✅ Migration complete for ${userEmail}`);
  }

  console.log("🎉 Migration finished for ALL users!");
}

// Run migration (safe mode first)
migrateAllUsers({ dryRun: true }).catch((err) => {
  console.error("❌ Migration failed:", err);
});
