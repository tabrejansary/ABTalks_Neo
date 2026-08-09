'use client';
import React, { useState, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { getChallengeForDay } from '@/data/challenges';
import {
  FileTextIcon,
  TerminalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  GithubIcon,
  LinkedinIcon,
  RocketIcon,
  LogOutIcon,
  CopyIcon,
  ArrowRightIcon,
  HomeIcon,
  ZapIcon,
  CheckIcon,
  PartyPopperIcon,
  FlameIcon,
  LockIcon,
} from '@/app/icons';

type TabId = 'problem' | 'code' | 'submit';
type VerifyState = 'idle' | 'checking' | 'success' | 'error';

/* ---- Confetti ---- */
function confetti() {
  const colors = ['#7C3AED','#06B6D4','#F59E0B','#10B981','#F43F5E'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = `${Math.random()*100}vw`;
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.animationDelay = `${Math.random()*0.4}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

/* ---- GitHub verify: checks README exists ---- */
async function verifyGitHub(url: string, registeredUser: string): Promise<{ok: boolean; msg: string}> {
  if (!url) return { ok: false, msg: 'Enter a GitHub repository URL.' };
  const match = url.match(/github\.com\/([^/]+)\/([^/\s#?]+)/);
  if (!match) return { ok: false, msg: 'Must be a github.com/username/repo URL.' };
  const [, owner, repo] = match;
  try {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: { Accept: 'application/vnd.github.v3+json' } });
    if (repoRes.status === 404) return { ok: false, msg: `Repo "${owner}/${repo}" not found or is private.` };
    if (!repoRes.ok) return { ok: false, msg: 'GitHub API error. Check repo visibility.' };
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers: { Accept: 'application/vnd.github.v3+json' } });
    if (readmeRes.status === 404) return { ok: false, msg: `README.md missing in "${owner}/${repo}". Add one documenting your solution.` };
    const handleNote = owner.toLowerCase() !== registeredUser.toLowerCase() ? ` (Note: repo by @${owner}, registered as @${registeredUser})` : '';
    return { ok: true, msg: `Repo found with README.md!${handleNote}` };
  } catch { return { ok: false, msg: 'Network error while reaching GitHub API.' }; }
}

/* ---- LinkedIn verify: post URL + ABTalks hashtag hint ---- */
function verifyLinkedIn(url: string): {ok: boolean; msg: string} {
  if (!url) return { ok: false, msg: 'Enter your LinkedIn post URL.' };
  if (!url.includes('linkedin.com')) return { ok: false, msg: 'Not a LinkedIn URL.' };
  const isPost = url.includes('/posts/') || url.includes('/feed/update/') || url.includes('/activity-') || url.includes('ugcPost');
  if (!isPost) return { ok: false, msg: 'Please paste the direct post link (click "..." on your LinkedIn post -> "Copy link to post").' };
  return { ok: true, msg: 'LinkedIn post URL verified! Include #ABTalks #60DaysChallenge in your post for visibility.' };
}

/* ---- Day Challenge Page ---- */
export default function DayPage({ params }: { params: Promise<{day: string}> }) {
  const { day: rawDay } = use(params);
  const dayNum = parseInt(rawDay, 10);
  const { user, logout, markDayComplete } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const challenge = getChallengeForDay(dayNum);
  const [tab, setTab] = useState<TabId>('problem');
  const [code, setCode] = useState(challenge.starterCode);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<(boolean|null)[]>([null,null,null]);

  const [ghUrl, setGhUrl] = useState('');
  const [ghState, setGhState] = useState<VerifyState>('idle');
  const [ghMsg, setGhMsg] = useState('');

  const [liUrl, setLiUrl] = useState('');
  const [liState, setLiState] = useState<VerifyState>('idle');
  const [liMsg, setLiMsg] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const runCode = useCallback(() => {
    setRunning(true);
    setOutput('Running against test cases...');
    setTimeout(() => {
      const { passed, feedback } = challenge.solution_check(code);
      setResults(passed);
      setOutput(feedback);
      setRunning(false);
    }, 900);
  }, [code, challenge]);

  const handleGhVerify = useCallback(async () => {
    setGhState('checking'); setGhMsg('Querying GitHub API...');
    const r = await verifyGitHub(ghUrl, user.githubUsername);
    setGhState(r.ok ? 'success' : 'error'); setGhMsg(r.msg);
  }, [ghUrl, user.githubUsername]);

  const handleLiVerify = useCallback(() => {
    setLiState('checking'); setLiMsg('Validating LinkedIn post URL...');
    setTimeout(() => {
      const r = verifyLinkedIn(liUrl);
      setLiState(r.ok ? 'success' : 'error'); setLiMsg(r.msg);
    }, 700);
  }, [liUrl]);

  const canSubmit = ghState === 'success' && liState === 'success';

  const handleFinalSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      markDayComplete(dayNum, ghUrl, liUrl);
      setSubmitted(true);
      setSubmitting(false);
      confetti();
    }, 1200);
  };

  // Guests can preview challenges, but only logged-in users can submit proof
  const previewMode = !user.isLoggedIn;

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <PartyPopperIcon size={56} color="var(--violet-light)" />
          </div>
          <h1 style={{ fontSize: '26px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Day {dayNum} Complete!</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.7, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            Your streak is alive! <FlameIcon size={16} color="var(--amber)" /> Proof verified and recorded.
          </p>
          <Link href="/dashboard" className="btn btn-primary btn-lg" style={{ justifyContent: 'center', textDecoration: 'none' }}>
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Preview banner for guests */}
      {previewMode && (
        <div style={{ background: 'rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.3)', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--violet-light)', fontWeight: 600 }}>Preview Mode &mdash; you&apos;re viewing this challenge as a guest.</span>
          <Link href="/signup" style={{ background: 'var(--violet)', border: 'none', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: 600, color: '#fff', textDecoration: 'none' }}>Enroll Free</Link>
        </div>
      )}
      {/* ---- NAV ---- */}
      <nav className="navbar">
        <div className="navbar-inner" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <span className="badge badge-violet">Day {dayNum}/60</span>
            <span className={`badge badge-${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
            {previewMode ? (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>Sign in</Link>
                <Link href="/signup" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Enroll</Link>
              </>
            ) : (
              <button
                onClick={() => { logout(); router.push('/'); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '4px 10px', borderRadius: '8px',
                  background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)',
                  color: '#FDA4AF', fontSize: '11px', fontWeight: 700,
                  cursor: 'pointer',
                }}
                title="Logout"
              >
                <LogOutIcon size={12} color="#FDA4AF" /> Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          {challenge.title}
        </h1>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {challenge.tags.map(t => <span key={t} className="badge badge-cyan">{t}</span>)}
        </div>

        {/* ---- Main Tabs ---- */}
        <div className="tabs" style={{ marginBottom: '18px' }}>
          <button className={`tab ${tab==='problem' ? 'active' : ''}`} onClick={() => setTab('problem')} style={{ gap: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileTextIcon size={14} /> Problem
          </button>
          <button className={`tab ${tab==='code' ? 'active' : ''}`} onClick={() => setTab('code')} style={{ gap: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <TerminalIcon size={14} /> Playground
          </button>
          <button className={`tab ${tab==='submit' ? 'active' : ''}`} onClick={() => setTab('submit')} style={{ gap: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircleIcon size={14} /> Submit{ghState==='success' && liState==='success' ? ' ●' : ''}
          </button>
        </div>

        {/* ======== PROBLEM ======== */}
        {tab === 'problem' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="glass-card" style={{ padding: '18px' }}>
              <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>{challenge.description}</p>
            </div>

            <div className="glass-card" style={{ padding: '18px' }}>
              <h4 style={{ fontSize: '13px', fontFamily: 'var(--font-display)', color: 'var(--violet-light)', marginBottom: '12px' }}>Examples</h4>
              {challenge.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: '12px', padding: '10px', background: 'var(--code-bg)', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  <div style={{ color: '#94A3B8', marginBottom: '4px' }}>Input: <span style={{ color: '#E2E8F0' }}>{ex.input}</span></div>
                  <div style={{ color: '#94A3B8', marginBottom: ex.explanation ? '4px' : 0 }}>Output: <span style={{ color: '#6EE7B7' }}>{ex.output}</span></div>
                  {ex.explanation && <div style={{ color: '#64748B' }}>// {ex.explanation}</div>}
                </div>
              ))}
            </div>

            <div className="glass-card" style={{ padding: '18px', borderColor: 'rgba(245,158,11,0.15)', background: 'rgba(245,158,11,0.04)' }}>
              <h4 style={{ fontSize: '13px', fontFamily: 'var(--font-display)', color: 'var(--amber)', marginBottom: '10px' }}>Constraints</h4>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {challenge.constraints.map((c, i) => (
                  <li key={i} style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{c}</li>
                ))}
              </ul>
            </div>

            <button className="btn btn-primary w-full" onClick={() => setTab('code')} style={{ justifyContent: 'center', gap: '6px' }}>
              Open Playground <ArrowRightIcon size={14} />
            </button>
          </div>
        )}

        {/* ======== CODE PLAYGROUND ======== */}
        {tab === 'code' && (
          <div>
            <div className="code-editor-wrapper" style={{ marginBottom: '12px' }}>
              <div className="code-editor-header">
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>solution.py</span>
                <span style={{ fontSize: '11px', color: 'var(--violet-light)', fontWeight: 600 }}>Python 3</span>
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                style={{
                  width: '100%', minHeight: '260px', padding: '14px',
                  background: 'var(--code-bg)', border: 'none',
                  color: 'var(--code-text)', fontFamily: 'var(--font-mono)',
                  fontSize: '13px', lineHeight: 1.7, resize: 'vertical', outline: 'none',
                }}
                onKeyDown={e => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const s = e.currentTarget.selectionStart;
                    const newCode = code.slice(0, s) + '    ' + code.slice(e.currentTarget.selectionEnd);
                    setCode(newCode);
                    setTimeout(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = s + 4; }, 0);
                  }
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button className="btn btn-primary" onClick={runCode} disabled={running} style={{ flex: 1, justifyContent: 'center', gap: '6px' }}>
                {running ? <><div className="spinner" /> Running...</> : <><ZapIcon size={14} /> Run &amp; Test</>}
              </button>
              <button className="btn btn-secondary" onClick={() => setCode(challenge.starterCode)} title="Reset to starter">Reset</button>
            </div>

            {output && (
              <div className="code-editor-wrapper" style={{ marginBottom: '14px' }}>
                <div className="code-editor-header">
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Output</span>
                  <button onClick={() => setOutput('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px' }}>✕</button>
                </div>
                <pre className="code-output">{output}</pre>
              </div>
            )}

            {/* Test case results */}
            <div className="glass-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '13px', fontFamily: 'var(--font-display)' }}>Test Cases</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {results.filter(r => r === true).length}/{results.length} passing
                </span>
              </div>
              {challenge.examples.map((ex, i) => (
                <div key={i} style={{
                  padding: '10px 12px', borderRadius: '10px', marginBottom: '6px',
                  background: results[i] === null ? 'var(--bg-card)' : results[i] ? 'var(--emerald-dim)' : 'var(--rose-dim)',
                  border: `1px solid ${results[i] === null ? 'var(--border-subtle)' : results[i] ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.input}</span>
                    <span>
                      {results[i] === null ? <ClockIcon size={14} color="var(--text-muted)" /> : results[i] ? <CheckCircleIcon size={14} color="var(--emerald)" /> : <XCircleIcon size={14} color="var(--rose)" />}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>
                    Expected: {ex.output}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======== SUBMIT ======== */}
        {tab === 'submit' && (
          previewMode ? (
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <LockIcon size={32} color="var(--violet-light)" />
              </div>
              <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Submission locked</h3>
              <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Sign in to submit your proof of work (GitHub + LinkedIn) and build your streak.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/signup" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>Enroll Free</Link>
                <Link href="/login" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>Sign In</Link>
              </div>
            </div>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Step indicators */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[
                { l: 'GitHub', done: ghState==='success', IconComp: GithubIcon },
                { l: 'LinkedIn', done: liState==='success', IconComp: LinkedinIcon },
                { l: 'Submit', done: submitted, IconComp: RocketIcon },
              ].map((s, i) => (
                <React.Fragment key={s.l}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', margin: '0 auto 4px', background: s.done ? 'var(--emerald-dim)' : 'var(--bg-card)', border: `2px solid ${s.done ? 'var(--emerald)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                      {s.done ? <CheckIcon size={16} color="var(--emerald)" /> : <s.IconComp size={16} color="var(--text-muted)" />}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: s.done ? 'var(--emerald)' : 'var(--text-muted)' }}>{s.l}</div>
                  </div>
                  {i < 2 && <div style={{ flex: '0 0 20px', height: '2px', background: s.done ? 'var(--emerald)' : 'var(--border-subtle)', borderRadius: '999px', marginBottom: '16px', transition: 'background 0.5s' }} />}
                </React.Fragment>
              ))}
            </div>

            {/* GitHub */}
            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <GithubIcon size={16} color="var(--violet-light)" />
                <h4 style={{ fontSize: '13px', fontFamily: 'var(--font-display)' }}>
                  GitHub Repository <span style={{ fontSize: '11px', color: 'var(--rose)', fontWeight: 400 }}>&mdash; must have README.md</span>
                </h4>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.5 }}>
                Push your solution to a public repo. The repo must include a README.md describing your Day {dayNum} solution.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className={`input ${ghState === 'success' ? 'input-success' : ghState === 'error' ? 'input-error' : ''}`}
                  placeholder={`https://github.com/${(user.githubUsername || '').replace(/^https?:\/\/github\.com\//i, '').replace(/^@/, '').replace(/\/$/, '') || 'username'}/abtalks-challenge`}
                  value={ghUrl} onChange={e => { setGhUrl(e.target.value); setGhState('idle'); }}
                  onKeyDown={e => e.key === 'Enter' && handleGhVerify()}
                />
                <button className="btn btn-primary btn-sm" onClick={handleGhVerify} disabled={!ghUrl || ghState==='checking'} style={{ flexShrink: 0 }}>
                  {ghState === 'checking' ? <div className="spinner" /> : 'Verify'}
                </button>
              </div>
              {ghMsg && <div className={`verify-status verify-status-${ghState}`}>{ghMsg}</div>}
            </div>

            {/* LinkedIn */}
            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <LinkedinIcon size={16} color="var(--cyan-light)" />
                <h4 style={{ fontSize: '13px', fontFamily: 'var(--font-display)' }}>
                  LinkedIn Post URL
                </h4>
              </div>

              {/* Template to copy */}
              <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border-medium)', borderRadius: '10px', padding: '12px', marginBottom: '10px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--violet-light)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CopyIcon size={10} /> Post Template
                  </span>
                  <button onClick={() => navigator.clipboard.writeText(`Day ${dayNum}/60 #ABTalks SE Challenge\n\nToday I solved: ${challenge.title}\n\nKey insight: [your learning here]\n\nGitHub: [your repo link]\n\n#60DaysChallenge #ABTalks #Python #BuildInPublic`)}
                    style={{ fontSize: '10px', color: 'var(--violet-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Copy</button>
                </div>
                <pre style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
{`Day ${dayNum}/60 #ABTalks SE Challenge

Today I solved: ${challenge.title}

Key insight: [your learning here]

GitHub: [your repo link]

#60DaysChallenge #ABTalks #Python #BuildInPublic`}
                </pre>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input className={`input ${liState === 'success' ? 'input-success' : liState === 'error' ? 'input-error' : ''}`}
                  placeholder="https://linkedin.com/posts/username_..."
                  value={liUrl} onChange={e => { setLiUrl(e.target.value); setLiState('idle'); }}
                  onKeyDown={e => e.key === 'Enter' && handleLiVerify()}
                />
                <button className="btn btn-primary btn-sm" onClick={handleLiVerify} disabled={!liUrl || liState==='checking'} style={{ flexShrink: 0 }}>
                  {liState === 'checking' ? <div className="spinner" /> : 'Verify'}
                </button>
              </div>
              {liMsg && <div className={`verify-status verify-status-${liState}`}>{liMsg}</div>}
            </div>

            {/* Final Submit */}
            <div className="glass-card" style={{ padding: '18px', borderColor: canSubmit ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)', background: canSubmit ? 'rgba(16,185,129,0.04)' : 'var(--bg-card)', transition: 'all 0.4s' }}>
              <h4 style={{ fontSize: '14px', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>Ready to submit?</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                {[{l:'GitHub repo verified',done:ghState==='success'},{l:'LinkedIn post verified',done:liState==='success'}].map(item => (
                  <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, background: item.done ? 'var(--emerald)' : 'var(--bg-card)', border: `1px solid ${item.done ? 'var(--emerald)' : 'var(--border-medium)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: item.done ? '#fff' : 'var(--text-muted)', fontWeight: 700 }}>
                      {item.done ? <CheckIcon size={10} color="#fff" /> : '○'}
                    </div>
                    <span style={{ color: item.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{item.l}</span>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary w-full"
                disabled={!canSubmit || submitting}
                onClick={handleFinalSubmit}
                style={{ justifyContent: 'center', opacity: canSubmit ? 1 : 0.45, cursor: canSubmit ? 'pointer' : 'not-allowed', gap: '6px' }}
              >
                {submitting ? <><div className="spinner" />Submitting...</> : canSubmit ? <><RocketIcon size={16} /> Submit Day {dayNum}</> : 'Complete verifications first'}
              </button>
            </div>
          </div>
          )
        )}
      </div>

      {/* Mobile nav */}
      <nav className="mobile-nav">
        {[
          { IconComp: HomeIcon, label: 'Home',  href: '/dashboard' },
          { IconComp: ZapIcon, label: 'Today', href: `/day/${dayNum}` },
          { IconComp: FileTextIcon, label: 'Task',  href: '#', action: () => setTab('problem') },
          { IconComp: TerminalIcon, label: 'Code',  href: '#', action: () => setTab('code') },
        ].map(item => (
          item.action
            ? <button key={item.label} onClick={item.action} className="mobile-nav-item" style={{ background: 'none', border: 'none' }}>
                <item.IconComp size={18} /><span>{item.label}</span>
              </button>
            : <Link key={item.label} href={item.href} className="mobile-nav-item">
                <item.IconComp size={18} /><span>{item.label}</span>
              </Link>
        ))}
      </nav>
    </div>
  );
}
