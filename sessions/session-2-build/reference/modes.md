# Reference — Claude Code Modes (Cheatsheet)

Claude Code has three interactive modes. Cycle between them with **Shift+Tab**. Each one changes how much freedom Claude has and how often it stops to ask you.

## Plan Mode

- **What it does.** Read-only. Claude can look at files and think, but it cannot edit anything or run commands until you approve a plan.
- **What Claude produces.** A written plan describing what it *would* do.
- **Best for.** Anything unfamiliar, high-stakes, or in production. Also the safest mode for teaching — the group can see the plan before anyone commits.
- **Vibe.** "Show me the blueprint before you pick up the hammer."

## Default Mode

- **What it does.** Claude edits files and runs commands, but asks you before each one.
- **Best for.** Everyday development. You stay in the loop, but you're not blocked reading plans.
- **Vibe.** "Ask me first, then go."

## Auto-accept Edits Mode

- **What it does.** Claude edits files without asking. It still asks before running other commands (shell, tests, etc.).
- **Best for.** Rapid iteration when you trust the direction — refactors, doc changes, big rewrites where clicking "yes" 200 times would waste the session.
- **Vibe.** "You have the pen. I'll grab it back if I need to."

## Which mode should a beginner live in?

**Plan Mode.** Always start there. Read Claude's plan, edit anything you disagree with, then flip to Default (or Auto-accept edits) to run. Coming back to Plan Mode between big tasks is a healthy habit even for experienced users.

## ⚠️ Bypass mode

There's a fourth, dangerous mode that skips almost all confirmations. **Do not use it outside a disposable sandbox.** It's meant for isolated environments (containers, ephemeral VMs) where mistakes can't cause real damage. It has no place in this course.

## One-line takeaway

**Beginners live in Plan Mode.** Everything else is a choice you make deliberately, task by task.
