'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import mockData from '@/data/mock.json';
import {
  SettingsIcon,
  SunIcon,
  MoonIcon,
  MapIcon,
  HomeIcon,
  KeyIcon,
  FileTextIcon,
  DashboardIcon,
  ZapIcon,
  LockIcon,
  RocketIcon,
  ArrowRightIcon,
  UsersIcon,
  BriefcaseIcon,
  CodeIcon,
  BarChartIcon,
  CpuIcon,
  CheckCircleIcon,
  FlameIcon,
  TrophyIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  TwitterIcon,
  DiscordIcon,
  WhatsAppIcon,
  CloseIcon,
} from '@/app/icons';

/* ---- Animated Counter ---- */
function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - t0) / 1500, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ---- Typewriter ---- */
function Typewriter({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing');
  useEffect(() => {
    const target = texts[idx];
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'typing') {
      if (shown.length < target.length) t = setTimeout(() => setShown(target.slice(0, shown.length + 1)), 65);
      else t = setTimeout(() => setPhase('pause'), 1800);
    } else if (phase === 'pause') {
      t = setTimeout(() => setPhase('deleting'), 200);
    } else {
      if (shown.length > 0) t = setTimeout(() => setShown(shown.slice(0, -1)), 35);
      else { setIdx(i => (i + 1) % texts.length); setPhase('typing'); }
    }
    return () => clearTimeout(t);
  }, [shown, phase, idx, texts]);
  return <span className="gradient-text">{shown}<span style={{ opacity: phase === 'pause' ? 1 : 0.7 }}>|</span></span>;
}

/* ---- Floating Testimonial Card ---- */
function TestimonialCard({ t, index }: { t: typeof mockData.testimonials[0]; index: number }) {
  const trackColors: Record<string, string> = { SE: '#7C3AED', DS: '#0891B2', AI: '#D97706' };
  const color = trackColors[t.track] || '#7C3AED';
  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        flex: '0 0 300px',
        scrollSnapAlign: 'start',
        animation: `fade-in-up 0.5s ease ${index * 0.07}s both`,
      }}
    >
      <div style={{ fontSize: '32px', color: color, lineHeight: 1, opacity: 0.6, fontFamily: 'var(--font-display)' }}>&ldquo;</div>
      <p style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--text-secondary)', flex: 1 }}>{t.quote}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${color}, ${color}88)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)',
        }}>{t.name[0]}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '13px' }}>{t.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.college}</div>
        </div>
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', background: `${color}18`, color, border: `1px solid ${color}44` }}>{t.track}</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Track card ---- */
const TRACK_META = {
  SE: { IconComponent: CodeIcon, color: '#7C3AED', bg: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.25)', glow: 'rgba(124,58,237,0.3)' },
  DS: { IconComponent: BarChartIcon, color: '#0891B2', bg: 'rgba(8,145,178,0.10)',  border: 'rgba(8,145,178,0.25)',  glow: 'rgba(8,145,178,0.3)' },
  AI: { IconComponent: CpuIcon, color: '#D97706', bg: 'rgba(217,119,6,0.10)',  border: 'rgba(217,119,6,0.25)',  glow: 'rgba(217,119,6,0.3)' },
};

function TrackCard({ track }: { track: typeof mockData.tracks[0] }) {
  const { user } = useAuth();
  const m = TRACK_META[track.id as keyof typeof TRACK_META];
  const IconComp = m.IconComponent;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '20px',
        border: `1px solid ${hovered ? m.color : 'var(--border-subtle)'}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? `0 20px 50px ${m.glow}` : 'none',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
      }}
    >
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${m.color}, ${m.color}55)` }} />
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: m.bg, border: `1px solid ${m.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComp size={26} color={m.color} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
            ● {track.status === 'enrolling' ? 'Open' : 'Coming soon'}
          </span>
        </div>
        <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'var(--text-primary)' }}>{track.label}</h3>
        <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '16px' }}>{track.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {track.skills.map(s => (
            <span key={s} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px', background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>{s}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          {[['60', 'Days'], ['1', 'Task/day'], ['0₹', 'Cost']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-display)', color: m.color }}>{val}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{lbl}</div>
            </div>
          ))}
        </div>
        <Link
          href={user.isLoggedIn ? '/dashboard' : '/signup'}
          className="btn btn-primary w-full"
          style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)`, textDecoration: 'none', justifyContent: 'center' }}
        >
          {user.isLoggedIn ? 'Open Dashboard' : 'Enroll Free'}
          <ArrowRightIcon size={14} />
        </Link>
      </div>
    </div>
  );
}

