import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useAuth } from "../context/AuthContext";
import { logHistory } from "../utils/logHistory";
import { startSession, endSession, getSessionElapsed } from "../utils/sessionTracker";
import { FaEllipsisV } from "react-icons/fa";
import "./TopicContent.css";

const mathJaxConfig = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
};

const formatId = (name) => name.toLowerCase().replace(/\s+/g, "-");

export default function TopicContent() {
  const { subtopicId, topicId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [expandedExamples, setExpandedExamples] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [nextSubtopic, setNextSubtopic] = useState(null);

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

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

  // Soft reload listener
  useEffect(() => {
    const handleSoftReload = () => {
      setRefreshKey((prev) => prev + 1);
    };
    window.addEventListener("soft-reload", handleSoftReload);
    return () => window.removeEventListener("soft-reload", handleSoftReload);
  }, []);

  // Fetch subtopic content + find next subtopic
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const subtopicDocRef = doc(db, "subtopics", subtopicId);
        const subtopicDocSnap = await getDoc(subtopicDocRef);

        if (subtopicDocSnap.exists()) {
          const data = subtopicDocSnap.data();
          setContent(data);

          if (user?.email) {
            logHistory({
              userEmail: user.email,
              type: "view-topic",
              topic: topicId,
              subtopic: subtopicId,
              source: "topics",
            });

            startSession({
              userEmail: user.email,
              topic: topicId,
              subtopic: subtopicId,
              type: "topic",
            });
            setElapsed(0);
          }
        } else {
          setContent(null);
        }

        // Fetch all subtopics to find next one
        const topicDocRef = doc(db, "topics", topicId);
        const topicDocSnap = await getDoc(topicDocRef);

        if (topicDocSnap.exists()) {
          const topicData = topicDocSnap.data();
          const subtopics = (topicData.subtopics || []).sort(
            (a, b) => a.order - b.order
          );

          const currentIndex = subtopics.findIndex(
            (s) => formatId(s.name) === subtopicId
          );

          if (currentIndex !== -1 && currentIndex < subtopics.length - 1) {
            setNextSubtopic(subtopics[currentIndex + 1]);
          } else {
            setNextSubtopic(null);
          }
        }
      } catch (err) {
        console.error("❌ Failed to fetch subtopic content:", err);
      }
    };

    fetchContent();

    return () => {
      if (user?.email) endSession();
    };
  }, [subtopicId, topicId, user, refreshKey]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getSessionElapsed());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleCategory = (idx) => {
    setExpandedExamples((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleNext = () => {
    if (nextSubtopic) {
      navigate(`/topics/${topicId}/${formatId(nextSubtopic.name)}`);
      setShowMenu(false);
    }
  };

  if (!content) {
    return (
      <section className="topic-content-page">
        <header className="topic-content-header">
          <h2>{decodeURIComponent(subtopicId).replace(/-/g, " ")}</h2>
          <div className="session-timer">
            ⏱ {Math.floor(elapsed / 60)}m {elapsed % 60}s
          </div>
          <div className="history-menu" ref={menuRef}>
            <FaEllipsisV
              className="menu-icon"
              onClick={() => setShowMenu((prev) => !prev)}
            />
            {showMenu && (
              <div className="history-dropdown">
                <button onClick={() => { navigate(-1); setShowMenu(false); }}>
                  Back
                </button>
                {nextSubtopic && (
                  <button onClick={handleNext}>
                    Next: {nextSubtopic.name}
                  </button>
                )}
                <button onClick={() => { navigate("/topics"); setShowMenu(false); }}>
                  Back to Topics List
                </button>
              </div>
            )}
          </div>
        </header>
        <p style={{ padding: "20px" }}>Loading...</p>
      </section>
    );
  }

  return (
    <MathJaxContext config={mathJaxConfig}>
      <section className="topic-content-page">
        <header className="topic-content-header">
          <h2>{content.name}</h2>
          <div className="session-timer">
            ⏱ {Math.floor(elapsed / 60)}m {elapsed % 60}s
          </div>

          <div className="history-menu" ref={menuRef}>
            <FaEllipsisV
              className="menu-icon"
              onClick={() => setShowMenu((prev) => !prev)}
            />
            {showMenu && (
              <div className="history-dropdown">
                <button onClick={() => { navigate(-1); setShowMenu(false); }}>
                  Back
                </button>
                {nextSubtopic && (
                  <button onClick={handleNext}>
                    Next: {nextSubtopic.name}
                  </button>
                )}
                <button onClick={() => { navigate("/topics"); setShowMenu(false); }}>
                  Back to Topics List
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="topic-content-body fade-in">
          {/* Overview */}
          {content.explanation && (
            <>
              <h3 style={{ textAlign: "center", textDecoration: "underline",
                textDecorationThickness: "3px" }}>
                Overview
              </h3>
              <p className="overview-text">
                <MathJax dynamic key={refreshKey}>{content.explanation}</MathJax>
              </p>
            </>
          )}

          {/* Properties */}
          {content.formulas?.length > 0 && (
            <>
              <h4 style={{ textAlign: "center", fontSize: "19px",
                textDecoration: "underline", textDecorationThickness: "3px" }}>
                Properties
              </h4>
              <table className="formula-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {content.formulas.map((f, idx) => (
                    <tr key={idx}>
                      <td className="formula-cell">
                        <MathJax dynamic key={`${refreshKey}-prop-${idx}`}>
                          {f.property}
                        </MathJax>
                      </td>
                      <td>
                        <MathJax dynamic key={`${refreshKey}-ex-${idx}`}>
                          {f.example}
                        </MathJax>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Common Mistakes */}
          {content.commonMistakes?.length > 0 && (
            <>
              <h4 style={{ textAlign: "center", fontSize: "19px",
                textDecoration: "underline", textDecorationThickness: "3px" }}>
                Common Mistakes
              </h4>
              {content.commonMistakes.map((m, idx) => (
                <div key={idx} className="mistake-block">
                  <p>
                    <strong>Correct:</strong>{" "}
                    <MathJax dynamic key={`${refreshKey}-correct-${idx}`}>
                      {m.correct}
                    </MathJax>
                  </p>
                  <p>
                    <strong>Incorrect:</strong>{" "}
                    <MathJax dynamic key={`${refreshKey}-incorrect-${idx}`}>
                      {m.incorrect}
                    </MathJax>
                  </p>
                  <p>
                    <MathJax dynamic key={`${refreshKey}-exp-${idx}`}>
                      {m.explanation}
                    </MathJax>
                  </p>
                </div>
              ))}
            </>
          )}

          {/* Examples */}
          {content.examples?.length > 0 && (
            <>
              <h4 style={{ textAlign: "center", fontSize: "19px",
                textDecoration: "underline", textDecorationThickness: "3px" }}>
                Examples
              </h4>
              <div className="example-card">
                {Array.isArray(content.examples) && content.examples[0]?.category
                  ? content.examples.map((cat, catIdx) => (
                      <div key={catIdx} className="example-category">
                        <h5 style={{ color: "white", fontSize: "16px",
                          textDecoration: "underline" }}>
                          {cat.category}
                        </h5>
                        {cat.questions?.map((ex, qIdx) => (
                          <div key={qIdx} className="example-item">
                            <p>
                              <strong>Q{qIdx + 1}:</strong>{" "}
                              <MathJax dynamic key={`${refreshKey}-q-${qIdx}`}>
                                {ex.question}
                              </MathJax>
                            </p>
                          </div>
                        ))}
                        <button className="solution-btn"
                          onClick={() => toggleCategory(catIdx)}>
                          {expandedExamples[catIdx] ? "Hide Solutions" : "Show Solutions"}
                        </button>
                        {expandedExamples[catIdx] && (
                          <div className="solution-box">
                            {cat.questions?.map((ex, qIdx) => (
                              <div key={qIdx} style={{ marginBottom: "15px" }}>
                                <p><strong>Solution {qIdx + 1}:</strong></p>
                                <MathJax dynamic key={`${refreshKey}-sol-${qIdx}`}>
                                  {ex.solution}
                                </MathJax>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  : content.examples.map((ex, idx) => (
                      <div key={idx} className="example-item">
                        <p>
                          <strong>Q{idx + 1}:</strong>{" "}
                          <MathJax dynamic key={`${refreshKey}-exq-${idx}`}>
                            {ex.question}
                          </MathJax>
                        </p>
                        <button className="solution-btn"
                          onClick={() => toggleCategory(idx)}>
                          {expandedExamples[idx] ? "Hide Solution" : "Show Solution"}
                        </button>
                        {expandedExamples[idx] && (
                          <div className="solution-box">
                            <p><strong>Solution {idx + 1}:</strong></p>
                            <MathJax dynamic key={`${refreshKey}-exsol-${idx}`}>
                              {ex.solution}
                            </MathJax>
                          </div>
                        )}
                      </div>
                    ))}
              </div>
            </>
          )}
        </div>
      </section>
    </MathJaxContext>
  );
}