import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../components/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [level, setLevel] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState('');
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          await setDoc(
            userRef,
            {
              uid: currentUser.uid,
              email: currentUser.email,
              provider: currentUser.providerData[0]?.providerId || "unknown",
              lastLogin: serverTimestamp(),
            },
            { merge: true }
          );

          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.level) {
              setLevel(data.level);
              setShowLevelModal(false);
            } else {
              setShowLevelModal(true);
            }
            if (data.photo) setUserPhoto(data.photo);
            if (data.name) setUserName(data.name);
          } else {
            setShowLevelModal(true);
          }
        } catch (err) {
          console.error("Failed to sync user doc:", err);
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setLevel(null);
        setUserPhoto(null);
        setUserName('');
        setShowLevelModal(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function saveLevel(selectedLevel) {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { level: selectedLevel },
        { merge: true }
      );
      setLevel(selectedLevel);
      setShowLevelModal(false);
    } catch (err) {
      console.error("Failed to save level:", err);
    }
  }

  async function savePhoto(base64Photo) {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { photo: base64Photo },
        { merge: true }
      );
      setUserPhoto(base64Photo);
    } catch (err) {
      console.error("Failed to save photo:", err);
      throw err;
    }
  }

  async function saveName(name) {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { name },
        { merge: true }
      );
      setUserName(name);
    } catch (err) {
      console.error("Failed to save name:", err);
      throw err;
    }
  }

  return (
    <AuthContext.Provider value={{
      user, level, userPhoto, userName,
      showLevelModal, saveLevel, savePhoto, saveName,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}