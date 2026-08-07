'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

/* ---- Onboarding Tour ---- */
const STEPS = [
  { id: 'streak-hero', title: '🔥 Your Streak', desc: 'Your streak grows every day you submit proof of work. Miss a day? Use a Shield!' },
  { id: 'today-task',  title: '⚡ Today\'s Challenge', desc: 'Your active challenge task. Click "Start Challenge" to open the code playground.' },
  { id: 'progress-map', title: '📅 60-Day Grid', desc: 'All 60 days at a glance. Purple = today, green = done, amber = late, red = missed.' },
  { id: 'leaderboard', title: '🏆 Leaderboard', desc: 'See where you rank among all builders in your batch.' },
];

function Tour({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.getElementById(STEPS[step].id);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); setRect(el.getBoundingClientRect()); }
  }, [step]);

  if (!rect) return null;
  const cur = STEPS[step];
  const pad = 8;
  const tipTop = cur.id === 'progress-map' || cur.id === 'leaderboard'
    ? Math.max(10, rect.top - 175)
    : Math.min(window.innerHeight - 185, rect.bottom + 14);
  const tipLeft = Math.max(10, Math.min(window.innerWidth - 296, rect.left));

  return (
    <>
      {/* Backdrop with hole */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 9997, pointerEvents: 'none', background: 'rgba(0,0,0,0)' }} />
      <div className="tour-highlight" style={{ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }} />
      <div className="tour-tooltip" style={{ top: tipTop, left: tipLeft }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h4 style={{ fontSize: '14px', fontFamily: 'var(--font-display)' }}>{cur.title}</h4>
          <button onClick={onDone} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px', padding: '2px 6px', borderRadius: '6px' }}>Skip</button>
        </div>
        <p style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '14px' }}>{cur.desc}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{step + 1} / {STEPS.length}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {step > 0 && <button className="btn btn-ghost btn-sm" onClick={() => setStep(s => s - 1)}>← Back</button>}
            {step < STEPS.length - 1
              ? <button className="btn btn-primary btn-sm" onClick={() => setStep(s => s + 1)}>Next →</button>
              : <button className="btn btn-primary btn-sm" onClick={onDone}>Finish 🎉</button>
            }
          </div>
        </div>
      </div>
    </>
  );
}

/* ---- Shield Modal ---- */
function ShieldModal({ missedDays, onUse, onClose }: { missedDays: number[]; onUse: (day: number) => void; onClose: () => void }) {
  const [selected, setSelected] = useState(missedDays[0]);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card" style={{ padding: '28px', maxWidth: '340px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '44px', marginBottom: '12px' }}>🛡️</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '8px' }}>Use a Streak Shield</h3>
        <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '20px' }}>
          A shield will mark a missed day as completed and preserve your streak.
        </p>
        {missedDays.length > 1 && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Select missed day to cover:</label>
            <select
              value={selected}
              onChange={e => setSelected(Number(e.target.value))}
              style={{ width: '100%', padding: '10px 14px', background: 'var(--input-bg)', border: '1px solid var(--border-medium)', borderRadius: '10px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', outline: 'none' }}
            >
              {missedDays.map(d => <option key={d} value={d}>Day {d}</option>)}
            </select>
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary w-full" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary w-full" onClick={() => onUse(selected)} style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}>
            🛡️ Use Shield
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Toast ---- */
function Toast({ msg }: { msg: string }) {
  return <div className="toast">{msg}</div>;
}

