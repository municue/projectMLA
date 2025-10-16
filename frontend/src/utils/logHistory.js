// src/utils/logHistory.js
import { db } from "../components/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// 🔹 Log generic history event
export const logHistory = async ({
  userEmail,
  type,
  topic,
  subtopic,
  difficulty,
  progress,
  source,
}) => {
  try {
    await addDoc(collection(db, "history"), {
      userEmail,
      type,
      topic: topic || null,
      subtopic: subtopic || null,
      difficulty: difficulty || null,
      progress: progress || null,
      source: source || "topics",
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("❌ Error logging history:", err);
  }
};
