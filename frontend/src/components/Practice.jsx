import { useState, useEffect } from "react";
import "./Practice.css";
import { FaEllipsisV } from "react-icons/fa";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "../context/AuthContext";
import { logHistory } from "../utils/logHistory";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { startSession, endSession, getSessionElapsed } from "../utils/sessionTracker";

const topicsData = [
  {
    name: "Preliminaries",
    order: 1,
    subtopics: [
      { name: "Integer Exponents", order: 1 },
      { name: "Rational Exponents", order: 2 },
      { name: "Radicals", order: 3 },
      { name: "Polynomials", order: 4 },
      { name: "Factoring Polynomials", order: 5 },
      { name: "Rational Expressions", order: 6 },
      { name: "Complex Numbers", order: 7 },
    ],
  },
  {
    name: "Solving Equations and Inequalities",
    order: 2,
    subtopics: [
      { name: "Solutions and Solution Sets", order: 1 },
      { name: "Linear Equations", order: 2 },
      { name: "Applications of Linear Equations", order: 3 },
      { name: "Equations With More Than One Variable", order: 4 },
      { name: "Quadratic Equations, Part I", order: 5 },
      { name: "Quadratic Equations, Part II", order: 6 },
      { name: "Quadratic Equations: A Summary", order: 7 },
      { name: "Applications of Quadratic Equations", order: 8 },
      { name: "Equations Reducible to Quadratic Form", order: 9 },
      { name: "Equations with Radicals", order: 10 },
      { name: "Linear Inequalities", order: 11 },
      { name: "Polynomial Inequalities", order: 12 },
      { name: "Rational Inequalities", order: 13 },
      { name: "Absolute Value Equations", order: 14 },
    ],
  },
  {
    name: "Graphing and Functions",
    order: 3,
    subtopics: [
      { name: "Graphing", order: 1 },
      { name: "Lines", order: 2 },
      { name: "Circles", order: 3 },
      { name: "The Definition of a Function", order: 4 },
      { name: "Graphing Functions", order: 5 },
      { name: "Combining functions", order: 6 },
      { name: "Inverse Functions", order: 7 },
    ],
  },
  {
    name: "Common Graphs",
    order: 4,
    subtopics: [
      { name: "Lines, Circles and Piecewise Functions", order: 1 },
      { name: "Parabolas", order: 2 },
      { name: "Ellipses", order: 3 },
      { name: "Miscellaneous Functions", order: 4 },
      { name: "Transformations", order: 5 },
      { name: "Symmetry", order: 6 },
      { name: "Rational Functions", order: 7 },
    ],
  },
  {
    name: "Polynomial Functions",
    order: 5,
    subtopics: [
      { name: "Dividing Polynomials", order: 1 },
      { name: "Zeroes/Roots of Polynomials", order: 2 },
      { name: "Graphing Polynomials", order: 3 },
      { name: "Finding Zeroes of Polynomials", order: 4 },
      { name: "Partial Fractions", order: 5 },
    ],
  },
  {
    name: "Exponential and Logarithm Functions",
    order: 6,
    subtopics: [
      { name: "Exponential Functions", order: 1 },
      { name: "Logarithm Functions", order: 2 },
      { name: "Solving Exponential Equations", order: 3 },
      { name: "Solving Logarithm Equations", order: 4 },
      { name: "Applications", order: 5 },
    ],
  },
  {
    name: "Systems of Equations",
    order: 7,
    subtopics: [
      { name: "Linear Systems with Two Variables", order: 1 },
      { name: "Linear Systems with Three Variables", order: 2 },
      { name: "Augmented Matrices", order: 3 },
      { name: "More on the Augmented Matrix", order: 4 },
      { name: "Nonlinear Systems", order: 5 },
    ],
  },
];

