import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [method, setMethod] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin && onLogin(userCredential.user);
      navigate('/');
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onLogin && onLogin(result.user);
      navigate('/');
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getFriendlyError = (code) => {
    switch (code) {
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/invalid-email': return 'Invalid email address.';
      case 'auth/too-many-requests': return 'Too many attempts. Try again later.';
      case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled.';
      case 'auth/network-request-failed': return 'Network error. Check your connection.';
      default: return 'Something went wrong. Please try again.';
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Log In</h2>

        {!method && (
          <>
            <div className="method-row">
              <button
                type="button"
                className="method-btn google-btn"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? 'Please wait...' : 'Google'}
              </button>

              <span className="or-text">or</span>

              <button
                type="button"
                className="method-btn"
                onClick={() => setMethod('email')}
              >
                Email
              </button>
            </div>

            <p className="switch-text">
              Don&apos;t have an account?{' '}
              <span className="link" onClick={() => navigate('/register')}>
                Register
              </span>
            </p>
          </>
        )}

        {method === 'email' && (
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="action-row">
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              <span className="link back-link" onClick={() => setMethod(null)}>
                Back
              </span>
            </div>
          </form>
        )}

        {error && method === null && (
          <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '10px' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}