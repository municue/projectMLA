import {createContext, useContext, useState, useEffect} from 'react';

const ThemeContext = createContext();

export const ACCENT_COLORS = [
  {name: 'Cyan', value: '#00d4ff'},
  {name: 'Purple', value: '#a855f7'},
  {name: 'Pink', value: '#ec4899'},
  {name: 'Green', value: '#22c55e'},
  {name: 'Orange', value: '#f97316'},
  {name: 'Red', value: '#ef4444'},
  {name: 'Yellow', value: '#eab308'},
  {name: 'Blue', value: '#3b82f6'},
  {name: 'Teal', value: '#14b8a6'},
  {name: 'Rose', value: '#f43f5e'},
  {name: 'Indigo', value: '#6366f1'},
  {name: 'Amber', value: '#f59e0b'},
];

const savedColor = localStorage.getItem('accentColor') || '#00d4ff';
const savedDark = localStorage.getItem('isDark') !== 'false';

// Apply immediately before React renders to prevent flash
function applyTheme(color, dark) {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', color);
  root.style.setProperty('--background-color', dark ? '#000000' : '#1a1a1a');
  root.style.setProperty('--text-color', dark ? '#ffffff' : '#e0e0e0');
  root.style.setProperty('--card-bg', dark ? '#111111' : '#242424');
  root.style.setProperty('--border-color', '#333333');
  root.style.setProperty(
    '--keyboard-gradient',
    `linear-gradient(135deg, ${color}22, ${color}44, ${color}22)`,
  );
}

applyTheme(savedColor, savedDark);

export function ThemeProvider({children}) {
  const [accentColor, setAccentColor] = useState(savedColor);
  const [isDark, setIsDark] = useState(savedDark);

  useEffect(() => {
    applyTheme(accentColor, isDark);
  }, [accentColor, isDark]);

  function changeAccentColor(color) {
    setAccentColor(color);
    localStorage.setItem('accentColor', color);
  }

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('isDark', next);
  }

  return (
    <ThemeContext.Provider
      value={{accentColor, isDark, changeAccentColor, toggleDark}}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}