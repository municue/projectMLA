import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LevelModal.css';

const levels = [
  {
    id: 'beginner',
    label: 'Beginner',
    icon: '🌱',
    description: 'New to the topics. Start from the basics.',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    icon: '📈',
    description: 'Familiar with basics. Ready for more depth.',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: '🚀',
    description: 'Confident with most topics. Push your limits.',
  },
];

export default function LevelModal() {
  const { saveLevel } = useAuth();
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);
    await saveLevel(selected);
    setSaving(false);
  };

  return (
    <div className="level-overlay">
      <div className="level-modal">
        <h2 className="level-title">Welcome! 👋</h2>
        <p className="level-subtitle">
          Select your current math level to personalise your experience.
        </p>

        <div className="level-options">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              className={`level-option ${selected === lvl.id ? 'selected' : ''}`}
              onClick={() => setSelected(lvl.id)}
            >
              <span className="level-icon">{lvl.icon}</span>
              <div className="level-info">
                <span className="level-label">{lvl.label}</span>
                <span className="level-desc">{lvl.description}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          className="level-confirm"
          disabled={!selected || saving}
          onClick={handleConfirm}
        >
          {saving ? 'Saving...' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}