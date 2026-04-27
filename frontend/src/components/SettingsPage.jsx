import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, ACCENT_COLORS } from '../context/ThemeContext';
import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import './SettingsPage.css';

const levels = [
  { id: 'beginner', label: 'Beginner', icon: '🌱' },
  { id: 'intermediate', label: 'Intermediate', icon: '📈' },
  { id: 'advanced', label: 'Advanced', icon: '🚀' },
];

export default function SettingsPage() {
  const { user, level, userPhoto, userName, saveLevel, savePhoto, saveName } = useAuth();
  const { accentColor, isDark, changeAccentColor, toggleDark } = useTheme();

  const [selectedLevel, setSelectedLevel] = useState(level || 'beginner');
  const [displayName, setDisplayName] = useState(userName || user?.displayName || '');
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPendingPhoto(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    if (!pendingPhoto) return;
    setSaving(true);
    try {
      await savePhoto(pendingPhoto);
      showToast('✅ Profile picture updated');
      setPendingPhoto(null);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to save photo', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveName(displayName);
      showToast('✅ Profile name updated');
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to update name', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLevel = async () => {
    setSaving(true);
    await saveLevel(selectedLevel);
    showToast('✅ Level updated successfully');
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      if (user.providerData[0]?.providerId === 'password') {
        const credential = EmailAuthProvider.credential(
          user.email, deletePassword
        );
        await reauthenticateWithCredential(user, credential);
      }
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to delete. Check your password.', 'error');
    }
  };

  const displayedPhoto = pendingPhoto || userPhoto;

  return (
    <section className="settings-page">
      <header className="settings-header">
        <h2>Settings</h2>
      </header>

      <div className="settings-body">

        {/* Profile Picture */}
        <div className="settings-section">
          <h3>Profile Picture</h3>
          <div className="avatar-row">
            <div className="settings-avatar">
              {displayedPhoto ? (
                <img src={displayedPhoto} alt="Profile" className="avatar-img" />
              ) : (
                <span className="avatar-initials">
                  {userName
                    ? userName.charAt(0).toUpperCase()
                    : user?.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="settings-btn"
                onClick={() => fileInputRef.current.click()}
              >
                Choose Photo
              </button>
              {pendingPhoto && (
                <button
                  className="settings-btn"
                  onClick={handleSavePhoto}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Photo'}
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePicChange}
            />
          </div>
          {pendingPhoto && (
            <p style={{ color: '#aaa', fontSize: '0.8rem' }}>
              Click "Save Photo" to apply to your profile.
            </p>
          )}
        </div>

        {/* Account Info */}
        <div className="settings-section">
          <h3>Account Info</h3>
          <label className="settings-label">Display Name</label>
          <input
            className="settings-input"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name"
          />
          <label className="settings-label" style={{ marginTop: '8px' }}>
            Email
          </label>
          <input
            className="settings-input"
            type="email"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          />
          <small style={{ color: '#888', fontSize: '0.8rem' }}>
            Email cannot be changed here.
          </small>
          <button
            className="settings-btn"
            onClick={handleSaveProfile}
            disabled={saving}
            style={{ marginTop: '12px' }}
          >
            {saving ? 'Saving...' : 'Save Name'}
          </button>
        </div>

        {/* Level */}
        <div className="settings-section">
          <h3>Your Level</h3>
          <div className="level-options-row">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                className={`level-chip ${selectedLevel === lvl.id ? 'selected' : ''}`}
                onClick={() => setSelectedLevel(lvl.id)}
              >
                {lvl.icon} {lvl.label}
              </button>
            ))}
          </div>
          <button
            className="settings-btn"
            onClick={handleSaveLevel}
            disabled={saving}
            style={{ marginTop: '12px' }}
          >
            {saving ? 'Saving...' : 'Save Level'}
          </button>
        </div>

        {/* Theme */}
        <div className="settings-section">
          <h3>Theme & Appearance</h3>

          <label className="settings-label">Mode</label>
          <div className="mode-toggle-row">
            <button
              className={`level-chip ${isDark ? 'selected' : ''}`}
              onClick={() => !isDark && toggleDark()}
            >
              🌙 Dark
            </button>
            <button
              className={`level-chip ${!isDark ? 'selected' : ''}`}
              onClick={() => isDark && toggleDark()}
            >
              ☀️ Light
            </button>
          </div>

          <label className="settings-label" style={{ marginTop: '16px' }}>
            Accent Color
          </label>
          <div className="color-grid-settings">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                className={`color-swatch-settings ${accentColor === color.value ? 'selected' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => changeAccentColor(color.value)}
                title={color.name}
              >
                {accentColor === color.value && (
                  <span style={{
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textShadow: '0 0 4px rgba(0,0,0,0.8)',
                  }}>✓</span>
                )}
              </button>
            ))}
          </div>

          <label className="settings-label" style={{ marginTop: '16px' }}>
            Preview
          </label>
          <div
            style={{
              background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}55, ${accentColor}22)`,
              border: `1px solid ${accentColor}`,
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <span style={{ color: accentColor, fontWeight: 'bold' }}>
              Keyboard Preview
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['1', '2', '3', '+', '-', '='].map((k) => (
                <div
                  key={k}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: `1px solid ${accentColor}`,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'var(--text-color)',
                  }}
                >
                  {k}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: '10px',
              border: `1px solid ${accentColor}`,
              borderRadius: '12px',
              padding: '14px',
              background: 'var(--card-bg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <span style={{ color: accentColor }}>● Active color</span>
            <p style={{ margin: 0, color: 'var(--text-color)', fontSize: '0.9rem' }}>
              Sample text in current theme
            </p>
            <button
              style={{
                padding: '6px 14px',
                border: `1px solid ${accentColor}`,
                borderRadius: '6px',
                background: 'transparent',
                color: accentColor,
                cursor: 'pointer',
                width: 'fit-content',
                fontSize: '0.85rem',
              }}
            >
              Sample Button
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <h3>Danger Zone</h3>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '12px' }}>
            Deleting your account is permanent and cannot be undone.
          </p>
          {!showDeleteConfirm ? (
            <button
              className="settings-btn danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              🗑 Delete Account
            </button>
          ) : (
            <div className="delete-confirm">
              {user?.providerData[0]?.providerId === 'password' && (
                <>
                  <label className="settings-label">
                    Enter your password to confirm
                  </label>
                  <input
                    className="settings-input"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                  />
                </>
              )}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  className="settings-btn danger"
                  onClick={handleDeleteAccount}
                >
                  Confirm Delete
                </button>
                <button
                  className="settings-btn"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className={`settings-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </section>
  );
}