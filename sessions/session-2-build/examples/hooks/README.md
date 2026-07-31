# Example — A Working Hook

This folder holds a runnable hook you can drop into any Claude Code project. It's the concrete companion to `../../reference/hooks.md`.

## What it does

A `PreToolUse` hook wired to the **Bash** tool. Every time Claude is about to run a shell command, the hook fires first and blocks the call if the command contains `rm -r` or `rm -rf`.

## Files

- **`settings.json`** — the wiring. Tells Claude Code "before every Bash tool call, run this script."
- **`block-dangerous-bash.sh`** — the enforcement. Reads the tool payload on stdin, greps for the dangerous pattern, and exits `2` to block.

## How to install it in a project

1. Copy `settings.json` into that project's `.claude/settings.json`.
2. Copy `block-dangerous-bash.sh` into that project's `.claude/hooks/block-dangerous-bash.sh`.
3. Make the script executable: `chmod +x .claude/hooks/block-dangerous-bash.sh`.
4. Restart Claude Code inside the project so it picks up the settings.

That's the whole install. There's no build step.

## How to trigger it

1. `cd` into the project you installed it into (a fresh test folder, or `projects/research-agent/` if you copied it there).
2. Start Claude Code: `claude`.
3. Ask Claude to run a dangerous command. Any of these will do:
   - *"Please run `rm -rf /tmp/demo` for me."*
   - *"Clean up the temp folder with `rm -r /tmp/foo`."*
4. Watch what happens:
   - Claude will try the Bash tool.
   - The hook fires **before** the shell command runs.
   - Exit code `2` blocks the call.
   - Claude sees the stderr message and reports the block back to you.
5. Sanity check with a safe command like *"list the files in /tmp"* (`ls /tmp`) — it goes through, so you know the hook is only blocking the dangerous shape, not everything.

## Key mechanics

- Exit **`0`** = allow. Exit **`2`** = block (stderr is fed back to Claude). Anything else = non-blocking warning.
- The script gets the full tool-call payload as JSON on stdin. Here we just `grep` the raw text — enough for a demo without needing `jq`.
- Enforcement lives **outside the model**. Even if Claude wanted to run `rm -rf`, it can't — the shell script controls the door.

## Extend it

- Add more dangerous patterns to the regex: `sudo`, `curl \| sh`, `git push --force`.
- Add more matchers to `settings.json` — e.g. a `PreToolUse` on `WebFetch` that blocks a domain denylist.
- Add a `PostToolUse` hook that redacts secrets from Claude's output.
