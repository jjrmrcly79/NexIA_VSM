import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setInfo('Revisa tu correo para confirmar tu cuenta.');
      }
    } catch (err) {
      setError(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" stroke="url(#grad)" strokeWidth="2" fill="none"/>
              <path d="M12 16L20 12L28 16V24L20 28L12 24V16Z" fill="url(#grad)" opacity="0.6"/>
              <defs>
                <linearGradient id="grad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="auth-title">NexIA VSM</h1>
          <p className="auth-subtitle">Value Stream Mapping Inteligente</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); setInfo(''); }}
          >Iniciar Sesión</button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); setInfo(''); }}
          >Registrarse</button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Correo electrónico</label>
            <input
              type="email"
              required
              placeholder="usuario@empresa.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label>Contraseña</label>
            <input
              type="password"
              required
              placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {info  && <p className="auth-info">{info}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? <span className="auth-spinner" />
              : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-footer">
          Nexia Soluciones — Lean Manufacturing Suite
        </p>
      </div>
    </div>
  );
}