/* ---- Main Dashboard ---- */
export default function Dashboard() {
  const { user, logout, useShield } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [showTour, setShowTour] = useState(false);
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [toast, setToast] = useState('');
  const [activeNav, setActiveNav] = useState('home');

  // Redirect if not logged in
  useEffect(() => {
    if (!user.isLoggedIn) router.push('/login');
  }, [user.isLoggedIn, router]);

  // Onboarding
  useEffect(() => {
    if (!user.isLoggedIn) return;
    const seen = localStorage.getItem('abtalks-tour-v4');
    if (!seen) setTimeout(() => setShowTour(true), 500);
  }, [user.isLoggedIn]);

  const finishTour = () => { setShowTour(false); localStorage.setItem('abtalks-tour-v4', '1'); };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleUseShield = (day: number) => {
    const ok = useShield(day);
    setShowShieldModal(false);
    if (ok) showToast('🛡️ Shield used! Day ' + day + ' is now covered.');
  };

  const handleLogout = () => { logout(); router.push('/'); };

  if (!user.isLoggedIn) return null;

  const days = user.days;
  const missedDays = days.filter(d => d.status === 'missed').map(d => d.day);
  const completion = Math.round((user.daysCompleted / 60) * 100);

  const currentTask = days.find(d => d.status === 'today');
  const taskDay = currentTask?.day ?? user.currentDay;

  // Day tile colours
  const tileClass = (status: string) => {
    switch (status) {
      case 'completed':      return 'day-tile-completed';
      case 'completed-late': return 'day-tile-completed-late';
      case 'missed':         return 'day-tile-missed';
      case 'today':          return 'day-tile-today';
      default:               return 'day-tile-future';
    }
  };

  const trackLabels: Record<string, string> = { SE: 'Software Engineering', DS: 'Data Science', AI: 'AI Engineering' };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
      {showTour && <Tour onDone={finishTour} />}
      {showShieldModal && <ShieldModal missedDays={missedDays.length > 0 ? missedDays : [user.currentDay - 1]} onUse={handleUseShield} onClose={() => setShowShieldModal(false)} />}
      {toast && <Toast msg={toast} />}

      {/* ---- NAV ---- */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">AB<span>Talks</span></Link>
          <div className="navbar-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme}>{theme === 'dark' ? '☀️' : '🌙'}</button>
            {user.streakShields > 0 && (
              <button
                className="streak-shield"
                onClick={() => setShowShieldModal(true)}
                title="Use streak shield"
              >
                🛡️ {user.streakShields}
              </button>
            )}
            {/* Avatar + logout */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '34px', height: '34px', borderRadius: '50%', border: '2px solid var(--violet)',
                  background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '13px', color: '#fff', cursor: 'pointer',
                }}
                title="Logout"
              >
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ padding: '20px' }}>

        {/* ---- Welcome header ---- */}
        <div style={{ marginBottom: '18px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>Good evening 🌙</p>
          <h1 style={{ fontSize: '20px', fontFamily: 'var(--font-display)' }}>Hey, {user.name.split(' ')[0]} 👋</h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{user.username}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⌥ {user.githubUsername}</span>
            <span className="badge badge-violet" style={{ fontSize: '10px' }}>{user.track} Track</span>
          </div>
        </div>

        {/* ---- Missed day alert ---- */}
        {missedDays.length > 0 && (
          <div className="glass-card" style={{ padding: '16px 18px', marginBottom: '14px', borderColor: 'rgba(244,63,94,0.25)', background: 'rgba(244,63,94,0.06)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '22px' }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#FDA4AF', marginBottom: '3px' }}>
                  You missed {missedDays.length === 1 ? `Day ${missedDays[0]}` : `${missedDays.length} days`}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  You have <strong style={{ color: 'var(--amber)' }}>{user.streakShields} shield{user.streakShields !== 1 ? 's' : ''}</strong> — use one to recover your streak.
                </div>
              </div>
              {user.streakShields > 0 && (
                <button className="streak-shield btn-sm" onClick={() => setShowShieldModal(true)}>
                  🛡️ Use Shield
                </button>
              )}
            </div>
          </div>
        )}

        {/* ---- STREAK HERO ---- */}
        <div id="streak-hero" className="glass-card" style={{
          padding: '22px', marginBottom: '14px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))',
          borderColor: 'rgba(124,58,237,0.25)',
        }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Current Streak</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                <span className="animate-streak" style={{ fontSize: '28px', lineHeight: 1 }}>🔥</span>
                <span style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1, background: 'linear-gradient(135deg,#F97316,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {user.streak}
                </span>
                <span style={{ fontSize: '16px', color: 'var(--text-muted)', alignSelf: 'flex-end', paddingBottom: '8px' }}>days</span>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                {[{ v: user.longestStreak, l: 'BEST' }, { v: user.daysCompleted, l: 'DONE' }, { v: 60 - user.daysCompleted, l: 'LEFT' }].map(({ v, l }) => (
                  <div key={l}>
                    <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{v}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Progress ring */}
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="var(--border-subtle)" strokeWidth="5" />
              <circle cx="36" cy="36" r="30" fill="none"
                stroke="url(#pg)" strokeWidth="5"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30 * (1 - completion / 100)}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
              />
              <defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#06B6D4" />
              </linearGradient></defs>
              <text x="36" y="40" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="700" fontFamily="var(--font-display)">{completion}%</text>
            </svg>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: '14px' }}>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${completion}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>Day 1</span><span>Day 60</span>
            </div>
          </div>
        </div>

        {/* ---- STATS ROW ---- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '14px' }}>
          {[
            { icon: '📅', val: `${taskDay}/60`, lbl: 'Day' },
            { icon: '⚙️', val: user.track, lbl: 'Track' },
            { icon: '🏅', val: `#${user.daysCompleted > 0 ? Math.max(1, 100 - user.daysCompleted) : '—'}`, lbl: 'Rank est.' },
            { icon: '👥', val: user.referrals, lbl: 'Refs' },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '3px' }}>{s.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{s.val}</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* ---- TODAY'S TASK ---- */}
        <div id="today-task" className="glass-card" style={{ padding: '20px', marginBottom: '14px', borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: 'var(--violet-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              📌 Active Challenge · Day {taskDay}
            </p>
            <span className="badge badge-hard">Hard</span>
          </div>
          <h2 style={{ fontSize: '17px', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Build a CLI Task Manager</h2>
          <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Build a command-line task management app with CRUD operations, persisted to a JSON file.
          </p>
          <Link href={`/day/${taskDay}`} className="btn btn-primary w-full" style={{ justifyContent: 'center', textDecoration: 'none' }}>
            ⚡ Start Day {taskDay} Challenge →
          </Link>
        </div>

        {/* ---- PROGRESS MAP ---- */}
        <div id="progress-map" className="glass-card" style={{ padding: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-display)' }}>60-Day Progress Map</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Day {taskDay} of 60</span>
          </div>
          <div className="day-grid">
            {days.map(d => (
              <Link key={d.day} href={`/day/${d.day}`} className={`day-tile ${tileClass(d.status)}`} title={`Day ${d.day}`} />
            ))}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
            {[['var(--emerald)','Done'],['var(--amber)','Late'],['var(--rose)','Missed'],['var(--violet)','Today'],['var(--border-subtle)','Future']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: c, flexShrink: 0 }} />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---- BADGES ---- */}
        <div className="glass-card" style={{ padding: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-display)' }}>🏅 Achievements & Badges</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.badges.filter(b => b.earned).length}/{user.badges.length} earned</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px' }}>
            {user.badges.map(badge => (
              <div key={badge.id} style={{ textAlign: 'center', opacity: badge.earned ? 1 : 0.3 }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', margin: '0 auto 5px',
                  background: badge.earned ? 'var(--violet-dim)' : 'var(--bg-card)',
                  border: `1px solid ${badge.earned ? 'rgba(124,58,237,0.3)' : 'var(--border-subtle)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                  transition: 'all 0.3s',
                }}>{badge.icon}</div>
                <div style={{ fontSize: '9px', fontWeight: 600, color: badge.earned ? 'var(--text-secondary)' : 'var(--text-disabled)', lineHeight: 1.3 }}>{badge.label}</div>
                {badge.shieldReward && badge.earned && (
                  <div style={{ fontSize: '8px', color: 'var(--amber)', marginTop: '2px' }}>+1 🛡️</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---- LEADERBOARD ---- */}
        <div id="leaderboard" className="glass-card" style={{ padding: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-display)' }}>🏆 Leaderboard</h3>
            <span className="badge badge-violet" style={{ fontSize: '10px' }}>Batch 4</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { rank: 1, name: 'Priya Sharma', college: 'IIT Delhi', streak: user.daysCompleted + 2, isYou: false },
              { rank: 2, name: 'Arjun Mehta', college: 'NIT Trichy', streak: user.daysCompleted + 1, isYou: false },
              { rank: 3, name: user.name, college: user.college, streak: user.streak, isYou: true },
              { rank: 4, name: 'Sneha Patel', college: 'BITS Pilani', streak: Math.max(0, user.streak - 1), isYou: false },
              { rank: 5, name: 'Rohan Singh', college: 'VIT Vellore', streak: Math.max(0, user.streak - 2), isYou: false },
            ].map(p => (
              <div key={p.rank} className={`leaderboard-item ${p.isYou ? 'is-you' : ''}`}>
                <div className={`rank-badge rank-${p.rank <= 3 ? p.rank : 'other'}`}>{p.rank}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{p.name}</span>
                    {p.isYou && <span className="badge badge-violet" style={{ fontSize: '9px', padding: '2px 6px' }}>You</span>}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{p.college}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--amber)' }}>🔥 {p.streak}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- REFERRAL ---- */}
        <div className="glass-card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>👥 Refer & Earn Shields</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            Invite friends with your code. Each successful referral earns you 1 extra streak shield!
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '10px', padding: '10px 14px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'var(--violet-light)', letterSpacing: '0.1em', flex: 1 }}>{user.referralCode}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => { navigator.clipboard.writeText(user.referralCode); showToast('✓ Referral code copied!'); }}>Copy</button>
          </div>
        </div>
      </div>

      {/* ---- MOBILE NAV ---- */}
      <nav className="mobile-nav">
        {[
          { id: 'home', icon: '🏠', label: 'Home',    href: '/dashboard' },
          { id: 'day',  icon: '⚡', label: 'Today',   href: `/day/${taskDay}` },
          { id: 'rank', icon: '🏆', label: 'Rank',    href: '/dashboard' },
          { id: 'out',  icon: '🚪', label: 'Logout',  href: '#' },
        ].map(item => (
          item.id === 'out'
            ? <button key="out" className="mobile-nav-item" onClick={handleLogout} style={{ background: 'none', border: 'none' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            : <Link key={item.id} href={item.href} className={`mobile-nav-item ${activeNav === item.id ? 'active' : ''}`} onClick={() => setActiveNav(item.id)}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
        ))}
      </nav>
    </div>
  );
}
