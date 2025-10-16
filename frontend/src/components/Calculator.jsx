// src/components/Calculator.jsx
import { useState, useEffect, useRef } from "react";
import "./Calculator.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { FaEllipsisV } from "react-icons/fa";

// 🔑 Firebase imports
import { db } from "./firebase";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

// 🔑 Use ChatGPT solver
import { queryChatGPT } from "../utils/queryChatGPT";

export default function CalculatorPage() {
  const { user } = useAuth();

  const [expression, setExpression] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [steps, setSteps] = useState([]);
  const [finalAnswer, setFinalAnswer] = useState(null);
  const [activeCategory, setActiveCategory] = useState("basic");
  const [showAlphabet, setShowAlphabet] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(true);

  const [pendingExpr, setPendingExpr] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔑 Past calculations + toast
  const [pastCalcs, setPastCalcs] = useState([]);
  const [showPastModal, setShowPastModal] = useState(false);
  const [toast, setToast] = useState(null);

  // 🔑 Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 🔑 Confirm solve modal
  const [showConfirm, setShowConfirm] = useState(false);

  // Fake blinking caret input ref
  const inputRef = useRef(null);

  // ✅ Toast helper
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ Helper: sanitize values for Firestore
  const sanitizeForFirestore = (obj) => {
    if (obj === undefined) return null;
    if (Array.isArray(obj)) return obj.map((item) => sanitizeForFirestore(item));
    if (obj !== null && typeof obj === "object") {
      const clean = {};
      Object.entries(obj).forEach(([k, v]) => {
        clean[k] = sanitizeForFirestore(v);
      });
      return clean;
    }
    return obj;
  };

  // ✅ Save to Firestore
  const saveCalculation = async () => {
    if (!user?.email || !expression?.trim() || steps.length === 0) {
      showToast("⚠️ Nothing to save", "error");
      return;
    }
    try {
      const payload = sanitizeForFirestore({
        userEmail: user.email,
        expression: expression || "",
        steps: steps || [],
        finalAnswer: finalAnswer || null,
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(db, "calculations"), payload);

      showToast("✅ Calculation saved", "success");
    } catch (err) {
      console.error("Save error:", err);
      showToast("❌ Failed to save", "error");
    }
  };

  // ✅ Subscribe to past calculations
  useEffect(() => {
    if (!user?.email) return;

    const q = query(collection(db, "calculations"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();

            let displayTime = "";
            try {
              if (data.createdAt?.toDate) {
                displayTime = data.createdAt.toDate().toLocaleString();
              } else {
                displayTime = new Date().toLocaleString();
              }
            } catch (e) {
              console.warn("Invalid timestamp", e);
              displayTime = new Date().toLocaleString();
            }

            return { id: docSnap.id, ...data, displayTime };
          })
          .filter((item) => item.userEmail === user.email);

        setPastCalcs(items);
      },
      (error) => {
        console.error("Snapshot error:", error);
        showToast("❌ Failed to load history", "error");
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ✅ Delete calculation
  const deleteCalculation = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, "calculations", deleteTarget.id));
      setDeleteTarget(null);
      showToast("🗑️ Calculation deleted", "success");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("❌ Failed to delete", "error");
    }
  };

  // ✅ Insert character at cursor position
  const insertAtCursor = (val) => {
    setExpression((expr) => {
      const newExpr = expr.slice(0, cursorPos) + val + expr.slice(cursorPos);
      setCursorPos(cursorPos + val.length);
      return newExpr;
    });
  };

  // ✅ Handle button clicks
  const handleClick = (val) => {
    if ((val === "ABC" || val === "123") && activeCategory === "basic") {
      setShowAlphabet((prev) => !prev);
    } else if (val === "Backspace") {
      setExpression((expr) => {
        if (cursorPos > 0) {
          const newExpr = expr.slice(0, cursorPos - 1) + expr.slice(cursorPos);
          setCursorPos(cursorPos - 1);
          return newExpr;
        }
        return expr;
      });
    } else if (val === "<" || val === "←") {
      setCursorPos((pos) => Math.max(0, pos - 1));
    } else if (val === ">" || val === "→") {
      setCursorPos((pos) => Math.min(expression.length, pos + 1));
    } else if (val === "↑") {
      setCursorPos(0);
    } else if (val === "↓") {
      setCursorPos(expression.length);
    } else if (val === "Space") {
      insertAtCursor(" ");
    } else if (val === "Enter") {
      if (expression.trim()) {
        setPendingExpr(expression);
        setShowConfirm(true);
      }
    } else {
      insertAtCursor(val);
    }
  };

  // ✅ Keyboard typing handler
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (expression.trim()) {
        setPendingExpr(expression);
        setShowConfirm(true);
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
      if (cursorPos > 0) {
        setExpression(
          expression.slice(0, cursorPos - 1) + expression.slice(cursorPos)
        );
        setCursorPos(cursorPos - 1);
      }
    } else if (e.key.length === 1) {
      e.preventDefault();
      insertAtCursor(e.key);
    }
  };

  // ✅ Keyboard keys
  const numericKeys = [
    "1","2","3","4","5","6","7","8",
    "9","0","+","*","/","^","√","-", 
    "←","↑","→","log","=","Enter","ABC","↓", 
    "Space","exp","Backspace","(",")","lim"
  ];

  const alphabetKeys = [
    "q","w","e","r","t","y","u",
    "i","o","p","a","s","d","f",
    "g","h","j","k","l","z","x",
    "c","Backspace","v","b","n","m","?","Enter","123","Space"
  ];

  const keyCategories = {
    basic: showAlphabet ? alphabetKeys : numericKeys,
    trig: ["sin","cos","tan","asin","acos","atan","sec","csc","cot","sin(x)","cos(x)","tan(x)","x²","x³","e^x","ln","Re","Im","arg","mod","cis","A","Backspace","Enter","z1","z2","x","(",")","π","Space"],
    cal: ["d/dx","∫","lim","e^x","ln","sin(x)","cos(x)","tan(x)","x²","x³","^","√","x","π","exp","log","(",")","Re","mod","A","arg","Backspace","B","[","]","asin","acos","Enter","sec","Space"],
    mat: ["det","trace","inv","dot","cross","rank","λ","[","]","transpose","x²","x³","sin(x)","cos(x)","tan(x)","A","x","Re","Im","arg","mod","Backspace","asin","acos","z1","z2","Enter","sec","csc","Space"],
    comp: ["Re","Im","arg","mod","cis","z1","z2","i","(",")","π","e^x","ln","x²","x³","A","Backspace","log","x","tan(x)","cos(x)","sin(x)","asin","acos","atan","sec","csc","B","exp","Enter","Space"],
    prob: ["{","}","P(A)","P(B)","P(A|B)","μ","σ","Var","std","E(x)","Σ","%","N(μ, σ)","π","Enter","(","Backspace","B",")","P(A ∪ B)","P(A ∩ B)","A","Space"]
  };

  const getKeyClass = (key) => {
    if (["Backspace", "transpose", "Enter", "="].includes(key)) return "key-btn wide";
    if (key === "Space") return "key-btn extra-wide";
    if ((key === "ABC" || key === "123") && activeCategory === "basic") return "key-btn switch-btn";
    if (key.startsWith("switch:")) return "key-btn switch-btn";
    return "key-btn";
  };

  const getVisibleKeys = () => {
    const baseKeys = keyCategories[activeCategory];
    const switchers = Object.keys(keyCategories)
      .filter((cat) => cat !== activeCategory)
      .map((cat) => `switch:${cat}`);
    return [...baseKeys, ...switchers];
  };

  // ✅ Render explanation first, then math
  const renderStep = (item) => {
    if (!item) return null;

    if (item.parts && Array.isArray(item.parts)) {
      return (
        <div className="step-block-inner">
          {item.parts.map((part, idx) =>
            part.type === "text" ? (
              <p key={idx} className="step-text">{part.content}</p>
            ) : (
              <div key={idx} className="step-math">
                <MathJax dynamic>{`\\(${part.content}\\)`}</MathJax>
              </div>
            )
          )}
        </div>
      );
    }

    // Fallback for old format
    if (item.type === "latex") {
      return (
        <div className="step-math">
          <MathJax dynamic>{`\\(${item.content}\\)`}</MathJax>
        </div>
      );
    }
    return <p className="step-text">{item.content}</p>;
  };

  return (
    <MathJaxContext>
      <section className="calc-page">
        <header className="calc-header">
          <h2>Calculator</h2>
          <div className="calc-menu">
            <button className="menu-icon" onClick={() => setMenuOpen((prev) => !prev)}>
              <FaEllipsisV />
            </button>
            {menuOpen && (
              <div className="calc-dropdown">
                <button onClick={() => setShowPastModal(true)}>📜 View Past Calculations</button>
                <button onClick={saveCalculation}>⭐ Save Current Calculation</button>
              </div>
            )}
          </div>
        </header>

        <div className="calc-body">
          <div className="calc-scroll">
            {steps.length > 0 && (
              <div className="calc-result">
                <div className="question-box">
                  <h4>Question:</h4>
                  <MathJax dynamic>{`\\(${pendingExpr || expression}\\)`}</MathJax>
                </div>

                <div className="steps-list">
                  {steps.map((s, i) => (
                    <div
                      key={i}
                      className="step-block fade-in"
                      style={{ animationDelay: `${i * 0.4}s` }}
                    >
                      {renderStep(s)}
                    </div>
                  ))}
                </div>

                <div className="answer-box fade-in" style={{ animationDelay: `${steps.length * 0.4}s` }}>
                  <h4>Final Answer:</h4>
                  {renderStep(finalAnswer)}
                </div>
              </div>
            )}
          </div>

          {/* ✅ Input + Toggle on same row */}
          <div className="calc-footer">
            <div className="display-row">
              <div
                className="expression-display"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                ref={inputRef}
              >
                {expression.slice(0, cursorPos)}
                <span className="fake-caret" />
                {expression.slice(cursorPos)}
              </div>

              <button onClick={() => setKeyboardVisible((prev) => !prev)} className="toggle-btn">
                {keyboardVisible ? "Hide" : "Show"}
              </button>
            </div>

            {keyboardVisible && (
              <div className="keyboard-wrapper">
                <div className="keyboard">
                  {getVisibleKeys().map((key, idx) =>
                    key.startsWith("switch:") ? (
                      <button key={idx} className={getKeyClass(key)} onClick={() => setActiveCategory(key.replace("switch:", ""))}>
                        {key.replace("switch:", "")}
                      </button>
                    ) : (
                      <button key={idx} className={getKeyClass(key)} onClick={() => handleClick(key)}>
                        {key}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Past Calculations Modal with delete */}
        {showPastModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Past Calculations</h3>
              <div className="history-scroll">
                {pastCalcs.length === 0 ? (
                  <p>No past calculations</p>
                ) : (
                  pastCalcs.map((calc) => (
                    <div
                      key={calc.id}
                      className="history-card"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                        padding: "10px",
                        border: "1px solid #333",
                        borderRadius: "6px",
                      }}
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSteps(calc.steps || []);
                          setFinalAnswer(calc.finalAnswer || null);
                          setPendingExpr(calc.expression || "");
                          setShowPastModal(false);
                        }}
                      >
                        <p><strong><MathJax dynamic>{`\\(${calc.expression}\\)`}</MathJax></strong></p>
                        <small>{calc.displayTime}</small>
                      </div>
                      <button className="danger" style={{ marginLeft: "10px" }} onClick={() => setDeleteTarget(calc)}>
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowPastModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Confirm Solve Modal */}
        {showConfirm && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Solve this expression?</h3>
              <div style={{ margin: "15px 0" }}>
                <MathJax dynamic>{`\\(${pendingExpr}\\)`}</MathJax>
              </div>
              <div className="modal-actions">
                <button
                  onClick={async () => {
                    try {
                      const result = await queryChatGPT(pendingExpr);
                      setSteps(result.steps || []);
                      setFinalAnswer(result.finalAnswer || null);
                      setShowConfirm(false);
                    } catch (err) {
                      console.error("Solve error:", err);
                      showToast("❌ Failed to solve", "error");
                      setShowConfirm(false);
                    }
                  }}
                >
                  ✅ Yes
                </button>
                <button className="danger" onClick={() => setShowConfirm(false)}>❌ No</button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Delete Calculation?</h3>
              <p>Are you sure you want to delete:</p>
              <p><strong>{deleteTarget.expression}</strong></p>
              <div className="modal-actions">
                <button onClick={deleteCalculation}>✅ Confirm</button>
                <button className="danger" onClick={() => setDeleteTarget(null)}>❌ Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Toast Notification */}
        {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </section>
    </MathJaxContext>
  );
}
