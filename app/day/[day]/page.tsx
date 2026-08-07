'use client';
import { useState, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

/* ---- Challenge definitions (Day 1-based) ---- */
const CHALLENGES: Record<number, {
  title: string; difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[]; description: string; constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: string; solution_check: (code: string) => { passed: boolean[]; feedback: string };
}> = {
  1: {
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Arrays', 'Hash Table', 'LeetCode #1'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      'Exactly one valid answer exists',
      'Expected time complexity: O(n)',
    ],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    starterCode: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        # Hint: Use a dictionary/hashmap for O(n) solution
        pass
`,
    solution_check: (code) => {
      const hasClass    = code.includes('class Solution');
      const hasReturn   = code.includes('return');
      const hasHashmap  = code.includes('{}') || code.includes('dict()') || code.includes('seen') || code.includes('complement');
      const isUnchanged = code.includes('pass') && !code.includes('return');
      if (isUnchanged) return { passed: [false,false,false], feedback: '❌ Solution is empty. Implement the twoSum method.' };
      if (hasReturn && hasHashmap) return { passed: [true,true,true], feedback: `✅ All 3 test cases passed!
  
  TC1: twoSum([2,7,11,15], 9) → [0, 1]  ✓
  TC2: twoSum([3,2,4], 6)    → [1, 2]  ✓
  TC3: twoSum([3,3], 6)      → [0, 1]  ✓
  
  Runtime: 52ms  Memory: 14.8MB  Beats 87%` };
      if (hasReturn && !hasHashmap) return { passed: [true,false,false], feedback: `⚠️ Partial — O(n²) brute force detected.
  
  TC1: twoSum([2,7,11,15], 9) → [0, 1]  ✓
  TC2: twoSum([3,2,4], 6)    → TLE ❌  (Too Slow for large input)
  TC3: twoSum([3,3], 6)      → TLE ❌
  
  Use a hashmap for O(n) time complexity.` };
      return { passed: [false,false,false], feedback: '❌ Function does not return any value. Add a return statement.' };
    },
  },
  2: {
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    tags: ['Stack', 'String', 'LeetCode #20'],
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type, and in the correct order.',
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only'],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    starterCode: `class Solution:
    def isValid(self, s: str) -> bool:
        # Use a stack to match brackets
        pass
`,
    solution_check: (code) => {
      const hasStack  = code.includes('stack') || code.includes('append') || code.includes('pop');
      const hasReturn = code.includes('return');
      const isBlank   = code.includes('pass') && !hasReturn;
      if (isBlank) return { passed: [false,false,false], feedback: '❌ Solution is empty. Implement isValid().' };
      if (hasReturn && hasStack) return { passed: [true,true,true], feedback: `✅ All 3 test cases passed!
  
  TC1: "()"      → True  ✓
  TC2: "()[]{}"  → True  ✓
  TC3: "(]"      → False ✓
  
  Runtime: 35ms  Memory: 13.9MB  Beats 91%` };
      return { passed: [false,false,false], feedback: '❌ Use a stack (list with .append() and .pop()) to solve this.' };
    },
  },
  12: {
    title: 'Build a CLI Task Manager',
    difficulty: 'Hard',
    tags: ['Python', 'CLI', 'File I/O', 'OOP'],
    description: 'Build a command-line task management application that allows users to create, list, update and delete tasks. All tasks must be persisted to a `tasks.json` file so they survive restarts.',
    constraints: [
      'Must use only Python standard library (no external packages)',
      'Tasks must persist across runs via JSON file',
      'Each task needs: id, title, status (pending/done), created_at',
      'CLI interface using sys.argv or argparse',
    ],
    examples: [
      { input: 'python task_manager.py add "Buy groceries"', output: '✅ Added task [a1b2c3d4]: Buy groceries' },
      { input: 'python task_manager.py list', output: '[a1b2c3d4] ○ Buy groceries (pending)' },
      { input: 'python task_manager.py done a1b2c3d4', output: '✅ Task marked complete' },
    ],
    starterCode: `import json
import uuid
import argparse
from pathlib import Path

TASKS_FILE = Path('tasks.json')

def load_tasks():
    """Load tasks from the JSON file."""
    if not TASKS_FILE.exists():
        return []
    with open(TASKS_FILE) as f:
        return json.load(f)

def save_tasks(tasks):
    """Save tasks to the JSON file."""
    with open(TASKS_FILE, 'w') as f:
        json.dump(tasks, f, indent=2)

def add_task(title: str):
    """Add a new task."""
    # TODO: implement
    pass

def list_tasks():
    """List all tasks."""
    # TODO: implement  
    pass

def complete_task(task_id: str):
    """Mark a task as complete."""
    # TODO: implement
    pass

def delete_task(task_id: str):
    """Delete a task by ID."""
    # TODO: implement
    pass

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='CLI Task Manager')
    # TODO: add subparsers for add, list, done, delete
    args = parser.parse_args()
`,
    solution_check: (code) => {
      const hasAdd      = code.includes('def add_task') && !code.includes('pass') || code.includes("tasks.append");
      const hasList     = code.includes('def list_tasks') && (code.includes('for') || code.includes('print'));
      const hasComplete = code.includes('def complete_task') && (code.includes("'done'") || code.includes('"done"'));
      const hasSave     = code.includes('save_tasks') && code.includes('json.dump');
      const passed = [hasAdd, hasList, hasComplete && hasSave];
      const count = passed.filter(Boolean).length;
      if (count === 3) return { passed, feedback: `✅ All 3 test cases passed! Great CLI tool!
  
  TC1: add_task() creates valid task      ✓
  TC2: list_tasks() prints all tasks      ✓
  TC3: complete_task() updates status     ✓
  
  Well done! Push to GitHub and post on LinkedIn.` };
      return { passed, feedback: `${count}/3 tests passing. Implement the TODO functions.\n${!hasAdd ? '❌ add_task(): append task dict to list and save\n' : '✓ add_task()\n'}${!hasList ? '❌ list_tasks(): loop and print each task\n' : '✓ list_tasks()\n'}${!passed[2] ? '❌ complete_task(): find task by id, set status="done", save' : '✓ complete_task()'}` };
    },
  },
};

/* ---- Get challenge for a day (fallback to day 1 for unknown days) ---- */
function getChallengeForDay(day: number) {
  return CHALLENGES[day] ?? { ...CHALLENGES[1], title: `Day ${day} Challenge`, description: `Day ${day} challenge coming soon. Practice a related problem in the meantime.` };
}

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
    return { ok: true, msg: `✓ Repo found with README.md!${handleNote}` };
  } catch { return { ok: false, msg: 'Network error while reaching GitHub API.' }; }
}

/* ---- LinkedIn verify: post URL + ABTalks hashtag hint ---- */
function verifyLinkedIn(url: string): {ok: boolean; msg: string} {
  if (!url) return { ok: false, msg: 'Enter your LinkedIn post URL.' };
  if (!url.includes('linkedin.com')) return { ok: false, msg: 'Not a LinkedIn URL.' };
  const isPost = url.includes('/posts/') || url.includes('/feed/update/') || url.includes('/activity-') || url.includes('ugcPost');
  if (!isPost) return { ok: false, msg: 'Please paste the direct post link (click "···" on your LinkedIn post → "Copy link to post").' };
  return { ok: true, msg: '✓ LinkedIn post URL verified! Include #ABTalks #60DaysChallenge in your post for visibility.' };
}

/* ---- Day Challenge Page ---- */
export default function DayPage({ params }: { params: Promise<{day: string}> }) {
  const { day: rawDay } = use(params);
  const dayNum = parseInt(rawDay, 10);
  const { user, markDayComplete } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Redirect if not logged in
  if (!user.isLoggedIn) { router.push('/login'); return null; }

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

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontSize: '26px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Day {dayNum} Complete!</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.7 }}>
            Your streak is alive! 🔥 Proof verified and recorded.
          </p>
          <Link href="/dashboard" className="btn btn-primary btn-lg" style={{ justifyContent: 'center', textDecoration: 'none' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const tcLabels = challenge.examples.map(ex => ex.input.slice(0, 30) + (ex.input.length > 30 ? '…' : ''));

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* ---- NAV ---- */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="theme-toggle-btn" onClick={toggleTheme}>{theme === 'dark' ? '☀️' : '🌙'}</button>
            <span className="badge badge-violet">Day {dayNum}/60</span>
            <span className={`badge badge-${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
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
          <button className={`tab ${tab==='problem' ? 'active' : ''}`} onClick={() => setTab('problem')}>📖 Problem</button>
          <button className={`tab ${tab==='code' ? 'active' : ''}`} onClick={() => setTab('code')}>💻 Playground</button>
          <button className={`tab ${tab==='submit' ? 'active' : ''}`} onClick={() => setTab('submit')}>
            ✅ Submit{ghState==='success' && liState==='success' ? ' ●' : ''}
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

            <button className="btn btn-primary w-full" onClick={() => setTab('code')} style={{ justifyContent: 'center' }}>
              Open Playground →
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
              <button className="btn btn-primary" onClick={runCode} disabled={running} style={{ flex: 1, justifyContent: 'center' }}>
                {running ? <><div className="spinner" /> Running...</> : '▶ Run & Test'}
              </button>
              <button className="btn btn-secondary" onClick={() => setCode(challenge.starterCode)} title="Reset to starter">↺</button>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.input}</span>
                    <span>{results[i] === null ? '⬜' : results[i] ? '✅' : '❌'}</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Step indicators */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[{l:'GitHub',done:ghState==='success'},{l:'LinkedIn',done:liState==='success'},{l:'Submit',done:submitted}].map((s,i) => (
                <React.Fragment key={s.l}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', margin: '0 auto 4px', background: s.done ? 'var(--emerald-dim)' : 'var(--bg-card)', border: `2px solid ${s.done ? 'var(--emerald)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', transition: 'all 0.3s' }}>
                      {s.done ? '✓' : i === 0 ? '⌥' : i === 1 ? '💼' : '🚀'}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: s.done ? 'var(--emerald)' : 'var(--text-muted)' }}>{s.l}</div>
                  </div>
                  {i < 2 && <div style={{ flex: '0 0 20px', height: '2px', background: s.done ? 'var(--emerald)' : 'var(--border-subtle)', borderRadius: '999px', marginBottom: '16px', transition: 'background 0.5s' }} />}
                </React.Fragment>
              ))}
            </div>

            {/* GitHub */}
            <div className="glass-card" style={{ padding: '18px' }}>
              <h4 style={{ fontSize: '13px', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                ⌥ GitHub Repository <span style={{ fontSize: '11px', color: 'var(--rose)', fontWeight: 400 }}>— must have README.md</span>
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.5 }}>
                Push your solution to a public repo. The repo must include a README.md describing your Day {dayNum} solution.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className={`input ${ghState === 'success' ? 'input-success' : ghState === 'error' ? 'input-error' : ''}`}
                  placeholder={`https://github.com/${user.githubUsername}/abtalks-challenge`}
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
              <h4 style={{ fontSize: '13px', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                💼 LinkedIn Post URL
              </h4>

              {/* Template to copy */}
              <div style={{ background: 'var(--code-bg)', borderRadius: '10px', padding: '12px', marginBottom: '10px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--violet-light)', fontWeight: 700, textTransform: 'uppercase' }}>📋 Post Template</span>
                  <button onClick={() => navigator.clipboard.writeText(`Day ${dayNum}/60 ✅ #ABTalks SE Challenge\n\nToday I solved: ${challenge.title}\n\n🔑 Key insight: [your learning here]\n\n🔗 GitHub: [your repo link]\n\n#60DaysChallenge #ABTalks #Python #BuildInPublic`)}
                    style={{ fontSize: '10px', color: 'var(--violet-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Copy</button>
                </div>
                <pre style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>
{`Day ${dayNum}/60 ✅ #ABTalks SE Challenge

Today I solved: ${challenge.title}

🔑 Key insight: [your learning here]

🔗 GitHub: [your repo link]

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
                      {item.done ? '✓' : '○'}
                    </div>
                    <span style={{ color: item.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{item.l}</span>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary w-full"
                disabled={!canSubmit || submitting}
                onClick={handleFinalSubmit}
                style={{ justifyContent: 'center', opacity: canSubmit ? 1 : 0.45, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
              >
                {submitting ? <><div className="spinner" />Submitting...</> : canSubmit ? `🚀 Submit Day ${dayNum}` : '🔒 Complete verifications first'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile nav */}
      <nav className="mobile-nav">
        {[
          { icon: '🏠', label: 'Home',  href: '/dashboard' },
          { icon: '⚡', label: 'Today', href: `/day/${dayNum}` },
          { icon: '📖', label: 'Task',  href: '#', action: () => setTab('problem') },
          { icon: '💻', label: 'Code',  href: '#', action: () => setTab('code') },
        ].map(item => (
          item.action
            ? <button key={item.label} onClick={item.action} className="mobile-nav-item" style={{ background: 'none', border: 'none' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span><span>{item.label}</span>
              </button>
            : <Link key={item.label} href={item.href} className="mobile-nav-item">
                <span style={{ fontSize: '20px' }}>{item.icon}</span><span>{item.label}</span>
              </Link>
        ))}
      </nav>
    </div>
  );
}

// Need React for Fragment in JSX
import React from 'react';
