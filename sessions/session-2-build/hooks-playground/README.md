# Hooks Playground

A tiny project that shows what **Hooks** feel like. Open it, run Claude, try to do things you shouldn't — watch hooks step in.

**Status:** ready to run. No TODOs.

## The three hooks

| Hook script | Fires on | What it does |
|---|---|---|
| `block-dangerous-bash.sh` | Every **Bash** tool call | Blocks `rm -r`, `rm -rf`, `sudo`, `curl \| sh`. |
| `protect-secrets.sh` | Every **Read / Edit / Write** | Blocks paths with `secrets/`, `.env`, `id_rsa`, `id_ed25519`. |
| `log-prompts.sh` | Every **user prompt** | Appends the prompt + timestamp to `logs/prompts.log`. Never blocks. |

## Example — trigger #1

You: *"Please run `rm -rf /tmp/demo`."*

Claude tries the Bash tool → hook fires → exit `2` → Claude gets back:
```
Blocked by block-dangerous-bash: 'rm -r' / 'rm -rf' commands are not permitted in this project.
```
Claude relays the block to you. The shell never sees the command.

## Files

```
hooks-playground/
├── README.md          ← you are here
├── CLAUDE.md          ← the agent's role
├── walkthrough.md     ← four exercises, one per hook flavor
├── logs/              ← where log-prompts.sh appends
└── .claude/
    ├── settings.json  ← the wiring
    └── hooks/
        ├── block-dangerous-bash.sh
        ├── protect-secrets.sh
        └── log-prompts.sh
```

## Run it

```
cd sessions/session-2-build/hooks-playground
chmod +x .claude/hooks/*.sh    # already set, harmless to repeat
claude
```

Then open `walkthrough.md` and go through the four exercises.

## Cheat sheet

- Exit **0** = allow. Exit **2** = block. Anything else = non-blocking warning.
- Enforcement lives **outside** Claude, in shell scripts you control.
- Concept lives in `../reference/hooks.md`.
