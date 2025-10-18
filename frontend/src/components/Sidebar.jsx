// src/components/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import InfinityImg from '../assets/infinityimg.png';

export default function Sidebar({ user, onLogout, onReloadSession }) {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    { label: "Home", icon: "🏠", path: "/" },
    { label: "Calculator", icon: "🧮", path: "/calculator" },
    { label: "Topics", icon: "📚", path: "/topics" },
    { label: "Formula", icon: "📐", path: "/formula" },
    { label: "Practice", icon: "📝", path: "/practice" },
    { label: "Progress", icon: "📈", path: "/progress" },
    { label: "History", icon: "📜", path: "/history" },
  ];

  const initials = user ? user.email.charAt(0).toUpperCase() : '';

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img src={InfinityImg} alt="Infinity Logo" className="logo-img" />
      </div>

      <nav className="menu">
        <ul>
          {menuItems.map(item => (
            <li
              key={item.label}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <Link to={item.path}>
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button className="action-button" onClick={onReloadSession}>
        Reload Session
      </button>

      {user && (
        <div className="sidebar-profile-container">
          <div
            className="profile-avatar"
            onClick={() => setShowMenu(prev => !prev)}
          >
            {initials}
          </div>
          {showMenu && (
            <div className="profile-menu">
              <span className="profile-email">{user.email}</span>
              <button className="logout-btn" onClick={onLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
