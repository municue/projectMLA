import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import "./MainContent.css";
import infinityLogo from "../assets/infinityimg.png";

export default function MainContent() {
  const [activeTab, setActiveTab] = useState("Home");
  const [feedItems, setFeedItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // shared index for tips & updates
  const [animClass, setAnimClass] = useState("slide-in");

  useEffect(() => {
    const q = query(collection(db, "homepage_feed"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedItems(items);
    });

    return () => unsubscribe();
  }, []);

  // Separate tips & updates
  const tips = feedItems.filter((item) =>
    item.category.toLowerCase().includes("tip")
  );
  const updates = feedItems.filter((item) =>
    item.category.toLowerCase().includes("update")
  );

  // Auto-rotate tips & updates
  useEffect(() => {
    if (
      (activeTab === "Tips" && tips.length > 0) ||
      (activeTab === "Updates" && updates.length > 0)
    ) {
      const interval = setInterval(() => {
        setAnimClass("slide-out");
        setTimeout(() => {
          if (activeTab === "Tips") {
            setCurrentIndex((prev) => (prev + 1) % tips.length);
          } else if (activeTab === "Updates") {
            setCurrentIndex((prev) => (prev + 1) % updates.length);
          }
          setAnimClass("slide-in");
        }, 600); // match slide-out duration
      }, 10000); // ⏱ 10s (change to 30000 or 60000 as needed)
      return () => clearInterval(interval);
    }
  }, [activeTab, tips, updates]);

  return (
    <section className="feed-container">
      {/* === HEADER === */}
      <header className="main-header">
        <div className="tab-container">
          {["Home", "Tips", "Updates"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab active" : "tab"}
              onClick={() => {
                setActiveTab(tab);
                setCurrentIndex(0); // reset index when switching tabs
              }}
            >
              {tab}
            </button>
          ))}
          <div className={`underline ${activeTab.toLowerCase()}`} />
        </div>
      </header>

      {/* === CONTENT === */}
      <div className="page-content fade-in">
        {/* Home with Logo */}
        {activeTab === "Home" && (
          <div className="home-screen">
            <img
              src={infinityLogo}
              alt="Infinity Logo"
              className="home-logo glow"
            />
            <p className="no-items">Welcome to Infinity: Your Math Tutor App!</p>
          </div>
        )}

        {/* Tips Carousel */}
        {activeTab === "Tips" && (
          <div className="tip-carousel">
            {tips.length === 0 ? (
              <p className="no-items">No tips available</p>
            ) : (
              <div className={`tip-card ${animClass}`}>
                <h3>{tips[currentIndex].title}</h3>
                <p>{tips[currentIndex].body}</p>
              </div>
            )}
          </div>
        )}

        {/* Updates Carousel */}
        {activeTab === "Updates" && (
          <div className="update-carousel">
            {updates.length === 0 ? (
              <p className="no-items">No updates available</p>
            ) : (
              <div className={`update-card ${animClass}`}>
                <h3>{updates[currentIndex].title}</h3>
                <p>{updates[currentIndex].body}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
