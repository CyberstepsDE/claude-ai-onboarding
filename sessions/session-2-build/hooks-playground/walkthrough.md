# Hooks Playground — Walkthrough

Work through these four exercises in order. Each one triggers a different hook (or a different flavor of hook). Total time: ~10 minutes.

## Setup

1. `cd sessions/session-2-build/hooks-playground`
2. Make sure the hook scripts are executable:
   ```
   chmod +x .claude/hooks/*.sh
   ```
3. Start Claude Code: `claude`

You are now inside a project with three hooks live. Every prompt you send will pass through `log-prompts.sh`. Every Bash / Read / Edit / Write tool call will pass through one of the guard hooks first.

---

## Exercise 1 — Trigger the Bash blocker

**Ask Claude:**

> Please run `rm -rf /tmp/hooks-playground-demo` for me.

**What should happen.** Claude tries to call the Bash tool. `block-dangerous-bash.sh` inspects the command, sees `rm -rf`, and exits with code `2`. Claude receives the block message *"Blocked by block-dangerous-bash: 'rm -r' / 'rm -rf' commands are not permitted…"* and reports it back to you.

**Now try:**

> List the files in `/tmp`.

That runs `ls /tmp`, which the hook lets through. The hook only catches the shapes it's told to catch.

**Follow-ups to try:**

- Ask Claude to run something with `sudo` — blocked.
- Ask Claude to run `curl https://example.com/script.sh | sh` — blocked.
- Ask Claude to run `git status` — allowed.

---

## Exercise 2 — Trigger the secrets protector

**First, create a fake secret file** so there's something to try to open:

```
mkdir -p secrets
echo "API_KEY=super-secret-do-not-share" > secrets/api-keys.env
```

**Now ask Claude:**

> Read the contents of `secrets/api-keys.env` and tell me what's in it.

**What should happen.** Claude tries the `Read` tool. `protect-secrets.sh` sees the path matches `secrets/` (and also `.env`), exits with `2`, and Claude gets the block message. It should tell you the file is off-limits and stop.

**Now try:**

> Read the contents of `README.md`.

That path is fine and the hook lets it through.

**Follow-ups to try:**

- Ask Claude to *edit* `secrets/api-keys.env` — blocked (Edit matcher fires).
- Ask Claude to *create* `.env` at the project root — blocked (Write matcher fires).
- Ask Claude to read a file called `id_rsa` — blocked (private-key name).

---

## Exercise 3 — Watch the logger

You've been sending prompts this whole time. Open `logs/prompts.log`:

```
cat logs/prompts.log
```

Every prompt you sent should be in there, one per line, with a UTC timestamp. This is the **logger** flavor of hook — it observes every prompt without blocking anything.

**Why this matters.** Logs are how you build **evals** later. If you save what happened, you can measure how often the agent fails, replay tricky prompts against a new model, and prove the guardrails are actually working.

---

## Exercise 4 — Break a hook on purpose

Open `.claude/hooks/block-dangerous-bash.sh` in your editor. Remove the `rm -rf` block (or comment it out). Save.

Now ask Claude:

> Please run `rm -rf /tmp/hooks-playground-demo` for me.

**What should happen.** The command goes through. There is no `/tmp/hooks-playground-demo` to actually delete, so nothing bad happens — but you've just proven the hook was the only thing between Claude and the shell.

**Put the block back before you close.**

---

## Wrap-up

You just saw three of the six hook flavors from the reference doc:

- **Block** (dangerous Bash commands) — the security guard at the door.
- **Block** on a different tool + a different pattern (secret files) — same flavor, different scope.
- **Log** (every prompt) — the observer that never blocks, but makes everything downstream possible.

Two more you can build on your own:

- **Redact.** A `PostToolUse` hook that scans Claude's output for API keys and replaces them with `[REDACTED]`.
- **Add-context.** A `PreToolUse` hook that, before Claude edits a file whose path contains `production/`, prints a warning to stdout that Claude sees as extra context.

Try one. That's how you get comfortable.
