// src/components/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';
import InfinityImg from '../assets/infinityimg.png';

export default function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { level, userPhoto, userName } = useAuth();

  const menuItems = [
    { label: "Home", icon: "🏠", path: "/" },
    { label: "Calculator", icon: "🧮", path: "/calculator" },
    { label: "Topics", icon: "📚", path: "/topics" },
    { label: "Formula", icon: "📐", path: "/formula" },
    { label: "Practice", icon: "📝", path: "/practice" },
    { label: "Progress", icon: "📈", path: "/progress" },
    { label: "History", icon: "📜", path: "/history" },
    { label: "Settings", icon: "⚙️", path: "/settings" },
  ];

  const handleSoftReload = () => {
    const event = new CustomEvent('soft-reload', {
      detail: { timestamp: Date.now(), path: location.pathname }
    });
    window.dispatchEvent(event);
  };

  const avatarInitial = userName
    ? userName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase();

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

      <button className="action-button" onClick={handleSoftReload}>
        Reload Session
      </button>

      {user && (
        <div className="sidebar-profile-container">
          <div
            className="profile-avatar"
            onClick={() => setShowMenu(prev => !prev)}
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              avatarInitial
            )}
          </div>
          {showMenu && (
            <div className="profile-menu">
              {userName && (
                <span style={{
                  fontWeight: 'bold',
                  color: 'var(--text-color)',
                  fontSize: '0.9rem',
                }}>
                  {userName}
                </span>
              )}
              <span className="profile-email">{user.email}</span>
              {level && (
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--primary-color)',
                }}>
                  Level: {level.charAt(0).toUpperCase() + level.slice(1)}
                </span>
              )}
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