// src/components/History.jsx
import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import "./History.css";

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // menu + select mode states
  const [showMenu, setShowMenu] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // toast + modal state
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const menuRef = useRef();

  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, "history"),
      where("userEmail", "==", user.email),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const seen = new Set();
      const items = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (item) =>
            item.type !== "login" &&
            item.type !== "logout" &&
            item.type !== "history-view"
        )
        .filter((item) => {
          const key = `${item.topic}-${item.subtopic}-${item.type}-${item.difficulty}-${item.progress}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

      setHistoryItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const formatTimestamp = (timestamp) => {
    try {
      return timestamp?.toDate().toLocaleString() || "Unknown time";
    } catch {
      return "Invalid time";
    }
  };

  // Toast function
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // === Clear All History ===
  const clearAllHistory = async () => {
    const q = query(collection(db, "history"), where("userEmail", "==", user.email));
    const snap = await getDocs(q);

    const deletions = snap.docs.map((docSnap) =>
      deleteDoc(doc(db, "history", docSnap.id))
    );

    await Promise.all(deletions);
    setSelectedIds([]);
    showToast("✅ All history cleared", "success");
  };

  // === Toggle Selection ===
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // === Clear Selected ===
  const clearSelected = async () => {
    if (selectedIds.length === 0) return showToast("⚠️ No items selected", "error");

    const deletions = selectedIds.map((id) => deleteDoc(doc(db, "history", id)));
    await Promise.all(deletions);

    setSelectedIds([]);
    setSelectMode(false);
    showToast("✅ Selected history deleted", "success");
  };

  return (
    <section className="history-container">
      <header className="history-header">
        <h2>History</h2>

        {/* Menu dropdown */}
        <div className="history-menu" ref={menuRef}>
          <FaEllipsisV
            className="menu-icon"
            onClick={() => setShowMenu((prev) => !prev)}
          />
          {showMenu && (
            <div className="history-dropdown">
              <button onClick={() => setConfirmModal("clearAll")}>
                🗑 Clear All History
              </button>
              <button onClick={() => setSelectMode((prev) => !prev)}>
                ✅ {selectMode ? "Cancel Select" : "Select to Clear"}
              </button>
              {selectMode && (
                <button onClick={clearSelected}>🚮 Delete Selected</button>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="history-content">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>
            Loading history...
          </p>
        ) : historyItems.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px" }}>
            No history available
          </p>
        ) : (
          historyItems.map((item) => (
            <article
              key={item.id}
              className={`history-card ${
                selectMode && selectedIds.includes(item.id) ? "selected" : ""
              }`}
              onClick={() => {
                if (selectMode) {
                  toggleSelect(item.id);
                } else if (
                  item.topic &&
                  item.subtopic &&
                  item.source !== "practice"
                ) {
                  if (item.source === "formula") {
                    navigate(`/formula/${item.topic}/${item.subtopic}`);
                  } else {
                    navigate(`/topics/${item.topic}/${item.subtopic}`);
                  }
                }
              }}
              style={{
                cursor:
                  selectMode ||
                  (item.topic && item.subtopic && item.source !== "practice")
                    ? "pointer"
                    : "default",
              }}
            >
              <div className="history-header-row">
                <span className="history-type">
                  {item.type === "practice" ? (
                    <>
                      {item.topic} → {item.subtopic} →{" "}
                      {item.difficulty?.charAt(0).toUpperCase() +
                        item.difficulty?.slice(1)}{" "}
                      →{" "}
                      <span className={`history-progress ${item.progress}`} />
                      <span style={{ color: "#888", fontSize: "0.85rem" }}>
                        (Practice)
                      </span>
                    </>
                  ) : item.type === "progress-view" ? (
                    <>
                      Progress{" "}
                      <span style={{ color: "#888", fontSize: "0.85rem" }}>
                        (Progress Page)
                      </span>
                    </>
                  ) : (
                    <>
                      {item.topic} → {item.subtopic}{" "}
                      <span style={{ color: "#888", fontSize: "0.85rem" }}>
                        ({item.source === "formula" ? "Formula" : "Topics"})
                      </span>
                    </>
                  )}
                </span>
                <span className="history-time">
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal === "clearAll" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Clear All History?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmModal(null)}>Cancel</button>
              <button
                className="danger"
                onClick={() => {
                  clearAllHistory();
                  setConfirmModal(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
