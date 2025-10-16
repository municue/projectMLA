// src/utils/deleteQuestions.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firebaseConfig } from "../components/firebase.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteAllQuestions() {
  try {
    const querySnapshot = await getDocs(collection(db, "questions"));
    const deletePromises = querySnapshot.docs.map((d) => deleteDoc(doc(db, "questions", d.id)));
    await Promise.all(deletePromises);
    console.log("🔥 All documents in 'questions' deleted successfully!");
  } catch (err) {
    console.error("❌ Error deleting questions:", err);
  }
}

deleteAllQuestions();
