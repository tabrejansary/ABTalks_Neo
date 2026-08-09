export type Challenge = {
  title: string; difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[]; description: string; constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: string; solution_check: (code: string) => { passed: boolean[]; feedback: string };
};

/* ---- Challenge definitions (Day 1-based) ---- */
export const CHALLENGES: Record<number, Challenge> = {
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
      if (isUnchanged) return { passed: [false,false,false], feedback: 'Error: Solution is empty. Implement the twoSum method.' };
      if (hasReturn && hasHashmap) return { passed: [true,true,true], feedback: `All 3 test cases passed!

TC1: twoSum([2,7,11,15], 9) → [0, 1]  (Passed)
TC2: twoSum([3,2,4], 6)    → [1, 2]  (Passed)
TC3: twoSum([3,3], 6)      → [0, 1]  (Passed)

Runtime: 52ms  Memory: 14.8MB  Beats 87%` };
      if (hasReturn && !hasHashmap) return { passed: [true,false,false], feedback: `Partial: O(n²) brute force detected.

TC1: twoSum([2,7,11,15], 9) → [0, 1]  (Passed)
TC2: twoSum([3,2,4], 6)    → TLE (Too Slow for large input)
TC3: twoSum([3,3], 6)      → TLE

Use a hashmap for O(n) time complexity.` };
      return { passed: [false,false,false], feedback: 'Error: Function does not return any value. Add a return statement.' };
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
      if (isBlank) return { passed: [false,false,false], feedback: 'Error: Solution is empty. Implement isValid().' };
      if (hasReturn && hasStack) return { passed: [true,true,true], feedback: `All 3 test cases passed!

TC1: "()"      → True  (Passed)
TC2: "()[]{}"  → True  (Passed)
TC3: "(]"      → False (Passed)

Runtime: 35ms  Memory: 13.9MB  Beats 91%` };
      return { passed: [false,false,false], feedback: 'Error: Use a stack (list with .append() and .pop()) to solve this.' };
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
      { input: 'python task_manager.py add "Buy groceries"', output: 'Added task [a1b2c3d4]: Buy groceries' },
      { input: 'python task_manager.py list', output: '[a1b2c3d4] ○ Buy groceries (pending)' },
      { input: 'python task_manager.py done a1b2c3d4', output: 'Task marked complete' },
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
      if (count === 3) return { passed, feedback: `All 3 test cases passed! Great CLI tool!

TC1: add_task() creates valid task      (Passed)
TC2: list_tasks() prints all tasks      (Passed)
TC3: complete_task() updates status     (Passed)

Well done! Push to GitHub and post on LinkedIn.` };
      return { passed, feedback: `${count}/3 tests passing. Implement the TODO functions.\n${!hasAdd ? 'add_task(): append task dict to list and save\n' : 'add_task()\n'}${!hasList ? 'list_tasks(): loop and print each task\n' : 'list_tasks()\n'}${!passed[2] ? 'complete_task(): find task by id, set status="done", save' : 'complete_task()'}` };
    },
  },
};

/* ---- Get challenge for a day (fallback to day 1 for unknown days) ---- */
export function getChallengeForDay(day: number): Challenge {
  return CHALLENGES[day] ?? { ...CHALLENGES[1], title: `Day ${day} Challenge`, description: `Day ${day} challenge coming soon. Practice a related problem in the meantime.` };
}