export default function Practice() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Unattempted");
  const [practiceItems, setPracticeItems] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [elapsed, setElapsed] = useState(0);

  // ✅ Load questions
  const handleLoadQuestions = async () => {
    if (!selectedTopic || !selectedSubtopic || !difficulty || !user?.uid) return;
    try {
      const docId = `${selectedTopic.toLowerCase().replace(/\s+/g, "-")}-${selectedSubtopic
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      const ref = doc(db, "questions", docId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        const items = data.difficultyLevels[difficulty] || [];

        const userProgressPromises = items.map(async (q) => {
          const progressRef = doc(
            db,
            "users",
            user.uid,
            "practiceProgress",
            `${docId}-${q.id}`
          );
          const progressSnap = await getDoc(progressRef);
          return {
            id: q.id,
            title: q.question,
            solution: q.solution,
            status: progressSnap.exists()
              ? progressSnap.data().status
              : "Unattempted",
          };
        });

        const formatted = await Promise.all(userProgressPromises);
        setPracticeItems(formatted);

        logHistory({
          userEmail: user.email,
          type: "practice",
          topic: selectedTopic,
          subtopic: selectedSubtopic,
          difficulty,
          progress: "loaded",
          source: "practice",
        });

        startSession({
          userEmail: user.email,
          topic: selectedTopic,
          subtopic: selectedSubtopic,
          type: "practice",
        });

        setElapsed(0);
        setShowForm(false);
      } else {
        setPracticeItems([]);
      }
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setPracticeItems([]);
    }
  };

  // ✅ Update question status
  const updateStatus = async (id, status) => {
    if (!user?.uid) return;

    const docId = `${selectedTopic.toLowerCase().replace(/\s+/g, "-")}-${selectedSubtopic
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    const progressRef = doc(
      db,
      "users",
      user.uid,
      "practiceProgress",
      `${docId}-${id}`
    );

    try {
      await setDoc(progressRef, {
        topic: selectedTopic,
        subtopic: selectedSubtopic,
        difficulty,
        questionId: id,
        status,
        updatedAt: new Date(),
      });

      setPracticeItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  // ✅ Session tracking
  useEffect(() => {
    const interval = setInterval(() => setElapsed(getSessionElapsed()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => () => user?.email && endSession(), [user]);

  const filteredItems = practiceItems.filter((item) => item.status === activeTab);

  // ✅ Render steps
  const renderStep = (step, stepNumber) => {
    if (!step || (!step.content && !step.parts)) return null;

    const renderContent = () => {
      if (step.parts && Array.isArray(step.parts)) {
        const validParts = step.parts.filter(
          (p) => p.content && p.content.trim() !== "." && p.content.trim() !== "-"
        );
        return validParts.map((part, i) =>
          part.type === "latex" || part.type === "math" ? (
            <div key={i} className="step-math">
              <MathJax dynamic>{`\\(${part.content}\\)`}</MathJax>
            </div>
          ) : (
            <p key={i} className="step-text">{part.content}</p>
          )
        );
      }

      if (step.type === "latex" || step.type === "math") {
        return (
          <div className="step-math">
            <MathJax dynamic>{`\\(${step.content}\\)`}</MathJax>
          </div>
        );
      }

      return <p className="step-text">{step.content}</p>;
    };

    return (
      <div key={stepNumber} className="step-block fade-in" style={{ animationDelay: `${stepNumber * 0.4}s` }}>
        <div className="step-label">Step {stepNumber + 1}</div>
        {renderContent()}
      </div>
    );
  };

  return (
    <MathJaxContext version={3} config={{ tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] } }}>
      <section className="practice-page">
        <header className="practice-header">
          <h2>Practice</h2>
          {!showForm && (
            <>
              <div className="session-timer">⏱ {Math.floor(elapsed / 60)}m {elapsed % 60}s</div>
              <button className="menu-icon" onClick={() => setShowForm(true)}>
                <FaEllipsisV className="filter-icon" />
              </button>
            </>
          )}
        </header>

        {showForm ? (
          <>
            <div className="practice-form">
              <h3>Select Topic</h3>
              <div className="option-grid">
                {topicsData.map((topic) => (
                  <button
                    key={topic.name}
                    onClick={() => {
                      setSelectedTopic(topic.name);
                      setSelectedSubtopic("");
                    }}
                    className={selectedTopic === topic.name ? "active" : ""}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>

              {selectedTopic && (
                <>
                  <h3>Select Subtopic</h3>
                  <div className="option-grid">
                    {topicsData.find((t) => t.name === selectedTopic)?.subtopics.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => setSelectedSubtopic(sub.name)}
                        className={selectedSubtopic === sub.name ? "active" : ""}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {selectedSubtopic && (
                <>
                  <h3>Select Difficulty</h3>
                  <div className="option-grid">
                    {["Easy", "Moderate", "Hard"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level.toLowerCase())}
                        className={difficulty === level.toLowerCase() ? "active" : ""}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button
                className="load-btn"
                disabled={!selectedTopic || !selectedSubtopic || !difficulty}
                onClick={handleLoadQuestions}
              >
                Load Questions
              </button>
            </div>
          </>
        ) : (
          <div className="practice-feed">
            <div className="status-tabs">
              {["Unattempted", "InProgress", "Done"].map((tab) => (
                <button
                  key={tab}
                  className={`${tab} ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "InProgress" ? "In Progress" : tab}
                </button>
              ))}
            </div>

            {filteredItems.length === 0 ? (
              <p className="no-items">No questions in this category.</p>
            ) : (
              filteredItems.map((item, index) => (
                <div key={item.id} className="practice-card">
                  <div className="practice-header-row">
                    <span className="practice-title">
                      <strong>Q{index + 1}:</strong>{" "}
                      <MathJax inline dynamic>{item.title}</MathJax>
                    </span>
                    <span className={`practice-status ${item.status}`}>
                      {item.status === "InProgress" ? "In Progress" : item.status}
                    </span>
                  </div>

                  <div className="practice-actions">
                    {item.status === "Unattempted" && (
                      <>
                        <button className="InProgress" onClick={() => updateStatus(item.id, "InProgress")}>In Progress</button>
                        <button className="Done" onClick={() => updateStatus(item.id, "Done")}>Done</button>
                      </>
                    )}
                    {item.status === "InProgress" && (
                      <button className="Done" onClick={() => updateStatus(item.id, "Done")}>Done</button>
                    )}
                  </div>

                  {item.status === "Done" && (
                    <>
                      <div className="practice-solution">
                        <h4>Solution:</h4>
                        {Array.isArray(item.solution) ? (
                          <div className="steps-list">
                            {item.solution
                              .filter(
                                (s) =>
                                  s &&
                                  ((s.content && s.content.trim() !== "." && s.content.trim() !== "-") ||
                                    (s.parts &&
                                      s.parts.some(
                                        (p) => p.content.trim() !== "." && p.content.trim() !== "-"
                                      )))
                              )
                              .map((s, i) => renderStep(s, i))}
                          </div>
                        ) : (
                          <div className="step-block fade-in">
                            <div className="step-label">Step 1</div>
                            <MathJax dynamic>{`\\(${item.solution}\\)`}</MathJax>
                          </div>
                        )}
                      </div>

                      <div className="reset-row">
                        <button className="Unattempted" onClick={() => updateStatus(item.id, "Unattempted")}>Reset</button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </MathJaxContext>
  );
}
