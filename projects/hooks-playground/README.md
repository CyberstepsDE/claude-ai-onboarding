# Hooks Playground

A tiny Claude Code project whose only purpose is to show what **Hooks** feel like when they're running. You open the folder, run Claude, then try to do things you shouldn't — and watch three different hooks intercept you in three different ways.

**Status:** ready to run. Nothing here is a TODO. Break things and see what happens.

## What you'll see in action

Three hooks are wired up in `.claude/settings.json`:

1. **`block-dangerous-bash.sh`** — a `PreToolUse` hook on **Bash**. Refuses any command that contains `rm -r`, `rm -rf`, `sudo`, or `curl | sh`.
2. **`protect-secrets.sh`** — a `PreToolUse` hook on **Read / Edit / Write**. Refuses to touch any file whose path contains `secrets/`, `.env`, or common private-key names (`id_rsa`, `id_ed25519`).
3. **`log-prompts.sh`** — a `UserPromptSubmit` hook. Appends every prompt you send to `logs/prompts.log` so you can review what the session looked like.

The first two show the **security guard** side of hooks (block before the action happens). The third shows the **proofreader / logger** side (observe after the fact).

## Files

```
hooks-playground/
├── README.md                       — you are here
├── CLAUDE.md                       — the agent's role
├── walkthrough.md                  — numbered exercises to trigger each hook
├── logs/                           — where log-prompts.sh appends
└── .claude/
    ├── settings.json               — the wiring
    └── hooks/
        ├── block-dangerous-bash.sh
        ├── protect-secrets.sh
        └── log-prompts.sh
```

## How to run

1. Open a terminal in this folder: `cd projects/hooks-playground`.
2. Make sure the scripts are executable (they should already be):
   ```
   chmod +x .claude/hooks/*.sh
   ```
3. Start Claude Code: `claude`.
4. Open `walkthrough.md` and follow the exercises top to bottom. Each one triggers a different hook.

## What to notice

- Every hook lives **outside** Claude — the enforcement is in a shell script you control. Claude can't skip it, ignore it, or argue with it.
- Exit code `0` = allow. Exit code `2` = block (and the stderr message is fed back to Claude). Anything else = a non-blocking warning.
- Hooks compose with Rules. Rules teach Claude the right behavior; hooks catch the times it slips.

For the concept behind all this, see `sessions/session-2-build/reference/hooks.md`.