/* ---- Settings Modal (auth-aware Route Map) ---- */
function SettingsModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [daysExpanded, setDaysExpanded] = useState(false);

  // Days the user has completed (status = completed or completed-late)
  const completedDays = user.isLoggedIn
    ? user.days.filter(d => d.status === 'completed' || d.status === 'completed-late' || d.status === 'today').map(d => d.day).sort((a, b) => a - b)
    : [];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card" style={{ padding: '24px', maxWidth: '420px', width: '100%', borderRadius: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <CloseIcon size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <SettingsIcon size={20} color="var(--violet-light)" />
          <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Preferences &amp; Settings</h3>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Theme applies globally across all pages.</p>

        {/* Theme Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Appearance Theme</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              Current: {theme === 'dark' ? <><MoonIcon size={12} color="var(--violet-light)" /> Dark Mode</> : <><SunIcon size={12} color="var(--amber)" /> Light Mode</>}
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={toggleTheme} style={{ gap: '6px' }}>
            {theme === 'dark' ? <><SunIcon size={14} /> Light</> : <><MoonIcon size={14} /> Dark</>}
          </button>
        </div>

        {/* Route Map — different for guest vs logged-in */}
        <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
            <MapIcon size={14} color="var(--violet-light)" />
            Route Map
          </div>

          {/* Always-visible public routes */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Public Pages</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link href="/" onClick={onClose} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', fontSize: '12px', gap: '8px' }}>
                <HomeIcon size={14} color="var(--text-muted)" />
                <span><span style={{ fontFamily: 'var(--font-mono)' }}>/</span> &mdash; Home</span>
              </Link>
              {!user.isLoggedIn && (
                <>
                  <Link href="/login" onClick={onClose} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', fontSize: '12px', gap: '8px' }}>
                    <KeyIcon size={14} color="var(--text-muted)" />
                    <span><span style={{ fontFamily: 'var(--font-mono)' }}>/login</span> &mdash; Sign In</span>
                  </Link>
                  <Link href="/signup" onClick={onClose} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', fontSize: '12px', gap: '8px' }}>
                    <FileTextIcon size={14} color="var(--text-muted)" />
                    <span><span style={{ fontFamily: 'var(--font-mono)' }}>/signup</span> &mdash; Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Auth-only routes */}
          {user.isLoggedIn ? (
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--violet-light)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Your Pages</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Link href="/dashboard" onClick={onClose} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', fontSize: '12px', gap: '8px' }}>
                  <DashboardIcon size={14} color="var(--violet-light)" />
                  <span><span style={{ fontFamily: 'var(--font-mono)' }}>/dashboard</span> &mdash; Your Dashboard</span>
                </Link>

                {/* Expandable challenge days */}
                <button
                  onClick={() => setDaysExpanded(p => !p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'space-between',
                    padding: '6px 12px', borderRadius: '10px', background: 'var(--violet-dim)',
                    border: '1px solid rgba(124,58,237,0.25)', color: 'var(--violet-light)',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer', width: '100%',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ZapIcon size={14} /> Challenge Days ({completedDays.length} unlocked)
                  </span>
                  <span style={{ fontSize: '10px', transition: 'transform 0.2s', transform: daysExpanded ? 'rotate(180deg)' : 'none' }}>▾</span>
                </button>

                {daysExpanded && (
                  <div style={{
                    marginLeft: '12px', marginTop: '4px',
                    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px',
                    padding: '10px', borderRadius: '10px',
                    background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                    maxHeight: '200px', overflowY: 'auto',
                  }}>
                    {completedDays.length === 0 ? (
                      <div style={{ gridColumn: '1/-1', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '8px' }}>
                        No days submitted yet. Start Day 1!
                      </div>
                    ) : (
                      completedDays.map(day => (
                        <Link
                          key={day}
                          href={`/day/${day}`}
                          onClick={onClose}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            height: '34px', borderRadius: '8px',
                            background: 'var(--violet-dim)', border: '1px solid rgba(124,58,237,0.25)',
                            color: 'var(--violet-light)', fontSize: '11px', fontWeight: 700,
                            textDecoration: 'none', transition: 'all 0.15s',
                          }}
                        >
                          {day}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Not logged in: hint to login */
            <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', marginTop: '8px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LockIcon size={14} color="var(--violet-light)" /> Sign in to access your dashboard and challenge day routes.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/login" onClick={onClose} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '11px' }}>Sign In</Link>
                <Link href="/signup" onClick={onClose} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '11px' }}>Register</Link>
              </div>
            </div>
          )}
        </div>

        <button className="btn btn-primary w-full" onClick={onClose} style={{ justifyContent: 'center' }}>
          Done
        </button>
      </div>
    </div>
  );
}

/* ---- MAIN LANDING PAGE ---- */
export default function LandingPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [authWarn, setAuthWarn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const guardPreview = (e: React.MouseEvent) => {
    if (!user.isLoggedIn) { e.preventDefault(); setAuthWarn(true); setTimeout(() => setAuthWarn(false), 4000); }
  };

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* ---- NAV ---- */}
      <nav className="navbar" style={{ background: scrolled ? 'var(--nav-bg)' : 'transparent', borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent' }}>
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">AB<span>Talks</span></Link>
          <div className="navbar-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowSettings(true)} style={{ gap: '6px' }}>
              <SettingsIcon size={14} /> Settings
            </button>
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <SunIcon size={16} color="var(--amber)" /> : <MoonIcon size={16} color="var(--violet-light)" />}
            </button>
            {user.isLoggedIn ? (
              <Link href="/dashboard" className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                Dashboard <ArrowRightIcon size={14} />
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                <Link href="/signup" className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                  Enroll Free <ArrowRightIcon size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ---- HERO ---- */}
      <section style={{ padding: '70px 20px 50px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--violet-dim)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '999px', padding: '6px 14px', marginBottom: '28px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--violet-light)', animation: 'streak-fire 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--violet-light)' }}>Now enrolling &middot; Batch 4 &middot; 10,000+ builders</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 8vw, 60px)', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '20px' }}>
          Code daily.<br />Ship publicly.<br />
          <Typewriter texts={['Get noticed.', 'Get hired.', 'Build consistency.', 'Prove your skills.']} />
        </h1>

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 32px', lineHeight: 1.65 }}>
          India&apos;s 60-day coding challenge for college students. One real challenge every day. Cross-verify GitHub commits and LinkedIn posts. Build proof of work.
        </p>

        {authWarn && (
          <div style={{ background: 'var(--rose-dim)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--rose)', padding: '10px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', animation: 'fade-in-up 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <LockIcon size={16} color="var(--rose)" /> Please enroll or sign in first to preview challenge days.
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={user.isLoggedIn ? '/dashboard' : '/signup'} className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
            <RocketIcon size={18} /> {user.isLoggedIn ? 'Open Dashboard' : 'Start Challenge — Free'}
          </Link>
          <Link href="/day/1" onClick={guardPreview} className="btn btn-secondary btn-lg" style={{ gap: '8px' }}>
            Preview Day 1 <ArrowRightIcon size={16} />
          </Link>
        </div>

        {/* Welcome back pill for logged-in users */}
        {user.isLoggedIn && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px',
            padding: '8px 16px', borderRadius: '999px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
          }}>
            <FlameIcon size={16} color="var(--amber)" />
            <span style={{ fontSize: '13px', color: 'var(--emerald)', fontWeight: 600 }}>
              Welcome back, {user.name.split(' ')[0]}! Streak: {user.streak} days
            </span>
          </div>
        )}
      </section>

      {/* ---- STATS ---- */}
      <section style={{ padding: '0 20px 50px', maxWidth: '600px', margin: '0 auto' }}>
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', overflow: 'hidden' }}>
          {[
            { IconComp: UsersIcon, color: 'var(--violet-light)', val: mockData.stats.members,       suffix: '+', label: 'Members' },
            { IconComp: RocketIcon, color: 'var(--cyan-light)', val: mockData.stats.projects,       suffix: '+', label: 'Projects' },
            { IconComp: BriefcaseIcon, color: 'var(--amber)', val: mockData.stats.hiringPartners, suffix: '+', label: 'Hiring Partners' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '20px 12px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <s.IconComp size={24} color={s.color} />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                <AnimatedCounter end={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- TRACKS ---- */}
      <section style={{ padding: '0 20px 60px', maxWidth: '600px', margin: '0 auto' }} id="tracks">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Choose Your Track</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>3 specializations. 60 days. One real transformation.</p>
        </div>
        <div style={{ display: 'grid', gap: '16px' }}>
          {mockData.tracks.map(track => <TrackCard key={track.id} track={track} />)}
        </div>
      </section>

      {/* ---- TESTIMONIALS ---- */}
      <section style={{ padding: '0 20px 60px' }} id="testimonials">
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>What Our Builders Say</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Real stories from students across India</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {mockData.testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section style={{ padding: '0 20px 60px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-display)' }}>How It Works</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { step: '01', title: 'Enroll Free', desc: 'Choose your track — SE, Data Science, or AI. Get your unique login credentials.', IconComp: FileTextIcon, color: 'var(--violet-light)' },
            { step: '02', title: 'Solve Daily Challenges', desc: 'One real task every day. Write code in our playground or your own editor.', IconComp: CodeIcon, color: 'var(--cyan-light)' },
            { step: '03', title: 'Submit Proof of Work', desc: 'Push to GitHub + post on LinkedIn. Our system cross-verifies both.', IconComp: CheckCircleIcon, color: 'var(--emerald)' },
            { step: '04', title: 'Build Your Streak', desc: 'Maintain your streak. Use shields if you miss a day. Earn badges at milestones.', IconComp: FlameIcon, color: 'var(--amber)' },
            { step: '05', title: 'Get Discovered', desc: 'Top streaks get featured. Hiring partners browse our builder profiles.', IconComp: TrophyIcon, color: 'var(--violet-light)' },
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '18px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0, background: 'var(--violet-dim)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.IconComp size={22} color={item.color} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--violet-light)', fontFamily: 'var(--font-mono)' }}>{item.step}</span>
                  <h4 style={{ fontSize: '15px', fontFamily: 'var(--font-display)' }}>{item.title}</h4>
                </div>
                <p style={{ fontSize: '13px', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '40px 20px 30px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', marginBottom: '20px' }}>
          AB<span className="gradient-text">Talks</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {[
            { label: 'Instagram', href: 'https://www.instagram.com/abtalksonai/', IconComp: InstagramIcon },
            { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/abtalks-on-ai/', IconComp: LinkedinIcon },
            { label: 'YouTube',   href: 'https://www.youtube.com/@ABTalksOnAI', IconComp: YoutubeIcon },
            { label: 'X / Twitter', href: 'https://x.com/abtalksonai', IconComp: TwitterIcon },
            { label: 'Discord',   href: 'https://discord.gg/j4Q8tvDj6', IconComp: DiscordIcon },
            { label: 'WhatsApp',  href: 'https://chat.whatsapp.com/K4VRi7NJHqJ7YE2jrOzRf8', IconComp: WhatsAppIcon },
          ].map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              title={s.label}
              aria-label={s.label}
              style={{ width: '40px', height: '40px', borderRadius: '50%', textDecoration: 'none' }}
            >
              <s.IconComp size={18} />
            </a>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          For any issue or enquiry: <a href="mailto:team@abtalks.in" style={{ color: 'var(--violet-light)' }}>team@abtalks.in</a>
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>&copy; 2026 ABTalks. Built for Indian college students.</p>
      </footer>
    </div>
  );
}
