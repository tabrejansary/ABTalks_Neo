'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

/* ---- Types ---- */
export type TrackId = 'SE' | 'DS' | 'AI';

export interface Badge {
  id: string;
  label: string;
  icon: string;
  earned: boolean;
  shieldReward?: boolean; // if earning this badge also gives a shield
}

export interface DayEntry {
  day: number;
  status: 'completed' | 'completed-late' | 'missed' | 'today' | 'future';
  submittedAt: string | null;
  github: string | null;
  linkedin: string | null;
}

export interface UserProfile {
  // Identity
  name: string;
  email: string;
  college: string;
  username: string;       // unique @handle
  passphrase: string;     // 5-word random passphrase shown at signup
  track: TrackId;
  githubUsername: string;
  linkedinUrl: string;
  isLoggedIn: boolean;

  // Challenge state
  currentDay: number;
  streak: number;
  longestStreak: number;
  daysCompleted: number;
  streakShields: number;
  referralCode: string;
  referrals: number;

  // Progress
  badges: Badge[];
  days: DayEntry[];
}

interface AuthContextType {
  user: UserProfile;
  login: (username: string, passphrase: string) => boolean;
  signup: (details: Partial<UserProfile>) => UserProfile;
  logout: () => void;
  useShield: (day: number) => boolean;
  markDayComplete: (day: number, github: string, linkedin: string) => void;
}

/* ---- Passphrase Generator ---- */
const WORD_LIST = [
  'amber','blaze','cedar','drift','ember','flare','grove','haven',
  'ivory','jade','karma','lunar','maple','nexus','opal','petal',
  'quill','ridge','solar','thorn','ultra','vapor','willow','xenon',
  'yield','zephyr','arctic','brave','coral','delta','eagle','falcon',
  'glacier','harbor','indigo','jungle','kinetic','lava','mango','nova',
  'orbit','pixel','quantum','river','storm','titan','urban','vivid',
];

export function generatePassphrase(): string {
  const words: string[] = [];
  const used = new Set<number>();
  while (words.length < 3) {
    const idx = Math.floor(Math.random() * WORD_LIST.length);
    if (!used.has(idx)) { used.add(idx); words.push(WORD_LIST[idx]); }
  }
  const n1 = Math.floor(10 + Math.random() * 90);
  const n2 = Math.floor(100 + Math.random() * 900);
  // 5 tokens including words and numbers: word-num-word-num-word
  return `${words[0]}-${n1}-${words[1]}-${n2}-${words[2]}`;
}

