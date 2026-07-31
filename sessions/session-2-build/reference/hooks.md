# Reference — Hooks

## What a Hook is

A **Hook** is an automatic checkpoint that runs *around* what Claude does — either **before** an action (to check, block, or add context) or **after** an action (to verify, redact, or log). You don't ask Claude to run a hook. Claude Code runs it for you, every single time the matching event happens.

Think of hooks as **the security guard and the proofreader** working in tandem:

- The security guard stands **before the door**. Nothing gets through unless it clears the check.
- The proofreader sits **after the desk**. Nothing goes out until it's read one more time.

Rules ask Claude to behave. Hooks make sure Claude actually does — because they run outside the model, in code you control.

## The two flavors

### Before hooks — the security guard

Run just before a tool call or an edit happens. Their job:

- **Check.** Is this action allowed? Does it match a policy?
- **Block.** If not, refuse the action and tell Claude why.
- **Add context.** Slip in extra info Claude should consider (e.g. "this file is production code — be careful").

Good examples:

- Block any command that starts with `rm -rf`.
- Refuse edits to `.env`, `secrets/`, or anything under `production/`.
- When Claude is about to open a URL, first strip anything in the path that looks like a prompt-injection attempt.

### After hooks — the proofreader

Run just after Claude completes a response, a tool call, or an edit. Their job:

- **Verify.** Did the output follow the rules? Did the code pass the linter?
- **Redact.** Strip API keys, PII, or internal IDs from what Claude just wrote.
- **Log.** Record what happened — for evals, audits, or debugging.

Good examples:

- After every response, run a regex that catches leaked credit-card numbers and redact them.
- After every code edit, run `npm test`; if it fails, tell Claude to fix it.
- After every session, append a summary line to a rolling log file.

## Where hooks live

In Claude Code, hooks are configured in a settings file (usually `.claude/settings.json`) at the project root. Each hook says: "**when** this event happens, **run** this small piece of code."

## Full example — a matched pair

**Scenario.** You're building a research agent that browses the web. You want two hooks: one that refuses to open blocked domains, and one that strips secrets from every response.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "WebFetch",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/block-if-denied-domain.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/redact-secrets.sh"
          }
        ]
      }
    ]
  }
}
```

In plain English:

- **Before every `WebFetch`**, run the domain-blocker script. If it exits non-zero, the fetch is refused and Claude is told why.
- **After every tool call** (that's what `*` means), run the redactor. It scans the output for anything that looks like an API key, GitHub token, or password and replaces it with `[REDACTED]` before Claude sees it.

The scripts themselves can be a few lines of bash or Python. The point is: the enforcement lives *outside* Claude, in code you control, running every time.

## Rules vs. hooks — when to use which

- **Rule:** "Never leak API keys." Guides Claude, but relies on Claude to comply.
- **Hook:** a regex that redacts API keys from every output. Runs whether Claude cooperates or not.

Rules are advisory. Hooks are enforcement. **Use both together** — rules teach the right behavior, hooks catch the times it slips.

## Try it live — a runnable example

There's a full playground you can run: **`../hooks-playground/`**. It wires up three hooks — a Bash blocker, a secrets protector, and a prompt logger.

See **`../hooks-playground/README.md`** and **`../hooks-playground/walkthrough.md`** for the install-and-trigger steps. In short:

1. `cd sessions/session-2-build/hooks-playground`
2. `claude`
3. Ask Claude to run `rm -rf /tmp/demo` and watch the hook block it.

**What to notice:**

- The block happens **outside the model**. Even if Claude *wanted* to run `rm -rf`, it couldn't — the enforcement lives in a shell script you control.
- Exit code `2` is the "block" signal. Exit `0` = allow. Anything else = a non-blocking warning.
- You can extend this by adding more patterns (`sudo`, `curl | sh`, `git push --force`, anything you don't want an autonomous agent doing).

## When to reach for a hook

- The rule keeps getting violated in edge cases.
- The check is mechanical (regex, exit code, file exists) — no reasoning needed.
- The stakes are high enough that "Claude usually gets it right" isn't good enough.

If any of those apply, write a hook.
