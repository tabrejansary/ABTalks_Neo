'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  FlameIcon,
  ShieldIcon,
  ZapIcon,
  ClockIcon,
  CopyIcon,
  CheckIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
  LogOutIcon,
  BriefcaseIcon,
  ThumbsUpIcon,
  CalendarIcon,
  CodeIcon,
  TrophyIcon,
  UsersIcon,
  PinIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  HomeIcon,
  MedalIcon,
  StarIcon,
  CheckCircleIcon,
} from '@/app/icons';

/* ---- Helper: Convert Challenge Day (1..60) to Date ---- */
function dayToDate(day: number): { dateStr: string; monthName: string; dayNum: number; dayOfWeek: string } {
  // Start batch on Aug 8, 2026
  const start = new Date(2026, 7, 8); // Month index 7 = August
  const d = new Date(start);
  d.setDate(start.getDate() + (day - 1));
  const monthName = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const dayOfWeek = d.toLocaleString('en-US', { weekday: 'short' });
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return { dateStr, monthName, dayNum: d.getDate(), dayOfWeek };
}

/* ---- Onboarding Tour ---- */
const STEPS = [
  { id: 'streak-hero', title: 'Your Streak', desc: 'Your streak grows every day you submit proof of work. Miss a day? Use a Shield!' },
  { id: 'today-task',  title: 'Today\'s Challenge', desc: 'Your active challenge task. Click "Start Challenge" to open the code playground.' },
  { id: 'progress-map', title: '60-Day Grid', desc: 'All 60 days at a glance. Purple = today, green = done, amber = late, red = missed.' },
  { id: 'leaderboard', title: 'Leaderboard', desc: 'See where you rank among all builders in your batch.' },
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
            {step > 0 && <button className="btn btn-ghost btn-sm" onClick={() => setStep(s => s - 1)}>&larr; Back</button>}
            {step < STEPS.length - 1
              ? <button className="btn btn-primary btn-sm" onClick={() => setStep(s => s + 1)}>Next &rarr;</button>
              : <button className="btn btn-primary btn-sm" onClick={onDone}>Finish</button>
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
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <ShieldIcon size={44} color="var(--amber)" />
        </div>
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
          <button className="btn btn-primary w-full" onClick={() => onUse(selected)} style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)', gap: '6px' }}>
            <ShieldIcon size={16} /> Use Shield
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

/* ---- Challenge Countdown Timer ---- */
function ChallengeCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, total: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // next midnight
      const diff = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
      setTimeLeft({
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
        total: diff,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pct = timeLeft.total / (24 * 3600); // fraction of day remaining
  const color = pct > 0.25 ? 'var(--emerald)' : pct > 0.1 ? 'var(--amber)' : 'var(--rose)';
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', borderRadius: '12px', marginBottom: '14px',
      background: 'var(--bg-card)', border: `1px solid ${color}44`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ClockIcon size={18} color={color} />
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Next challenge unlocks in</div>
          <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', color, letterSpacing: '0.05em', lineHeight: 1.2 }}>
            {pad(timeLeft.h)}<span style={{ fontSize: '12px', opacity: 0.7 }}>h </span>
            {pad(timeLeft.m)}<span style={{ fontSize: '12px', opacity: 0.7 }}>m </span>
            {pad(timeLeft.s)}<span style={{ fontSize: '12px', opacity: 0.7 }}>s</span>
          </div>
        </div>
      </div>
      <div style={{ width: '60px' }}>
        <div style={{ height: '4px', borderRadius: '2px', background: 'var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '2px', background: color, width: `${pct * 100}%`, transition: 'width 1s linear, background 1s' }} />
        </div>
        <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>midnight</div>
      </div>
    </div>
  );
}

/* ---- Profile Modal ---- */
function ProfileModal({
  user,
  theme,
  toggleTheme,
  onLogout,
  onClose,
  showToast,
  currentDay,
}: {
  user: any;
  theme: string;
  toggleTheme: () => void;
  onLogout: () => void;
  onClose: () => void;
  showToast: (msg: string) => void;
  currentDay: number;
}) {
  const [copied, setCopied] = useState(false);
  const copyPass = () => {
    navigator.clipboard.writeText(user.passphrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Passphrase copied to clipboard!');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card" style={{ padding: '24px', maxWidth: '420px', width: '100%', borderRadius: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <CloseIcon size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '22px', color: '#fff', fontFamily: 'var(--font-display)',
            boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
          }}>
            {user.name ? user.name[0].toUpperCase() : 'K'}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{user.name || 'Student User'}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</p>
            <span style={{ fontSize: '11px', color: 'var(--violet-light)', fontWeight: 600 }}>@{user.username}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Active Track</span>
            <select
              value={user.track}
              onChange={e => {
                const newTrack = e.target.value;
                user.track = newTrack;
                localStorage.setItem('abtalks-user-v4', JSON.stringify({ ...user, track: newTrack }));
                window.location.reload();
              }}
              style={{
                background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '8px', padding: '4px 8px', color: 'var(--emerald)',
                fontSize: '11px', fontWeight: 700, outline: 'none', cursor: 'pointer',
              }}
            >
              <option value="SE" style={{ background: '#0F172A', color: '#fff' }}>Software Engineering</option>
              <option value="DS" style={{ background: '#0F172A', color: '#fff' }}>Data Science</option>
              <option value="AI" style={{ background: '#0F172A', color: '#fff' }}>AI Engineering</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>GitHub</span>
            <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{user.githubUsername || 'Not connected'}</span>
          </div>

          <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Secret Passphrase</span>
              <button onClick={copyPass} style={{ background: 'none', border: 'none', color: 'var(--violet-light)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {copied ? <><CheckIcon size={12} /> Copied</> : <><CopyIcon size={12} /> Copy</>}
              </button>
            </div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--amber)', fontWeight: 600, wordBreak: 'break-all' }}>
              {user.passphrase || 'amber-842-blaze-99-cedar'}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Theme Mode</span>
            <button className="btn btn-secondary btn-sm" onClick={toggleTheme} style={{ gap: '6px' }}>
              {theme === 'dark' ? <><SunIcon size={14} /> Switch to Light</> : <><MoonIcon size={14} /> Switch to Dark</>}
            </button>
          </div>

          <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>Route Map Links</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/" onClick={onClose} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '11px' }}>/ Home</Link>
              <Link href="/dashboard" onClick={onClose} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '11px' }}>/dashboard</Link>
              <Link href={`/day/${currentDay}`} onClick={onClose} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '11px' }}>/day/{currentDay}</Link>
            </div>
          </div>
        </div>

        <button
          className="btn w-full"
          onClick={onLogout}
          style={{
            background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)',
            color: '#FDA4AF', fontWeight: 700, justifyContent: 'center', borderRadius: '12px', padding: '12px', gap: '8px',
          }}
        >
          <LogOutIcon size={16} color="#FDA4AF" /> Logout from Account
        </button>
      </div>
    </div>
  );
}

