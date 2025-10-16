// src/utils/seedWeeklyFeed.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firebaseConfig } from "../components/firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedWeeklyFeed() {
  const tips = [
    { title: "Track Your Progress", body: "View your study trends and practice stats on the Progress page.", category: "Tip" },
    { title: "Smart Practice", body: "Choose questions by topic and difficulty for focused learning.", category: "Tip" },
    { title: "Session Insights", body: "The practice page times your sessions, helping you stay consistent.", category: "Tip" },
    { title: "Color Tags in History", body: "Use color-coded tags to see which difficulty level you attempted.", category: "Tip" },
    { title: "Instant Solutions", body: "When you click Done, the solution is revealed step by step.", category: "Tip" },
    { title: "Save Calculations", body: "Store your current calculations and revisit them later in Saved Calculations.", category: "Tip" },
    { title: "Reset Anytime", body: "Not happy with your attempt? Use the reset button to retry.", category: "Tip" },
    { title: "Unattempted First", body: "Filter by Unattempted to prioritize new questions.", category: "Tip" },
    { title: "Gradual Challenge", body: "Start with Easy questions, then move to Moderate and Hard.", category: "Tip" },
    { title: "Stay Consistent", body: "Frequent short sessions are more effective than cramming.", category: "Tip" },
  ];

  const updates = [
    { title: "New Topics Content Uploading Soon!", category: "Update" },
    { title: "Practice Questions for Hard Level Coming Soon!", category: "Update" },
    { title: "Practice Questions for Rational Exponents Coming Soon!", category: "Update" },
    { title: "Stay Tuned for Frequent Updates About Your Math Tutor!", category: "Update" }
  ];

  try {
    for (const tip of tips) {
      await addDoc(collection(db, "homepage_feed"), {
        ...tip,
        author: "System",
        timestamp: serverTimestamp(),
      });
      console.log(`✅ Added Tip: ${tip.title}`);
    }

    for (const update of updates) {
      await addDoc(collection(db, "homepage_feed"), {
        ...update,
        author: "System",
        timestamp: serverTimestamp(),
      });
      console.log(`✅ Added Update: ${update.title}`);
    }

    console.log("🎉 Weekly feed seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding weekly feed:", err);
  }
}

seedWeeklyFeed();
