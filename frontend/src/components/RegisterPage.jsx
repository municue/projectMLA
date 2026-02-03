import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; 
import { auth, db } from './firebase'; 
import './LoginPage.css';
import './RegisterPage.css';

export default function RegisterPage({ onRegister }) {
  const [method, setMethod] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // ✅ Email registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        provider: "password",
        createdAt: serverTimestamp()
      });

      onRegister && onRegister(user);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  // ✅ Google registration
  const handleGoogleRegister = async () => {
    setMessage('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          provider: "google",
          createdAt: serverTimestamp()
        },
        { merge: true }
      );

      onRegister && onRegister(user);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Register</h2>

        {/* STEP 1: Choose method */}
        {!method && (
          <>
            <div className="method-row">
              <button
                type="button"
                className="method-btn google-btn"
                onClick={handleGoogleRegister}
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
              Already have an account?{' '}
              <span className="link" onClick={() => navigate('/loginpage')}>
                Log in
              </span>
            </p>
          </>
        )}

        {/* STEP 2: Email form */}
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
              <button type="submit" className="register-btn">Register</button>
              <span
                className="link back-link"
                onClick={() => setMethod(null)}
              >
                Back
              </span>
            </div>
          </form>
        )} 

        {message && <p className="error">{message}</p>}
      </div>
    </div>
  );
}