/* ---- Badge Icon Renderer ---- */
function BadgeIcon({ icon, earned }: { icon: string; earned: boolean }) {
  const color = earned ? 'var(--violet-light)' : 'var(--text-muted)';
  switch (icon) {
    case '🔥': return <FlameIcon size={20} color={earned ? 'var(--amber)' : color} />;
    case '⚡': return <ZapIcon size={20} color={earned ? 'var(--cyan-light)' : color} />;
    case '🛡️': return <ShieldIcon size={20} color={earned ? 'var(--amber)' : color} />;
    case '🌟': return <StarIcon size={20} color={earned ? 'var(--amber)' : color} fill={earned ? 'var(--amber)' : 'none'} />;
    case '🏆': return <TrophyIcon size={20} color={earned ? 'var(--violet-light)' : color} />;
    default:   return <MedalIcon size={20} color={color} />;
  }
}

/* ---- STREAK & PROGRESS HEATMAP MATRIX ---- */
function ProgressMapMatrix({ days, taskDay }: { days: any[]; taskDay: number }) {
  const [selectedMonth, setSelectedMonth] = useState<'ALL' | 'AUG' | 'SEP' | 'OCT'>('ALL');
  const [hoveredDay, setHoveredDay] = useState<any | null>(null);

  const tileClass = (status: string) => {
    switch (status) {
      case 'completed':      return 'day-tile-completed';
      case 'completed-late': return 'day-tile-completed-late';
      case 'missed':         return 'day-tile-missed';
      case 'today':          return 'day-tile-today';
      default:               return 'day-tile-future';
    }
  };

  // Group days by month (Aug, Sep, Oct)
  const monthGroups: { monthName: string; days: any[] }[] = [];
  days.forEach(d => {
    const info = dayToDate(d.day);
    let group = monthGroups.find(g => g.monthName === info.monthName);
    if (!group) {
      group = { monthName: info.monthName, days: [] };
      monthGroups.push(group);
    }
    group.days.push({ ...d, dateInfo: info });
  });

  const visibleGroups = selectedMonth === 'ALL'
    ? monthGroups
    : monthGroups.filter(g => g.monthName === selectedMonth);

  return (
    <div id="progress-map" className="glass-card matrix-card" style={{ padding: '20px', marginBottom: '14px', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      {/* Section Header */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <CalendarIcon size={18} color="var(--violet-light)" />
          <h3 style={{ fontSize: '15px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            60-Day Progress Matrix
          </h3>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Batch 4 &middot; Aug 8 &ndash; Oct 6, 2026
        </p>
      </div>

      {/* Month Filter Tabs (Responsive Grid) */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px',
        background: 'var(--input-bg)', padding: '3px', borderRadius: '10px',
        border: '1px solid var(--border-subtle)', marginBottom: '14px', width: '100%', boxSizing: 'border-box'
      }}>
        {(['ALL', 'AUG', 'SEP', 'OCT'] as const).map(m => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            style={{
              padding: '6px 4px', borderRadius: '7px', fontSize: '11px', fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
              background: selectedMonth === m ? 'var(--violet)' : 'transparent',
              color: selectedMonth === m ? '#fff' : 'var(--text-muted)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {m === 'ALL' ? '60-Day Grid' : m}
          </button>
        ))}
      </div>

      {/* Hover Info Banner */}
      <div style={{
        minHeight: '36px', padding: '8px 12px', borderRadius: '10px',
        background: 'var(--input-bg)', border: '1px solid var(--border-subtle)',
        marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: '12px', flexWrap: 'wrap', gap: '6px', width: '100%', boxSizing: 'border-box'
      }}>
        {hoveredDay ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Day {hoveredDay.day}</span>
              <span style={{ color: 'var(--text-muted)' }}>&middot;</span>
              <span style={{ color: 'var(--violet-light)', fontFamily: 'var(--font-mono)' }}>{dayToDate(hoveredDay.day).dateStr}</span>
            </div>
            <span className={`badge ${hoveredDay.status === 'completed' ? 'badge-emerald' : hoveredDay.status === 'today' ? 'badge-violet' : hoveredDay.status === 'missed' ? 'badge-rose' : 'badge-amber'}`}>
              {hoveredDay.status.toUpperCase()}
            </span>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ZapIcon size={12} color="var(--violet-light)" /> Hover or tap any day to inspect details
          </div>
        )}
      </div>

      {/* Month Heatmap View (Fluid 100% width - Fits All Screens) */}
      <div className="no-scrollbar" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box' }}>
        {visibleGroups.map(group => (
          <div key={group.monthName} style={{ width: '100%' }}>
            {/* Month Header */}
            <div style={{
              fontSize: '11px', fontWeight: 800, fontFamily: 'var(--font-display)',
              color: 'var(--violet-light)', letterSpacing: '0.08em', marginBottom: '6px',
              borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>{group.monthName} 2026</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>{group.days.length} Days</span>
            </div>

            {/* Calendar Grid for Month (7 columns per week, fluid scaling) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', width: '100%', boxSizing: 'border-box' }}>
              {group.days.map(d => (
                <Link
                  key={d.day}
                  href={`/day/${d.day}`}
                  onMouseEnter={() => setHoveredDay(d)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`day-tile ${tileClass(d.status)}`}
                >
                  <span style={{ fontSize: '11px', lineHeight: 1 }}>{d.dateInfo.dayNum}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend Footer */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            ['var(--emerald)', 'Completed'],
            ['var(--amber)', 'Late'],
            ['var(--rose)', 'Missed'],
            ['var(--violet)', 'Today'],
            ['var(--border-subtle)', 'Upcoming'],
          ].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '3px', background: c, flexShrink: 0 }} />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{l}</span>
            </div>
          ))}
        </div>
        <span style={{ fontSize: '9px', color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>ABTalks Verification Engine</span>
      </div>
    </div>
  );
}



/* ---- Main Dashboard ---- */
export default function Dashboard() {
  const { user, logout, useShield } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [showTour, setShowTour] = useState(false);
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
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
    if (ok) showToast('Shield used! Day ' + day + ' is now covered.');
  };

  const handleLogout = () => { logout(); router.push('/'); };

  if (!user.isLoggedIn) return null;

  const days = user.days;
  const missedDays = days.filter(d => d.status === 'missed').map(d => d.day);
  const completion = Math.round((user.daysCompleted / 60) * 100);

  const currentTask = days.find(d => d.status === 'today');
  const taskDay = currentTask?.day ?? user.currentDay;

  return (
    <div style={{ minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'hidden', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
      {showTour && <Tour onDone={finishTour} />}
      {showShieldModal && <ShieldModal missedDays={missedDays.length > 0 ? missedDays : [user.currentDay - 1]} onUse={handleUseShield} onClose={() => setShowShieldModal(false)} />}
      {showProfileModal && (
        <ProfileModal
          user={user}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={handleLogout}
          onClose={() => setShowProfileModal(false)}
          showToast={showToast}
          currentDay={taskDay}
        />
      )}
      {toast && <Toast msg={toast} />}

      {/* ---- CLEAN ABTALKS NAVBAR ---- */}
      <nav className="navbar" style={{ padding: '10px 16px' }}>
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo" style={{ fontSize: '18px', fontWeight: 800 }}>
            AB<span>TALKS</span>
          </Link>

          <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            {/* Jobs Pill — hide on smallest phones */}
            <button
              onClick={() => showToast('Jobs Board: 45+ recruiters hiring challenge finishers!')}
              className="nav-hide-mobile"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '6px 12px', borderRadius: '20px',
                border: '1px solid var(--border-subtle)', background: 'var(--bg-card)',
                fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer',
              }}
            >
              <BriefcaseIcon size={12} color="var(--violet-light)" /> Jobs
            </button>

            {/* Likes / Points Pill — hide on mobile */}
            <div
              className="nav-hide-mobile"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '6px 12px', borderRadius: '20px',
                border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)',
                fontSize: '11px', fontWeight: 700, color: 'var(--violet-light)',
              }}
            >
              <ThumbsUpIcon size={12} color="var(--violet-light)" /> {user.daysCompleted * 10}
            </div>

            {/* Streak Shields Pill */}
            {user.streakShields > 0 && (
              <button
                className="streak-shield"
                onClick={() => setShowShieldModal(true)}
                title="Use streak shield"
                style={{ padding: '6px 10px', fontSize: '11px', gap: '4px' }}
              >
                <ShieldIcon size={12} /> {user.streakShields}
              </button>
            )}

            {/* CLEAN PROFILE TAB BUTTON */}
            <button
              onClick={() => setShowProfileModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '4px 12px 4px 4px', borderRadius: '24px',
                background: 'var(--bg-card)', border: '1px solid var(--border-medium)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              title="Open Profile & Settings"
            >
              <div
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--violet), var(--cyan))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '12px', color: '#fff',
                }}
              >
                {user.name ? user.name[0].toUpperCase() : 'K'}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user.name ? user.name.split(' ')[0] : 'Profile'}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▾</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', width: '100%', boxSizing: 'border-box' }}>

        {/* ---- Welcome header ---- */}
        <div style={{ marginBottom: '18px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>Good evening</p>
          <h1 style={{ fontSize: '20px', fontFamily: 'var(--font-display)' }}>Hey, {user.name.split(' ')[0]}</h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{user.username}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>github: {user.githubUsername}</span>
            <span className="badge badge-violet" style={{ fontSize: '10px' }}>{user.track} Track</span>
          </div>
        </div>

        {/* ---- Missed day alert ---- */}
        {missedDays.length > 0 && (
          <div className="glass-card" style={{ padding: '16px 18px', marginBottom: '14px', borderColor: 'rgba(244,63,94,0.25)', background: 'rgba(244,63,94,0.06)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <AlertTriangleIcon size={22} color="#FDA4AF" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#FDA4AF', marginBottom: '3px' }}>
                  You missed {missedDays.length === 1 ? `Day ${missedDays[0]}` : `${missedDays.length} days`}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  You have <strong style={{ color: 'var(--amber)' }}>{user.streakShields} shield{user.streakShields !== 1 ? 's' : ''}</strong> &mdash; use one to recover your streak.
                </div>
              </div>
              {user.streakShields > 0 && (
                <button className="streak-shield btn-sm" onClick={() => setShowShieldModal(true)} style={{ gap: '4px' }}>
                  <ShieldIcon size={14} /> Use Shield
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
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            Current Streak &amp; Consistency
          </p>
          <div className="streak-hero-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                <FlameIcon size={32} color="var(--amber)" className="animate-streak" />
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
            <div className="streak-progress-ring">
              <svg width="76" height="76" viewBox="0 0 76 76">
                <circle cx="38" cy="38" r="32" fill="none" stroke="var(--border-subtle)" strokeWidth="5" />
                <circle cx="38" cy="38" r="32" fill="none"
                  stroke="url(#pg)" strokeWidth="5"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - completion / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 38 38)"
                  style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
                />
                <defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#06B6D4" />
                </linearGradient></defs>
                <text x="38" y="42" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="700" fontFamily="var(--font-display)">{completion}%</text>
              </svg>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: '16px' }}>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${completion}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
              <span>Aug 8 (Day 1)</span><span>Oct 6 (Day 60)</span>
            </div>
          </div>
        </div>

        {/* ---- STATS ROW (Responsive 2x2 grid on mobile) ---- */}
        <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '14px' }}>
          {[
            { IconComp: CalendarIcon, color: 'var(--violet-light)', val: `${taskDay}/60`, lbl: 'Day' },
            { IconComp: CodeIcon, color: 'var(--cyan-light)', val: user.track, lbl: 'Track' },
            { IconComp: TrophyIcon, color: 'var(--amber)', val: `#${user.daysCompleted > 0 ? Math.max(1, 100 - user.daysCompleted) : '—'}`, lbl: 'Rank est.' },
            { IconComp: UsersIcon, color: 'var(--emerald)', val: user.referrals, lbl: 'Refs' },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <s.IconComp size={18} color={s.color} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{s.val}</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* ---- TODAY'S TASK ---- */}
        <div id="today-task" className="glass-card" style={{ padding: '20px', marginBottom: '14px', borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: 'var(--violet-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <PinIcon size={14} color="var(--violet-light)" /> Active Challenge &middot; Day {taskDay}
            </p>
            <span className="badge badge-hard">Hard</span>
          </div>
          <h2 style={{ fontSize: '17px', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Build a CLI Task Manager</h2>
          <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Build a command-line task management app with CRUD operations, persisted to a JSON file.
          </p>
          <ChallengeCountdown />
          <Link href={`/day/${taskDay}`} className="btn btn-primary w-full" style={{ justifyContent: 'center', textDecoration: 'none', gap: '8px' }}>
            <ZapIcon size={16} /> Start Day {taskDay} Challenge <ArrowRightIcon size={14} />
          </Link>
        </div>

        {/* ---- 60-DAY PROGRESS MATRIX ---- */}
        <ProgressMapMatrix days={days} taskDay={taskDay} />


        {/* ---- BADGES ---- */}
        <div className="glass-card" style={{ padding: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MedalIcon size={16} color="var(--violet-light)" />
              <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-display)' }}>Achievements &amp; Badges</h3>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.badges.filter(b => b.earned).length}/{user.badges.length} earned</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px' }}>
            {user.badges.map(badge => (
              <div key={badge.id} style={{ textAlign: 'center', opacity: badge.earned ? 1 : 0.3 }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', margin: '0 auto 5px',
                  background: badge.earned ? 'var(--violet-dim)' : 'var(--bg-card)',
                  border: `1px solid ${badge.earned ? 'rgba(124,58,237,0.3)' : 'var(--border-subtle)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                }}>
                  <BadgeIcon icon={badge.icon} earned={badge.earned} />
                </div>
                <div style={{ fontSize: '9px', fontWeight: 600, color: badge.earned ? 'var(--text-secondary)' : 'var(--text-disabled)', lineHeight: 1.3 }}>{badge.label}</div>
                {badge.shieldReward && badge.earned && (
                  <div style={{ fontSize: '8px', color: 'var(--amber)', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                    +1 <ShieldIcon size={10} color="var(--amber)" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---- LEADERBOARD ---- */}
        <div id="leaderboard" className="glass-card" style={{ padding: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrophyIcon size={16} color="var(--amber)" />
              <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-display)' }}>Leaderboard</h3>
            </div>
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
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FlameIcon size={14} color="var(--amber)" /> {p.streak}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- REFERRAL ---- */}
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <UsersIcon size={16} color="var(--violet-light)" />
            <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-display)' }}>Refer &amp; Earn Shields</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            Invite friends with your code. Each successful referral earns you 1 extra streak shield!
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '10px', padding: '10px 14px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'var(--violet-light)', letterSpacing: '0.1em', flex: 1 }}>{user.referralCode}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => { navigator.clipboard.writeText(user.referralCode); showToast('Referral code copied!'); }} style={{ gap: '4px' }}>
              <CopyIcon size={12} /> Copy
            </button>
          </div>
        </div>
      </div>

      {/* ---- MOBILE NAV ---- */}
      <nav className="mobile-nav">
        {[
          { id: 'home', IconComp: HomeIcon, label: 'Home',    href: '/dashboard' },
          { id: 'day',  IconComp: ZapIcon, label: 'Today',   href: `/day/${taskDay}` },
          { id: 'rank', IconComp: TrophyIcon, label: 'Rank',    href: '/dashboard' },
          { id: 'out',  IconComp: LogOutIcon, label: 'Logout',  href: '#' },
        ].map(item => (
          item.id === 'out'
            ? <button key="out" className="mobile-nav-item" onClick={handleLogout} style={{ background: 'none', border: 'none' }}>
                <item.IconComp size={18} />
                <span>{item.label}</span>
              </button>
            : <Link key={item.id} href={item.href} className={`mobile-nav-item ${activeNav === item.id ? 'active' : ''}`} onClick={() => setActiveNav(item.id)}>
                <item.IconComp size={18} />
                <span>{item.label}</span>
              </Link>
        ))}
      </nav>
    </div>
  );
}
