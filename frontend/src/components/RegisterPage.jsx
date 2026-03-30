import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase';
import './LoginPage.css';
import './RegisterPage.css';

export default function RegisterPage({ onRegister }) {
  const [method, setMethod] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getFriendlyError = (code) => {
    switch (code) {
      case 'auth/email-already-in-use': return 'An account with this email already exists.';
      case 'auth/invalid-email': return 'Invalid email address.';
      case 'auth/weak-password': return 'Password must be at least 6 characters.';
      case 'auth/popup-closed-by-user': return 'Google sign-up was cancelled.';
      case 'auth/network-request-failed': return 'Network error. Check your connection.';
      default: return 'Something went wrong. Please try again.';
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onRegister && onRegister(userCredential.user);
      navigate('/');
    } catch (err) {
      setMessage(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setMessage('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onRegister && onRegister(result.user);
      navigate('/');
    } catch (err) {
      setMessage(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Register</h2>

        {!method && (
          <>
            <div className="method-row">
              <button
                type="button"
                className="method-btn google-btn"
                onClick={handleGoogleRegister}
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
              Already have an account?{' '}
              <span className="link" onClick={() => navigate('/loginpage')}>
                Log in
              </span>
            </p>
          </>
        )}

        {method === 'email' && (
          <form onSubmit={handleRegister}>
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
              <button
                type="submit"
                className="register-btn"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
              <span className="link back-link" onClick={() => setMethod(null)}>
                Back
              </span>
            </div>
          </form>
        )}

        {message && (
          <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '10px' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}