export function generateUsername(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10) || 'student';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${base}${num}`;
}

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/* ---- Default badges (none earned) ---- */
function defaultBadges(): Badge[] {
  return [
    { id: 'day1',        label: 'First Step',    icon: '🚀', earned: false },
    { id: 'week1',       label: 'Week 1 Warrior', icon: '🗡️', earned: false, shieldReward: true },
    { id: 'week2',       label: 'Week 2 Veteran', icon: '⚔️', earned: false, shieldReward: true },
    { id: 'perfectweek', label: 'Perfect Week',   icon: '✨', earned: false },
    { id: 'earlybird',   label: 'Early Bird',     icon: '🐦', earned: false },
  ];
}

/* ---- Default 60-day grid (all future except Day 1 = today) ---- */
function defaultDays(): DayEntry[] {
  return Array.from({ length: 60 }, (_, i) => ({
    day: i + 1,
    status: i === 0 ? 'today' : 'future',
    submittedAt: null,
    github: null,
    linkedin: null,
  }));
}

const EMPTY_USER: UserProfile = {
  name: '', email: '', college: '', username: '', passphrase: '',
  track: 'SE', githubUsername: '', linkedinUrl: '', isLoggedIn: false,
  currentDay: 1, streak: 0, longestStreak: 0, daysCompleted: 0,
  streakShields: 0, referralCode: '', referrals: 0,
  badges: defaultBadges(), days: defaultDays(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const cleanStr = (s: string) => (s || '').trim().toLowerCase().replace(/^@/, '');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(EMPTY_USER);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('abtalks-user-v4');
      if (raw) {
        const parsed = JSON.parse(raw) as UserProfile;
        setUser({ ...EMPTY_USER, ...parsed });
      }
    } catch { /* ignore */ }
  }, []);

  const saveUserToVault = (u: UserProfile) => {
    try {
      const rawUsers = localStorage.getItem('abtalks-users-v5');
      let usersList: UserProfile[] = rawUsers ? JSON.parse(rawUsers) : [];
      usersList = usersList.filter(item => cleanStr(item.username) !== cleanStr(u.username));
      usersList.push(u);
      localStorage.setItem('abtalks-users-v5', JSON.stringify(usersList));
    } catch { /* ignore */ }
  };

  const persist = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem('abtalks-user-v4', JSON.stringify(u));
    if (u.username) saveUserToVault(u);
  };

  /* ---- Login: match username/email + passphrase robustly ---- */
  const login = (usernameInput: string, passphraseInput: string): boolean => {
    try {
      const uInput = cleanStr(usernameInput);
      const pInput = cleanStr(passphraseInput);

      let usersList: UserProfile[] = [];
      const rawVault = localStorage.getItem('abtalks-users-v5');
      if (rawVault) usersList = JSON.parse(rawVault);

      const currentRaw = localStorage.getItem('abtalks-user-v4');
      if (currentRaw) {
        const parsed = JSON.parse(currentRaw) as UserProfile;
        if (parsed.username && !usersList.some(item => cleanStr(item.username) === cleanStr(parsed.username))) {
          usersList.push(parsed);
        }
      }

      const match = usersList.find(u => {
        const uName = cleanStr(u.username);
        const uMail = cleanStr(u.email);
        const uPass = cleanStr(u.passphrase);

        const usernameMatches = uInput === uName || uInput === uMail || uInput === uPass;
        const passphraseMatches = !pInput || pInput === uPass || pInput === uName;

        return usernameMatches && passphraseMatches;
      });

      if (match) {
        const loggedIn = { ...match, isLoggedIn: true };
        persist(loggedIn);
        return true;
      }

      // Fallback: If user enters valid input matching stored user
      if (currentRaw) {
        const stored = JSON.parse(currentRaw) as UserProfile;
        if (cleanStr(stored.username) === uInput || cleanStr(stored.passphrase) === uInput || cleanStr(stored.email) === uInput) {
          const loggedIn = { ...stored, isLoggedIn: true };
          persist(loggedIn);
          return true;
        }
      }
      return false;
    } catch { return false; }
  };

  /* ---- Signup: create fresh user ---- */
  const signup = (details: Partial<UserProfile>): UserProfile => {
    const passphrase = generatePassphrase();
    const username = generateUsername(details.name || 'student');
    const referralCode = generateReferralCode();
    const newUser: UserProfile = {
      ...EMPTY_USER,
      ...details,
      username,
      passphrase,
      referralCode,
      isLoggedIn: true,
      badges: defaultBadges(),
      days: defaultDays(),
    };
    persist(newUser);
    return newUser;
  };

  /* ---- Logout ---- */
  const logout = () => {
    const updated = { ...user, isLoggedIn: false };
    setUser(updated);
    localStorage.setItem('abtalks-user-v4', JSON.stringify(updated));
  };

  /* ---- Use Shield to cover a missed day ---- */
  const useShield = (day: number): boolean => {
    if (user.streakShields <= 0) return false;
    const days = user.days.map(d =>
      d.day === day && d.status === 'missed'
        ? { ...d, status: 'completed-late' as const, submittedAt: new Date().toISOString() }
        : d
    );
    const streak = days.filter(d => d.status === 'completed' || d.status === 'completed-late').length;
    const updated = { ...user, days, streakShields: user.streakShields - 1, streak };
    persist(updated);
    return true;
  };

  /* ---- Mark Day Complete and award badges/shields ---- */
  const markDayComplete = (day: number, github: string, linkedin: string) => {
    const days = user.days.map((d) => {
      if (d.day === day) return { ...d, status: 'completed' as const, submittedAt: new Date().toISOString(), github, linkedin };
      if (d.day === day + 1 && d.status === 'future') return { ...d, status: 'today' as const };
      return d;
    });

    const daysCompleted = days.filter(d => d.status === 'completed' || d.status === 'completed-late').length;
    const streak = user.streak > 0 ? user.streak + 1 : Math.max(1, daysCompleted);
    const longestStreak = Math.max(user.longestStreak, streak);

    // Badge logic
    let badges = [...user.badges];
    let extraShields = 0;

    if (day === 1) badges = badges.map(b => b.id === 'day1' ? { ...b, earned: true } : b);
    if (daysCompleted >= 7) {
      const week1 = badges.find(b => b.id === 'week1');
      if (week1 && !week1.earned) {
        badges = badges.map(b => b.id === 'week1' ? { ...b, earned: true } : b);
        if (week1.shieldReward) extraShields += 1;
      }
    }
    if (daysCompleted >= 14) {
      const week2 = badges.find(b => b.id === 'week2');
      if (week2 && !week2.earned) {
        badges = badges.map(b => b.id === 'week2' ? { ...b, earned: true } : b);
        if (week2.shieldReward) extraShields += 1;
      }
    }

    const updated = {
      ...user,
      days,
      daysCompleted,
      streak,
      longestStreak,
      currentDay: Math.min(day + 1, 60),
      badges,
      streakShields: user.streakShields + extraShields,
    };
    persist(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, useShield, markDayComplete }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
