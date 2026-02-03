// src/components/Formula.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import "./Formula.css";

export default function Formula() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTopic, setOpenTopic] = useState(null); // track which topic is open

  // normalize subtopic name for URL
  const normalize = (text) => text.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const q = query(collection(db, "topics"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTopics(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching topics:", err);
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  if (loading)
    return <p style={{ textAlign: "center", padding: "70px" }}>Loading formula topics...</p>;

  return (
    <section className="formula-page">
      {/* ✅ Header removed (handled by FormulaLayout) */}
      <div className="formula-grid">
        {topics.map(topic => (
          <div
            key={topic.id}
            className={`formula-card ${openTopic === topic.id ? "open" : ""}`}
          >
            <div
              className="formula-title"
              onClick={() =>
                setOpenTopic(openTopic === topic.id ? null : topic.id)
              }
            >
              {topic.name}
            </div>

            {openTopic === topic.id && (
              <ul className="subtopics-list">
                {topic.subtopics
                  .sort((a, b) => a.order - b.order)
                  .map((sub, index) => {
                    const subtopicId = normalize(sub.name);
                    return (
                      <li key={index} className="subtopic">
                        <Link to={`/formula/${topic.id}/${subtopicId}`}>
                          {sub.name}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}