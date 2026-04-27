import {createContext, useContext, useState, useEffect} from 'react';
import {doc, setDoc, getDoc} from 'firebase/firestore';
import {db} from '../components/firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../components/firebase';

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

const DEFAULT_COLOR = '#00d4ff';
const DEFAULT_DARK = true;

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

// Apply default theme immediately to prevent flash
applyTheme(DEFAULT_COLOR, DEFAULT_DARK);

export function ThemeProvider({children}) {
  const [accentColor, setAccentColor] = useState(DEFAULT_COLOR);
  const [isDark, setIsDark] = useState(DEFAULT_DARK);
  const [currentUid, setCurrentUid] = useState(null);

  // Listen for auth changes and load user theme from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUid(firebaseUser.uid);
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            const color = data.themeColor || DEFAULT_COLOR;
            const dark = data.themeDark !== undefined ? data.themeDark : DEFAULT_DARK;
            setAccentColor(color);
            setIsDark(dark);
            applyTheme(color, dark);
          }
        } catch (err) {
          console.error('Failed to load theme:', err);
        }
      } else {
        // User logged out — reset to default
        setCurrentUid(null);
        setAccentColor(DEFAULT_COLOR);
        setIsDark(DEFAULT_DARK);
        applyTheme(DEFAULT_COLOR, DEFAULT_DARK);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applyTheme(accentColor, isDark);
  }, [accentColor, isDark]);

  async function saveThemeToFirestore(color, dark) {
    if (!currentUid) return;
    try {
      await setDoc(
        doc(db, 'users', currentUid),
        {themeColor: color, themeDark: dark},
        {merge: true},
      );
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  }

  function changeAccentColor(color) {
    setAccentColor(color);
    saveThemeToFirestore(color, isDark);
  }

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    saveThemeToFirestore(accentColor, next);
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