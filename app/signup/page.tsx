'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, generatePassphrase, TrackId } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const TRACKS = [
  {
    id: 'SE' as TrackId,
    label: 'Software Engineering',
    icon: '⚙️',
    tagline: 'Build real systems from scratch',
    skills: ['Python', 'APIs', 'SQL', 'Git', 'Docker'],
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.10)',
    border: 'rgba(124,58,237,0.30)',
  },
  {
    id: 'DS' as TrackId,
    label: 'Data Science',
    icon: '📊',
    tagline: 'Turn data into decisions',
    skills: ['Python', 'Pandas', 'NumPy', 'ML', 'Viz'],
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.10)',
    border: 'rgba(8,145,178,0.30)',
  },
  {
    id: 'AI' as TrackId,
    label: 'AI Engineering',
    icon: '🤖',
    tagline: 'Ship production-ready AI apps',
    skills: ['LLMs', 'RAG', 'Agents', 'Claude', 'MCP'],
    color: '#D97706',
    bg: 'rgba(217,119,6,0.10)',
    border: 'rgba(217,119,6,0.30)',
  },
];

type Step = 1 | 2 | 3;

export default function SignupPage() {
  const { signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<TrackId | null>(null);
  const [generatedPassphrase, setGeneratedPassphrase] = useState('');
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [copied, setCopied] = useState(false);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername || !linkedinUrl || !selectedTrack) return;
    setStep(3);
    // Generate credentials
    const newUser = signup({
      name, email, college, githubUsername,
      linkedinUrl: linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`,
      track: selectedTrack,
    });
    setGeneratedPassphrase(newUser.passphrase);
    setGeneratedUsername(newUser.username);
  };

  const copyPassphrase = useCallback(() => {
    navigator.clipboard.writeText(generatedPassphrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedPassphrase]);

  return (
    <div className="auth-container">
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Link href="/" className="navbar-logo" style={{ fontSize: '18px' }}>AB<span>Talks</span></Link>
          <button className="theme-toggle-btn" onClick={toggleTheme}>{theme === 'dark' ? '☀️' : '🌙'}</button>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              flex: 1, height: '4px', borderRadius: '999px',
              background: step >= s ? 'var(--violet)' : 'var(--border-subtle)',
              transition: 'background 0.4s',
            }} />
          ))}
        </div>

        {/* ---- STEP 1: Basic Info ---- */}
        {step === 1 && (
          <div className="auth-card">
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '22px', marginBottom: '6px' }}>Create your account</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Step 1 of 3 — Basic details</p>
            </div>
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: 'var(--text-secondary)' }}>Full Name *</label>
                <input className="input" placeholder="e.g. Karunuesh Kumar" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: 'var(--text-secondary)' }}>Email Address *</label>
                <input type="email" className="input" placeholder="student@college.edu" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: 'var(--text-secondary)' }}>College / University</label>
                <input className="input" placeholder="e.g. Amrita Vishwa Vidyapeetham" value={college} onChange={e => setCollege(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '8px', justifyContent: 'center' }}>
                Continue →
              </button>
              <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                Already enrolled? <Link href="/login" style={{ color: 'var(--violet-light)', fontWeight: 600 }}>Sign in</Link>
              </div>
            </form>
          </div>
        )}

        {/* ---- STEP 2: Track + GitHub/LinkedIn ---- */}
        {step === 2 && (
          <div className="auth-card">
            <div style={{ marginBottom: '20px' }}>
              <h1 style={{ fontSize: '22px', marginBottom: '6px' }}>Choose your track</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Step 2 of 3 — What are you building towards?</p>
            </div>
            <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Track cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {TRACKS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTrack(t.id)}
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: '14px', cursor: 'pointer',
                      background: selectedTrack === t.id ? t.bg : 'var(--bg-card)',
                      border: `2px solid ${selectedTrack === t.id ? t.color : 'var(--border-subtle)'}`,
                      display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                      background: t.bg, border: `1px solid ${t.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                    }}>{t.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: selectedTrack === t.id ? t.color : 'var(--text-primary)', marginBottom: '2px' }}>{t.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.tagline}</div>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '6px' }}>
                        {t.skills.map(s => (
                          <span key={s} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '999px', background: t.bg, color: t.color, fontWeight: 600, border: `1px solid ${t.border}` }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, border: `2px solid ${selectedTrack === t.id ? t.color : 'var(--border-medium)'}`, background: selectedTrack === t.id ? t.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {selectedTrack === t.id && <span style={{ fontSize: '10px', color: '#fff' }}>✓</span>}
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: 'var(--violet-light)' }}>
                    ⌥ GitHub Username * <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }}>(used for verification)</span>
                  </label>
                  <input className="input" placeholder="karunuesh304" value={githubUsername} onChange={e => setGithubUsername(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: 'var(--cyan-light)' }}>
                    💼 LinkedIn Profile URL * <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }}>(used for verification)</span>
                  </label>
                  <input type="url" className="input" placeholder="https://linkedin.com/in/username" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={!selectedTrack} style={{ justifyContent: 'center', opacity: selectedTrack ? 1 : 0.5, cursor: selectedTrack ? 'pointer' : 'not-allowed' }}>
                Create Account →
              </button>
            </form>
          </div>
        )}

        {/* ---- STEP 3: Show credentials ---- */}
        {step === 3 && (
          <div className="auth-card">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>🎉</div>
              <h1 style={{ fontSize: '22px', marginBottom: '6px' }}>You&apos;re enrolled!</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Save your login credentials — you&apos;ll need them every time</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Your Username</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--violet-light)', padding: '12px 16px', background: 'var(--violet-dim)', borderRadius: '10px', border: '1px solid rgba(124,58,237,0.25)' }}>
                  @{generatedUsername}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Your Secret Passphrase</div>
                <div style={{ position: 'relative' }}>
                  <div className="passphrase-box">{generatedPassphrase}</div>
                  <button
                    onClick={copyPassphrase}
                    style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#fff', cursor: 'pointer' }}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--rose)', marginTop: '6px', lineHeight: 1.5 }}>
                  ⚠️ This passphrase is shown only once. Please save it securely — you need it to log in.
                </p>
              </div>
            </div>

            <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={() => router.push('/dashboard')}>
              🚀 Start Day 1 Challenge →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
