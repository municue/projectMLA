// src/components/FormulaLayout.jsx
import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import "./FormulaLayout.css";

export default function FormulaLayout() {
  const { subtopicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we’re inside a subtopic
  const isSubtopic = location.pathname.includes("/formula/") && subtopicId;

  return (
    <div className="formula-layout">
      <header className="formula-layout-header">
        {isSubtopic ? (
          <>
            <h2>{subtopicId.replace(/-/g, " ")} Formulas</h2>
            <button onClick={() => navigate(-1)} className="back-button">
              Back
            </button>
          </>
        ) : (
          <h2>Math Formulas</h2>
        )}
      </header>

      <div className="formula-layout-body">
        <Outlet />
      </div>
    </div>
  );
}
