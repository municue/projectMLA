// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/firebase';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SearchPanel from './components/SearchPanel';
import History from './components/History';
import Progress from './components/Progress';
import TopicsList from './components/TopicsList';
import TopicContent from './components/TopicContent';
import Practice from './components/Practice';
import Formula from './components/Formula';
import FormulaContent from "./components/FormulaContent";
import FormulaLayout from "./components/FormulaLayout"; 
import Calculator from './components/Calculator';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [reloadKey, setReloadKey] = useState(0);

  const handleReloadSession = () => {
    setReloadKey(prev => prev + 1);
  };

  // ✅ Hide global loader once React mounts
  useEffect(() => {
    const loader = document.getElementById("global-loader");
    if (loader) loader.style.display = "none";
  }, []);

  // ✅ Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const hideSidebar = location.pathname === '/loginpage' || location.pathname === '/register';

  const handleLogout = async () => {
    setUser(null);
    navigate('/loginpage');
  };

  return (
    <div className="app-wrapper">
      {!hideSidebar && (
        <Sidebar 
          user={user} 
          onLogout={handleLogout} 
          onReloadSession={handleReloadSession}
        />
      )}

      <Routes key={reloadKey}>
        {/* ✅ Root goes to login unless authenticated */}
        <Route path="/" element={user ? <MainContent /> : <Navigate to="/loginpage" />} />

        <Route path="/history" element={
          <ProtectedRoute user={user}>
            <History user={user} />
          </ProtectedRoute>
        } />
        <Route path="/progress" element={
          <ProtectedRoute user={user}>
            <Progress />
          </ProtectedRoute>
        } />
        <Route path="/topics" element={
          <ProtectedRoute user={user}>
            <TopicsList />
          </ProtectedRoute>
        } />
        <Route path="/topics/:topicId/:subtopicId" element={
          <ProtectedRoute user={user}>
            <TopicContent />
          </ProtectedRoute>
        } />
        <Route path="/practice" element={
          <ProtectedRoute user={user}>
            <Practice />
          </ProtectedRoute>
        } />

        <Route path="/formula" element={
          <ProtectedRoute user={user}>
            <FormulaLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Formula />} />
          <Route path=":topicId/:subtopicId" element={<FormulaContent />} />
        </Route>

        <Route path="/calculator" element={
          <ProtectedRoute user={user}>
            <Calculator />
          </ProtectedRoute>
        } />

        {/* Public routes */}
        <Route path="/loginpage" element={<LoginPage onLogin={(userData) => setUser(userData)} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Fallback → always push to login if unknown route */}
        <Route path="*" element={<Navigate to="/loginpage" />} />
      </Routes>

      {!hideSidebar && <SearchPanel />}
    </div>
  );
}
