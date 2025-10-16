import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXyNq1oBvxMd72sZmGA0-gkc2RRur_ers",
  authDomain: "mla-math-app.firebaseapp.com",
  projectId: "mla-math-app",
  storageBucket: "mla-math-app.appspot.com", // ✅ fixed
  messagingSenderId: "114876683584",
  appId: "1:114876683584:web:1e6dc2294df5c31b7756a5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, firebaseConfig };
