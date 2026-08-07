'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate auth
    const ok = login(username.trim(), passphrase.trim());
    setLoading(false);
    if (ok) {
      router.push('/dashboard');
    } else {
      setError('Invalid username or passphrase. Check your credentials saved during signup.');
    }
  };

  return (
    <div className="auth-container">
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <Link href="/" className="navbar-logo" style={{ fontSize: '18px' }}>AB<span>Talks</span></Link>
          <button className="theme-toggle-btn" onClick={toggleTheme}>{theme === 'dark' ? '☀️' : '🌙'}</button>
        </div>

        <div className="auth-card">
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '22px', marginBottom: '6px' }}>Welcome back 👋</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sign in with your username and secret passphrase</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: 'var(--text-secondary)' }}>
                Username <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(generated at signup)</span>
              </label>
              <input
                className="input"
                placeholder="e.g. karunuesh5847"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: 'var(--text-secondary)' }}>
                Secret Passphrase <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(5 words separated by dashes)</span>
              </label>
              <input
                className="input"
                placeholder="e.g. amber-blaze-cedar-drift-ember"
                value={passphrase}
                onChange={e => { setPassphrase(e.target.value); setError(''); }}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div style={{ background: 'var(--rose-dim)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--rose)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', lineHeight: 1.5 }}>
                ❌ {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center', marginTop: '4px' }}>
              {loading ? <><div className="spinner" />Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '20px', paddingTop: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            New to ABTalks?{' '}
            <Link href="/signup" style={{ color: 'var(--violet-light)', fontWeight: 600 }}>Enroll for free</Link>
          </div>

          {/* Hint box */}
          <div style={{ marginTop: '16px', background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', lineHeight: 1.6, color: 'var(--amber)' }}>
            💡 Your passphrase was shown at signup in the format:<br />
            <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>word-word-word-word-word</code>
          </div>
        </div>
      </div>
    </div>
  );
}
