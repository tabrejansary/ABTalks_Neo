'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import mockData from '@/data/mock.json';

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
      <div style={{ fontSize: '32px', color: color, lineHeight: 1, opacity: 0.6, fontFamily: 'var(--font-display)' }}>"</div>
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

/* ---- Track card (stylish LeetCode-style) ---- */
const TRACK_META = {
  SE: { icon: '⚙️', color: '#7C3AED', bg: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.25)', glow: 'rgba(124,58,237,0.3)' },
  DS: { icon: '📊', color: '#0891B2', bg: 'rgba(8,145,178,0.10)',  border: 'rgba(8,145,178,0.25)',  glow: 'rgba(8,145,178,0.3)' },
  AI: { icon: '🤖', color: '#D97706', bg: 'rgba(217,119,6,0.10)',  border: 'rgba(217,119,6,0.25)',  glow: 'rgba(217,119,6,0.3)' },
};

function TrackCard({ track }: { track: typeof mockData.tracks[0] }) {
  const { user } = useAuth();
  const m = TRACK_META[track.id as keyof typeof TRACK_META];
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
      {/* Gradient accent bar */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${m.color}, ${m.color}55)` }} />

      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: m.bg, border: `1px solid ${m.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
            {m.icon}
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
            ● {track.status === 'enrolling' ? 'Open' : 'Coming soon'}
          </span>
        </div>

        <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'var(--text-primary)' }}>{track.label}</h3>
        <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '16px' }}>{track.description}</p>

        {/* Skills pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {track.skills.map(s => (
            <span key={s} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px', background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>{s}</span>
          ))}
        </div>

        {/* Duration row */}
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
          {user.isLoggedIn ? 'Open Dashboard →' : 'Enroll Free →'}
        </Link>
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

      {/* ---- NAV ---- */}
      <nav className="navbar" style={{ background: scrolled ? 'var(--nav-bg)' : 'transparent', borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent' }}>
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">AB<span>Talks</span></Link>
          <div className="navbar-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {user.isLoggedIn ? (
              <Link href="/dashboard" className="btn btn-primary btn-sm">Dashboard →</Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                <Link href="/signup" className="btn btn-primary btn-sm">Enroll Free →</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ---- HERO ---- */}
      <section style={{ padding: '70px 20px 50px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--violet-dim)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '999px', padding: '6px 14px', marginBottom: '28px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--violet-light)', animation: 'streak-fire 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--violet-light)' }}>Now enrolling · Batch 4 · 10,000+ builders</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 8vw, 60px)', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '20px' }}>
          Code daily.<br />Ship publicly.<br />
          <Typewriter texts={['Get noticed.', 'Get hired.', 'Build consistency.', 'Prove your skills.']} />
        </h1>

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 32px', lineHeight: 1.65 }}>
          India&apos;s 60-day coding challenge for college students. One real challenge every day. Cross-verify GitHub commits and LinkedIn posts. Build proof of work.
        </p>

        {authWarn && (
          <div style={{ background: 'var(--rose-dim)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--rose)', padding: '10px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', animation: 'fade-in-up 0.3s ease' }}>
            🔒 Please enroll or sign in first to preview challenge days.
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={user.isLoggedIn ? '/dashboard' : '/signup'} className="btn btn-primary btn-lg">
            🚀 {user.isLoggedIn ? 'Open Dashboard' : 'Start Challenge — Free'}
          </Link>
          <Link href="/day/1" onClick={guardPreview} className="btn btn-secondary btn-lg">
            Preview Day 1 →
          </Link>
        </div>
      </section>

      {/* ---- STATS ---- */}
      <section style={{ padding: '0 20px 50px', maxWidth: '600px', margin: '0 auto' }}>
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', overflow: 'hidden' }}>
          {[
            { icon: '👥', val: mockData.stats.members,       suffix: '+', label: 'Members' },
            { icon: '🚀', val: mockData.stats.projects,       suffix: '+', label: 'Projects' },
            { icon: '💼', val: mockData.stats.hiringPartners, suffix: '+', label: 'Hiring Partners' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '20px 12px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                <AnimatedCounter end={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- TRACKS (LeetCode Style) ---- */}
      <section style={{ padding: '0 20px 60px', maxWidth: '600px', margin: '0 auto' }} id="tracks">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Choose Your Track</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>3 specializations. 60 days. One real transformation.</p>
        </div>
        <div style={{ display: 'grid', gap: '16px' }}>
          {mockData.tracks.map(track => <TrackCard key={track.id} track={track} />)}
        </div>
      </section>

      {/* ---- TESTIMONIALS (floating glass, not horizontal scroll) ---- */}
      <section style={{ padding: '0 20px 60px' }} id="testimonials">
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>What Our Builders Say</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Real stories from students across India</p>
        </div>

        {/* Masonry-style floating layout */}
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
            { step: '01', title: 'Enroll Free', desc: 'Choose your track — SE, Data Science, or AI. Get your unique login credentials.', icon: '📝' },
            { step: '02', title: 'Solve Daily Challenges', desc: 'One real task every day. Write code in our playground or your own editor.', icon: '💻' },
            { step: '03', title: 'Submit Proof of Work', desc: 'Push to GitHub + post on LinkedIn. Our system cross-verifies both.', icon: '✅' },
            { step: '04', title: 'Build Your Streak', desc: 'Maintain your streak. Use shields if you miss a day. Earn badges at milestones.', icon: '🔥' },
            { step: '05', title: 'Get Discovered', desc: 'Top streaks get featured. Hiring partners browse our builder profiles.', icon: '🎯' },
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '18px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0, background: 'var(--violet-dim)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                {item.icon}
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

        {/* Social links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {[
            { label: '📸 Instagram', href: 'https://www.instagram.com/abtalksonai/' },
            { label: '💼 LinkedIn',  href: 'https://www.linkedin.com/company/abtalks-on-ai/' },
            { label: '▶️ YouTube',   href: 'https://www.youtube.com/@ABTalksOnAI' },
            { label: '🐦 X / Twitter', href: 'https://x.com/abtalksonai' },
            { label: '💬 Discord',   href: 'https://discord.gg/j4Q8tvDj6' },
            { label: '📱 WhatsApp',  href: 'https://chat.whatsapp.com/K4VRi7NJHqJ7YE2jrOzRf8' },
          ].map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
            >
              {s.label}
            </a>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          For any issue or enquiry: <a href="mailto:team@abtalks.in" style={{ color: 'var(--violet-light)' }}>team@abtalks.in</a>
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>© 2026 ABTalks. Built for Indian college students.</p>
      </footer>
    </div>
  );
}
