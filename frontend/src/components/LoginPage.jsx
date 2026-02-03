import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [method, setMethod] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Email login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onLogin && onLogin(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Google login
  const handleGoogleLogin = async () => {
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      onLogin && onLogin(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Log In</h2>

        {/* STEP 1: Choose method */}
        {!method && (
          <>
            <div className="method-row">
              <button
                type="button"
                className="method-btn google-btn"
                onClick={handleGoogleLogin}
              >
                Google
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

        {/* STEP 2: Email form */}
        {method === 'email' && (
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

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
              <button type="submit" className="login-btn">
                Log In
              </button>

              <span
                className="link back-link"
                onClick={() => setMethod(null)}
              >
                Back
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
