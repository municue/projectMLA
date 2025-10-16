import { db } from "../components/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  increment,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

let activeSession = null;

export const startSession = async ({ userEmail, topic, subtopic, type = "topic" }) => {
  if (!userEmail || !topic) return;

  activeSession = {
    userEmail,
    topic,
    subtopic,
    type, // "topic" or "practice"
    start: Date.now(),
  };

  console.log("▶️ Session started:", activeSession);
};

export const endSession = async () => {
  if (!activeSession) return;

  const { userEmail, topic, subtopic, type, start } = activeSession;
  const elapsedMs = Date.now() - start;
  const elapsedSeconds = Math.max(1, Math.floor(elapsedMs / 1000));

  const key = subtopic ? `${topic}:${subtopic}` : topic;
  const collectionName = type === "topic" ? "progress" : "practiceProgress";
  const docId = type === "topic" ? `topic-${key}` : `practice-${key}-summary`;
  const ref = doc(db, "users", userEmail, collectionName, docId);
  const snap = await getDoc(ref);

  // ✅ Visits only count for "topic", not "practice"
  const visitsUpdate = type === "topic" ? { visits: increment(1) } : {};

  if (snap.exists()) {
    await updateDoc(ref, {
      seconds: increment(elapsedSeconds),
      timestamp: serverTimestamp(),
      ...visitsUpdate,
    });
  } else {
    await setDoc(ref, {
      topic,
      subtopic: subtopic || null,
      seconds: elapsedSeconds,
      visits: type === "topic" ? 1 : 0,
      totalCount: 0,
      doneCount: 0,
      timestamp: serverTimestamp(),
    });
  }

  console.log(
    `⏹ Session ended: +${elapsedSeconds}s on ${topic}:${subtopic || ""}`
  );

  activeSession = null;
};

// ✅ Allow components to check elapsed session time in seconds
export const getSessionElapsed = () => {
  if (!activeSession) return 0;
  return Math.floor((Date.now() - activeSession.start) / 1000);
};
