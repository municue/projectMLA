// src/components/uploadFormulasAdmin.js
import admin from "firebase-admin";
import serviceAccount from "./firebase-service-account.json" assert { type: "json" };

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Example formulas grouped by topic/subtopic
const formulas = [
  {
    topic: "integer-exponents",
    formulas: [
      { property: "$a^n \\cdot a^m = a^{n+m}$" },
      { property: "$(a^n)^m = a^{n \\cdot m}$" },
      { property: "$\\frac{a^n}{a^m} = a^{n-m}$" },
      { property: "$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$" },
      { property: "$\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n$" },
      { property: "$\\frac{1}{a^{-n}} = a^n$" },
      { property: "$a^{-n} \\cdot b^{-m} = \\frac{b^m}{a^n}$" },
      { property: "$(a^n b^m)^k = a^{n \\cdot k} b^{m \\cdot k}$" }
    ]
  },
  {
    topic: "rational-exponents",
    formulas: [
      { property: "$a^{1/n} = \\sqrt[n]{a}$" },
      { property: "$(a^n)^m = a^{n \\cdot m}$" },
      { property: "$a^{m/n} = (a^{1/n})^m$" },
      { property: "$a^{m/n} = (a^m)^{1/n}$" }
    ]
  },
  {
    topic: "polynomials",
    formulas: [
      { property: "$(a + b)(a - b) = a^2 - b^2$" },
      { property: "$(a + b)^2 = a^2 + 2ab + b^2$" },
      { property: "$(a - b)^2 = a^2 - 2ab + b^2$" }
    ]
  }
];

// Upload function
async function uploadFormulas() {
  try {
    for (const topicData of formulas) {
      const topicId = topicData.topic;

      // ✅ Store all formulas for a topic inside one document
      const docRef = db.collection("formulas").doc(topicId);
      await docRef.set({
        topic: topicId,
        formulas: topicData.formulas
      });

      console.log(`✅ Uploaded formulas for topic: ${topicId}`);
    }

    console.log("🎉 All formulas uploaded successfully!");
  } catch (err) {
    console.error("❌ Error uploading formulas:", err);
  }
}

uploadFormulas();
