import {useTheme, ACCENT_COLORS} from '../context/ThemeContext';
import './ThemePanel.css';

export default function ThemePanel() {
  const {accentColor, isDark, changeAccentColor, toggleDark} = useTheme();

  return (
    <section className="theme-panel">
      <header className="theme-header">
        <h2>Theme & Appearance</h2>
      </header>

      <div className="theme-body">
        <div className="theme-section">
          <h3>Mode</h3>
          <div className="mode-toggle">
            <button
              className={`mode-btn ${isDark ? 'active' : ''}`}
              onClick={() => !isDark && toggleDark()}
            >
              🌙 Dark
            </button>
            <button
              className={`mode-btn ${!isDark ? 'active' : ''}`}
              onClick={() => isDark && toggleDark()}
            >
              ☀️ Light
            </button>
          </div>
        </div>

        <div className="theme-section">
          <h3>Accent Color</h3>
          <p className="theme-hint">
            Changes highlights, borders, and keyboard gradient across the app.
          </p>
          <div className="color-grid">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                className={`color-swatch ${accentColor === color.value ? 'selected' : ''}`}
                style={{backgroundColor: color.value}}
                onClick={() => changeAccentColor(color.value)}
                title={color.name}
              >
                {accentColor === color.value && (
                  <span className="check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="theme-section">
          <h3>Preview</h3>
          <div className="theme-preview">
            <div
              className="preview-keyboard"
              style={{
                background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}55, ${accentColor}22)`,
                border: `1px solid ${accentColor}`,
              }}
            >
              <span style={{color: accentColor}}>Keyboard Preview</span>
              <div className="preview-keys">
                {['1', '2', '3', '+', '-', '='].map((k) => (
                  <div
                    key={k}
                    className="preview-key"
                    style={{borderColor: accentColor}}
                  >
                    {k}
                  </div>
                ))}
              </div>
            </div>
            <div
              className="preview-card"
              style={{borderColor: accentColor}}
            >
              <span style={{color: accentColor}}>● Active color</span>
              <p>Sample text in current theme</p>
              <button
                className="preview-btn"
                style={{
                  borderColor: accentColor,
                  color: accentColor,
                }}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}