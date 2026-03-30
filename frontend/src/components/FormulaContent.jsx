import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useAuth } from "../context/AuthContext";
import { logHistory } from "../utils/logHistory";
import "./FormulaContent.css";

const mathJaxConfig = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
};

const normalize = (text) => text.toLowerCase().replace(/\s+/g, "-");

export default function FormulaContent() {
  const { subtopicId, topicId } = useParams();
  const { user } = useAuth();
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Listen for soft-reload
  useEffect(() => {
    const handleSoftReload = () => {
      setRefreshKey((prev) => prev + 1);
    };
    window.addEventListener("soft-reload", handleSoftReload);
    return () => window.removeEventListener("soft-reload", handleSoftReload);
  }, []);

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const docRef = doc(db, "formulas", normalize(subtopicId));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormulas(docSnap.data().formulas || []);
        } else {
          setFormulas([]);
        }

        setLoading(false);

        if (user?.email) {
          logHistory({
            userEmail: user.email,
            type: "open-formula",
            topic: topicId,
            subtopic: subtopicId,
            source: "formula",
          });
        }
      } catch (err) {
        console.error("❌ Error fetching formulas:", err);
        setLoading(false);
      }
    };
    fetchFormulas();
  }, [subtopicId, topicId, user]);

  return (
    <MathJaxContext config={mathJaxConfig}>
      <section className="formula-content-page">
        <div className="formula-content-body">
          {loading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>
              Loading formulas...
            </p>
          ) : formulas.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px" }}>
              No formulas available
            </p>
          ) : (
            // 👇 key={refreshKey} forces full remount
            <div key={refreshKey} className="formula-content-card fade-in">
              <ul className="formula-list">
                {formulas.map((f, idx) => (
                  <li key={idx} className="formula-item">
                    <MathJax className="formula">{f.property}</MathJax>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </MathJaxContext>
  );
}